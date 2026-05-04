import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Input, Skeleton } from '@admin/components/ui';
import { 
  TicketPercent, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  TrendingUp, 
  MousePointerClick,
  ChevronRight,
  MoreVertical,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@lib/utils';

const MOCK_PROMOTIONS = [
  { id: 'PROM-001', name: 'Summer Solstice Sale', type: 'Percentage', value: '25%', status: 'Active', usage: 1240, start: '2026-06-01', end: '2026-06-30' },
  { id: 'PROM-002', name: 'New User Welcome', type: 'Fixed amount', value: '$10.00', status: 'Active', usage: 850, start: '2026-01-01', end: '2026-12-31' },
  { id: 'PROM-003', name: 'Influencer Collab: FELIX', type: 'Percentage', value: '15%', status: 'Scheduled', usage: 0, start: '2026-05-01', end: '2026-05-15' },
  { id: 'PROM-004', name: 'Clearance Blowout', type: 'Fixed amount', value: '$50.00', status: 'Expired', usage: 2100, start: '2026-03-01', end: '2026-03-15' },
];

export default function Promotions() {
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState(MOCK_PROMOTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPromo, setNewPromo] = useState({
    name: '',
    type: 'Percentage',
    value: '',
    start: '',
    end: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredPromotions = promotions.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    const promo = {
      ...newPromo,
      id: `PROM-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Scheduled',
      usage: 0
    };
    setPromotions([promo, ...promotions]);
    setIsCreateModalOpen(false);
    setNewPromo({ name: '', type: 'Percentage', value: '', start: '', end: '' });
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-44" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-10 w-32" />
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden">
          <div className="p-6 border-b border-surface-container">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-on-surface">Promotions</h2>
          <p className="text-on-surface-variant mt-1">Design and manage your marketing campaigns.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Create Promotion
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-primary">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Active Campaigns</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-3xl font-display font-extrabold">12</p>
            <TrendingUp className="text-green-500 w-5 h-5 mb-1" />
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-secondary">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Conversion Rate</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-3xl font-display font-extrabold">3.8%</p>
            <Badge variant="success">+1.2%</Badge>
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-primary-container">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Revenue Impact</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-3xl font-display font-extrabold">$24.5k</p>
            <div className="flex items-center gap-1 text-green-500 font-bold text-xs mb-1">
              <TrendingUp className="w-3 h-3" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
            <Input 
              className="pl-10 h-10 text-xs" 
              placeholder="Search promotions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="w-3 h-3" />
              Filter: {statusFilter}
            </Button>
            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white shadow-2xl rounded-2xl border border-surface-container z-50 p-1 animate-in zoom-in-95 duration-200">
                {['All', 'Active', 'Scheduled', 'Expired'].map(status => (
                  <button 
                    key={status}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-xs font-bold transition-colors rounded-xl",
                      statusFilter === status ? "bg-primary text-white" : "hover:bg-surface-container text-on-surface"
                    )}
                    onClick={() => {
                      setStatusFilter(status);
                      setIsFilterOpen(false);
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-high/40 text-on-surface-variant border-b border-surface-container">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Promotion Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-center">Usages</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-right">Validity</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filteredPromotions.map((promo) => (
                <tr key={promo.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-5">
                    <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{promo.name}</p>
                    <p className="text-[10px] text-on-surface-variant font-mono">{promo.id}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-on-surface">{promo.value}</span>
                      <span className="text-[10px] text-on-surface-variant uppercase font-semibold">{promo.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant={promo.status === 'Active' ? 'success' : promo.status === 'Scheduled' ? 'info' : 'neutral'}>
                      {promo.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-bold text-on-surface">{promo.usage.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-on-surface">
                        <Calendar className="w-3 h-3" />
                        {promo.start}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant">
                        <Clock className="w-3 h-3" />
                        {promo.end}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center bg-surface-container-low -m-8 mb-6 p-8">
                <h3 className="text-2xl font-display font-extrabold text-on-surface">Create Promotion</h3>
                <Button variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)} className="bg-white">Cancel</Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Campaign Name</label>
                  <Input 
                    placeholder="e.g. Black Friday 2023" 
                    value={newPromo.name}
                    onChange={(e) => setNewPromo(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Type</label>
                    <select 
                      className="w-full h-12 px-4 rounded-2xl bg-surface-container border-none text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-primary/20"
                      value={newPromo.type}
                      onChange={(e) => setNewPromo(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option>Percentage</option>
                      <option>Fixed amount</option>
                      <option>Free shipping</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Value</label>
                    <Input 
                      placeholder="e.g. 20% or $50" 
                      value={newPromo.value}
                      onChange={(e) => setNewPromo(prev => ({ ...prev, value: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Start Date</label>
                    <Input 
                      type="date"
                      value={newPromo.start}
                      onChange={(e) => setNewPromo(prev => ({ ...prev, start: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">End Date</label>
                    <Input 
                      type="date"
                      value={newPromo.end}
                      onChange={(e) => setNewPromo(prev => ({ ...prev, end: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full h-14 text-base font-extrabold gap-2" onClick={handleCreate}>
                <TicketPercent className="w-5 h-5" />
                Launch Campaign
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
