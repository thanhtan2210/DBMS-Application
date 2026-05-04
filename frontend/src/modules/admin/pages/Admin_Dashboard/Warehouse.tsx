import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Skeleton, Input } from '@admin/components/ui';
import { 
  Warehouse as WarehouseIcon, 
  MapPin, 
  Package, 
  ArrowRightLeft, 
  TrendingUp, 
  MoreVertical,
  Plus,
  Box,
  Truck,
  MoveHorizontal,
  History as HistoryIcon,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@lib/utils';
import { AnimatePresence, motion } from 'motion/react';

const INITIAL_WAREHOUSES = [
  { 
    id: 'WH-01', 
    name: 'North Vietnam Logistics Hub', 
    location: 'Hanoi, Vietnam', 
    capacity: 85, 
    totalItems: 42500, 
    status: 'Optimal',
    managers: 4
  },
  { 
    id: 'WH-02', 
    name: 'Southern Distribution Center', 
    location: 'Ho Chi Minh City, Vietnam', 
    capacity: 92, 
    totalItems: 68200, 
    status: 'Warning',
    managers: 6
  },
  { 
    id: 'WH-03', 
    name: 'Coastal Post Outlet', 
    location: 'Da Nang, Vietnam', 
    capacity: 15, 
    totalItems: 4200, 
    status: 'Critical',
    managers: 2
  },
];

const INITIAL_TRANSFERS = [
  { id: 'TR-8821', from: 'WH-01', to: 'WH-02', items: 120, status: 'In Transit', date: '2026-04-18' },
  { id: 'TR-8822', from: 'WH-02', to: 'WH-03', items: 450, status: 'Completed', date: '2026-04-17' },
  { id: 'TR-8823', from: 'WH-01', to: 'WH-03', items: 50, status: 'Pending', date: '2026-04-19' },
];

export default function Warehouse() {
  const [loading, setLoading] = useState(true);
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES);
  const [transfers, setTransfers] = useState(INITIAL_TRANSFERS);
  
  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Form states
  const [newWh, setNewWh] = useState({ name: '', location: '', capacity: 50, totalItems: 0 });
  const [newTransfer, setNewTransfer] = useState({ from: '', to: '', items: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleAddWarehouse = () => {
    const freshWh = {
      id: `WH-0${warehouses.length + 1}`,
      ...newWh,
      status: 'Optimal' as const,
      managers: 1
    };
    setWarehouses([...warehouses, freshWh]);
    setIsAddOpen(false);
    setNewWh({ name: '', location: '', capacity: 50, totalItems: 0 });
  };

  const handleCreateTransfer = () => {
    const tr = {
      id: `TR-${Math.floor(8000 + Math.random() * 2000)}`,
      ...newTransfer,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    setTransfers([tr, ...transfers]);
    setIsTransferOpen(false);
    setNewTransfer({ from: '', to: '', items: 0 });
  };

  const deleteWarehouse = (id: string) => {
    setWarehouses(warehouses.filter(w => w.id !== id));
    setActiveMenuId(null);
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>

        <Card className="p-6">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-on-surface">Warehouse Operations</h2>
          <p className="text-on-surface-variant mt-1">Manage physical inventory and inter-warehouse logistics.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Warehouse
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {warehouses.map((wh) => (
          <Card key={wh.id} className="p-6 hover:shadow-lg transition-shadow border border-surface-container relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform" />
            
            <div className="flex items-start justify-between relative">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center">
                <WarehouseIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="relative">
                <button 
                  className="p-2 hover:bg-surface-container rounded-lg transition-colors"
                  onClick={() => setActiveMenuId(activeMenuId === wh.id ? null : wh.id)}
                >
                  <MoreVertical className="w-4 h-4 text-on-surface-variant" />
                </button>
                <AnimatePresence>
                  {activeMenuId === wh.id && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white shadow-2xl rounded-2xl border border-surface-container z-50 p-1"
                    >
                      <button className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-surface-container rounded-xl transition-colors text-on-surface">Edit Details</button>
                      <button 
                        className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-surface-container rounded-xl transition-colors text-on-surface"
                        onClick={() => { setIsHistoryOpen(true); setActiveMenuId(null); }}
                      >
                        View History
                      </button>
                      <div className="h-px bg-surface-container my-1" />
                      <button 
                        className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-red-50 text-red-500 rounded-xl transition-colors"
                        onClick={() => deleteWarehouse(wh.id)}
                      >
                        Delete Warehouse
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-bold text-on-surface line-clamp-1">{wh.name}</h3>
              <div className="flex items-center gap-1 mt-1 text-on-surface-variant">
                <MapPin className="w-3 h-3" />
                <span className="text-xs font-medium">{wh.location}</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-on-surface-variant">Capacity Usage</span>
                  <span className={cn(
                    "font-extrabold",
                    wh.capacity > 90 ? 'text-red-500' : wh.capacity > 80 ? 'text-amber-500' : 'text-green-500'
                  )}>{wh.capacity}%</span>
                </div>
                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      wh.capacity > 90 ? 'bg-red-500' : wh.capacity > 80 ? 'bg-amber-500' : 'bg-green-500'
                    )}
                    style={{ width: `${wh.capacity}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                    <Package className="w-3 h-3" />
                    Items
                  </div>
                  <p className="text-lg font-display font-extrabold mt-1">{(wh.totalItems / 1000).toFixed(1)}k</p>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                    <TrendingUp className="w-3 h-3" />
                    Occupancy
                  </div>
                  <Badge className="mt-1" variant={wh.status === 'Optimal' ? 'success' : wh.status === 'Warning' ? 'warning' : 'error'}>
                    {wh.status}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-primary" />
              Recent Transfers
            </h3>
            <Button variant="tertiary" size="sm" onClick={() => setIsHistoryOpen(true)}>View History</Button>
          </div>
          <div className="space-y-4">
            {transfers.map((tr) => (
              <div key={tr.id} className="p-4 bg-surface-container-lowest border border-surface-container rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                    <Box className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-on-surface text-sm">{tr.from}</span>
                      <MoveHorizontal className="w-3 h-3 text-on-surface-variant" />
                      <span className="font-bold text-on-surface text-sm">{tr.to}</span>
                    </div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">
                      {tr.items} items • {tr.date}
                    </p>
                  </div>
                </div>
                <Badge variant={tr.status === 'Completed' ? 'success' : tr.status === 'In Transit' ? 'info' : 'neutral'}>
                  {tr.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-br from-primary to-primary-container text-on-primary">
          <div className="h-full flex flex-col">
            <h3 className="text-xl font-display font-bold">Optimization Insights</h3>
            <p className="text-on-primary/70 text-sm mt-2">
              Based on recent demand, the Southern Distribution Center is reaching critical capacity.
            </p>
            
            <div className="mt-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">Recommendation</p>
              <p className="text-sm font-medium mt-2">
                Initiate a stock rebalancing: Move 1,500 units of "Summer Apparel" from Southern Hub to North Hub.
              </p>
              <Button 
                variant="secondary" 
                className="w-full mt-4 bg-white text-primary hover:bg-white/90"
                onClick={() => setIsTransferOpen(true)}
              >
                Generate Transfer Order
              </Button>
            </div>

            <div className="mt-auto pt-6 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface">
                    <Truck className="w-3 h-3" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-medium text-white/60">6 Logistics Experts on standby</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Warehouse Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center bg-surface-container-low -m-8 mb-6 p-8">
                <h3 className="text-2xl font-display font-extrabold text-on-surface">Add Warehouse</h3>
                <Button variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="bg-white">Cancel</Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Warehouse Name</label>
                  <Input 
                    placeholder="e.g. Central Hub" 
                    value={newWh.name}
                    onChange={(e) => setNewWh(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Location</label>
                  <Input 
                    placeholder="e.g. Da Nang, Vietnam" 
                    value={newWh.location}
                    onChange={(e) => setNewWh(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Capacity (%)</label>
                    <Input 
                      type="number"
                      value={newWh.capacity}
                      onChange={(e) => setNewWh(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Items</label>
                    <Input 
                      type="number"
                      value={newWh.totalItems}
                      onChange={(e) => setNewWh(prev => ({ ...prev, totalItems: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full h-14 text-base font-extrabold gap-2" onClick={handleAddWarehouse}>
                <CheckCircle2 className="w-5 h-5" />
                Initialize Warehouse
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Transfer Order Modal */}
      {isTransferOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center bg-surface-container-low -m-8 mb-6 p-8">
                <h3 className="text-2xl font-display font-extrabold text-on-surface">Stock Rebalancing</h3>
                <Button variant="outline" size="sm" onClick={() => setIsTransferOpen(false)} className="bg-white">Cancel</Button>
              </div>

              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex gap-4">
                <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                <p className="text-xs text-on-surface-variant font-medium">
                  Optimizing regional stock helps reduce shipping times and costs across the network.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Source WH</label>
                    <select 
                      className="w-full h-12 px-4 rounded-2xl bg-surface-container border-none text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                      value={newTransfer.from}
                      onChange={(e) => setNewTransfer(prev => ({ ...prev, from: e.target.value }))}
                    >
                      <option value="">Select WH</option>
                      {warehouses.map(w => <option key={w.id} value={w.id}>{w.id}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Destination WH</label>
                    <select 
                      className="w-full h-12 px-4 rounded-2xl bg-surface-container border-none text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                      value={newTransfer.to}
                      onChange={(e) => setNewTransfer(prev => ({ ...prev, to: e.target.value }))}
                    >
                      <option value="">Select WH</option>
                      {warehouses.map(w => <option key={w.id} value={w.id}>{w.id}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total Items</label>
                  <Input 
                    type="number"
                    placeholder="e.g. 1500" 
                    value={newTransfer.items}
                    onChange={(e) => setNewTransfer(prev => ({ ...prev, items: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <Button className="w-full h-14 text-base font-extrabold gap-2" onClick={handleCreateTransfer}>
                <ArrowRightLeft className="w-5 h-5" />
                Execute Transfer
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center bg-surface-container-low -m-8 mb-6 p-8 sticky top-0 z-10">
                <h3 className="text-2xl font-display font-extrabold text-on-surface">Logistics History</h3>
                <Button variant="outline" size="sm" onClick={() => setIsHistoryOpen(false)} className="bg-white">Close</Button>
              </div>

              <div className="space-y-4">
                {transfers.map((tr) => (
                  <div key={tr.id} className="p-5 bg-surface-container-low border border-surface-container rounded-2xl flex items-center justify-between group hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                        <HistoryIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-on-surface">{tr.from}</span>
                          <MoveHorizontal className="w-4 h-4 text-on-surface-variant" />
                          <span className="font-extrabold text-on-surface">{tr.to}</span>
                        </div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">
                          Ref: {tr.id} • {tr.items} Units • Created on {tr.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={tr.status === 'Completed' ? 'success' : 'info'}>{tr.status}</Badge>
                      <p className="text-[10px] font-bold text-primary mt-1">Details →</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
