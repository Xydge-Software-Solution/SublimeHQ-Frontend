import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeatureImageSection from '@/components/FeatureImageSection';
import StepsSection from '@/components/StepsSection';
import BentoGridSection from '@/components/BentoGridSection';
import StackedCardsSection from '@/components/StackedCardsSection';
import AiSection from '@/components/AiSection';
import TestimonialSection from '@/components/TestimonialSection';
import StatsSection from '@/components/StatsSection';
import CtaSection from '@/components/CtaSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans selection:bg-blue-200">
      <Navbar />
      <Hero />
      <FeatureImageSection />
      <StepsSection />
      <BentoGridSection />
      <StackedCardsSection />
      <AiSection />
      <TestimonialSection />
      <StatsSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
