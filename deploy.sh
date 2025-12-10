#!/bin/bash

# Noir Portfolio - Production Deployment Script
# Run this script on your server to update the application

set -e

echo "🚀 Noir Portfolio - Production Deployment"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/opt/noir-portfolio"
BACKUP_DIR="/opt/noir-portfolio-backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo -e "${BLUE}📁 Application directory: ${APP_DIR}${NC}"
echo -e "${BLUE}💾 Backup directory: ${BACKUP_DIR}${NC}"
echo -e "${BLUE}🕐 Timestamp: ${TIMESTAMP}${NC}"

# Check if we're in the right directory
if [ ! -f "docker-compose.prod.yml" ]; then
    echo -e "${RED}❌ Error: docker-compose.prod.yml not found. Are you in the right directory?${NC}"
    exit 1
fi

# Create backup directory if it doesn't exist
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${YELLOW}📁 Creating backup directory...${NC}"
    mkdir -p "$BACKUP_DIR"
fi

# Backup current database (if exists)
if [ -f ".env.prod" ]; then
    echo -e "${YELLOW}💾 Creating database backup...${NC}"
    # Note: Add database backup logic here if needed
    # docker exec noir_portfolio_db_prod pg_dump -U noir_user noir_portfolio_prod > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"
fi

# Pull latest changes from git
echo -e "${BLUE}📥 Pulling latest changes from git...${NC}"
git pull origin main

# Check if .env.prod exists
if [ ! -f ".env.prod" ]; then
    echo -e "${RED}⚠️  Warning: .env.prod not found. Creating from template...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env.prod
        echo -e "${YELLOW}✏️  Please edit .env.prod with your production values before continuing.${NC}"
        echo -e "${YELLOW}   Required variables: DB_PASSWORD, JWT_SECRET, etc.${NC}"
        read -p "Press Enter when you've configured .env.prod..."
    else
        echo -e "${RED}❌ Error: .env.example not found. Cannot continue.${NC}"
        exit 1
    fi
fi

# Load environment variables
if [ -f ".env.prod" ]; then
    export $(grep -v '^#' .env.prod | xargs)
fi

# Stop current containers
echo -e "${BLUE}🛑 Stopping current containers...${NC}"
docker-compose -f docker-compose.prod.yml down

# Remove old images (optional, for cleanup)
echo -e "${BLUE}🧹 Cleaning up old images...${NC}"
docker image prune -f

# Start new containers
echo -e "${GREEN}🚀 Starting new containers...${NC}"
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to be healthy
echo -e "${BLUE}⏳ Waiting for services to be healthy...${NC}"
sleep 30

# Check if services are running
if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"

    # Show status
    echo -e "${BLUE}📊 Service Status:${NC}"
    docker-compose -f docker-compose.prod.yml ps

    # Show logs (last 20 lines)
    echo -e "${BLUE}📝 Recent logs:${NC}"
    docker-compose -f docker-compose.prod.yml logs --tail=20 -f app | head -20

    echo -e "${GREEN}🎉 Noir Portfolio is now running in production!${NC}"
    echo -e "${GREEN}🌐 Visit your site to see the updates.${NC}"

else
    echo -e "${RED}❌ Deployment failed. Check logs:${NC}"
    docker-compose -f docker-compose.prod.yml logs
    exit 1
fi

# Optional: Send notification (uncomment and configure)
# curl -X POST -H 'Content-type: application/json' \
#      --data '{"text":"Noir Portfolio deployed successfully!"}' \
#      YOUR_SLACK_WEBHOOK_URL
