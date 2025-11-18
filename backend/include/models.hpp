#pragma once
#include <string>
#include <cstdint>

struct PriceBar {
    // Symbol / ticker for the asset, e.g. "AAPL"
    std::string ticker;

    // ISO timestamp string, e.g. "2025-11-18T15:57:27Z"
    std::string ts;

    double open{};
    double high{};
    double low{};
    double close{};
    long long volume{};
};
