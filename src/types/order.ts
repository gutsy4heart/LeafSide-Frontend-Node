export interface Order {
  id: string;
  userId: string;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  bookId: string;
  bookTitle: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface UpdateOrderStatusRequest {
  status: string;
}

export const ORDER_STATUSES = [
  'Pending',
  'Processing', 
  'Shipped',
  'Delivered',
  'Cancelled'
] as const;

export type OrderStatus = typeof ORDER_STATUSES[number];
