"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { 
  ShoppingCart, 
  ArrowLeft, 
  CreditCard,
  Lock,
  Check,
  Loader2,
} from "lucide-react";
import { storage, type Product, type StorefrontSettings, type CartItem } from "@/lib/storage";

interface CheckoutItem {
  product: Product;
  quantity: number;
}

function CheckoutContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  // Check if this is a direct buy (single product)
  const productId = searchParams.get("product");
  const qtyParam = searchParams.get("qty");
  const directBuyQty = qtyParam ? parseInt(qtyParam, 10) : 1;
  
  const [settings, setSettings] = useState<StorefrontSettings | null>(null);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Form state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const storefrontData = storage.getStorefront();
    setSettings(storefrontData);
    
    if (productId) {
      // Direct buy - single product
      const product = storage.getProduct(productId);
      if (product) {
        setCheckoutItems([{ product, quantity: directBuyQty }]);
      }
    } else {
      // Cart checkout
      const cartWithProducts = storage.getCartWithProducts();
      setCheckoutItems(
        cartWithProducts.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        }))
      );
    }
    
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, directBuyQty]);

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  // Tax rate (example: 8%)
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required";
    } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Invalid card number";
    }
    
    if (!expiry.trim()) {
      newErrors.expiry = "Expiry date is required";
    } else if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      newErrors.expiry = "Use MM/YY format";
    }
    
    if (!cvc.trim()) {
      newErrors.cvc = "CVC is required";
    } else if (!/^\d{3,4}$/.test(cvc)) {
      newErrors.cvc = "Invalid CVC";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Create orders for each item
    for (const item of checkoutItems) {
      storage.addOrder({
        customer: name,
        customerEmail: email,
        product: item.product.title,
        amount: item.product.price * item.quantity,
        status: "completed",
      });
      
      // Update product sales
      storage.updateProduct(item.product.id, {
        sales: item.product.sales + item.quantity,
      });
    }
    
    // Clear cart if this was a cart checkout
    if (!productId) {
      storage.clearCart();
    }
    
    setIsProcessing(false);
    setIsComplete(true);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Store not found</h1>
          <p className="text-gray-500 mt-2">This store does not exist.</p>
        </div>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Nothing to checkout</h1>
          <p className="text-gray-500 mt-2">Your cart is empty or the product was not found.</p>
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

  // Success screen
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-16">
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
            </div>
          </div>
        </nav>

        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Order Complete!</h1>
          <p className="text-gray-500 mt-4 text-lg">
            Thank you for your purchase. A confirmation email has been sent to{" "}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
          
          <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200 text-left">
            <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
            {checkoutItems.map((item) => (
              <div key={item.product.id} className="flex justify-between py-2 text-sm">
                <span className="text-gray-600">
                  {item.product.title} × {item.quantity}
                </span>
                <span className="font-medium text-gray-900">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 mt-3 pt-3">
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total Paid</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <Link
            href={`/store/${slug}`}
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
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
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              Secure Checkout
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={productId ? `/store/${slug}/product/${productId}` : `/store/${slug}/cart`}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Payment Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.name ? "border-red-500" : "border-gray-200"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                          errors.cardNumber ? "border-red-500" : "border-gray-200"
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      />
                      <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry date
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.expiry ? "border-red-500" : "border-gray-200"
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      />
                      {errors.expiry && (
                        <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        id="cvc"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        maxLength={4}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.cvc ? "border-red-500" : "border-gray-200"
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      />
                      {errors.cvc && (
                        <p className="text-red-500 text-sm mt-1">{errors.cvc}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="mt-4 text-xs text-gray-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Your payment information is secure and encrypted
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay ${total.toFixed(2)}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {checkoutItems.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                        {item.product.title}
                      </h4>
                      <p className="text-gray-500 text-sm mt-1">
                        ${item.product.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 my-4" />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 my-4" />

              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">{footer.copyrightText}</p>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Lock className="w-4 h-4" />
              Secure checkout powered by Sublime
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Wrapper component with Suspense for useSearchParams
export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
