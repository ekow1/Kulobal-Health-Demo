# Kulobal Health Backend API

A Node.js backend API for the Kulobal Health platform built with Hono framework and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB database
- Docker (for production deployment)

### Local Development

1. **Install dependencies:**
   ```bash
   cd api
   npm ci
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

The API will be available at `http://localhost:5000`

### Production Deployment

#### Using Docker

1. **Build and run with Docker Compose:**
   ```bash
   docker compose up -d
   ```

2. **Or build manually:**
   ```bash
   docker build -f Dockerfile.backend -t kulobal-backend .
   docker run -p 5000:5000 --env-file .env kulobal-backend
   ```

#### Using GitHub Actions

The repository includes GitHub Actions for automatic deployment to VPS:

1. Set up GitHub Secrets:
   - `VPS_HOST`: Your VPS IP address
   - `VPS_USERNAME`: SSH username
   - `VPS_SSH_KEY`: Private SSH key
   - `VPS_SSH_PASSPHRASE`: SSH key passphrase (if any)
   - `VPS_PORT`: SSH port (usually 22)
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: JWT secret key

2. Push to `main` branch to trigger deployment

## 📁 Project Structure

```
├── api/                    # Backend API code
│   ├── config/            # Database configuration
│   ├── middleware/        # Authentication middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── package.json      # Backend dependencies
│   └── tsconfig.json     # TypeScript configuration
├── .github/workflows/    # GitHub Actions
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile.backend    # Backend Dockerfile
└── package.json          # Root package.json
```

## 🔧 API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/products` - Get products
- `POST /api/orders` - Create order
- `GET /api/payments` - Get payments

## 🛠️ Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run install:all` - Install all dependencies

## 🔒 Environment Variables

Required environment variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=production
```

## 📦 Docker

The backend is containerized using Docker:

- **Development:** `docker compose up`
- **Production:** `docker compose up -d`

The container exposes port 5000 and includes all necessary dependencies.
