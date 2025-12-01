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
        std::cout << "  Ticker=" << ticker << " Limit=" << limit << std::endl;

        pqxx::connection c(conn_);
        pqxx::work tx(c);

        // Correct query — simple fetch by symbol
        std::string sql = R"SQL(
            SELECT "Ticker" AS symbol, "Date" AS time, "Open" AS open, "High" AS high, "Low" AS low, "Close" AS close, "Volume" AS volume
            FROM public.sp500_data
            WHERE "Ticker" = $1
            ORDER BY "Date" ASC
            LIMIT $2
        )SQL";


        auto r = tx.exec_params(sql, ticker, limit);
        tx.commit();

        std::vector<PriceBar> out;
        out.reserve(r.size());

        for (auto const& row : r) {
            PriceBar p;
            p.ticker = row["symbol"].as<std::string>();

            // *** FIX TIMESTAMP FORMAT FOR REACT ***
            std::string raw = row["time"].as<std::string>();

            // Convert "2025-10-23 15:32:17.081769+00"
            // → "2025-10-23T15:32:17.081769Z"
            for (char &c : raw) {
                if (c == ' ') c = 'T';
            }
            if (raw.back() != 'Z')
                raw.push_back('Z');

            p.ts = raw;

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
