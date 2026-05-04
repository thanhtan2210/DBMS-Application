import { Card, Button, Input, Badge, Skeleton } from '@admin/components/ui';
import { 
  Building2, 
  CreditCard, 
  Truck, 
  Users, 
  ShieldCheck,
  Mail,
  Globe,
  Clock,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { cn } from '@lib/utils';
import React, { useState, useEffect } from 'react';

export default function Settings() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div className="space-y-2">
             {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
           </div>
           <div className="lg:col-span-3 space-y-6">
             <Card className="p-8"><Skeleton className="h-[300px] w-full" /></Card>
             <Card className="p-8"><Skeleton className="h-[200px] w-full" /></Card>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div>
        <h2 className="text-3xl font-display font-extrabold text-on-surface">Unified Admin Settings</h2>
        <p className="text-on-surface-variant mt-1">Manage your store's configuration and team permissions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-1">
          {[
            { label: 'General Info', icon: Building2, active: true },
            { label: 'Payment Gateways', icon: CreditCard },
            { label: 'Shipping Rules', icon: Truck },
            { label: 'Team & Permissions', icon: Users },
          ].map((item) => (
            <button 
              key={item.label}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm",
                item.active 
                  ? "bg-white shadow-ambient text-primary" 
                  : "text-on-surface-variant hover:bg-surface-container-low"
              )}
            >
              <item.icon className={cn("w-4 h-4", item.active ? "text-primary" : "text-on-surface-variant")} />
              <span>{item.label}</span>
              {item.active && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </aside>

        <div className="lg:col-span-3 space-y-8">
          <Card className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold">Store Profile</h3>
                <p className="text-xs text-on-surface-variant mt-1">Basic information about your business.</p>
              </div>
              <Button>Save Changes</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest px-1">Store Name</label>
                <Input defaultValue="Stellar Commerce" className="h-12 bg-surface-container-low font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest px-1">Support Email</label>
                <Input defaultValue="support@stellarcommerce.com" className="h-12 bg-surface-container-low font-bold" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest px-1">Store Description</label>
                <textarea 
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-primary/40 h-32 transition-all resize-none"
                  defaultValue="Premium architectural supplies and tools."
                />
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-lg font-bold mb-1">Regional Formats</h3>
            <p className="text-xs text-on-surface-variant mb-8">Configure timezone and currency.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest px-1">Timezone</label>
                <div className="relative group">
                  <select className="appearance-none w-full bg-surface-container-low h-12 rounded-xl px-4 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition-all">
                    <option>(GMT-08:00) Pacific Time</option>
                  </select>
                  <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest px-1">Base Currency</label>
                <div className="relative group">
                  <select className="appearance-none w-full bg-surface-container-low h-12 rounded-xl px-4 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition-all">
                    <option>USD ($)</option>
                  </select>
                  <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-lg font-bold mb-1">Team & Permissions</h3>
            <div className="flex items-center justify-between mb-8">
              <p className="text-xs text-on-surface-variant">Manage access and roles for your team.</p>
              <Button size="sm" className="gap-2 h-9">
                <Users className="w-3.5 h-3.5" />
                Invite Member
              </Button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Jane Doe', email: 'jane@stellarcommerce.com', role: 'Administrator', status: 'Active' },
                { name: 'John Smith', email: 'john@stellarcommerce.com', role: 'Support Staff', status: 'Pending' },
              ].map((member) => (
                <div key={member.email} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl group hover:bg-surface-container transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{member.name}</p>
                      <p className="text-xs text-on-surface-variant">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-on-surface">{member.role}</p>
                    </div>
                    <Badge variant={member.status === 'Active' ? 'success' : 'neutral'}>{member.status}</Badge>
                    <button className="p-2 hover:bg-white rounded-lg transition-all"><MoreVertical className="w-4 h-4 text-on-surface-variant" /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
