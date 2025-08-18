#!/bin/bash

# Update Kulobal Health API without Docker
# This script updates the backend application

set -e

echo "🔄 Starting application update..."

# Navigate to application directory
cd /var/www/kulobal-api

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Navigate to api directory
cd api

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Restart the application
echo "🔄 Restarting application..."
pm2 restart kulobal-api

# Show status
echo "📊 Application status:"
pm2 status

echo "✅ Update completed successfully!"
echo "📊 PM2 logs: pm2 logs kulobal-api"
