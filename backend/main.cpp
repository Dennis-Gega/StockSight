#include "cpp-httplib.h"
#include "json.hpp"

int main() {
    httplib::Server server;

    server.Get("/api/health", [](const httplib::Request& request, httplib::Response& response) {
        response.set_content("{ \"status\" : \"ok\" }", "application/json");
    });

    server.Get("/api/stocks", [](const httplib::Request& request ,httplib::Response& response) {
        if (request.has_param("symbol")) {
            std::string symbol = request.get_param_value("symbol");

            nlohmann::json j;
            j["symbol"] = symbol;
            j["time"] = "10:00am";
            j["open"] = 100.00;
            j["high"] = 103.18;
            j["low"] = 99.81;
            j["close"] = 103.05;
            j["volume"] = 10000;

            response.set_content(j.dump(), "application/json");
        }
    });

    server.listen("localhost", 1234);
}
