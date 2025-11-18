#pragma once
#include <string>
#include <cstdint>

struct PriceBar {
    std::string ts;      
    double open{};       
    double high{};       
    double low{};        
    double close{};      
    long long volume{};  
};
