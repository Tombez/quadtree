import Circle from "./Circle.js";
import QuadTreeA from "./QuadTreeA.js";
import QuadTreeC from "./QuadTreeC.js";
import LooseQuadTree, {Tuple} from "./LooseQuadTree.js";
import LooseQuadTreeB from "./LooseQuadTreeB.js";

const QuadTree = LooseQuadTree;

const WIDTH = 800;
const HEIGHT = 800;
const OBJECTS = 5000;
const MIN_RADIUS = 2.0;
const MAX_RADIUS = 10.0;
const MAX_BRANCH_OBJECTS = 15;
const PROFILE_NUM = 1;

Math.TAU = Math.PI * 2;

let canvas;
let ctx;
let myQT;
let objects;

const rand = (min, max, modi = a => a) => {
	return modi(Math.random()) * (max - min) + min;
};

const drawQT = () => {
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#fff";
	ctx.globalAlpha = 0.2;
	let stack = [myQT];
	let aabb;
	while (aabb = stack.pop()) {
		ctx.moveTo(aabb.x, aabb.y);
		ctx.rect(aabb.x, aabb.y, aabb.w, aabb.h);
		if (aabb.hasSplit) {
			stack.push(...aabb.children);
		}
	}
	ctx.stroke();
	ctx.globalAlpha = 1;
};
const drawCircles = () => {
	ctx.beginPath();
	ctx.fillStyle = "#f00";
	ctx.strokeStyle = "#f0f";
	ctx.globalAlpha = 0.3;
	for (const c of objects) {
		ctx.moveTo(c.x + c.r, c.y);
		ctx.arc(c.x, c.y, c.r, 0, Math.TAU);
	}
	ctx.fill();
	ctx.globalAlpha = 1;
};
const draw = () => {
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	drawCircles();
	drawQT();
};
const drawB = () => {
	window.arg = {};
	let drawn = [];
	// clear canvas
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.lineWidth = 1;
	let stack = [new Tuple(myQT, 0)];
	let tup;
	while (tup = stack.pop()) {
		let aabb = tup.left;
		let depth = tup.right;
		ctx.globalAlpha = 0.7;
		for (const c of aabb.objects) {
			drawn.push(c);
			ctx.beginPath();
			ctx.fillStyle = `hsl(${depth / 10 * 120}, 100%, 50%)`;
			// ctx.fillStyle = "#fff";
			if (window.arg[depth]) ++window.arg[depth];
			else window.arg[depth] = 1;
			ctx.moveTo(c.x + c.r, c.y);
			ctx.arc(c.x, c.y, c.r, 0, Math.TAU);
			ctx.fill();
		}
		// ctx.strokeStyle = `hsl(${depth / 10 * 120}, 100%, 50%)`;
		ctx.strokeStyle = "#fff";
		ctx.globalAlpha = 0.3;
		ctx.strokeRect(aabb.x, aabb.y, aabb.w, aabb.h);
		ctx.globalAlpha = 1;
		if (aabb.hasSplit) {
			for (const child of aabb.children) {
				stack.push(new Tuple(child, depth + 1));
			}
		}
	}
	console.log(window.arg);
};
const init = () => {
	canvas = document.getElementById("canvas");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	ctx = canvas.getContext("2d");
	// myQT = new QuadTree(0, 0, WIDTH, HEIGHT, MAX_BRANCH_OBJECTS);
	objects = [];
	for (let i = 0; i < OBJECTS; ++i) {
		const c = new Circle(rand(0, WIDTH), rand(0, HEIGHT),
			rand(MIN_RADIUS, MAX_RADIUS, a => (1 - a ** (1/5)) * 1.2));
		objects.push(c);
	}
	const start = performance.now();
	for (let n = 0; n < PROFILE_NUM; ++n) {
		myQT = new QuadTree(0, 0, WIDTH, HEIGHT, MAX_BRANCH_OBJECTS);
		for (let i = 0; i < objects.length; ++i) {
			myQT.insertCircle(objects[i]);
		}
	}
	console.log(`inserting ${OBJECTS} circles took: ${((performance.now() - start) | 0) / PROFILE_NUM}ms`);
	console.log(myQT);
	drawB();
};

document.addEventListener("DOMContentLoaded", init);
