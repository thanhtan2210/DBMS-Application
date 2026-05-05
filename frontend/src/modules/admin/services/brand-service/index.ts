import axiosClient from '@/api/axiosClient';

export interface BrandDTO {
  id: number;
  name: string;
  description: string;
}

export const getBrands = async (): Promise<BrandDTO[]> => {
  const response: any = await axiosClient.get('/brands');
  return Array.isArray(response) ? response : (response.content || []); 
};
