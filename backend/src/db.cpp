#include "db.hpp"
#include <pqxx/pqxx>
#include <stdexcept>
#include <iostream>

DB::DB(const std::string& conn_uri) : conn_(conn_uri) {}

std::vector<PriceBar> DB::fetch_prices(
    const std::string& ticker,
    const std::string& interval,
    const std::string& start_iso,
    const std::string& end_iso,
    int limit)
{
    try {
        std::cout << "[DB::fetch_prices] SQL query starting..." << std::endl;

        pqxx::connection c(conn_);
        pqxx::work tx(c);

        std::string sql = R"SQL(
            SELECT ticker, ts, open, high, low, close, volume
            FROM price_history
            WHERE ticker = $1
            ORDER BY ts ASC
            LIMIT $2
        )SQL";

        auto r = tx.exec_params(sql, ticker, limit);
        tx.commit();

        std::vector<PriceBar> out;
        out.reserve(r.size());

        for (auto const& row : r) {
            PriceBar p;
            p.ts     = row["ts"].as<std::string>();
            p.open   = row["open"].as<double>();
            p.high   = row["high"].as<double>();
            p.low    = row["low"].as<double>();
            p.close  = row["close"].as<double>();
            p.volume = row["volume"].as<long long>();
            out.push_back(p);
        }

        std::cout << "[DB::fetch_prices] Completed, rows=" << out.size() << std::endl;
        return out;
    }
    catch (const std::exception& e) {
        std::cerr << "[DB ERROR] " << e.what() << std::endl;
        throw;  // rethrow to /api/prices
    }
}

