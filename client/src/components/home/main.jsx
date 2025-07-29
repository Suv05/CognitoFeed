"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import HeroSection from "./hero-section"
import FeaturesSection from "./features-section"
import ProcessSection from "./process-section"
import DemoSection from "./demo-section"
import CTASection from "./cta-section"
import Footer from "./footer"
import Navbar from "./navbar"
import ParticleBackground from "./particle-background"
import TestimonialsSection from "./testimonials-section"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Main() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.to(window, { duration: 0.1, ease: "none" })
      gsap.fromTo(".page-content", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" })
    }
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Main Background */}
      <div className="absolute inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />

      <ParticleBackground />
        <Navbar />
      <div className="page-content relative z-10">
        <HeroSection />
        <FeaturesSection />
        <ProcessSection />
        <DemoSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  )
}
