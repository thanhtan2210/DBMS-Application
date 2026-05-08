import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from '@lib/AuthDummy';
import { CartProvider } from '@lib/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@lib/utils';
import { AdminRoute, CustomerRoute, GuestRoute } from '@/components/auth/ProtectedRoutes';

// Admin Imports
import { Sidebar, TopBar } from '@admin/components/Layout';
import AdminDashboard from '@admin/pages/Admin_Dashboard/Dashboard';
import AdminInventory from '@admin/pages/Admin_Dashboard/Inventory';
import AdminOrders from '@admin/pages/Admin_Dashboard/Orders';
import AdminCustomers from '@admin/pages/Admin_Dashboard/Customers';
import AdminAnalytics from '@admin/pages/Admin_Dashboard/Analytics';
import AdminSettings from '@admin/pages/Admin_Dashboard/Settings';
import AdminLogistics from '@admin/pages/Admin_Dashboard/Logistics';
import AdminPromotions from '@admin/pages/Admin_Dashboard/Promotions';
import AdminWarehouse from '@admin/pages/Admin_Dashboard/Warehouse';
import AdminNotifications from '@admin/pages/Admin_Dashboard/Notifications';

import AdminUsers from '@admin/pages/Admin_Dashboard/Users';

// Storefront Imports
import { Header, Footer } from '@storefront/components/Layout';
import { Home as StorefrontHome } from '@storefront/pages/main/Home';
import Shop from '@storefront/pages/main/Shop';
import { ProductDetail } from '@storefront/pages/main/ProductDetail';
import { Categories } from '@storefront/pages/main/Categories';
import { Support } from '@storefront/pages/main/Support';
import { Shipping } from '@storefront/pages/main/Shipping';
import { Login } from '@storefront/pages/main/Login';
import { Register } from '@storefront/pages/main/Register';
import { Checkout } from '@storefront/pages/main/Checkout';
import { Profile } from '@storefront/pages/main/Profile';
import { MyOrders } from '@storefront/pages/main/MyOrders';
import { Privacy } from '@storefront/pages/main/Privacy';
import { Terms } from '@storefront/pages/main/Terms';
import { Returns } from '@storefront/pages/main/Returns';
import { Accessibility } from '@storefront/pages/main/Accessibility';

import { ComingSoon } from '@/components/common/ComingSoon';
// ... (các import khác giữ nguyên)

// Admin Dashboard Layout
function AdminLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const titles: Record<string, string> = {
    '/admin': 'Dashboard Overview',
    '/admin/inventory': 'Manage Products',
    '/admin/orders': 'Order Management',
    '/admin/logistics': 'Fulfillment Hub',
    '/admin/customers': 'Customer Directory',
    '/admin/analytics': 'Performance Analytics',
    '/admin/settings': 'System Settings',
    '/admin/promotions': 'Marketing & Campaigns',
    '/admin/warehouses': 'Warehouse Operations',
    '/admin/warehouse': 'Warehouse Operations',
    '/admin/notifications': 'Notification Center',

  };

  return (
    <div className="flex bg-[#f9f9fd] min-h-screen admin-mode relative">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-[#0d1b2a]/40 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      <Sidebar
        isMobileOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 min-h-screen flex flex-col lg:pl-64">
        <TopBar
          title={titles[location.pathname] || 'Admin Console'}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <div className="p-8 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="logistics" element={<AdminLogistics />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="settings" element={<ComingSoon />} />
                <Route path="promotions" element={<AdminPromotions />} />
                <Route path="warehouses" element={<AdminWarehouse />} />
                <Route path="warehouse" element={<Navigate to="/admin/warehouses" replace />} />
                <Route path="notifications" element={<ComingSoon />} />
                <Route path="users" element={<AdminUsers />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// Storefront Layout
function StorefrontLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <Routes>
          <Route index element={<StorefrontHome />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="categories" element={<Categories />} />
          <Route path="support" element={<Support />} />
          <Route path="shipping" element={<Shipping />} />

          {/* GUEST ONLY ROUTES */}
          <Route element={<GuestRoute />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* PROTECTED CUSTOMER ROUTES */}
          <Route element={<CustomerRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<MyOrders />} />
          </Route>

          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="returns" element={<Returns />} />
          <Route path="accessibility" element={<Accessibility />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Monolith...</div>}>
            <Routes>
              {/* ADMIN ONLY ROUTES */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/*" element={<AdminLayout />} />
              </Route>

              <Route path="/*" element={<StorefrontLayout />} />
            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

