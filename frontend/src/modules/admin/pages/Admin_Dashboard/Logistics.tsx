import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Input, Skeleton } from '@admin/components/ui';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  ChevronRight,
  Search,
  ArrowUpRight,
  Timer,
  X,
  Navigation,
  Activity,
  Zap,
  SlidersHorizontal
} from 'lucide-react';
import { cn } from '@lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { getOrders, getLogisticsConfig, updateCarriers, optimizeRoutes, generateLabels, getCarrierPerformance } from '@/modules/admin/services/logistics-service';

const PIPELINE_STEPS = [
  { id: 'PENDING_PAYMENT', label: 'Pending Payment', icon: Package, color: 'text-gray-500', bg: 'bg-gray-100' },
  { id: 'PROCESSING', label: 'Processing', icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
  { id: 'SHIPPED', label: 'In Transit', icon: Truck, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' }
];

export default function Logistics() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  
  // Logistics Config State
  const [activeCarriers, setActiveCarriers] = useState<Record<string, boolean>>({});
  const [regionalRules, setRegionalRules] = useState<any[]>([]);
  const [carrierPerformance, setCarrierPerformance] = useState<any[]>([]);

  const [viewStep, setViewStep] = useState<typeof PIPELINE_STEPS[0] | null>(null);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [isManagingLogistics, setIsManagingLogistics] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchTrack, setSearchTrack] = useState('');
  const [optimizingProgress, setOptimizingProgress] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchConfig();
    fetchPerformance();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data.content || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConfig = async () => {
    try {
      const config = await getLogisticsConfig();
      setActiveCarriers(config.activeCarriers || {});
      setRegionalRules(config.regionalRules || []);
    } catch (err) {
      console.error("Failed to fetch logistics config:", err);
    }
  };

  const fetchPerformance = async () => {
    try {
      const data = await getCarrierPerformance();
      setCarrierPerformance(data || []);
    } catch (err) {
      console.error("Failed to fetch performance:", err);
    }
  };

  const handleSaveCarriers = async () => {
    try {
      await updateCarriers(activeCarriers);
      setIsManagingLogistics(false);
      alert("Carriers configuration saved!");
    } catch (err) {
      console.error("Failed to save carriers:", err);
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setOptimizingProgress(0);
    const interval = setInterval(() => {
      setOptimizingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const res = await optimizeRoutes();
      setTimeout(() => {
        setIsOptimizing(false);
        alert(res);
      }, 2500);
    } catch (err) {
      setIsOptimizing(false);
    }
  };

  const handleBatchAction = async () => {
    setIsBatchProcessing(true);
    try {
      const selectedOrderCodes = orders.filter(o => selectedOrders.includes(o.orderId)).map(o => o.orderCode);
      const res = await generateLabels(selectedOrderCodes);
      setTimeout(() => {
        setIsBatchProcessing(false);
        setSelectedOrders([]);
        setViewStep(null);
        alert(res);
      }, 2500);
    } catch (err) {
      setIsBatchProcessing(false);
    }
  };

  const toggleOrderSelection = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
    );
  };

  const getFilteredOrders = (stepId: string) => {
    return orders.filter(o => o.orderStatus === stepId);
  };

  const trackedOrders = orders.filter(o => 
    o.orderCode.toUpperCase().includes(searchTrack.toUpperCase())
  );

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <Skeleton className="h-9 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Card key={i} className="p-12" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-on-surface">Logistics & Fulfillment</h2>
          <p className="text-on-surface-variant mt-1">Streamline your shipping and delivery operations.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            className="gap-2 h-11 px-6 shadow-sm" 
            onClick={handleOptimize}
            disabled={isOptimizing}
          >
            {isOptimizing ? <Activity className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {isOptimizing ? `Optimizing ${optimizingProgress}%` : 'Optimize Routes'}
          </Button>
          <Button 
            className="gap-2 h-11 px-6 shadow-ambient" 
            onClick={() => setIsManagingLogistics(true)}
          >
            <SlidersHorizontal className="w-5 h-5" />
            Manage Logistics
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {PIPELINE_STEPS.map((step) => (
          <Card key={step.id} className="p-0 overflow-hidden border border-surface-container-high/50 group">
            <div className={cn("p-6 flex items-center justify-between border-b border-surface-container transition-colors", step.bg)}>
              <div className="flex items-center gap-3">
                <step.icon className={cn("w-6 h-6", step.color)} />
                <h3 className="font-bold text-on-surface">{step.label}</h3>
              </div>
              <Badge variant="neutral">{getFilteredOrders(step.id).length} Orders</Badge>
            </div>
            <div className="p-4 space-y-3">
              {getFilteredOrders(step.id).slice(0, 4).map((order) => (
                <div key={order.orderId} className="p-4 bg-surface-container-low rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-primary">{order.orderCode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <p className="text-sm font-bold text-on-surface">{order.customer?.name}</p>
                     <p className="text-xs font-extrabold text-on-surface">${order.totalAmount?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full mt-2 h-10 text-xs gap-2 shadow-sm"
                onClick={() => setViewStep(step)}
              >
                View All {step.label}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h3 className="text-xl font-bold">Quick Shipment Tracker</h3>
            <div className="relative w-full sm:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
               <Input 
                 className="pl-10 h-10 text-xs" 
                 placeholder="Search Order Code..."
                 value={searchTrack}
                 onChange={(e) => setSearchTrack(e.target.value)}
               />
            </div>
          </div>
          <div className="space-y-6">
             {trackedOrders.slice(0, 3).map((order) => (
                <div key={order.orderId} className="flex items-center justify-between gap-4 p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-all cursor-pointer group border border-transparent hover:border-surface-container-high transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-surface-container group-hover:scale-105 transition-transform">
                      <Truck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{order.orderCode}</p>
                      <p className="text-xs text-on-surface-variant font-medium">Destination: {order.shippingAddress?.fullAddress.split(',').pop()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-on-surface">{order.orderStatus}</p>
                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-0.5">Live Data</p>
                  </div>
                </div>
             ))}
             {searchTrack && trackedOrders.length === 0 && (
               <div className="p-12 flex flex-col items-center justify-center text-center bg-surface-container-low rounded-3xl border border-dashed border-surface-container">
                 <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-on-surface-variant" />
                 </div>
                 <p className="text-sm font-bold text-on-surface">No shipments found</p>
                 <p className="text-xs text-on-surface-variant mt-1">Try another order code</p>
               </div>
             )}
          </div>
        </Card>

        <Card className="p-8 relative overflow-hidden bg-[#0d1b2a] text-white/90">
           <div className="relative z-10 h-full flex flex-col">
             <h3 className="text-xl font-bold mb-2">Carrier Performance</h3>
             <p className="text-xs text-white/50 mb-8 font-medium">Real-time efficiency metrics from Backend.</p>
             
             <div className="flex-1 space-y-6">
                {carrierPerformance.map((carrier) => (
                  <div key={carrier.name} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                       <span>{carrier.name}</span>
                       <span className="text-primary-container">{carrier.status}% On-time</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-primary-container transition-all duration-1000" 
                         style={{ width: `${carrier.status}%` }} 
                       />
                    </div>
                  </div>
                ))}
             </div>
             
             <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-end">
                <div>
                   <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/30">Total Orders Tracked</p>
                   <p className="text-3xl font-display font-extrabold text-white">{orders.length}</p>
                </div>
             </div>
           </div>
        </Card>
      </div>

      {/* View All Modal */}
      <AnimatePresence>
        {viewStep && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border border-surface-container"
            >
              <div className={cn("p-8 sm:p-10 flex items-center justify-between shrink-0", viewStep.bg)}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                    <viewStep.icon className={cn("w-6 h-6", viewStep.color)} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-extrabold text-on-surface">{viewStep.label} Orders</h3>
                    <p className="text-xs text-on-surface-variant font-medium mt-0.5">Showing all orders currently in {viewStep.label.toLowerCase()} phase.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setViewStep(null)} className="bg-white hover:bg-surface-container rounded-2xl w-10 h-10 p-0 shadow-sm border border-surface-container transition-transform active:scale-95">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-4">
                {getFilteredOrders(viewStep.id).map((order) => (
                  <div 
                    key={order.orderId} 
                    onClick={() => toggleOrderSelection(order.orderId)}
                    className={cn(
                      "p-6 bg-surface-container-low rounded-3xl border transition-all group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 cursor-pointer relative",
                      selectedOrders.includes(order.orderId) 
                        ? "border-primary bg-primary/5 shadow-md" 
                        : "border-surface-container hover:border-primary/20 hover:bg-white hover:shadow-xl"
                    )}
                  >
                    {selectedOrders.includes(order.orderId) && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-surface-container group-hover:scale-110 transition-transform shadow-xs">
                          <Package className="w-6 h-6 text-primary/40 group-hover:text-primary transition-colors" />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-primary uppercase tracking-widest">{order.orderCode}</p>
                          <p className="text-sm font-extrabold text-on-surface mt-1">{order.customer?.name}</p>
                          <div className="flex items-center gap-4 mt-2">
                             <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-on-surface-variant" />
                                <span className="text-[11px] font-medium text-on-surface-variant">{order.shippingAddress?.fullAddress.split(',').pop()}</span>
                             </div>
                             <div className="flex items-center gap-1.5">
                                <Timer className="w-3.5 h-3.5 text-on-surface-variant" />
                                <span className="text-[11px] font-medium text-on-surface-variant">{new Date(order.createdAt).toLocaleDateString()}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-surface-container">
                       <div className="text-right">
                          <p className="text-lg font-display font-extrabold text-on-surface">${order.totalAmount?.toFixed(2)}</p>
                          <Badge variant="neutral" className="mt-1">Standard Shipping</Badge>
                       </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 sm:p-10 bg-surface-container-lowest border-t border-surface-container shrink-0 flex flex-col sm:flex-row items-center justify-between gap-6">
                 <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                       {selectedOrders.length} of {getFilteredOrders(viewStep.id).length} orders selected
                    </p>
                    {selectedOrders.length > 0 && (
                      <button 
                        onClick={() => setSelectedOrders([])}
                        className="text-[10px] font-extrabold text-primary uppercase tracking-widest mt-1 hover:underline"
                      >
                        Clear Selection
                      </button>
                    )}
                 </div>
                 <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      className="bg-white gap-2 px-6 rounded-2xl border-surface-container shadow-sm transition-transform active:scale-95 disabled:opacity-50"
                      disabled={selectedOrders.length === 0}
                      onClick={handleBatchAction}
                    >
                       <Zap className="w-4 h-4 text-amber-500" />
                       Batch Process Labels
                    </Button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Logistics Modal */}
      <AnimatePresence>
        {isManagingLogistics && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[250] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col border border-surface-container"
            >
              <div className="p-8 border-b border-surface-container flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-display font-extrabold">Logistics Configuration</h3>
                  <p className="text-xs text-on-surface-variant font-medium">Control carriers, hubs, and regional rules.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsManagingLogistics(false)} className="rounded-2xl w-10 h-10 p-0 shadow-sm border border-surface-container">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                <section>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Active Carriers</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Object.entries(activeCarriers).map(([carrier, active]) => (
                      <div 
                        key={carrier}
                        onClick={() => setActiveCarriers(prev => ({ ...prev, [carrier]: !active }))}
                        className={cn(
                          "p-4 rounded-3xl border transition-all cursor-pointer flex flex-col items-center gap-3",
                          active ? "border-primary bg-primary/5" : "border-surface-container bg-surface-container-lowest grayscale"
                        )}
                      >
                         <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                            <Truck className={cn("w-5 h-5", active ? "text-primary" : "text-on-surface-variant")} />
                         </div>
                         <span className="text-xs font-bold capitalize">{carrier}</span>
                         <Badge variant={active ? "success" : "neutral"}>{active ? "Active" : "Paused"}</Badge>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Regional Fulfillment Rules</p>
                  <div className="space-y-3">
                    {regionalRules.map((hub) => (
                      <div key={hub.region} className="p-4 bg-surface-container-low rounded-2xl flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold">{hub.region}</span>
                         </div>
                         <div className="flex items-center gap-4">
                            <span className="text-xs font-medium text-on-surface-variant">{hub.cost}</span>
                            <Badge variant={hub.status === 'Optimal' ? 'success' : 'warning'}>{hub.status}</Badge>
                         </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="p-8 bg-surface-container-lowest border-t border-surface-container flex gap-4">
                <Button variant="outline" className="flex-1 rounded-2xl h-14" onClick={() => setIsManagingLogistics(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 rounded-2xl h-14 shadow-ambient" onClick={handleSaveCarriers}>
                  Save Configuration
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
