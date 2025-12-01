#pragma once
#include <vector>

// Exponential moving average (optionally double-EMA)
std::vector<double> ema(
    const std::vector<double>& x,
    int period,
    bool doubleEMA = false);

// RSI (optionally Wilder-style smoothing)
std::vector<double> rsi(
    const std::vector<double>& close,
    int period = 14,
    bool wilder = false);

struct MACD {
    std::vector<double> macd;
    std::vector<double> signal;
    std::vector<double> hist;
};

// MACD, with optional doubleEMA on EMAs
MACD macd(
    const std::vector<double>& close,
    int fast     = 12,
    int slow     = 26,
    int signal   = 9,
    bool doubleEMA = false);

// Simple trend direction helper (+1 up, -1 down, 0 flat)
std::vector<int> trendDirection(
    const std::vector<double>& series,
    int window = 3);

// Momentum helper (difference over window)
std::vector<double> momentum(
    const std::vector<double>& series,
    int window = 3);

struct BB {
    std::vector<double> upper;
    std::vector<double> middle;
    std::vector<double> lower;
};

BB bollinger(
    const std::vector<double>& close,
    int period = 20,
    double k   = 2.0);
