# Kulobal Health - Monorepo

This is a monorepo containing the Kulobal Health platform with separate frontend and backend applications.

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
Kulobal-Health/
├── frontend/          # Next.js Frontend Application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   ├── package.json   # Frontend dependencies
│   └── ...
├── api/              # Hono Backend API
│   ├── routes/       # API routes
│   ├── models/       # Database models
│   ├── middleware/   # Middleware
│   ├── config/       # Database and configuration
│   ├── package.json  # Backend dependencies
│   ├── docker-compose.yml  # Backend deployment
│   ├── nginx.conf    # Nginx configuration
│   └── ...
├── docker-compose.yml  # Docker services configuration
├── Dockerfile.backend  # Backend Docker image
├── nginx.conf         # Nginx reverse proxy configuration
├── ssl/               # SSL certificates directory
└── README.md         # This file
```

## Frontend (Next.js)

The frontend is a Next.js application located in the `frontend/` directory.

### Development

```bash
cd frontend
npm install
npm run dev
```

### Build

```bash
cd frontend
npm run build
```

## Backend API (Hono)

The backend is a Hono API located in the `api/` directory.

### Development

```bash
cd api
npm install
npm run dev
```

### Build

```bash
cd api
npm run build
```

## Deployment

The backend API includes complete Docker and GitHub Actions setup for deployment to a VPS.

### Backend Deployment

```bash
cd api
# Follow instructions in api/DEPLOYMENT.md
```

### Frontend Deployment

The frontend can be deployed to any platform that supports Next.js (Vercel, Netlify, etc.).

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://server.ekowlabs.space
```

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kulobal-health?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# API Configuration
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://demo.ekowlabs.space
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

## Technologies

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Hono, TypeScript, MongoDB, JWT
- **Deployment**: Docker, Docker Compose, Nginx, GitHub Actions

## 📝 License

This project is proprietary software.
