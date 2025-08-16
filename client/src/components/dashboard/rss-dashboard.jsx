"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Rss,
  BarChart3,
  Activity,
  Download,
  Globe,
  FileText,
  Hash,
  Clock,
  Target,
  Filter,
  Eye,
  Zap,
} from "lucide-react"
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
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

// Mock RSS data based on your MongoDB structure
const mockRSSData = [
  {
    _id: "689b703722437372f4afc99b",
    article_id: "0948343ec22c9525b2539f0c34bf5488",
    title: "Second security issue discovered on Tea app",
    description:
      "Tea, a dating discussion app that recently suffered a high-profile cybersecurity breach, announced late Monday that some direct messages were also accessed in the incident.",
    url: "https://apnews.com/article/tea-app-dating-women-breach-messages-24c6e3ca6e8256f0594f80588607ba11",
    image_url:
      "https://dims.apnews.com/dims4/default/8015bd7/2147483647/strip/true/crop/3000x1688+0+167/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F0d%2Fe3%2F6da1b6e95cdedbad0d6ff7dd2aba%2F283bd4d18b8f4117a9c9f9480d0710ea",
    published_at: "2025-01-29T15:59:17.000Z",
    source_name: "The Associated Press",
    source_url: "https://apnews.com",
    domain: "apnews.com",
    word_count: 75,
    char_count: 468,
    sentiment: "negative",
    sentiment_score: -0.2023,
    category: "technology",
  },
  {
    _id: "689b703722437372f4afc99a",
    article_id: "57a3ff881af22c529b7c3392258a32d5",
    title: "Honolulu's climate lawsuit against oil giants reaches crucial hearing stage",
    description:
      "Honolulu is suing major fossil fuel companies, including ExxonMobil, Shell, and Chevron, over climate change impacts.",
    url: "https://apnews.com/article/honolulu-fossil-fuels-lawsuit-climate-change-511ed010f033de34d2ba268af668eb92",
    image_url:
      "https://dims.apnews.com/dims4/default/53db494/2147483647/strip/true/crop/3840x2160+0+0/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F4d%2Fd6%2F1aec8bf9593c26bfab047b2a4e46%2F68b53a3e1d4d4151b57da0742e002a50",
    published_at: "2025-01-29T08:05:23.000Z",
    source_name: "The Associated Press",
    source_url: "https://apnews.com",
    domain: "apnews.com",
    word_count: 71,
    char_count: 444,
    sentiment: "negative",
    sentiment_score: -0.7335,
    category: "technology",
  },
  // Additional mock data for better visualization
  {
    _id: "689b703722437372f4afc99c",
    title: "AI Breakthrough in Medical Diagnostics Shows Promise",
    description: "New artificial intelligence system demonstrates 95% accuracy in early cancer detection.",
    published_at: "2025-01-29T12:30:00.000Z",
    source_name: "Reuters",
    domain: "reuters.com",
    word_count: 156,
    char_count: 892,
    sentiment: "positive",
    sentiment_score: 0.7234,
    category: "health",
  },
  {
    _id: "689b703722437372f4afc99d",
    title: "Stock Markets Rally on Positive Economic Data",
    description: "Major indices surge as unemployment drops and consumer confidence rises.",
    published_at: "2025-01-29T10:15:00.000Z",
    source_name: "Bloomberg",
    domain: "bloomberg.com",
    word_count: 134,
    char_count: 678,
    sentiment: "positive",
    sentiment_score: 0.5678,
    category: "business",
  },
]

// Chart data
const sentimentDistribution = [
  { name: "Positive", value: 42, color: "#10B981" },
  { name: "Negative", value: 38, color: "#EF4444" },
  { name: "Neutral", value: 20, color: "#F59E0B" },
]

const sentimentByCategory = [
  { category: "technology", positive: 25, negative: 45, neutral: 15 },
  { category: "business", positive: 55, negative: 25, neutral: 20 },
  { category: "health", positive: 65, negative: 15, neutral: 20 },
  { category: "science", positive: 70, negative: 10, neutral: 20 },
  { category: "sports", positive: 80, negative: 10, neutral: 10 },
]

const sentimentTrends = [
  { date: "2025-01-25", sentiment: 0.1, positive: 45, negative: 35, neutral: 20 },
  { date: "2025-01-26", sentiment: -0.2, positive: 38, negative: 42, neutral: 20 },
  { date: "2025-01-27", sentiment: 0.3, positive: 52, negative: 28, neutral: 20 },
  { date: "2025-01-28", sentiment: -0.1, positive: 40, negative: 40, neutral: 20 },
  { date: "2025-01-29", sentiment: 0.2, positive: 48, negative: 32, neutral: 20 },
]

