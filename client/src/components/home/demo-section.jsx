"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Play, Pause, RotateCcw } from "lucide-react"

const mockData = [
  {
    title: "Tesla Stock Surges After Q4 Earnings Beat",
    source: "Financial Times",
    sentiment: "positive",
    score: 0.85,
    category: "stock",
    time: "2h",
  },
  {
    title: "AI Startup Funding Reaches Record High",
    source: "TechCrunch",
    sentiment: "positive",
    score: 0.92,
    category: "AI",
    time: "4h",
  },
  {
    title: "Market Volatility Concerns Grow",
    source: "Bloomberg",
    sentiment: "negative",
    score: -0.67,
    category: "stock",
    time: "6h",
  },
]

const sentimentData = [
  { time: "9AM", positive: 65, negative: 20, neutral: 15 },
  { time: "12PM", positive: 72, negative: 18, neutral: 10 },
  { time: "3PM", positive: 68, negative: 25, neutral: 7 },
  { time: "6PM", positive: 75, negative: 15, neutral: 10 },
]

export default function DemoSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentDataIndex, setCurrentDataIndex] = useState(0)

  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentDataIndex((prev) => (prev + 1) % mockData.length)
      }, 2000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case "negative":
        return <TrendingDown className="w-4 h-4 text-red-400" />
      default:
        return <Minus className="w-4 h-4 text-yellow-400" />
    }
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "text-green-400 bg-green-400/10 border-green-400/20"
      case "negative":
        return "text-red-400 bg-red-400/10 border-red-400/20"
      default:
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
    }
  }

  return (
    <section ref={sectionRef} id="demo" className="py-32 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl sm:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Live Demo
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* News Feed Demo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm h-full">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-semibold text-white">Live Feed</h3>
                  <div className="flex items-center space-x-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentDataIndex(0)}
                      className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {mockData.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: isPlaying && index === currentDataIndex ? 1 : 0.6,
                        y: 0,
                        scale: isPlaying && index === currentDataIndex ? 1.02 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className={`p-6 rounded-xl border transition-all duration-300 ${
                        isPlaying && index === currentDataIndex
                          ? "bg-purple-500/10 border-purple-500/30 shadow-lg shadow-purple-500/10"
                          : "bg-black/20 border-purple-500/10"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-white font-medium line-clamp-2 flex-1">{item.title}</h4>
                        <div className="ml-3 flex-shrink-0">{getSentimentIcon(item.sentiment)}</div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <span>{item.source}</span>
                        <span>{item.time}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge className={`${getSentimentColor(item.sentiment)}`}>
                          {item.sentiment} {Math.abs(item.score).toFixed(2)}
                        </Badge>
                        <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                          {item.category}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Sentiment Analytics */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm h-full">
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-white mb-8">Analytics</h3>

                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-gray-400">Today's Sentiment</span>
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full" />
                        <span className="text-gray-400">Positive</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full" />
                        <span className="text-gray-400">Negative</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                        <span className="text-gray-400">Neutral</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {sentimentData.map((data, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <span className="text-gray-400 w-12 text-sm">{data.time}</span>
                        <div className="flex-1 flex rounded-full overflow-hidden h-3">
                          <div
                            className="bg-green-400 transition-all duration-1000"
                            style={{ width: `${data.positive}%` }}
                          />
                          <div
                            className="bg-red-400 transition-all duration-1000"
                            style={{ width: `${data.negative}%` }}
                          />
                          <div
                            className="bg-yellow-400 transition-all duration-1000"
                            style={{ width: `${data.neutral}%` }}
                          />
                        </div>
                        <span className="text-green-400 w-10 text-sm">{data.positive}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="text-3xl font-bold text-green-400 mb-2">72%</div>
                    <div className="text-gray-400 text-sm">Positive</div>
                  </div>
                  <div className="p-6 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <div className="text-3xl font-bold text-purple-400 mb-2">1.2K</div>
                    <div className="text-gray-400 text-sm">Articles</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
