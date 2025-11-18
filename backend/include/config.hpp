#pragma once
#include <cstdlib>
#include <string>

inline std::string env_or(const char* key, const char* def){
  const char* v = std::getenv(key);
  return v? std::string(v) : std::string(def);
}
