"use client";

import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Eye
} from "lucide-react";

// Stat card data
const stats = [
  {
    name: "Total Revenue",
    value: "$12,450",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    name: "Total Orders",
    value: "156",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: ShoppingCart,
  },
  {
    name: "Total Customers",
    value: "2,340",
    change: "+23.1%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    name: "Conversion Rate",
    value: "3.2%",
    change: "-0.4%",
    changeType: "negative" as const,
    icon: TrendingUp,
  },
];

// Recent orders data
const recentOrders = [
  { id: "#3210", customer: "John Smith", product: "Digital Marketing Course", amount: "$49.00", status: "completed" },
  { id: "#3209", customer: "Emily Chen", product: "E-book Bundle", amount: "$29.00", status: "completed" },
  { id: "#3208", customer: "Michael Brown", product: "1-on-1 Coaching", amount: "$199.00", status: "pending" },
  { id: "#3207", customer: "Sarah Wilson", product: "Template Pack", amount: "$19.00", status: "completed" },
  { id: "#3206", customer: "David Lee", product: "Premium Membership", amount: "$99.00", status: "processing" },
];

// Top products data
const topProducts = [
  { name: "Digital Marketing Course", sales: 45, revenue: "$2,205" },
  { name: "E-book Bundle", sales: 38, revenue: "$1,102" },
  { name: "Template Pack", sales: 32, revenue: "$608" },
  { name: "Premium Membership", sales: 28, revenue: "$2,772" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, John! 👋</h2>
        <p className="text-blue-100">
          Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all
              </button>
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
                {recentOrders.map((order) => (
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
                      {order.amount}
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

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {topProducts.map((product, index) => (
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickAction
          icon={Package}
          title="Add Product"
          description="Create a new product"
          href="/dashboard/products/new"
        />
        <QuickAction
          icon={Eye}
          title="View Storefront"
          description="See your live store"
          href="/dashboard/storefront"
        />
        <QuickAction
          icon={Users}
          title="Customers"
          description="Manage your customers"
          href="/dashboard/customers"
        />
        <QuickAction
          icon={TrendingUp}
          title="Analytics"
          description="View detailed reports"
          href="/dashboard/analytics"
        />
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

function QuickAction({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group"
    >
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </a>
  );
}
