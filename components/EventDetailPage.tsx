"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  Share2,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShoppingCart,
  LogIn,
  Globe,
  Ticket,
  User,
  Mail,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import { storage, type Product, type StorefrontSettings, type Customer, type EventDetails } from "@/lib/storage";

interface EventDetailPageProps {
  product: Product;
  settings: StorefrontSettings;
  customer: Customer | null;
  slug: string;
  cartCount: number;
  onCartUpdate: (count: number) => void;
}

export default function EventDetailPage({
  product,
  settings,
  customer,
  slug,
  cartCount,
  onCartUpdate,
}: EventDetailPageProps) {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(
    product.eventDetails?.ticketTypes?.[0]?.id || null
  );
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isRsvping, setIsRsvping] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const eventDetails = product.eventDetails as EventDetails;
  const { navbar, footer } = settings;

  // Format date for display
  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time for display
  const formatEventTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Get timezone abbreviation
  const getTimezoneAbbr = (tz: string) => {
    const tzMap: Record<string, string> = {
      "America/New_York": "ET",
      "America/Chicago": "CT",
      "America/Denver": "MT",
      "America/Los_Angeles": "PT",
      "America/Phoenix": "AZ",
      "Europe/London": "GMT",
      "Europe/Paris": "CET",
      "Asia/Tokyo": "JST",
      "Asia/Shanghai": "CST",
      "Australia/Sydney": "AEST",
    };
    return tzMap[tz] || tz;
  };

  // Get selected ticket details
  const getSelectedTicketDetails = () => {
    return eventDetails?.ticketTypes?.find((t) => t.id === selectedTicket);
  };

  // Handle share
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.shortDescription || product.description,
          url,
        });
      } catch {
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

  // Handle RSVP / Add to cart
  const handleRsvp = () => {
    if (!selectedTicket) return;

    setIsRsvping(true);
    
    // Add to cart with ticket info
    storage.addToCart(product.id, ticketQuantity);
    onCartUpdate(storage.getCartItemCount());
    
    setRsvpSuccess(true);
    setTimeout(() => {
      setRsvpSuccess(false);
      setIsRsvping(false);
    }, 2000);
  };

  // Check if event is in the past
  const isEventPast = () => {
    if (!eventDetails?.startDate) return false;
    const eventDate = new Date(eventDetails.startDate);
    return eventDate < new Date();
  };

  // Calculate spots left
  const getSpotsLeft = () => {
    if (!eventDetails?.maxAttendees) return null;
    return eventDetails.maxAttendees - (eventDetails.currentAttendees || 0);
  };

  // Get ticket price display
  const getTicketPriceDisplay = (price: number) => {
    if (price === 0) return "Free";
    return `$${price.toFixed(2)}`;
  };

  const selectedTicketDetails = getSelectedTicketDetails();
  const spotsLeft = getSpotsLeft();
  const isPast = isEventPast();

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

      {/* Hero Image */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[28rem]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Share button */}
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white transition-colors shadow-lg"
          title="Share event"
        >
          {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
        </button>
        
        {/* Back button */}
        <Link
          href={`/store/${slug}`}
          className="absolute top-4 left-4 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white transition-colors shadow-lg text-sm font-medium"
        >
          ← Back to Store
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Header Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              {/* Event Type Badge */}
              <div className="flex items-center gap-2 mb-4">
                {eventDetails?.eventType === "virtual" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                    <Video className="w-4 h-4" />
                    Virtual Event
                  </span>
                ) : eventDetails?.eventType === "hybrid" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                    <Globe className="w-4 h-4" />
                    Hybrid Event
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                    <MapPin className="w-4 h-4" />
                    In-Person
                  </span>
                )}
                
                {isPast && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                    Past Event
                  </span>
                )}
              </div>

              {/* Event Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                {product.title}
              </h1>

              {/* Date & Time */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {eventDetails?.startDate && formatEventDate(eventDetails.startDate)}
                    </p>
                    {eventDetails?.endDate && eventDetails.endDate !== eventDetails.startDate && (
                      <p className="text-sm text-gray-500">
                        to {formatEventDate(eventDetails.endDate)}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {eventDetails?.startTime && formatEventTime(eventDetails.startTime)}
                      {eventDetails?.endTime && ` - ${formatEventTime(eventDetails.endTime)}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {eventDetails?.timezone && getTimezoneAbbr(eventDetails.timezone)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Registered count */}
              {eventDetails?.currentAttendees && eventDetails.currentAttendees > 0 && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">{eventDetails.currentAttendees} people registered</span>
                  {spotsLeft !== null && spotsLeft > 0 && (
                    <span className="text-orange-600">· {spotsLeft} spots left</span>
                  )}
                </div>
              )}
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this event</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Speakers Section */}
            {eventDetails?.speakers && eventDetails.speakers.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Speakers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {eventDetails.speakers.map((speaker, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-xl bg-gray-50"
                    >
                      {speaker.image ? (
                        <Image
                          src={speaker.image}
                          alt={speaker.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                          {speaker.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">{speaker.name}</h3>
                        <p className="text-sm text-blue-600 mb-2">{speaker.title}</p>
                        {speaker.bio && (
                          <p className="text-sm text-gray-500 line-clamp-2">{speaker.bio}</p>
                        )}
                        {speaker.socialLinks && speaker.socialLinks.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            {speaker.socialLinks.map((link, linkIndex) => (
                              <a
                                key={linkIndex}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {link.platform === "twitter" && <Twitter className="w-4 h-4" />}
                                {link.platform === "linkedin" && <Linkedin className="w-4 h-4" />}
                                {link.platform === "instagram" && <Instagram className="w-4 h-4" />}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agenda Section */}
            {eventDetails?.agenda && eventDetails.agenda.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Agenda</h2>
                <div className="space-y-4">
                  {eventDetails.agenda.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-20 text-center">
                        <span className="text-sm font-semibold text-blue-600">
                          {item.time}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        )}
                        {item.speaker && (
                          <p className="text-sm text-blue-600 mt-1">
                            <User className="w-3 h-3 inline mr-1" />
                            {item.speaker}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Section */}
            {(eventDetails?.eventType === "in-person" || eventDetails?.eventType === "hybrid") &&
              eventDetails?.venue && (
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{eventDetails.venue.name}</h3>
                      <p className="text-gray-600">
                        {eventDetails.venue.address}
                        <br />
                        {eventDetails.venue.city}, {eventDetails.venue.state} {eventDetails.venue.zipCode}
                        <br />
                        {eventDetails.venue.country}
                      </p>
                      {eventDetails.venue.googleMapsUrl && (
                        <a
                          href={eventDetails.venue.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 mt-2 text-sm font-medium"
                        >
                          Open in Google Maps
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Embedded Map */}
                  {eventDetails.venue.googleMapsUrl && (
                    <div className="mt-6 rounded-xl overflow-hidden border border-gray-200 h-64 bg-gray-100">
                      <iframe
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(
                          `${eventDetails.venue.address}, ${eventDetails.venue.city}, ${eventDetails.venue.state}`
                        )}&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  )}
                </div>
              )}

            {/* Virtual Event Link */}
            {(eventDetails?.eventType === "virtual" || eventDetails?.eventType === "hybrid") &&
              eventDetails?.virtualLink && (
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">How to Join</h2>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Video className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 mb-3">
                        This event will be hosted on{" "}
                        <span className="font-medium capitalize">
                          {eventDetails.virtualPlatform?.replace("-", " ") || "a virtual platform"}
                        </span>
                        . The link will be available after registration.
                      </p>
                      {customer && (
                        <a
                          href={eventDetails.virtualLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                        >
                          <Video className="w-4 h-4" />
                          Join Event
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* FAQs Section */}
            {eventDetails?.faqs && eventDetails.faqs.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {eventDetails.faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setExpandedFaq(expandedFaq === `faq-${index}` ? null : `faq-${index}`)
                        }
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {expandedFaq === `faq-${index}` ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      {expandedFaq === `faq-${index}` && (
                        <div className="px-4 pb-4 text-gray-600">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {(eventDetails?.refundPolicy ||
              eventDetails?.ageRestriction ||
              eventDetails?.dressCode ||
              eventDetails?.accessibilityInfo) && (
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Additional Information</h2>
                <div className="space-y-4">
                  {eventDetails.refundPolicy && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Refund Policy</h3>
                      <p className="text-gray-600 text-sm">{eventDetails.refundPolicy}</p>
                    </div>
                  )}
                  {eventDetails.ageRestriction && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Age Restriction</h3>
                      <p className="text-gray-600 text-sm">{eventDetails.ageRestriction}</p>
                    </div>
                  )}
                  {eventDetails.dressCode && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Dress Code</h3>
                      <p className="text-gray-600 text-sm">{eventDetails.dressCode}</p>
                    </div>
                  )}
                  {eventDetails.accessibilityInfo && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Accessibility</h3>
                      <p className="text-gray-600 text-sm">{eventDetails.accessibilityInfo}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Ticket Selection */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {isPast ? "Event Has Ended" : "Get Tickets"}
                </h2>

                {!isPast && eventDetails?.ticketTypes && eventDetails.ticketTypes.length > 0 ? (
                  <>
                    {/* Ticket Types */}
                    <div className="space-y-3 mb-6">
                      {eventDetails.ticketTypes.map((ticket) => {
                        const isSoldOut =
                          ticket.maxQuantity !== undefined &&
                          ticket.soldCount >= ticket.maxQuantity;
                        const isSelected = selectedTicket === ticket.id;

                        return (
                          <button
                            key={ticket.id}
                            onClick={() => !isSoldOut && setSelectedTicket(ticket.id)}
                            disabled={isSoldOut}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                              isSelected
                                ? "border-blue-600 bg-blue-50"
                                : isSoldOut
                                ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-1">
                              <span className="font-semibold text-gray-900">
                                {ticket.name}
                              </span>
                              <span
                                className={`font-bold ${
                                  ticket.price === 0 ? "text-green-600" : "text-gray-900"
                                }`}
                              >
                                {getTicketPriceDisplay(ticket.price)}
                              </span>
                            </div>
                            {ticket.description && (
                              <p className="text-sm text-gray-500 mb-2">
                                {ticket.description}
                              </p>
                            )}
                            {ticket.benefits && ticket.benefits.length > 0 && (
                              <ul className="space-y-1">
                                {ticket.benefits.map((benefit, i) => (
                                  <li
                                    key={i}
                                    className="flex items-center gap-2 text-sm text-gray-600"
                                  >
                                    <Check className="w-4 h-4 text-green-500" />
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {isSoldOut && (
                              <span className="inline-block mt-2 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                                Sold Out
                              </span>
                            )}
                            {!isSoldOut && ticket.maxQuantity && (
                              <span className="inline-block mt-2 text-xs text-gray-500">
                                {ticket.maxQuantity - ticket.soldCount} remaining
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Quantity Selector */}
                    {selectedTicketDetails && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                            className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-300 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium text-lg">
                            {ticketQuantity}
                          </span>
                          <button
                            onClick={() => setTicketQuantity(ticketQuantity + 1)}
                            className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-300 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Total */}
                    {selectedTicketDetails && (
                      <div className="flex items-center justify-between py-4 border-t border-gray-200 mb-6">
                        <span className="font-medium text-gray-700">Total</span>
                        <span className="text-2xl font-bold text-gray-900">
                          {selectedTicketDetails.price === 0
                            ? "Free"
                            : `$${(selectedTicketDetails.price * ticketQuantity).toFixed(2)}`}
                        </span>
                      </div>
                    )}

                    {/* RSVP Button */}
                    <button
                      onClick={handleRsvp}
                      disabled={!selectedTicket || isRsvping || rsvpSuccess}
                      className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                        rsvpSuccess
                          ? "bg-green-600 text-white"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {rsvpSuccess ? (
                        <span className="flex items-center justify-center gap-2">
                          <Check className="w-5 h-5" />
                          Added to Cart!
                        </span>
                      ) : selectedTicketDetails?.price === 0 ? (
                        "Register for Free"
                      ) : (
                        "Get Tickets"
                      )}
                    </button>

                    {/* Or checkout directly */}
                    {selectedTicket && !rsvpSuccess && (
                      <Link
                        href={`/store/${slug}/checkout?product=${product.id}&qty=${ticketQuantity}`}
                        className="block w-full mt-3 py-3 text-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                      >
                        Checkout Now →
                      </Link>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Ticket className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">
                      {isPast
                        ? "This event has already taken place."
                        : "No tickets available for this event."}
                    </p>
                  </div>
                )}

                {/* Hosted by */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Hosted by</p>
                  <Link
                    href={`/store/${slug}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {footer.storeName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {footer.storeName}
                      </p>
                      {footer.supportEmail && (
                        <p className="text-sm text-gray-500">{footer.supportEmail}</p>
                      )}
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
