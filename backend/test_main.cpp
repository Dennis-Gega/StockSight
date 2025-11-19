#include <gtest/gtest.h>
#include <thread>
#include "./lib/cpp-httplib.h"
#include "./include/config.hpp"
#include "./include/db.hpp"
#include "./include/indicators.hpp"

//
// Basic health check
//
TEST(API, HealthCheck) {
    httplib::Server server;

    server.Get("/api/health", [&](const httplib::Request&, httplib::Response& res){
        res.set_content("{\"status\":\"ok\"}", "application/json");
    });

    std::thread t([&]{ server.listen("localhost", 9999); });
    std::this_thread::sleep_for(std::chrono::milliseconds(150));

    httplib::Client cli("localhost", 9999);
    auto res = cli.Get("/api/health");

    ASSERT_NE(res, nullptr);
    EXPECT_EQ(res->status, 200);
    EXPECT_EQ(res->body, "{\"status\":\"ok\"}");

    server.stop();
    t.join();
}

//
// DB Connection test
//
TEST(Database, BasicConnection) {
    std::string url = env_or("DATABASE_URL", "");
    ASSERT_FALSE(url.empty());

    EXPECT_NO_THROW({
        DB db(url);
        auto rows = db.fetch_prices("AAPL", "1d", "", "", 5);
    });
}

//
// Indicator tests
//
TEST(Indicators, RSIWorks) {
    std::vector<double> close = {10,11,12,11,10,9,8,9,10,11};
    auto r = rsi(close, 5);
    EXPECT_EQ(r.size(), close.size());
}

TEST(Indicators, MACDWorks) {
    std::vector<double> close = {1,2,3,4,5,6,7,8,9,10};
    auto m = macd(close);
    EXPECT_EQ(m.macd.size(), close.size());
}
