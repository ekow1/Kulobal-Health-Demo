#!/bin/bash

echo "🚀 Starting backend deployment..."

# Remove existing directory completely and create fresh
echo "📁 Setting up repository directory..."
rm -rf ~/kulobal-health-demo
mkdir -p ~/kulobal-health-demo
cd ~/kulobal-health-demo

# Clone the repository
echo "📥 Cloning repository..."
git clone https://github.com/ekowlabs/kulobal-health.git .

# Navigate to api directory
echo "📂 Navigating to api directory..."
cd api

# Stop existing stack
echo "🛑 Stopping existing stack..."
docker stack rm kulobal-stack || true

# Wait for stack to be removed
echo "⏳ Waiting for stack removal..."
sleep 10

# Build the backend image
echo "🔨 Building backend image..."
docker build -f Dockerfile.backend -t kulobal-backend:latest .

# Deploy the stack
echo "🚀 Deploying stack..."
docker stack deploy -c docker-compose.yml kulobal-stack

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check stack status
echo "📊 Checking stack status..."
docker stack services kulobal-stack

# Clean up unused images
echo "🧹 Cleaning up unused images..."
docker system prune -f

echo "✅ Backend deployment completed successfully!"
echo "🌐 Backend API is now running at: https://server.ekowlabs.space"
echo "📊 Stack status: docker stack services kulobal-stack"

