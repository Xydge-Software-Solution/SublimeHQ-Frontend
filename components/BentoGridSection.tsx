'use client';
import { motion } from 'motion/react';
import { Sparkles, LayoutTemplate, ShoppingBag, CreditCard, BarChart3, Users } from 'lucide-react';

export default function BentoGridSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-purple-600 bg-purple-100 rounded-full border border-purple-200">
            Built for the way creators work
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight max-w-2xl">
            Every tool you need.<br />Right where you need it.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          {/* Item 1 */}
          <motion.div 
            className="md:col-span-1 bg-[#D1C4E9] rounded-3xl p-8 flex flex-col justify-between"
            whileHover={{ scale: 0.98 }}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900">AI-Assisted<br />Store Setup</h3>
                <Sparkles className="w-5 h-5 text-gray-700" />
              </div>
              <p className="text-gray-800 text-sm leading-relaxed">
                Describe what you sell and Sublime generates your store copy, layout, and product descriptions in seconds. Go live before you second-guess yourself.
              </p>
            </div>
          </motion.div>

          {/* Item 2 */}
          <motion.div 
            className="md:col-span-1 bg-[#90CAF9] rounded-3xl p-8 flex flex-col justify-between"
            whileHover={{ scale: 0.98 }}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Your Own Branded<br />Storefront</h3>
                <LayoutTemplate className="w-5 h-5 text-gray-700" />
              </div>
              <p className="text-gray-800 text-sm leading-relaxed">
                A clean, professional storefront at your own URL. Not a marketplace profile — a store that belongs to you, looks like you, and represents your brand.
              </p>
            </div>
          </motion.div>

          {/* Item 3 */}
          <motion.div 
            className="md:col-span-1 bg-[#FFF59D] rounded-3xl p-8 flex flex-col justify-between"
            whileHover={{ scale: 0.98 }}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Sell Anything</h3>
                <ShoppingBag className="w-5 h-5 text-gray-700" />
              </div>
              <p className="text-gray-800 text-sm leading-relaxed">
                Courses, ebooks, templates, design assets, coaching packages, SaaS tools, access links — if you can create it, you can sell it on Sublime.
              </p>
            </div>
          </motion.div>

          {/* Item 4 */}
          <motion.div 
            className="md:col-span-1 bg-[#5E35B1] rounded-3xl p-8 flex flex-col justify-between text-white"
            whileHover={{ scale: 0.98 }}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">Payments That<br />Handle Themselves</h3>
                <CreditCard className="w-5 h-5 text-white/70" />
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Local and international payments, embedded checkout, automatic payouts. Customers pay, money moves. Nothing for you to configure.
              </p>
            </div>
          </motion.div>

          {/* Item 5 */}
          <motion.div 
            className="md:col-span-1 bg-[#1565C0] rounded-3xl p-8 flex flex-col justify-between text-white"
            whileHover={{ scale: 0.98 }}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">Know What&apos;s<br />Working</h3>
                <BarChart3 className="w-5 h-5 text-white/70" />
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                See your total sales, best-performing products, conversion rate, and customer count — all in plain language. No confusing dashboards.
              </p>
            </div>
          </motion.div>

          {/* Item 6 */}
          <motion.div 
            className="md:col-span-1 bg-[#827717] rounded-3xl p-8 flex flex-col justify-between text-white"
            whileHover={{ scale: 0.98 }}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">You Own Your<br />Customer List</h3>
                <Users className="w-5 h-5 text-white/70" />
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Every buyer&apos;s email is captured and yours to keep. Export it anytime. Build your audience. Grow on your own terms — not a platform&apos;s algorithm.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
