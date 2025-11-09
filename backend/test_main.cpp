#include <gtest/gtest.h>
#include "cpp-httplib.h"
#include <memory>

std::unique_ptr<httplib::Server> create_server() {
    auto server = std::make_unique<httplib::Server>();
    server->Get("/api/health", [](const httplib::Request&, httplib::Response& res) {
        res.set_content("{ \"status\" : \"ok\" }", "application/json");
    });
    return server;
}

TEST(HealthCheckAPI, ReturnsOk) {
    auto server = create_server();

    std::thread t([&]() {
        server->listen("localhost", 1234);
    });

    std::this_thread::sleep_for(std::chrono::milliseconds(100));

    httplib::Client cli("localhost", 1234);
    auto res = cli.Get("/api/health");

    ASSERT_TRUE(res != nullptr);
    EXPECT_EQ(res->status, 200);
    EXPECT_EQ(res->body, "{ \"status\" : \"ok\" }");

    server->stop();
    t.join();
}
