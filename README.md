# Kulobal Health - Monorepo

This is a monorepo containing the Kulobal Health platform with separate frontend and backend applications, deployed on Vercel.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB database

### Local Development

1. **Install dependencies:**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../api
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Backend environment
   cd api
   cp env.example .env
   # Edit .env with your configuration
   
   # Frontend environment
   cd ../frontend
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start development servers:**
   ```bash
   # Start backend (in api directory)
   cd api
   npm run dev
   
   # Start frontend (in frontend directory)
   cd ../frontend
   npm run dev
   ```

## 📁 Project Structure

```
Kulobal-Health/
├── frontend/          # Next.js Frontend Application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   ├── package.json   # Frontend dependencies
│   ├── vercel.json    # Vercel configuration
│   └── ...
├── api/              # Hono Backend API
│   ├── routes/       # API routes
│   ├── models/       # Database models
│   ├── middleware/   # Middleware
│   ├── config/       # Database and configuration
│   ├── package.json  # Backend dependencies
│   ├── vercel.json   # Vercel configuration
│   └── ...
├── vercel.json       # Root Vercel configuration
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

## 🚀 Deployment with Vercel

This project is configured for deployment on Vercel with both frontend and backend.

### Prerequisites
- Vercel account
- MongoDB database (MongoDB Atlas recommended)

### Deployment Steps

1. **Connect to Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   ```

2. **Deploy the entire project:**
   ```bash
   # From the root directory
   vercel
   ```

3. **Set environment variables in Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add the following variables:
     - `MONGODB_URI` - Your MongoDB connection string
     - `JWT_SECRET` - Your JWT secret key
     - `NODE_ENV` - Set to "production"

### Separate Deployments

You can also deploy frontend and backend separately:

**Backend only:**
```bash
cd api
vercel
```

**Frontend only:**
```bash
cd frontend
vercel
```

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://backend.kulobalhealth.com
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
CORS_ORIGIN=https://frontend.kulobalhealth.com
```

## 🌐 API Endpoints

- `GET /health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/products` - Get products
- `POST /api/orders` - Create order
- `GET /api/orders` - Get orders

## Technologies

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Hono, TypeScript, MongoDB, JWT
- **Deployment**: Vercel

## 📝 License

This project is proprietary software.
