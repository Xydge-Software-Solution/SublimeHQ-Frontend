"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  Video,
  Users,
  Clock,
  Ticket,
  Plus,
  Trash2,
  Upload,
  Check,
  Globe,
  Info,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { storage, type Product, type EventDetails } from "@/lib/storage";

type EventType = "in-person" | "virtual" | "hybrid";
type Step = 1 | 2 | 3 | 4 | 5;

interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
  maxQuantity: number | undefined;
  benefits: string[];
}

interface AgendaItem {
  id: string;
  time: string;
  title: string;
  description: string;
  speaker: string;
}

interface Speaker {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Phoenix", label: "Arizona Time (AZ)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Central European (CET)" },
  { value: "Asia/Tokyo", label: "Japan (JST)" },
  { value: "Asia/Shanghai", label: "China (CST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

const virtualPlatforms = [
  { value: "zoom", label: "Zoom" },
  { value: "google-meet", label: "Google Meet" },
  { value: "teams", label: "Microsoft Teams" },
  { value: "custom", label: "Custom Link" },
];

export default function NewEventPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Basic Info
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  // Step 2: Event Type & Schedule
  const [eventType, setEventType] = useState<EventType>("in-person");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timezone, setTimezone] = useState("America/New_York");
  const [isMultiDay, setIsMultiDay] = useState(false);

  // Step 2: Location (in-person/hybrid)
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [venueCity, setVenueCity] = useState("");
  const [venueState, setVenueState] = useState("");
  const [venueCountry, setVenueCountry] = useState("United States");
  const [venueZipCode, setVenueZipCode] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");

  // Step 2: Virtual Details (virtual/hybrid)
  const [virtualPlatform, setVirtualPlatform] = useState<"zoom" | "google-meet" | "teams" | "custom">("zoom");
  const [virtualLink, setVirtualLink] = useState("");

  // Step 3: Tickets
  const [tickets, setTickets] = useState<TicketType[]>([
    { id: "1", name: "General Admission", price: 0, description: "", maxQuantity: undefined, benefits: [] },
  ]);
  const [maxAttendees, setMaxAttendees] = useState<number | undefined>(undefined);

  // Step 4: Agenda & Speakers
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  // Step 5: Additional Info
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [refundPolicy, setRefundPolicy] = useState("Full refund available up to 7 days before the event. 50% refund up to 48 hours before. No refunds after that.");
  const [ageRestriction, setAgeRestriction] = useState("");
  const [dressCode, setDressCode] = useState("");
  const [accessibilityInfo, setAccessibilityInfo] = useState("");
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

  const addTicket = () => {
    setTickets([
      ...tickets,
      { id: Date.now().toString(), name: "", price: 0, description: "", maxQuantity: undefined, benefits: [] },
    ]);
  };

  const removeTicket = (id: string) => {
    if (tickets.length > 1) {
      setTickets(tickets.filter((t) => t.id !== id));
    }
  };

