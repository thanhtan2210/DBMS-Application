import axiosClient from '@/api/axiosClient';

export interface CategoryDTO {
  categoryId: number;
  categoryName: string;
  description: string;
}

export const getCategories = async (): Promise<any[]> => {
  const response = await axiosClient.get('/admin/categories');
  return response || [];
};

export const getPublicCategories = async (): Promise<any[]> => {
  const response = await axiosClient.get('/categories');
  return response || [];
};

export const createCategory = async (data: any) => {
  return await axiosClient.post('/admin/categories', data);
};

export const updateCategory = async (id: number, data: any) => {
  return await axiosClient.put(`/admin/categories/${id}`, data);
};

export const deleteCategory = async (id: number) => {
  return await axiosClient.delete(`/admin/categories/${id}`);
};
