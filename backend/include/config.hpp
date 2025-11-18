#pragma once
#include <string>
#include <cstdlib>

inline std::string env_or(const std::string& key, const std::string& fallback) {
    const char* v = std::getenv(key.c_str());
    return v ? std::string(v) : fallback;
}
