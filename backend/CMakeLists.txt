cmake_minimum_required(VERSION 3.14)
project(stocksight-backend)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# -------------------------------
# Include directories (your .hpp)
# -------------------------------
include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    ${CMAKE_CURRENT_SOURCE_DIR}
)

# -------------------------------
# Backend source files
# -------------------------------
set(SOURCES
    main.cpp
    src/db.cpp
    src/indicators.cpp
    src/util.cpp
)

# -------------------------------
# Build backend executable
# -------------------------------
add_executable(stocksight-backend ${SOURCES})

# ------------------------------------------------
# GoogleTest (same as your original)
# ------------------------------------------------
include(FetchContent)
FetchContent_Declare(
    googletest
    URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
FetchContent_MakeAvailable(googletest)

enable_testing()

# Test executable
add_executable(
    test_main
    test_main.cpp
    src/db.cpp
    src/indicators.cpp
    src/util.cpp
)

# Link test executable with GoogleTest
target_link_libraries(
    test_main
    GTest::gtest_main
)

include(GoogleTest)
gtest_discover_tests(test_main)
