// Base types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  profileImage?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Car {
  _id: string;
  title: string;
  description: string;
  make: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  category: string;
  bodyType: string;
  uploadedBy: string | User;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Auction {
  _id: string;
  car: Car;
  startTime: string;
  endTime: string;
  status: "upcoming" | "live" | "ended" | "completed";
  currentPrice: number;
  winningBid?: string | Bid;
  bids: Bid[];
}

export interface Bid {
  _id: string;
  auction: string | Auction;
  bidder: string | User;
  amount: number;
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  _id: string;
  auction: string | Auction;
  user: string | User;
  bid: string | Bid;
  amount: number;
  status: "pending" | "completed" | "failed";
  transactionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Wishlist {
  _id: string;
  user: string | User;
  car: string | Car;
  createdAt?: string;
  updatedAt?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
