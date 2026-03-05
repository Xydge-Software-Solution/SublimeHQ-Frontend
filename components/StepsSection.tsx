'use client';
import { motion } from 'motion/react';
import { Edit3, PackagePlus, Share2, DollarSign } from 'lucide-react';

const steps = [
  {
    num: "01",
    title: "Tell us what you do",
    desc: "Describe your business or product. Our AI drafts your store name, copy, and layout instantly. Or set it up manually — your call.",
    color: "bg-[#E3F2FD]",
    icon: <Edit3 className="w-5 h-5 text-blue-500" />
  },
  {
    num: "02",
    title: "Add your products",
    desc: "Upload digital files, add links, or list services. Pricing, descriptions, and delivery are all handled in one place.",
    color: "bg-[#F3E5F5]",
    icon: <PackagePlus className="w-5 h-5 text-purple-500" />
  },
  {
    num: "03",
    title: "Share your store link",
    desc: "Your store lives at sublime.to/yourname. Drop it in your social bio, send it on WhatsApp, add it to your email signature — wherever your audience is.",
    color: "bg-[#FFF9C4]",
    icon: <Share2 className="w-5 h-5 text-yellow-600" />
  },
  {
    num: "04",
    title: "Sell and get paid",
    desc: "Customers check out directly on your storefront. Payments are processed automatically and paid out to you. No manual follow-up, no DMs to chase.",
    color: "bg-[#E0F7FA]",
    icon: <DollarSign className="w-5 h-5 text-cyan-600" />
  }
];

export default function StepsSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="mb-16">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-blue-600 bg-blue-50 rounded-full border border-blue-100">
            Simple by design
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight max-w-2xl">
            From sign-up to first sale in under an hour.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 rounded-3xl ${step.color} border border-black/5`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  Step {step.num} —<br />{step.title}
                </h3>
                <div className="p-2 bg-white/50 rounded-full">
                  {step.icon}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
