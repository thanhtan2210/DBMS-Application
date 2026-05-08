/**
 * Unified Types for DBMS Monolith Frontend
 */

// ============= ADMIN DASHBOARD TYPES =============

export interface Metric {
  label: string;
  value: string;
  trend: string;
  trendValue: string;
  isPositive: boolean;
}

export interface AdminProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image?: string;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Processing';
  amount: number;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  spent: number;
  joinDate: string;
  avatar?: string;
  status: 'Active' | 'Pending' | 'Inactive';
}

// ============= STOREFRONT E-COMMERCE TYPES =============

export interface Brand {
  id: string;
  name: string;
  logo?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  priceOverride?: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface StorefrontProduct {
  id: string;
  name: string;
  basePrice: number;
  category: string;
  brandId: string;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  status: 'active' | 'archived';
  badge?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

// ============= MOCK DATA =============

export const PRODUCTS: StorefrontProduct[] = [
  {
    id: "1",
    name: "The Monolith Chair",
    basePrice: 1250,
    category: "Lounge",
    brandId: "postpurchase-origins",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=2787&auto=format&fit=crop",
    description: "A masterclass in restraint. Merging raw industrial feel with organic warmth.",
    rating: 4.8,
    reviewCount: 124,
    status: 'active',
    badge: "New"
  },
  {
    id: "2",
    name: "Brutalist Side Table",
    basePrice: 450,
    category: "Surface",
    brandId: "postpurchase-origins",
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=2787&auto=format&fit=crop",
    description: "A sculptural piece that challenges the boundary between furniture and art.",
    rating: 4.7,
    reviewCount: 86,
    status: 'active',
    badge: "Sale"
  }
];

export const BRANDS: Brand[] = [
  { id: "postpurchase-origins", name: "postpurchase Origins" }
];

export const CATEGORIES: Category[] = [
  { id: "living", name: "Living Room", image: "https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?q=80&w=2787&auto=format&fit=crop", productCount: 142 },
  { id: "workspace", name: "Workspace", image: "https://images.unsplash.com/photo-1518455027359-f3f816b1a23a?q=80&w=2787&auto=format&fit=crop", productCount: 54 },
  { id: "bedroom", name: "Bedroom", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2787&auto=format&fit=crop", productCount: 92 },
  { id: "lighting", name: "Lighting", image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=2787&auto=format&fit=crop", productCount: 86 }
];

export const MOCK_PRODUCTS: AdminProduct[] = [
  { id: '1', sku: 'PRO-8901', name: 'Acoustic Noise-Cancelling Headphones', category: 'Electronics', stock: 142, price: 299.00, status: 'In Stock' },
  { id: '2', sku: 'PRD-4421', name: 'Minimalist Ceramic Vases (Set of 3)', category: 'Home Goods', stock: 12, price: 85.50, status: 'Low Stock' },
  { id: '3', sku: 'PRD-1092', name: 'Essential Cotton Crewneck', category: 'Apparel', stock: 0, price: 28.00, status: 'Out of Stock' },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: '#ORD-9934',
    customer: { name: 'Sarah Jenkins', email: 'sarah.j@example.com' },
    date: 'Oct 24, 2023',
    status: 'Pending',
    amount: 245.00,
    items: []
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Elena Jenkins', email: 'elena.j@example.com', totalOrders: 24, spent: 2450.00, joinDate: 'Oct 12, 2022', status: 'Active' }
];

// ============= AUTHENTICATION TYPES =============

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  retypePassword?: string;
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface AuthResponse {
  token: string;
}

export interface UserInfo {
  email: string;
  role: string;
  displayName?: string;
  photoURL?: string;
}

// Backward compatibility aliases
export type Product = AdminProduct;
