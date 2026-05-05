import axiosClient from '@/api/axiosClient';

export const adminListUsers = async (params?: { page?: number, size?: number }) => {
  return await axiosClient.get('/admin/users', { params });
};

export const adminUpdateUserRole = async (id: number, role: string) => {
  return await axiosClient.patch(`/admin/users/${id}/role`, null, { params: { role } });
};

export const adminUpdateUserStatus = async (id: number, status: string) => {
  return await axiosClient.patch(`/admin/users/${id}/status`, null, { params: { status } });
};
