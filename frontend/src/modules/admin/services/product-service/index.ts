import axiosClient from '@/api/axiosClient';
import { StorefrontProduct } from "@/types";

interface VariantDTO {
  variantId: number;
  variantName: string;
  color: string;
  size: string;
  priceOverride: number;
  imageUrl?: string;
}

interface BackendProductDTO {
  productId: number;
  productName: string;
  brandName: string;
  categoryName: string;
  price: number;
  costPrice: number;
  description: string;
  sku: string;
  status: string;
  imageUrl?: string;
  variants: VariantDTO[];
}

export const getActiveProducts = async (params?: { keyword?: string, categoryId?: number, brandId?: number, page?: number, size?: number }) => {
  try {
    const response: any = await axiosClient.get('/store/products/search', { params });
    // Dữ liệu có thể bị bọc bởi interceptor hoặc trả về thẳng content
    const items = response?.content || response?.data?.content || (Array.isArray(response) ? response : []);

    const products: StorefrontProduct[] = items.map((item: BackendProductDTO): StorefrontProduct => ({
      id: String(item.productId),
      name: item.productName,
      category: item.categoryName || 'Uncategorized',
      basePrice: item.price,
      image: item.imageUrl || `https://source.unsplash.com/random/400x400?product&sig=${item.productId}`
    }));

    return { content: products };
  } catch (error) {
    console.error("Error in getActiveProducts:", error);
    return { content: [] };
  }
};

export const getProductById = async (id: string) => {
  try {
    const response: any = await axiosClient.get(`/store/products/${id}`);
    const item = response?.data || response;

    return {
      id: String(item.productId),
      name: item.productName,
      category: item.categoryName || 'Uncategorized',
      basePrice: item.price,
      description: item.description,
      image: item.imageUrl || `https://source.unsplash.com/random/400x400?product&sig=${item.productId}`,
      variants: item.variants || []
    };
  } catch (error) {
    console.error("Error in getProductById:", error);
    throw error;
  }
};

export const adminListProducts = async (params?: { categoryId?: number, brandId?: number, status?: string, page?: number, size?: number, keyword?: string }) => {
  return await axiosClient.get('/admin/products', { params });
};

export const adminCreateProduct = async (data: any) => {
  return await axiosClient.post('/admin/products', data);
};

export const adminUpdateProduct = async (id: number, data: any) => {
  return await axiosClient.put(`/admin/products/${id}`, data);
};

export const adminDeleteProduct = async (id: number) => {
  return await axiosClient.delete(`/admin/products/${id}`);
};

export const adminDeactivateProduct = async (id: number) => {
  return await axiosClient.patch(`/admin/products/${id}/deactivate`);
};

export const adminGetInventory = async () => {
  return await axiosClient.get('/admin/inventory');
};

