import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export default function CTASection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [email, setEmail] = useState("")
  const [isClient, setIsClient] = useState(false)

  // Ensure client-side rendering for the input
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    // Handle email submission here
    console.log("Email submitted:", email)
  }

  return (
    <section ref={sectionRef} className="py-32 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl rounded-3xl" />
          <div className="relative bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-16 text-center overflow-hidden">
            <div className="absolute top-8 left-8">
              <Sparkles className="w-8 h-8 text-purple-400/30" />
            </div>
            <div className="absolute bottom-8 right-8">
              <div className="w-4 h-4 bg-pink-400/30 rounded-full" />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-5xl sm:text-6xl font-bold mb-8">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Ready to Start?
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Join thousands of professionals using AI-powered news analysis
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8"
            >
              {isClient && (
                <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-6 max-w-lg mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-black/50 border border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none h-14 text-lg px-4 rounded-lg transition-all duration-200"
                    required
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25 group h-14 px-8 rounded-lg font-medium transition-all duration-300"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              )}
              
              {/* Fallback for server-side rendering */}
              {!isClient && (
                <div className="flex flex-col sm:flex-row gap-6 max-w-lg mx-auto">
                  <div className="flex-1 bg-black/50 border border-purple-500/30 h-14 rounded-lg flex items-center px-4">
                    <span className="text-gray-400">Loading...</span>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-14 px-8 rounded-lg flex items-center justify-center">
                    <span className="text-white font-medium">Get Started</span>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-8 text-sm text-gray-400"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full" />
                <span>Cancel anytime</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}