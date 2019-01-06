

class Point {
public:
	float x;
	float y;
	Point(float x, float y) : x(x), y(y) {}
	Point() {}
};

class Circle : public Point {
public:
	float r;
	Circle(float x, float y, float r) : Point(x, y), r(r) {}
	Circle() {}
};

class AABB : public Point {
public:
	float w;
	float h;
	AABB(float x, float y, float w, float h) : Point(x, y), w(w), h(h) {}
	bool hasCircle(Circle* c) {
		return c->x - c->r >= x && c->x + c->r <= x + w &&
			c->y - c->r >= y && c->y + c->r <= y + h;
	}
};
