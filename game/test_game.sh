#!/bin/bash

echo "🎮 Atrax-World Game Test Script"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is in use
check_port() {
    lsof -i :$1 >/dev/null 2>&1
}

echo "🔍 Checking prerequisites..."

# Check .NET
if command_exists dotnet; then
    echo -e "${GREEN}✅ .NET found: $(dotnet --version)${NC}"
else
    echo -e "${RED}❌ .NET not found${NC}"
    echo "Installing .NET..."
    curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --version 7.0.404
    export PATH="$PATH:/Users/doandothanhdanh/.dotnet"
fi

# Check MySQL
if command_exists mysql; then
    echo -e "${GREEN}✅ MySQL found${NC}"
else
    echo -e "${RED}❌ MySQL not found${NC}"
    echo "Please install MySQL: brew install mysql"
fi

# Check if game files exist
GAME_DIR="/Users/doandothanhdanh/Desktop/zah project/cs/Atrax-World/game"
if [ -d "$GAME_DIR/Client" ]; then
    echo -e "${GREEN}✅ Unity Client found${NC}"
else
    echo -e "${YELLOW}⚠️ Unity Client not found - please copy from clash-of-clans-clone${NC}"
fi

if [ -d "$GAME_DIR/Server" ]; then
    echo -e "${GREEN}✅ Game Server found${NC}"
else
    echo -e "${YELLOW}⚠️ Game Server not found - please copy from clash-of-clans-clone${NC}"
fi

if [ -d "$GAME_DIR/Database" ]; then
    echo -e "${GREEN}✅ Database schema found${NC}"
else
    echo -e "${YELLOW}⚠️ Database schema not found - please copy from clash-of-clans-clone${NC}"
fi

echo ""
echo "🚀 Starting game server..."

# Start MySQL if not running
if ! check_port 3306; then
    echo "Starting MySQL..."
    brew services start mysql
    sleep 3
fi

# Setup database
echo "Setting up database..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS clash_of_whatever;" 2>/dev/null || echo "Database setup failed"

# Start game server
SERVER_DIR="$GAME_DIR/Server"
if [ -d "$SERVER_DIR" ]; then
    echo "Starting game server from $SERVER_DIR..."
    cd "$SERVER_DIR"
    export PATH="$PATH:/Users/doandothanhdanh/.dotnet"
    
    echo "Restoring packages..."
    dotnet restore
    
    echo "Building project..."
    dotnet build
    
    echo "Starting server..."
    echo -e "${GREEN}🎮 Game server starting on port 5555...${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
    dotnet run
else
    echo -e "${RED}❌ Server directory not found: $SERVER_DIR${NC}"
    echo "Please copy Server folder from clash-of-clans-clone first"
fi
