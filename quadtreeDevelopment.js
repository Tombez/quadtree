var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.translate(256, 256);

var map = new Quadtree(2 ** 8, 1);
var nodes = [];

/*canvas.addEventListener("click", function(event) {

});*/
window.addEventListener("contextmenu", function(event) {
	if (!window.contextmenuOut) {
		var context = event.target.dataset.contextmenu;
		if (context != null) {
			var menu = document.getElementById(context);
			if (menu) {
				event.preventDefault();
				menu.event = event;
				window.contextmenuOut = menu;

				menu.style.left = event.clientX + "px";
				menu.style.top = event.clientY + "px";
				menu.style.display = "block";
			}
		}
	} else {
		window.contextmenuOut.style.display = "none";
		window.contextmenuOut = null;
		event.preventDefault();
	}
});
function contextmenuSelect(event) {
	if (event.target.dataset.onclick) {
		window[event.target.dataset.onclick](window.contextmenuOut.event);
		
		window.contextmenuOut.style.display = "none";
		window.contextmenuOut = null;
	}
}

function draw() {
	ctx.fillStyle = "black";
	ctx.fillRect(0-256, 0-256, canvas.width-256, canvas.height-256);

	ctx.beginPath();
	ctx.strokeStyle = "white";
	drawAllBoxes(map.root);
	ctx.stroke();

	ctx.beginPath();
	ctx.fillStyle = "red";
	for (var n = 0; n < nodes.length; n++) {
		var node = nodes[n];
		ctx.moveTo(node.x, node.y);
		ctx.arc(node.x, node.y, 4, 0, 2 * Math.PI);
	}
	ctx.fill();
}
draw();

function drawBox(box) {
	ctx.moveTo(box.x, box.y);
	ctx.lineTo(box.size*2 + box.x, box.y);
	ctx.lineTo(box.size*2 + box.x, box.size*2 + box.y);
	ctx.lineTo(box.x, box.size*2 + box.y);
	ctx.lineTo(box.x, box.y);
}

function drawAllBoxes(box) {
	drawBox(box);
	var branches = box.branches;
	if (branches) {
		for (var y = 0; y < 2; y++) {
			for (var x = 0; x < 2; x++) {
				drawAllBoxes(branches[x][y]);
			}
		}
	}
}

function getNode(event) {
	return {x: event.clientX-256, y: event.clientY-256};
}

function addPoint(event) {
	var node = getNode(event);
	nodes.push(node);
	map.insert(node);
	draw();
}
function add64Random(event) {
	var node;
	//var start = (new Date()).getTime();
	for(var n = 0; n < 2 ** 6; n++) {
		node = {x: ~~(Math.random()*513)-256, y: ~~(Math.random()*513)-256};
		nodes.push(node);
		map.insert(node);
	}
	//console.log((new Date()).getTime() - start);
	draw();
}
function highlightBox(event) {
	var box = map.root.highestBranch(getNode(event));
	ctx.beginPath();
	ctx.strokeStyle = "blue";
	drawBox(box); drawBox(box); drawBox(box); drawBox(box);
	ctx.stroke();
}
/*function removePoint(event) {

}*/