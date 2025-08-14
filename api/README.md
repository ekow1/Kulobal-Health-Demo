# Kulobal Health API

A modern, fast, and secure API for the Kulobal Health pharmaceutical platform built with Hono, MongoDB, and Mongoose.

## Features

- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 💳 **Payment Processing** - Complete payment management system
- 🏥 **User Management** - Pharmacy and supplier user management
- 📊 **Data Validation** - Zod schema validation for all inputs
- 🔒 **Role-based Access Control** - Different permissions for different user types
- 🚀 **High Performance** - Built with Hono for optimal performance
- 📝 **Comprehensive Logging** - Request logging and error tracking
- 🛡️ **Security** - CORS, secure headers, and input sanitization

## Tech Stack

- **Framework**: Hono (Fast, lightweight web framework)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod schema validation
- **Password Hashing**: bcryptjs
- **Runtime**: Bun (Fast JavaScript runtime)

## Prerequisites

- Node.js 18+ or Bun
- MongoDB (local or cloud)
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KulobalHealth/Kulobalhealth_Frontend.git
   cd Kulobalhealth_Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp api/env.example api/.env
   ```
   
   Edit `api/.env` with your configuration:
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/kulobal_health
   JWT_SECRET=your-super-secret-jwt-key
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

## Running the API

### Development
```bash
npm run dev:api
```

### Production
```bash
npm run build:api
npm run start:api
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `GET /api/auth/users` - Get all users (admin only)

### Payments
- `POST /api/payments` - Create new payment
- `GET /api/payments/my-payments` - Get user's payments
- `GET /api/payments/:id` - Get payment by ID
- `PATCH /api/payments/:id/status` - Update payment status (admin)
- `GET /api/payments` - Get all payments (admin)

## Database Models

### User Model
- Business information (name, location, contact)
- Authentication (email, password)
- Role-based access (pharmacy, supplier, otc, admin)
- Profile management

### Payment Model
- Transaction details (amount, currency, status)
- Payment method (mobile money, card, bank transfer)
- Order metadata (items, shipping details)
- Gateway integration support

### Product Model
- Product information (name, description, price)
- Inventory management (stock, SKU)
- Categorization and branding
- Supplier relationships

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## Success Responses

Successful operations return:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {} // Response data
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | localhost:27017/kulobal_health |
| `JWT_SECRET` | JWT signing secret | (required) |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |
| `NODE_ENV` | Environment mode | development |

## Development

### Project Structure
```
api/
├── config/
│   └── database.ts          # Database connection
├── middleware/
│   └── auth.ts              # Authentication middleware
├── models/
│   ├── User.ts              # User model
│   ├── Payment.ts           # Payment model
│   └── Product.ts           # Product model
├── routes/
│   ├── auth.ts              # Authentication routes
│   └── payments.ts          # Payment routes
├── index.ts                 # Main server file
├── tsconfig.json            # TypeScript config
└── README.md               # This file
```

### Adding New Routes

1. Create a new route file in `routes/`
2. Import and add to `index.ts`
3. Add validation schemas using Zod
4. Implement proper error handling

### Database Migrations

For schema changes, create migration scripts or use Mongoose's built-in schema versioning.

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens have expiration times
- Input validation on all endpoints
- CORS protection
- Secure headers middleware
- Role-based access control

## Deployment

### Docker (Recommended)
```dockerfile
FROM oven/bun:1

WORKDIR /app
COPY package*.json ./
RUN bun install

COPY . .
RUN bun run build:api

EXPOSE 5000
CMD ["bun", "run", "start:api"]
```

### Environment Setup
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure MongoDB Atlas or production database
- Set up proper CORS origins

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@kulobalhealth.com or create an issue in the repository.
