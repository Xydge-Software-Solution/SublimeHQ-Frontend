"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  Save,
  Globe,
  Sparkles,
  Image as ImageIcon,
  Type,
  ShoppingBag,
  MessageSquare,
  Layout,
  ExternalLink,
  X,
  Plus,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { storage, type StorefrontSettings, type Product } from "@/lib/storage";
import GradientPicker from "@/components/GradientPicker";

type SectionTab = "hero" | "products" | "testimonials" | "footer";

export default function StorefrontPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>("hero");
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // State for editable data
  const [settings, setSettings] = useState<StorefrontSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeName, setStoreName] = useState("My Store");

  // Load data on client mount
  useEffect(() => {
    const storefrontData = storage.getStorefront();
    const productsData = storage.getProducts();
    const onboarding = storage.getOnboarding();
    
    setSettings(storefrontData);
    setProducts(productsData);
    setStoreName(onboarding?.storeName || "My Store");
    setIsLoaded(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    storage.updateStorefront(settings);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
  };

  const handlePublish = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    storage.publishStorefront();
    setSettings({ ...settings, isPublished: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
  };

  const handleUnpublish = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    storage.unpublishStorefront();
    setSettings({ ...settings, isPublished: false });
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
  };

  const copyStoreLink = () => {
    const link = `${window.location.origin}/store/${settings?.storeSlug}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleProductOnStorefront = (productId: string) => {
    if (!settings) return;
    
    const isOnStorefront = settings.productsOnStorefront.includes(productId);
    
    let newProductsOnStorefront: string[];
    if (isOnStorefront) {
      newProductsOnStorefront = settings.productsOnStorefront.filter((id) => id !== productId);
    } else {
      newProductsOnStorefront = [...settings.productsOnStorefront, productId];
    }
    
    const updatedSettings = {
      ...settings,
      productsOnStorefront: newProductsOnStorefront,
    };
    
    // Update local state
    setSettings(updatedSettings);
    
    // Also save to localStorage immediately so changes persist
    storage.updateStorefront(updatedSettings);
  };

  const storefrontProducts = useMemo(() => {
    if (!settings) return [];
    return products.filter((p) => settings.productsOnStorefront.includes(p.id));
  }, [products, settings]);

  if (!isLoaded || !settings) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const tabs = [
    { id: "hero" as const, label: "Hero Section", icon: Layout },
    { id: "products" as const, label: "Products", icon: ShoppingBag },
    { id: "testimonials" as const, label: "Testimonials", icon: MessageSquare },
    { id: "footer" as const, label: "Footer", icon: Type },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Storefront Editor</h1>
          <p className="text-gray-500 mt-1">Customize your public storefront page</p>
        </div>
        <div className="flex items-center gap-3">
          {settings.isPublished && (
            <button
              onClick={copyStoreLink}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          )}
          <Link
            href={`/store/${settings.storeSlug}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          {settings.isPublished ? (
            <button
              onClick={handleUnpublish}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              Unpublish
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Globe className="w-4 h-4" />
              Publish
            </button>
          )}
        </div>
      </div>

      {/* Status Banner */}
      <div
        className={`p-4 rounded-xl ${
          settings.isPublished
            ? "bg-green-50 border border-green-200"
            : "bg-amber-50 border border-amber-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                settings.isPublished ? "bg-green-500" : "bg-amber-500"
              }`}
            />
            <span className={`font-medium ${settings.isPublished ? "text-green-700" : "text-amber-700"}`}>
              {settings.isPublished ? "Your storefront is live!" : "Your storefront is not published yet"}
            </span>
          </div>
          {settings.isPublished && (
            <a
              href={`/store/${settings.storeSlug}`}
              target="_blank"
              className="flex items-center gap-1 text-sm text-green-700 hover:text-green-800 font-medium"
            >
              View Store <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {activeTab === "hero" && (
          <HeroSection
            settings={settings}
            onChange={(hero) => setSettings({ ...settings, hero })}
            storeName={storeName}
          />
        )}
        {activeTab === "products" && (
          <ProductsSection
            products={products}
            selectedIds={settings.productsOnStorefront}
            onToggle={toggleProductOnStorefront}
          />
        )}
        {activeTab === "testimonials" && (
          <TestimonialsSection
            testimonials={settings.testimonials}
            onChange={(testimonials) => setSettings({ ...settings, testimonials })}
          />
        )}
        {activeTab === "footer" && (
          <FooterSection
            footer={settings.footer}
            onChange={(footer) => setSettings({ ...settings, footer })}
          />
        )}
      </div>
    </div>
  );
}

// Hero Section Editor
function HeroSection({
  settings,
  onChange,
  storeName,
}: {
  settings: StorefrontSettings;
  onChange: (hero: StorefrontSettings["hero"]) => void;
  storeName: string;
}) {
  const { hero } = settings;

  const generateWithAI = (field: "headline" | "subheadline") => {
    // Simulate AI generation
    const headlines = [
      `Welcome to ${storeName}`,
      `Discover Premium Digital Products`,
      `Transform Your Skills Today`,
      `Your Success Starts Here`,
    ];
    const subheadlines = [
      "Explore our curated collection of digital products designed to help you succeed",
      "Premium courses, templates, and resources crafted by experts",
      "Join thousands of satisfied customers on their journey to success",
      "Quality digital products at prices you'll love",
    ];

    if (field === "headline") {
      onChange({ ...hero, headline: headlines[Math.floor(Math.random() * headlines.length)] });
    } else {
      onChange({ ...hero, subheadline: subheadlines[Math.floor(Math.random() * subheadlines.length)] });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Hero Section</h3>
        <p className="text-sm text-gray-500">The first thing visitors see on your storefront</p>
      </div>

      {/* Background Type Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Background Type</label>
        <div className="flex gap-2">
          <button
            onClick={() => onChange({ ...hero, backgroundType: "gradient" })}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
              hero.backgroundType === "gradient"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <div className="w-5 h-5 rounded bg-gradient-to-r from-indigo-500 to-purple-500" />
            Gradient
          </button>
          <button
            onClick={() => onChange({ ...hero, backgroundType: "image" })}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
              hero.backgroundType === "image"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            Image
          </button>
        </div>
      </div>

      {/* Background Settings */}
      {hero.backgroundType === "gradient" ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Gradient Colors</label>
          <GradientPicker
            fromColor={hero.gradientFrom}
            toColor={hero.gradientTo}
            direction={hero.gradientDirection}
            onChange={({ from, to, direction }) =>
              onChange({
                ...hero,
                gradientFrom: from,
                gradientTo: to,
                gradientDirection: direction,
              })
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Upload Image</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (max 5MB)</p>
              </div>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      alert("Image must be less than 5MB");
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const result = event.target?.result as string;
                      onChange({ ...hero, backgroundImage: result });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>

          {/* OR Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-medium text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Image URL</label>
            <input
              type="text"
              value={hero.backgroundImage.startsWith("data:") ? "" : hero.backgroundImage}
              onChange={(e) => onChange({ ...hero, backgroundImage: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-2">
              Tip: Use direct image URLs from Unsplash, Pexels, or other image hosts
            </p>
          </div>

          {/* Preview */}
          {hero.backgroundImage && (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-3">Preview</label>
              <div className="relative h-32 rounded-lg overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero.backgroundImage}
                  alt="Background preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <button
                onClick={() => onChange({ ...hero, backgroundImage: "" })}
                className="absolute top-8 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Headline */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Headline</label>
          <button
            onClick={() => generateWithAI("headline")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 rounded-full hover:bg-purple-100 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate with AI
          </button>
        </div>
        <input
          type="text"
          value={hero.headline}
          onChange={(e) => onChange({ ...hero, headline: e.target.value })}
          placeholder="Welcome to My Store"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
        />
      </div>

      {/* Subheadline */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Subheadline</label>
          <button
            onClick={() => generateWithAI("subheadline")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 rounded-full hover:bg-purple-100 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate with AI
          </button>
        </div>
        <textarea
          value={hero.subheadline}
          onChange={(e) => onChange({ ...hero, subheadline: e.target.value })}
          placeholder="Discover amazing digital products crafted just for you"
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Text Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={hero.textColor}
            onChange={(e) => onChange({ ...hero, textColor: e.target.value })}
            className="w-12 h-10 rounded cursor-pointer border border-gray-200"
          />
          <input
            type="text"
            value={hero.textColor}
            onChange={(e) => onChange({ ...hero, textColor: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
            placeholder="#ffffff"
          />
        </div>
      </div>

      {/* Live Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Preview</label>
        <div
          className="relative h-48 rounded-xl overflow-hidden flex items-center justify-center p-8"
          style={{
            background:
              hero.backgroundType === "gradient"
                ? `linear-gradient(${hero.gradientDirection}, ${hero.gradientFrom}, ${hero.gradientTo})`
                : `url(${hero.backgroundImage}) center/cover`,
          }}
        >
          <div className="text-center" style={{ color: hero.textColor }}>
            <h2 className="text-2xl font-bold mb-2">{hero.headline || "Your Headline"}</h2>
            <p className="text-sm opacity-90">{hero.subheadline || "Your subheadline goes here"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Products Section Editor
function ProductsSection({
  products,
  selectedIds,
  onToggle,
}: {
  products: Product[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Products on Storefront</h3>
        <p className="text-sm text-gray-500">
          Choose which products appear on your public storefront ({selectedIds.length} selected)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => {
          const isSelected = selectedIds.includes(product.id);
          return (
            <div
              key={product.id}
              className={`relative flex gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => onToggle(product.id)}
            >
              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{product.title}</h4>
                <p className="text-sm text-gray-500 mt-0.5">${product.price.toFixed(2)}</p>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-2 ${
                    product.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {product.status}
                </span>
              </div>
              <div
                className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300"
                }`}
              >
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900">No products yet</h3>
          <p className="text-sm text-gray-500 mt-1">Add products to show them on your storefront</p>
          <Link
            href="/dashboard/products/new"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      )}
    </div>
  );
}

// Testimonials Section Editor
function TestimonialsSection({
  testimonials,
  onChange,
}: {
  testimonials: StorefrontSettings["testimonials"];
  onChange: (testimonials: StorefrontSettings["testimonials"]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Testimonials</h3>
        <p className="text-sm text-gray-500">
          Testimonials are automatically added from product reviews. You can manage them here.
        </p>
      </div>

      {testimonials.length > 0 ? (
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex gap-4 p-4 rounded-xl border border-gray-200"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                {testimonial.customerAvatar ? (
                  <Image
                    src={testimonial.customerAvatar}
                    alt={testimonial.customerName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    {testimonial.customerName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">{testimonial.customerName}</h4>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating ? "text-yellow-400" : "text-gray-200"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{testimonial.content}</p>
                <p className="text-xs text-gray-400 mt-2">On: {testimonial.productName}</p>
              </div>
              <button
                onClick={() => onChange(testimonials.filter((t) => t.id !== testimonial.id))}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900">No testimonials yet</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            Testimonials will appear here automatically when customers leave reviews on your products.
          </p>
        </div>
      )}
    </div>
  );
}

// Footer Section Editor
function FooterSection({
  footer,
  onChange,
}: {
  footer: StorefrontSettings["footer"];
  onChange: (footer: StorefrontSettings["footer"]) => void;
}) {
  const generateWithAI = (field: "description" | "copyrightText") => {
    const descriptions = [
      "Your trusted source for premium digital products",
      "Empowering creators with quality digital resources",
      "Digital products designed for your success",
      "Quality content, exceptional value",
    ];
    const copyrights = [
      `© ${new Date().getFullYear()} ${footer.storeName}. All rights reserved.`,
      `© ${new Date().getFullYear()} ${footer.storeName}. Powered by Sublime.`,
      `${footer.storeName} © ${new Date().getFullYear()}`,
    ];

    if (field === "description") {
      onChange({ ...footer, description: descriptions[Math.floor(Math.random() * descriptions.length)] });
    } else {
      onChange({ ...footer, copyrightText: copyrights[Math.floor(Math.random() * copyrights.length)] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Footer Settings</h3>
        <p className="text-sm text-gray-500">Customize your storefront footer</p>
      </div>

      {/* Store Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
        <input
          type="text"
          value={footer.storeName}
          onChange={(e) => onChange({ ...footer, storeName: e.target.value })}
          placeholder="My Store"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Description */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <button
            onClick={() => generateWithAI("description")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 rounded-full hover:bg-purple-100 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate with AI
          </button>
        </div>
        <textarea
          value={footer.description}
          onChange={(e) => onChange({ ...footer, description: e.target.value })}
          placeholder="Your one-stop shop for premium digital products"
          rows={2}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Support Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
        <input
          type="email"
          value={footer.supportEmail}
          onChange={(e) => onChange({ ...footer, supportEmail: e.target.value })}
          placeholder="support@example.com"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Social Links */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Social Links</label>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <input
              type="text"
              value={footer.socialLinks.twitter || ""}
              onChange={(e) =>
                onChange({ ...footer, socialLinks: { ...footer.socialLinks, twitter: e.target.value } })
              }
              placeholder="https://twitter.com/yourstore"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <input
              type="text"
              value={footer.socialLinks.instagram || ""}
              onChange={(e) =>
                onChange({ ...footer, socialLinks: { ...footer.socialLinks, instagram: e.target.value } })
              }
              placeholder="https://instagram.com/yourstore"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <input
              type="text"
              value={footer.socialLinks.facebook || ""}
              onChange={(e) =>
                onChange({ ...footer, socialLinks: { ...footer.socialLinks, facebook: e.target.value } })
              }
              placeholder="https://facebook.com/yourstore"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* Copyright Text */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Copyright Text</label>
          <button
            onClick={() => generateWithAI("copyrightText")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 rounded-full hover:bg-purple-100 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate with AI
          </button>
        </div>
        <input
          type="text"
          value={footer.copyrightText}
          onChange={(e) => onChange({ ...footer, copyrightText: e.target.value })}
          placeholder="© 2024 My Store. All rights reserved."
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
