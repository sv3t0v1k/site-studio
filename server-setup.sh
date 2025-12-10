#!/bin/bash

# Noir Portfolio - Server Initial Setup Script
# Run this script on your server to set up the production environment

set -e

echo "🚀 Noir Portfolio - Server Setup"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if running as root or with sudo
if [ "$EUID" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Running as root. This is not recommended for security reasons.${NC}"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Update system
echo -e "${BLUE}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install required packages
echo -e "${BLUE}📦 Installing required packages...${NC}"
sudo apt install -y curl wget git docker.io docker-compose nginx certbot python3-certbot-nginx ufw

# Start and enable Docker
echo -e "${BLUE}🐳 Starting Docker service...${NC}"
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group
echo -e "${BLUE}👤 Adding user to docker group...${NC}"
sudo usermod -aG docker $USER
echo -e "${YELLOW}⚠️  You may need to log out and back in for docker group changes to take effect.${NC}"

# Create application directory in user's home
echo -e "${BLUE}📁 Creating application directory...${NC}"
APP_DIR="$HOME/noir-portfolio"
BACKUP_DIR="$HOME/noir-portfolio-backups"

mkdir -p "$APP_DIR"
mkdir -p "$BACKUP_DIR"

echo -e "${GREEN}✅ Application directory: $APP_DIR${NC}"
echo -e "${GREEN}✅ Backup directory: $BACKUP_DIR${NC}"

# Configure firewall
echo -e "${BLUE}🔥 Configuring firewall...${NC}"
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000

# Install Node.js (for local development/testing)
echo -e "${BLUE}📦 Installing Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
echo -e "${BLUE}📥 Cloning repository...${NC}"
cd /opt/noir-portfolio
if [ ! -d ".git" ]; then
    git clone https://github.com/YOUR_USERNAME/noir-portfolio.git .
    echo -e "${YELLOW}⚠️  Please update the repository URL in this script with your actual GitHub repository.${NC}"
else
    echo -e "${GREEN}✅ Repository already cloned${NC}"
fi

# Create SSL directory
echo -e "${BLUE}🔒 Creating SSL directory...${NC}"
mkdir -p ssl

# Create initial .env.prod file
if [ ! -f ".env.prod" ]; then
    echo -e "${BLUE}📝 Creating initial .env.prod...${NC}"
    cp env-prod-example.txt .env.prod
    echo -e "${YELLOW}⚠️  Please edit /opt/noir-portfolio/.env.prod with your actual production values.${NC}"
fi

# Make scripts executable
echo -e "${BLUE}🔧 Making scripts executable...${NC}"
chmod +x deploy.sh

# Create systemd service for automatic updates (optional)
echo -e "${BLUE}⚙️  Creating systemd service for auto-updates...${NC}"
sudo tee /etc/systemd/system/noir-portfolio-update.service > /dev/null <<EOF
[Unit]
Description=Noir Portfolio Auto Update
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
User=$USER
WorkingDirectory=$HOME/noir-portfolio
ExecStart=$HOME/noir-portfolio/deploy.sh
EOF

sudo tee /etc/systemd/system/noir-portfolio-update.timer > /dev/null <<EOF
[Unit]
Description=Run Noir Portfolio updates daily
Requires=noir-portfolio-update.service

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
EOF

# Enable timer (optional)
echo -e "${YELLOW}⏰ Optional: Enable daily auto-updates${NC}"
read -p "Enable automatic daily updates? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo systemctl enable noir-portfolio-update.timer
    echo -e "${GREEN}✅ Daily auto-updates enabled${NC}"
fi

# Setup log rotation
echo -e "${BLUE}📝 Setting up log rotation...${NC}"
sudo tee /etc/logrotate.d/noir-portfolio > /dev/null <<EOF
$HOME/noir-portfolio/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}
EOF

echo ""
echo -e "${GREEN}🎉 Server setup completed!${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Edit $HOME/noir-portfolio/.env.prod with your production values"
echo "2. Update the GitHub repository URL in deploy.sh"
echo "3. Run initial deployment: cd $HOME/noir-portfolio && ./deploy.sh"
echo "4. Set up domain and SSL certificates if needed"
echo "5. Configure monitoring and backups"
echo ""
echo -e "${BLUE}🔗 Useful commands:${NC}"
echo "• View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "• Restart: docker-compose -f docker-compose.prod.yml restart"
echo "• Update: cd $HOME/noir-portfolio && ./deploy.sh"
echo "• Backup: docker exec noir_portfolio_db_prod pg_dump -U noir_user noir_portfolio_prod > backup.sql"
echo ""
echo -e "${GREEN}🚀 Your Noir Portfolio server is ready for deployment!${NC}"
