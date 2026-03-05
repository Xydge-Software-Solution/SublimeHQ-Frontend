'use client';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-[#1D89E4] to-[#87CEEB] min-h-screen flex flex-col items-center">
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div
          className="mx-auto w-fit px-4 py-1.5 mb-6 text-sm font-medium text-gray-700 bg-white/50 rounded-full backdrop-blur-md border border-white/40 shadow-sm"
        >
          The creator commerce platform
        </div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6"
        >
          From idea to income.<br />In minutes, not months.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-800 mb-10 max-w-3xl mx-auto"
        >
          Sublime is the fastest way for creators, solopreneurs, and digital sellers to launch a storefront, sell their products, and get paid — without the setup headache.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
        >
          <button className="px-8 py-3.5 text-base font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors w-full sm:w-auto">
            Start selling for free
          </button>
          <button className="px-8 py-3.5 text-base font-medium text-gray-900 bg-transparent border border-gray-900 rounded-full hover:bg-gray-900/5 transition-colors w-full sm:w-auto">
            See how it works
          </button>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-600 italic"
        >
          No credit card. No tutorials. No tech team required.
        </motion.p>
      </div>

      {/* Placeholder for App UI */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-10 w-full max-w-5xl mx-auto mt-16 px-6"
      >
        <div className="aspect-[16/9] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Mock UI inside */}
          <div className="w-full h-12 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="p-8 h-full bg-gray-50/50">
            {/* Empty state for now */}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
