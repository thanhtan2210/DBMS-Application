import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Package, ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import axiosClient from "@/api/axiosClient";

interface OrderItem {
  id: number;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface OrderDTO {
  id: string;
  orderCode: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export function MyOrders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const customerIdMap: Record<string, number> = {
    'alice@email.com': 2,
    'bob@email.com': 3,
    'carol@email.com': 4
  };
  const customerId = user ? (customerIdMap[user.email] || 2) : 2;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Using existing endpoint in OrderController: /api/customers/{customerId}/orders
        const res: any = await axiosClient.get(`/customers/${customerId}/orders`);
        setOrders(res.data || res.content || res || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user, customerId]);

  if (!user) {
    return (
      <div className="container-custom py-40 flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold mb-6">Identity Required</h1>
        <Link to="/login" className="bg-postpurchase-accent text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs">
           Sign In
        </Link>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'DELIVERED': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'CANCELLED': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DELIVERED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50/30">
      <div className="container-custom max-w-4xl">
        <div className="flex justify-between items-end mb-12">
          <div>
            <Link to="/profile" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-postpurchase-muted hover:text-postpurchase-accent transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Profile
            </Link>
            <h1 className="text-4xl font-bold tracking-tighter uppercase flex items-center gap-4">
              <Package className="w-8 h-8 text-postpurchase-accent" /> My Orders
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-postpurchase-muted">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-16 text-center border border-postpurchase-border shadow-sm">
            <Package className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-postpurchase-accent mb-4">No orders yet</h3>
            <p className="text-postpurchase-muted mb-8">You haven't placed any architectural orders.</p>
            <Link to="/shop" className="inline-block bg-postpurchase-accent text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px]">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-3xl p-8 border border-postpurchase-border shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-postpurchase-border">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-postpurchase-muted mb-1 block">Order Code</span>
                    <h3 className="text-xl font-bold">{order.orderCode}</h3>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-postpurchase-muted mb-1 block">Date Placed</span>
                    <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-postpurchase-muted mb-1 block">Total Amount</span>
                    <p className="text-xl font-bold text-postpurchase-accent">${order.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="text-xs font-bold uppercase tracking-widest">{order.status}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-postpurchase-muted block">Items in Order</span>
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                      <div>
                        <p className="text-sm font-bold">{item.productName || item.variantName}</p>
                        <p className="text-xs text-postpurchase-muted">{item.variantName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-postpurchase-accent">${item.lineTotal.toLocaleString()}</p>
                        <p className="text-xs text-postpurchase-muted">Qty: {item.quantity} x ${item.unitPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
