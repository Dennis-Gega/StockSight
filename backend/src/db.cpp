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
        std::cout << "\n[DB::fetch_prices] Start\n";
        std::cout << "  ticker="   << ticker    << "\n";
        std::cout << "  interval=" << interval  << "\n";
        std::cout << "  start_in =" << start_iso << "\n";
        std::cout << "  end_in   =" << end_iso   << "\n";
        std::cout << "  limit="    << limit     << "\n";

        pqxx::connection c(conn_);
        pqxx::work tx(c);

        std::string start_final = start_iso.empty()
            ? "now() - interval '3 months'"
            : start_iso;

        std::string end_final = end_iso.empty()
            ? "now()"
            : end_iso;

        std::cout << "  start_final=" << start_final << "\n";
        std::cout << "  end_final="   << end_final   << "\n";

        std::string bucket = "1 day";

        if (interval == "1wk" || interval == "1w")
            bucket = "7 days";
        else if (interval == "1d")
            bucket = "1 day";

        std::cout << "  bucket=" << bucket << "\n";

        std::string sql = R"SQL(
            SELECT 
                "Ticker" AS symbol,
                time_bucket($2, "Date") AS bucket_time,
                FIRST("Open", "Date")  AS open,
                MAX("High")            AS high,
                MIN("Low")             AS low,
                LAST("Close", "Date")  AS close,
                SUM("Volume")          AS volume
            FROM public.sp500_data
            WHERE "Ticker" = $1
              AND "Date"::date >= ()SQL" + start_final + R"SQL()::date
              AND "Date"::date <= ()SQL" + end_final   + R"SQL()::date
            GROUP BY symbol, bucket_time
            ORDER BY bucket_time ASC
            LIMIT $3
        )SQL";

        auto r = tx.exec_params(sql, ticker, bucket, limit);
        tx.commit();

        std::vector<PriceBar> out;
        out.reserve(r.size());

        for (auto const& row : r) {
            PriceBar p;
            p.ticker = row["symbol"].as<std::string>();

            std::string raw = row["bucket_time"].as<std::string>();
            for (char &c : raw)
                if (c == ' ') c = 'T';
            if (!raw.empty() && raw.back() != 'Z') raw.push_back('Z');
            p.ts = raw;

            p.open   = row["open"].as<double>();
            p.high   = row["high"].as<double>();
            p.low    = row["low"].as<double>();
            p.close  = row["close"].as<double>();
            p.volume = row["volume"].as<long long>();

            out.push_back(p);
        }

        std::cout << "[DB::fetch_prices] Rows returned = " << out.size() << "\n";
        return out;
    }
    catch (const std::exception& e) {
        std::cerr << "[DB ERROR] " << e.what() << std::endl;
        throw;
    }
}
