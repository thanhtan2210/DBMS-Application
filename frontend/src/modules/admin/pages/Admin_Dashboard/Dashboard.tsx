import { Card, Button, Badge, Skeleton } from '@admin/components/ui';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  ChevronDown,
  Download,
  Calendar
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
import { MOCK_ORDERS } from '@admin/types';
import { cn } from '@lib/utils';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';

const RANGE_OPTIONS = [
  { label: 'Today', days: 0 },
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 },
  { label: 'All Time', days: -1 },
];

const revenueData = [
  { name: 'Mon', value: 12000 },
  { name: 'Tue', value: 18000 },
  { name: 'Wed', value: 15000 },
  { name: 'Thu', value: 14000 },
  { name: 'Fri', value: 28000 },
  { name: 'Sat', value: 22000 },
  { name: 'Sun', value: 19000 },
];

const initialStats = [
  { label: 'Total Revenue', value: '$124,560.00', trend: '+12.5%', isPositive: true, icon: DollarSign, baseValue: 124560 },
  { label: 'Total Orders', value: '1,842', trend: '+8.2%', isPositive: true, icon: ShoppingCart, baseValue: 1842 },
  { label: 'Active Users', value: '8,924', trend: '-2.1%', isPositive: false, icon: Users, baseValue: 8924 },
];

const inventoryForecastingData = [
  { month: 'Jan', actual: 450, forecast: 450 },
  { month: 'Feb', actual: 520, forecast: 530 },
  { month: 'Mar', actual: 480, forecast: 500 },
  { month: 'Apr', actual: 610, forecast: 590 },
  { month: 'May', actual: null, forecast: 650 },
  { month: 'Jun', actual: null, forecast: 710 },
  { month: 'Jul', actual: null, forecast: 680 },
];

