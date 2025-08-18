"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  MessageSquare,
  Calendar,
  BarChart3,
  PieChartIcon as PieIcon,
  Activity,
  Download,
} from "lucide-react"
import {
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Pie
} from "recharts"


const mockTweets = [
  {
    _id: "689b784b325acd8d2addf5f7",
    article_id: "86d32274-6501-4468-9465-20b0c101d6fd",
    publication_date: "2025-01-28 13:36:09.000000 UTC",
    full_text: "@just1lagos @missjorciana Why would any sane person want to make a disaster waiting to happen?",
    clean_text: "why would any sane person want to make a disaster waiting to happen",
    author: "IgboPerspective",
    language: "en",
    sentiment: "negative",
    sentiment_score: "-0.5859",
    processed_at: "2025-01-28 13:44:17.255017 UTC",
    topic: "technology",
  },
  {
    _id: "689b784b325acd8d2addf5ee",
    article_id: "d3479717-fefb-45cc-b51e-8474a10809a5",
    publication_date: "2025-01-28 13:36:18.000000 UTC",
    full_text:
      "@ECOWARRIORSS Poor forest management and allowing fuel to accumulate is a disaster. The green new scam 2.0 is just as fake.",
    clean_text:
      "poor forest management and allowing fuel to accumulate is a disaster the green new scam 2 0 is just as fake",
    author: "SailingPiper",
    language: "en",
    sentiment: "negative",
    sentiment_score: "-0.9633",
    processed_at: "2025-01-28 13:44:17.203915 UTC",
    topic: "environment",
  },
  {
    _id: "689b77fa325acd8d2addf5e8",
    article_id: "d4888e05-ce5c-4a8f-9b0d-31212f192a9a",
    publication_date: "2025-01-29 18:23:23.000000 UTC",
    full_text: "@TokenPocket_TP @ethereum @BNBCHAIN @trondao @Bitcoin Don't miss the opportunity",
    clean_text: "don t miss the opportunity",
    author: "freyyy178949",
    language: "en",
    sentiment: "positive",
    sentiment_score: "0.296",
    processed_at: "2025-01-29 18:23:39.179417 UTC",
    topic: "crypto",
  },
]

// Chart data
const sentimentDistribution = [
  { name: "Positive", value: 45, color: "#10B981" },
  { name: "Negative", value: 35, color: "#EF4444" },
  { name: "Neutral", value: 20, color: "#F59E0B" },
]

const sentimentOverTime = [
  { date: "2025-01-25", sentiment: 0.2, positive: 120, negative: 80, neutral: 50 },
  { date: "2025-01-26", sentiment: -0.1, positive: 100, negative: 110, neutral: 60 },
  { date: "2025-01-27", sentiment: 0.3, positive: 150, negative: 70, neutral: 45 },
  { date: "2025-01-28", sentiment: -0.2, positive: 90, negative: 130, neutral: 55 },
  { date: "2025-01-29", sentiment: 0.4, positive: 180, negative: 60, neutral: 40 },
]

const topAuthors = [
  { author: "CryptoExpert", posts: 45, sentiment: 0.3 },
  { author: "TechGuru", posts: 38, sentiment: -0.1 },
  { author: "MarketAnalyst", posts: 32, sentiment: 0.2 },
  { author: "NewsBot", posts: 28, sentiment: 0.0 },
  { author: "FinanceWiz", posts: 25, sentiment: 0.4 },
]

const topicSentiment = [
  { topic: "crypto", positive: 120, negative: 45, neutral: 30 },
  { topic: "technology", positive: 85, negative: 65, neutral: 40 },
  { topic: "environment", positive: 60, negative: 90, neutral: 35 },
  { topic: "general", positive: 95, negative: 55, neutral: 25 },
]

export default function XDashboard({ searchQuery }) {
  const [filteredTweets, setFilteredTweets] = useState(mockTweets)

  useEffect(() => {
    if (searchQuery) {
      const filtered = mockTweets.filter(
        (tweet) =>
          tweet.clean_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tweet.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tweet.author.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredTweets(filtered)
    } else {
      setFilteredTweets(mockTweets)
    }
  }, [searchQuery])

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
    <div className="space-y-6">
      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { icon: MessageSquare, label: "Total Posts", value: "500", change: "+12%", color: "purple" },
          { icon: TrendingUp, label: "Positive", value: "45%", change: "+5%", color: "green" },
          { icon: TrendingDown, label: "Negative", value: "35%", change: "-3%", color: "red" },
          { icon: Users, label: "Authors", value: "156", change: "+8%", color: "blue" },
        ].map((stat, index) => (
          <Card
            key={index}
            className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm hover:border-purple-400/30 transition-colors"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${
                    stat.color === "purple"
                      ? "from-purple-600/20 to-purple-400/10"
                      : stat.color === "green"
                        ? "from-green-600/20 to-green-400/10"
                        : stat.color === "red"
                          ? "from-red-600/20 to-red-400/10"
                          : "from-blue-600/20 to-blue-400/10"
                  } border border-${stat.color === "purple" ? "purple" : stat.color}-500/20`}
                >
                  <stat.icon className={`w-5 h-5 text-${stat.color === "purple" ? "purple" : stat.color}-400`} />
                </div>
                <Badge
                  className={`text-xs ${
                    stat.change.startsWith("+") ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"
                  }`}
                >
                  {stat.change}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Distribution */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <PieIcon className="w-5 h-5 mr-2 text-purple-400" />
                  Sentiment Distribution
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 bg-transparent"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={sentimentDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sentimentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                {sentimentDistribution.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-300">
                      {item.name}: {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Sentiment Over Time */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-purple-400" />
                  Sentiment Trends
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 bg-transparent"
                >
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sentimentOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.1)" />
                    <XAxis
                      dataKey="date"
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sentiment"
                      stroke="#A855F7"
                      fill="url(#colorSentiment)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Top Authors */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-400" />
                  Top Contributors
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topAuthors} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.1)" />
                    <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                    <YAxis dataKey="author" type="category" stroke="#9CA3AF" fontSize={12} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Bar dataKey="posts" fill="#A855F7" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Topic Sentiment */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                  Topic Sentiment
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicSentiment}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.1)" />
                    <XAxis dataKey="topic" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Bar dataKey="positive" stackId="a" fill="#10B981" />
                    <Bar dataKey="negative" stackId="a" fill="#EF4444" />
                    <Bar dataKey="neutral" stackId="a" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Posts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Posts</h3>
              <Badge className="text-purple-300 bg-purple-500/10 border-purple-500/20">
                {filteredTweets.length} posts
              </Badge>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredTweets.map((tweet, index) => (
                <motion.div
                  key={tweet._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-gradient-to-r from-purple-900/10 to-purple-800/5 border border-purple-500/20 hover:border-purple-400/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-white text-sm">@{tweet.author}</span>
                        <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                          {tweet.topic}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(tweet.publication_date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">{tweet.clean_text}</p>
                    </div>
                    <div className="ml-4 flex flex-col items-end space-y-2">
                      {getSentimentIcon(tweet.sentiment)}
                      <Badge className={`text-xs ${getSentimentColor(tweet.sentiment)}`}>
                        {Math.abs(Number.parseFloat(tweet.sentiment_score)).toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
