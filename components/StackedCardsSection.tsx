'use client';
import { useScroll, useTransform, motion } from 'motion/react';
import { useRef } from 'react';
import { Box, FileText, Video, MonitorPlay } from 'lucide-react';
import Image from 'next/image';

const cardData = [
  {
    id: 1,
    title: "Digital Product Sellers",
    description: "If you've built something worth buying, Sublime gets it in front of buyers fast.",
    color: "bg-[#1E88E5]",
    icon: <Box className="w-6 h-6 text-[#1E88E5]" />,
    image: "https://picsum.photos/seed/digital/400/300"
  },
  {
    id: 2,
    title: "Course Creators",
    description: "Turn your expertise into a structured curriculum with built-in video hosting.",
    color: "bg-[#9C27B0]",
    icon: <Video className="w-6 h-6 text-[#9C27B0]" />,
    image: "https://picsum.photos/seed/course/400/300"
  },
  {
    id: 3,
    title: "Coaches & Consultants",
    description: "Book sessions, manage clients, and get paid all in one seamless workflow.",
    color: "bg-[#FDD835]",
    icon: <MonitorPlay className="w-6 h-6 text-[#FDD835]" />,
    image: "https://picsum.photos/seed/coach/400/300"
  },
  {
    id: 4,
    title: "Freelancers",
    description: "Productize your services and let clients buy your time without the back-and-forth.",
    color: "bg-[#4CAF50]",
    icon: <FileText className="w-6 h-6 text-[#4CAF50]" />,
    image: "https://picsum.photos/seed/freelance/400/300"
  }
];

const Card = ({ card, index, totalCards }: { card: typeof cardData[0], index: number, totalCards: number }) => {
  return (
    <div 
      className="h-[500px] flex justify-center items-start sticky"
      style={{ 
        top: `calc(80px + ${index * 25}px)`,
        zIndex: index + 1 
      }}
    >
      <div 
        className={`w-full max-w-4xl mx-6 h-[450px] rounded-3xl shadow-2xl ${card.color} p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center justify-between`}
      >
        <div className="flex-1 text-white">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
            {card.icon}
          </div>
          <h3 className="text-3xl font-bold mb-4">{card.title}</h3>
          <p className="text-lg opacity-90 leading-relaxed">
            {card.description}
          </p>
        </div>
        <div className="w-full md:w-1/2 h-full relative rounded-2xl overflow-hidden shadow-lg border border-white/20">
          <Image src={card.image} alt={card.title} fill className="object-cover" referrerPolicy="no-referrer" />
          <div className="absolute bottom-4 left-4 bg-white text-gray-900 text-xs font-semibold px-3 py-2 rounded-lg shadow-md flex items-center gap-2">
            <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
              <div className="bg-blue-500 rounded-sm"></div>
              <div className="bg-blue-500 rounded-sm"></div>
              <div className="bg-blue-500 rounded-sm"></div>
              <div className="bg-blue-500 rounded-sm"></div>
            </div>
            Whatever you sell, there is money to be made.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StackedCardsSection() {
  return (
    <section className="relative bg-[#0B1B3D]">
      {/* Header - scrolls normally */}
      <div className="pt-24 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-blue-200 bg-blue-900/30 rounded-full border border-blue-800">
            Made for creators like you
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight max-w-2xl">
            If you create value,<br />Sublime helps you sell it.
          </h2>
          <p className="text-blue-200/60 text-sm mt-4 flex items-center gap-2">
            Scroll down to explore
          </p>
        </div>
      </div>
      
      {/* Cards Container */}
      <div className="relative pb-[100px]">
        {cardData.map((card, i) => (
          <Card 
            key={card.id} 
            card={card} 
            index={i} 
            totalCards={cardData.length}
          />
        ))}
      </div>
    </section>
  );
}
