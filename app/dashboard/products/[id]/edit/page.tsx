"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Video,
  Users,
  GraduationCap,
  Crown,
  Calendar,
  Upload,
  Trash2,
  Plus,
  Check,
  Loader2,
  Save,
} from "lucide-react";
import { storage, type Product, type ProductType } from "@/lib/storage";

const typeConfig: Record<ProductType, { label: string; icon: typeof FileText; color: string }> = {
  digital: { label: "Digital Product", icon: FileText, color: "blue" },
  video: { label: "Video", icon: Video, color: "red" },
  coaching: { label: "Coaching", icon: Users, color: "green" },
  course: { label: "Course", icon: GraduationCap, color: "indigo" },
  membership: { label: "Membership", icon: Crown, color: "purple" },
  event: { label: "Event", icon: Calendar, color: "orange" },
};

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("draft");

  // Digital product fields
  const [fileType, setFileType] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"instant" | "email">("instant");
  const [downloadLimit, setDownloadLimit] = useState<number | undefined>(undefined);
  const [contents, setContents] = useState<string[]>([]);
  const [newContent, setNewContent] = useState("");
  const [version, setVersion] = useState("");
  const [updates, setUpdates] = useState<"lifetime" | "limited" | "none">("lifetime");
  const [systemRequirements, setSystemRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");

  // Video product fields
  const [duration, setDuration] = useState("");
  const [format, setFormat] = useState("mp4");
  const [previewUrl, setPreviewUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // Coaching fields
  const [sessionDuration, setSessionDuration] = useState(60);
  const [sessionType, setSessionType] = useState<"one-on-one" | "group">("one-on-one");
  const [deliveryMethods, setDeliveryMethods] = useState<string[]>(["video"]);
  const [bookingNotice, setBookingNotice] = useState(24);
  const [cancellationPolicy, setCancellationPolicy] = useState("");

  // Course fields
  const [skillLevel, setSkillLevel] = useState<"beginner" | "intermediate" | "advanced" | "all-levels">("all-levels");
  const [totalDuration, setTotalDuration] = useState("");
  const [hasCertificate, setHasCertificate] = useState(true);
  const [instructor, setInstructor] = useState("");

  // Membership fields
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly" | "one-time">("monthly");
  const [trialDays, setTrialDays] = useState(0);
  const [accessLevel, setAccessLevel] = useState<"basic" | "premium" | "vip">("premium");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState("");

  // Load product on mount
  useEffect(() => {
    const loadProduct = () => {
      const products = storage.getProducts();
      const found = products.find((p) => p.id === productId);
      
      if (found) {
        setProduct(found);
        // Set basic fields
        setTitle(found.title);
        setShortDescription(found.shortDescription || "");
        setDescription(found.description);
        setImage(found.image);
        setPrice(found.price);
        setCompareAtPrice(found.compareAtPrice);
        setCategory(found.category || "");
        setStatus(found.status);

        // Set type-specific fields
        if (found.digitalDetails) {
          setFileType(found.digitalDetails.fileType || "");
          setFileSize(found.digitalDetails.fileSize || "");
          setDeliveryMethod(found.digitalDetails.deliveryMethod || "instant");
          setDownloadLimit(found.digitalDetails.downloadLimit);
          setContents(found.digitalDetails.contents || []);
          setVersion(found.digitalDetails.version || "");
          setUpdates(found.digitalDetails.updates || "lifetime");
          setSystemRequirements(found.digitalDetails.systemRequirements || []);
        }

        if (found.videoDetails) {
          setDuration(found.videoDetails.duration || "");
          setFormat(found.videoDetails.format || "mp4");
          setPreviewUrl(found.videoDetails.previewUrl || "");
          setVideoUrl(found.videoDetails.videoUrl || "");
        }

        if (found.coachingDetails) {
          setSessionDuration(found.coachingDetails.sessionDuration);
          setSessionType(found.coachingDetails.sessionType);
          setDeliveryMethods(found.coachingDetails.deliveryMethod || ["video"]);
          setBookingNotice(found.coachingDetails.bookingNotice || 24);
          setCancellationPolicy(found.coachingDetails.cancellationPolicy || "");
        }

        if (found.courseDetails) {
          setSkillLevel(found.courseDetails.skillLevel || "all-levels");
          setTotalDuration(found.courseDetails.totalDuration || "");
          setHasCertificate(found.courseDetails.certificate ?? true);
          setInstructor(found.courseDetails.instructor || "");
        }

        if (found.membershipDetails) {
          setBillingPeriod(found.membershipDetails.billingPeriod);
          setTrialDays(found.membershipDetails.trialDays || 0);
          setAccessLevel((found.membershipDetails.accessLevel as typeof accessLevel) || "premium");
          setBenefits(found.membershipDetails.benefits || []);
        }
      }
      setIsLoading(false);
    };

    loadProduct();
  }, [productId]);

  // Track changes - compute directly without effect to avoid setState in effect
  const computedHasChanges = product ? (
    title !== product.title ||
    shortDescription !== (product.shortDescription || "") ||
    description !== product.description ||
    price !== product.price ||
    status !== product.status ||
    category !== (product.category || "") ||
    image !== product.image
  ) : false;

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

  const addContent = () => {
    if (newContent.trim()) {
      setContents([...contents, newContent.trim()]);
      setNewContent("");
      setHasChanges(true);
    }
  };

  const removeContent = (index: number) => {
    setContents(contents.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setSystemRequirements([...systemRequirements, newRequirement.trim()]);
      setNewRequirement("");
      setHasChanges(true);
    }
  };

  const removeRequirement = (index: number) => {
    setSystemRequirements(systemRequirements.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
      setHasChanges(true);
    }
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const toggleDeliveryMethod = (method: string) => {
    if (deliveryMethods.includes(method)) {
      if (deliveryMethods.length > 1) {
        setDeliveryMethods(deliveryMethods.filter((m) => m !== method));
        setHasChanges(true);
      }
    } else {
      setDeliveryMethods([...deliveryMethods, method]);
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !product) return;

    setIsSaving(true);

    const updatedProduct: Product = {
      ...product,
      title,
      shortDescription: shortDescription || undefined,
      description,
      image,
      price,
      compareAtPrice,
      category: category || undefined,
      status,
    };

    // Update type-specific details
    if (product.type === "digital") {
      updatedProduct.digitalDetails = {
        fileType,
        fileSize: fileSize || undefined,
        deliveryMethod,
        downloadLimit,
        contents: contents.length > 0 ? contents : undefined,
        systemRequirements: systemRequirements.length > 0 ? systemRequirements : undefined,
        version: version || undefined,
        updates,
      };
    }

    if (product.type === "video") {
      updatedProduct.videoDetails = {
        duration: duration || undefined,
        format: format || undefined,
        previewUrl: previewUrl || undefined,
        videoUrl: videoUrl || undefined,
      };
    }

    if (product.type === "coaching") {
      updatedProduct.coachingDetails = {
        sessionDuration,
        sessionType,
        deliveryMethod: deliveryMethods,
        bookingNotice,
        cancellationPolicy: cancellationPolicy || undefined,
      };
    }

    if (product.type === "course") {
      updatedProduct.courseDetails = {
        ...product.courseDetails,
        skillLevel,
        totalDuration: totalDuration || undefined,
        certificate: hasCertificate,
        instructor: instructor || undefined,
      };
    }

    if (product.type === "membership") {
      updatedProduct.membershipDetails = {
        billingPeriod,
        trialDays: trialDays > 0 ? trialDays : undefined,
        benefits: benefits.length > 0 ? benefits : undefined,
        accessLevel,
      };
    }

    storage.updateProduct(productId, updatedProduct);

    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    setHasChanges(false);
    setProduct(updatedProduct);
  };

  const handlePublish = async () => {
    setStatus("published");
    // Trigger save after status change
    setTimeout(() => {
      handleSave();
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Product not found</h2>
        <p className="text-gray-500 mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/dashboard/products"
          className="text-blue-600 hover:underline"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const config = typeConfig[product.type];
  const Icon = config.icon;

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-${config.color}-100 rounded-xl flex items-center justify-center`}>
              <Icon className={`w-5 h-5 text-${config.color}-600`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit {config.label}</h1>
              <p className="text-gray-500">ID: {product.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {product.status === "draft" && (
              <button
                onClick={handlePublish}
                disabled={isSaving}
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Publish
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving || !(computedHasChanges || hasChanges)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            {image ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Product" className="w-full h-full object-cover" />
                <button
                  onClick={() => setImage("")}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  <span className="font-medium text-blue-600">Click to upload</span>
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
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              maxLength={150}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Type-specific fields */}
        {product.type === "digital" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Digital Product Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                <input
                  type="text"
                  value={fileType}
                  onChange={(e) => { setFileType(e.target.value); setHasChanges(true); }}
                  placeholder="e.g., PDF, ZIP"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File Size</label>
                <input
                  type="text"
                  value={fileSize}
                  onChange={(e) => { setFileSize(e.target.value); setHasChanges(true); }}
                  placeholder="e.g., 25 MB"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Method</label>
                <select
                  value={deliveryMethod}
                  onChange={(e) => { setDeliveryMethod(e.target.value as "instant" | "email"); setHasChanges(true); }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="instant">Instant Download</option>
                  <option value="email">Email Delivery</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Download Limit</label>
                <input
                  type="number"
                  value={downloadLimit || ""}
                  onChange={(e) => { setDownloadLimit(e.target.value ? parseInt(e.target.value) : undefined); setHasChanges(true); }}
                  placeholder="Unlimited"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => { setVersion(e.target.value); setHasChanges(true); }}
                  placeholder="e.g., 1.0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Updates</label>
                <select
                  value={updates}
                  onChange={(e) => { setUpdates(e.target.value as typeof updates); setHasChanges(true); }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="lifetime">Lifetime Free Updates</option>
                  <option value="limited">Limited Updates</option>
                  <option value="none">No Updates</option>
                </select>
              </div>
            </div>

            {/* Contents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What&apos;s Included</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addContent())}
                  placeholder="Add item..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addContent}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {contents.length > 0 && (
                <ul className="space-y-2">
                  {contents.map((item, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        {item}
                      </span>
                      <button onClick={() => removeContent(index)} className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* System Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">System Requirements</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                  placeholder="Add requirement..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {systemRequirements.length > 0 && (
                <ul className="space-y-2">
                  {systemRequirements.map((req, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                      <span>{req}</span>
                      <button onClick={() => removeRequirement(index)} className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {product.type === "video" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Video Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => { setDuration(e.target.value); setHasChanges(true); }}
                  placeholder="e.g., 2h 30m"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <select
                  value={format}
                  onChange={(e) => { setFormat(e.target.value); setHasChanges(true); }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="mp4">MP4</option>
                  <option value="mov">MOV</option>
                  <option value="webm">WebM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview URL</label>
              <input
                type="url"
                value={previewUrl}
                onChange={(e) => { setPreviewUrl(e.target.value); setHasChanges(true); }}
                placeholder="https://..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => { setVideoUrl(e.target.value); setHasChanges(true); }}
                placeholder="https://..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {product.type === "coaching" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Coaching Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Duration (minutes)</label>
                <input
                  type="number"
                  value={sessionDuration}
                  onChange={(e) => { setSessionDuration(parseInt(e.target.value) || 60); setHasChanges(true); }}
                  min="15"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                <select
                  value={sessionType}
                  onChange={(e) => { setSessionType(e.target.value as typeof sessionType); setHasChanges(true); }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="one-on-one">One-on-One</option>
                  <option value="group">Group</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Methods</label>
              <div className="flex flex-wrap gap-2">
                {["video", "phone", "chat", "in-person"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => toggleDeliveryMethod(method)}
                    className={`px-3 py-1.5 rounded-full text-sm capitalize transition-colors ${
                      deliveryMethods.includes(method)
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Booking Notice (hours)</label>
                <input
                  type="number"
                  value={bookingNotice}
                  onChange={(e) => { setBookingNotice(parseInt(e.target.value) || 24); setHasChanges(true); }}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policy</label>
                <input
                  type="text"
                  value={cancellationPolicy}
                  onChange={(e) => { setCancellationPolicy(e.target.value); setHasChanges(true); }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {product.type === "course" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Course Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
                <select
                  value={skillLevel}
                  onChange={(e) => { setSkillLevel(e.target.value as typeof skillLevel); setHasChanges(true); }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all-levels">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Duration</label>
                <input
                  type="text"
                  value={totalDuration}
                  onChange={(e) => { setTotalDuration(e.target.value); setHasChanges(true); }}
                  placeholder="e.g., 12 hours"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => { setInstructor(e.target.value); setHasChanges(true); }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl">
              <input
                type="checkbox"
                id="certificate"
                checked={hasCertificate}
                onChange={(e) => { setHasCertificate(e.target.checked); setHasChanges(true); }}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <label htmlFor="certificate" className="font-medium text-gray-900">
                Certificate of Completion
              </label>
            </div>
          </div>
        )}

        {product.type === "membership" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Membership Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Billing Period</label>
                <select
                  value={billingPeriod}
                  onChange={(e) => { setBillingPeriod(e.target.value as typeof billingPeriod); setHasChanges(true); }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="one-time">Lifetime</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trial Days</label>
                <input
                  type="number"
                  value={trialDays}
                  onChange={(e) => { setTrialDays(parseInt(e.target.value) || 0); setHasChanges(true); }}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
              <select
                value={accessLevel}
                onChange={(e) => { setAccessLevel(e.target.value as typeof accessLevel); setHasChanges(true); }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
                <option value="vip">VIP</option>
              </select>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Member Benefits</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
                  placeholder="Add benefit..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addBenefit}
                  className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {benefits.length > 0 && (
                <ul className="space-y-2">
                  {benefits.map((item, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-purple-500" />
                        {item}
                      </span>
                      <button onClick={() => removeBenefit(index)} className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

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
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={status === "published"}
                onChange={() => setStatus("published")}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Published</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
