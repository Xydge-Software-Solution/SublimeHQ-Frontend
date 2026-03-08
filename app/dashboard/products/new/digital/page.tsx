"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Upload,
  Trash2,
  Plus,
  Check,
  Loader2,
  File,
  Download,
} from "lucide-react";
import { storage, type Product, type DigitalDetails } from "@/lib/storage";

export default function NewDigitalProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Basic Info
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState("");

  // Digital Product Details
  const [fileType, setFileType] = useState("pdf");
  const [fileSize, setFileSize] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"instant" | "email">("instant");
  const [downloadLimit, setDownloadLimit] = useState<number | undefined>(undefined);
  const [contents, setContents] = useState<string[]>([]);
  const [newContent, setNewContent] = useState("");
  const [version, setVersion] = useState("");
  const [updates, setUpdates] = useState<"lifetime" | "limited" | "none">("lifetime");
  const [systemRequirements, setSystemRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");

  // Product File
  const [productFile, setProductFile] = useState<string>("");
  const [productFileName, setProductFileName] = useState<string>("");
  const [productFileSize, setProductFileSize] = useState<string>("");
  const [isUploadingFile, setIsUploadingFile] = useState(false);

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

  const handleProductFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Max file size 500MB for digital products
      if (file.size > 500 * 1024 * 1024) {
        alert("File must be less than 500MB");
        return;
      }
      setIsUploadingFile(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setProductFile(event.target?.result as string);
        setProductFileName(file.name);
        // Format file size
        const sizeInMB = file.size / (1024 * 1024);
        if (sizeInMB >= 1) {
          setProductFileSize(`${sizeInMB.toFixed(2)} MB`);
          setFileSize(`${sizeInMB.toFixed(2)} MB`);
        } else {
          const sizeInKB = file.size / 1024;
          setProductFileSize(`${sizeInKB.toFixed(2)} KB`);
          setFileSize(`${sizeInKB.toFixed(2)} KB`);
        }
        setIsUploadingFile(false);
      };
      reader.onerror = () => {
        alert("Error reading file");
        setIsUploadingFile(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProductFile = () => {
    setProductFile("");
    setProductFileName("");
    setProductFileSize("");
  };

  const addContent = () => {
    if (newContent.trim()) {
      setContents([...contents, newContent.trim()]);
      setNewContent("");
    }
  };

  const removeContent = (index: number) => {
    setContents(contents.filter((_, i) => i !== index));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setSystemRequirements([...systemRequirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setSystemRequirements(systemRequirements.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !shortDescription.trim()) {
      alert("Please fill in the required fields");
      return;
    }

    setIsSubmitting(true);

    const digitalDetails: DigitalDetails = {
      fileType,
      fileSize: fileSize || undefined,
      fileUrl: productFile || undefined,
      fileName: productFileName || undefined,
      downloadLimit,
      deliveryMethod,
      contents: contents.length > 0 ? contents : undefined,
      systemRequirements: systemRequirements.length > 0 ? systemRequirements : undefined,
      version: version || undefined,
      updates,
    };

    const newProduct: Omit<Product, "id" | "createdAt" | "sales"> = {
      type: "digital",
      title,
      description,
      shortDescription,
      price,
      compareAtPrice,
      image: image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
      rating: 0,
      reviewCount: 0,
      status,
      category: category || undefined,
      digitalDetails,
    };

    storage.addProduct(newProduct);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    router.push("/dashboard/products");
  };

  const fileTypes = [
    { value: "pdf", label: "PDF Document" },
    { value: "zip", label: "ZIP Archive" },
    { value: "mp3", label: "Audio (MP3)" },
    { value: "epub", label: "E-book (ePub)" },
    { value: "psd", label: "Photoshop (PSD)" },
    { value: "ai", label: "Illustrator (AI)" },
    { value: "figma", label: "Figma File" },
    { value: "xlsx", label: "Excel Spreadsheet" },
    { value: "docx", label: "Word Document" },
    { value: "other", label: "Other" },
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
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Digital Product</h1>
            <p className="text-gray-500">E-books, templates, software, and downloadable content</p>
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
                  <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
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
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete E-book Bundle, Premium Template Pack"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              placeholder="Brief one-line description"
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
              placeholder="Detailed description of your product..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="ebook">E-book</option>
              <option value="template">Template</option>
              <option value="preset">Preset / Filter</option>
              <option value="software">Software / App</option>
              <option value="audio">Audio / Music</option>
              <option value="graphics">Graphics / Design</option>
              <option value="spreadsheet">Spreadsheet / Tool</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>

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
                  placeholder="Original price for sale display"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* File Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <File className="w-5 h-5 text-gray-400" />
            File Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {fileTypes.map((ft) => (
                  <option key={ft.value} value={ft.value}>{ft.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">File Size</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="e.g., 25 MB, 1.2 GB"
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
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g., 1.0, 2024 Edition"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Updates</label>
              <select
                value={updates}
                onChange={(e) => setUpdates(e.target.value as typeof updates)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="lifetime">Lifetime Free Updates</option>
                <option value="limited">Limited Updates (1 year)</option>
                <option value="none">No Future Updates</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product File Upload */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Upload className="w-5 h-5 text-gray-400" />
            Product File <span className="text-red-500">*</span>
          </h2>
          <p className="text-sm text-gray-500">Upload the actual file customers will receive after purchase</p>

          {productFile ? (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <File className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{productFileName}</p>
                    <p className="text-sm text-gray-500">{productFileSize}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeProductFile}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
              isUploadingFile 
                ? "border-blue-400 bg-blue-50" 
                : "border-gray-300 hover:border-blue-500 hover:bg-blue-50/50"
            }`}>
              {isUploadingFile ? (
                <>
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                  <span className="text-sm text-blue-600 font-medium">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    <span className="font-medium text-blue-600">Click to upload</span> your product file
                  </span>
                  <span className="text-xs text-gray-400 mt-1">Max 500MB • PDF, ZIP, MP3, and more</span>
                </>
              )}
              <input
                type="file"
                className="hidden"
                onChange={handleProductFileUpload}
                disabled={isUploadingFile}
              />
            </label>
          )}
        </div>

        {/* Delivery */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Download className="w-5 h-5 text-gray-400" />
            Delivery Settings
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Method</label>
              <select
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value as "instant" | "email")}
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
                onChange={(e) => setDownloadLimit(e.target.value ? parseInt(e.target.value) : undefined)}
                min="1"
                placeholder="Unlimited"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Contents */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">What&apos;s Included</h2>
          <p className="text-sm text-gray-500">List what customers will receive</p>

          <div className="flex gap-2">
            <input
              type="text"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addContent())}
              placeholder="e.g., 50+ page e-book, 10 bonus templates"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addContent}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {contents.length > 0 && (
            <ul className="space-y-2">
              {contents.map((item, index) => (
                <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="flex items-center gap-2 text-gray-700">
                    <Check className="w-4 h-4 text-green-500" />
                    {item}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeContent(index)}
                    className="p-1 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* System Requirements */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">System Requirements (Optional)</h2>
          <p className="text-sm text-gray-500">List any software or hardware requirements</p>

          <div className="flex gap-2">
            <input
              type="text"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
              placeholder="e.g., Adobe Photoshop CC 2020+, Windows 10"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addRequirement}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {systemRequirements.length > 0 && (
            <ul className="space-y-2">
              {systemRequirements.map((req, index) => (
                <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="p-1 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
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
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Save as Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={status === "published"}
                onChange={() => setStatus("published")}
                className="text-blue-600 focus:ring-blue-500"
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
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Create Product
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
