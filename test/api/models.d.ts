// ===== Common Types =====
export interface SuccessResponse {
  success: boolean;
  message?: string;
}

export interface ErrorResponse {
  success?: boolean;
  error: string;
}

// ===== Authentication =====
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: UserInfo;
}

export interface UserCreateRequest {
  isSubscribed: boolean;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface UserCreatedResponse {
  success: boolean;
  subscribed: boolean;
  token: string;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface ChangePasswordRequest {
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// ===== Product =====
export interface Product {
  _id: string;
  sku: string;
  name: string;
  slug: string;
  imageUrl?: string;
  imageKey?: string;
  description: string;
  quantity: number;
  price: number;
  taxable: boolean;
  isActive: boolean;
  brand: Brand | string;
  updated?: string;
  created?: string;
  totalReviews?: number;
  averageRating?: number;
  isLiked?: boolean;
}

export interface ProductSearchResult {
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
}

export interface ProductListResponse {
  products: Product[];
  totalPages?: number;
  currentPage?: number;
  count?: number;
  page?: number;
  pages?: number;
  totalProducts?: number;
}

export interface ProductResponse {
  product: Product;
}

export interface ProductAddRequest {
  sku: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  taxable?: boolean;
  isActive?: boolean;
  brand: string;
}

export interface ProductAddResponse {
  success: boolean;
  message: string;
  product: Product;
}

export interface ProductUpdateRequest {
  product: {
    sku?: string;
    name?: string;
    slug?: string;
    description?: string;
    quantity?: number;
    price?: number;
    taxable?: boolean;
    isActive?: boolean;
    brand?: string;
  };
}

export interface ProductSearchResponse {
  products: ProductSearchResult[];
}

// ===== Brand =====
export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image?: {
    data: string;
    contentType: string;
  };
  description?: string;
  isActive: boolean;
  merchant?: string;
  updated?: string;
  created?: string;
}

// ===== Category =====
export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: {
    data: string;
    contentType: string;
  };
  description?: string;
  isActive: boolean;
  products: string[];
  updated?: string;
  created?: string;
}

// ===== Cart =====
export interface CartItem {
  product: string | Product;
  quantity: number;
  purchasePrice: number;
  totalPrice: number;
  priceWithTax: number;
  totalTax: number;
  status: string;
  _id?: string;
}

export interface Cart {
  _id: string;
  products: CartItem[];
  user: string;
  updated?: string;
  created?: string;
}

export interface CartAddRequest {
  products: CartItem[];
}

export interface CartAddResponse {
  success: boolean;
  cartId: string;
}

export interface CartProductAddRequest {
  product: CartItem;
}

// ===== Order =====
export interface Order {
  _id: string;
  cart: string | Cart;
  user: string;
  total: number;
  updated?: string;
  created?: string;
  products?: CartItem[];
  totalTax?: number;
  cartId?: string;
}

export interface OrderAddRequest {
  cartId: string;
  total: number;
}

export interface OrderAddResponse {
  success: boolean;
  message: string;
  order: {
    _id: string;
  };
}

export interface OrderListResponse {
  orders: Order[];
  totalPages: number;
  currentPage: number;
  count: number;
}

export interface OrderResponse {
  order: Order;
}

export interface OrderSearchResponse {
  orders: Order[];
}

export interface OrderStatusUpdateRequest {
  orderId: string;
  cartId: string;
  status: string;
}

export interface OrderStatusUpdateResponse {
  success: boolean;
  message: string;
  orderCancelled?: boolean;
}

// ===== Wishlist =====
export interface Wishlist {
  _id: string;
  product: string | Product;
  user: string;
  isLiked: boolean;
  updated?: string;
  created?: string;
}

export interface WishlistRequest {
  product: string;
  isLiked: boolean;
}

export interface WishlistResponse {
  success: boolean;
  message: string;
  wishlist: Wishlist;
}

export interface WishlistListResponse {
  wishlist: Wishlist[];
}

// ===== Address =====
export interface Address {
  _id: string;
  user: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
  updated?: string;
  created?: string;
}

export interface AddressAddRequest {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface AddressAddResponse {
  success: boolean;
  message: string;
  address: Address;
}

export interface AddressListResponse {
  addresses: Address[];
}

export interface AddressResponse {
  address: Address;
}

export interface AddressUpdateRequest {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  isDefault?: boolean;
}

export interface AddressDeleteResponse {
  success: boolean;
  message: string;
  address: any;
}

// ===== Review =====
export interface Review {
  _id: string;
  product: string | Product;
  user: string | UserInfo;
  title: string;
  rating: number;
  review: string;
  isRecommended: boolean;
  status: string;
  updated?: string;
  created?: string;
}

export interface ReviewAddRequest {
  product: string;
  title: string;
  rating: number;
  review: string;
  isRecommended?: boolean;
}

export interface ReviewAddResponse {
  success: boolean;
  message: string;
  review: Review;
}

export interface ReviewListResponse {
  reviews: Review[];
  totalPages?: number;
  currentPage?: number;
  count?: number;
}

export interface ReviewUpdateRequest {
  title?: string;
  rating?: number;
  review?: string;
  isRecommended?: boolean;
  status?: string;
  isActive?: boolean;
}

export interface ReviewDeleteResponse {
  success: boolean;
  message: string;
  review: any;
}

// ===== Newsletter =====
export interface NewsletterSubscribeRequest {
  email: string;
}

export interface NewsletterSubscribeResponse {
  success: boolean;
  message: string;
}
