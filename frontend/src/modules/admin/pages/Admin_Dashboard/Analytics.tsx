import { Card, Button, Badge, Skeleton, Input } from '@admin/components/ui';
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
import { Download, Calendar, Filter, ArrowUpRight, ArrowDownRight, MousePointerClick, Zap, Search, ShoppingBag, RefreshCcw } from 'lucide-react';
import { cn } from '@lib/utils';
import React, { useState, useEffect } from 'react';
import { getSalesOverview, getRevenueByCategory, getDailySales, getConversionFunnel } from '@/modules/admin/services/analytics-service';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [stats, setStats] = useState({
    totalRevenue: 0,
    avgOrderValue: 0,
    totalOrders: 0,
    totalCustomers: 0
  });
  const [salesTrends, setSalesTrends] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [funnelEvents, setFunnelEvents] = useState<any[]>([]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const fromStr = `${dateRange.from}T00:00:00`;
      const toStr = `${dateRange.to}T23:59:59`;

      const fromDateOnly = dateRange.from;
      const toDateOnly = dateRange.to;

      const [overview, daily, categories, funnel]: any = await Promise.all([
        getSalesOverview(fromStr, toStr),
        getDailySales(fromDateOnly, toDateOnly),
        getRevenueByCategory(),
        getConversionFunnel(fromStr, toStr)
      ]);

      // Process Overview
      const salesData = overview?.data || overview || {};
      const totalRev = Number(salesData.grossRevenue || 0);
      const totalOrd = Number(salesData.totalOrders || 0);
      setStats({
        totalRevenue: totalRev,
        totalOrders: totalOrd,
        avgOrderValue: totalOrd > 0 ? totalRev / totalOrd : 0,
        totalCustomers: Number(salesData.totalCustomers || 0)
      });

      // Process Daily Sales
      if (Array.isArray(daily)) {
        setSalesTrends(daily.map(item => ({
          name: new Date(item.id.summaryDate).getDate().toString(),
          value: item.grossRevenue
        })));
      }

      // Process Categories
      if (Array.isArray(categories)) {
        const colors = ['#134f77', '#336791', '#ae3200', '#10b981', '#f59e0b'];
        setCategoryData(categories.map((item, idx) => ({
          name: item[0] || 'Uncategorized',
          value: Number(item[1] || 0),
          color: colors[idx % colors.length]
        })));
      }

      // Process Funnel
      if (Array.isArray(funnel)) {
        setFunnelEvents(funnel.map(item => ({
          label: item[0],
          count: item[1] || 0
        })));
      }

    } catch (err) {
      console.error("Failed to fetch advanced analytics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-10 w-32 mb-2" />
            </Card>
          ))}
        </div>
        <Card className="p-8">
          <Skeleton className="h-[400px] w-full" />
        </Card>
      </div>
    );
  }

  const mainStats = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, trend: '+14.5%', positive: true },
    { label: 'Avg Order Value', value: `$${stats.avgOrderValue.toFixed(2)}`, trend: '+2.1%', positive: true },
    { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), trend: '+5.4%', positive: true },
    { label: 'Active Customers', value: stats.totalCustomers.toLocaleString(), trend: '+8.2%', positive: true },
  ];

  const getEventIcon = (label: string) => {
    if (label.includes('VIEW')) return Search;
    if (label.includes('CART')) return Zap;
    if (label.includes('CHECKOUT')) return MousePointerClick;
    return ShoppingBag;
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-on-surface">Advanced Analytics</h2>
          <p className="text-on-surface-variant mt-1">Comprehensive performance breakdown using live Database records.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-outline-variant shadow-sm">
            <Input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="w-40 bg-transparent border-none focus:ring-0 h-8 text-xs font-bold"
            />
            <span className="text-on-surface-variant font-black text-xs">TO</span>
            <Input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="w-40 bg-transparent border-none focus:ring-0 h-8 text-xs font-bold"
            />
          </div>

          <Button variant="secondary" className="h-11 px-6 shadow-md" onClick={fetchAnalytics}>
            <RefreshCcw className="w-4 h-4" />
            Sync Data
          </Button>

          <Button className="gap-2 h-11 px-6 shadow-md">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, i) => (
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
            <h3 className="text-lg font-bold">Sales Trends (Last 30 Days)</h3>
            <Badge variant="info">Daily Revenue</Badge>
          </div>
          <div className="h-[300px]">
            {salesTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666', fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666', fontWeight: 700 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#134f77" strokeWidth={3} dot={{ r: 4, fill: '#134f77', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center italic text-on-surface-variant opacity-50">No trend data available for this period.</div>
            )}
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Revenue by Category</h3>
          </div>
          <div className="h-[250px] relative">
            {categoryData.length > 0 ? (
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
            ) : (
              <div className="h-full flex items-center justify-center italic text-on-surface-variant opacity-50 text-xs">No category data.</div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-display font-black text-on-surface">{categoryData.length > 0 ? '100%' : '0%'}</span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Share</span>
            </div>
          </div>
          <div className="mt-8 space-y-3 overflow-y-auto max-h-[150px] pr-2">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-on-surface">{item.name}</span>
                </div>
                <span className="text-xs font-black text-on-surface">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold">User Interaction BI</h3>
            <p className="text-xs text-on-surface-variant font-medium mt-1">Real-time event stream analysis from PostgreSQL.</p>
          </div>
          <Badge variant="info">FR 07 Analytics Domain</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {funnelEvents.length > 0 ? (
            funnelEvents.map((event, idx) => {
              const Icon = getEventIcon(event.label);
              const colors = [
                { bg: 'bg-primary/10', text: 'text-primary' },
                { bg: 'bg-green-100', text: 'text-green-700' },
                { bg: 'bg-amber-100', text: 'text-amber-700' },
                { bg: 'bg-indigo-100', text: 'text-indigo-700' },
              ];
              const color = colors[idx % colors.length];

              return (
                <div key={event.label} className={cn("p-5 rounded-2xl flex items-center justify-between", color.bg)}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Icon className={cn("w-5 h-5", color.text)} />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest leading-tight">{event.label.replace('_', ' ')}</p>
                      <p className={cn("text-xl font-black mt-0.5", color.text)}>{event.count.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-4 py-10 text-center italic text-on-surface-variant opacity-50">No events logged in the last 30 days.</div>
          )}
        </div>
      </Card>
    </div>
  );
}
