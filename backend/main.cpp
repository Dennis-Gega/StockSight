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

int main() {
    std::string db_uri = env_or("TIMESCALE_SERVICE_URL",
        "postgresql://postgres:postgres@localhost:5432/stocksight");

    std::cout << "[MAIN] Using DB URI: " << db_uri << std::endl;

    DB db(db_uri);
    httplib::Server server;

    server.Get("/api/health", [&](const httplib::Request&, httplib::Response& res){
        res.set_content("{\"status\":\"ok\"}", "application/json");
    });

    // ---------------------------
    // GET /api/prices (with 404)
    // ---------------------------
    server.Get("/api/prices", [&](const httplib::Request& req, httplib::Response& res){

        try {
            std::string ticker   = req.has_param("ticker")   ? req.get_param_value("ticker")   : "AAPL";
            std::string interval = req.has_param("interval") ? req.get_param_value("interval") : "1d";
            std::string start    = req.has_param("start")    ? req.get_param_value("start")    : "";
            std::string end      = req.has_param("end")      ? req.get_param_value("end")      : "";
            int limit            = req.has_param("limit")    ? std::stoi(req.get_param_value("limit")) : 300;

            std::cout << "\n--- /api/prices ---\n";
            std::cout << "Ticker=" << ticker << std::endl;

            auto rows = db.fetch_prices(ticker, interval, start, end, limit);

            // ❌ INVALID TICKER
            if (rows.empty()) {
                json err = {
                    {"error", "Ticker not found"},
                    {"ticker", ticker}
                };
                res.status = 404;
                res.set_content(err.dump(), "application/json");
                return;
            }

            // Normal success response
            json out;
            out["ticker"] = ticker;
            out["interval"] = interval;
            out["prices"] = json::array();

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
            std::cerr << "[ERROR] Exception in /api/prices: " << e.what() << std::endl;
            res.status = 500;
            res.set_content(std::string("{\"error\":\"") + e.what() + "\"}", "application/json");
        }
    });


    // -----------------------------------------
    // GET /api/indicators (with 404)
    // -----------------------------------------
    server.Get("/api/indicators", [&](const httplib::Request& req, httplib::Response& res){

        std::string ticker   = req.has_param("ticker")   ? req.get_param_value("ticker")   : "AAPL";
        std::string interval = req.has_param("interval") ? req.get_param_value("interval") : "1d";
        int limit            = req.has_param("limit")    ? std::stoi(req.get_param_value("limit")) : 200;

        auto rows = db.fetch_prices(ticker, interval, "", "", limit);

        // ❌ INVALID TICKER
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
        close.reserve(rows.size());

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
        out["prices"]   = prices;

        auto to_arr = [](const std::vector<double>& v) {
            json a = json::array();
            for (double d : v) {
                if (std::isnan(d)) a.push_back(nullptr);
                else a.push_back(d);
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

        // ------------------------------------------------------------------
        // Richer Buy / Sell / Hold signal:
        //   - combines RSI, MACD, and Bollinger Bands into a single score.
        // ------------------------------------------------------------------
        std::string signal = "Hold";

        size_t n = close.size();
        if (n >= 2 &&
            rsiV.size() == n &&
            m.macd.size() == n &&
            m.signal.size() == n &&
            bb.upper.size() == n &&
            bb.lower.size() == n) {

            size_t last = n - 1;
            size_t prev = last > 0 ? last - 1 : last;

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

            // --- RSI component ---
            if (!std::isnan(lastRsi)) {
                if (lastRsi < 30.0)        score += 2.0;   // oversold
                else if (lastRsi > 70.0)   score -= 2.0;   // overbought
                else if (lastRsi < 40.0)   score += 0.5;   // mildly oversold
                else if (lastRsi > 60.0)   score -= 0.5;   // mildly overbought

                if (!std::isnan(prevRsi)) {
                    double rsiDelta = lastRsi - prevRsi;
                    if (rsiDelta > 1.0)      score += 0.5;  // RSI rising
                    else if (rsiDelta < -1.0) score -= 0.5; // RSI falling
                }
            }

            // --- MACD component ---
            if (!std::isnan(lastMacd) && !std::isnan(lastSignal)) {
                // Crossovers
                bool bullCross = (!std::isnan(prevMacd) && !std::isnan(prevSignal) &&
                                  prevMacd <= prevSignal && lastMacd > lastSignal);
                bool bearCross = (!std::isnan(prevMacd) && !std::isnan(prevSignal) &&
                                  prevMacd >= prevSignal && lastMacd < lastSignal);

                if (bullCross)      score += 2.0;
                else if (bearCross) score -= 2.0;
                else {
                    if (lastMacd > lastSignal) score += 0.5;
                    else if (lastMacd < lastSignal) score -= 0.5;
                }
            }

            // --- Bollinger Bands component ---
            if (!std::isnan(lastClose) &&
                !std::isnan(lastUpper) &&
                !std::isnan(lastLower)) {

                double bandRange = lastUpper - lastLower;
                if (bandRange > 0.0) {
                    double pos = (lastClose - lastLower) / bandRange; // 0 = lower, 1 = upper

                    if (pos < 0.1)       score += 1.0;  // hugging lower band
                    else if (pos < 0.25) score += 0.5;
                    else if (pos > 0.9)  score -= 1.0;  // hugging upper band
                    else if (pos > 0.75) score -= 0.5;
                }
            }

            // Final decision
            if (score >= 2.0)      signal = "Buy";
            else if (score <= -2.0) signal = "Sell";
            else                    signal = "Hold";
        }

        out["signal"] = signal;

        res.set_content(out.dump(), "application/json");
    });

    std::cout << "Listening on http://localhost:8080\n";
    server.listen("0.0.0.0", 8080);
}
