import axiosClient from '@/api/axiosClient';

export const getCartItems = async () => {
  return await axiosClient.get(`/cart`);
};

export const addItemToCart = async (payload: { variantId: number; quantity: number }) => {
  return await axiosClient.post(`/cart/items`, payload);
};

export const updateCartItemQuantity = async (itemId: number, quantity: number) => {
  return await axiosClient.put(`/cart/items/${itemId}?quantity=${quantity}`);
};

export const removeItemFromCart = async (itemId: number) => {
  return await axiosClient.delete(`/cart/items/${itemId}`);
};

export const selectCartItem = async (itemId: number, selected: boolean) => {
  return await axiosClient.patch(`/cart/items/${itemId}/select?selected=${selected}`);
};

