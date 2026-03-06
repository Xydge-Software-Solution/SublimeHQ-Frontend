"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Check, Sparkles, Globe, Store, Building2, Lightbulb, Package, Users, GraduationCap, Ticket, ShoppingBag, ChevronLeft, ChevronRight, PartyPopper, ArrowRight } from "lucide-react";

// Types
interface SellOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface BusinessTypeOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ProductTypeOption {
  id: string;
  title: string;
  icon: React.ReactNode;
}

// Options data
const sellOptions: SellOption[] = [
  {
    id: "online",
    title: "Online Store",
    description: "Sell products through your own website",
    icon: <Globe className="w-6 h-6" />,
  },
  {
    id: "social",
    title: "Social Media",
    description: "Sell directly on Instagram, TikTok, etc.",
    icon: <Users className="w-6 h-6" />,
  },
  {
    id: "marketplace",
    title: "Marketplaces",
    description: "Sell on Amazon, Etsy, eBay, etc.",
    icon: <Store className="w-6 h-6" />,
  },
  {
    id: "physical",
    title: "In Person",
    description: "Sell at pop-ups, events, or retail",
    icon: <Building2 className="w-6 h-6" />,
  },
];

const businessTypeOptions: BusinessTypeOption[] = [
  {
    id: "new",
    title: "New business idea",
    description: "I'm just getting started and exploring options",
    icon: <Lightbulb className="w-8 h-8" />,
  },
  {
    id: "existing",
    title: "Existing business",
    description: "I already have a business and want to grow it",
    icon: <Building2 className="w-8 h-8" />,
  },
];

