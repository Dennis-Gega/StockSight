#pragma once
#include <vector>

std::vector<double> ema(const std::vector<double>& x, int period);
std::vector<double> rsi(const std::vector<double>& close, int period=14);

struct MACD {
    std::vector<double> macd, signal, hist;
};

MACD macd(const std::vector<double>& close, int fast=12, int slow=26, int signal=9);

struct BB {
    std::vector<double> upper, middle, lower;
};
BB bollinger(const std::vector<double>& close, int period=20, double k=2.0);
