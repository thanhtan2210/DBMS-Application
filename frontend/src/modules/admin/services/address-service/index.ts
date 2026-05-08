import axiosClient from '@/api/axiosClient';

export interface AddressDTO {
  addressId: number;
  receiverName: string;
  phone: string;
  street: string;
  ward?: string;
  district?: string;
  city: string;
  country: string;
  postalCode?: string;
  isDefault: boolean;
}

export interface AddressRequest {
  receiverName: string;
  phone: string;
  street: string;
  ward?: string;
  district?: string;
  city: string;
  country?: string;
  postalCode?: string;
  isDefault?: boolean;
}

export const getCustomerAddresses = async (customerId: number): Promise<AddressDTO[]> => {
  const response: any = await axiosClient.get(`/customers/${customerId}/addresses`);
  return Array.isArray(response) ? response : (response.data || response.content || []);
};

export const createCustomerAddress = async (customerId: number, payload: AddressRequest): Promise<AddressDTO> => {
  return await axiosClient.post(`/customers/${customerId}/addresses`, payload);
};

export const updateCustomerAddress = async (customerId: number, addressId: number, payload: AddressRequest): Promise<AddressDTO> => {
  return await axiosClient.put(`/customers/${customerId}/addresses/${addressId}`, payload);
};

export const deleteCustomerAddress = async (customerId: number, addressId: number): Promise<void> => {
  return await axiosClient.delete(`/customers/${customerId}/addresses/${addressId}`);
};
