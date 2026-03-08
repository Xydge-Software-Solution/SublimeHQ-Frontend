"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Wallet,
  CreditCard,
  Building2,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  Download,
  Settings,
  Loader2,
  ArrowUpRight,
  Banknote,
} from "lucide-react";
import { storage, type PayoutSettings, type Payout } from "@/lib/storage";

type PayoutStatus = "all" | "pending" | "processing" | "completed" | "failed";

const statusConfig: Record<
  Payout["status"],
  { label: string; color: string; bgColor: string; icon: React.ElementType }
> = {
  completed: {
    label: "Completed",
    color: "text-green-700",
    bgColor: "bg-green-50",
    icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    icon: RefreshCw,
  },
  failed: {
    label: "Failed",
    color: "text-red-700",
    bgColor: "bg-red-50",
    icon: XCircle,
  },
};

export default function PayoutsPage() {
  const [payoutSettings, setPayoutSettings] = useState<PayoutSettings | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "settings">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PayoutStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);

  const payoutsPerPage = 10;

  useEffect(() => {
    const loadData = () => {
      const settings = storage.getPayoutSettings();
      const payoutData = storage.getPayouts();
      setPayoutSettings(settings);
      setPayouts(payoutData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const totalPaid = payouts
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);
    
    const pendingAmount = payouts
      .filter((p) => p.status === "pending" || p.status === "processing")
      .reduce((sum, p) => sum + p.amount, 0);

    const thisMonth = payouts.filter((p) => {
      const payoutDate = new Date(p.createdAt);
      const now = new Date();
      return payoutDate.getMonth() === now.getMonth() && 
             payoutDate.getFullYear() === now.getFullYear();
    });

    const thisMonthTotal = thisMonth
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalPaid,
      pendingAmount,
      thisMonthTotal,
      totalPayouts: payouts.length,
    };
  }, [payouts]);

  // Filter payouts
  const filteredPayouts = useMemo(() => {
    let result = [...payouts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (payout) =>
          payout.id.toLowerCase().includes(query) ||
          payout.reference?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((payout) => payout.status === statusFilter);
    }

    return result;
  }, [payouts, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredPayouts.length / payoutsPerPage);
  const paginatedPayouts = filteredPayouts.slice(
    (currentPage - 1) * payoutsPerPage,
    currentPage * payoutsPerPage
  );

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleConnectStripe = async () => {
    setIsConnecting(true);
    // Simulate Stripe Connect OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 2000));
    storage.connectStripe(`acct_${Date.now()}`);
    setPayoutSettings(storage.getPayoutSettings());
    setIsConnecting(false);
  };

  const handleDisconnectStripe = () => {
    storage.disconnectStripe();
    setPayoutSettings(storage.getPayoutSettings());
  };

  const handleConnectPaystack = async () => {
    setIsConnecting(true);
    // Simulate Paystack Connect flow
    await new Promise((resolve) => setTimeout(resolve, 2000));
    storage.connectPaystack(`PAYSTACK_${Date.now()}`);
    setPayoutSettings(storage.getPayoutSettings());
    setIsConnecting(false);
  };

  const handleDisconnectPaystack = () => {
    storage.disconnectPaystack();
    setPayoutSettings(storage.getPayoutSettings());
  };

  const handleUpdateSettings = (updates: Partial<PayoutSettings>) => {
    storage.updatePayoutSettings(updates);
    setPayoutSettings(storage.getPayoutSettings());
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
          <p className="text-gray-500 mt-1">Manage your earnings and payout settings</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors">
          <Download className="w-4 h-4" />
          Export History
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "overview"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "settings"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Payout Settings
        </button>
      </div>

      {activeTab === "overview" ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">All Time</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalPaid)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total Paid Out</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.pendingAmount)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Pending Balance</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.thisMonthTotal)}
              </p>
              <p className="text-sm text-gray-500 mt-1">This Month</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPayouts}</p>
              <p className="text-sm text-gray-500 mt-1">Total Payouts</p>
            </div>
          </div>

          {/* Connection Status Banner */}
          {!payoutSettings?.stripeConnected && !payoutSettings?.paystackConnected && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Connect a payout provider</p>
                <p className="text-sm text-yellow-700 mt-1">
                  To receive payouts, you need to connect Stripe or Paystack in the{" "}
                  <button
                    onClick={() => setActiveTab("settings")}
                    className="underline font-medium"
                  >
                    Payout Settings
                  </button>
                  .
                </p>
              </div>
            </div>
          )}

          {/* Filters & Search */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by payout ID or reference..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as PayoutStatus);
                  setCurrentPage(1);
                }}
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Payouts Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Payout ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Completed
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Reference
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedPayouts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <Wallet className="w-12 h-12 text-gray-300 mb-3" />
                          <p className="text-gray-500 font-medium">No payouts found</p>
                          <p className="text-sm text-gray-400 mt-1">
                            {searchQuery || statusFilter !== "all"
                              ? "Try adjusting your filters"
                              : "Your payouts will appear here"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedPayouts.map((payout) => {
                      const status = statusConfig[payout.status];
                      const StatusIcon = status.icon;

                      return (
                        <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4">
                            <span className="font-mono text-sm font-medium text-gray-900">
                              {payout.id}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(payout.amount, payout.currency)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              {payout.provider === "stripe" ? (
                                <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                                  <span className="text-xs font-bold text-purple-600">S</span>
                                </div>
                              ) : (
                                <div className="w-6 h-6 bg-teal-100 rounded flex items-center justify-center">
                                  <span className="text-xs font-bold text-teal-600">P</span>
                                </div>
                              )}
                              <span className="text-sm text-gray-600 capitalize">
                                {payout.provider}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}
                            >
                              <StatusIcon className="w-3.5 h-3.5" />
                              {status.label}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-600">
                              {formatDate(payout.createdAt)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-600">
                              {payout.completedAt ? formatDate(payout.completedAt) : "—"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-mono text-xs text-gray-500">
                              {payout.reference || "—"}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredPayouts.length > 0 && (
              <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * payoutsPerPage + 1} to{" "}
                  {Math.min(currentPage * payoutsPerPage, filteredPayouts.length)} of{" "}
                  {filteredPayouts.length} payouts
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? "bg-gray-900 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Settings Tab */
        <div className="space-y-6">
          {/* Payment Providers */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Payment Providers</h2>
            <p className="text-sm text-gray-500 mb-6">
              Connect your preferred payment provider to receive payouts
            </p>

            <div className="space-y-4">
              {/* Stripe Connect */}
              <div className="p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#635BFF">
                        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Stripe Connect</h3>
                      <p className="text-sm text-gray-500">
                        Accept payments and receive payouts globally
                      </p>
                    </div>
                  </div>
                  {payoutSettings?.stripeConnected ? (
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                        <Check className="w-4 h-4" />
                        Connected
                      </span>
                      <button
                        onClick={handleDisconnectStripe}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Disconnect
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleConnectStripe}
                      disabled={isConnecting}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {isConnecting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ExternalLink className="w-4 h-4" />
                      )}
                      Connect Stripe
                    </button>
                  )}
                </div>
                {payoutSettings?.stripeConnected && payoutSettings.stripeAccountId && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Account ID:</span>
                      <code className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {payoutSettings.stripeAccountId}
                      </code>
                    </div>
                  </div>
                )}
              </div>

              {/* Paystack */}
              <div className="p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#00C3F7">
                        <path d="M4.8 12h14.4v2.4H4.8V12zm0-4.8h14.4v2.4H4.8V7.2zm0 9.6h9.6v2.4H4.8v-2.4z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Paystack</h3>
                      <p className="text-sm text-gray-500">
                        Accept payments in Africa with local payment methods
                      </p>
                    </div>
                  </div>
                  {payoutSettings?.paystackConnected ? (
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                        <Check className="w-4 h-4" />
                        Connected
                      </span>
                      <button
                        onClick={handleDisconnectPaystack}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Disconnect
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleConnectPaystack}
                      disabled={isConnecting}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50"
                    >
                      {isConnecting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ExternalLink className="w-4 h-4" />
                      )}
                      Connect Paystack
                    </button>
                  )}
                </div>
                {payoutSettings?.paystackConnected && payoutSettings.paystackAccountId && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Account ID:</span>
                      <code className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {payoutSettings.paystackAccountId}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payout Schedule */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Payout Schedule</h2>
            <p className="text-sm text-gray-500 mb-6">
              Configure how often you receive payouts
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payout Frequency
                </label>
                <select
                  value={payoutSettings?.payoutSchedule || "weekly"}
                  onChange={(e) =>
                    handleUpdateSettings({
                      payoutSchedule: e.target.value as PayoutSettings["payoutSchedule"],
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Payout Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={payoutSettings?.minimumPayout || 100}
                    onChange={(e) =>
                      handleUpdateSettings({
                        minimumPayout: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step="10"
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Payouts will only be processed when balance exceeds this amount
                </p>
              </div>
            </div>
          </div>

          {/* Bank Account (Optional) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Bank Account <span className="text-sm font-normal text-gray-400">(Optional)</span>
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Add your bank details for direct deposits if not using Stripe or Paystack
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={payoutSettings?.bankName || ""}
                  onChange={(e) => handleUpdateSettings({ bankName: e.target.value })}
                  placeholder="e.g., Chase Bank"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={payoutSettings?.accountNumber || ""}
                  onChange={(e) => handleUpdateSettings({ accountNumber: e.target.value })}
                  placeholder="••••••••1234"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Routing Number
                </label>
                <input
                  type="text"
                  value={payoutSettings?.routingNumber || ""}
                  onChange={(e) => handleUpdateSettings({ routingNumber: e.target.value })}
                  placeholder="9 digits"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={payoutSettings?.currency || "USD"}
                  onChange={(e) => handleUpdateSettings({ currency: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="NGN">NGN - Nigerian Naira</option>
                  <option value="GHS">GHS - Ghanaian Cedi</option>
                  <option value="KES">KES - Kenyan Shilling</option>
                  <option value="ZAR">ZAR - South African Rand</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
