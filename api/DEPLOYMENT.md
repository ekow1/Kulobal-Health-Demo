# Backend API Deployment Guide

This guide covers the deployment of the Kulobal Health Backend API to a VPS using Docker and GitHub Actions.

## Prerequisites

- VPS with Ubuntu 20.04+ 
- Docker and Docker Compose installed
- Git installed
- Domain name pointing to your VPS (server.ekowlabs.space)

## VPS Setup

### 1. Install Docker and Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes to take effect
exit
```

### 2. Clone Repository

```bash
# Create directory
sudo mkdir -p /opt/kulobal-health-demo
sudo chown $USER:$USER /opt/kulobal-health-demo

# Clone repository
cd /opt/kulobal-health-demo
git clone https://github.com/ekow1/Kulobal-Health-Demo.git .
```

### 3. Navigate to API Directory

```bash
cd /opt/kulobal-health-demo/api
```

### 4. Environment Setup

```bash
# Copy environment example
cp env.example .env

# Edit environment variables
nano .env
```

Required environment variables:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kulobal-health
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://demo.ekowlabs.space
PORT=5000
NODE_ENV=production
```

### 5. Install Dependencies

```bash
npm install
```

## GitHub Actions Setup

### 1. Repository Secrets

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

- `VPS_HOST`: Your VPS IP address
- `VPS_USERNAME`: Your VPS username
- `VPS_SSH_KEY`: Your private SSH key
- `VPS_PORT`: SSH port (usually 22)

### 2. SSH Key Setup

```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Copy public key to VPS
ssh-copy-id -i ~/.ssh/id_rsa.pub username@your-vps-ip

# Copy private key content for GitHub secret
cat ~/.ssh/id_rsa
```

## Manual Deployment

### 1. Build and Start Containers

```bash
cd /opt/kulobal-health-demo/api

# Build and start
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 2. Update Deployment

```bash
cd /opt/kulobal-health-demo/api

# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Clean up
docker system prune -f
```

## SSL Certificate Setup

### 1. Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Get SSL Certificate

```bash
sudo certbot --nginx -d server.ekowlabs.space
```

### 3. Update Nginx Configuration

After getting SSL certificates, uncomment the HTTPS section in `nginx.conf` and update the certificate paths.

## Monitoring and Maintenance

### 1. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f nginx
```

### 2. Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### 3. Update Application

```bash
cd /opt/kulobal-health-demo/api
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Troubleshooting

### 1. Port Conflicts

If ports 80 or 5000 are in use:

```bash
# Check what's using the ports
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :5000

# Stop conflicting services
sudo systemctl stop nginx  # if nginx is running
```

### 2. Permission Issues

```bash
# Fix file permissions
sudo chown -R $USER:$USER /opt/kulobal-health-demo
chmod +x deploy.sh
```

### 3. Docker Issues

```bash
# Clean up Docker
docker system prune -a
docker volume prune

# Restart Docker
sudo systemctl restart docker
```

## Health Check

Test your API deployment:

```bash
# Health check
curl http://server.ekowlabs.space/health

# API endpoint
curl http://server.ekowlabs.space/api/health
```

## Security Notes

- Keep your `.env` file secure and never commit it
- Regularly update dependencies
- Monitor logs for suspicious activity
- Use strong JWT secrets
- Enable firewall rules
- Keep system updated
