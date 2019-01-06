#include "./LooseQuadTree.hpp"
#include "./Random.hpp"

#include <iostream>
#include <cstdlib>
#include <chrono>
#include <string>

uint32_t OBJECTS = 300000;
const float MIN_R = 0.5;
const float MAX_R = 0.5;
const float WIDTH = 800.0;
const float HEIGHT = 800.0;
const uint32_t MAX_OBJ = 15;
const uint32_t PROFILE_NUM = 1;

int main(int argc, char* argv[]) {
	if (argc > 1) {
		int argnum = std::stoi(argv[1]);
		if (argnum > 0) {
			OBJECTS = argnum;
		}
	}
	LooseQuadTree qt(0.0, 0.0, WIDTH, HEIGHT, MAX_OBJ);
	Circle* circs = new Circle[OBJECTS];
	Random rnd;

	auto start = std::chrono::high_resolution_clock::now();
	for (int i = 0; i < OBJECTS; ++i) {
		circs[i] = Circle(rnd(0.0f, WIDTH), rnd(0.0f, HEIGHT), rnd(MIN_R, MAX_R));
	}
	auto diff = std::chrono::high_resolution_clock::now() - start;
	uint64_t elapsed = std::chrono::duration_cast<std::chrono::milliseconds>(diff).count();
	std::cout << "generating " << OBJECTS << " circles took " << elapsed << " milli.\n";

	start = std::chrono::high_resolution_clock::now();
	for (int n = 0; n < PROFILE_NUM; ++n) {
		LooseQuadTree qt(0.0, 0.0, WIDTH, HEIGHT, MAX_OBJ);
		for (int i = 0; i < OBJECTS; ++i) {
			// if (i % 10000 == 0) {
			// 	std::cout << i << "\n";
			// }
			qt.insertCircle(&circs[i]);
		}
		std::cout << "temp: " << qt.temp << "\n";
	}
	diff = std::chrono::high_resolution_clock::now() - start;
	elapsed = std::chrono::duration_cast<std::chrono::milliseconds>(diff).count();
	std::cout << "inserting " << OBJECTS << " circles took " << (float)elapsed / PROFILE_NUM << " milli.\n";

	//std::cout << "temp: " << qt.temp << "\n";
	return 0;
}
