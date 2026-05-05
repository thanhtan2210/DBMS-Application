import axiosClient from '@/api/axiosClient';

export const adminListPromotions = async (params?: { page?: number, size?: number }) => {
  return await axiosClient.get('/admin/promotions', { params });
};

export const adminCreatePromotion = async (data: any) => {
  return await axiosClient.post('/admin/promotions', data);
};

export const adminUpdatePromotion = async (id: number, data: any) => {
  return await axiosClient.put(`/admin/promotions/${id}`, data);
};

export const adminDeletePromotion = async (id: number) => {
  return await axiosClient.delete(`/admin/promotions/${id}`);
};

export const applyPromotion = async (code: string, orderAmount: number) => {
  const response: any = await axiosClient.post('/checkout/apply-promotion', null, { params: { code, orderAmount } });
  return response.data || response;
};

