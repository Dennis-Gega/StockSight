cmake_minimum_required(VERSION 3.14)
project(stocksight-backend)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# ------------------------------------
# Include headers
# ------------------------------------
include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    ${CMAKE_CURRENT_SOURCE_DIR}
)

# ------------------------------------
# Locate libpqxx / libpq (Postgres client)
# ------------------------------------
find_package(PkgConfig REQUIRED)
pkg_check_modules(LIBPQXX REQUIRED libpqxx)

include_directories(${LIBPQXX_INCLUDE_DIRS})
link_directories(${LIBPQXX_LIBRARY_DIRS})

# ------------------------------------
# Backend source files
# ------------------------------------
set(SOURCES
    main.cpp
    src/db.cpp
    src/util.cpp
    src/indicators.cpp
)

# ------------------------------------
# Build backend executable
# ------------------------------------
add_executable(stocksight-backend ${SOURCES})

target_link_libraries(
    stocksight-backend
    ${LIBPQXX_LIBRARIES}
    pq
)

# ------------------------------------
# GoogleTest config
# ------------------------------------
include(FetchContent)
FetchContent_Declare(
    googletest
    URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
FetchContent_MakeAvailable(googletest)

enable_testing()

add_executable(
    test_main
    test_main.cpp
    src/db.cpp
    src/util.cpp
    src/indicators.cpp
)

target_link_libraries(
    test_main
    GTest::gtest_main
    ${LIBPQXX_LIBRARIES}
    pq
)

include(GoogleTest)
gtest_discover_tests(test_main)
