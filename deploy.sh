#!/bin/bash

# Deployment script for Kulobal Health
set -e

echo "🚀 Starting Kulobal Health deployment..."

# Configuration
DEPLOY_DIR="/opt/kulobal-health-demo"
REPO_URL="https://github.com/ekowf/Kulobal-Health-Demo.git"
BRANCH="main"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root"
    exit 1
fi

print_status "Current user: $(whoami)"
print_status "Current directory: $(pwd)"

# Create deployment directory if it doesn't exist
if [ ! -d "$DEPLOY_DIR" ]; then
    print_status "Creating deployment directory: $DEPLOY_DIR"
    sudo mkdir -p "$DEPLOY_DIR"
    sudo chown $USER:$USER "$DEPLOY_DIR"
fi

# Change to deployment directory
cd "$DEPLOY_DIR"
print_status "Changed to directory: $(pwd)"

# Check if it's a git repository
if [ ! -d ".git" ]; then
    print_status "Cloning repository from $REPO_URL"
    git clone "$REPO_URL" .
else
    print_status "Pulling latest changes from $BRANCH branch"
    git fetch origin
    git reset --hard origin/$BRANCH
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    print_warning "Docker Compose not found. Installing..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_status "Docker Compose installed successfully"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from example..."
    if [ -f "env.example" ]; then
        cp env.example .env
        print_warning "Please update the .env file with your configuration"
    else
        print_error "No .env.example file found. Please create a .env file manually."
        exit 1
    fi
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down --remove-orphans || print_warning "No containers to stop"

# Build containers
print_status "Building containers..."
docker-compose build --no-cache

# Start containers
print_status "Starting containers..."
docker-compose up -d

# Wait for containers to be healthy
print_status "Waiting for containers to be ready..."
sleep 10

# Check container status
print_status "Checking container status..."
docker-compose ps

# Clean up Docker system
print_status "Cleaning up Docker system..."
docker system prune -f

print_status "✅ Deployment completed successfully!"
print_status "Your application should be available at:"
print_status "  - Frontend: http://your-domain.com"
print_status "  - Backend API: http://your-domain.com/api"

# Show logs for debugging
print_status "Recent container logs:"
docker-compose logs --tail=20