const sourceAnalysis = [
  { source: "The Associated Press", articles: 156, avgSentiment: -0.1, reliability: 95 },
  { source: "Reuters", articles: 134, avgSentiment: 0.2, reliability: 94 },
  { source: "Bloomberg", articles: 98, avgSentiment: 0.3, reliability: 92 },
  { source: "BBC News", articles: 87, avgSentiment: 0.0, reliability: 93 },
  { source: "CNN", articles: 76, avgSentiment: -0.2, reliability: 88 },
]

const categoryTreemap = [
  { name: "Technology", size: 245, sentiment: -0.1 },
  { name: "Business", size: 198, sentiment: 0.2 },
  { name: "Health", size: 156, sentiment: 0.4 },
  { name: "Science", size: 134, sentiment: 0.3 },
  { name: "Sports", size: 98, sentiment: 0.5 },
  { name: "Entertainment", size: 87, sentiment: 0.1 },
]

const articleMetadata = [
  { range: "0-50", count: 23, avgSentiment: -0.1 },
  { range: "51-100", count: 45, avgSentiment: 0.0 },
  { range: "101-150", count: 67, avgSentiment: 0.1 },
  { range: "151-200", count: 34, avgSentiment: 0.2 },
  { range: "200+", count: 18, avgSentiment: 0.3 },
]

const wordCountVsSentiment = [
  { wordCount: 45, sentiment: -0.3, category: "technology" },
  { wordCount: 78, sentiment: 0.2, category: "business" },
  { wordCount: 123, sentiment: -0.1, category: "health" },
  { wordCount: 156, sentiment: 0.4, category: "science" },
  { wordCount: 89, sentiment: 0.1, category: "sports" },
  { wordCount: 167, sentiment: -0.2, category: "technology" },
  { wordCount: 134, sentiment: 0.3, category: "business" },
  { wordCount: 98, sentiment: 0.5, category: "health" },
]

const keywordTrends = [
  { keyword: "AI", count: 67, sentiment: 0.3, trend: "up" },
  { keyword: "Climate", count: 54, sentiment: -0.4, trend: "up" },
  { keyword: "Economy", count: 45, sentiment: 0.1, trend: "stable" },
  { keyword: "Security", count: 38, sentiment: -0.6, trend: "up" },
  { keyword: "Health", count: 34, sentiment: 0.4, trend: "down" },
  { keyword: "Technology", count: 29, sentiment: 0.0, trend: "stable" },
]

const hourlyActivity = [
  { hour: "00", articles: 12, sentiment: 0.1 },
  { hour: "06", articles: 45, sentiment: -0.1 },
  { hour: "12", articles: 89, sentiment: 0.2 },
  { hour: "18", articles: 67, sentiment: -0.2 },
]

