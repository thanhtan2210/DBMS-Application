import axiosClient from '@/api/axiosClient';

export const getOrders = async (params: any = {}) => {
  const response = await axiosClient.get('/orders', { params });
  return response || { content: [] };
};

export const updateOrderStatus = async (id: number, status: string, note?: string) => {
  return await axiosClient.patch(`/admin/orders/${id}/status?newStatus=${status}${note ? `&note=${note}` : ''}`);
};

export const getLogisticsConfig = async () => {
  const response = await axiosClient.get('/admin/logistics/config');
  return response || { activeCarriers: {}, regionalRules: [] };
};

export const updateCarriers = async (carriers: Record<string, boolean>) => {
  return await axiosClient.put('/admin/logistics/config/carriers', carriers);
};

export const optimizeRoutes = async () => {
  const response = await axiosClient.post('/admin/logistics/config/optimize');
  return response;
};

export const generateLabels = async (orderCodes: string[]) => {
  const response = await axiosClient.post('/admin/logistics/config/labels', orderCodes);
  return response;
};

export const getCarrierPerformance = async () => {
  const response = await axiosClient.get('/admin/logistics/config/performance');
  return response || [];
};
