#!/bin/bash

# AI Prompt Marketplace - Demo Mode Startup Script
# This script starts all required services for demo mode

echo "🚀 Starting AI Prompt Marketplace in DEMO MODE..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB not running. Starting MongoDB as replica set...${NC}"
    mongod --replSet rs0 --port 27017 --dbpath /opt/homebrew/var/mongodb --bind_ip localhost --fork --logpath /opt/homebrew/var/log/mongodb/mongo.log
    sleep 2
    mongosh --eval "rs.initiate()" 2>/dev/null || echo "Replica set already initialized"
    echo -e "${GREEN}✅ MongoDB started${NC}"
else
    echo -e "${GREEN}✅ MongoDB already running${NC}"
fi

# Check if Next.js is running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null; then
    echo -e "${YELLOW}⚠️  Port 3000 is already in use${NC}"
    echo "   Kill existing process? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        lsof -ti:3000 | xargs kill -9
        echo -e "${GREEN}✅ Killed existing process${NC}"
    fi
fi

# Start Next.js dev server
echo ""
echo -e "${GREEN}🎯 Starting Next.js development server...${NC}"
echo -e "${YELLOW}📍 Open http://localhost:3000 when ready${NC}"
echo ""

export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
npm run dev
