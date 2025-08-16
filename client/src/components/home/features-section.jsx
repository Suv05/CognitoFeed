import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Brain, Target, Zap, BarChart3, Globe, Shield } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    subtitle: "99.2% Accuracy",
    description: "Advanced NLP models analyze sentiment with 99.2% accuracy using state-of-the-art transformers.",
  },
  {
    icon: Target,
    title: "Personalized Curation",
    description: "Tailored news feeds based on your interests, reading patterns, and sentiment preferences.",
    subtitle: "Smart Curation",
  },
  {
    icon: Zap,
    title: "Real-time Insights",
    description: "Live sentiment tracking across markets, topics, and trending stories as they develop.",
    subtitle: "<100ms",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description: "Interactive dashboards with sentiment trends, topic analysis, and market emotion tracking.",
    subtitle: "Insights",
  },
  {
    icon: Globe,
    title: "Multi-Source Aggregation",
    description: "Comprehensive coverage from news outlets, social media, and financial feeds worldwide.",
    subtitle: "500+ Outlets",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with encrypted data processing and privacy-first architecture.",
    subtitle: "Bank-grade",
  },
]

export default function FeaturesSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section ref={sectionRef} id="features" className="py-32 px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-300 to-purple-100 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group relative bg-gradient-to-br from-black/50 to-purple-950/30 border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-500 overflow-hidden h-full">
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative p-8 h-full flex flex-col">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-purple-600/20 to-purple-400/10 border border-purple-500/20 group-hover:border-purple-400/40 transition-colors">
                      <feature.icon className="w-6 h-6 text-purple-300" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                    {feature.title}
                  </h3>
                  <div className="text-purple-300 font-semibold mb-3 text-sm">{feature.subtitle}</div>
                  <p className="text-gray-400 leading-relaxed text-sm flex-1">{feature.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
