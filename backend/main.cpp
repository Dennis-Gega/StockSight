#include "./lib/cpp-httplib.h"
#include "./lib/json.hpp"
#include "./include/config.hpp"
#include "./include/db.hpp"
#include "./include/indicators.hpp"
#include "./include/models.hpp"
#include "./include/util.hpp"

#include <vector>
#include <algorithm>
#include <iostream>
#include <cmath>

using json = nlohmann::json;

// helper: map range string → SQL interval expression
static std::string range_to_start_expr(const std::string& range) {
    if (range == "1mo") return "now() - interval '1 month'";
    if (range == "3mo") return "now() - interval '3 months'";
    if (range == "6mo") return "now() - interval '6 months'";
    if (range == "1y")  return "now() - interval '1 year'";
    if (range == "5y")  return "now() - interval '5 years'";
    return "now() - interval '3 months'";
}

int main() {
    std::string db_uri = env_or(
        "TIMESCALE_SERVICE_URL",
        "postgresql://postgres:postgres@localhost:5432/stocksight"
    );

    std::cout << "[MAIN] Using DB URI: " << db_uri << std::endl;

    DB db(db_uri);
    httplib::Server server;

    // health check
    server.Get("/api/health", [&](const httplib::Request&, httplib::Response& res){
        res.set_content("{\"status\":\"ok\"}", "application/json");
    });

    // GET /api/prices
    server.Get("/api/prices", [&](const httplib::Request& req, httplib::Response& res){
        try {
            std::string ticker   = req.has_param("ticker")   ? req.get_param_value("ticker")   : "AAPL";
            std::string interval = req.has_param("interval") ? req.get_param_value("interval") : "1d";
            std::string range    = req.has_param("range")    ? req.get_param_value("range")    : "3mo";

            std::string start_expr = range_to_start_expr(range);
            std::string end_expr   = "now()";

            int limit = req.has_param("limit")
                ? std::stoi(req.get_param_value("limit"))
                : 500;

            auto rows = db.fetch_prices(ticker, interval, start_expr, end_expr, limit);

            if (rows.empty()) {
                json err = {
                    {"error", "Ticker not found"},
                    {"ticker", ticker}
                };
                res.status = 404;
                res.set_content(err.dump(), "application/json");
                return;
            }

            json out;
            out["ticker"]   = ticker;
            out["interval"] = interval;
            out["range"]    = range;
            out["prices"]   = json::array();

            for (auto& r : rows) {
                out["prices"].push_back({
                    {"t", r.ts},
                    {"o", r.open},
                    {"h", r.high},
                    {"l", r.low},
                    {"c", r.close},
                    {"v", r.volume}
                });
            }

            res.set_content(out.dump(), "application/json");
        }
        catch (const std::exception& e) {
            res.status = 500;
            res.set_content(std::string("{\"error\":\"") + e.what() + "\"}", "application/json");
        }
    });

    // GET /api/indicators
    server.Get("/api/indicators", [&](const httplib::Request& req, httplib::Response& res){
        try {
            std::string ticker   = req.has_param("ticker")   ? req.get_param_value("ticker")   : "AAPL";
            std::string interval = req.has_param("interval") ? req.get_param_value("interval") : "1d";
            std::string range    = req.has_param("range")    ? req.get_param_value("range")    : "3mo";

            std::string start_expr = range_to_start_expr(range);
            std::string end_expr   = "now()";

            int limit = req.has_param("limit")
                ? std::stoi(req.get_param_value("limit"))
                : 300;

            auto rows = db.fetch_prices(ticker, interval, start_expr, end_expr, limit);

            if (rows.empty()) {
                json err = {
                    {"error", "Ticker not found"},
                    {"ticker", ticker}
                };
                res.status = 404;
                res.set_content(err.dump(), "application/json");
                return;
            }

            std::vector<double> close;
            json prices = json::array();

            for (auto& r : rows) {
                close.push_back(r.close);
                prices.push_back({
                    {"t", r.ts},
                    {"c", r.close}
                });
            }

            auto rsiV = rsi(close, 14);
            auto m    = macd(close, 12, 26, 9);
            auto bb   = bollinger(close, 20, 2.0);

            json out;
            out["ticker"]   = ticker;
            out["interval"] = interval;
            out["range"]    = range;
            out["prices"]   = prices;

            auto to_arr = [](const std::vector<double>& v){
                json a = json::array();
                for (double d : v) {
                    if (std::isnan(d))
                        a.push_back(nullptr);
                    else
                        a.push_back(d);
                }
                return a;
            };

            out["indicators"] = {
                {"rsi", to_arr(rsiV)},
                {"macd", {
                    {"macd",   to_arr(m.macd)},
                    {"signal", to_arr(m.signal)},
                    {"hist",   to_arr(m.hist)}
                }},
                {"bb", {
                    {"upper",  to_arr(bb.upper)},
                    {"middle", to_arr(bb.middle)},
                    {"lower",  to_arr(bb.lower)}
                }}
            };

            // buy / sell / hold
            std::string signal = "Hold";

            size_t n = close.size();
            if (n >= 2) {

                size_t last = n - 1;
                size_t prev = last - 1;

                double score = 0.0;

                double lastRsi = rsiV[last];
                double prevRsi = rsiV[prev];

                double lastMacd   = m.macd[last];
                double prevMacd   = m.macd[prev];
                double lastSignal = m.signal[last];
                double prevSignal = m.signal[prev];

                double lastClose  = close[last];
                double lastUpper  = bb.upper[last];
                double lastLower  = bb.lower[last];

                if (!std::isnan(lastRsi)) {
                    if (lastRsi < 30.0) score += 2.0;
                    else if (lastRsi > 70.0) score -= 2.0;

                    double rsiDelta = lastRsi - prevRsi;
                    if (rsiDelta > 1.0) score += 0.5;
                    else if (rsiDelta < -1.0) score -= 0.5;
                }

                if (!std::isnan(lastMacd) && !std::isnan(lastSignal)) {
                    bool bullCross = prevMacd <= prevSignal && lastMacd > lastSignal;
                    bool bearCross = prevMacd >= prevSignal && lastMacd < lastSignal;

                    if (bullCross) score += 2.0;
                    if (bearCross) score -= 2.0;
                }

                if (!std::isnan(lastClose) &&
                    !std::isnan(lastUpper) &&
                    !std::isnan(lastLower)) {

                    double range = lastUpper - lastLower;
                    double pos = (lastClose - lastLower) / range;

                    if (pos < 0.1) score += 1.0;
                    else if (pos > 0.9) score -= 1.0;
                }

                if (score >= 2.0) signal = "Buy";
                else if (score <= -2.0) signal = "Sell";
                else signal = "Hold";
            }

            out["signal"] = signal;

            res.set_content(out.dump(), "application/json");
        }
        catch (const std::exception& e) {
            res.status = 500;
            res.set_content(std::string("{\"error\":\"") + e.what() + "\"}", "application/json");
        }
    });

    std::cout << "Listening on http://localhost:8080\n";
    server.listen("0.0.0.0", 8080);
} 
