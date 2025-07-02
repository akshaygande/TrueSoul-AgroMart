export interface User {
  uid: string;
  email: string;
  displayName?: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Rice' | 'Groundnuts' | 'Sunflower Oil' | 'Groundnut Oil';
  imageUrl: string;
  stockQuantity: number;
  unit: string; // kg, liters, etc.
  createdAt: Date;
  updatedAt: Date;
  averageRating?: number;
  reviews?: ProductReview[];
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  error?: string | null;
  success?: string | null;
} 