#!/bin/bash

# Deploy Kulobal Health API (Node.js and PM2 already installed)
# This script deploys the application and configures nginx

set -e

echo "🚀 Starting application deployment..."

# Set environment variables (these should be passed from GitHub Actions)
export MONGODB_URI=${MONGODB_URI}
export JWT_SECRET=${JWT_SECRET}

# Create application directory in user's home
echo "📁 Setting up application directory..."
mkdir -p ~/kulobal-api

# Clone repository
echo "📥 Cloning repository..."
cd ~/kulobal-api
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

# Setup nginx configuration (without sudo)
echo "🔧 Setting up nginx configuration..."

# Create nginx config in user directory
echo "📝 Creating nginx configuration..."
mkdir -p ~/nginx-config
cat > ~/nginx-config/kulobal-api.conf << EOF
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

echo "📋 Nginx configuration created at ~/nginx-config/kulobal-api.conf"
echo "📋 Please manually copy this configuration to /etc/nginx/sites-available/ and enable it"

# Start the application with PM2
echo "🚀 Starting application with PM2..."
pm2 delete kulobal-api 2>/dev/null || true
pm2 start index.js --name kulobal-api --env production
pm2 save
pm2 startup

# Show status
echo "📊 Application status:"
pm2 status

echo "✅ Application deployment completed successfully!"
echo "🌐 Application is running on port 5000"
echo "📊 PM2 logs: pm2 logs kulobal-api"
echo "🔄 Restart app: pm2 restart kulobal-api"
echo ""
echo "📋 Manual nginx setup required:"
echo "1. Copy ~/nginx-config/kulobal-api.conf to /etc/nginx/sites-available/"
echo "2. Enable: sudo ln -sf /etc/nginx/sites-available/kulobal-api /etc/nginx/sites-enabled/"
echo "3. Test: sudo nginx -t"
echo "4. Restart: sudo systemctl restart nginx"
