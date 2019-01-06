import Point from "./Point.js";
import Circle from "./Circle.js";
import QuadBranch from "./QuadBranch.js";

class Tuple {
	constructor(left, right) {
		this.left = left;
		this.right = right;
	}
}

export default class QuadTreeC extends QuadBranch {
	constructor(x, y, w, h, maxObjects) {
		super(x, y, w, h);
		this.maxObjects = maxObjects;
	}
	insertCircle(c) {
		let cStack = [new Tuple(c, [this])];
		let obj;
		while (obj = cStack.pop()) {
			let c = obj.left;
			let qbStack = obj.right;
			let qb;
			while (qb = qbStack.pop()) {
				if (!qb.overlapsCircleA(c)) continue;
				if (qb.hasSplit) {
					qbStack.push(...qb.children);
				} else {
					qb.objects.push(c);
					if (qb.objects.length >= this.maxObjects && qb.w > 1) { // "&& qb.w > 1" to prevent infinite splitting
						const hw = qb.w / 2;
						const hh = qb.h / 2;
						for (let y = 0; y < 2; ++y) { // unroll
							for (let x = 0; x < 2; ++x) { // unroll
								qb.children[x + y * 2] = new QuadBranch(qb.x + x * hw, qb.y + y * hh, hw, hh);
							}
						}
						qb.hasSplit = true;
						for (const obj of qb.objects) {
							cStack.push(new Tuple(obj, qb.children.slice()));
						}
						qb.objects = [];
					}
				}
			}
		}
	}
}
