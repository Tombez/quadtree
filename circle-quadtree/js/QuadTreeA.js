import Point from "./Point.js";
import Circle from "./Circle.js";
import QuadBranch from "./QuadBranch.js";

export default class QuadTreeA extends QuadBranch {
	constructor(x, y, w, h, maxObjects) {
		super(x, y, w, h);
		this.maxObjects = maxObjects;
	}
	split(maxObjects) {
		const hw = this.w / 2;
		const hh = this.h / 2;
		for (let y = 0; y < 2; ++y) { // unroll
			for (let x = 0; x < 2; ++x) { // unroll
				this.children[x + y * 2] = new QuadBranch(this.x + x * hw, this.y + y * hh, hw, hh);
			}
		}
		for (const c of this.objects) {
			QuadTreeA.prototype.handDown.call(this, c, maxObjects);
		}
		this.objects = [];
		this.hasSplit = true;
		return;
	}
	handDown(c, maxObjects) {
		for (const child of this.children) {
			QuadTreeA.prototype.insertCircle.call(child, c, maxObjects);
		}
	}
	insertCircle(c, maxObjects = this.maxObjects) {
		if (!this.overlapsCircleA(c)) return;
		if (this.hasSplit) {
			QuadTreeA.prototype.handDown.call(this, c, maxObjects);
		} else {
			this.objects.push(c);
			if (this.objects.length >= maxObjects && this.w > 1) {
				QuadTreeA.prototype.split.call(this, maxObjects);
			}
		}
	}
}
