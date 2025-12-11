#pragma once
#include <string>
#include <unordered_map>

std::unordered_map<std::string,std::string> parse_query(const std::string& qs);
