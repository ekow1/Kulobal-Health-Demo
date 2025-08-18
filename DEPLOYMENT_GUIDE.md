# 🚀 Kulobal Health Deployment Guide

This guide will help you deploy the Kulobal Health application to your VPS using Docker and GitHub Actions.

## 📋 Prerequisites

- A VPS with Ubuntu/Debian Linux
- Docker installed on the VPS
- GitHub repository with the application code
- SSH access to your VPS

## 🔧 Step 1: VPS Setup

### Install Docker on VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes to take effect
exit
# SSH back into your VPS
```

### Create Deployment Directory

```bash
sudo mkdir -p /opt/kulobal-health-demo
sudo chown $USER:$USER /opt/kulobal-health-demo
cd /opt/kulobal-health-demo
```

## 🔑 Step 2: SSH Key Setup

### Generate SSH Key (if needed)

```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/vps_deploy_key -N ""
```

### Add Public Key to VPS

```bash
# Copy your public key to the VPS
ssh-copy-id -i ~/.ssh/vps_deploy_key.pub username@your-vps-ip
```

### Test SSH Connection

```bash
ssh -i ~/.ssh/vps_deploy_key username@your-vps-ip
```

## 🔐 Step 3: GitHub Secrets Configuration

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

### Deployment Secrets
1. **VPS_HOST**: Your VPS IP address or domain
2. **VPS_USERNAME**: SSH username (e.g., `root` or your user)
3. **VPS_SSH_KEY**: Your private SSH key content
4. **VPS_SSH_PASSPHRASE**: Your SSH key passphrase (if any)
5. **VPS_PORT**: SSH port (usually `22`)

### Application Secrets
6. **MONGODB_URI**: Your MongoDB connection string
7. **JWT_SECRET**: A secure random string for JWT signing
8. **NEXT_PUBLIC_API_URL**: Your backend API URL

### Get Your Private Key Content

```bash
cat ~/.ssh/vps_deploy_key
```

Copy the entire output (including the BEGIN and END lines) to the `VPS_SSH_KEY` secret.

## 🌐 Step 4: Environment Configuration

The environment variables are automatically configured from GitHub secrets during deployment. No manual setup is required on the VPS.

### Required GitHub Secrets

Make sure you have these secrets configured in your GitHub repository:

1. **MONGODB_URI**: Your MongoDB connection string
   ```
   mongodb+srv://username:password@cluster.mongodb.net/kulobal-health?retryWrites=true&w=majority
   ```

2. **JWT_SECRET**: A secure random string for JWT signing
   ```
   your-super-secret-jwt-key-here
   ```

3. **NEXT_PUBLIC_API_URL**: Your backend API URL
   ```
   https://your-domain.com
   ```

### Automatic Configuration

The deployment script will automatically:
- Create the `.env` file on the VPS
- Populate it with values from your GitHub secrets
- Ensure proper file permissions
- Use these variables in the Docker containers

## 🚀 Step 5: Manual Deployment (Optional)

If you want to test deployment manually before setting up GitHub Actions:

```bash
# Make the deployment script executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

## 🔄 Step 6: GitHub Actions Deployment

1. Push your changes to the main branch
2. GitHub Actions will automatically:
   - Build the application
   - Build the API
   - Deploy to your VPS
   - Start the Docker containers

## 📊 Step 7: Verify Deployment

### Check Container Status

```bash
cd /opt/kulobal-health-demo
docker-compose ps
```

### Check Application Logs

```bash
# All containers
docker-compose logs

# Specific container
docker-compose logs frontend
docker-compose logs backend
docker-compose logs nginx
```

### Test Application

- Frontend: `http://your-domain.com`
- Backend API: `http://your-domain.com/api`
- Health check: `http://your-domain.com/api/health`

## 🔧 Step 8: SSL Configuration (Optional)

For production, you should set up SSL certificates:

1. Install Certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. Get SSL certificate:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. Update nginx configuration to use HTTPS

## 🛠️ Troubleshooting

### Common Issues

1. **SSH Authentication Failed**
   - Verify SSH key is in `~/.ssh/authorized_keys`
   - Check file permissions: `chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys`

2. **Docker Permission Denied**
   - Add user to docker group: `sudo usermod -aG docker $USER`
   - Logout and login again

3. **Port Already in Use**
   - Check what's using the port: `sudo netstat -tulpn | grep :80`
   - Stop conflicting services

4. **Environment Variables Not Working**
   - Verify GitHub secrets are properly configured
   - Check if `.env` file was created on VPS: `cat /opt/kulobal-health-demo/.env`
   - Restart containers: `docker-compose down && docker-compose up -d`

### Useful Commands

```bash
# View container logs
docker-compose logs -f

# Restart specific service
docker-compose restart frontend

# Update and redeploy
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check disk space
df -h

# Check Docker disk usage
docker system df
```

## 📝 Maintenance

### Regular Updates

1. The application will automatically update when you push to the main branch
2. Monitor logs for any issues
3. Regularly clean up Docker images: `docker system prune -a`

### Backup

Consider setting up regular backups of your:
- Database
- Environment configuration
- Application data

## 🆘 Support

If you encounter issues:

1. Check the GitHub Actions logs
2. Review container logs: `docker-compose logs`
3. Verify environment variables are correct
4. Ensure all prerequisites are met

---

**Note**: This deployment uses Docker Compose for easy management. For production environments, consider using Docker Swarm or Kubernetes for better scalability and reliability.
