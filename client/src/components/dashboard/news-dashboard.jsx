"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Newspaper,
  Calendar,
  BarChart3,
  Activity,
  Download,
  Users,
  FileText,
  Globe,
  Hash,
  Clock,
  Target,
} from "lucide-react"
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Line,
  ScatterChart,
  Scatter,
  ComposedChart,
} from "recharts"

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
]

// Mock data based on your MongoDB structure
const mockNewsData = [
  {
    _id: "689b76036aa4fbef4f8eac7b",
    title: "Crypto kidnapping: How armed gangs are hunting the internet's high rollers",
    description:
      "Kidnapping and extortion are a growing concern in the crypto world, with cases rising alongside the price of bitcoin.",
    author: "Bruna Horvath",
    published_at: "2025-01-27T10:00:00.000Z",
    keyword_used: "bitcoin",
    source_name: "NBC News",
    domain: "www.nbcnews.com",
    word_count: 68,
    char_count: 406,
    sentiment: "negative",
    sentiment_score: -0.5267,
    category: "technology",
  },
  {
    _id: "689b76036aa4fbef4f8eac51",
    title: "BlackRock's CIO fires at Fed's policy delay: 'It's not a goods economy'",
    description:
      "With crypto inflows rising and Fed criticism peaking, Rieder's support for rate cuts may shift the macro winds this week.",
    author: "Ishika Kumari",
    published_at: "2025-01-27T10:00:30.000Z",
    keyword_used: "bitcoin",
    source_name: "Ambcrypto.com",
    domain: "ambcrypto.com",
    word_count: 72,
    char_count: 407,
    sentiment: "negative",
    sentiment_score: -0.7269,
    category: "business",
  },
  // Add more mock data for better visualization
  {
    _id: "689b76036aa4fbef4f8eac52",
    title: "AI Revolution Transforms Healthcare Industry",
    description: "Artificial intelligence is revolutionizing patient care and medical diagnostics.",
    author: "Dr. Sarah Johnson",
    published_at: "2025-01-28T14:30:00.000Z",
    keyword_used: "ai",
    source_name: "TechCrunch",
    domain: "techcrunch.com",
    word_count: 145,
    char_count: 890,
    sentiment: "positive",
    sentiment_score: 0.8234,
    category: "technology",
  },
  {
    _id: "689b76036aa4fbef4f8eac53",
    title: "Stock Market Reaches New Heights",
    description: "Major indices continue their upward trajectory amid positive economic indicators.",
    author: "Michael Chen",
    published_at: "2025-01-28T09:15:00.000Z",
    keyword_used: "stock",
    source_name: "Financial Times",
    domain: "ft.com",
    word_count: 98,
    char_count: 567,
    sentiment: "positive",
    sentiment_score: 0.6543,
    category: "business",
  },
]

// Chart data
const sentimentByCategory = [
  { category: "technology", positive: 45, negative: 35, neutral: 20 },
  { category: "business", positive: 38, negative: 42, neutral: 20 },
  { category: "health", positive: 55, negative: 25, neutral: 20 },
  { category: "science", positive: 60, negative: 20, neutral: 20 },
  { category: "sports", positive: 70, negative: 15, neutral: 15 },
]

const sentimentOverTime = [
  { date: "2025-01-25", sentiment: 0.2, articles: 45 },
  { date: "2025-01-26", sentiment: -0.1, articles: 52 },
  { date: "2025-01-27", sentiment: 0.3, articles: 38 },
  { date: "2025-01-28", sentiment: -0.2, articles: 61 },
  { date: "2025-01-29", sentiment: 0.4, articles: 43 },
]

const sourceBias = [
  { source: "NBC News", articles: 45, avgSentiment: -0.2, bias: "Neutral" },
  { source: "TechCrunch", articles: 38, avgSentiment: 0.4, bias: "Positive" },
  { source: "Financial Times", articles: 32, avgSentiment: 0.1, bias: "Neutral" },
  { source: "Ambcrypto.com", articles: 28, avgSentiment: -0.5, bias: "Negative" },
  { source: "Reuters", articles: 25, avgSentiment: 0.0, bias: "Neutral" },
]

