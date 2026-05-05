import { Card, Button, Badge, Input, Skeleton } from '@admin/components/ui';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Target,
  CircleDollarSign,
  X
} from 'lucide-react';
import { cn } from '@lib/utils';
import React, { useState, useMemo, useEffect } from 'react';
import { adminListCustomers, adminCreateCustomer } from '@/modules/admin/services/customer-service';

const metrics = [
  { label: 'Total Customers', value: '...', trend: '+14%', isPositive: true, icon: TrendingUp },
  { label: 'Active Segments', value: '8', detail: 'High-value cohorts performing well', icon: Target },
  { label: 'Avg. Customer Value', value: '$342', trend: '+$24', isPositive: true, icon: CircleDollarSign },
];

export default function Customers() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: 'Password123!', phone: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'VIP' | 'New'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(0);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params: any = { 
        page, 
        size: 10,
        // Since API supports city and status, we could use them if we had proper filters.
        // For search, we will filter on the frontend for now, or if there's a keyword param on backend, we could use it. 
        // Currently the API only supports `city` and `status`.
        // The mock UI has a search by name/email, we'll just fetch and filter client-side for simplicity if pagination is small, or just display the current page.
        // Let's just fetch without keyword since backend doesn't support it yet, and rely on the list.
      };
      const res: any = await adminListCustomers(params);
      setCustomers(res.content || []);
      setTotalPages(res.totalPages || 0);
      setTotalElements(res.totalElements || 0);
      metrics[0].value = res.totalElements?.toString() || '0';
    } catch (err) {
      console.error("Failed to fetch customers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, activeTab]);

  const handleAddCustomer = async () => {
    if (!formData.fullName || !formData.email) return;
    try {
      await adminCreateCustomer(formData);
      setIsAddModalOpen(false);
      setFormData({ fullName: '', email: '', password: 'Password123!', phone: '' });
      fetchCustomers();
    } catch(e) {
       console.error(e);
       alert("Error adding customer");
    }
  };

  // Local filtering if we want to filter the current page by search query
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch = 
        customer.fullName?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [debouncedSearchQuery, customers]);

  if (loading && customers.length === 0) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-10 w-32 mb-2" />
              <Skeleton className="h-4 w-16" />
            </Card>
          ))}
        </div>
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-10 w-48 rounded-xl" />
          </div>
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-on-surface">Customers</h2>
          <p className="text-on-surface-variant mt-1">Manage and view registered customer profiles and order history.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m) => (
          <Card key={m.label} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest">{m.label}</p>
                <p className="text-3xl font-display font-extrabold mt-2 text-on-surface">{m.value}</p>
                {m.trend && (
                  <div className="flex items-center gap-1 mt-2">
                    <span className={cn('text-xs font-bold', m.isPositive ? 'text-green-500' : 'text-red-500')}>
                      {m.trend}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-bold ml-1 uppercase">this month</span>
                  </div>
                )}
                {m.detail && <p className="text-[10px] text-on-surface-variant font-bold mt-2 uppercase tracking-wide">{m.detail}</p>}
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center">
                <m.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-surface-container rounded-full transition-all"
            >
              <X className="w-3 h-3 text-on-surface-variant" />
            </button>
          )}
          <Input 
            placeholder="Search customers on current page..." 
            className="pl-12 h-12 bg-white shadow-ambient border-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 bg-surface-container-high/50 flex items-center justify-between">
          <div className="flex h-8 bg-surface-container rounded-lg p-1">
            <button className="px-4 py-0 text-[10px] font-extrabold rounded-md transition-all uppercase tracking-widest bg-white shadow-sm text-on-surface">
              All Customers
            </button>
          </div>
          <button className="p-2 hover:bg-surface-container rounded-full"><MoreVertical className="w-4 h-4" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-container text-on-surface-variant">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Customer Name</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Email</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-right">Loyalty Points</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Join Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.customerId} className="hover:bg-surface-container-low transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                           {customer.fullName?.split(' ').map((n: string) => n[0]).join('') || '?'}
                        </div>
                        <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-all">{customer.fullName}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-on-surface-variant">{customer.email}</td>
                    <td className="px-8 py-6 text-sm font-bold text-on-surface text-center">
                      <Badge variant={customer.status === 'ACTIVE' ? 'success' : 'neutral'}>{customer.status}</Badge>
                    </td>
                    <td className="px-8 py-6 text-sm font-extrabold text-on-surface text-right text-yellow-600">{customer.loyaltyPoints?.toLocaleString()} pts</td>
                    <td className="px-8 py-6 text-sm font-semibold text-on-surface-variant">{new Date(customer.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <Search className="w-8 h-8 text-on-surface-variant animate-pulse" />
                       <p className="text-sm font-bold text-on-surface">No customers found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-surface-container-bright flex items-center justify-between border-t border-surface-container">
          <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest">
            Showing {filteredCustomers.length} entries (Page {page + 1} of {totalPages})
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-surface-container rounded-md" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-surface-container rounded-md" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </Card>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center bg-surface-container-low -m-8 mb-6 p-8">
                <h3 className="text-2xl font-display font-extrabold text-on-surface">Add Customer</h3>
                <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)} className="bg-white">Cancel</Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Full Name</label>
                  <Input 
                    placeholder="e.g. John Doe" 
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Email Address</label>
                  <Input 
                    type="email"
                    placeholder="e.g. john@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Phone</label>
                  <Input 
                    placeholder="e.g. 0912345678" 
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <Button className="w-full h-14 text-base font-extrabold gap-2" onClick={handleAddCustomer}>
                <Plus className="w-5 h-5" />
                Register Customer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

