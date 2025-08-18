#!/bin/bash

echo "🚀 Starting backend deployment..."

# Stop containers
echo "📦 Stopping containers..."
docker-compose down

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose build --no-cache
docker-compose up -d

# Clean up unused images
echo "🧹 Cleaning up unused images..."
docker system prune -f

echo "✅ Backend deployment completed successfully!"
echo "🌐 Backend API is now running at: https://server.ekowlabs.space"