export default function RSSFeedDashboard({ searchQuery }) {
  const [filteredData, setFilteredData] = useState(mockRSSData)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSource, setSelectedSource] = useState("all")
  const [sentimentFilter, setSentimentFilter] = useState("all")
  const [timeRange, setTimeRange] = useState("7d")

  useEffect(() => {
    let filtered = mockRSSData

    if (searchQuery) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.source_name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((article) => article.category === selectedCategory)
    }

    if (selectedSource !== "all") {
      filtered = filtered.filter((article) => article.source_name === selectedSource)
    }

    if (sentimentFilter !== "all") {
      filtered = filtered.filter((article) => article.sentiment === sentimentFilter)
    }

    setFilteredData(filtered)
  }, [searchQuery, selectedCategory, selectedSource, sentimentFilter])

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
      {/* Advanced Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="bg-black/40 border-purple-500/30 text-white">
            <SelectValue placeholder="Category" />
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

        <Select value={selectedSource} onValueChange={setSelectedSource}>
          <SelectTrigger className="bg-black/40 border-purple-500/30 text-white">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-purple-500/30">
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="The Associated Press">Associated Press</SelectItem>
            <SelectItem value="Reuters">Reuters</SelectItem>
            <SelectItem value="Bloomberg">Bloomberg</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
          <SelectTrigger className="bg-black/40 border-purple-500/30 text-white">
            <SelectValue placeholder="Sentiment" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-purple-500/30">
            <SelectItem value="all">All Sentiment</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="bg-black/40 border-purple-500/30 text-white">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-purple-500/30">
            <SelectItem value="1d">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 bg-transparent"
        >
          <Filter className="w-4 h-4 mr-2" />
          Advanced
        </Button>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4"
      >
        {[
          { icon: Rss, label: "RSS Articles", value: "2.8K", change: "+18%", color: "purple" },
          { icon: TrendingUp, label: "Positive", value: "42%", change: "+7%", color: "green" },
          { icon: TrendingDown, label: "Negative", value: "38%", change: "-4%", color: "red" },
          { icon: Globe, label: "Sources", value: "127", change: "+15%", color: "blue" },
          { icon: Zap, label: "Avg Processing", value: "1.2s", change: "-12%", color: "cyan" },
          { icon: Eye, label: "Trending", value: "AI", change: "↗️", color: "orange" },
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
                            : stat.color === "cyan"
                              ? "from-cyan-600/20 to-cyan-400/10"
                              : "from-orange-600/20 to-orange-400/10"
                  } border border-${stat.color === "purple" ? "purple" : stat.color}-500/20`}
                >
                  <stat.icon className={`w-4 h-4 text-${stat.color === "purple" ? "purple" : stat.color}-400`} />
                </div>
                <Badge
                  className={`text-xs ${
                    stat.change.startsWith("+") || stat.change.includes("↗️")
                      ? "text-green-400 bg-green-400/10"
                      : "text-red-400 bg-red-400/10"
                  }`}
                >
                  {stat.change}
                </Badge>
              </div>
              <div className="text-lg font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Main Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Sentiment Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-purple-400" />
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
                  <PieChart>
                    <Pie
                      data={sentimentDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
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
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
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

        {/* Sentiment by Category */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                  Category Sentiment
                </h3>
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

        {/* Sentiment Trends Over Time */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-purple-400" />
                  Sentiment Trends
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sentimentTrends}>
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
                    <Line
                      type="monotone"
                      dataKey="sentiment"
                      stroke="#A855F7"
                      strokeWidth={3}
                      dot={{ fill: "#A855F7", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Source Analysis */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-purple-400" />
                  Source Analysis
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceAnalysis} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.1)" />
                    <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                    <YAxis dataKey="source" type="category" stroke="#9CA3AF" fontSize={12} width={120} />
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

        {/* Article Length Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-400" />
                  Article Length
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={articleMetadata}>
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

        {/* Word Count vs Sentiment Scatter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-400" />
                  Length vs Sentiment
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={wordCountVsSentiment}>
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
      </div>

      {/* Keyword Trends & Hourly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Keywords */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
          <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Hash className="w-5 h-5 mr-2 text-purple-400" />
                  Trending Keywords
                </h3>
              </div>
              <div className="space-y-4">
                {keywordTrends.map((keyword, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-900/10 to-purple-800/5 border border-purple-500/20"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-white font-medium">{keyword.keyword}</div>
                      <Badge className="text-xs bg-purple-500/10 text-purple-300 border-purple-500/20">
                        {keyword.count}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={`text-xs ${
                          keyword.sentiment > 0
                            ? "text-green-400 bg-green-400/10"
                            : keyword.sentiment < 0
                              ? "text-red-400 bg-red-400/10"
                              : "text-yellow-400 bg-yellow-400/10"
                        }`}
                      >
                        {keyword.sentiment.toFixed(2)}
                      </Badge>
                      <div
                        className={`text-xs ${
                          keyword.trend === "up"
                            ? "text-green-400"
                            : keyword.trend === "down"
                              ? "text-red-400"
                              : "text-gray-400"
                        }`}
                      >
                        {keyword.trend === "up" ? "↗️" : keyword.trend === "down" ? "↘️" : "→"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Hourly Activity */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
          <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-purple-400" />
                  Hourly Activity
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={hourlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.1)" />
                    <XAxis dataKey="hour" stroke="#9CA3AF" fontSize={12} />
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
                    <Bar yAxisId="left" dataKey="articles" fill="#A855F7" opacity={0.6} />
                    <Line
                      yAxisId="right"
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
      </div>

      {/* Latest RSS Articles Feed */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <Card className="bg-gradient-to-br from-black/40 to-purple-950/20 border-purple-500/20 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Rss className="w-5 h-5 mr-2 text-purple-400" />
                Latest RSS Articles
              </h3>
              <Badge className="text-purple-300 bg-purple-500/10 border-purple-500/20">
                {filteredData.length} articles
              </Badge>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredData.map((article, index) => (
                <motion.div
                  key={article._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-gradient-to-r from-purple-900/10 to-purple-800/5 border border-purple-500/20 hover:border-purple-400/30 transition-colors group"
                >
                  <div className="flex items-start space-x-4">
                    {article.image_url && (
                      <div className="flex-shrink-0">
                        <img
                          src={article.image_url || "/placeholder.svg"}
                          alt={article.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-white text-sm">{article.source_name}</span>
                        <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                          {article.category}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(article.published_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-white font-medium mb-2 line-clamp-2 group-hover:text-purple-200 transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2">{article.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>{article.word_count} words</span>
                          <span>{article.domain}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getSentimentIcon(article.sentiment)}
                          <Badge className={`text-xs ${getSentimentColor(article.sentiment)}`}>
                            {Math.abs(article.sentiment_score).toFixed(2)}
                          </Badge>
                        </div>
                      </div>
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
