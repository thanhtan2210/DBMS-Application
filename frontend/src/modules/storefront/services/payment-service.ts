import axiosClient from '@/api/axiosClient';

export type PaymentMethodChoice = 'COD' | 'MOMO';

export type PaymentInitiationResponse = {
  payment: {
    paymentId: number;
    paymentMethod: PaymentMethodChoice;
    paymentProvider?: string;
    transactionRef?: string;
    amount: number;
    paymentStatus: string;
    paidAt?: string;
  };
  payUrl?: string | null;
  provider?: string;
  message?: string;
};

export const initiatePayment = async (payload: {
  orderId: number;
  paymentMethod: PaymentMethodChoice;
  paymentProvider?: string;
}): Promise<PaymentInitiationResponse> => {
  return await axiosClient.post('/payments/initiate', payload);
};

export const confirmPayment = async (payload: {
  transactionRef: string;
  status: 'SUCCESS' | 'FAILED';
  rawPayload?: string;
}): Promise<any> => {
  return await axiosClient.post('/payments/callback', payload);
};

export const getPaymentByOrderId = async (orderId: number): Promise<any> => {
  return await axiosClient.get(`/payments/order/${orderId}`);
};