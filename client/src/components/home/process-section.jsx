"use client"

import { useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { gsap } from "gsap"
import { Card } from "@/components/ui/card"
import { Download, Brain, BarChart3, Bell, ArrowRight, Sparkles } from "lucide-react"

const steps = [
  {
    icon: Download,
    title: "Data Ingestion",
    description: "Real-time collection from news APIs, social media feeds, and financial sources using Cloud Pub/Sub.",
    details: ["Multi-source aggregation", "Real-time streaming", "Data validation"],
    color: "purple",
  },
  {
    icon: Brain,
    title: "AI Processing",
    description: "Advanced sentiment analysis using Hugging Face Transformers and Google Cloud Dataflow.",
    details: ["NLP sentiment analysis", "Entity recognition", "Topic classification"],
    color: "pink",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Intelligent insights generation with trend analysis and personalization algorithms.",
    details: ["Sentiment scoring", "Trend detection", "Personalization"],
    color: "violet",
  },
  {
    icon: Bell,
    title: "Delivery",
    description: "Personalized news summaries delivered through beautiful dashboards and smart notifications.",
    details: ["Custom dashboards", "Smart alerts", "Mobile notifications"],
    color: "fuchsia",
  },
]

export default function ProcessSection() {
  const sectionRef = useRef(null)
  const timelineRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView && typeof window !== "undefined" && timelineRef.current) {
      // Animate timeline line
      gsap.fromTo(".timeline-line", { scaleY: 0 }, { scaleY: 1, duration: 2, ease: "power2.out" })

      // Animate step cards
      gsap.fromTo(
        ".process-step",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.3,
          ease: "power2.out",
          delay: 0.5,
        },
      )
    }
  }, [isInView])

  const getColorClasses = (color) => {
    const colors = {
      purple: {
        bg: "from-purple-500 to-violet-600",
        border: "border-purple-500/30",
        text: "text-purple-400",
        glow: "shadow-purple-500/25",
      },
      pink: {
        bg: "from-pink-500 to-rose-500",
        border: "border-pink-500/30",
        text: "text-pink-400",
        glow: "shadow-pink-500/25",
      },
      violet: {
        bg: "from-violet-500 to-purple-600",
        border: "border-violet-500/30",
        text: "text-violet-400",
        glow: "shadow-violet-500/25",
      },
      fuchsia: {
        bg: "from-fuchsia-500 to-pink-600",
        border: "border-fuchsia-500/30",
        text: "text-fuchsia-400",
        glow: "shadow-fuchsia-500/25",
      },
    }
    return colors[color]
  }

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="py-24 px-4 sm:px-6 lg:px-8 relative"
      style={{
        background: "radial-gradient(125% 125% at 50% 10%, #000 40%, #63e 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
            <span className="text-sm text-purple-300 font-medium">How It Works</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              From Raw Data to
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Intelligent Insights
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our AI-powered pipeline transforms millions of news articles into personalized, actionable insights in
            real-time.
          </p>
        </motion.div>

        {/* Process Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500 timeline-line origin-top" />

          {/* Process Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => {
              const colorClasses = getColorClasses(step.color)
              return (
                <div key={index} className="process-step relative flex items-start">
                  {/* Step Number & Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${colorClasses.bg} flex items-center justify-center shadow-lg ${colorClasses.glow}`}
                    >
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-black/80 rounded-full flex items-center justify-center border-2 border-purple-400 backdrop-blur-sm">
                      <span className="text-xs font-bold text-purple-400">{index + 1}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="ml-8 flex-1">
                    <Card
                      className={`bg-black/20 border-purple-500/20 backdrop-blur-sm hover:${colorClasses.border} hover:bg-black/30 transition-all duration-500 group`}
                    >
                      <div className="p-8">
                        <h3
                          className={`text-2xl font-bold mb-3 ${colorClasses.text} group-hover:text-white transition-colors`}
                        >
                          {step.title}
                        </h3>
                        <p className="text-gray-300 mb-6 text-lg leading-relaxed">{step.description}</p>

                        {/* Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {step.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${colorClasses.bg}`} />
                              <span className="text-sm text-gray-400">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Arrow (except for last item) */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: (index + 1) * 0.3 }}
                      className="absolute left-12 -bottom-6 z-10"
                    >
                      <ArrowRight className="w-6 h-6 text-purple-400" />
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8"
        >
          {[
            { label: "Processing Speed", value: "<100ms", desc: "Average analysis time" },
            { label: "Data Sources", value: "500+", desc: "News outlets & feeds" },
            { label: "Daily Articles", value: "50K+", desc: "Processed & analyzed" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-white font-semibold mb-1">{stat.label}</div>
              <div className="text-gray-400 text-sm">{stat.desc}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