const warehouseMetrics = [
  { name: 'North Warehouse', stock: 85, health: 'Optimal' },
  { name: 'Central Hub', stock: 42, health: 'Warning' },
  { name: 'Coastal Post', stock: 12, health: 'Critical' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(RANGE_OPTIONS[2]);
  const [currentStats, setCurrentStats] = useState(initialStats);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const [salesMetric, setSalesMetric] = useState<'Revenue' | 'Orders' | 'Profit'>('Revenue');

  const salesData = [
    { name: 'Mon', Revenue: 12000, Orders: 45, Profit: 3200 },
    { name: 'Tue', Revenue: 15000, Orders: 52, Profit: 4100 },
    { name: 'Wed', Revenue: 13500, Orders: 48, Profit: 3800 },
    { name: 'Thu', Revenue: 18000, Orders: 65, Profit: 5200 },
    { name: 'Fri', Revenue: 22000, Orders: 82, Profit: 6800 },
    { name: 'Sat', Revenue: 25000, Orders: 95, Profit: 8100 },
    { name: 'Sun', Revenue: 19000, Orders: 70, Profit: 5900 },
  ];

  const getMetricColor = () => {
    switch(salesMetric) {
      case 'Orders': return '#8b5cf6'; // Violet
      case 'Profit': return '#10b981'; // Emerald
      default: return '#000000'; // Primary/Black
    }
  };

  const handleRangeChange = (range: typeof RANGE_OPTIONS[0]) => {
    setSelectedRange(range);
    setIsRangeOpen(false);
    
    // Simulate data update based on range
    const factor = range.days === -1 ? 5 : (range.days / 30) || 0.1;
    setCurrentStats(initialStats.map(stat => ({
      ...stat,
      value: stat.label === 'Total Revenue' 
        ? `$${(stat.baseValue * factor).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
        : Math.floor(stat.baseValue * factor).toLocaleString()
    })));
  };

  const handleExport = () => {
    setExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Metric,Value\n"
        + currentStats.map(s => `${s.label},${s.value.replace(/,/g, '')}`).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `dashboard_report_${selectedRange.label.toLowerCase().replace(/ /g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExporting(false);
    }, 2000);
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-8">
            <div className="flex items-center justify-between mb-8">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-[350px] w-full rounded-xl" />
          </Card>
          <Card className="p-8">
            <div className="flex items-center justify-between mb-8">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-[200px] w-full mb-8 rounded-xl" />
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <div className="p-6 border-b border-surface-container">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
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
          <h2 className="text-3xl font-display font-extrabold text-on-surface">Overview</h2>
          <p className="text-on-surface-variant mt-1">Today's snapshot of your atelier's performance.</p>
        </div>
        <div className="flex gap-3 relative">
          <div className="relative">
            <Button 
              variant="outline" 
              className="bg-white gap-2 font-bold"
              onClick={() => setIsRangeOpen(!isRangeOpen)}
            >
              <Calendar className="w-4 h-4" />
              {selectedRange.label}
              <ChevronDown className={cn("w-4 h-4 transition-transform", isRangeOpen && "rotate-180")} />
            </Button>
            
            <AnimatePresence>
              {isRangeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-surface shadow-2xl rounded-2xl border border-surface-container overflow-hidden z-50 p-1"
                >
                  {RANGE_OPTIONS.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => handleRangeChange(option)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-xs font-bold transition-colors rounded-xl",
                        selectedRange.label === option.label 
                          ? "bg-primary text-white" 
                          : "hover:bg-surface-container text-on-surface"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <Button 
            className="gap-2" 
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
        {currentStats.map((stat) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-8 overflow-hidden relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-lg font-bold">Sales Performance</h3>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">Performance trends across your atelier.</p>
            </div>
            <div className="flex bg-surface-container rounded-xl p-1">
              {(['Revenue', 'Orders', 'Profit'] as const).map((m) => (
                <button 
                  key={m}
                  onClick={() => setSalesMetric(m)}
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-lg transition-all",
                    salesMetric === m ? "bg-white shadow-sm text-on-surface" : "text-on-surface-variant hover:text-on-surface"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={getMetricColor()} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={getMetricColor()} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ fontSize: '10px', color: '#64748b', marginBottom: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
                <Area 
                  type="monotone" 
                  dataKey={salesMetric} 
                  stroke={getMetricColor()} 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorMetric)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">Inventory Forecasting</h3>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">AI-driven predictive demand analysis.</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="info" className="px-3 py-1 font-bold">Q3 Forecast</Badge>
            </div>
          </div>
          <div className="h-[200px] mb-8 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inventoryForecastingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="forecastColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ fontSize: '10px', color: '#64748b', marginBottom: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#8b5cf6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#forecastColor)" 
                  name="Actual Units"
                />
                <Area 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#cbd5e1" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  fill="transparent" 
                  name="Forecasted"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest">Regional Stock Integrity</p>
              <Button variant="tertiary" size="sm" className="h-6 text-[10px] p-0" onClick={() => navigate('/inventory')}>View Details</Button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {warehouseMetrics.map((wh) => (
                <div key={wh.name} className="flex items-center justify-between p-3 bg-surface-container-low rounded-2xl border border-surface-container hover:bg-surface-container-high/50 transition-colors cursor-pointer group">
                   <div className="flex items-center gap-3">
                     <div className={cn(
                       "w-2 h-2 rounded-full",
                       wh.health === 'Optimal' ? 'bg-green-500' : wh.health === 'Warning' ? 'bg-amber-500 animate-pulse' : 'bg-red-500 animate-bounce'
                     )} />
                     <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">{wh.name}</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                       <div 
                        className={cn(
                          "h-full rounded-full",
                          wh.health === 'Optimal' ? 'bg-green-500' : wh.health === 'Warning' ? 'bg-amber-500' : 'bg-red-500'
                        )}
                        style={{ width: `${wh.stock}%` }}
                       />
                     </div>
                     <span className="text-[10px] font-extrabold text-on-surface-variant w-12 text-right">{wh.stock}%</span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b border-surface-container flex items-center justify-between">
          <h3 className="text-lg font-bold">Recent Orders</h3>
          <Button variant="tertiary" size="sm" onClick={() => navigate('/orders')}>View All</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-high/50 text-on-surface-variant">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {MOCK_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                  <td className="px-6 py-4 text-sm font-bold text-primary group-hover:underline">{order.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-on-surface">{order.customer.name}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{order.date}</td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant={
                        order.status === 'Delivered' ? 'success' : 
                        order.status === 'Pending' ? 'info' : 
                        order.status === 'Cancelled' ? 'error' : 'neutral'
                      }
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm font-extrabold text-on-surface text-right">${order.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
