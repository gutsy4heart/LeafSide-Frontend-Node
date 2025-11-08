export interface AdminCart {
  id: string;
  userId: string;
  userEmail: string;
  items: AdminCartItem[];
}

export interface AdminCartItem {
  id: string;
  bookId: string;
  quantity: number;
  priceSnapshot?: number;
}
