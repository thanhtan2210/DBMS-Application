import { Card, Button, Badge, Input, Skeleton } from '@admin/components/ui';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Truck,
  FileText,
  PackageCheck,
  Users
} from 'lucide-react';
import { MOCK_ORDERS } from '@admin/types';
import { useState, useEffect } from 'react';
import { cn } from '@lib/utils';
import React from 'react';

export default function Orders() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(MOCK_ORDERS[0].id);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesTab = 
      activeTab === 'All' ? true :
      activeTab === 'Pending' ? order.status === 'Pending' :
      order.status === 'Delivered';
    
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    items: [{ id: '1', name: '', price: 0, quantity: 1, sku: '' }]
  });

  const handleCreateOrder = () => {
    const totalAmount = newOrderForm.items.reduce((sum, item) => sum + (item.price * item.quantity), 11);
    const order = {
      id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: { name: newOrderForm.customerName, email: newOrderForm.customerEmail },
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending' as const,
      amount: totalAmount,
      items: newOrderForm.items.map(item => ({ ...item, id: Math.random().toString() }))
    };
    setOrders([order, ...orders]);
    setSelectedOrderId(order.id);
    setIsCreateOrderOpen(false);
    setNewOrderForm({
      customerName: '',
      customerEmail: '',
      items: [{ id: '1', name: '', price: 0, quantity: 1, sku: '' }]
    });
  };

  const addItemToForm = () => {
    setNewOrderForm(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), name: '', price: 0, quantity: 1, sku: '' }]
    }));
  };

  const handleFulfillOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Delivered' } : o));
  };

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || filteredOrders[0] || orders[0];

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="xl:col-span-2 space-y-6">
            <Card className="overflow-hidden p-6 space-y-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </Card>
          </div>
          <Card className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="space-y-4">
               <Skeleton className="h-20 w-full" />
               <Skeleton className="h-20 w-full" />
               <Skeleton className="h-24 w-full" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-on-surface">Orders</h2>
          <p className="text-on-surface-variant mt-1">Manage and track customer orders.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-surface-container rounded-lg p-1">
            <button 
              onClick={() => setActiveTab('All')}
              className={cn(
                "px-4 py-1 text-xs font-bold rounded-md transition-all",
                activeTab === 'All' ? "bg-white shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              All
            </button>
            <button 
              onClick={() => setActiveTab('Pending')}
              className={cn(
                "px-4 py-1 text-xs font-bold rounded-md transition-all",
                activeTab === 'Pending' ? "bg-white shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              Pending
            </button>
            <button 
              onClick={() => setActiveTab('Completed')}
              className={cn(
                "px-4 py-1 text-xs font-bold rounded-md transition-all",
                activeTab === 'Completed' ? "bg-white shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              Completed
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
            <Input 
              className="pl-10 h-10 w-64 bg-white text-xs" 
              placeholder="Search orders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="bg-white gap-2 h-10">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button className="gap-2 h-10" onClick={() => setIsCreateOrderOpen(true)}>
            <Plus className="w-4 h-4" />
            Create Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-high/50 text-on-surface-variant">
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest">Order ID</th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-center">Date</th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest">Status</th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      className={cn(
                        "hover:bg-surface-container-low transition-all cursor-pointer group",
                        selectedOrderId === order.id ? "bg-primary/5 ring-1 ring-primary/20" : ""
                      )}
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <td className="px-6 py-5 text-sm font-bold text-primary">{order.id}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-bold">
                            {order.customer.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-on-surface">{order.customer.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-on-surface-variant font-medium text-center">{order.date}</td>
                      <td className="px-6 py-5">
                        <Badge 
                          variant={
                            order.status === 'Delivered' ? 'success' : 
                            order.status === 'Shipped' ? 'neutral' : 
                            order.status === 'Cancelled' ? 'error' : 'info'
                          }
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-sm font-extrabold text-on-surface text-right">${order.amount.toFixed(2)}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Search className="w-8 h-8 text-on-surface-variant/30" />
                          <p className="text-sm font-bold text-on-surface">No orders found</p>
                          <p className="text-xs text-on-surface-variant">Try changing your filters or searching for another order.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-surface-container-bright flex items-center justify-between border-t border-surface-container">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Showing {filteredOrders.length} of {orders.length} orders</p>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-surface-container rounded-md"><ChevronLeft className="w-4 h-4" /></button>
                <button className="p-1 hover:bg-surface-container rounded-md"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-0 overflow-hidden sticky top-28">
          <div className="p-6 border-b border-surface-container flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-display font-extrabold">{selectedOrder.id}</h3>
                <Badge variant={selectedOrder.status === 'Pending' ? 'info' : 'success'}>{selectedOrder.status}</Badge>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">Placed on Oct 24, 2023 at 10:42 AM</p>
            </div>
          </div>

          <div className="p-6 space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">{selectedOrder.customer.name}</p>
                <div className="flex items-center gap-1.5 text-xs text-primary font-medium mt-1">
                  <Mail className="w-3.5 h-3.5" />
                  {selectedOrder.customer.email}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest mb-2">Shipping Address</p>
                <div className="text-xs font-medium text-on-surface leading-relaxed">
                  1234 Design Blvd<br />
                  Suite 100<br />
                  San Francisco, CA 94103
                </div>
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest mb-2">Billing Address</p>
                <p className="text-xs font-medium text-on-surface">Same as shipping</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest mb-4">Items</p>
              <div className="space-y-4">
                {selectedOrder.items.length > 0 ? selectedOrder.items.map(item => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-14 h-14 rounded-lg bg-surface-container-high flex-shrink-0" />
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-all">{item.name}</p>
                      <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">SKU: {item.sku} • White</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-[10px] font-bold">{item.quantity} × ${item.price.toFixed(2)}</p>
                        <p className="text-xs font-extrabold text-on-surface">${(item.quantity * item.price).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-on-surface-variant italic">No items detailed for this orders mock.</p>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-surface-container space-y-3">
              <div className="flex justify-between text-xs font-medium text-on-surface-variant">
                <span>Subtotal</span>
                <span>$234.00</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-on-surface-variant">
                <span>Shipping (Express)</span>
                <span>$11.00</span>
              </div>
              <div className="flex justify-between text-xs font-medium text-on-surface-variant">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-on-surface pt-2">
                <span>Total</span>
                <span>${selectedOrder.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-surface-container-low flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 gap-2 h-12 bg-white"
              onClick={() => setIsInvoiceOpen(true)}
            >
              <FileText className="w-4 h-4" />
              Invoice
            </Button>
            {selectedOrder.status === 'Pending' && (
              <Button 
                variant="secondary" 
                className="flex-1 gap-2 h-12"
                onClick={() => handleFulfillOrder(selectedOrder.id)}
              >
                <PackageCheck className="w-4 h-4" />
                Fulfill Order
              </Button>
            )}
            {selectedOrder.status === 'Delivered' && (
              <Button 
                variant="outline" 
                className="flex-1 gap-2 h-12 bg-white border-green-200 text-green-600 disabled:opacity-100"
                disabled
              >
                <PackageCheck className="w-4 h-4" />
                Fulfilled
              </Button>
            )}
          </div>
        </Card>
      </div>

      {isInvoiceOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-display font-extrabold text-primary">INVOICE</h3>
                  <p className="text-sm font-bold text-on-surface-variant mt-1">Order ID: {selectedOrder.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">Store Name</p>
                  <p className="text-xs text-on-surface-variant">123 Street, City, Country</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 border-y border-surface-container py-8">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Billed To</p>
                  <p className="text-sm font-bold">{selectedOrder.customer.name}</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    1234 Design Blvd<br />
                    Suite 100<br />
                    San Francisco, CA 94103
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Invoice Date</p>
                  <p className="text-sm font-bold">{selectedOrder.date}</p>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-4 mb-2">Payment Status</p>
                  <Badge variant="success">Paid</Badge>
                </div>
              </div>

              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-surface-container">
                    <th className="py-4 text-[10px] font-bold uppercase tracking-widest">Description</th>
                    <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-center">Qty</th>
                    <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-right">Price</th>
                    <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {selectedOrder.items.length > 0 ? selectedOrder.items.map(item => (
                    <tr key={item.id}>
                      <td className="py-4">
                        <p className="text-sm font-bold">{item.name}</p>
                        <p className="text-[10px] text-on-surface-variant font-medium">SKU: {item.sku}</p>
                      </td>
                      <td className="py-4 text-sm font-medium text-center">{item.quantity}</td>
                      <td className="py-4 text-sm font-medium text-right">${item.price.toFixed(2)}</td>
                      <td className="py-4 text-sm font-bold text-right">${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-xs text-on-surface-variant italic">No items detailed</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="flex justify-end pt-4">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-xs font-medium text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>${(selectedOrder.amount - 11).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-on-surface-variant">
                    <span>Shipping</span>
                    <span>$11.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-extrabold text-on-surface border-t border-surface-container pt-3">
                    <span>Total Amount</span>
                    <span>${selectedOrder.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-surface-container-low flex justify-end gap-3 mt-4">
              <Button variant="outline" className="bg-white px-8" onClick={() => setIsInvoiceOpen(false)}>Close</Button>
              <Button className="px-8 gap-2" onClick={() => window.print()}>
                <FileText className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      {isCreateOrderOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center bg-surface-container-low -m-8 mb-6 p-8">
                <h3 className="text-2xl font-display font-extrabold text-on-surface">Create New Order</h3>
                <Button variant="outline" size="sm" onClick={() => setIsCreateOrderOpen(false)} className="bg-white">Cancel</Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Customer Name</label>
                  <Input 
                    placeholder="Enter name..." 
                    value={newOrderForm.customerName}
                    onChange={(e) => setNewOrderForm(prev => ({ ...prev, customerName: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Email Address</label>
                  <Input 
                    placeholder="customer@example.com" 
                    value={newOrderForm.customerEmail}
                    onChange={(e) => setNewOrderForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Order Items</p>
                  <Button variant="tertiary" size="sm" className="h-7 text-[10px]" onClick={addItemToForm}>
                    <Plus className="w-3 h-3 mr-1" /> Add Item
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {newOrderForm.items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-3 items-end p-4 bg-surface-container-low rounded-2xl border border-surface-container">
                      <div className="col-span-5 space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-tight text-on-surface-variant">Product Name</label>
                        <Input 
                          placeholder="Item name"
                          className="bg-white h-9 text-xs"
                          value={item.name}
                          onChange={(e) => {
                            const newItems = [...newOrderForm.items];
                            newItems[index].name = e.target.value;
                            setNewOrderForm(prev => ({ ...prev, items: newItems }));
                          }}
                        />
                      </div>
                      <div className="col-span-3 space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-tight text-on-surface-variant">Price</label>
                        <Input 
                          type="number"
                          className="bg-white h-9 text-xs"
                          value={item.price}
                          onChange={(e) => {
                            const newItems = [...newOrderForm.items];
                            newItems[index].price = parseFloat(e.target.value) || 0;
                            setNewOrderForm(prev => ({ ...prev, items: newItems }));
                          }}
                        />
                      </div>
                      <div className="col-span-2 space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-tight text-on-surface-variant">Qty</label>
                        <Input 
                          type="number"
                          className="bg-white h-9 text-xs text-center"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...newOrderForm.items];
                            newItems[index].quantity = parseInt(e.target.value) || 0;
                            setNewOrderForm(prev => ({ ...prev, items: newItems }));
                          }}
                        />
                      </div>
                      <div className="col-span-2">
                        <Button 
                          variant="outline" 
                          className="w-full h-9 p-0 text-red-500 border-red-100 hover:bg-red-50 hover:border-red-200 bg-white"
                          onClick={() => {
                            if (newOrderForm.items.length > 1) {
                              setNewOrderForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-surface-container flex items-center justify-between">
                <div>
                  <p className="text-xs text-on-surface-variant font-medium">Estimated Total (Inc. $11 Ship)</p>
                  <p className="text-2xl font-extrabold text-on-surface">
                    ${newOrderForm.items.reduce((sum, item) => sum + (item.price * item.quantity), 11).toFixed(2)}
                  </p>
                </div>
                <Button className="px-10 h-12 gap-2" onClick={handleCreateOrder}>
                  <PackageCheck className="w-5 h-5" />
                  Generate Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