const articleLengthDistribution = [
  { range: "0-50", count: 12 },
  { range: "51-100", count: 28 },
  { range: "101-150", count: 35 },
  { range: "151-200", count: 22 },
  { range: "201+", count: 15 },
]

const categoryVolumeOverTime = [
  { date: "2025-01-25", technology: 15, business: 12, health: 8, science: 5, sports: 5 },
  { date: "2025-01-26", technology: 18, business: 15, health: 10, science: 6, sports: 3 },
  { date: "2025-01-27", technology: 12, business: 18, health: 5, science: 8, sports: 7 },
  { date: "2025-01-28", technology: 20, business: 16, health: 12, science: 7, sports: 6 },
  { date: "2025-01-29", technology: 16, business: 14, health: 8, science: 3, sports: 2 },
]

const topAuthors = [
  { author: "Bruna Horvath", articles: 15, avgSentiment: -0.3 },
  { author: "Dr. Sarah Johnson", articles: 12, avgSentiment: 0.6 },
  { author: "Michael Chen", articles: 11, avgSentiment: 0.2 },
  { author: "Ishika Kumari", articles: 9, avgSentiment: -0.4 },
  { author: "Alex Rodriguez", articles: 8, avgSentiment: 0.1 },
]

const sentimentVsWordCount = [
  { wordCount: 45, sentiment: -0.2, category: "business" },
  { wordCount: 78, sentiment: 0.4, category: "technology" },
  { wordCount: 120, sentiment: -0.6, category: "business" },
  { wordCount: 95, sentiment: 0.3, category: "health" },
  { wordCount: 156, sentiment: 0.7, category: "science" },
  { wordCount: 67, sentiment: -0.1, category: "sports" },
  { wordCount: 189, sentiment: -0.4, category: "technology" },
  { wordCount: 134, sentiment: 0.5, category: "health" },
]

const keywordFrequency = [
  { keyword: "bitcoin", count: 45, sentiment: -0.2 },
  { keyword: "ai", count: 38, sentiment: 0.4 },
  { keyword: "stock", count: 32, sentiment: 0.1 },
  { keyword: "crypto", count: 28, sentiment: -0.3 },
  { keyword: "tesla", count: 25, sentiment: 0.2 },
  { keyword: "openai", count: 22, sentiment: 0.5 },
  { keyword: "election", count: 20, sentiment: -0.1 },
  { keyword: "climate", count: 18, sentiment: -0.4 },
]

