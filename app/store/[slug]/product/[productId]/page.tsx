"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ShoppingCart, 
  Star, 
  ArrowLeft, 
  Share2, 
  Check, 
  Plus,
  Copy,
  CheckCircle,
  User,
  LogIn,
  ThumbsUp,
  MessageSquare,
  Verified,
} from "lucide-react";
import { storage, type Product, type StorefrontSettings, type Customer, type ProductReview } from "@/lib/storage";
import EventDetailPage from "@/components/EventDetailPage";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const productId = params.productId as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [settings, setSettings] = useState<StorefrontSettings | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [canReview, setCanReview] = useState<{ canReview: boolean; reason?: string }>({ canReview: false });

  useEffect(() => {
    const storefrontData = storage.getStorefront();
    const productData = storage.getProduct(productId);
    
    setSettings(storefrontData);
    setProduct(productData || null);
    setCartCount(storage.getCartItemCount());
    
    // Load customer auth
    const customerAuth = storage.getCustomerAuth();
    if (customerAuth.isAuthenticated && customerAuth.customer) {
      setCustomer(customerAuth.customer);
      // Check if customer can review
      const canReviewResult = storage.canReviewProduct(customerAuth.customer.id, productId);
      setCanReview(canReviewResult);
    }
    
    // Load reviews
    const productReviews = storage.getProductReviews(productId);
    setReviews(productReviews);
    
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleAddToCart = () => {
    storage.addToCart(productId, quantity);
    setCartCount(storage.getCartItemCount());
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url,
        });
      } catch {
        // User cancelled or share failed, fallback to copy
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitReview = async () => {
    if (!customer || !reviewTitle.trim() || !reviewContent.trim()) return;
    
    setReviewSubmitting(true);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newReview = storage.addReview({
      productId,
      customerId: customer.id,
      customerName: customer.name,
      rating: reviewRating,
      title: reviewTitle,
      content: reviewContent,
      verified: canReview.reason !== "not_purchased",
    });
    
    setReviews((prev) => [newReview, ...prev]);
    setShowReviewForm(false);
    setReviewTitle("");
    setReviewContent("");
    setReviewRating(5);
    setCanReview({ canReview: false, reason: "You have already reviewed this product" });
    
    // Refresh product to get updated rating
    const updatedProduct = storage.getProduct(productId);
    if (updatedProduct) setProduct(updatedProduct);
    
    setReviewSubmitting(false);
  };

  const handleMarkHelpful = (reviewId: string) => {
    storage.markReviewHelpful(reviewId);
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r))
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
          <p className="text-gray-500 mt-2">This product does not exist or has been removed.</p>
          <Link
            href={`/store/${slug}`}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  const { navbar, footer } = settings;

  // Render event-specific page for event products
  if (product.type === "event") {
    return (
      <EventDetailPage
        product={product}
        settings={settings}
        customer={customer}
        slug={slug}
        cartCount={cartCount}
        onCartUpdate={setCartCount}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
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

            {navbar.showCart && (
              <div className="flex items-center gap-3">
                {/* User Avatar / Login */}
                {customer ? (
                  <Link
                    href={`/store/${slug}/account`}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                      {customer.name.split(" ")[0]}
                    </span>
                  </Link>
                ) : (
                  <Link
                    href={`/store/${slug}/login`}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:block">Sign In</span>
                  </Link>
                )}
                
                {/* Cart */}
                <Link 
                  href={`/store/${slug}/cart`}
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm">
          <Link href={`/store/${slug}`} className="text-gray-500 hover:text-gray-900">
            Store
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium truncate">{product.title}</span>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
              <button
                onClick={handleShare}
                className="flex-shrink-0 p-2.5 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors"
                title="Share product"
              >
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 font-medium">{product.rating}</span>
              <span className="text-gray-400">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-6">
              <span className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">About this product</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Features / What's included */}
            <div className="mt-8 p-5 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">What&apos;s included</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  Instant digital delivery
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  Lifetime access
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  Free updates
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  30-day money-back guarantee
                </li>
              </ul>
            </div>

            {/* Quantity Selector */}
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-300 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-300 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-lg font-semibold rounded-xl transition-colors ${
                  isAdded
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>
              <Link
                href={`/store/${slug}/checkout?product=${product.id}&qty=${quantity}`}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Buy Now
              </Link>
            </div>

            {/* Back to Store */}
            <Link
              href={`/store/${slug}`}
              className="mt-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all products
            </Link>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-gray-900">{product.rating}</span>
                <span className="text-gray-500">based on {product.reviewCount} reviews</span>
              </div>
            </div>
            
            {/* Write Review Button */}
            {customer ? (
              canReview.canReview ? (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Write a Review
                </button>
              ) : (
                <p className="text-sm text-gray-500">{canReview.reason}</p>
              )
            ) : (
              <Link
                href={`/store/${slug}/login?redirect=${encodeURIComponent(`/store/${slug}/product/${productId}`)}`}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign in to Review
              </Link>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Write Your Review</h3>
              
              {/* Rating Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
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
              <div className="mb-4">
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="Share your thoughts about the product..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {canReview.reason === "not_purchased" && (
                <p className="text-sm text-amber-600 mb-4">
                  Note: Your review will not be marked as &quot;Verified Purchase&quot; since you haven&apos;t purchased this product yet.
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleSubmitReview}
                  disabled={reviewSubmitting || !reviewTitle.trim() || !reviewContent.trim()}
                  className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reviewSubmitting ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-500">
                Be the first to share your thoughts about this product!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                        {review.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{review.customerName}</span>
                          {review.verified && (
                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                              <Verified className="w-3 h-3" />
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{review.content}</p>
                  
                  <div className="mt-4 flex items-center gap-4">
                    <button
                      onClick={() => handleMarkHelpful(review.id)}
                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Helpful ({review.helpful})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400">{footer.copyrightText}</p>
            <Link
              href={`/store/${slug}`}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Back to {footer.storeName}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
