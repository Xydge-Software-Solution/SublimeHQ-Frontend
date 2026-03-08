"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Upload,
  Trash2,
  Plus,
  Check,
  Loader2,
  Clock,
  Video,
  Phone,
  MessageSquare,
  MapPin,
} from "lucide-react";
import { storage, type Product, type CoachingDetails } from "@/lib/storage";

interface AvailabilitySlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

export default function NewCoachingProductPage() {
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

  // Coaching Details
  const [sessionDuration, setSessionDuration] = useState(60);
  const [sessionType, setSessionType] = useState<"one-on-one" | "group">("one-on-one");
  const [maxGroupSize, setMaxGroupSize] = useState<number>(5);
  const [deliveryMethods, setDeliveryMethods] = useState<string[]>(["video"]);
  const [bookingNotice, setBookingNotice] = useState(24);
  const [cancellationPolicy, setCancellationPolicy] = useState("24-hour notice required for full refund");
  const [packages, setPackages] = useState<Array<{ sessions: number; price: number; savings: string }>>([]);

  // Availability
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [newSlot, setNewSlot] = useState<Omit<AvailabilitySlot, "id">>({
    day: "Monday",
    startTime: "09:00",
    endTime: "17:00",
  });
  const [timezone, setTimezone] = useState("America/New_York");

  // What's Included
  const [includes, setIncludes] = useState<string[]>([]);
  const [newInclude, setNewInclude] = useState("");

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

  const toggleDeliveryMethod = (method: string) => {
    if (deliveryMethods.includes(method)) {
      if (deliveryMethods.length > 1) {
        setDeliveryMethods(deliveryMethods.filter((m) => m !== method));
      }
    } else {
      setDeliveryMethods([...deliveryMethods, method]);
    }
  };

  const addAvailabilitySlot = () => {
    if (newSlot.day && newSlot.startTime && newSlot.endTime) {
      setAvailability([...availability, { ...newSlot, id: crypto.randomUUID() }]);
    }
  };

  const removeAvailabilitySlot = (id: string) => {
    setAvailability(availability.filter((s) => s.id !== id));
  };

  const addInclude = () => {
    if (newInclude.trim()) {
      setIncludes([...includes, newInclude.trim()]);
      setNewInclude("");
    }
  };

  const removeInclude = (index: number) => {
    setIncludes(includes.filter((_, i) => i !== index));
  };

  const addPackage = () => {
    const lastPackage = packages[packages.length - 1];
    const newSessions = lastPackage ? lastPackage.sessions + 2 : 4;
    const discount = 0.1 + packages.length * 0.05;
    const packagePrice = Math.round(price * newSessions * (1 - discount));
    const savings = `${Math.round(discount * 100)}% off`;
    setPackages([...packages, { sessions: newSessions, price: packagePrice, savings }]);
  };

  const removePackage = (index: number) => {
    setPackages(packages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !shortDescription.trim()) {
      alert("Please fill in the required fields");
      return;
    }

    setIsSubmitting(true);

    const coachingDetails: CoachingDetails = {
      sessionDuration,
      sessionType,
      maxGroupSize: sessionType === "group" ? maxGroupSize : undefined,
      deliveryMethod: deliveryMethods,
      availability: availability.length > 0 ? availability.map((slot) => ({
        day: slot.day,
        startTime: slot.startTime,
        endTime: slot.endTime,
      })) : undefined,
      timezone,
      bookingNotice,
      cancellationPolicy,
    };

    const newProduct: Omit<Product, "id" | "createdAt" | "sales"> = {
      type: "coaching",
      title,
      description,
      shortDescription,
      price,
      compareAtPrice,
      image: image || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop",
      rating: 0,
      reviewCount: 0,
      status,
      category: category || undefined,
      coachingDetails,
    };

    storage.addProduct(newProduct);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    router.push("/dashboard/products");
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const durations = [
    { value: 15, label: "15 min" },
    { value: 30, label: "30 min" },
    { value: 45, label: "45 min" },
    { value: 60, label: "1 hour" },
    { value: 90, label: "1.5 hours" },
    { value: 120, label: "2 hours" },
  ];

  const deliveryOptions = [
    { id: "video", label: "Video Call", icon: Video, desc: "Zoom, Google Meet, etc." },
    { id: "phone", label: "Phone Call", icon: Phone, desc: "Voice call" },
    { id: "chat", label: "Chat/Messaging", icon: MessageSquare, desc: "Text-based" },
    { id: "in-person", label: "In-Person", icon: MapPin, desc: "Meet physically" },
  ];

  const timezones = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "London (GMT)" },
    { value: "Europe/Paris", label: "Central European (CET)" },
    { value: "Asia/Tokyo", label: "Japan (JST)" },
    { value: "Australia/Sydney", label: "Sydney (AEST)" },
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
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Coaching Session</h1>
            <p className="text-gray-500">1-on-1 calls, mentoring, and consultation services</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile / Cover Image</label>
            {image ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Coach" className="w-full h-full object-cover" />
                <button
                  onClick={() => setImage("")}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50/50 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  <span className="font-medium text-green-600">Upload your photo</span>
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
              Session Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Career Strategy Session, Business Mentoring Call"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              placeholder="What will clients get from this session?"
              maxLength={150}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you'll cover, your expertise, and who this is for..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="career">Career Coaching</option>
              <option value="business">Business Consulting</option>
              <option value="life">Life Coaching</option>
              <option value="fitness">Fitness / Health</option>
              <option value="finance">Financial Advisory</option>
              <option value="creative">Creative Direction</option>
              <option value="tech">Tech Mentoring</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Session Type & Duration */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            Session Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSessionType("one-on-one")}
                  className={`p-3 rounded-xl border-2 transition-colors ${
                    sessionType === "one-on-one"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium text-gray-900">1-on-1</p>
                  <p className="text-xs text-gray-500">Private session</p>
                </button>
                <button
                  type="button"
                  onClick={() => setSessionType("group")}
                  className={`p-3 rounded-xl border-2 transition-colors ${
                    sessionType === "group"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium text-gray-900">Group</p>
                  <p className="text-xs text-gray-500">Multiple clients</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select
                value={sessionDuration}
                onChange={(e) => setSessionDuration(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {durations.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>

          {sessionType === "group" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Group Size</label>
              <input
                type="number"
                value={maxGroupSize}
                onChange={(e) => setMaxGroupSize(parseInt(e.target.value) || 5)}
                min="2"
                max="50"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Delivery Method */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Delivery Method</h2>
          <p className="text-sm text-gray-500">Select all that apply</p>

          <div className="grid grid-cols-2 gap-3">
            {deliveryOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = deliveryMethods.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleDeliveryMethod(option.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-colors ${
                    isSelected
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${isSelected ? "text-green-600" : "text-gray-400"}`} />
                  <p className="font-medium text-gray-900">{option.label}</p>
                  <p className="text-xs text-gray-500">{option.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Session <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  placeholder="Original price"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Session Packages */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-900">Session Packages</h3>
                <p className="text-sm text-gray-500">Offer discounts for multiple sessions</p>
              </div>
              <button
                type="button"
                onClick={addPackage}
                disabled={price <= 0}
                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                Add Package
              </button>
            </div>

            {packages.length > 0 && (
              <div className="space-y-2">
                {packages.map((pkg, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <span className="font-medium text-gray-900">{pkg.sessions} Sessions</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-700">${pkg.price}</span>
                      <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        {pkg.savings}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePackage(index)}
                      className="p-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Availability</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <select
                value={newSlot.day}
                onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {days.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <input
                type="time"
                value={newSlot.startTime}
                onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="time"
                value={newSlot.endTime}
                onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              type="button"
              onClick={addAvailabilitySlot}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Time Slot
            </button>
          </div>

          {availability.length > 0 && (
            <div className="space-y-2">
              {availability.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div>
                    <span className="font-medium text-gray-900">{slot.day}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-600">{slot.startTime} - {slot.endTime}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAvailabilitySlot(slot.id)}
                    className="p-1 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Booking Settings</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Booking Notice</label>
              <select
                value={bookingNotice}
                onChange={(e) => setBookingNotice(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value={1}>1 hour advance</option>
                <option value={6}>6 hours advance</option>
                <option value={24}>24 hours advance</option>
                <option value={48}>48 hours advance</option>
                <option value={72}>72 hours advance</option>
                <option value={168}>1 week advance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policy</label>
              <input
                type="text"
                value={cancellationPolicy}
                onChange={(e) => setCancellationPolicy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">What&apos;s Included</h2>
          <p className="text-sm text-gray-500">List what clients will receive</p>

          <div className="flex gap-2">
            <input
              type="text"
              value={newInclude}
              onChange={(e) => setNewInclude(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInclude())}
              placeholder="e.g., Session recording, Action plan document"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addInclude}
              className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {includes.length > 0 && (
            <ul className="space-y-2">
              {includes.map((item, index) => (
                <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="flex items-center gap-2 text-gray-700">
                    <Check className="w-4 h-4 text-green-500" />
                    {item}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeInclude(index)}
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
                className="text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Save as Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={status === "published"}
                onChange={() => setStatus("published")}
                className="text-green-600 focus:ring-green-500"
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
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Create Coaching
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
