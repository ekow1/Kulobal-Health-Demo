import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export interface User {
  _id: string;
  businessName: string;
  ownerName: string;
  location: string;
  email: string;
  telephone: string;
  avatar?: string;
  role: 'pharmacy' | 'supplier' | 'otc' | 'admin';
  pharmacyName?: string;
  phoneNumber?: string;
  pharmacyEmail?: string;
  pharmacyLocation?: string;
  streetAddress?: string;
  gpsAddress?: string;
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
}

export interface Payment {
  _id: string;
  userId: string;
  transactionId: string;
  amount: number;
  currency: string;
  paymentType: string;
  paymentMethod: {
    type: 'mobile_money' | 'card' | 'bank_transfer' | 'cash';
    network?: 'mtn' | 'vodafone' | 'telecel' | 'airtel';
    phoneNumber?: string;
    accountName?: string;
    networkDisplayName?: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  description: string;
  metadata: {
    orderId: string;
    paymentType: 'full-payment' | 'partial-payment' | 'deposit';
    paymentMethod: 'pay-on-delivery' | 'online-payment' | 'mobile-money';
    pharmacyName: string;
    shippingDetails: {
      pharmacyName: string;
      phoneNumber: string;
      pharmacyEmail: string;
      pharmacyLocation: string;
      streetAddress?: string;
      gpsAddress?: string;
    };
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
      category?: string;
      image?: string;
    }>;
    itemsSummary: string;
    notes?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// API Client class
class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Ensure we have a valid API URL
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    this.baseURL = envUrl && envUrl !== '12345' ? envUrl : 'http://localhost:5000';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      withCredentials: true, // Include cookies in requests
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          this.clearAuthToken();
          // Only redirect if we're in the browser
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management - now using cookies (handled by server)
  private getAuthToken(): string | null {
    // Cookies are handled automatically by the browser
    // We don't need to manually manage them on the client side
    return null;
  }

  private setAuthToken(token: string): void {
    // Cookies are set by the server, no need to handle on client
  }

  private clearAuthToken(): void {
    // Cookies are cleared by the server, no need to handle on client
  }

  // Authentication methods
  async register(userData: {
    businessName: string;
    ownerName: string;
    location: string;
    email: string;
    telephone: string;
    password: string;
    role: 'pharmacy' | 'supplier' | 'otc';
    pharmacyName?: string;
    phoneNumber?: string;
    pharmacyEmail?: string;
    pharmacyLocation?: string;
    streetAddress?: string;
    gpsAddress?: string;
  }): Promise<ApiResponse<LoginResponse>> {
    const response = await this.client.post<ApiResponse<LoginResponse>>('/api/auth/register', userData);
    return response.data;
  }

  async login(credentials: { email: string; password: string }): Promise<ApiResponse<LoginResponse>> {
    const response = await this.client.post<ApiResponse<LoginResponse>>('/api/auth/login', credentials);
    return response.data;
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    const response = await this.client.get<ApiResponse<{ user: User }>>('/api/auth/profile');
    return response.data;
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    const response = await this.client.put<ApiResponse<{ user: User }>>('/api/auth/profile', userData);
    return response.data;
  }

  async changePassword(passwords: { currentPassword: string; newPassword: string }): Promise<ApiResponse> {
    const response = await this.client.put<ApiResponse>('/api/auth/change-password', passwords);
    return response.data;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.client.post<ApiResponse>('/api/auth/logout');
    return response.data;
  }

  // Payment methods
  async createPayment(paymentData: {
    amount: number;
    currency?: string;
    paymentType: 'card' | 'mobile_money' | 'cash on delivery' | 'credit';
    paymentMethod: {
      type: 'card' | 'mobile_money';
      // Card payment fields
      cardType?: 'visa' | 'mastercard' | 'american_express' | 'discover';
      last4Digits?: string;
      expiryMonth?: string;
      expiryYear?: string;
      cardholderName?: string;
      issuerBank?: string;
      // Mobile money fields
      network?: 'mtn' | 'vodafone' | 'airteltigo' | 'telecel';
      phoneNumber?: string;
      accountName?: string;
      networkDisplayName?: string;
    };
    description: string;
    metadata?: {
      orderId: string;
      paymentType: 'full-payment' | 'partial-payment' | 'deposit';
      paymentMethod: 'pay-on-delivery' | 'online-payment' | 'mobile-money';
      pharmacyName: string;
      shippingDetails: {
        pharmacyName: string;
        phoneNumber: string;
        pharmacyEmail: string;
        pharmacyLocation: string;
        streetAddress?: string;
        gpsAddress?: string;
      };
      items: Array<{
        id: string;
        name: string;
        quantity: number;
        price: number;
        category?: string;
        image?: string;
      }>;
      itemsSummary: string;
      notes?: string;
      // Installment fields
      installmentPercentage?: number;
      remainingBalance?: number;
      // Card specific fields
      cardType?: string;
      last4Digits?: string;
      cardholderName?: string;
      // Mobile money specific fields
      network?: string;
      phoneNumber?: string;
    };
  }): Promise<ApiResponse<{ payment: Payment }>> {
    const response = await this.client.post<ApiResponse<{ payment: Payment }>>('/api/payments', paymentData);
    return response.data;
  }

  async getMyPayments(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiResponse<{
    payments: Payment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const url = `/api/payments/my-payments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.client.get<ApiResponse<{
      payments: Payment[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>>(url);
    return response.data;
  }

  async getPayment(id: string): Promise<ApiResponse<{ payment: Payment }>> {
    const response = await this.client.get<ApiResponse<{ payment: Payment }>>(`/api/payments/${id}`);
    return response.data;
  }

  // Order methods
  async createOrder(orderData: {
    items: Array<{
      productId: string;
      name: string;
      quantity: number;
      price: number;
      category?: string;
      image?: string;
    }>;
    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
    currency?: string;
    shippingDetails: {
      pharmacyName: string;
      phoneNumber: string;
      pharmacyEmail: string;
      pharmacyLocation: string;
      streetAddress?: string;
      gpsAddress?: string;
    };
    paymentDetails: {
      paymentType: 'full-payment' | 'partial-payment' | 'deposit' | 'credit';
      paymentMethod: 'pay-on-delivery' | 'online-payment' | 'mobile-money';
      amount: number;
      currency?: string;
      transactionId?: string;
    };
    notes?: string;
    estimatedDelivery?: string;
  }): Promise<ApiResponse<{ order: any }>> {
    const response = await this.client.post<ApiResponse<{ order: any }>>('/api/orders', orderData);
    return response.data;
  }

  async getMyOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiResponse<{
    orders: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const url = `/api/orders/my-orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.client.get<ApiResponse<{
      orders: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>>(url);
    return response.data;
  }

  async getOrder(id: string): Promise<ApiResponse<{ order: any }>> {
    const response = await this.client.get<ApiResponse<{ order: any }>>(`/api/orders/${id}`);
    return response.data;
  }

  async cancelOrder(id: string, reason?: string): Promise<ApiResponse<{ order: any }>> {
    const response = await this.client.patch<ApiResponse<{ order: any }>>(`/api/orders/${id}/cancel`, { reason });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    const response = await this.client.get<ApiResponse>('/');
    return response.data;
  }

  // Utility methods
  isAuthenticated(): boolean {
    // Since we're using cookies now, we can't check authentication on the client side
    // This method is kept for compatibility but always returns false
    // The server will handle authentication via cookies
    return false;
  }

  getAuthUser(): User | null {
    // Since we're using cookies now, we can't get user from localStorage
    // This method is kept for compatibility but always returns null
    // The server will handle user data via cookies
    return null;
  }

  setAuthUser(user: User): void {
    // Since we're using cookies now, we don't need to store user in localStorage
    // This method is kept for compatibility but does nothing
    // The server will handle user data via cookies
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
