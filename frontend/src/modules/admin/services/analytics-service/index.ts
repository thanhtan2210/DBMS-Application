import axiosClient from '@/api/axiosClient';

export const getSalesOverview = async (from: string, to: string) => {
  const response: any = await axiosClient.get('/admin/reports/sales-overview', { params: { from, to } });
  return response.data || response;
};

export const getTopProducts = async (from: string, to: string, limit: number = 5) => {
  const response: any = await axiosClient.get('/admin/reports/top-products', { params: { from, to, limit } });
  return response.data || response;
};

export const getConversionFunnel = async (from: string, to: string) => {
  const response: any = await axiosClient.get('/admin/analytics/funnel', { params: { from, to } });
  return response.data || response;
};

export const getRevenueByCategory = async () => {
  const response: any = await axiosClient.get('/admin/reports/revenue-by-category');
  return response.data || response;
};

export const getDailySales = async (from: string, to: string) => {
  const response: any = await axiosClient.get('/admin/reports/daily-sales', { params: { from, to } });
  return response.data || response;
};
