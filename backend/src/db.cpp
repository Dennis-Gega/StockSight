#include "db.hpp"
#include <pqxx/pqxx>
#include <stdexcept>

DB::DB(const std::string& conn_uri) : conn_(conn_uri) {}

std::vector<PriceBar> DB::fetch_prices(const std::string& ticker,
                                       const std::string& interval,
                                       const std::string& start_iso,
                                       const std::string& end_iso,
                                       int limit) {
  pqxx::connection c(conn_);
  pqxx::work tx(c);
  std::string sql = R"SQL(
    SELECT ts, "open", high, low, "close", volume
    FROM price_history
    WHERE ticker = $1 AND interval = $2
      AND ($3 = '' OR ts >= $3::timestamptz)
      AND ($4 = '' OR ts <= $4::timestamptz)
    ORDER BY ts ASC
    LIMIT $5
  )SQL";
  pqxx::result r = tx.exec_params(sql, ticker, interval, start_iso, end_iso, limit);
  tx.commit();

  std::vector<PriceBar> out;
  out.reserve(r.size());
  for (auto const& row : r) {
    PriceBar p;
    p.ts     = row[0].as<std::string>();
    p.open   = row[1].is_null() ? 0.0 : row[1].as<double>();
    p.high   = row[2].is_null() ? 0.0 : row[2].as<double>();
    p.low    = row[3].is_null() ? 0.0 : row[3].as<double>();
    p.close  = row[4].is_null() ? 0.0 : row[4].as<double>();
    p.volume = row[5].is_null() ? 0   : row[5].as<long long>();
    out.push_back(p);
  }
  return out;
}