  const updateTicket = (id: string, updates: Partial<TicketType>) => {
    setTickets(tickets.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const addAgendaItem = () => {
    setAgenda([
      ...agenda,
      { id: Date.now().toString(), time: "", title: "", description: "", speaker: "" },
    ]);
  };

  const removeAgendaItem = (id: string) => {
    setAgenda(agenda.filter((a) => a.id !== id));
  };

  const updateAgendaItem = (id: string, updates: Partial<AgendaItem>) => {
    setAgenda(agenda.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const addSpeaker = () => {
    setSpeakers([
      ...speakers,
      { id: Date.now().toString(), name: "", title: "", bio: "", image: "" },
    ]);
  };

  const removeSpeaker = (id: string) => {
    setSpeakers(speakers.filter((s) => s.id !== id));
  };

  const updateSpeaker = (id: string, updates: Partial<Speaker>) => {
    setSpeakers(speakers.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const addFaq = () => {
    setFaqs([...faqs, { id: Date.now().toString(), question: "", answer: "" }]);
  };

  const removeFaq = (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  const updateFaq = (id: string, updates: Partial<FAQ>) => {
    setFaqs(faqs.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const validateStep = (currentStep: Step): boolean => {
    switch (currentStep) {
      case 1:
        return title.trim() !== "" && shortDescription.trim() !== "";
      case 2:
        if (!startDate || !startTime) return false;
        if (eventType !== "virtual" && !venueName) return false;
        if (eventType !== "in-person" && !virtualLink) return false;
        return true;
      case 3:
        return tickets.every((t) => t.name.trim() !== "" && t.price >= 0);
      case 4:
        return true; // Optional
      case 5:
        return true; // Optional
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const eventDetails: EventDetails = {
      eventType,
      startDate,
      endDate: isMultiDay ? endDate : undefined,
      startTime,
      endTime,
      timezone,
      venue: eventType !== "virtual" ? {
        name: venueName,
        address: venueAddress,
        city: venueCity,
        state: venueState,
        country: venueCountry,
        zipCode: venueZipCode,
        googleMapsUrl: googleMapsUrl || undefined,
      } : undefined,
      virtualLink: eventType !== "in-person" ? virtualLink : undefined,
      virtualPlatform: eventType !== "in-person" ? virtualPlatform : undefined,
      maxAttendees,
      currentAttendees: 0,
      ticketTypes: tickets.map((t) => ({
        id: t.id,
        name: t.name,
        price: t.price,
        description: t.description || undefined,
        maxQuantity: t.maxQuantity,
        soldCount: 0,
        benefits: t.benefits.filter((b) => b.trim() !== ""),
      })),
      agenda: agenda.length > 0 ? agenda.map((a) => ({
        time: a.time,
        title: a.title,
        description: a.description || undefined,
        speaker: a.speaker || undefined,
      })) : undefined,
      speakers: speakers.length > 0 ? speakers.map((s) => ({
        name: s.name,
        title: s.title,
        bio: s.bio || undefined,
        image: s.image || undefined,
      })) : undefined,
      faqs: faqs.length > 0 ? faqs.filter((f) => f.question && f.answer) : undefined,
      refundPolicy: refundPolicy || undefined,
      ageRestriction: ageRestriction || undefined,
      dressCode: dressCode || undefined,
      accessibilityInfo: accessibilityInfo || undefined,
    };

    const lowestPrice = Math.min(...tickets.map((t) => t.price));

    const newProduct: Omit<Product, "id" | "createdAt" | "sales"> = {
      type: "event",
      title,
      description,
      shortDescription,
      price: lowestPrice,
      image: image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      rating: 0,
      reviewCount: 0,
      status,
      category: category || undefined,
      eventDetails,
    };

    storage.addProduct(newProduct);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    router.push("/dashboard/products");
  };

  const steps = [
    { number: 1, title: "Basic Info" },
    { number: 2, title: "Schedule & Venue" },
    { number: 3, title: "Tickets" },
    { number: 4, title: "Agenda & Speakers" },
    { number: 5, title: "Additional Info" },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12">
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
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Event</h1>
            <p className="text-gray-500">Set up your event with all the details</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step > s.number
                    ? "bg-green-500 text-white"
                    : step === s.number
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > s.number ? <Check className="w-4 h-4" /> : s.number}
              </div>
              <span
                className={`ml-2 text-sm font-medium hidden sm:block ${
                  step >= s.number ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {s.title}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                    step > s.number ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Basic Information</h2>
              <p className="text-sm text-gray-500">Tell us about your event</p>
            </div>

            {/* Event Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Cover Image
              </label>
              {image ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="Event cover" className="w-full h-full object-cover" />
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
                    <span className="font-medium text-purple-600">Click to upload</span> or drag and drop
                  </span>
                  <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (max 5MB)</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Digital Marketing Workshop 2024"
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
                placeholder="A brief one-line description of your event"
                maxLength={150}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">{shortDescription.length}/150 characters</p>
            </div>

            {/* Full Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of your event, what attendees will learn, and why they should attend..."
                rows={5}
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
                <option value="workshop">Workshop</option>
                <option value="webinar">Webinar</option>
                <option value="conference">Conference</option>
                <option value="meetup">Meetup</option>
                <option value="masterclass">Masterclass</option>
                <option value="networking">Networking</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Schedule & Venue */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Schedule & Venue</h2>
              <p className="text-sm text-gray-500">When and where is your event happening?</p>
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Event Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "in-person", label: "In-Person", icon: MapPin, desc: "Physical location" },
                  { value: "virtual", label: "Virtual", icon: Video, desc: "Online only" },
                  { value: "hybrid", label: "Hybrid", icon: Globe, desc: "Both options" },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setEventType(type.value as EventType)}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                      eventType === type.value
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <type.icon className={`w-6 h-6 mb-2 ${eventType === type.value ? "text-purple-600" : "text-gray-400"}`} />
                    <span className={`font-medium text-sm ${eventType === type.value ? "text-purple-600" : "text-gray-900"}`}>
                      {type.label}
                    </span>
                    <span className="text-xs text-gray-400">{type.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="p-4 bg-gray-50 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  Date & Time
                </h3>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isMultiDay}
                    onChange={(e) => setIsMultiDay(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  Multi-day event
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isMultiDay ? "Start Date" : "Date"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                {isMultiDay && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {timezones.map((tz) => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Venue (for in-person and hybrid) */}
            {eventType !== "virtual" && (
              <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Venue Details
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="e.g., Convention Center, Hotel Ballroom"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    placeholder="123 Main Street"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={venueCity}
                      onChange={(e) => setVenueCity(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={venueState}
                      onChange={(e) => setVenueState(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={venueZipCode}
                      onChange={(e) => setVenueZipCode(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={venueCountry}
                      onChange={(e) => setVenueCountry(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link (optional)</label>
                  <input
                    type="url"
                    value={googleMapsUrl}
                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Virtual Details (for virtual and hybrid) */}
            {eventType !== "in-person" && (
              <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Video className="w-4 h-4 text-gray-400" />
                  Virtual Event Details
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                  <select
                    value={virtualPlatform}
                    onChange={(e) => setVirtualPlatform(e.target.value as typeof virtualPlatform)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {virtualPlatforms.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={virtualLink}
                    onChange={(e) => setVirtualLink(e.target.value)}
                    placeholder={virtualPlatform === "zoom" ? "https://zoom.us/j/..." : "Enter meeting link"}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    This link will be shared with attendees after registration
                  </p>
                </div>
              </div>
            )}

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Attendees</label>
              <input
                type="number"
                value={maxAttendees || ""}
                onChange={(e) => setMaxAttendees(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Leave blank for unlimited"
                min="1"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Step 3: Tickets */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Ticket Types</h2>
              <p className="text-sm text-gray-500">Set up your ticket tiers and pricing</p>
            </div>

            <div className="space-y-4">
              {tickets.map((ticket, index) => (
                <div key={ticket.id} className="p-4 bg-gray-50 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-gray-400" />
                      Ticket {index + 1}
                    </h4>
                    {tickets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTicket(ticket.id)}
                        className="p-1 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ticket Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={ticket.name}
                        onChange={(e) => updateTicket(ticket.id, { name: e.target.value })}
                        placeholder="e.g., General Admission, VIP, Early Bird"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          value={ticket.price}
                          onChange={(e) => updateTicket(ticket.id, { price: parseFloat(e.target.value) || 0 })}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Enter 0 for free tickets</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={ticket.description}
                      onChange={(e) => updateTicket(ticket.id, { description: e.target.value })}
                      placeholder="Brief description of what's included"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity Available
                      </label>
                      <input
                        type="number"
                        value={ticket.maxQuantity || ""}
                        onChange={(e) => updateTicket(ticket.id, { maxQuantity: e.target.value ? parseInt(e.target.value) : undefined })}
                        placeholder="Unlimited"
                        min="1"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Benefits (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={ticket.benefits.join(", ")}
                        onChange={(e) => updateTicket(ticket.id, { benefits: e.target.value.split(",").map(b => b.trim()) })}
                        placeholder="e.g., Front row seating, Meet & greet"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addTicket}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-purple-500 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Another Ticket Type
            </button>
          </div>
        )}

        {/* Step 4: Agenda & Speakers */}
        {step === 4 && (
          <div className="space-y-8">
            {/* Agenda */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Event Agenda</h2>
                <p className="text-sm text-gray-500">Add your event schedule (optional)</p>
              </div>

              {agenda.length > 0 && (
                <div className="space-y-3">
                  {agenda.map((item, index) => (
                    <div key={item.id} className="p-4 bg-gray-50 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Session {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeAgendaItem(item.id)}
                          className="p-1 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <input
                            type="time"
                            value={item.time}
                            onChange={(e) => updateAgendaItem(item.id, { time: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                            placeholder="Time"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateAgendaItem(item.id, { title: e.target.value })}
                            placeholder="Session title"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateAgendaItem(item.id, { description: e.target.value })}
                          placeholder="Description (optional)"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="text"
                          value={item.speaker}
                          onChange={(e) => updateAgendaItem(item.id, { speaker: e.target.value })}
                          placeholder="Speaker name (optional)"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={addAgendaItem}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-purple-500 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Agenda Item
              </button>
            </div>

            {/* Speakers */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Speakers / Hosts</h2>
                <p className="text-sm text-gray-500">Add information about your speakers (optional)</p>
              </div>

              {speakers.length > 0 && (
                <div className="space-y-3">
                  {speakers.map((speaker, index) => (
                    <div key={speaker.id} className="p-4 bg-gray-50 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          Speaker {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSpeaker(speaker.id)}
                          className="p-1 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={speaker.name}
                          onChange={(e) => updateSpeaker(speaker.id, { name: e.target.value })}
                          placeholder="Full name"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="text"
                          value={speaker.title}
                          onChange={(e) => updateSpeaker(speaker.id, { title: e.target.value })}
                          placeholder="Title / Role"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <textarea
                        value={speaker.bio}
                        onChange={(e) => updateSpeaker(speaker.id, { bio: e.target.value })}
                        placeholder="Short bio (optional)"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 resize-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={addSpeaker}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-purple-500 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Speaker
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Additional Info */}
        {step === 5 && (
          <div className="space-y-8">
            {/* FAQs */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Frequently Asked Questions</h2>
                <p className="text-sm text-gray-500">Add FAQs to address common attendee questions</p>
              </div>

              {faqs.length > 0 && (
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={faq.id} className="p-4 bg-gray-50 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                          FAQ {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFaq(faq.id)}
                          className="p-1 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq(faq.id, { question: e.target.value })}
                        placeholder="Question"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                      />
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(faq.id, { answer: e.target.value })}
                        placeholder="Answer"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 resize-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={addFaq}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-purple-500 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add FAQ
              </button>
            </div>

            {/* Policies */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Policies & Requirements</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Refund Policy</label>
                <textarea
                  value={refundPolicy}
                  onChange={(e) => setRefundPolicy(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age Restriction</label>
                  <input
                    type="text"
                    value={ageRestriction}
                    onChange={(e) => setAgeRestriction(e.target.value)}
                    placeholder="e.g., 18+, All ages"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dress Code</label>
                  <input
                    type="text"
                    value={dressCode}
                    onChange={(e) => setDressCode(e.target.value)}
                    placeholder="e.g., Business casual, Formal"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accessibility Information
                </label>
                <textarea
                  value={accessibilityInfo}
                  onChange={(e) => setAccessibilityInfo(e.target.value)}
                  placeholder="Information about wheelchair access, sign language interpretation, etc."
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
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
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as Step)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep((step + 1) as Step)}
              disabled={!validateStep(step)}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Create Event
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
