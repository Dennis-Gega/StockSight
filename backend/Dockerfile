# Use a slim Debian image with build tools
FROM debian:stable-slim

# Install necessary packages
RUN apt-get update && \
    apt-get install -y g++ cmake libpq-dev && \
    apt-get clean

# Set working directory
WORKDIR /app

# Copy backend folder contents into container
COPY . .

# Build the project just like you do locally
RUN mkdir -p build && \
    cd build && \
    cmake .. && \
    make -j4

# Render sets the PORT automatically
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start your backend binary
CMD ["/app/build/stocksight-backend"]