export default function NewsDashboard({ searchQuery }) {
  const [filteredNews, setFilteredNews] = useState(mockNewsData)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [timeRange, setTimeRange] = useState("7d")

  useEffect(() => {
    let filtered = mockNewsData

    if (searchQuery) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.keyword_used.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.source_name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((article) => article.category === selectedCategory)
    }

    setFilteredNews(filtered)
  }, [searchQuery, selectedCategory])

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
      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-4 items-center justify-between"
      >
        <div className="flex gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-black/40 border-purple-500/30 text-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-purple-500/30">
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-black/40 border-purple-500/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-purple-500/30">
              <SelectItem value="1d">1 Day</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {[
          { icon: Newspaper, label: "Total Articles", value: "1.2K", change: "+15%", color: "purple" },
          { icon: TrendingUp, label: "Positive", value: "52%", change: "+8%", color: "green" },
          { icon: TrendingDown, label: "Negative", value: "31%", change: "-5%", color: "red" },
          { icon: Globe, label: "Sources", value: "89", change: "+12%", color: "blue" },
          { icon: Users, label: "Authors", value: "234", change: "+6%", color: "cyan" },
        ].map((stat, index) => (
          <Card
            key={index}
            className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm hover:border-purple-400/30 transition-colors"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-2 rounded-lg bg-gradient-to-r ${
                    stat.color === "purple"
                      ? "from-purple-600/20 to-purple-400/10"
                      : stat.color === "green"
                        ? "from-green-600/20 to-green-400/10"
                        : stat.color === "red"
                          ? "from-red-600/20 to-red-400/10"
                          : stat.color === "blue"
                            ? "from-blue-600/20 to-blue-400/10"
                            : "from-cyan-600/20 to-cyan-400/10"
                  } border border-${stat.color === "purple" ? "purple" : stat.color}-500/20`}
                >
                  <stat.icon className={`w-4 h-4 text-${stat.color === "purple" ? "purple" : stat.color}-400`} />
                </div>
                <Badge
                  className={`text-xs ${
                    stat.change.startsWith("+") ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"
                  }`}
                >
                  {stat.change}
                </Badge>
              </div>
              <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment by Category */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                  Sentiment by Category
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
                  <BarChart data={sentimentByCategory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.1)" />
                    <XAxis dataKey="category" stroke="#9CA3AF" fontSize={12} />
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
                  <ComposedChart data={sentimentOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.1)" />
                    <XAxis
                      dataKey="date"
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Bar yAxisId="right" dataKey="articles" fill="#A855F7" opacity={0.3} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="sentiment"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Source Bias Analysis */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-purple-400" />
                  Source Bias Analysis
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceBias} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.1)" />
                    <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                    <YAxis dataKey="source" type="category" stroke="#9CA3AF" fontSize={12} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Bar
                      dataKey="avgSentiment"
                      fill={(entry) => (entry.avgSentiment > 0 ? "#10B981" : "#EF4444")}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Article Length Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-400" />
                  Article Length Distribution
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={articleLengthDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.1)" />
                    <XAxis dataKey="range" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Bar dataKey="count" fill="#A855F7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Category Volume Over Time */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-purple-400" />
                  Category Volume Trends
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={categoryVolumeOverTime}>
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
                    <Area type="monotone" dataKey="technology" stackId="1" stroke="#A855F7" fill="#A855F7" />
                    <Area type="monotone" dataKey="business" stackId="1" stroke="#10B981" fill="#10B981" />
                    <Area type="monotone" dataKey="health" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
                    <Area type="monotone" dataKey="science" stackId="1" stroke="#EF4444" fill="#EF4444" />
                    <Area type="monotone" dataKey="sports" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Top Authors */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-400" />
                  Top Authors
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topAuthors} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.1)" />
                    <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                    <YAxis dataKey="author" type="category" stroke="#9CA3AF" fontSize={12} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Bar dataKey="articles" fill="#A855F7" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Sentiment vs Word Count Scatter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-400" />
                  Sentiment vs Word Count
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={sentimentVsWordCount}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.1)" />
                    <XAxis dataKey="wordCount" stroke="#9CA3AF" fontSize={12} name="Word Count" />
                    <YAxis dataKey="sentiment" stroke="#9CA3AF" fontSize={12} name="Sentiment" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Scatter dataKey="sentiment" fill="#A855F7" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Keyword Frequency */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Hash className="w-5 h-5 mr-2 text-purple-400" />
                  Trending Keywords
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={keywordFrequency}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.1)" />
                    <XAxis dataKey="keyword" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Bar dataKey="count" fill="#A855F7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Articles */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Articles</h3>
              <Badge className="text-purple-300 bg-purple-500/10 border-purple-500/20">
                {filteredNews.length} articles
              </Badge>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredNews.map((article, index) => (
                <motion.div
                  key={article._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-gradient-to-r from-purple-900/10 to-purple-800/5 border border-purple-500/20 hover:border-purple-400/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-white text-sm">{article.source_name}</span>
                        <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                          {article.category}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(article.published_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-white font-medium mb-2 line-clamp-2">{article.title}</h4>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2">{article.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>By {article.author}</span>
                        <span>{article.word_count} words</span>
                        <Badge className="text-xs bg-blue-500/10 text-blue-300 border-blue-500/20">
                          {article.keyword_used}
                        </Badge>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col items-end space-y-2">
                      {getSentimentIcon(article.sentiment)}
                      <Badge className={`text-xs ${getSentimentColor(article.sentiment)}`}>
                        {Math.abs(article.sentiment_score).toFixed(2)}
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
