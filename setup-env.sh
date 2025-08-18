#!/bin/bash

# Environment setup script for Kulobal Health
echo "🔧 Setting up environment variables for Kulobal Health..."

# Configuration
DEPLOY_DIR="/opt/kulobal-health-demo"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    print_warning "docker-compose.yml not found. Make sure you're in the project directory."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file from template..."
    if [ -f "env.example" ]; then
        cp env.example .env
        print_status ".env file created successfully!"
        print_warning "Please edit the .env file with your actual configuration values:"
        echo ""
        echo "Required environment variables:"
        echo "  - MONGODB_URI: Your MongoDB connection string"
        echo "  - JWT_SECRET: A secure random string for JWT signing"
        echo "  - NEXT_PUBLIC_API_URL: Your backend API URL"
        echo ""
        echo "You can edit the file with: nano .env"
    else
        print_warning "env.example not found. Creating basic .env file..."
        cat > .env << EOF
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kulobal-health?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# API Configuration
PORT=5000
NODE_ENV=production

# Frontend Configuration
NEXT_PUBLIC_API_URL=https://your-domain.com
EOF
        print_status "Basic .env file created!"
        print_warning "Please update the values in the .env file."
    fi
else
    print_status ".env file already exists."
fi

# Set proper permissions
chmod 600 .env

print_status "Environment setup completed!"
print_status "Next steps:"
echo "  1. Edit the .env file with your actual values"
echo "  2. Run the deployment script: ./deploy.sh"
