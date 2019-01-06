export default class Point {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	sqDist(p) {
		return (this.x - p.x) ** 2 + (this.y - p.y) ** 2;
	}
}
