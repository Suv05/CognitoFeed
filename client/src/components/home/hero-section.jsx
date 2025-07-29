"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"

export default function HeroSection() {
  const heroRef = useRef(null)
  const floatingElementsRef = useRef(null)

  useEffect(() => {
    if (typeof window !== "undefined" && floatingElementsRef.current) {
      const elements = floatingElementsRef.current.children

      Array.from(elements).forEach((element, index) => {
        gsap.to(element, {
          y: "random(-30, 30)",
          x: "random(-20, 20)",
          rotation: "random(-10, 10)",
          duration: "random(4, 8)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.3,
        })
      })
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Floating Elements */}
      <div ref={floatingElementsRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-purple-400/40 rounded-full blur-sm" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-pink-400/50 rounded-full blur-sm" />
        <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-purple-300/30 rounded-full blur-sm" />
        <div className="absolute top-1/2 right-1/3 w-2.5 h-2.5 bg-pink-300/40 rounded-full blur-sm" />
        <div className="absolute bottom-1/4 right-1/5 w-3.5 h-3.5 bg-purple-400/25 rounded-full blur-sm" />
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm mb-8"
        >
          <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
          <span className="text-sm text-purple-300 font-medium ">AI-Powered News Intelligence</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
        >
          <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Smart News
          </span>
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
            Analysis
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          AI-driven sentiment analysis for personalized news insights
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-12 mb-16"
        >
          {[
            { value: "99.2%", label: "Accuracy" },
            { value: "50K+", label: "Daily Articles" },
            { value: "<100ms", label: "Processing" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-2xl shadow-purple-500/25 px-10 py-6 text-lg group"
          >
            Start Free Trial
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 hover:text-[#f0f0f0] px-10 py-6 text-lg backdrop-blur-sm group bg-transparent"
          >
            <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-purple-400/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="w-1 h-3 bg-gradient-to-b from-purple-400 to-transparent rounded-full mt-2"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
