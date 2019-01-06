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
			if (qb.children[0].hasCircle(c)) {
				return qb.children[0];
			}
		} else {
			if (qb.children[1].hasCircle(c)) {
				return qb.children[1];
			}
		}
	} else {
		if (c.x <= qb.x + hw) {
			if (qb.children[2].hasCircle(c)) {
				return qb.children[2];
			}
		} else {
			if (qb.children[3].hasCircle(c)) {
				return qb.children[3];
			}
		}
	}
	return qb;
};


export default class LooseQuadTreeB extends QuadBranch { // growth factor of 2
	constructor(x, y, w, h, maxObjects, maxObjFunc) {
		super(x - w / 2, y - h / 2, w * 2, h * 2);
		this.maxObjects = maxObjects;
		// this.maxObjFunc = maxObjFunc;
		this.temp = 1;
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
					const ew = qb.w / 8;
					const eh = qb.h / 8;
					for (let y = 0; y < 2; ++y) { // compiler unroll?
						for (let x = 0; x < 2; ++x) { // compiler unroll?
							qb.children[x + y * 2] = new QuadBranch(qb.x + x * qw + ew, qb.y + y * qh + eh, hw, hh);
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
