#include "util.hpp"
#include <sstream>

std::unordered_map<std::string,std::string> parse_query(const std::string& qs){
    std::unordered_map<std::string,std::string> m;
    std::istringstream ss(qs);
    std::string kv;

    while (std::getline(ss, kv, '&')){
        auto pos = kv.find('=');
        if (pos == std::string::npos) {
            m[kv] = "";
            continue;
        }
        m[kv.substr(0,pos)] = kv.substr(pos+1);
    }
    return m;
}
