import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * ADMIN ROUTE GUARD
 * Only allows ADMIN, ROLE_ADMIN, or STAFF.
 * Redirects to /login if not authenticated.
 * Redirects to / if authenticated but not authorized.
 */
export const AdminRoute = () => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN' || user?.role === 'STAFF';

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

/**
 * CUSTOMER ROUTE GUARD
 * Only allows authenticated users.
 * Redirects to /login if not authenticated.
 */
export const CustomerRoute = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

/**
 * GUEST ROUTE GUARD
 * Only allows unauthenticated users.
 * Redirects authenticated users to their respective dashboards.
 */
export const GuestRoute = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN' || user?.role === 'STAFF';
    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

