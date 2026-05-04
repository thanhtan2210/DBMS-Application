import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Skeleton } from '@admin/components/ui';
import { 
  Bell, 
  ShoppingCart, 
  Warehouse, 
  Users, 
  TicketPercent, 
  CheckCheck, 
  Filter, 
  MoreVertical,
  Trash2,
  Settings
} from 'lucide-react';
import { cn } from '@lib/utils';

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'order' | 'inventory' | 'customer' | 'promotion';
  unread: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, title: 'New Order #ORD-2024-001', description: 'Customer: John Smith • Total: $1,240', time: '5 mins ago', type: 'order', unread: true },
  { id: 2, title: 'Low Stock Alert', description: 'Product "Precision Watch" is below 5 units', time: '2 hours ago', type: 'inventory', unread: true },
  { id: 3, title: 'New Customer Registered', description: 'Sarah Jenkins joined the platform', time: '5 hours ago', type: 'customer', unread: false },
  { id: 4, title: 'Promotion Ending', description: '"Flash Sale" ends in 2 hours', time: '1 day ago', type: 'promotion', unread: false },
  { id: 5, title: 'Payment Successful', description: 'Order #ORD-2024-002 payment confirmed', time: '1 day ago', type: 'order', unread: false },
  { id: 6, title: 'Warehouse Capacity Warning', description: 'Southern Distribution Center at 92% capacity', time: '2 days ago', type: 'inventory', unread: false },
];

export default function Notifications() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleDelete = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.unread);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-surface-container flex items-center gap-4">
             <Skeleton className="h-8 w-24" />
             <Skeleton className="h-8 w-24" />
          </div>
          <div className="divide-y divide-surface-container">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="p-6 flex gap-4">
                <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
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
          <h2 className="text-3xl font-display font-extrabold text-on-surface">Notifications</h2>
          <p className="text-on-surface-variant mt-1">Stay updated with your store's latest activities.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={handleMarkAllAsRead}>
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </Button>
          <Button variant="outline" size="sm" className="w-10 h-10 p-0">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-surface-container bg-surface-container-lowest/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-lg transition-colors",
                filter === 'all' ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:bg-surface-container"
              )}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('unread')}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2",
                filter === 'unread' ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:bg-surface-container"
              )}
            >
              Unread
              <Badge variant="neutral" className="bg-white/20 text-white border-none py-0 px-1.5 h-4 flex items-center justify-center">
                {notifications.filter(n => n.unread).length}
              </Badge>
            </button>
          </div>
          <Button variant="tertiary" size="sm" className="gap-2 text-xs">
            <Filter className="w-3.5 h-3.5" />
            Preferences
          </Button>
        </div>

        <div className="divide-y divide-surface-container">
          {filteredNotifications.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-on-surface-variant/30" />
              </div>
              <p className="text-on-surface-variant font-medium">No notifications to show</p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div 
                key={n.id} 
                className={cn(
                  "p-6 flex gap-5 hover:bg-surface-container/30 transition-colors relative group",
                  n.unread && "bg-primary/[0.02]"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs",
                  n.type === 'order' ? "bg-secondary text-on-secondary" :
                  n.type === 'inventory' ? "bg-amber-500 text-white" :
                  n.type === 'customer' ? "bg-green-500 text-white" :
                  "bg-primary text-on-primary"
                )}>
                  {n.type === 'order' ? <ShoppingCart className="w-6 h-6" /> :
                   n.type === 'inventory' ? <Warehouse className="w-6 h-6" /> :
                   n.type === 'customer' ? <Users className="w-6 h-6" /> :
                   <TicketPercent className="w-6 h-6" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className={cn("text-base", n.unread ? "font-bold text-on-surface" : "font-medium text-on-surface-variant")}>
                      {n.title}
                    </h4>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider bg-surface-container px-2 py-1 rounded-md">
                      {n.time}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                    {n.description}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <Button variant="tertiary" size="sm" className="h-8 text-[11px] px-3">View Details</Button>
                    <Button 
                      variant="tertiary" 
                      size="sm" 
                      className="h-8 text-[11px] px-3 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleDelete(n.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Delete
                    </Button>
                  </div>
                </div>

                {n.unread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                )}
                
                <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-surface-container rounded-lg">
                    <MoreVertical className="w-4 h-4 text-on-surface-variant" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
