#pragma once
#include <string>
#include <vector>
#include "models.hpp"

class DB {
public:
  explicit DB(const std::string& conn_uri);
  std::vector<PriceBar> fetch_prices(const std::string& ticker,
                                     const std::string& interval,
                                     const std::string& start_iso,
                                     const std::string& end_iso,
                                     int limit = 500);
private:
  std::string conn_;
};
