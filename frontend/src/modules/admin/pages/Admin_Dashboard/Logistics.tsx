import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Input } from '@admin/components/ui';
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
  Zap
} from 'lucide-react';
import { cn } from '@lib/utils';
import { MOCK_ORDERS } from '@admin/types';
import { motion, AnimatePresence } from 'motion/react';

const PIPELINE_STEPS = [
  { id: 'processing', label: 'Processing', icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
  { id: 'transit', label: 'In Transit', icon: Truck, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' }
];

export default function Logistics() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const [viewStep, setViewStep] = useState<typeof PIPELINE_STEPS[0] | null>(null);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [isManagingLogistics, setIsManagingLogistics] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [activeCarriers, setActiveCarriers] = useState({
    fedex: true,
    ups: true,
    dhl: true
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [searchTrack, setSearchTrack] = useState('');
  const [optimizingProgress, setOptimizingProgress] = useState(0);

  const toggleOrderSelection = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
    );
  };

  const handleBatchAction = () => {
    setIsBatchProcessing(true);
    setTimeout(() => {
      setIsBatchProcessing(false);
      setSelectedOrders([]);
      setViewStep(null);
      // In a real app, this would trigger a backend process
    }, 2500);
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    setOptimizingProgress(0);
    const interval = setInterval(() => {
      setOptimizingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsOptimizing(false), 800);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const getFilteredOrders = (stepId: string) => {
    return MOCK_ORDERS.filter(o => {
      if(stepId === 'processing') return o.status === 'Pending';
      if(stepId === 'transit') return o.status === 'Processing';
      return o.status === 'Delivered';
    });
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-12 flex flex-col items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </Card>
          ))}
        </div>
        <Card className="p-8">
           <Skeleton className="h-[400px] w-full" />
        </Card>
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
        <Button 
          className="gap-2 h-11 shadow-ambient" 
          onClick={handleOptimize}
          disabled={isOptimizing}
        >
          {isOptimizing ? (
            <>
              <Activity className="w-4 h-4 animate-pulse" />
              Optimizing {optimizingProgress}%
            </>
          ) : (
            <>
              Optimize Routes
              <ArrowUpRight className="w-4 h-4" />
            </>
          )}
        </Button>
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
                <div key={order.id} className="p-4 bg-surface-container-low rounded-xl hover:bg-surface-container transition-all cursor-pointer group/item border border-transparent hover:border-outline-variant/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-primary">{order.id}</span>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{order.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <p className="text-sm font-bold text-on-surface">{order.customer.name}</p>
                     </div>
                     <p className="text-xs font-extrabold text-on-surface">${order.amount.toFixed(2)}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-surface-container flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-on-surface-variant" />
                      <span className="text-[10px] font-medium text-on-surface-variant">Shipping to NY, USA</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover/item:translate-x-1 transition-transform" />
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
                 placeholder="Search tracking ID..."
                 value={searchTrack}
                 onChange={(e) => setSearchTrack(e.target.value)}
               />
            </div>
          </div>
          <div className="space-y-6">
             {[1, 2, 3].filter(i => `SHP-129038${i}`.includes(searchTrack.toUpperCase())).map((entry) => (
                <div key={entry} className="flex items-center justify-between gap-4 p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-all cursor-pointer group border border-transparent hover:border-surface-container-high transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-surface-container group-hover:scale-105 transition-transform">
                      <Truck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">SHP-129038{entry}</p>
                      <p className="text-xs text-on-surface-variant font-medium">Out for delivery in London, UK</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-on-surface">ETA: 4:30 PM</p>
                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-0.5">On Schedule</p>
                  </div>
                </div>
             ))}
             {searchTrack && [1, 2, 3].filter(i => `SHP-129038${i}`.includes(searchTrack.toUpperCase())).length === 0 && (
               <div className="p-12 flex flex-col items-center justify-center text-center bg-surface-container-low rounded-3xl border border-dashed border-surface-container">
                 <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-on-surface-variant" />
                 </div>
                 <p className="text-sm font-bold text-on-surface">No shipments found</p>
                 <p className="text-xs text-on-surface-variant mt-1">Try another tracking number</p>
               </div>
             )}
          </div>
        </Card>

        <Card className="p-8 relative overflow-hidden bg-[#0d1b2a] text-white/90">
           <div className="relative z-10 h-full flex flex-col">
             <h3 className="text-xl font-bold mb-2">Carrier Performance</h3>
             <p className="text-xs text-white/50 mb-8 font-medium">Real-time efficiency metrics across all active shipping partners.</p>
             
             <div className="flex-1 space-y-6">
                {[
                  { name: 'FedEx Express', status: 98, trend: '+2%' },
                  { name: 'UPS Logistics', status: 94, trend: '-1%' },
                  { name: 'DHL Global', status: 96, trend: '+4%' }
                ].map((carrier) => (
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
                   <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/30">Total Active Shipments</p>
                   <p className="text-3xl font-display font-extrabold text-white">1,204</p>
                </div>
                <div className="flex -space-x-3">
                   {[1, 2, 3, 4].map((i) => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0d1b2a] bg-primary/20 flex items-center justify-center text-[10px] font-bold text-white relative group cursor-pointer hover:z-20 hover:scale-110 transition-all">
                        {String.fromCharCode(64 + i)}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white text-black text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap shadow-xl">
                           Partner Node {i}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           </div>
           
           <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
           <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-secondary/10 rounded-full blur-[80px]" />
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
                    key={order.id} 
                    onClick={() => toggleOrderSelection(order.id)}
                    className={cn(
                      "p-6 bg-surface-container-low rounded-3xl border transition-all group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 cursor-pointer relative",
                      selectedOrders.includes(order.id) 
                        ? "border-primary bg-primary/5 shadow-md" 
                        : "border-surface-container hover:border-primary/20 hover:bg-white hover:shadow-xl"
                    )}
                  >
                    {selectedOrders.includes(order.id) && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-surface-container group-hover:scale-110 transition-transform shadow-xs">
                          <Package className="w-6 h-6 text-primary/40 group-hover:text-primary transition-colors" />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-primary uppercase tracking-widest">{order.id}</p>
                          <p className="text-sm font-extrabold text-on-surface mt-1">{order.customer.name}</p>
                          <div className="flex items-center gap-4 mt-2">
                             <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-on-surface-variant" />
                                <span className="text-[11px] font-medium text-on-surface-variant">New York, NY</span>
                             </div>
                             <div className="flex items-center gap-1.5">
                                <Timer className="w-3.5 h-3.5 text-on-surface-variant" />
                                <span className="text-[11px] font-medium text-on-surface-variant">{order.date}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-surface-container">
                       <div className="text-right">
                          <p className="text-lg font-display font-extrabold text-on-surface">${order.amount.toFixed(2)}</p>
                          <Badge variant="neutral" className="mt-1">Standard Shipping</Badge>
                       </div>
                       <Button variant="outline" className="rounded-2xl h-12 w-12 p-0 bg-white border-surface-container shadow-sm hover:scale-105 transition-transform active:scale-95">
                          <ChevronRight className="w-5 h-5 text-on-surface-variant" />
                       </Button>
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
                    <Button 
                      className="gap-2 px-8 rounded-2xl shadow-ambient transition-transform active:scale-95"
                      onClick={() => setIsManagingLogistics(true)}
                    >
                       Manage Logistics
                    </Button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Optimize Routes Simulation Modal */}
      <AnimatePresence>
        {isOptimizing && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateY: 20 }}
              className="bg-[#0f172a] text-white w-full max-w-xl rounded-[48px] p-12 overflow-hidden relative shadow-2xl"
            >
              <div className="relative z-10 flex flex-col items-center text-center">
                 <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-8 relative">
                    <Navigation className="w-10 h-10 text-primary animate-bounce shadow-[0_0_15px_rgba(37,99,235,0.8)]" />
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
                 </div>
                 <h3 className="text-4xl font-display font-extrabold mb-4">Neural Routing Engine</h3>
                 <p className="text-white/40 text-sm max-w-sm mb-12 font-medium">Calculating 12,000+ permutations across 4 regions to find the most efficient fulfillment path.</p>
                 
                 <div className="w-full space-y-6">
                    <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">
                       <span>Optimization Status</span>
                       <span>{optimizingProgress}% Complete</span>
                    </div>
                    <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                       <motion.div 
                        className="h-full bg-primary rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${optimizingProgress}%` }}
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       {[
                         { label: 'CO2 Reduction', value: '-12%', icon: Zap },
                         { label: 'Speed Boost', value: '+18h', icon: Package }
                       ].map((stat, i) => (
                         <div key={i} className="p-4 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between transition-colors hover:bg-white/10">
                            <div className="flex items-center gap-3">
                               <stat.icon className="w-4 h-4 text-primary" />
                               <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{stat.label}</span>
                            </div>
                            <span className="text-sm font-display font-extrabold text-white">{stat.value}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Background scanning effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent)]" />
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary/30 shadow-[0_0_20px_rgba(37,99,235,0.5)] animate-scan" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Batch Processing Simulation */}
      <AnimatePresence>
        {isBatchProcessing && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white text-on-surface w-full max-w-md rounded-[40px] p-10 overflow-hidden shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Timer className="w-10 h-10 text-primary animate-spin" />
              </div>
              <h3 className="text-2xl font-display font-extrabold mb-2">Generating Labels</h3>
              <p className="text-sm text-on-surface-variant font-medium mb-8">
                Processing {selectedOrders.length} shipping manifests and generating carrier API tokens...
              </p>
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden mb-4">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2 }}
                />
              </div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Authenticating with Carrier...</p>
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
                    {[
                      { region: 'North America', status: 'Optimal', cost: '$12.40 avg' },
                      { region: 'Europe (SEPA)', status: 'High Volume', cost: '€14.20 avg' },
                      { region: 'Southeast Asia', status: 'Optimal', cost: '$8.50 avg' }
                    ].map((hub) => (
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
                  Reset Defaults
                </Button>
                <Button className="flex-1 rounded-2xl h-14 shadow-ambient" onClick={() => setIsManagingLogistics(false)}>
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
