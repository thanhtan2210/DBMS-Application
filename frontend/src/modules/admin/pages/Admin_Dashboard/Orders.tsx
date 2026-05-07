import { Card, Button, Badge, Input, Skeleton } from '@admin/components/ui';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Mail,
  Users,
  PackageCheck,
  FileText,
  CheckCircle,
  Truck,
  XCircle,
  Package,
  MapPin,
  ShoppingBag
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchOrders, updateOrderStatus } from '@/modules/admin/services/order-service';
import { cn } from '@lib/utils';
import React from 'react';

export default function Orders() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<any>(null);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await fetchOrders({ keyword: debouncedSearchQuery });
      const data = response.content || [];
      setOrders(data);
      // Auto select first order if none selected or if search changed
      if (data.length > 0) {
        if (!selectedOrderId || !data.find((o: any) => o.orderId === selectedOrderId)) {
           setSelectedOrderId(data[0].orderId);
        }
      } else {
        setSelectedOrderId(null);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Không thể tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [debouncedSearchQuery]);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateOrderStatus(id, status);
      await loadOrders();
      alert(`Đã cập nhật trạng thái đơn hàng thành ${status}`);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Lỗi khi cập nhật trạng thái");
    }
  };

  const selectedOrder = orders.find(o => o.orderId === selectedOrderId);


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT': return <Badge variant="info" className="bg-slate-100 text-slate-600 border-slate-200">Pending Payment</Badge>;
      case 'PAID': return <Badge variant="info" className="bg-blue-50 text-blue-600 border-blue-100">Paid</Badge>;
      case 'CONFIRMED': return <Badge variant="info" className="bg-indigo-50 text-indigo-600 border-indigo-100">Confirmed</Badge>;
      case 'PROCESSING': return <Badge variant="info" className="bg-amber-50 text-amber-600 border-amber-100">Processing</Badge>;
      case 'PACKED': return <Badge variant="info" className="bg-orange-50 text-orange-600 border-orange-100">Packed</Badge>;
      case 'SHIPPED': return <Badge variant="info" className="bg-cyan-50 text-cyan-600 border-cyan-100">Shipped</Badge>;
      case 'DELIVERED': return <Badge variant="info" className="bg-emerald-50 text-emerald-600 border-emerald-100">Delivered</Badge>;
      case 'CANCELLED': return <Badge variant="danger">Cancelled</Badge>;
      case 'PAYMENT_FAILED': return <Badge variant="danger">Payment Failed</Badge>;
      case 'RETURNED': return <Badge variant="warning">Returned</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (loading && orders.length === 0) {
    return <div className="p-20 text-center italic text-stellar-muted">Loading orders...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-on-surface">Order Processing</h2>
          <p className="text-on-surface-variant mt-1">Manage lifecycle and fulfillment of customer orders.</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant transition-colors group-focus-within:text-primary" />
          <Input 
            placeholder="Search by Code or Customer..." 
            className="pl-12 h-11 w-80 bg-white shadow-ambient border-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2 space-y-6">
          <Card className="overflow-hidden border border-surface-container-high/50">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant">
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest">Order Code</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {orders.map((order) => (
                  <tr 
                    key={order.orderId} 
                    className={cn("hover:bg-primary/5 cursor-pointer transition-all", selectedOrderId === order.orderId ? "bg-primary/5 shadow-inner" : "")}
                    onClick={() => setSelectedOrderId(order.orderId)}
                  >
                    <td className="px-6 py-5 text-sm font-bold text-primary">{order.orderCode}</td>
                    <td className="px-6 py-5">
                       <p className="text-sm font-bold text-on-surface">{order.customer?.name || 'Unknown'}</p>
                       <p className="text-[10px] text-on-surface-variant uppercase font-bold">{order.customer?.email}</p>
                    </td>
                    <td className="px-6 py-5">{getStatusBadge(order.orderStatus)}</td>
                    <td className="px-6 py-5 text-sm font-extrabold text-right text-on-surface">${order.totalAmount?.toLocaleString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && !loading && (
                   <tr>
                     <td colSpan={4} className="py-20 text-center text-on-surface-variant italic">No orders found.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>

        <Card className="p-0 overflow-hidden sticky top-28 border border-surface-container-high/50 shadow-2xl">
          {selectedOrder ? (
            <div className="p-8 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stellar-muted mb-2 block">Order Identity</span>
                  <h3 className="text-2xl font-display font-black text-on-surface">{selectedOrder.orderCode}</h3>
                  <p className="text-[10px] text-stellar-muted mt-1 font-bold">PLACED ON {new Date(selectedOrder.createdAt).toLocaleString().toUpperCase()}</p>
                </div>
                {getStatusBadge(selectedOrder.orderStatus)}
              </div>

              {/* Customer Section */}
              <div className="space-y-4 pt-6 border-t border-surface-container">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary"><Users className="w-5 h-5" /></div>
                    <div>
                       <p className="text-sm font-bold text-on-surface">{selectedOrder.customer?.name}</p>
                       <p className="text-xs text-on-surface-variant">{selectedOrder.customer?.email}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3 bg-surface-container-low p-4 rounded-2xl">
                    <MapPin className="w-5 h-5 text-stellar-muted mt-0.5" />
                    <div>
                       <p className="text-[10px] font-bold uppercase text-stellar-muted mb-1">Shipping Destination</p>
                       <p className="text-xs font-bold text-on-surface leading-relaxed">
                          {selectedOrder.shippingAddress?.receiverName}<br/>
                          {selectedOrder.shippingAddress?.phone}<br/>
                          {selectedOrder.shippingAddress?.fullAddress}
                       </p>
                    </div>
                 </div>
              </div>

              {/* Items Section */}
              <div className="space-y-4 pt-6 border-t border-surface-container">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-stellar-muted">Order Items</p>
                 <div className="space-y-3">
                    {selectedOrder.items && selectedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                              <ShoppingBag className="w-4 h-4" />
                           </div>
                           <div>
                             <p className="text-xs font-bold text-on-surface">{item.productName}</p>
                             <p className="text-[9px] text-on-surface-variant font-medium">{item.variantName} x {item.quantity}</p>
                           </div>
                        </div>
                        <p className="text-xs font-black text-on-surface">${item.lineTotal?.toLocaleString()}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Status Update Section */}
              <div className="space-y-4 pt-6 border-t border-surface-container">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-stellar-muted">Manage Fulfillment</p>
                 <div className="grid grid-cols-2 gap-3">
                    {selectedOrder.orderStatus === 'PAID' && (
                       <Button onClick={() => handleStatusUpdate(selectedOrder.id, 'CONFIRMED')} className="gap-2 bg-indigo-600 shadow-lg shadow-indigo-200 h-12 text-[10px] font-bold uppercase">
                          <CheckCircle className="w-4 h-4"/> Confirm Order
                       </Button>
                    )}
                    {selectedOrder.orderStatus === 'CONFIRMED' && (
                       <Button onClick={() => handleStatusUpdate(selectedOrder.id, 'PROCESSING')} className="gap-2 bg-blue-600 shadow-lg shadow-blue-200 h-12 text-[10px] font-bold uppercase">
                          <PackageCheck className="w-4 h-4"/> Start Processing
                       </Button>
                    )}
                    {selectedOrder.orderStatus === 'PROCESSING' && (
                       <Button onClick={() => handleStatusUpdate(selectedOrder.id, 'PACKED')} className="gap-2 bg-amber-600 shadow-lg shadow-amber-200 h-12 text-[10px] font-bold uppercase">
                          <Package className="w-4 h-4"/> Mark Packed
                       </Button>
                    )}
                    {selectedOrder.orderStatus === 'PACKED' && (
                       <Button onClick={() => handleStatusUpdate(selectedOrder.id, 'SHIPPED')} className="gap-2 bg-cyan-600 shadow-lg shadow-cyan-200 h-12 text-[10px] font-bold uppercase">
                          <Truck className="w-4 h-4"/> Ship Package
                       </Button>
                    )}
                    {selectedOrder.orderStatus === 'SHIPPED' && (
                       <Button onClick={() => handleStatusUpdate(selectedOrder.id, 'DELIVERED')} className="gap-2 bg-emerald-600 shadow-lg shadow-emerald-200 h-12 text-[10px] font-bold uppercase">
                          <CheckCircle className="w-4 h-4"/> Mark Delivered
                       </Button>
                    )}
                    {['PAID', 'CONFIRMED', 'PROCESSING'].includes(selectedOrder.orderStatus) && (
                       <Button onClick={() => handleStatusUpdate(selectedOrder.id, 'CANCELLED')} variant="outline" className="gap-2 text-red-500 border-red-100 hover:bg-red-50 h-12 text-[10px] font-bold uppercase">
                          <XCircle className="w-4 h-4"/> Cancel
                       </Button>
                    )}
                 </div>
                 {['DELIVERED', 'CANCELLED', 'RETURNED'].includes(selectedOrder.orderStatus) && (
                    <div className="py-6 text-center bg-surface-container-low rounded-2xl border border-dashed border-surface-container-high">
                       <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest italic opacity-50">
                          Transaction Lifecycle Completed
                       </p>
                    </div>
                 )}
              </div>

              <div className="pt-6 border-t border-surface-container">
                 <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Valuation</span>
                    <span className="text-3xl font-black text-stellar-accent">${selectedOrder.totalAmount?.toLocaleString()}</span>
                 </div>
                 <Button 
                   onClick={() => window.open(`http://localhost:8080/api/orders/${selectedOrder.orderId}/invoice`, '_blank')}
                   variant="outline" 
                   className="w-full gap-2 h-14 border-surface-container-high text-on-surface-variant hover:bg-surface-container-low transition-all"
                 >
                    <FileText className="w-4 h-4"/> Download Invoice
                 </Button>
              </div>
            </div>
          ) : (
            <div className="p-20 text-center space-y-4">
               <PackageCheck className="w-12 h-12 text-surface-container-high mx-auto" />
               <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest italic">Select an order to view full intelligence</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
