#include "cpp-httplib.h"
#include "json.hpp"
#include "config.hpp"
#include "db.hpp"
#include "indicators.hpp"
#include "models.hpp"
#include "util.hpp"
#include <vector>
#include <algorithm>

using json = nlohmann::json;

int main() {
  // 1) DB connection string from env (see setup below)
  std::string db_uri = env_or("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/stocksight");
  DB db(db_uri);

  httplib::Server server;

  server.Get("/api/health", [&](const httplib::Request&, httplib::Response& res){
    res.set_content(R"({"status":"ok"})", "application/json");
  });

  // GET /api/prices?ticker=AAPL&interval=1d&start=2024-01-01&end=&limit=300
  server.Get("/api/prices", [&](const httplib::Request& req, httplib::Response& res){
    auto q = parse_query(req.query); // simple parser
    std::string ticker   = q.count("ticker")? q["ticker"] : "AAPL";
    std::string interval = q.count("interval")? q["interval"] : "1d";
    std::string start    = q.count("start")? q["start"] : "";
    std::string end      = q.count("end")? q["end"] : "";
    int limit            = q.count("limit")? std::stoi(q["limit"]) : 300;

    auto rows = db.fetch_prices(ticker, interval, start, end, limit);
    json out;
    out["ticker"]=ticker;
    out["interval"]=interval;
    out["prices"]=json::array();
    for (auto& r : rows){
      out["prices"].push_back({{"t",r.ts},{"o",r.open},{"h",r.high},{"l",r.low},{"c",r.close},{"v",r.volume}});
    }
    res.set_content(out.dump(), "application/json");
  });

  // GET /api/indicators?ticker=AAPL&interval=1d&limit=200
  server.Get("/api/indicators", [&](const httplib::Request& req, httplib::Response& res){
    auto q = parse_query(req.query);
    std::string ticker   = q.count("ticker")? q["ticker"] : "AAPL";
    std::string interval = q.count("interval")? q["interval"] : "1d";
    int limit            = q.count("limit")? std::stoi(q["limit"]) : 200;

    auto rows = db.fetch_prices(ticker, interval, "", "", limit);
    std::vector<double> close; close.reserve(rows.size());
    json prices = json::array();
    for (auto& r: rows) { close.push_back(r.close); prices.push_back({{"t",r.ts},{"c",r.close}}); }

    auto rsiV = rsi(close, 14);
    auto m = macd(close,12,26,9);
    auto bb = bollinger(close,20,2.0);

    json out;
    out["ticker"]=ticker;
    out["interval"]=interval;
    out["prices"]=prices;

    auto to_arr = [](const std::vector<double>& v){
      json a = json::array(); for (auto d: v) a.push_back(std::isnan(d)? nullptr : json(d)); return a;
    };
    out["indicators"] = {
      {"rsi",     to_arr(rsiV)},
      {"macd",    {{"macd", to_arr(m.macd)}, {"signal", to_arr(m.signal)}, {"hist", to_arr(m.hist)}}},
      {"bb",      {{"upper", to_arr(bb.upper)}, {"middle", to_arr(bb.middle)}, {"lower", to_arr(bb.lower)}}}
    };

    // Simple toy signal
    std::string signal = "Hold";
    if (!rsiV.empty()) {
      double last = rsiV.back();
      if (!std::isnan(last)) {
        if (last < 30) signal = "Buy";
        else if (last > 70) signal = "Sell";
      }
    }
    out["signal"]=signal;

    res.set_content(out.dump(), "application/json");
  });

  // Run
  printf("Server listening on http://localhost:8080\n");
  server.listen("0.0.0.0", 8080);
  return 0;
}
