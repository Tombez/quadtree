function Quadtree(size, maxLeaves) {
	this.size = size;
	this.maxLeaves = maxLeaves || 1;
	this.root = new Branch(-this.size, -this.size, this.size, null);
}
Quadtree.prototype.insert = function(leaf) {
	this.root.insert(leaf, this.maxLeaves);
};

function Branch(x, y, size, parent) {
	this.x = x;
	this.y = y;
	this.size = size;
	this.leaves = [];
};
Branch.prototype.insert = function(leaf, maxLeaves) {
	if (this.branches) {
		var x = (((this.x + this.size) > leaf.x) ? 0 : 1);
		var y = (((this.y + this.size) > leaf.y) ? 0 : 1);
		this.branches[x][y].insert(leaf, maxLeaves);
	} else {
		this.leaves.push(leaf);
		if (this.leaves.length > maxLeaves && this.size / 2 >= 1) {
			this.split();
			while(this.leaves.length) {
				this.insert(this.leaves.shift(), maxLeaves);
			}
		}
	}
};
Branch.prototype.highestBranch = function(point) {
	var branch = this, x, y;
	while(branch.branches) {
		x = (((branch.x + branch.size) > point.x) ? 0 : 1);
		y = (((branch.y + branch.size) > point.y) ? 0 : 1);
		branch =  branch.branches[x][y].highestBranch(point);
	}
	return branch;
};
Branch.prototype.split = function() {
	this.branches = [];
	var node, x, y;
	for (x = 0; x < 2; x++) {
		this.branches[x] = [];
		for (y = 0; y < 2; y++) {
			this.branches[x][y] = new Branch(this.x + x * this.size, this.y + y * this.size, this.size / 2, this);
		}
	}
};