#include <iostream>
#include <vector>
#include <cmath>
#include <random>


extern "C" {
    int addNeedle2(int* lines, int lines_length, int width, int repeat) {
        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_real_distribution<> dis(0.0, 1.0);
        std::uniform_real_distribution<> angle_dis(0.0, 2 * M_PI);

        int needleLength = 50;
        int lineSpacing = 100;
        int intersectedNeedles = 0;

        for (int i = 0; i < repeat; ++i) {
            double x = dis(gen) * width;
            double y = dis(gen) * (lines[lines_length - 1] - lines[0]) + lines[0];
            double angle = angle_dis(gen);

            double min_distance = std::abs(y - lines[0]);
            for (int j = 1; j < lines_length; ++j) {
                min_distance = std::min(min_distance, std::abs(y - lines[j]));
            }

            if (min_distance <= (needleLength / 2) * std::abs(std::sin(angle))) {
                intersectedNeedles++;
            }
        }

        return intersectedNeedles;
    }
}
