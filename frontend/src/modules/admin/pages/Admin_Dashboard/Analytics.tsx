import { Card, Button, Badge, Skeleton } from '@admin/components/ui';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Download, Calendar, Filter, ArrowUpRight, ArrowDownRight, MousePointerClick, Zap, Search } from 'lucide-react';
import { cn } from '@lib/utils';
import React, { useState, useEffect } from 'react';

const salesTrendsData = [
  { name: '3', value: 600 },
  { name: '6', value: 800 },
  { name: '9', value: 1200 },
  { name: '12', value: 1100 },
  { name: '15', value: 1600 },
  { name: '18', value: 1500 },
  { name: '21', value: 1900 },
  { name: '24', value: 2400 },
  { name: '27', value: 2200 },
  { name: '30', value: 3200 },
];

const categoryData = [
  { name: 'Seating', value: 40, color: '#134f77' },
  { name: 'Lighting', value: 35, color: '#336791' },
  { name: 'Accessories', value: 25, color: '#ae3200' },
];

const customerMetrics = [
  { name: '1', new: 400, returning: 240 },
  { name: '4', new: 300, returning: 139 },
  { name: '7', new: 200, returning: 980 },
  { name: '12', new: 278, returning: 390 },
  { name: '17', new: 189, returning: 480 },
  { name: '10', new: 239, returning: 380 },
  { name: '24', new: 349, returning: 430 },
  { name: '27', new: 349, returning: 430 },
  { name: '30', new: 349, returning: 430 },
];

export default function Analytics() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-10 w-32 mb-2" />
              <Skeleton className="h-4 w-16" />
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-8">
            <Skeleton className="h-6 w-40 mb-8" />
            <Skeleton className="h-[300px] w-full" />
          </Card>
          <Card className="p-8">
            <Skeleton className="h-6 w-40 mb-8" />
            <Skeleton className="h-[300px] w-full" />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-on-surface">Advanced Analytics</h2>
          <p className="text-on-surface-variant mt-1">Comprehensive performance breakdown across all metrics.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex h-10 bg-surface-container rounded-lg p-1">
            <button className="px-3 py-1 text-[10px] font-extrabold rounded-md hover:bg-white/50 transition-all uppercase tracking-widest">7D</button>
            <button className="px-3 py-1 text-[10px] font-extrabold rounded-md bg-white shadow-sm uppercase tracking-widest">30D</button>
            <button className="px-3 py-1 text-[10px] font-extrabold rounded-md hover:bg-white/50 transition-all uppercase tracking-widest">YTD</button>
          </div>
          <Button variant="outline" className="bg-white gap-2 h-10">
            <Calendar className="w-4 h-4" />
            Custom Range
          </Button>
          <Button className="gap-2 h-10">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '$124,560.00', trend: '+14.5%', positive: true },
          { label: 'Avg Order Value', value: '$85.20', trend: '+2.1%', positive: true },
          { label: 'Conversion Rate', value: '3.8%', trend: '-0.4%', positive: false },
          { label: 'Active Customers', value: '1,462', trend: '+8.2%', positive: true },
        ].map((stat, i) => (
          <Card key={i} className="p-6">
            <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-display font-black mt-2 text-on-surface">{stat.value}</p>
            <div className="flex items-center gap-1 mt-3">
              {stat.positive ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
              <span className={cn('text-xs font-bold', stat.positive ? 'text-green-500' : 'text-red-500')}>{stat.trend}</span>
              <span className="text-[10px] text-on-surface-variant font-bold ml-1 uppercase">vs last period</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Sales Trends</h3>
            <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold tracking-widest">Last 30 days</Button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrendsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666', fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666', fontWeight: 700 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#134f77" strokeWidth={3} dot={{ r: 4, fill: '#134f77', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Top-Selling Categories</h3>
            <Badge>Retail</Badge>
          </div>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-display font-black text-on-surface">100%</span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Distribution</span>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-on-surface">{item.name}</span>
                </div>
                <span className="text-xs font-black text-on-surface">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold">Customer Acquisition Metrics</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-primary" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest">New</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#10b981]" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest">Returning</span>
            </div>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={customerMetrics}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666', fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666', fontWeight: 700 }} />
              <Tooltip />
              <Bar dataKey="new" fill="#134f77" radius={[4, 4, 0, 0]} />
              <Bar dataKey="returning" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold">User Intelligence (BI)</h3>
            <p className="text-xs text-on-surface-variant font-medium mt-1">Real-time interaction event stream based on FR 7 requirements.</p>
          </div>
          <Badge variant="info">PostgreSQL Analytics Domain</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'View Product', count: '12,402', color: 'bg-primary/10', icon: Search, textColor: 'text-primary' },
            { label: 'Add to Cart', count: '1,842', color: 'bg-green-100', icon: Zap, textColor: 'text-green-700' },
            { label: 'Start Checkout', count: '942', color: 'bg-amber-100', icon: MousePointerClick, textColor: 'text-amber-700' },
            { label: 'Completed', count: '812', color: 'bg-indigo-100', icon: ArrowUpRight, textColor: 'text-indigo-700' },
          ].map((event) => (
            <div key={event.label} className={cn("p-5 rounded-2xl flex items-center justify-between", event.color)}>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <event.icon className={cn("w-5 h-5", event.textColor)} />
                 </div>
                 <div>
                   <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest leading-tight">{event.label}</p>
                   <p className={cn("text-xl font-black mt-0.5", event.textColor)}>{event.count}</p>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
