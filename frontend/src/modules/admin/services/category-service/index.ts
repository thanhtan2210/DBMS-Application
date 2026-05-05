import axiosClient from '@/api/axiosClient';

export interface CategoryDTO {
  id: number;
  name: string;
  description: string;
}

export const getCategories = async (): Promise<CategoryDTO[]> => {
  const response: any = await axiosClient.get('/categories');
  return Array.isArray(response) ? response : (response.content || []); 
};
