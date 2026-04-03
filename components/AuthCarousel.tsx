"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles, CalendarHeart, GraduationCap, Video, Users, Mic } from "lucide-react";

interface Slide {
  id: string;
  image: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const slides: Slide[] = [
  {
    id: "creators",
    // African creator working/smiling
    image: "https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?q=80&w=1080",
    title: "Empower Your Creativity",
    description: "Launch your storefront in minutes. Sell digital products, memberships, and exclusive content directly to your fans.",
    icon: <Sparkles className="w-6 h-6 text-yellow-400" />,
  },
  {
    id: "events",
    // African conference attendees
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1080",
    title: "Host Memorable Events",
    description: "Whether in-person, hybrid, or virtual. Sell tickets, manage RSVPs, and create unforgettable experiences securely.",
    icon: <CalendarHeart className="w-6 h-6 text-cyan-600" />,
  },
  {
    id: "classes",
    // African teacher giving online class.
    image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=1080",
    title: "Teach & Inspire",
    description: "Offer online masterclasses and courses. Setup seamless checkout and beautifully crafted landing pages for your students.",
    icon: <GraduationCap className="w-6 h-6 text-blue-400" />,
  },
  {
    id: "streamer",
    // African social media streamer
    image: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?q=80&w=1080",
    title: "Monetize Your Audience",
    description: "Turn your passion into a business. Engage with your audience through premium streams and exclusive communities.",
    icon: <Video className="w-6 h-6 text-purple-400" />,
  },
  {
    id: "community",
    // African community
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1080",
    title: "Build Your Community",
    description: "Create paid memberships and subscription tiers. Give your biggest supporters VIP access to your best content.",
    icon: <Users className="w-6 h-6 text-emerald-400" />,
  },
  {
    id: "podcast",
    // African podcaster/speaker
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1080",
    title: "Share Your Voice",
    description: "Upload and sell your digital audio, premium podcasts, and exclusive interviews behind a seamless paywall.",
    icon: <Mic className="w-6 h-6 text-orange-400" />,
  },
];

export default function AuthCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => {
        if (current >= slides.length - 1) return 0;
        return current + 1;
      });
    }, 5000); // 5 seconds per slide
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative hidden lg:flex flex-col flex-1 h-full w-full bg-blue-950 overflow-hidden shadow-2xl">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover opacity-60"
              priority={index === 0}
            />
          </div>
        </div>
      ))}

      {/* Content Container positioned at the bottom */}
      <div className="relative z-20 flex flex-col justify-end h-full p-12 lg:p-16">
        <div className="max-w-md">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`transition-all duration-700 ease-in-out absolute bottom-24 ${
                index === activeIndex
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8 pointer-events-none"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
                  {slide.icon}
                </div>
                <span className="text-white/80 font-medium tracking-wide uppercase text-sm">
                  Sublime
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                {slide.title}
              </h2>
              <p className="text-lg text-blue-100">
                {slide.description}
              </p>
            </div>
          ))}

          {/* Navigation Dots */}
          <div className="flex items-center gap-3 mt-48">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`transition-all duration-300 rounded-full h-1.5 ${
                  index === activeIndex ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
