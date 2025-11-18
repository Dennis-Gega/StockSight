#include "cpp-httplib.h"
#include "json.hpp"
#include "config.hpp"
#include "db.hpp"
#include "indicators.hpp"
#include "models.hpp"
#include "util.hpp"

#include <vector>
#include <algorithm>
#include <iostream>

using json = nlohmann::json;

int main() {
    // Load DB connection string
    std::string db_uri = env_or("TIMESCALE_SERVICE_URL",
        "postgresql://postgres:postgres@localhost:5432/stocksight");

    std::cout << "[MAIN] Using DB URI: " << db_uri << std::endl;

    DB db(db_uri);
    httplib::Server server;

    // -----------------------------------------
    // Health check
    // -----------------------------------------
    server.Get("/api/health", [&](const httplib::Request&, httplib::Response& res){
        res.set_content("{\"status\":\"ok\"}", "application/json");
    });

    // -----------------------------------------
    // GET /api/prices
    // -----------------------------------------
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
    // GET /api/indicators
    // -----------------------------------------
    server.Get("/api/indicators", [&](const httplib::Request& req, httplib::Response& res){

        std::string ticker   = req.has_param("ticker")   ? req.get_param_value("ticker")   : "AAPL";
        std::string interval = req.has_param("interval") ? req.get_param_value("interval") : "1d";
        int limit            = req.has_param("limit")    ? std::stoi(req.get_param_value("limit")) : 200;

        auto rows = db.fetch_prices(ticker, interval, "", "", limit);

        std::vector<double> close;
        close.reserve(rows.size());

        json prices = json::array();
        for (auto& r : rows){
            close.push_back(r.close);
            prices.push_back({
                {"t", r.ts},
                {"c", r.close}
            });
        }

        auto rsiV = rsi(close, 14);
        auto m = macd(close, 12, 26, 9);
        auto bb = bollinger(close, 20, 2.0);

        json out;
        out["ticker"] = ticker;
        out["interval"] = interval;
        out["prices"] = prices;

        auto to_arr = [](const std::vector<double>& v){
            json a = json::array();
            for (double d : v){
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

        std::string signal = "Hold";
        if (!rsiV.empty()) {
            double last = rsiV.back();
            if (!std::isnan(last)) {
                if (last < 30) signal = "Buy";
                else if (last > 70) signal = "Sell";
            }
        }
        out["signal"] = signal;

        res.set_content(out.dump(), "application/json");
    });

    // -----------------------------------------
    // Start server
    // -----------------------------------------
    std::cout << "Listening on http://localhost:8080\n";
    server.listen("0.0.0.0", 8080);
}
