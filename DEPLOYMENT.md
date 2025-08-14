# Deployment Guide

## Prerequisites

- VPS with Docker and Docker Compose installed
- MongoDB Atlas connection string
- Domain name (optional)

## VPS Setup

1. **Install Docker and Docker Compose**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
```

2. **Clone the repository**
```bash
cd /opt
sudo git clone https://github.com/ekow1/Kulobal-Health-Demo.git kulobal-health-demo
sudo chown -R $USER:$USER kulobal-health-demo
cd kulobal-health-demo
```

3. **Set up environment variables**
```bash
cp env.example .env
nano .env
```

Fill in your MongoDB connection string and JWT secret.

## GitHub Actions Setup

1. **Add repository secrets** in GitHub:
   - `VPS_HOST`: Your VPS IP address
   - `VPS_USERNAME`: SSH username
   - `VPS_SSH_KEY`: Private SSH key
   - `VPS_PORT`: SSH port (usually 22)

2. **Generate SSH key for deployment**
```bash
ssh-keygen -t rsa -b 4096 -C "deployment@kulobal-health"
```

3. **Add public key to VPS**
```bash
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
```

4. **Add private key to GitHub secrets** as `VPS_SSH_KEY`

## Manual Deployment

If you prefer manual deployment:

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

## SSL Setup (Optional)

1. **Install Certbot**
```bash
sudo apt install certbot python3-certbot-nginx -y
```

2. **Get SSL certificate**
```bash
sudo certbot --nginx -d yourdomain.com
```

3. **Update nginx.conf** to include SSL configuration

## Monitoring

Check container status:
```bash
docker-compose ps
```

View logs:
```bash
docker-compose logs -f
```

## Troubleshooting

1. **Port conflicts**: Ensure ports 80, 443, 3000, and 5000 are available
2. **Permission issues**: Check file ownership and permissions
3. **Build failures**: Check Docker logs for specific errors
4. **Database connection**: Verify MongoDB URI and network connectivity