const productTypeOptions: ProductTypeOption[] = [
  { id: "digital", title: "Digital Products", icon: <Package className="w-6 h-6" /> },
  { id: "coaching", title: "Coaching Services", icon: <Users className="w-6 h-6" /> },
  { id: "courses", title: "Online Courses", icon: <GraduationCap className="w-6 h-6" /> },
  { id: "tickets", title: "Event Tickets", icon: <Ticket className="w-6 h-6" /> },
  { id: "store", title: "Online Store", icon: <ShoppingBag className="w-6 h-6" /> },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form state
  const [selectedSellOptions, setSelectedSellOptions] = useState<string[]>([]);
  const [businessType, setBusinessType] = useState<string>("");
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [isGeneratingName, setIsGeneratingName] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const totalSteps = 4;

  const toggleSellOption = (id: string) => {
    setSelectedSellOptions((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const toggleProductType = (id: string) => {
    setSelectedProductTypes((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const generateStoreName = async () => {
    setIsGeneratingName(true);
    // TODO: Replace with actual AI API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const names = ["Stellar Shop", "Creative Corner", "Digital Dreams", "Artisan Hub", "Modern Market"];
    setStoreName(names[Math.floor(Math.random() * names.length)]);
    setIsGeneratingName(false);
  };

  const generateStoreDescription = async () => {
    setIsGeneratingDescription(true);
    // TODO: Replace with actual AI API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const descriptions = [
      "A curated marketplace for unique digital products and creative services.",
      "Your one-stop destination for premium courses and coaching experiences.",
      "Empowering creators to share their passion with the world.",
    ];
    setStoreDescription(descriptions[Math.floor(Math.random() * descriptions.length)]);
    setIsGeneratingDescription(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedSellOptions.length > 0;
      case 2:
        return businessType !== "";
      case 3:
        return selectedProductTypes.length > 0;
      case 4:
        return storeName.trim() !== "" && storeDescription.trim() !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    // TODO: Save onboarding data to API
    const onboardingData = {
      sellChannels: selectedSellOptions,
      businessType,
      productTypes: selectedProductTypes,
      storeName,
      storeDescription,
    };
    console.log("Onboarding complete:", onboardingData);
    
    setShowSuccess(true);
  };

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400  flex flex-col items-center justify-center p-4">
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <SuccessModal storeName={storeName} onProceed={goToDashboard} />
        )}
      </AnimatePresence>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center justify-center mb-6 flex-col">
            <Image
              src="/logo.png"
              alt="Sublime"
              width={40}
              height={40}
              className="mr-2"
            />
            <span className="text-2xl font-bold text-gray-900">Sublime</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="px-8 py-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <StepOne
                key="step1"
                options={sellOptions}
                selected={selectedSellOptions}
                onToggle={toggleSellOption}
              />
            )}
            {currentStep === 2 && (
              <StepTwo
                key="step2"
                options={businessTypeOptions}
                selected={businessType}
                onSelect={setBusinessType}
              />
            )}
            {currentStep === 3 && (
              <StepThree
                key="step3"
                options={productTypeOptions}
                selected={selectedProductTypes}
                onToggle={toggleProductType}
              />
            )}
            {currentStep === 4 && (
              <StepFour
                key="step4"
                storeName={storeName}
                storeDescription={storeDescription}
                onNameChange={setStoreName}
                onDescriptionChange={setStoreDescription}
                onGenerateName={generateStoreName}
                onGenerateDescription={generateStoreDescription}
                isGeneratingName={isGeneratingName}
                isGeneratingDescription={isGeneratingDescription}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              canProceed()
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {currentStep === totalSteps ? "Create my store" : "Next"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
      
      {/* Progress indicator below the card */}
      <div className="w-full max-w-xl mt-22">
        <div className="flex items-center gap-2 mb-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i < currentStep ? "bg-blue-900" : "bg-white/40"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-white text-center">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  );
}

// Step 1: Where do you want to sell?
function StepOne({
  options,
  selected,
  onToggle,
}: {
  options: SellOption[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
        Where do you want to sell?
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Select all the channels where you plan to sell your products
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => onToggle(option.id)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selected.includes(option.id)
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    selected.includes(option.id)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {option.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{option.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                  selected.includes(option.id)
                    ? "border-blue-600 bg-blue-600"
                    : "border-gray-300"
                }`}
              >
                {selected.includes(option.id) && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Step 2: Is your store a new or existing business?
function StepTwo({
  options,
  selected,
  onSelect,
}: {
  options: BusinessTypeOption[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
        Is your store a new or existing business?
      </h2>
      <p className="text-gray-500 text-center mb-8">
        This helps us customize your experience
      </p>

      <div className="space-y-4">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
              selected === option.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`hidden md:flex p-3 rounded-xl ${
                    selected === option.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {option.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-md md:text-lg text-gray-900">
                    {option.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-500">{option.description}</p>
                </div>
              </div>
              <div
                className={`w-3 h-3 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${
                  selected === option.id
                    ? "border-blue-600 bg-blue-600"
                    : "border-gray-300"
                }`}
              >
                {selected === option.id && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Step 3: What do you plan to sell?
function StepThree({
  options,
  selected,
  onToggle,
}: {
  options: ProductTypeOption[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
        What do you plan to sell?
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Select all that apply to your business
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => onToggle(option.id)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selected.includes(option.id)
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    selected.includes(option.id)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {option.icon}
                </div>
                <span className="font-medium text-gray-900">{option.title}</span>
              </div>
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                  selected.includes(option.id)
                    ? "border-blue-600 bg-blue-600"
                    : "border-gray-300"
                }`}
              >
                {selected.includes(option.id) && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Step 4: Store name and description
function StepFour({
  storeName,
  storeDescription,
  onNameChange,
  onDescriptionChange,
  onGenerateName,
  onGenerateDescription,
  isGeneratingName,
  isGeneratingDescription,
}: {
  storeName: string;
  storeDescription: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onGenerateName: () => void;
  onGenerateDescription: () => void;
  isGeneratingName: boolean;
  isGeneratingDescription: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
        Let&apos;s set up your store
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Give your store a name and description
      </p>

      <div className="space-y-6">
        {/* Store Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What would you like to call your store?
          </label>
          <div className="relative">
            <input
              type="text"
              value={storeName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter your store name"
              className="w-full px-4 py-3 pr-32 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <button
              onClick={onGenerateName}
              disabled={isGeneratingName}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingName ? "animate-spin" : ""}`} />
              {isGeneratingName ? "..." : "Generate with AI"}
            </button>
          </div>
        </div>

        {/* Store Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your store
          </label>
          <div className="relative">
            <textarea
              value={storeDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Tell your customers what makes your store special..."
              rows={4}
              className="w-full px-4 py-3 pb-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            />
            <button
              onClick={onGenerateDescription}
              disabled={isGeneratingDescription}
              className="absolute right-2 bottom-2 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingDescription ? "animate-spin" : ""}`} />
              {isGeneratingDescription ? "..." : "Generate with AI"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Confetti piece type
interface ConfettiPiece {
  id: number;
  x: number;
  scale: number;
  rotate: number;
  duration: number;
  delay: number;
  color: string;
}

// Pre-defined confetti data (static so no Math.random during render)
const CONFETTI_DATA: ConfettiPiece[] = [
  { id: 0, x: 0.12, scale: 0.8, rotate: 240, duration: 3.2, delay: 0.1, color: "#3B82F6" },
  { id: 1, x: 0.95, scale: 0.6, rotate: -180, duration: 2.8, delay: 0.3, color: "#8B5CF6" },
  { id: 2, x: 0.33, scale: 0.9, rotate: 320, duration: 3.5, delay: 0.05, color: "#EC4899" },
  { id: 3, x: 0.67, scale: 0.5, rotate: -90, duration: 2.5, delay: 0.4, color: "#F59E0B" },
  { id: 4, x: 0.45, scale: 0.7, rotate: 160, duration: 3.8, delay: 0.2, color: "#10B981" },
  { id: 5, x: 0.78, scale: 0.85, rotate: -270, duration: 3.0, delay: 0.15, color: "#06B6D4" },
  { id: 6, x: 0.22, scale: 0.55, rotate: 200, duration: 2.6, delay: 0.35, color: "#3B82F6" },
  { id: 7, x: 0.88, scale: 0.75, rotate: -140, duration: 3.4, delay: 0.08, color: "#8B5CF6" },
  { id: 8, x: 0.08, scale: 0.65, rotate: 280, duration: 2.9, delay: 0.25, color: "#EC4899" },
  { id: 9, x: 0.55, scale: 0.95, rotate: -220, duration: 3.6, delay: 0.12, color: "#F59E0B" },
  { id: 10, x: 0.38, scale: 0.58, rotate: 120, duration: 2.7, delay: 0.42, color: "#10B981" },
  { id: 11, x: 0.72, scale: 0.82, rotate: -300, duration: 3.1, delay: 0.18, color: "#06B6D4" },
  { id: 12, x: 0.15, scale: 0.68, rotate: 180, duration: 3.3, delay: 0.28, color: "#3B82F6" },
  { id: 13, x: 0.92, scale: 0.52, rotate: -60, duration: 2.4, delay: 0.38, color: "#8B5CF6" },
  { id: 14, x: 0.42, scale: 0.88, rotate: 350, duration: 3.7, delay: 0.06, color: "#EC4899" },
  { id: 15, x: 0.63, scale: 0.72, rotate: -200, duration: 2.85, delay: 0.22, color: "#F59E0B" },
  { id: 16, x: 0.28, scale: 0.62, rotate: 100, duration: 3.25, delay: 0.32, color: "#10B981" },
  { id: 17, x: 0.82, scale: 0.92, rotate: -320, duration: 3.45, delay: 0.14, color: "#06B6D4" },
  { id: 18, x: 0.05, scale: 0.78, rotate: 220, duration: 2.95, delay: 0.45, color: "#3B82F6" },
  { id: 19, x: 0.48, scale: 0.56, rotate: -160, duration: 2.55, delay: 0.02, color: "#8B5CF6" },
  { id: 20, x: 0.18, scale: 0.84, rotate: 260, duration: 3.15, delay: 0.36, color: "#EC4899" },
  { id: 21, x: 0.75, scale: 0.66, rotate: -240, duration: 2.75, delay: 0.26, color: "#F59E0B" },
  { id: 22, x: 0.35, scale: 0.94, rotate: 140, duration: 3.55, delay: 0.09, color: "#10B981" },
  { id: 23, x: 0.58, scale: 0.54, rotate: -100, duration: 2.45, delay: 0.4, color: "#06B6D4" },
  { id: 24, x: 0.02, scale: 0.76, rotate: 300, duration: 3.05, delay: 0.19, color: "#3B82F6" },
  { id: 25, x: 0.85, scale: 0.64, rotate: -280, duration: 2.65, delay: 0.33, color: "#8B5CF6" },
  { id: 26, x: 0.25, scale: 0.86, rotate: 60, duration: 3.35, delay: 0.11, color: "#EC4899" },
  { id: 27, x: 0.68, scale: 0.58, rotate: -340, duration: 2.5, delay: 0.44, color: "#F59E0B" },
  { id: 28, x: 0.52, scale: 0.96, rotate: 80, duration: 3.65, delay: 0.04, color: "#10B981" },
  { id: 29, x: 0.98, scale: 0.7, rotate: -120, duration: 2.8, delay: 0.29, color: "#06B6D4" },
  { id: 30, x: 0.1, scale: 0.82, rotate: 340, duration: 3.2, delay: 0.16, color: "#3B82F6" },
  { id: 31, x: 0.4, scale: 0.6, rotate: -260, duration: 2.6, delay: 0.37, color: "#8B5CF6" },
  { id: 32, x: 0.62, scale: 0.9, rotate: 40, duration: 3.4, delay: 0.07, color: "#EC4899" },
  { id: 33, x: 0.3, scale: 0.74, rotate: -180, duration: 2.9, delay: 0.24, color: "#F59E0B" },
  { id: 34, x: 0.8, scale: 0.68, rotate: 200, duration: 3.0, delay: 0.41, color: "#10B981" },
  { id: 35, x: 0.2, scale: 0.88, rotate: -40, duration: 3.5, delay: 0.13, color: "#06B6D4" },
  { id: 36, x: 0.5, scale: 0.54, rotate: 280, duration: 2.7, delay: 0.3, color: "#3B82F6" },
  { id: 37, x: 0.9, scale: 0.92, rotate: -300, duration: 3.6, delay: 0.03, color: "#8B5CF6" },
  { id: 38, x: 0.07, scale: 0.62, rotate: 160, duration: 2.55, delay: 0.46, color: "#EC4899" },
  { id: 39, x: 0.7, scale: 0.8, rotate: -80, duration: 3.25, delay: 0.21, color: "#F59E0B" },
  { id: 40, x: 0.32, scale: 0.72, rotate: 240, duration: 2.85, delay: 0.34, color: "#10B981" },
  { id: 41, x: 0.6, scale: 0.98, rotate: -200, duration: 3.75, delay: 0.1, color: "#06B6D4" },
  { id: 42, x: 0.14, scale: 0.56, rotate: 320, duration: 2.45, delay: 0.43, color: "#3B82F6" },
  { id: 43, x: 0.76, scale: 0.84, rotate: -140, duration: 3.1, delay: 0.17, color: "#8B5CF6" },
  { id: 44, x: 0.44, scale: 0.66, rotate: 100, duration: 2.95, delay: 0.27, color: "#EC4899" },
  { id: 45, x: 0.86, scale: 0.78, rotate: -360, duration: 3.35, delay: 0.08, color: "#F59E0B" },
  { id: 46, x: 0.24, scale: 0.94, rotate: 20, duration: 3.55, delay: 0.39, color: "#10B981" },
  { id: 47, x: 0.56, scale: 0.52, rotate: -220, duration: 2.35, delay: 0.23, color: "#06B6D4" },
  { id: 48, x: 0.04, scale: 0.86, rotate: 260, duration: 3.45, delay: 0.15, color: "#3B82F6" },
  { id: 49, x: 0.94, scale: 0.7, rotate: -100, duration: 2.75, delay: 0.31, color: "#8B5CF6" },
];

// Success Modal with Confetti
function SuccessModal({
  storeName,
  onProceed,
}: {
  storeName: string;
  onProceed: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      {/* Confetti - CSS Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {CONFETTI_DATA.map((piece: ConfettiPiece) => (
          <div
            key={piece.id}
            className="absolute w-3 h-3 rounded-sm animate-confetti"
            style={{
              backgroundColor: piece.color,
              left: `${piece.x * 100}%`,
              animationDuration: `${piece.duration}s`,
              animationDelay: `${piece.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"
          style={{
            clipPath: "polygon(50% 0%, 65% 2%, 79% 10%, 90% 21%, 98% 35%, 100% 50%, 98% 65%, 90% 79%, 79% 90%, 65% 98%, 50% 100%, 35% 98%, 21% 90%, 10% 79%, 2% 65%, 0% 50%, 2% 35%, 10% 21%, 21% 10%, 35% 2%)"
          }}
        >
          <Check className="w-12 h-12 font-bold text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <PartyPopper className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-gray-900">Congratulations!</h2>
            <PartyPopper className="w-6 h-6 text-amber-500 transform scale-x-[-1]" />
          </div>
          
          <p className="text-gray-600 mb-2">Your store is ready!</p>
          <p className="text-lg font-semibold text-blue-600 mb-6">
            &quot;{storeName}&quot;
          </p>

          <button
            onClick={onProceed}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#0c3e67] to-[#0c3e67] text-white font-semibold rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            Proceed to Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
