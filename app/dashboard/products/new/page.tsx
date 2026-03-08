"use client";

import Link from "next/link";
import { 
  ArrowLeft,
  FileText,
  Calendar,
  Video,
  Users,
  BookOpen,
  Crown,
  ArrowRight,
} from "lucide-react";

const productTypes = [
  {
    id: "digital",
    name: "Digital Product",
    description: "E-books, templates, software, audio files, PDFs, and other downloadable content",
    icon: FileText,
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
    examples: ["E-books", "Templates", "Presets", "Software", "Audio files", "Printables"],
  },
  {
    id: "event",
    name: "Event",
    description: "In-person, virtual, or hybrid events with ticketing and attendee management",
    icon: Calendar,
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600",
    examples: ["Workshops", "Webinars", "Conferences", "Meetups", "Live shows", "Masterclasses"],
  },
  {
    id: "video",
    name: "Video Content",
    description: "Individual videos, tutorials, documentaries, or entertainment content",
    icon: Video,
    color: "bg-red-500",
    lightColor: "bg-red-50",
    textColor: "text-red-600",
    examples: ["Tutorials", "Documentaries", "Entertainment", "Behind-the-scenes", "Vlogs"],
  },
  {
    id: "coaching",
    name: "Coaching / Consultation",
    description: "One-on-one or group coaching sessions with calendar booking integration",
    icon: Users,
    color: "bg-green-500",
    lightColor: "bg-green-50",
    textColor: "text-green-600",
    examples: ["1-on-1 coaching", "Group sessions", "Consultations", "Mentorship", "Advisory"],
  },
  {
    id: "course",
    name: "Online Course",
    description: "Structured learning experience with modules, lessons, and progress tracking",
    icon: BookOpen,
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-600",
    examples: ["Video courses", "Cohort courses", "Mini courses", "Certifications", "Bootcamps"],
  },
  {
    id: "membership",
    name: "Membership / Subscription",
    description: "Recurring access to exclusive content, community, or benefits",
    icon: Crown,
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-600",
    examples: ["Monthly subscription", "Community access", "VIP tier", "Newsletter", "Patreon-style"],
  },
];

export default function NewProductPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Product</h1>
        <p className="text-gray-500 mt-1">
          Choose the type of product you want to create
        </p>
      </div>

      {/* Product Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {productTypes.map((type) => (
          <Link
            key={type.id}
            href={`/dashboard/products/new/${type.id}`}
            className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-lg transition-all"
          >
            {/* Icon */}
            <div className={`w-12 h-12 ${type.lightColor} rounded-xl flex items-center justify-center mb-4`}>
              <type.icon className={`w-6 h-6 ${type.textColor}`} />
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {type.name}
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {type.description}
            </p>

            {/* Examples */}
            <div className="flex flex-wrap gap-2">
              {type.examples.slice(0, 4).map((example) => (
                <span
                  key={example}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                >
                  {example}
                </span>
              ))}
            </div>

            {/* Arrow */}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-5 h-5 text-blue-600" />
            </div>
          </Link>
        ))}
      </div>

      {/* Help Section */}
      <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
        <h3 className="font-semibold text-gray-900 mb-2">Not sure which to choose?</h3>
        <p className="text-gray-600 text-sm">
          Choose <span className="font-medium">Digital Product</span> for simple downloadable content, 
          <span className="font-medium"> Online Course</span> for structured learning, or 
          <span className="font-medium"> Event</span> for live experiences. You can always create multiple 
          products of different types.
        </p>
      </div>
    </div>
  );
}
