#!/bin/bash

# Deploy script for Kulobal Health
echo "🚀 Starting deployment..."

# Stop existing containers
echo "📦 Stopping existing containers..."
docker-compose down

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Build and start containers
echo "🔨 Building containers..."
docker-compose build --no-cache

echo "🚀 Starting containers..."
docker-compose up -d

# Clean up unused images
echo "🧹 Cleaning up..."
docker system prune -f

echo "✅ Deployment completed!"
echo "🌐 Application should be available at: http://your-domain.com"
