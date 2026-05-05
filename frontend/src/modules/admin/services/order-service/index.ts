import axiosClient from '@/api/axiosClient';

/**
 * DBMS MONOLITH - ORDER SERVICE
 * Handles order retrieval and status management for Admin and Storefront.
 */

// Fetch all orders (Admin) or customer orders
export const fetchOrders = async (params?: { page?: number, size?: number, keyword?: string }) => {
  return await axiosClient.get('/orders', { params });
};

// Create a new order (Storefront)
export const createOrder = async (payload: {
  customerId: number;
  shippingAddressId: number;
  selectedCartItemIds: number[];
  paymentMethod: string;
  promotionCodes?: string[];
}) => {
  return await axiosClient.post('/orders', payload);
};

// Update order status (Admin)
export const updateOrderStatus = async (id: number, newStatus: string, note?: string) => {
  const query = new URLSearchParams();
  query.append('newStatus', newStatus);
  if (note) query.append('note', note);
  
  return await axiosClient.patch(`/admin/orders/${id}/status?${query.toString()}`);
};

// Backward compatibility or other logics
export const processCheckout = (cartId: string) => {
  return { success: true, orderId: 'ORD-' + Date.now() };
};
