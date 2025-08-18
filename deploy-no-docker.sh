#!/bin/bash

# Deploy Kulobal Health API without Docker
# This script sets up the backend directly on the VPS

set -e

echo "🚀 Starting deployment without Docker..."

# Ensure sudo can run without password (or run as root)
echo "🔧 Checking sudo permissions..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update -y
sudo apt upgrade -y

# Install curl if not present
echo "📦 Installing curl..."
sudo apt install -y curl

# Install Node.js v24
echo "📦 Installing Node.js v24..."
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
echo "🔍 Verifying Node.js installation..."
node -v
npm -v

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install nginx
echo "📦 Installing nginx..."
sudo apt install -y nginx

# Create application directory
echo "📁 Setting up application directory..."
sudo mkdir -p /var/www/kulobal-api
sudo chown $USER:$USER /var/www/kulobal-api

# Clone repository
echo "📥 Cloning repository..."
cd /var/www/kulobal-api
rm -rf ./* 2>/dev/null || true
git clone https://github.com/ekow1/Kulobal-Health-Demo.git .
cd api

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm ci --only=production

# Create environment file
echo "🔧 Creating environment file..."
cat > .env << EOF
NODE_ENV=production
PORT=5000
MONGODB_URI=${MONGODB_URI}
JWT_SECRET=${JWT_SECRET}
CORS_ORIGIN=https://demo.ekowlabs.space
EOF

# Setup nginx configuration
echo "🔧 Setting up nginx configuration..."

# Remove default nginx sites
echo "🧹 Removing default nginx sites..."
sudo rm -f /etc/nginx/sites-enabled/default
sudo rm -f /etc/nginx/sites-available/default

# Create our custom nginx site
echo "📝 Creating custom nginx site..."
sudo tee /etc/nginx/sites-available/kulobal-api << EOF
# Rate limiting
limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name server.ekowlabs.space;
    return 301 https://\$server_name\$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name server.ekowlabs.space;

    # SSL configuration
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:50m;
    ssl_session_timeout 10m;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # CORS headers
    add_header Access-Control-Allow-Origin "https://demo.ekowlabs.space" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, PATCH, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
    add_header Access-Control-Allow-Credentials "true" always;

    # Handle preflight requests
    if (\$request_method = OPTIONS) {
        return 204;
    }

    # Health endpoint
    location = /health {
        proxy_pass http://localhost:5000/health;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        access_log off;
    }

    # API routes
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        access_log /var/log/nginx/api_access.log;
        error_log /var/log/nginx/api_error.log warn;
    }

    # Default root
    location / {
        return 200 "Kulobal Health API running. Use /api/* or /health.\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Enable the site
echo "🔧 Enabling nginx site..."
sudo ln -sf /etc/nginx/sites-available/kulobal-api /etc/nginx/sites-enabled/

# Test nginx configuration
echo "🔧 Testing nginx configuration..."
sudo nginx -t

# Stop any existing nginx processes
echo "🔄 Stopping existing nginx processes..."
sudo systemctl stop nginx || true
sudo pkill nginx || true

# Start the application with PM2
echo "🚀 Starting application with PM2..."
pm2 delete kulobal-api 2>/dev/null || true
pm2 start index.js --name kulobal-api --env production
pm2 save
pm2 startup

# Start and enable nginx
echo "🔄 Starting and enabling nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify nginx is running
echo "🔍 Verifying nginx status..."
sudo systemctl status nginx --no-pager

# Show status
echo "📊 Application status:"
pm2 status
echo "📊 Nginx status:"
sudo systemctl status nginx --no-pager

echo "✅ Deployment completed successfully!"
echo "🌐 API is available at: https://server.ekowlabs.space"
echo "📊 PM2 logs: pm2 logs kulobal-api"
echo "🔄 Restart app: pm2 restart kulobal-api"
echo "🔄 Restart nginx: sudo systemctl restart nginx"
