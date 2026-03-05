'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: "Kemi F.",
    role: "Freelance Copywriter",
    image: "https://picsum.photos/seed/person1/200/200",
    quote: "I shared my link on Instagram and made three sales the same day. Setup took me about 20 minutes, and I didn't need to watch a single tutorial. The checkout just worked. Payments came in smoothly, and I could focus on promoting instead of fixing tech issues. It honestly removed the fear I had about selling online.",
    color: "from-blue-900/80 to-purple-900/80"
  },
  {
    id: 2,
    name: "Marcus T.",
    role: "Fitness Coach",
    image: "https://picsum.photos/seed/person2/200/200",
    quote: "Sublime completely changed how I sell my workout plans. Before, I was manually emailing PDFs and tracking payments in a spreadsheet. Now, my clients buy directly from my link, get their files instantly, and I wake up to payout notifications. It's like having a full-time assistant.",
    color: "from-emerald-900/80 to-teal-900/80"
  },
  {
    id: 3,
    name: "Sarah J.",
    role: "UI/UX Designer",
    image: "https://picsum.photos/seed/person3/200/200",
    quote: "As a designer, I care deeply about how my storefront looks. Sublime gave me a beautiful, professional page out of the box. I listed my Figma templates in minutes, and the conversion rate has been incredible. The AI even helped me write better product descriptions than I could have.",
    color: "from-orange-900/80 to-red-900/80"
  }
];

export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const totalCards = testimonials.length;

  // Get stack order - active card on top, others stacked behind
  const getStackOrder = useCallback((cardIndex: number) => {
    const diff = (cardIndex - activeIndex + totalCards) % totalCards;
    return totalCards - diff;
  }, [activeIndex, totalCards]);

  // Animate to next card
  const goToNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const currentCard = cardsRef.current[activeIndex];
    const nextIndex = (activeIndex + 1) % totalCards;

    if (currentCard) {
      gsap.to(currentCard, {
        x: -150,
        rotateY: -20,
        scale: 0.85,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.inOut',
        onComplete: () => {
          gsap.set(currentCard, {
            x: 0,
            rotateY: 0,
            scale: 1,
            opacity: 1,
          });
          setActiveIndex(nextIndex);
          setIsAnimating(false);
        }
      });
    } else {
      setActiveIndex(nextIndex);
      setIsAnimating(false);
    }
  }, [activeIndex, isAnimating, totalCards]);

  // Animate to previous card
  const goToPrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const currentCard = cardsRef.current[activeIndex];
    const prevIndex = (activeIndex - 1 + totalCards) % totalCards;

    if (currentCard) {
      gsap.to(currentCard, {
        x: 150,
        rotateY: 20,
        scale: 0.85,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.inOut',
        onComplete: () => {
          gsap.set(currentCard, {
            x: 0,
            rotateY: 0,
            scale: 1,
            opacity: 1,
          });
          setActiveIndex(prevIndex);
          setIsAnimating(false);
        }
      });
    } else {
      setActiveIndex(prevIndex);
      setIsAnimating(false);
    }
  }, [activeIndex, isAnimating, totalCards]);

  // Auto-play every 5 seconds
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      goToNext();
    }, 5000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [goToNext]);

  // Reset auto-play timer on manual navigation
  const handleNext = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    goToNext();
    autoPlayRef.current = setInterval(goToNext, 5000);
  };

  const handlePrev = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    goToPrev();
    autoPlayRef.current = setInterval(goToNext, 5000);
  };

  return (
    <section className="relative py-24 bg-[#0B1B3D] text-white overflow-hidden">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 text-center mb-12">
        <h2 className="text-4xl font-bold tracking-tight">Creators like Sublime</h2>
        <p className="text-blue-200/60 text-sm mt-4">
          See what our creators have to say
        </p>
      </div>
      
      {/* Cards Container */}
      <div className="max-w-6xl mx-auto px-6">
        <div 
          className="relative h-[450px] md:h-[400px] flex items-center justify-center"
          style={{ perspective: '1200px' }}
        >
          {testimonials.map((testimonial, i) => {
            const stackOrder = getStackOrder(i);
            const isActive = i === activeIndex;
            const offset = isActive ? 0 : (totalCards - stackOrder) * 12;
            
            return (
              <div
                key={testimonial.id}
                ref={(el) => { cardsRef.current[i] = el; }}
                className={`absolute w-full max-w-4xl bg-gradient-to-br ${testimonial.color} border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-6 md:gap-8 text-left shadow-2xl backdrop-blur-md transition-all duration-500`}
                style={{
                  zIndex: stackOrder,
                  transform: `translateY(${offset}px) scale(${isActive ? 1 : 0.95 - (totalCards - stackOrder) * 0.03})`,
                  opacity: isActive ? 1 : 0.6 + stackOrder * 0.15,
                }}
              >
                <div className="w-24 h-24 md:w-40 md:h-40 shrink-0 rounded-full overflow-hidden border-4 border-white/20 relative shadow-xl">
                  <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                
                <div>
                  <p className="text-lg md:text-xl font-medium leading-relaxed mb-4 md:mb-6 text-blue-50">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <p className="text-base md:text-lg font-bold text-white">— {testimonial.name}, {testimonial.role}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={handlePrev}
            disabled={isAnimating}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-200 disabled:opacity-50 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          {/* Dots indicator */}
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!isAnimating && i !== activeIndex) {
                    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
                    setActiveIndex(i);
                    autoPlayRef.current = setInterval(goToNext, 5000);
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white/30 hover:bg-white/50 w-2'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={isAnimating}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-200 disabled:opacity-50 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
