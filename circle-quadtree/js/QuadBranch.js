import AABB from "./AABB.js";

export default class QuadBranch extends AABB {
	constructor(x, y, w, h) {
		super(x, y, w, h);
		this.objects = [];
		this.hasSplit = false;
		this.children = new Array(4);
	}
}
