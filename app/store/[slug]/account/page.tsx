"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { storage, type Customer, type Order, type StorefrontNavbar, type StorefrontFooter, type ProductReview } from "@/lib/storage";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Package, 
  LogOut,
  ShoppingBag,
  ChevronRight,
  Clock,
  Star,
  MessageSquare,
  X,
  Loader2
} from "lucide-react";

export default function CustomerAccountPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [navbar, setNavbar] = useState<StorefrontNavbar>({
    logoUrl: "",
    showCart: true,
  });
  const [footer, setFooter] = useState<StorefrontFooter>({
    storeName: "",
    description: "",
    supportEmail: "",
    socialLinks: { twitter: "", instagram: "", facebook: "" },
    copyrightText: "",
  });
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  
  // Review modal state
  const [reviewedProductIds, setReviewedProductIds] = useState<Set<string>>(new Set());
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewingOrder, setReviewingOrder] = useState<Order | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const store = storage.getStore();
    setNavbar(store.storefront.navbar);
    setFooter(store.storefront.footer);
    // primaryColor defaults to the initial state value

    // Check if customer is authenticated
    const auth = storage.getCustomerAuth();
    if (!auth.isAuthenticated || !auth.customer) {
      router.push(`/store/${slug}/login`);
      return;
    }

    setCustomer(auth.customer);
    
    // Get customer's orders
    const customerOrders = storage.getCustomerOrders(auth.customer.id);
    setOrders(customerOrders);
    
    // Get products the customer has already reviewed
    const allReviews = store.reviews || [];
    const customerReviewedProducts = new Set(
      allReviews
        .filter((r: ProductReview) => r.customerId === auth.customer!.id)
        .map((r: ProductReview) => r.productId)
    );
    setReviewedProductIds(customerReviewedProducts);
    
    setIsLoading(false);
  }, [router, slug]);

  const handleLogout = () => {
    storage.logoutCustomer();
    router.push(`/store/${slug}`);
  };

  const openReviewModal = (order: Order) => {
    setReviewingOrder(order);
    setReviewRating(5);
    setReviewTitle("");
    setReviewContent("");
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setReviewingOrder(null);
  };

  const handleSubmitReview = async () => {
    if (!customer || !reviewingOrder || !reviewTitle.trim() || !reviewContent.trim()) return;
    
    setReviewSubmitting(true);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    storage.addReview({
      productId: reviewingOrder.productId,
      customerId: customer.id,
      customerName: customer.name,
      rating: reviewRating,
      title: reviewTitle,
      content: reviewContent,
      verified: true, // They purchased it
    });
    
    // Update reviewed products set
    setReviewedProductIds((prev) => new Set(prev).add(reviewingOrder.productId));
    
    setReviewSubmitting(false);
    closeReviewModal();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: primaryColor }}></div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/store/${slug}`} className="flex items-center gap-2">
              {navbar.logoUrl ? (
                <Image
                  src={navbar.logoUrl}
                  alt={footer.storeName}
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              ) : (
                <span className="text-xl font-bold text-gray-900">{footer.storeName}</span>
              )}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          href={`/store/${slug}`}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to store
        </Link>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold"
                style={{ backgroundColor: primaryColor }}
              >
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                <p className="text-gray-500">Member since {formatDate(customer.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{customer.email}</p>
              </div>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{customer.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Package className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Total Orders</p>
                <p className="text-sm font-medium text-gray-900">{orders.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Joined</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(customer.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
            <p className="text-sm text-gray-500 mt-1">View and track your orders</p>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <div 
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <ShoppingBag className="w-8 h-8" style={{ color: primaryColor }} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-4">Start shopping to see your orders here</p>
              <Link
                href={`/store/${slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                Browse Products
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.map((order) => (
                <div key={order.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-gray-900">{order.product}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(order.createdAt)}
                        </span>
                        <span>Order #{order.id.slice(-8).toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Write Review button for completed orders */}
                      {order.status === "completed" && order.productId && (
                        reviewedProductIds.has(order.productId) ? (
                          <span className="flex items-center gap-1 text-sm text-green-600">
                            <Star className="w-4 h-4 fill-green-600" />
                            Reviewed
                          </span>
                        ) : (
                          <button
                            onClick={() => openReviewModal(order)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Write Review
                          </button>
                        )
                      )}
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(order.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href={`/store/${slug}`}
            className="flex items-center justify-center gap-2 p-4 bg-white rounded-xl border border-gray-200 text-gray-700 hover:border-gray-300 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 p-4 bg-white rounded-xl border border-gray-200 text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && reviewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Write a Review</h2>
                <p className="text-sm text-gray-500 mt-1">{reviewingOrder.product}</p>
              </div>
              <button
                onClick={closeReviewModal}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Rating Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReviewRating(i + 1)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          i < reviewRating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-gray-600">{reviewRating} out of 5</span>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="What did you like or dislike about this product?"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSubmitReview}
                  disabled={reviewSubmitting || !reviewTitle.trim() || !reviewContent.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: primaryColor }}
                >
                  {reviewSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
                <button
                  onClick={closeReviewModal}
                  className="px-5 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
