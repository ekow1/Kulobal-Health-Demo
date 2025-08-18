# Kulobal Health - Monorepo

This is a monorepo containing the Kulobal Health platform with separate frontend and backend applications.

## Project Structure

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
│   ├── package.json  # Backend dependencies
│   ├── docker-compose.yml  # Backend deployment
│   ├── nginx.conf    # Nginx configuration
│   └── ...
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
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kulobal-health
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://demo.ekowlabs.space
PORT=5000
NODE_ENV=production
```

## Technologies

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Hono, TypeScript, MongoDB, JWT
- **Deployment**: Docker, Docker Compose, Nginx, GitHub Actions

## License

MIT
