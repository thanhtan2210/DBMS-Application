import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Input, Skeleton } from '@admin/components/ui';
import { 
  TicketPercent, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  TrendingUp, 
  ChevronRight,
  MoreVertical,
  ChevronLeft
} from 'lucide-react';
import { adminListPromotions, adminCreatePromotion, adminDeletePromotion } from '@/modules/admin/services/promotion-service';
import { cn } from '@lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Promotions() {
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [newPromo, setNewPromo] = useState({
    promotionName: '',
    promotionCode: '',
    discountType: 'PERCENTAGE',
    discountValue: 0,
    minimumOrderAmount: 0,
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(0);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const res: any = await adminListPromotions({ page, size: 10 });
      setPromotions(res.content || []);
      setTotalPages(res.totalPages || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [page]);

  const filteredPromotions = promotions.filter(p => {
    const matchesSearch = p.promotionName?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
                          p.promotionCode?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = async () => {
    if (!newPromo.promotionName || !newPromo.promotionCode || !newPromo.startTime || !newPromo.endTime) return;
    try {
      const payload = {
        ...newPromo,
        startTime: new Date(newPromo.startTime).toISOString(),
        endTime: new Date(newPromo.endTime).toISOString()
      };
      await adminCreatePromotion(payload);
      setIsCreateModalOpen(false);
      fetchPromotions();
    } catch(err) {
      console.error(err);
      alert('Failed to create promotion');
    }
  };

  if (loading && promotions.length === 0) {
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
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Campaign Details</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Discount</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Timeline</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Usage</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filteredPromotions.map((promo) => (
                <tr key={promo.promotionId} className="hover:bg-surface-container-lowest transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mt-1">
                        <TicketPercent className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{promo.promotionName}</p>
                        <p className="text-xs font-mono font-bold text-on-surface-variant mt-1 px-2 py-0.5 bg-surface-container inline-block rounded-md">{promo.promotionCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-extrabold text-on-surface">
                      {promo.discountType === 'PERCENTAGE' ? `${promo.discountValue}%` : `$${promo.discountValue}`}
                    </p>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">{promo.discountType}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 text-xs font-medium text-on-surface-variant">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(promo.startTime).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 opacity-50" />
                        {new Date(promo.endTime).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-on-surface">{promo.usedCount || 0} times</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={promo.status === 'ACTIVE' ? 'success' : promo.status === 'EXPIRED' ? 'error' : 'neutral'}>
                      {promo.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="tertiary" size="sm" onClick={() => {
                        if(confirm('Are you sure you want to deactivate this promotion?')) {
                            adminDeletePromotion(promo.promotionId).then(() => fetchPromotions());
                        }
                    }}>Deactivate</Button>
                  </td>
                </tr>
              ))}
              {filteredPromotions.length === 0 && (
                 <tr>
                    <td colSpan={6} className="px-6 py-10 text-center italic text-on-surface-variant">No promotions found</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-surface-container flex items-center justify-between">
           <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Page {page + 1} of {totalPages}</p>
           <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="w-4 h-4"/></Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-4 h-4"/></Button>
           </div>
        </div>
      </Card>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center bg-surface-container-low -m-8 mb-6 p-8">
                <h3 className="text-2xl font-display font-extrabold text-on-surface">Create Campaign</h3>
                <Button variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)} className="bg-white">Cancel</Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Campaign Name</label>
                  <Input 
                    placeholder="e.g. Summer Sale 2026" 
                    value={newPromo.promotionName}
                    onChange={(e) => setNewPromo(prev => ({ ...prev, promotionName: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Promo Code</label>
                  <Input 
                    placeholder="e.g. SUMMER26" 
                    value={newPromo.promotionCode}
                    onChange={(e) => setNewPromo(prev => ({ ...prev, promotionCode: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Discount Type</label>
                    <select 
                      className="w-full h-12 px-4 rounded-2xl bg-surface-container border-none text-sm font-bold"
                      value={newPromo.discountType}
                      onChange={(e) => setNewPromo(prev => ({ ...prev, discountType: e.target.value }))}
                    >
                      <option value="PERCENTAGE">Percentage</option>
                      <option value="FIXED_AMOUNT">Fixed Amount</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Value</label>
                    <Input 
                      type="number"
                      placeholder={newPromo.discountType === 'PERCENTAGE' ? "e.g. 20 (%)" : "e.g. 500 ($)"} 
                      value={newPromo.discountValue}
                      onChange={(e) => setNewPromo(prev => ({ ...prev, discountValue: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Start Time</label>
                    <Input 
                      type="datetime-local"
                      value={newPromo.startTime}
                      onChange={(e) => setNewPromo(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">End Time</label>
                    <Input 
                      type="datetime-local"
                      value={newPromo.endTime}
                      onChange={(e) => setNewPromo(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Minimum Order Amount</label>
                    <Input 
                      type="number"
                      placeholder="e.g. 100" 
                      value={newPromo.minimumOrderAmount}
                      onChange={(e) => setNewPromo(prev => ({ ...prev, minimumOrderAmount: Number(e.target.value) }))}
                    />
                  </div>
              </div>

              <Button className="w-full h-14 text-base font-extrabold gap-2" onClick={handleCreate}>
                Publish Campaign
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
