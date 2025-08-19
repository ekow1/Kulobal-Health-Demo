# Frontend Store Architecture

This document describes the refactored frontend architecture using Zustand stores with direct Axios requests.

## Overview

The frontend has been refactored to use simple Zustand stores that handle Axios requests directly. This eliminates the need for separate API client layers, action files, or utilities, making the codebase clean and straightforward.

## Architecture

### Raw Axios Approach

- **No API Client**: Each store imports axios directly (`import axios from "axios"`)
- **Direct Calls**: Raw axios calls with `{ withCredentials: true }` option
- **No Wrappers**: No utility functions or custom configurations
- **Simple Error Handling**: Direct error handling in each store

### Store Structure

Each feature has its own Zustand store with the following pattern:

1. **State**: Data and UI state
2. **Actions**: Async functions that make direct axios calls
3. **Utilities**: Helper functions for state management

#### Available Stores

1. **Auth Store** (`/store/auth-store.ts`)
   - User authentication and profile management
   - Login, register, logout, profile updates
   - Persistent storage for user data

2. **Payment Store** (`/store/payment-store.ts`)
   - Payment management and tracking
   - Create, fetch, update payments
   - Payment statistics and filtering
   - Persistent storage for payment data

3. **Orders Store** (`/store/orders-store.ts`)
   - Order management
   - Create, fetch, cancel orders
   - Order tracking and status updates
   - Persistent storage for order data

4. **Product Store** (`/store/product.ts`)
   - Product catalog management
   - Fetch products with filtering and pagination
   - Cart functionality
   - Fallback to mock data on API errors

5. **Cart Store** (`/store/cart-store.ts`)
   - Shopping cart functionality
   - Add, remove, update quantities
   - Persistent storage for cart data

## Usage Examples

### Authentication

```typescript
import { useAuthStore } from '@/store/auth-store'

const { login, user, isAuthenticated, isLoading } = useAuthStore()

// Login
const handleLogin = async () => {
  const result = await login(email, password)
  if (result.success) {
    // Redirect or update UI
  }
}
```

### Payments

```typescript
import { usePaymentStore } from '@/store/payment-store'

const { fetchPayments, payments, createNewPayment, isLoading } = usePaymentStore()

// Fetch payments
useEffect(() => {
  fetchPayments()
}, [])

// Create payment
const handlePayment = async () => {
  try {
    const payment = await createNewPayment(paymentData)
    // Handle success
  } catch (error) {
    // Handle error
  }
}
```

### Products

```typescript
import { useMarketplaceStore } from '@/store/product'

const { fetchProducts, products, addToCart, isLoading } = useMarketplaceStore()

// Fetch products with filters
useEffect(() => {
  fetchProducts({ category: 'health', search: 'glucose' })
}, [])

// Add to cart
const handleAddToCart = (productId: string) => {
  addToCart(productId)
}
```

## Axios Call Pattern

All stores follow this simple pattern:

```typescript
// GET request
const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/endpoint`, { withCredentials: true })

// POST request
const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/endpoint`, data, { withCredentials: true })

// PUT request
const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/endpoint`, data, { withCredentials: true })

// PATCH request
const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/endpoint`, data, { withCredentials: true })
```

## Error Handling

Each store handles errors directly:

```typescript
try {
  const response = await axios.get(url, { withCredentials: true })
  // Handle success
} catch (error: any) {
  const errorMessage = error.response?.data?.message || error.message || "Default error message"
  set({ error: errorMessage, isLoading: false })
}
```

## Key Benefits

1. **Ultra-Simple Architecture**: No layers, no wrappers, no utilities
2. **Direct Control**: Full control over axios calls in each store
3. **Type Safety**: Full TypeScript support with proper interfaces
4. **Error Handling**: Direct error handling in each store
5. **Persistence**: Automatic data persistence using Zustand persist middleware
6. **Performance**: Efficient state updates and minimal re-renders
7. **Maintainability**: Clear and straightforward code

## Migration Notes

- Removed `/lib/api.ts` - no longer needed
- Removed `/app/actions/` files - functionality moved to stores
- All stores now use raw axios calls
- Maintained backward compatibility where possible

## Best Practices

1. **Store Composition**: Keep stores focused on specific features
2. **Error Boundaries**: Always handle errors in components
3. **Loading States**: Use isLoading flags for better UX
4. **Type Safety**: Define proper TypeScript interfaces
5. **Persistence**: Only persist necessary data
6. **Testing**: Test store actions and state updates
7. **DRY Principle**: Avoid code duplication while keeping it simple
