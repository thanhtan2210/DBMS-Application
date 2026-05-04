import { cn } from '@lib/utils';
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  Store,
  HelpCircle,
  LogOut,
  ChevronRight,
  Truck,
  TicketPercent,
  Warehouse,
  MousePointerClick,
  Search,
  Bell,
  ArrowRight,
  X,
  Menu
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_CUSTOMERS } from '@admin/types';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Package, label: 'Products', path: '/admin/inventory' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: TicketPercent, label: 'Promotions', path: '/admin/promotions' },
  { icon: Warehouse, label: 'Warehouses', path: '/admin/warehouses' },
  { icon: Truck, label: 'Logistics', path: '/admin/logistics' },
  { icon: Users, label: 'Customers', path: '/admin/customers' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];


export function Sidebar({ isMobileOpen, onClose }: { isMobileOpen?: boolean, onClose?: () => void }) {
  return (
    <aside className={cn(
      "w-64 h-screen fixed left-0 top-0 bg-[#0d1b2a] text-white/70 flex flex-col z-60 transition-transform duration-300 shadow-2xl lg:translate-x-0",
      isMobileOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-primary to-primary-container rounded-lg flex items-center justify-center shadow-lg">
            <Store className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-white tracking-tight">Precision Atelier</h1>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Enterprise Admin</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      <nav className="flex-1 px-3 mt-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => cn(
              'group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative overflow-hidden',
              isActive 
                ? 'bg-primary/20 text-white shadow-xs' 
                : 'hover:bg-white/5 hover:text-white'
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('w-5 h-5 transition-colors', isActive ? 'text-primary' : 'text-white/40 group-hover:text-white/60')} />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                  />
                )}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-primary" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:text-white transition-colors">
          <HelpCircle className="w-4 h-4" />
          <span>Help Center</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:text-white transition-colors text-red-400">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
        
        <div className="mt-4 px-2">
          <button className="w-full bg-primary/30 hover:bg-primary/40 text-white text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
            <Store className="w-4 h-4" />
            <span>Launch Storefront</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export function TopBar({ title, onMenuClick }: { title: string, onMenuClick?: () => void }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Order #ORD-2024-001', description: 'Customer: John Smith • Total: $1,240', time: '5 mins ago', type: 'order', unread: true },
    { id: 2, title: 'Low Stock Alert', description: 'Product "Precision Watch" is below 5 units', time: '2 hours ago', type: 'inventory', unread: true },
    { id: 3, title: 'New Customer Registered', description: 'Sarah Jenkins joined the platform', time: '5 hours ago', type: 'customer', unread: false },
    { id: 4, title: 'Promotion Ending', description: '"Flash Sale" ends in 2 hours', time: '1 day ago', type: 'promotion', unread: false },
  ]);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const results = {
    products: MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase())).slice(0, 3),
    orders: MOCK_ORDERS.filter(o => o.id.toLowerCase().includes(query.toLowerCase()) || o.customer.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3),
    customers: MOCK_CUSTOMERS.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
  };

  const hasResults = results.products.length > 0 || results.orders.length > 0 || results.customers.length > 0;

  const handleSelect = (path: string) => {
    navigate(path);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <header className="h-20 bg-surface/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 sm:px-8 border-b border-surface-container">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-surface-container rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6 text-on-surface" />
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-on-surface truncate max-w-[150px] sm:max-w-none">{title}</h2>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative" ref={searchRef}>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="text" 
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search..." 
              className="bg-surface-container-high/60 h-11 w-40 sm:w-72 rounded-xl pl-12 pr-4 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-primary/30 transition-all border-none placeholder:text-on-surface-variant/50"
            />
          </div>

          <AnimatePresence>
            {isOpen && query.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-surface shadow-2xl rounded-2xl border border-surface-container overflow-hidden z-50 p-2"
              >
                {!hasResults ? (
                  <div className="p-4 text-center text-sm text-on-surface-variant">
                    No results found
                  </div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto">
                    {results.products.length > 0 && (
                      <div className="mb-2">
                        <p className="px-3 py-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Products</p>
                        {results.products.map(p => (
                          <button 
                            key={p.id}
                            onClick={() => handleSelect('/admin/inventory')}
                            className="w-full flex items-center gap-3 p-2 hover:bg-surface-container rounded-xl transition-colors group text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Package className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-on-surface truncate">{p.name}</p>
                              <p className="text-[10px] text-on-surface-variant">{p.sku}</p>
                            </div>
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                          </button>
                        ))}
                      </div>
                    )}

                    {results.orders.length > 0 && (
                      <div className="mb-2">
                        <p className="px-3 py-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Orders</p>
                        {results.orders.map(o => (
                          <button 
                            key={o.id}
                            onClick={() => handleSelect('/admin/orders')}
                            className="w-full flex items-center gap-3 p-2 hover:bg-surface-container rounded-xl transition-colors group text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                              <ShoppingCart className="w-4 h-4 text-secondary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-on-surface truncate">{o.id}</p>
                              <p className="text-[10px] text-on-surface-variant">{o.customer.name}</p>
                            </div>
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                          </button>
                        ))}
                      </div>
                    )}

                    {results.customers.length > 0 && (
                      <div className="mb-2">
                        <p className="px-3 py-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Customers</p>
                        {results.customers.map(c => (
                          <button 
                            key={c.id}
                            onClick={() => handleSelect('/admin/customers')}
                            className="w-full flex items-center gap-3 p-2 hover:bg-surface-container rounded-xl transition-colors group text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                              <Users className="w-4 h-4 text-green-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-on-surface truncate">{c.name}</p>
                              <p className="text-[10px] text-on-surface-variant">{c.email}</p>
                            </div>
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={cn(
                "relative w-11 h-11 flex items-center justify-center rounded-xl transition-all group",
                isNotificationsOpen ? "bg-primary/10 text-primary" : "bg-surface-container-high/60 hover:bg-primary/10 hover:text-primary"
              )}
            >
              <Bell className="w-5 h-5 text-on-surface font-bold group-hover:text-primary transition-colors" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-surface animate-pulse" />
              )}
            </button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-surface shadow-2xl rounded-2xl border border-surface-container overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-surface-container flex items-center justify-between">
                    <h3 className="font-bold text-sm">Notifications</h3>
                    <button 
                      onClick={handleMarkAllAsRead}
                      className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map(n => (
                      <button 
                        key={n.id}
                        className={cn(
                          "w-full p-4 flex gap-3 text-left hover:bg-surface-container transition-colors relative group border-b border-surface-container/50 last:border-0",
                          n.unread && "bg-primary/[0.02]"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                          n.type === 'order' ? "bg-secondary/10 text-secondary" :
                          n.type === 'inventory' ? "bg-amber-500/10 text-amber-500" :
                          n.type === 'customer' ? "bg-green-500/10 text-green-500" :
                          "bg-primary/10 text-primary"
                        )}>
                          {n.type === 'order' ? <ShoppingCart className="w-4 h-4" /> :
                           n.type === 'inventory' ? <Warehouse className="w-4 h-4" /> :
                           n.type === 'customer' ? <Users className="w-4 h-4" /> :
                           <TicketPercent className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-on-surface line-clamp-1">{n.title}</p>
                          <p className="text-[10px] text-on-surface-variant mt-0.5 line-clamp-2">{n.description}</p>
                          <p className="text-[10px] text-primary font-medium mt-1 uppercase tracking-wider">{n.time}</p>
                        </div>
                        {n.unread && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="p-3 bg-surface-container-low text-center">
                    <button 
                      onClick={() => {
                        navigate('/admin/notifications');
                        setIsNotificationsOpen(false);
                      }}
                      className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors w-full"
                    >
                      See all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex items-center gap-3 pl-4 border-l border-surface-container relative" ref={profileRef}>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-on-surface">Admin User</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Super Admin</p>
            </div>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 rounded-full bg-primary/10 border-2 border-surface-container overflow-hidden hover:ring-2 hover:ring-primary/40 transition-all"
            >
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" referrerPolicy="no-referrer" />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-surface shadow-2xl rounded-2xl border border-surface-container overflow-hidden z-50 p-2"
                >
                  <button onClick={() => { navigate('/admin/settings'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 p-2.5 hover:bg-surface-container rounded-xl transition-colors text-left text-xs font-bold text-on-surface">
                    <Users className="w-4 h-4 text-on-surface-variant" />
                    <span>My Profile</span>
                  </button>
                  <button onClick={() => { navigate('/admin/settings'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 p-2.5 hover:bg-surface-container rounded-xl transition-colors text-left text-xs font-bold text-on-surface">
                    <Settings className="w-4 h-4 text-on-surface-variant" />
                    <span>Account Settings</span>
                  </button>
                  <button onClick={() => { setIsProfileOpen(false); }} className="w-full flex items-center gap-3 p-2.5 hover:bg-surface-container rounded-xl transition-colors text-left text-xs font-bold text-on-surface">
                    <HelpCircle className="w-4 h-4 text-on-surface-variant" />
                    <span>Support Center</span>
                  </button>
                  <div className="h-px bg-surface-container my-1 mx-1" />
                  <button onClick={() => { setIsProfileOpen(false); }} className="w-full flex items-center gap-3 p-2.5 hover:bg-red-50 text-red-500 rounded-xl transition-colors text-left text-xs font-bold">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
