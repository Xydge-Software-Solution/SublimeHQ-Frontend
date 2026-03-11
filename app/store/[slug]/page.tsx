"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ShoppingCart, Star, Mail, ExternalLink, Plus, Check, User, LogIn } from "lucide-react";
import {
  storage,
  type StorefrontSettings,
  type Product,
  type Customer,
} from "@/lib/storage";

export default function PublicStorefrontPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [settings, setSettings] = useState<StorefrontSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  const [customer, setCustomer] = useState<Customer | null>(null);

  const loadStorefrontData = useCallback(() => {
    const storefrontData = storage.getStorefront();
    const allProducts = storage.getProducts();
    
    // Filter products that are on the storefront
    const storefrontProducts = allProducts.filter((p) =>
      storefrontData.productsOnStorefront.includes(p.id)
    );

    setSettings(storefrontData);
    setProducts(storefrontProducts);
    setCartCount(storage.getCartItemCount());
    
    // Check customer authentication
    const customerAuth = storage.getCustomerAuth();
    setCustomer(customerAuth.isAuthenticated ? customerAuth.customer : null);
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadStorefrontData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddToCart = (productId: string) => {
    storage.addToCart(productId, 1);
    setCartCount(storage.getCartItemCount());
    setAddedProducts((prev) => new Set(prev).add(productId));
    
    // Reset after 2 seconds
    setTimeout(() => {
      setAddedProducts((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }, 2000);
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
          <p className="text-gray-500 mt-2">This storefront does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  if (!settings.isPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Coming Soon</h1>
          <p className="text-gray-500 mt-2">This storefront is not yet available. Check back later!</p>
        </div>
      </div>
    );
  }

  const { navbar, hero, testimonials, footer } = settings;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="#" className="flex items-center gap-2">
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

      {/* Hero Section */}
      <section
        className="relative py-24 sm:py-32 lg:py-40"
        style={{
          background:
            hero.backgroundType === "gradient"
              ? `linear-gradient(${hero.gradientDirection}, ${hero.gradientFrom}, ${hero.gradientTo})`
              : `url(${hero.backgroundImage}) center/cover no-repeat`,
        }}
      >
        {hero.backgroundType === "image" && (
          <div className="absolute inset-0 bg-black/40" />
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            style={{ color: hero.textColor }}
          >
            {hero.headline}
          </h1>
          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto opacity-90"
            style={{ color: hero.textColor }}
          >
            {hero.subheadline}
          </p>
          <div className="mt-10">
            <a
              href="#products"
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              Browse Products
            </a>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Products</h2>
            <p className="text-gray-600 mt-2">Discover what we have to offer</p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  storeSlug={slug}
                  onAddToCart={() => handleAddToCart(product.id)}
                  isAdded={addedProducts.has(product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900">No products available</h3>
              <p className="text-sm text-gray-500 mt-1">Check back soon for new products!</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
            <p className="text-gray-600 mt-2">Real reviews from real customers</p>
          </div>

          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-gray-50 rounded-2xl p-6 relative"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      {testimonial.customerAvatar ? (
                        <Image
                          src={testimonial.customerAvatar}
                          alt={testimonial.customerName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg font-bold">
                          {testimonial.customerName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.customerName}</h4>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{testimonial.content}</p>
                  <p className="text-sm text-gray-400 mt-4">On: {testimonial.productName}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900">No reviews yet</h3>
              <p className="text-sm text-gray-500 mt-1">Be the first to leave a review!</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4">{footer.storeName}</h3>
              <p className="text-gray-400 leading-relaxed">{footer.description}</p>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`mailto:${footer.supportEmail}`}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {footer.supportEmail}
                  </a>
                </li>
                <li>
                  <a
                    href="https://sublime.io/support"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Sublime Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {footer.socialLinks.twitter && (
                  <a
                    href={footer.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
                {footer.socialLinks.instagram && (
                  <a
                    href={footer.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}
                {footer.socialLinks.facebook && (
                  <a
                    href={footer.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">{footer.copyrightText}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Product Card Component
function ProductCard({ 
  product, 
  storeSlug,
  onAddToCart,
  isAdded,
}: { 
  product: Product;
  storeSlug: string;
  onAddToCart: () => void;
  isAdded: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
      <Link href={`/store/${storeSlug}/product/${product.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/store/${storeSlug}/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-gray-600">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviewCount})</span>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart();
            }}
            disabled={isAdded}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              isAdded
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                Added
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add
              </>
            )}
          </button>
          <Link
            href={`/store/${storeSlug}/checkout?product=${product.id}`}
            className="flex-1 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors text-center"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
