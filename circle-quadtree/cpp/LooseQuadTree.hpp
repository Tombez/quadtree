#include "./Geometry.hpp"

#include <vector>
#include <cstdint>

class QuadBranch : public AABB {
public:
	std::vector<Circle*> objects;
	QuadBranch *children[4];
	bool hasSplit;
	QuadBranch(float x, float y, float w, float h) :
		AABB(x, y, w, h), hasSplit(false) {}
	~QuadBranch() {
		if (hasSplit) {
			for (uint8_t i = 0; i < 4; ++i) // compiler unroll?
				delete children[i];
		}
	}
};

QuadBranch* findQB(Circle* c, QuadBranch* qb) { // meant to be inlined
	float hw = qb->w / 2;
	float hh = qb->h / 2;
	float qw = qb->w / 4;
	float qh = qb->h / 4;
	if (c->y <= qb->y + hh) {
		if (c->x <= qb->x + hw) {
			if (qb->children[0]->hasCircle(c)) {
				return qb->children[0];
			}
		} else {
			if (qb->children[1]->hasCircle(c)) {
				return qb->children[1];
			}
		}
	} else {
		if (c->x <= qb->x + hw) {
			if (qb->children[2]->hasCircle(c)) {
				return qb->children[2];
			}
		} else {
			if (qb->children[3]->hasCircle(c)) {
				return qb->children[3];
			}
		}
	}
	return qb;
};

class LooseQuadTree : public QuadBranch { // growth factor of 2
public:
	unsigned int temp;
	uint8_t maxObjects;
	LooseQuadTree(float x, float y, float w, float h, uint8_t maxObjects) :
		QuadBranch(x - w / 2, y - h / 2, w * 2, h * 2),
		maxObjects(maxObjects), temp(0) {}
	void insertCircle(Circle* c) {
		typedef std::pair<Circle*, QuadBranch*> StackType;
		std::vector<StackType> stack;
		stack.emplace_back(c, this);
		while (stack.size() != 0) {
			StackType obj = stack.back();
			stack.pop_back();
			Circle* c = obj.first;
			QuadBranch* qb = obj.second;
			while (qb->hasSplit) {
				QuadBranch* nqb = findQB(c, qb);
				if (nqb == qb) {
					break;
				}
				qb = nqb;
			}
			qb->objects.push_back(c);
			if (qb->objects.size() >= maxObjects && qb->w > 1) {
				float hw = qb->w / 2;
				float hh = qb->h / 2;
				float qw = qb->w / 4;
				float qh = qb->h / 4;
				float ew = qb->w / 8;
				float eh = qb->h / 8;
				for (uint8_t y = 0; y < 2; ++y) { // compiler unroll?
					for (uint8_t x = 0; x < 2; ++x) { // compiler unroll?
						qb->children[x + y * 2] = new QuadBranch(qb->x + x * qw + ew, qb->y + y * qh + eh, hw, hh);
						++temp;
					}
				}
				qb->hasSplit = true;
				uint8_t n = 0;
				for (uint8_t i = 0; i < qb->objects.size(); ++i) {
					Circle* c = qb->objects[i];
					QuadBranch* nqb = findQB(c, qb);
					if (nqb == qb) {
						qb->objects[n++] = c;
					} else {
						stack.emplace_back(c, nqb);
					}
				}
				qb->objects.resize(n);
			}
		}
	}
};
