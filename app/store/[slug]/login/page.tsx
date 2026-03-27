"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Loader2, ArrowLeft, ShoppingBag, Eye, EyeOff } from "lucide-react";
import { storage, type StorefrontSettings } from "@/lib/storage";
import AuthCarousel from "@/components/AuthCarousel";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function StoreLoginPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const redirectTo = searchParams.get("redirect") || `/store/${slug}`;

  const [settings] = useState<StorefrontSettings | null>(storage.getStorefront());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if already logged in
    if (storage.isCustomerAuthenticated()) {
      router.push(redirectTo);
      return;
    }
  }, [router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validate
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    // Attempt login
    const result = storage.loginCustomer(email, password);

    if ("error" in result) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    // Success - redirect
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push(redirectTo);
  };

  const primaryColor = "#6366f1";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <div className="flex-1 flex flex-col w-full lg:w-1/2 relative bg-white overflow-hidden">
        <AnimatedBackground />
        
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-white/20 shrink-0 relative z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 max-w-2xl mx-auto lg:mx-0">
              <Link
                href={`/store/${slug}`}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Store</span>
              </Link>
              <Link href={`/store/${slug}`} className="flex items-center gap-2">
                {settings?.navbar.logoUrl ? (
                  <Image
                    src={settings.navbar.logoUrl}
                    alt={settings.footer.storeName}
                    width={120}
                    height={32}
                    className="h-8 w-auto"
                  />
                ) : (
                  <ShoppingBag className="w-6 h-6" style={{ color: primaryColor }} />
                )}
                <span className="text-lg font-semibold text-gray-900">
                  {settings?.footer.storeName || "Store"}
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full lg:mx-0 py-12 relative z-10">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 sm:p-10">
            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
              <p className="text-gray-500 mt-2">
                Sign in to your account to continue shopping
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: primaryColor }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href={`/store/${slug}/register${redirectTo !== `/store/${slug}` ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
                  className="font-medium hover:underline"
                  style={{ color: primaryColor }}
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            By signing in, you agree to the store&apos;s terms and privacy policy.
          </p>
        </main>
      </div>

      <div className="hidden lg:block lg:w-1/2">
        <AuthCarousel />
      </div>
    </div>
  );
}
