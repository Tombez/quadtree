import Point from "./Point.js";
import Circle from "./Circle.js";
import QuadBranch, {dir} from "./QuadBranch.js";

export let counter = 0;

let temp = 0;
export const dir = {
	northwest: temp++,
	north: temp++,
	northeast: temp++,
	west: temp++,
	center: temp++,
	east: temp++,
	southwest: temp++,
	south: temp++,
	southeast: temp++,
	unknown: temp++
};

export default class QuadTree extends QuadBranch {
	constructor(x, y, w, h, maxObjects) {
		super(x, y, w, h);
	}
	insertCircleB(c, direction) {
		if (this.hasSplit || this.addObject(c)) {
			switch(direction) {
				case dir.northWest:
					this.upperLeft.insert(circle, direction);
					if (c.x + c.r > this.x + this.w / 2) {
						if (c.y + c.r > this.y + this.h / 2) {
							if (this.lowerLeft.checkNorthWest(c))
								this.lowerLeft.insertCircle(c, direction);
							if (this.lowerRight.checkNorthWest(c))
								this.lowerRight.insertCircle(c, direction);
						}
					} else if (c.y + c.r > this.y + this.h / 2) {
						if (this.lowerLeft.checkNorthWest(c))
							this.lowerLeft.insertCircle(c, direction);
					}
					break;
				case dir.north:

					break;
				case dir.northEast:

					break;
				case dir.east:

					break;
				case dir.southEast:

					break;
				case dir.south:

					break;
				case dir.southWest:

					break;
				case dir.west:

					break;
				case dir.center:
					if (c.x < this.x + this.w / 2) {
						if (c.y < this.y + this.h / 2) {

						} else {

						}
					} else {
						if (c.y < this.y + this.h / 2) {

						} else {

						}
					}
					break;
				case dir.unknown:

					break;
			}
		}
	}
}
