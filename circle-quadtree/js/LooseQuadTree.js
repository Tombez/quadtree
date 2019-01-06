import Point from "./Point.js";
import Circle from "./Circle.js";
import QuadBranch from "./QuadBranch.js";

export class Tuple {
	constructor(left, right) {
		this.left = left;
		this.right = right;
	}
}
const findQB = (c, qb, hw = qb.w / 2, hh = qb.h / 2) => { // meant to be inlined
	const qw = qb.w / 4;
	const qh = qb.h / 4;
	if (c.y <= qb.y + hh) {
		if (c.x <= qb.x + hw) {
			if (c.x - c.r >= qb.x - qw &&
				c.x + c.r <= qb.x + qb.w - qw &&
				c.y - c.r >= qb.y - qh &&
				c.y + c.r <= qb.y + qb.h - qh)
			{
				return qb.children[0];
			}
		} else {
			if (c.x - c.r >= qb.x + qw &&
				c.x + c.r <= qb.x + qb.w + qw &&
				c.y - c.r >= qb.y - qh &&
				c.y + c.r <= qb.y + qb.h - qh)
			{
				return qb.children[1];
			}
		}
	} else {
		if (c.x <= qb.x + hw) {
			if (c.x - c.r >= qb.x - qw &&
				c.x + c.r <= qb.x + qb.w - qw &&
				c.y - c.r >= qb.y + qh &&
				c.y + c.r <= qb.y + qb.h + qh)
			{
				return qb.children[2];
			}
		} else {
			if (c.x - c.r >= qb.x + qw &&
				c.x + c.r <= qb.x + qb.w + qw &&
				c.y - c.r >= qb.y + qh &&
				c.y + c.r <= qb.y + qb.h + qh)
			{
				return qb.children[3];
			}
		}
	}

	// if (c.y + c.r <= qb.y + qb.h - qh) { // top-bottom
	// 	if (c.x + c.r <= qb.x + qb.w - qw // left-right
	// 		&& c.y - c.r >= qb.y - qh // top-top
	// 		&& c.x - c.r >= ) // left-left
	// 	{
	// 		return qb.children[0];
	// 	} else if (c.x - c.r >= qb.x + qw) { // right-left
	// 		return qb.children[1];
	// 	}
	// } else if (c.y - c.r >= qb.y + qh) { // bottom-top
	// 	if (c.x + c.r <= qb.x + qb.w - qw) {
	// 		return qb.children[2];
	// 	} else if (c.x - c.r >= qb.x + qw) {
	// 		return qb.children[3];
	// 	}
	// }
	return qb;
};


export default class LooseQuadTree extends QuadBranch { // growth factor of 2
	constructor(x, y, w, h, maxObjects, maxObjFunc) {
		super(x, y, w, h);
		this.maxObjects = maxObjects;
		this.maxObjFunc = maxObjFunc;
		this.temp = 0;
	}
	insertCircle(c) {
		let stack = [new Tuple(c, this)];
		let obj;
		while (obj = stack.pop()) {
			let c = obj.left;
			let qb = obj.right;
			while (qb) {
				if (qb.hasSplit) {
					const nqb = findQB(c, qb);
					if (nqb !== qb) {
						qb = nqb;
						continue;
					}
				}
				qb.objects.push(c);
				if (qb.objects.length >= this.maxObjects && qb.w > 1) {
					const hw = qb.w / 2;
					const hh = qb.h / 2;
					const qw = qb.w / 4;
					const qh = qb.h / 4;
					// const ew = qb.w / 8;
					// const eh = qb.h / 8;
					// for (let y = 0; y < 2; ++y) { // compiler unroll?
					// 	for (let x = 0; x < 2; ++x) { // compiler unroll?
					// 		qb.children[x + y * 2] = new QuadBranch(qb.x + x * qw + ew, qb.y + y * qh + eh, hw, hh);
					// 	}
					// }
					for (let y = 0; y < 2; ++y) { // compiler unroll?
						for (let x = 0; x < 2; ++x) { // compiler unroll?
							qb.children[x + y * 2] = new QuadBranch(qb.x + x * hw, qb.y + y * hh, hw, hh);
							++this.temp;
						}
					}
					qb.hasSplit = true;
					let n = 0;
					for (let i = 0; i < qb.objects.length; ++i) {
						let c = qb.objects[i];
						const nqb = findQB(c, qb, hw, hh);
						if (nqb === qb) {
							qb.objects[n++] = c;
						} else {
							stack.push(new Tuple(c, nqb));
						}
					}
					qb.objects.length = n;
				}
				qb = null;
			}
		}
	}
}
