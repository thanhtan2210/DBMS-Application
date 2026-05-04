import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role === 'CUSTOMER') {
    return <Navigate to="/" replace />;
  }

  if (user?.role === 'ADMIN' || user?.role === 'STAFF') {
    return <>{children}</>;
  }

  return <Navigate to="/login" replace />;
};

export const CustomerRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    if (user?.role === 'ADMIN' || user?.role === 'STAFF') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
