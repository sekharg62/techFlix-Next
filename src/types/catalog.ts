// Shapes returned by the TechFlix backend public API.

export interface Plan {
  id: string;
  name: string;
  price: number; // BDT
  durationDays: number | null;
  validity: string | null;
  inStock: boolean;
  sortOrder: number;
  /** Variant this plan belongs to (null/absent = simple plan). */
  variantId?: string | null;
}

/** A group of plans inside a product, e.g. "Mobile", "Desktop / TV". */
export interface Variant {
  id: string;
  name: string;
  description: string | null;
  inStock: boolean;
  sortOrder: number;
  plans: Plan[];
}

export interface CategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  imgUrl: string;
  smallDesc: string;
  longDesc: string | null;
  stock: boolean;
  type: string[];
  features: string[] | null;
  categoryId: string | null;
  category: CategoryRef | null;
  /** Flat list of every plan (each carries `variantId`). */
  plans: Plan[];
  variants?: Variant[];
  createdAt: string;
  updatedAt: string;
}

export interface CategorySummary {
  id?: string;
  name: string;
  slug: string;
  totalProducts: number;
}

export interface HeroSlide {
  id: string;
  order: number;
  imageUrl: string;
}

export interface HomeSection {
  id: string;
  title: string;
  desc: string;
  tag: string;
  products: Product[];
}

export interface Review {
  id: string;
  name: string;
  role: string | null;
  description: string;
  profileUrl: string | null;
  starCount: number;
  createdAt: string;
}

export type PaymentMethodType = "BKASH" | "NAGAD" | "ROCKET";

export interface PaymentMethod {
  method: PaymentMethodType;
  accountNumber: string;
  accountType: string;
  instructions: string | null;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProductListQuery {
  page?: number;
  limit?: number;
  category?: string; // category slug
  search?: string;
  sortBy?: "createdAt" | "name";
  sortOrder?: "asc" | "desc";
}

// ── Orders ───────────────────────────────────────────────

export type OrderStatus = "PENDING" | "PROCESSING" | "DELIVERED" | "CANCELLED" | "REFUNDED";
export type PaymentStatus = "PENDING_VERIFICATION" | "PAID" | "REJECTED" | "REFUNDED";

export interface CheckoutPayload {
  fullName: string;
  email: string;
  whatsapp: string;
  country?: string;
  note?: string;
  items: { productId: string; planId: string; quantity: number }[];
  payment: { method: PaymentMethodType; senderNumber: string; trxId: string };
}

export interface PlacedOrder {
  id: string;
  orderNumber: string;
  customerEmail: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
}

export interface TrackedOrder {
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  currency: string;
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string;
  deliveredAt: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  country: string | null;
  items: {
    productName: string;
    productSlug: string;
    productImgUrl: string | null;
    variantName?: string | null;
    planName: string;
    planValidity: string | null;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    deliveredAt: string | null;
  }[];
  payments: {
    method: PaymentMethodType;
    trxId: string;
    amount: number;
    status: "PENDING" | "VERIFIED" | "REJECTED";
    rejectionReason: string | null;
    createdAt: string;
  }[];
  statusHistory: { toStatus: OrderStatus; createdAt: string }[];
}
