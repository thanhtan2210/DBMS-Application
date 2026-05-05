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

export const getCustomerAddresses = async (customerId: number): Promise<AddressDTO[]> => {
  const response: any = await axiosClient.get(`/customers/${customerId}/addresses`);
  return Array.isArray(response) ? response : (response.data || response.content || []);
};
