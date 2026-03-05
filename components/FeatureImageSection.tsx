'use client';
import { motion } from 'motion/react';

import Image from 'next/image';

export default function FeatureImageSection() {
  return (
    <section className="py-24 bg-[#0B1B3D] text-white relative overflow-hidden min-h-[600px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image 
          src="https://picsum.photos/seed/tablet/1920/1080" 
          alt="Sublime Dashboard" 
          fill 
          className="object-cover opacity-30" 
          referrerPolicy="no-referrer" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1B3D] via-[#0B1B3D]/90 to-[#0B1B3D]/60" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-blue-200 bg-blue-900/30 rounded-full border border-blue-800">
            What is Sublime?
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            One link.<br />Everything you sell.
          </h2>
          <p className="text-lg text-blue-100/80 mb-6 leading-relaxed">
            Sublime is a commerce platform built for people who create. You get a clean, branded storefront at <span className="text-white font-medium">sublime.to/yourname</span>, a checkout that handles payments automatically, and the tools to understand how your business is growing — all without touching a single line of code or spending weeks setting things up.
          </p>
          <p className="text-lg text-blue-100/80 leading-relaxed">
            Whether you sell courses, templates, coaching sessions, or digital downloads, Sublime turns what you know and create into a business you actually own.
          </p>
        </div>
      </div>
    </section>
  );
}
