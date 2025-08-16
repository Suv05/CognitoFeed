"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/server/onboard-action";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Sparkles,
  ArrowRight,
  Check,
  Tag,
  Globe,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import ParticleBackground from "@/components/home/particle-background";

const CATEGORIES = [
  "general",
  "world",
  "nation",
  "business",
  "technology",
  "entertainment",
  "sports",
  "science",
  "health",
];

const KEYWORDS = [
  "stock",
  "bitcoin",
  "ai",
  "elon-musk",
  "election",
  "war",
  "inflation",
  "startup",
  "climate",
  "nasa",
  "crypto",
  "meta",
  "apple",
  "tesla",
  "openai",
  "cybersecurity",
  "global economy",
  "vaccination",
  "sports",
  "technology",
  "5G",
  "recession",
  "trump",
  "google",
  "microsoft",
  "spaceX",
  "web3",
  "chatgpt",
  "ev",
  "metaverse",
  "social media",
  "tiktok",
  "depression",
  "remote",
  "layoffs",
  "funding",
  "biotech",
  "iphone",
  "fed",
  "tsunami",
  "disaster",
];

export default function OnboardingPage() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useUser();
  const router = useRouter();

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleKeyword = (keyword) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword]
    );
  };

  const handleCompleteSetup = async () => {
    setIsSubmitting(true);

    const preferences = {
      categories: selectedCategories,
      keywords: selectedKeywords,
    };

    //console.log("User Preferences:", preferences);

    try {
      const res = await completeOnboarding({ preferences });

      //console.log("Server response:", res); // Debug log

      if (res?.success) {
        // Reloads the user's data from the Clerk API
        await user?.reload();

        // Add a small delay to ensure metadata is updated
        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      } else if (res?.error) {
        console.error("Onboarding failed:", res.error);
      }
    } catch (error) {
      console.error("Setup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      general: "📰",
      world: "🌍",
      nation: "🏛️",
      business: "💼",
      technology: "💻",
      entertainment: "🎬",
      sports: "⚽",
      science: "🔬",
      health: "🏥",
    };
    return icons[category] || "📰";
  };

  const nextStep = () => {
    if (currentStep === 1 && selectedCategories.length > 0) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Main Background - Same as Sign-in */}
      <div className="absolute inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />

      <ParticleBackground />

      <div className="relative z-10 min-h-screen">
        {/* Header with Logo and Back Button */}
        <div className="px-4 lg:px-12 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center space-x-3"
            >
              <div className="relative">
                <Brain className="h-8 w-8 lg:h-10 lg:w-10 text-purple-400" />
                <motion.div
                  className="absolute inset-0 bg-purple-400/30 blur-lg rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                CognitoFeed
              </span>
            </motion.div>

            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/"
                className="inline-flex items-center text-purple-300 hover:text-white transition-colors duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm">Back to Home</span>
              </Link>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 max-w-md mx-auto"
          >
            <div className="flex items-center space-x-4 mb-2">
              <span className="text-sm text-purple-200">
                Step {currentStep} of 2
              </span>
              <div className="flex-1 bg-purple-900/30 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full"
                  initial={{ width: "50%" }}
                  animate={{ width: currentStep === 1 ? "50%" : "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center px-4 lg:px-12 py-8">
          <div className="w-full max-w-4xl">
            <AnimatePresence mode="wait">
              {currentStep === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Step 1 - Categories */}
                  <div className="text-center mb-8">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-3xl lg:text-4xl font-bold mb-4"
                    >
                      <span className="bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">
                        Choose Your
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-200 bg-clip-text text-transparent">
                        News Categories
                      </span>
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-lg text-purple-200 mb-8 max-w-2xl mx-auto"
                    >
                      Select the news categories you're most interested in to
                      personalize your feed
                    </motion.p>
                  </div>

                  {/* Categories Grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="relative mb-8"
                  >
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-400/20 blur-2xl rounded-3xl" />

                    {/* Main Card */}
                    <div className="relative bg-gradient-to-br from-black/60 to-purple-950/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 lg:p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <Globe className="h-6 w-6 text-purple-400" />
                          <h2 className="text-xl lg:text-2xl font-bold text-white">
                            Categories
                          </h2>
                        </div>
                        <span className="text-sm text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full">
                          {selectedCategories.length} selected
                        </span>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {CATEGORIES.map((category, index) => (
                          <motion.button
                            key={category}
                            type="button"
                            onClick={() => toggleCategory(category)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.5,
                              delay: 0.8 + index * 0.1,
                            }}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-300 group overflow-hidden ${
                              selectedCategories.includes(category)
                                ? "border-purple-400 bg-purple-500/20 text-white"
                                : "border-purple-500/30 bg-black/20 text-gray-300 hover:border-purple-400/60 hover:bg-purple-500/10"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <span className="text-2xl">
                                {getCategoryIcon(category)}
                              </span>
                              <span className="text-sm font-medium capitalize">
                                {category}
                              </span>
                              <AnimatePresence>
                                {selectedCategories.includes(category) && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                                  >
                                    <Check className="w-3 h-3 text-white" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Next Button */}
                  <div className="text-center">
                    <motion.button
                      type="button"
                      onClick={nextStep}
                      disabled={selectedCategories.length === 0}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.0 }}
                      className={`inline-flex items-center space-x-3 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 ${
                        selectedCategories.length === 0
                          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg shadow-purple-500/25"
                      }`}
                      whileHover={
                        selectedCategories.length > 0 ? { scale: 1.02 } : {}
                      }
                      whileTap={
                        selectedCategories.length > 0 ? { scale: 0.98 } : {}
                      }
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Step 2 - Keywords */}
                  <div className="text-center mb-8">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-3xl lg:text-4xl font-bold mb-4"
                    >
                      <span className="bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">
                        Select Your
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-200 bg-clip-text text-transparent">
                        Interest Keywords
                      </span>
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-lg text-purple-200 mb-8 max-w-2xl mx-auto"
                    >
                      Choose specific keywords to fine-tune your personalized
                      news experience
                    </motion.p>
                  </div>

                  {/* Keywords Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="relative mb-8"
                  >
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-400/20 blur-2xl rounded-3xl" />

                    {/* Main Card */}
                    <div className="relative bg-gradient-to-br from-black/60 to-purple-950/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 lg:p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <Tag className="h-6 w-6 text-purple-400" />
                          <h2 className="text-xl lg:text-2xl font-bold text-white">
                            Keywords
                          </h2>
                        </div>
                        <span className="text-sm text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full">
                          {selectedKeywords.length} selected
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {KEYWORDS.map((keyword, index) => (
                          <motion.button
                            key={keyword}
                            type="button"
                            onClick={() => toggleKeyword(keyword)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.8 + index * 0.02,
                            }}
                            className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 text-sm font-medium capitalize ${
                              selectedKeywords.includes(keyword)
                                ? "border-purple-400 bg-purple-500/20 text-white shadow-lg shadow-purple-500/20"
                                : "border-purple-500/30 bg-black/20 text-gray-300 hover:border-purple-400/60 hover:bg-purple-500/10"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {keyword}
                            {selectedKeywords.includes(keyword) && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-2 inline-block"
                              >
                                ✓
                              </motion.span>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center space-x-4">
                    <motion.button
                      type="button"
                      onClick={prevStep}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      className="inline-flex items-center space-x-3 px-6 py-3 rounded-xl text-sm font-medium bg-black/40 border border-purple-500/30 text-gray-300 hover:border-purple-400/60 hover:bg-purple-500/10 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={handleCompleteSetup}
                      disabled={isSubmitting}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.0 }}
                      className="inline-flex items-center space-x-3 px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 disabled:opacity-50"
                      whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          <span>Setting up your feed...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Complete Setup</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-center mt-8"
            >
              <p className="text-sm text-gray-400">
                You can always change these preferences later in your settings
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
