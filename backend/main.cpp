#include "httplib.h"
#include "json.hpp"

using json = nlohmann::json;
using namespace httplib;

int main() {
  Server svr;

  // Define the /api/analyze endpoint
  svr.Get("/api/analyze", [](const Request& req, Response& res) {
    // Grab the ?symbol=XYZ query parameter
    std::string symbol = req.has_param("symbol") ? req.get_param_value("symbol") : "???";
    // Here you’d run your own stock analysis logic
    json result = {
      {"symbol", symbol},
      {"signal", "hold"},     // Hardcoded for now, expand logic as needed
      {"rsi", 53.5},
      {"macd", 0.24},
      {"bollinger", "neutral"}
    };
    res.set_header("Access-Control-Allow-Origin", "*"); // Allow frontend calls
    res.set_content(result.dump(), "application/json");
  });

  printf("Listening on http://localhost:8080 ...\n");
  svr.listen("0.0.0.0", 8080);
}
