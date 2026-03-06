"use client";

import { useMemo } from "react";
import Link from "next/link";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  ArrowRight
} from "lucide-react";
import { storage } from "@/lib/storage";
import StatsChart from "@/components/StatsChart";
import ProductCard from "@/components/ProductCard";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function DashboardPage() {
  // Load data from localStorage using useMemo to avoid re-computation
  const storeData = useMemo(() => {
    if (typeof window === "undefined") return null;
    return storage.getStore();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const stats = storeData?.stats ?? null;
  const chartData = storeData?.chartData ?? [];
  const products = storeData?.products.filter(p => p.status === "published").slice(0, 4) ?? [];
  const orders = storeData?.orders.slice(0, 5) ?? [];
  const userName = storeData?.user?.name?.split(" ")[0] ?? "there";

  const statCards = stats ? [
    {
      name: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: `${stats.revenueChange >= 0 ? "+" : ""}${stats.revenueChange}%`,
      changeType: stats.revenueChange >= 0 ? "positive" : "negative",
      icon: DollarSign,
    },
    {
      name: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: `${stats.ordersChange >= 0 ? "+" : ""}${stats.ordersChange}%`,
      changeType: stats.ordersChange >= 0 ? "positive" : "negative",
      icon: ShoppingCart,
    },
    {
      name: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      change: `${stats.customersChange >= 0 ? "+" : ""}${stats.customersChange}%`,
      changeType: stats.customersChange >= 0 ? "positive" : "negative",
      icon: Users,
    },
    {
      name: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      change: `${stats.conversionChange >= 0 ? "+" : ""}${stats.conversionChange}%`,
      changeType: stats.conversionChange >= 0 ? "positive" : "negative",
      icon: TrendingUp,
    },
  ] : [];

  // Top products for sidebar
  const topProducts = products.slice(0, 4).map(p => ({
    name: p.title,
    sales: p.sales,
    revenue: `$${(p.sales * p.price).toFixed(0)}`,
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 rounded-xl p-8 text-white shadow-xl shadow-blue-900/20 isolate min-h-[160px]">
        {/* Animated particle background */}
        <AnimatedBackground />
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2 tracking-tight">{getGreeting()}, {userName}! 👋</h2>
          <p className="text-blue-100/90 text-lg font-medium max-w-2xl">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stat.changeType === "positive" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-500 mt-1">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Chart and Top Products - Side by Side on Large Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
            <p className="text-sm text-gray-500">Orders and users over the past year</p>
          </div>
          {chartData.length > 0 && <StatsChart data={chartData} />}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
              <Link 
                href="/dashboard/products"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6 pt-0 space-y-4">
            {topProducts.map((product) => (
              <div
                key={product.name}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">{product.sales} sales</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {product.revenue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Published Products Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Published Products</h3>
              <p className="text-sm text-gray-500 mt-1">Your live products available for purchase</p>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {/* See More Button */}
          <div className="mt-6 text-center">
            <Link
              href="/dashboard/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              See More Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Link 
              href="/dashboard/orders"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium hidden md:table-cell">Product</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${order.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
        styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
