"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Crown,
  Upload,
  Trash2,
  Plus,
  Check,
  Loader2,
  Star,
  Zap,
  Shield,
} from "lucide-react";
import { storage, type Product, type MembershipDetails } from "@/lib/storage";

interface Tier {
  id: string;
  name: string;
  price: number;
  billingPeriod: "monthly" | "yearly" | "one-time";
  benefits: string[];
}

export default function NewMembershipProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Basic Info
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState<number>(9.99);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState("");

  // Membership Details
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly" | "one-time">("monthly");
  const [trialDays, setTrialDays] = useState<number>(0);
  const [accessLevel, setAccessLevel] = useState<"basic" | "premium" | "vip">("premium");

  // Benefits
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState("");

  // Additional Tiers
  const [hasMultipleTiers, setHasMultipleTiers] = useState(false);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [editingTier, setEditingTier] = useState<Partial<Tier>>({
    name: "",
    price: 0,
    billingPeriod: "monthly",
    benefits: [],
  });
  const [newTierBenefit, setNewTierBenefit] = useState("");

  const [status, setStatus] = useState<"published" | "draft">("draft");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const addTierBenefit = () => {
    if (newTierBenefit.trim()) {
      setEditingTier({
        ...editingTier,
        benefits: [...(editingTier.benefits || []), newTierBenefit.trim()],
      });
      setNewTierBenefit("");
    }
  };

  const removeTierBenefit = (index: number) => {
    setEditingTier({
      ...editingTier,
      benefits: (editingTier.benefits || []).filter((_, i) => i !== index),
    });
  };

  const addTier = () => {
    if (editingTier.name?.trim() && editingTier.price !== undefined) {
      setTiers([
        ...tiers,
        {
          id: crypto.randomUUID(),
          name: editingTier.name.trim(),
          price: editingTier.price,
          billingPeriod: editingTier.billingPeriod || "monthly",
          benefits: editingTier.benefits || [],
        },
      ]);
      setEditingTier({
        name: "",
        price: 0,
        billingPeriod: "monthly",
        benefits: [],
      });
    }
  };

  const removeTier = (id: string) => {
    setTiers(tiers.filter((t) => t.id !== id));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !shortDescription.trim()) {
      alert("Please fill in the required fields");
      return;
    }

    setIsSubmitting(true);

    const membershipDetails: MembershipDetails = {
      billingPeriod,
      trialDays: trialDays > 0 ? trialDays : undefined,
      benefits: benefits.length > 0 ? benefits : undefined,
      accessLevel,
    };

    const newProduct: Omit<Product, "id" | "createdAt" | "sales"> = {
      type: "membership",
      title,
      description,
      shortDescription,
      price,
      compareAtPrice,
      image: image || "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
      rating: 0,
      reviewCount: 0,
      status,
      category: category || undefined,
      membershipDetails,
    };

    storage.addProduct(newProduct);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    router.push("/dashboard/products");
  };

  const accessLevels = [
    { value: "basic", label: "Basic", icon: Shield, color: "gray", desc: "Essential access" },
    { value: "premium", label: "Premium", icon: Star, color: "yellow", desc: "Full access + perks" },
    { value: "vip", label: "VIP", icon: Crown, color: "purple", desc: "Exclusive benefits" },
  ];

  const billingOptions = [
    { value: "monthly", label: "Monthly", desc: "Billed every month" },
    { value: "yearly", label: "Yearly", desc: "Billed once a year" },
    { value: "one-time", label: "Lifetime", desc: "One-time payment" },
  ];

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Product Types
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Crown className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Membership</h1>
            <p className="text-gray-500">Subscription plans and recurring access</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Membership Cover Image</label>
            {image ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Membership" className="w-full h-full object-cover" />
                <button
                  onClick={() => setImage("")}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  <span className="font-medium text-purple-600">Upload cover image</span>
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Membership Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Creator Pro Membership, Inner Circle"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="One-line value proposition"
              maxLength={150}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what members get access to..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="community">Community</option>
              <option value="content">Content Library</option>
              <option value="tools">Tools & Software</option>
              <option value="coaching">Group Coaching</option>
              <option value="newsletter">Newsletter</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Access Level */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-gray-400" />
            Access Level
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {accessLevels.map((level) => {
              const Icon = level.icon;
              const isSelected = accessLevel === level.value;
              const colorClasses = {
                gray: isSelected ? "border-gray-500 bg-gray-50" : "",
                yellow: isSelected ? "border-yellow-500 bg-yellow-50" : "",
                purple: isSelected ? "border-purple-500 bg-purple-50" : "",
              };
              const iconColors = {
                gray: isSelected ? "text-gray-600" : "text-gray-400",
                yellow: isSelected ? "text-yellow-600" : "text-gray-400",
                purple: isSelected ? "text-purple-600" : "text-gray-400",
              };
              return (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setAccessLevel(level.value as typeof accessLevel)}
                  className={`p-4 rounded-xl border-2 text-center transition-colors ${
                    colorClasses[level.color as keyof typeof colorClasses] ||
                    "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${iconColors[level.color as keyof typeof iconColors]}`} />
                  <p className="font-medium text-gray-900">{level.label}</p>
                  <p className="text-xs text-gray-500">{level.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing & Billing */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Pricing & Billing</h2>

          {/* Billing Period */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Billing Period</label>
            <div className="grid grid-cols-3 gap-3">
              {billingOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setBillingPeriod(option.value as typeof billingPeriod)}
                  className={`p-3 rounded-xl border-2 text-left transition-colors ${
                    billingPeriod === option.value
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium text-gray-900">{option.label}</p>
                  <p className="text-xs text-gray-500">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  /{billingPeriod === "one-time" ? "once" : billingPeriod === "monthly" ? "mo" : "yr"}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Compare at Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={compareAtPrice || ""}
                  onChange={(e) => setCompareAtPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                  min="0"
                  step="0.01"
                  placeholder="Original price"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Trial Period */}
          {billingPeriod !== "one-time" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Free Trial</label>
              <select
                value={trialDays}
                onChange={(e) => setTrialDays(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value={0}>No free trial</option>
                <option value={3}>3 days</option>
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
              </select>
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Member Benefits</h2>
          <p className="text-sm text-gray-500">What do members get access to?</p>

          <div className="flex gap-2">
            <input
              type="text"
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
              placeholder="e.g., Exclusive content library, Monthly Q&A calls"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addBenefit}
              className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {benefits.length > 0 && (
            <ul className="space-y-2">
              {benefits.map((item, index) => (
                <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="flex items-center gap-2 text-gray-700">
                    <Check className="w-4 h-4 text-purple-500" />
                    {item}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="p-1 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Multiple Tiers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Multiple Tiers</h2>
              <p className="text-sm text-gray-500">Offer different membership levels</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hasMultipleTiers}
                onChange={(e) => setHasMultipleTiers(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          {hasMultipleTiers && (
            <div className="space-y-4">
              {/* Existing Tiers */}
              {tiers.length > 0 && (
                <div className="space-y-3">
                  {tiers.map((tier) => (
                    <div
                      key={tier.id}
                      className="p-4 border border-gray-200 rounded-xl"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{tier.name}</h4>
                          <p className="text-sm text-gray-500">
                            ${tier.price}/{tier.billingPeriod === "one-time" ? "once" : tier.billingPeriod === "monthly" ? "mo" : "yr"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTier(tier.id)}
                          className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {tier.benefits.length > 0 && (
                        <ul className="space-y-1">
                          {tier.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                              <Check className="w-3 h-3 text-purple-500" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add Tier Form */}
              <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={editingTier.name || ""}
                    onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                    placeholder="Tier name"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      value={editingTier.price || ""}
                      onChange={(e) => setEditingTier({ ...editingTier, price: parseFloat(e.target.value) || 0 })}
                      placeholder="Price"
                      min="0"
                      step="0.01"
                      className="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={editingTier.billingPeriod || "monthly"}
                    onChange={(e) => setEditingTier({ ...editingTier, billingPeriod: e.target.value as "monthly" | "yearly" | "one-time" })}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="one-time">Lifetime</option>
                  </select>
                </div>

                {/* Tier Benefits */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTierBenefit}
                      onChange={(e) => setNewTierBenefit(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTierBenefit())}
                      placeholder="Add tier benefit"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addTierBenefit}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {(editingTier.benefits || []).length > 0 && (
                    <ul className="space-y-1">
                      {(editingTier.benefits || []).map((benefit, index) => (
                        <li key={index} className="flex items-center justify-between p-2 bg-white rounded-lg text-sm">
                          <span className="flex items-center gap-2 text-gray-700">
                            <Check className="w-3 h-3 text-purple-500" />
                            {benefit}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeTierBenefit(index)}
                            className="p-0.5 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  type="button"
                  onClick={addTier}
                  disabled={!editingTier.name?.trim()}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Tier
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Publish Status */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <h3 className="font-medium text-gray-900 mb-3">Publish Status</h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={status === "draft"}
                onChange={() => setStatus("draft")}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Save as Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={status === "published"}
                onChange={() => setStatus("published")}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Publish Immediately</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Link
            href="/dashboard/products/new"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !shortDescription.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Create Membership
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
