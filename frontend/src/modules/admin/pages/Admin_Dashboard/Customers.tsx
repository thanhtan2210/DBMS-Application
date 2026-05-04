import { Card, Button, Badge, Input } from '@admin/components/ui';
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
import { MOCK_CUSTOMERS } from '@admin/types';
import { cn } from '@lib/utils';
import React, { useState, useMemo, useEffect } from 'react';

const metrics = [
  { label: 'Total Customers', value: '12,845', trend: '+14%', isPositive: true, icon: TrendingUp },
  { label: 'Active Segments', value: '8', detail: 'High-value cohorts performing well', icon: Target },
  { label: 'Avg. Customer Value', value: '$342', trend: '+$24', isPositive: true, icon: CircleDollarSign },
];

export default function Customers() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'VIP' | 'New'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleAddCustomer = () => {
    if (!formData.name || !formData.email) return;
    const newCustomer = {
      id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name,
      email: formData.email,
      totalOrders: 0,
      spent: 0,
      joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      status: 'Active' as const
    };
    setCustomers([newCustomer, ...customers]);
    setIsAddModalOpen(false);
    setFormData({ name: '', email: '' });
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = 
        activeTab === 'All' ||
        (activeTab === 'VIP' && customer.spent > 1000) || // Simple logic for VIP
        (activeTab === 'New' && customer.joinDate.includes('2026')); // Simple logic for New

      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab, customers]);

  if (loading) {
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
            placeholder="Search customers by name or email..." 
            className="pl-12 h-12 bg-white shadow-ambient border-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <Button 
            variant="outline" 
            className={cn("h-12 bg-white gap-2 px-6", isFilterOpen && "border-primary text-primary")}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          {isFilterOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white shadow-2xl rounded-2xl border border-surface-container z-50 p-6 animate-in zoom-in-95 duration-200">
               <h4 className="text-xs font-extrabold text-on-surface-variant uppercase tracking-widest mb-4">Customer Segment</h4>
               <div className="space-y-2">
                 {(['All', 'VIP', 'New'] as const).map(tab => (
                   <label key={tab} className="flex items-center gap-3 cursor-pointer group">
                     <input 
                       type="radio" 
                       name="tab" 
                       checked={activeTab === tab}
                       onChange={() => setActiveTab(tab)}
                       className="w-4 h-4 text-primary border-surface-container focus:ring-primary/20"
                     />
                     <span className={cn("text-sm font-bold transition-colors", activeTab === tab ? "text-primary" : "text-on-surface group-hover:text-primary")}>
                       {tab} Customers
                     </span>
                   </label>
                 ))}
               </div>
               <div className="mt-6 pt-6 border-t border-surface-container">
                  <Button variant="outline" className="w-full h-10 text-xs font-bold" onClick={() => { setActiveTab('All'); setSearchQuery(''); setIsFilterOpen(false); }}>
                    Reset Filters
                  </Button>
               </div>
            </div>
          )}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 bg-surface-container-high/50 flex items-center justify-between">
          <div className="flex h-8 bg-surface-container rounded-lg p-1">
            {(['All', 'VIP', 'New'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-0 text-[10px] font-extrabold rounded-md transition-all uppercase tracking-widest",
                  activeTab === tab ? "bg-white shadow-sm text-on-surface" : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {tab === 'All' ? 'All Customers' : tab}
              </button>
            ))}
          </div>
          <button className="p-2 hover:bg-surface-container rounded-full"><MoreVertical className="w-4 h-4" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-container text-on-surface-variant">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Customer Name</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Email</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-center">Total Orders</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-right">Total Spent</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Join Date</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-surface-container-low transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {customer.avatar ? (
                            <img src={customer.avatar} alt="" className="w-full h-full rounded-full" referrerPolicy="no-referrer" />
                          ) : (
                            customer.name.split(' ').map(n => n[0]).join('')
                          )}
                        </div>
                        <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-all">{customer.name}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-on-surface-variant">{customer.email}</td>
                    <td className="px-8 py-6 text-sm font-bold text-on-surface text-center">{customer.totalOrders}</td>
                    <td className="px-8 py-6 text-sm font-extrabold text-on-surface text-right">${customer.spent.toLocaleString()}</td>
                    <td className="px-8 py-6 text-sm font-semibold text-on-surface-variant">{customer.joinDate}</td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 hover:bg-surface-container rounded-lg transition-all">
                        <MoreVertical className="w-4 h-4 text-on-surface-variant" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <Search className="w-8 h-8 text-on-surface-variant animate-pulse" />
                       <p className="text-sm font-bold text-on-surface">No customers found</p>
                       <p className="text-xs text-on-surface-variant">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-surface-container-bright flex items-center justify-between border-t border-surface-container">
          <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest">
            Showing {filteredCustomers.length} of {customers.length} entries
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-surface-container rounded-md"><ChevronLeft className="w-4 h-4" /></button>
            <div className="flex gap-1">
              {[1, 2, 3, '...', 1285].map((p, i) => (
                <button key={i} className={cn("w-8 h-8 rounded-md text-xs font-bold", p === 1 ? "bg-primary text-white" : "hover:bg-surface-container")}>{p}</button>
              ))}
            </div>
            <button className="p-2 hover:bg-surface-container rounded-md"><ChevronRight className="w-4 h-4" /></button>
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
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
