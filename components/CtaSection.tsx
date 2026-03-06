'use client';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function CtaSection() {
  return (
    <section className="py-24 bg-[#0B1B3D] relative overflow-hidden text-center">
      {/* Glowing background lines */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="w-[800px] h-[800px] border border-blue-500/30 rounded-full absolute"></div>
        <div className="w-[600px] h-[600px] border border-blue-400/20 rounded-full absolute"></div>
        <div className="w-[400px] h-[400px] border border-blue-300/10 rounded-full absolute"></div>
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Your store is one decision away.
        </h2>
        <p className="text-xl text-blue-100/80 mb-10 leading-relaxed">
          Stop planning. Start selling. Sublime gets you live today with everything you need to build a real business from what you create.
        </p>
        <Link 
          href="/register"
          className="inline-block px-10 py-4 text-lg font-bold text-white bg-[#0052FF] rounded-full hover:bg-blue-600 transition-colors shadow-[0_0_20px_rgba(0,82,255,0.4)]"
        >
          Create your free store
        </Link>
        <p className="mt-6 text-sm text-blue-200/60">
          No setup fees. No monthly cost to start.<br />Your first sale could be today.
        </p>
      </div>
    </section>
  );
}
