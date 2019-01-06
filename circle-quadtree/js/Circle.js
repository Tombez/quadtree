import Point from "./Point.js";

export default class Circle extends Point {
	constructor(x, y, r = 0) {
		super(x, y);
		this.r = r;
	}
	hasPoint(p) {
		return this.sqDist(p) <= this.r ** 2;
	}
	overlapsCircle(c) {
		return this.sqDist(c) <= this.r ** 2 + c.r ** 2;
	}
}
