cmake_minimum_required(VERSION 3.14)
project(stocksight-backend)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
    googletest
    URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
FetchContent_MakeAvailable(googletest)

add_executable(stocksight-backend main.cpp)

enable_testing()

add_executable(
  test_main
  test_main.cpp
)
target_link_libraries(
    test_main
    GTest::gtest_main
)

include(GoogleTest)
gtest_discover_tests(test_main)
