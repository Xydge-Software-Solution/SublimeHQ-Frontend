'use client';
import { motion } from 'motion/react';

import Image from 'next/image';

export default function AiSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-purple-600 bg-purple-50 rounded-full border border-purple-100">
            Your AI business partner
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-6">
            Not AI for the sake of AI.<br />AI that actually saves you time.
          </h2>
            <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
              Sublime&apos;s AI sits quietly in the background, doing the work most creators dread. It writes your store copy, drafts your product descriptions, suggests pricing based on your category, and surfaces insights like &quot;your template pack converts better than your course — here&apos;s what that means.&quot;
            </p>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed font-medium">
            It helps you start faster and grow smarter, without getting in your way.
          </p>
        </div>
        <div className="flex-1 w-full">
          <div className="relative w-full h-[350px] md:h-[560px] rounded-[40px] shadow-xl">
            <Image
              src="/robot.png"
              alt="AI Robot"
              fill
              priority
              className=""
              referrerPolicy="no-referrer"
            />
            

            {/* Floating badges */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute right-2 md:-right-4 top-1/4 bg-white text-gray-900 text-xs font-semibold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-10"
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-blue-500 rounded-sm"></div>
                <div className="bg-blue-500 rounded-sm"></div>
                <div className="bg-blue-500 rounded-sm"></div>
                <div className="bg-blue-500 rounded-sm"></div>
              </div>
              Whatever you sell,<br/>there is money to<br/>be made.
            </motion.div>
            <motion.div 
              animate={{ y: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute left-2 md:-left-4 bottom-1/4 bg-white text-gray-900 text-xs font-semibold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-10"
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-purple-500 rounded-sm"></div>
                <div className="bg-purple-500 rounded-sm"></div>
                <div className="bg-purple-500 rounded-sm"></div>
                <div className="bg-purple-500 rounded-sm"></div>
              </div>
              Whatever you sell,<br/>there is money to<br/>be made.
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
