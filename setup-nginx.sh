#!/bin/bash

# Setup nginx configuration for Kulobal Health API
# This script should be run manually with sudo after the application is deployed

set -e

echo "🔧 Setting up nginx configuration..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run with sudo"
    exit 1
fi

# Remove default nginx sites
echo "🧹 Removing default nginx sites..."
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-available/default

# Copy nginx configuration
echo "📝 Copying nginx configuration..."
cp ~/nginx-config/kulobal-api.conf /etc/nginx/sites-available/kulobal-api

# Enable the site
echo "🔧 Enabling nginx site..."
ln -sf /etc/nginx/sites-available/kulobal-api /etc/nginx/sites-enabled/

# Test nginx configuration
echo "🔧 Testing nginx configuration..."
nginx -t

# Restart nginx
echo "🔄 Restarting nginx..."
systemctl restart nginx
systemctl enable nginx

# Verify nginx is running
echo "🔍 Verifying nginx status..."
systemctl status nginx --no-pager

echo "✅ Nginx setup completed successfully!"
echo "🌐 API is available at: https://server.ekowlabs.space"
