import axiosClient from '@/api/axiosClient';

export interface CustomerProfileDTO {
  customerId: number;
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  dateOfBirth?: string;
  gender?: string;
  loyaltyPoints: number;
  createdAt?: string;
}

export interface UpdateCustomerProfileRequest {
  fullName: string;
  phone: string;
  address?: string;
}

export const getCustomerProfile = async (id: number): Promise<CustomerProfileDTO> => {
  const response: any = await axiosClient.get(`/customers/${id}/profile`);
  return response.data || response;
};

export const updateCustomerProfile = async (id: number, data: UpdateCustomerProfileRequest): Promise<CustomerProfileDTO> => {
  const response: any = await axiosClient.put(`/customers/${id}/profile`, data);
  return response.data || response;
};

// Admin API
export const adminListCustomers = async (params?: { page?: number, size?: number, city?: string, status?: string }) => {
  return await axiosClient.get('/admin/customers', { params });
};

export const adminCreateCustomer = async (data: any) => {
  return await axiosClient.post('/admin/customers', data);
};

export const adminUpdateCustomer = async (id: number, data: any) => {
  return await axiosClient.put(`/admin/customers/${id}`, data);
};

export const adminDeactivateCustomer = async (id: number) => {
  return await axiosClient.patch(`/admin/customers/${id}/status`);
};

