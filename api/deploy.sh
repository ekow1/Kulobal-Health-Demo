#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting backend deployment..."

# Remove existing directory completely and create fresh
echo "📁 Setting up repository directory..."
rm -rf ~/kulobal-health-demo
mkdir -p ~/kulobal-health-demo
cd ~/kulobal-health-demo

# Clone the repository
echo "📥 Cloning repository..."
git clone https://github.com/ekow1/Kulobal-Health-Demo.git .

# Navigate to api directory
echo "📂 Navigating to api directory..."
cd api

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found. Please ensure environment variables are set."
fi

# Stop existing stack
echo "🛑 Stopping existing stack..."
docker stack rm kulobal-stack || true

# Wait for stack to be removed
echo "⏳ Waiting for stack removal..."
sleep 15

# Build the backend image
echo "🔨 Building backend image..."
docker build -f Dockerfile.backend -t kulobal-backend:latest .

# Verify image was built successfully
if [ $? -eq 0 ]; then
    echo "✅ Backend image built successfully"
else
    echo "❌ Failed to build backend image"
    exit 1
fi

# Deploy the stack
echo "🚀 Deploying stack..."
docker stack deploy -c docker-compose.yml kulobal-stack

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 20

# Check stack status
echo "📊 Checking stack status..."
docker stack services kulobal-stack

# Wait a bit more and check service health
echo "🏥 Checking service health..."
sleep 10

# Check if services are running
echo "🔍 Verifying service status..."
docker service ls --filter "label=com.docker.stack.namespace=kulobal-stack"

# Check service logs for any errors
echo "📋 Recent service logs:"
docker service logs --tail 10 kulobal-stack_backend || true
docker service logs --tail 10 kulobal-stack_nginx || true

# Clean up unused images
echo "🧹 Cleaning up unused images..."
docker system prune -f

echo "✅ Backend deployment completed successfully!"
echo "🌐 Backend API is now running at: https://server.ekowlabs.space"
echo "📊 Stack status: docker stack services kulobal-stack"
echo "📋 Service logs: docker service logs kulobal-stack_backend"

