# Kulobal Health Backend API

A Node.js backend API built with Hono framework for the Kulobal Health platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- MongoDB database

### Local Development

1. **Install dependencies:**
   ```bash
   npm run install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

### Docker Deployment

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Stop services:**
   ```bash
   docker-compose down
   ```

## 📁 Project Structure

```
├── api/                 # Backend API source code
│   ├── config/         # Database and configuration
│   ├── middleware/     # Authentication middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   └── index.ts        # Main entry point
├── frontend/           # Frontend code (kept for reference)
├── docker-compose.yml  # Docker services configuration
├── Dockerfile.backend  # Backend Docker image
├── nginx.conf         # Nginx reverse proxy configuration
└── ssl/               # SSL certificates directory
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kulobal-health?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# API Configuration
PORT=5000
NODE_ENV=production
```

### SSL Certificates

Place your SSL certificates in the `ssl/` directory:
- `ssl/cert.pem` - SSL certificate
- `ssl/key.pem` - Private key

## 🌐 API Endpoints

- `GET /health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/products` - Get products
- `POST /api/orders` - Create order
- `GET /api/orders` - Get orders

## 🚀 Deployment

The project uses GitHub Actions for automated deployment to VPS.

### Required GitHub Secrets:
- `VPS_HOST` - VPS IP address
- `VPS_USERNAME` - SSH username
- `VPS_SSH_KEY` - SSH private key
- `VPS_SSH_PASSPHRASE` - SSH key passphrase
- `VPS_PORT` - SSH port (usually 22)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key

## 📝 License

This project is proprietary software.
