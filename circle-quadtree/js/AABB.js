import Point from "./Point.js";

Math.clamp = function(v, min, max) { // meant to be inlined
	return v < min ? min : (v > max ? max : v);
};

export default class AABB extends Point { // axis-aligned bounding box
	constructor(x, y, w = 0, h = 0) {
		super(x, y);
		this.w = w;
		this.h = h;
	}
	hasPoint(p) {
		return p.x >= this.x && p.x <= this.x + this.w &&
			p.y >= this.y && p.y <= this.y + this.h;
	}
	hasCircle(c) {
		return c.x - c.r >= this.x && c.x + c.r <= this.x + this.w &&
			c.y - c.r >= this.y && c.y + c.r <= this.y + this.h;
	}
	overlapsAABB(other) {
		return other.x + other.w > this.x
			&& other.y + other.h > this.y
			&& other.x < this.x + this.w
			&& other.y < this.y + this.h;
	}
	overlapsCircleA(c) {
		const closestX = Math.clamp(c.x, this.x, this.x + this.w);
		const closestY = Math.clamp(c.y, this.y, this.y + this.h);
		return c.hasPoint(new Point(closestX, closestY));
	}
	overlapsCircleB(c) {
		const halfW = this.w / 2;
		const halfH = this.h / 2;
		const center = new Point(this.x + halfW, this.y + halfH);
		const sqDist = c.sqDist(center);
		if (sqDist > c.r ** 2 + halfW ** 2 + halfH ** 2) return false;
		if (sqDist <= c.r ** 2 + Math.min(halfW, halfH) ** 2) return true;
		const diffX = center.x - c.x;
		const diffY = center.y - c.y;
		const scaler = c.r / Math.hypot(diffX, diffY);
		let circleEdge = new Point(c.x + diffX * scaler, c.y + diffY * scaler);
		return this.hasPoint(circleEdge);
	}
	checkNorthWest(c) {return c.hasPoint(this);}
	checkNorth(c) {return c.y + c.r > this.y;}
	checkNorthEast(c) {return c.hasPoint(new Point(this.x + this.w, this.y));}
	checkEast(c) {return c.x - c.r < this.x + this.w;}
	checkSouthEast(c) {return c.hasPoint(new Point (this.x + this.w, this.y + this.h));}
	checkSouth(c) {return c.y - c.r < this.y + this.h;}
	checkSouthWest(c) {return c.hasPoint(new Point(this.x, this.y + this.h));}
	checkWest(c) {return c.x + c.r > this.x;}
	getDirectionCircleA(c) {
		if (c.x < this.x) { // left three
			if (c.y < this.y) {
				return dir.northWest;
			} else if (c.y <= this.y + this.h) {
				return dir.west;
			} else {
				return dir.southWest;
			}
		} else if (c.x <= this.x + this.w) { // vertical center three
			if (c.y < this.y) {
				return dir.north;
			} else if (c.y <= this.y + this.h) {
				return dir.center;
			} else {
				return dir.south;
			}
		} else { // right three
			if (c.y < this.y) {
				return dir.northEast;
			} else if (c.y <= this.y + this.h) {
				return dir.east;
			} else {
				return dir.southEast;
			}
		}
	}
	getDirectionCircleB(c) {
		return Math.clamp((c.x - (this.x - this.w)) / this.w | 0, 0, 2) +
			Math.clamp((c.y - (this.y - this.h)) / this.h | 0, 0, 2) * 3;
	}
}
