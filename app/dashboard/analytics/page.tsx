"use client";

import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  RefreshCw,
  Package,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Clock,
  Target,
} from "lucide-react";
import { storage, type DashboardStats, type ChartDataPoint, type Order, type Product } from "@/lib/storage";

type DateRange = "7d" | "30d" | "90d" | "12m" | "all";

interface TopProduct {
  id: string;
  title: string;
  sales: number;
  revenue: number;
  image: string;
}

interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  color: string;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>("30d");

  useEffect(() => {
    const loadData = () => {
      setStats(storage.getStats());
      setChartData(storage.getChartData());
      setOrders(storage.getOrders());
      setProducts(storage.getProducts());
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Calculate derived analytics
  const analytics = useMemo(() => {
    if (!stats || !orders.length || !products.length) {
      return null;
    }

    // Top products by sales
    const topProducts: TopProduct[] = [...products]
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        title: p.title,
        sales: p.sales,
        revenue: p.sales * p.price,
        image: p.image,
      }));

    // Simulated traffic sources
    const trafficSources: TrafficSource[] = [
      { source: "Direct", visitors: 1245, percentage: 35, color: "bg-blue-500" },
      { source: "Organic Search", visitors: 890, percentage: 25, color: "bg-green-500" },
      { source: "Social Media", visitors: 712, percentage: 20, color: "bg-purple-500" },
      { source: "Referral", visitors: 534, percentage: 15, color: "bg-orange-500" },
      { source: "Email", visitors: 178, percentage: 5, color: "bg-pink-500" },
    ];

    // Order status breakdown
    const orderStatusBreakdown = {
      completed: orders.filter((o) => o.status === "completed").length,
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };

    // Revenue by product type
    const revenueByType = products.reduce((acc, product) => {
      const revenue = product.sales * product.price;
      acc[product.type] = (acc[product.type] || 0) + revenue;
      return acc;
    }, {} as Record<string, number>);

    return {
      topProducts,
      trafficSources,
      orderStatusBreakdown,
      revenueByType,
      averageOrderValue: stats.totalRevenue / stats.totalOrders,
      pageViews: 45230,
      bounceRate: 42.5,
      avgSessionDuration: "3m 24s",
    };
  }, [stats, orders, products]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Get max value for chart scaling
  const maxChartValue = Math.max(...chartData.map((d) => Math.max(d.orders, d.users)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Track your store performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
            <option value="all">All time</option>
          </select>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${
              (stats?.revenueChange || 0) >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              {(stats?.revenueChange || 0) >= 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {Math.abs(stats?.revenueChange || 0).toFixed(1)}%
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats?.totalRevenue || 0)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${
              (stats?.ordersChange || 0) >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              {(stats?.ordersChange || 0) >= 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {Math.abs(stats?.ordersChange || 0).toFixed(1)}%
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Total Orders</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${
              (stats?.customersChange || 0) >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              {(stats?.customersChange || 0) >= 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {Math.abs(stats?.customersChange || 0).toFixed(1)}%
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatNumber(stats?.totalCustomers || 0)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total Customers</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${
              (stats?.conversionChange || 0) >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              {(stats?.conversionChange || 0) >= 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {Math.abs(stats?.conversionChange || 0).toFixed(1)}%
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats?.conversionRate || 0}%</p>
          <p className="text-sm text-gray-500 mt-1">Conversion Rate</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales & Visitors Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Sales & Visitors</h2>
              <p className="text-sm text-gray-500">Monthly performance overview</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Orders</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">Visitors</span>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="h-64 flex items-end gap-2">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end gap-1 h-52">
                  <div
                    className="flex-1 bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600"
                    style={{ height: `${(data.orders / maxChartValue) * 100}%` }}
                    title={`Orders: ${data.orders}`}
                  ></div>
                  <div
                    className="flex-1 bg-purple-500 rounded-t-sm transition-all hover:bg-purple-600"
                    style={{ height: `${(data.users / maxChartValue) * 100}%` }}
                    title={`Visitors: ${data.users}`}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{data.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Traffic Sources</h2>
              <p className="text-sm text-gray-500">Where visitors come from</p>
            </div>
            <Globe className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {analytics?.trafficSources.map((source, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">{source.source}</span>
                  <span className="text-sm text-gray-500">
                    {formatNumber(source.visitors)} ({source.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${source.color} rounded-full transition-all`}
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Total Visitors</span>
              <span className="font-semibold text-gray-900">
                {formatNumber(analytics?.trafficSources.reduce((sum, s) => sum + s.visitors, 0) || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
              <p className="text-sm text-gray-500">Best performers by sales</p>
            </div>
            <Package className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {analytics?.topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
              >
                <span className="text-sm font-bold text-gray-400 w-6">#{index + 1}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.title}</p>
                  <p className="text-sm text-gray-500">{product.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(product.revenue)}
                  </p>
                  <p className="text-xs text-gray-500">revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          {/* Average Order Value */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Order Value</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(analytics?.averageOrderValue || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Page Views */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Page Views</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatNumber(analytics?.pageViews || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Bounce Rate */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bounce Rate</p>
                <p className="text-xl font-bold text-gray-900">
                  {analytics?.bounceRate || 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Avg Session Duration */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Session</p>
                <p className="text-xl font-bold text-gray-900">
                  {analytics?.avgSessionDuration || "0m 0s"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status & Revenue by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
              <p className="text-sm text-gray-500">Breakdown by status</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.orderStatusBreakdown.completed || 0}
              </p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.orderStatusBreakdown.pending || 0}
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Processing</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.orderStatusBreakdown.processing || 0}
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Cancelled</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.orderStatusBreakdown.cancelled || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Revenue by Product Type */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Revenue by Type</h2>
              <p className="text-sm text-gray-500">Product category breakdown</p>
            </div>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-3">
            {analytics?.revenueByType &&
              Object.entries(analytics.revenueByType)
                .sort(([, a], [, b]) => b - a)
                .map(([type, revenue], index) => {
                  const colors = [
                    "bg-blue-500",
                    "bg-purple-500",
                    "bg-green-500",
                    "bg-orange-500",
                    "bg-pink-500",
                    "bg-teal-500",
                  ];
                  const totalRevenue = Object.values(analytics.revenueByType).reduce(
                    (sum, r) => sum + r,
                    0
                  );
                  const percentage = ((revenue / totalRevenue) * 100).toFixed(1);

                  return (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 ${colors[index % colors.length]} rounded-full`}
                          ></div>
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {type}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatCurrency(revenue)} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${colors[index % colors.length]} rounded-full`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      {/* Real-time Activity */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Live Activity</h2>
              <p className="text-sm text-gray-500">Real-time store activity</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-sm text-gray-500">Active visitors</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
            <Eye className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-sm text-gray-500">Page views (1h)</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
            <ShoppingCart className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-500">In checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
