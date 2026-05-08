import { Card, Button, Badge, Skeleton, Input } from '@admin/components/ui';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  ArrowRightLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  ChevronDown,
  Download,
  Calendar,
  Box,
  Filter
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@lib/utils';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { getSalesOverview, getTopProducts, getConversionFunnel } from '@/modules/admin/services/analytics-service';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const [stats, setStats] = useState({
    totalOrders: 0,
    grossRevenue: 0,
    totalDiscount: 0,
    totalCustomers: 0,
    totalItemsSold: 0
  });

  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [funnelData, setFunnelData] = useState<any[]>([]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const fromStr = `${dateRange.from}T00:00:00`;
      const toStr = `${dateRange.to}T23:59:59`;

      const [salesRes, topRes, funnelRes]: any = await Promise.all([
        getSalesOverview(fromStr, toStr),
        getTopProducts(fromStr, toStr, 7),
        getConversionFunnel(fromStr, toStr)
      ]);

      console.log("saleRes", salesRes)

      setStats({
        totalOrders: salesRes.totalOrders || 0,
        grossRevenue: salesRes.grossRevenue || 0,
        totalDiscount: salesRes.totalDiscount || 0,
        totalCustomers: salesRes.totalCustomers || 0,
        totalItemsSold: salesRes.totalItemsSold || 0
      });

      // topRes is array of [name, quantity, total]
      if (Array.isArray(topRes)) {
        setTopProducts(topRes.map((item, idx) => ({
          id: idx,
          name: item[0] || 'Unknown',
          quantity: item[1] || 0
        })));
      } else if (topRes.content) {
        setTopProducts(topRes.content);
      }

      // funnelRes is array of [type, count]
      if (Array.isArray(funnelRes)) {
        setFunnelData(funnelRes.map(item => ({
          eventType: item[0],
          count: item[1] || 0
        })));
      }

    } catch (err) {
      console.error("Failed to fetch analytics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
    }, 1000);
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
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 w-full">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="w-12 h-12 rounded-xl" />
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-8">
            <Skeleton className="h-[350px] w-full rounded-xl" />
          </Card>
          <Card className="p-8">
            <Skeleton className="h-[350px] w-full rounded-xl" />
          </Card>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: `$${Number(stats.grossRevenue).toLocaleString()}`, isPositive: true, trend: '+12%', icon: DollarSign },
    { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), isPositive: true, trend: '+5%', icon: ShoppingCart },
    { label: 'Items Sold', value: stats.totalItemsSold.toLocaleString(), isPositive: true, trend: '+18%', icon: Package },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-on-surface">Overview Dashboard</h2>
          <p className="text-on-surface-variant mt-1">Real-time snapshot of your atelier's performance.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl border border-outline-variant shadow-sm">
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

          <Button
            variant="secondary"
            onClick={fetchAnalytics}
            className="h-11 px-6 shadow-md"
          >
            <Filter className="w-4 h-4" />
            Apply Filter
          </Button>

          <Button
            className="gap-2 h-11 px-6 shadow-md"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export Report
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-display font-extrabold mt-2 text-on-surface">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.isPositive ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={cn('text-sm font-bold', stat.isPositive ? 'text-green-500' : 'text-red-500')}>
                    {stat.trend}
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium ml-1">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-8 overflow-hidden relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-lg font-bold">Top Selling Products</h3>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">Best performers by volume</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            {topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} width={100} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="quantity" fill="#134f77" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm font-bold text-on-surface-variant italic">No product data available yet.</div>
            )}
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">Conversion Funnel</h3>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">User interactions tracking</p>
            </div>
            <Badge variant="info" className="px-3 py-1 font-bold">Events</Badge>
          </div>
          <div className="h-[300px] relative">
            {funnelData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFunnel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="eventType" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px 16px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorFunnel)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm font-bold text-on-surface-variant italic">No event data available yet.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
