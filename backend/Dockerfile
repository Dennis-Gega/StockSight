# Base Debian system
FROM debian:stable-slim

# Install tools + PostgreSQL libs
RUN apt-get update && \
    apt-get install -y g++ cmake make pkg-config \
    libpq-dev libpqxx-dev && \
    apt-get clean

# Set working directory inside container
WORKDIR /app

# Copy backend folder content into container
COPY . .

# Build using CMake (same as you do locally)
RUN mkdir -p build && \
    cd build && \
    cmake .. && \
    make -j4

# Render exposes PORT automatically
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start backend
CMD ["/app/build/stocksight-backend"]
