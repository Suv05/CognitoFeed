"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Search, Filter, RefreshCw } from "lucide-react"
import XDashboard from "./x-dashboard"
import NewsDashboard from "./news-dashboard"
import RSSFeedDashboard from "./rss-dashboard"
import ParticleBackground from "../home/particle-background"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("x-dashboard")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />
      <ParticleBackground />

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-purple-500/20 bg-black/40 backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  CognitoFeed Dashboard
                </h1>
                <p className="text-purple-200 text-sm mt-1">Real-time sentiment analysis & insights</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-black/40 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 w-64"
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 bg-transparent"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 bg-transparent"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <TabsList className="grid w-full max-w-md grid-cols-3 bg-black/40 border border-purple-500/20">
                <TabsTrigger
                  value="x-dashboard"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white text-purple-200"
                >
                  X Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="news-dashboard"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white text-purple-200"
                >
                  News Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="rss-dashboard"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white text-purple-200"
                >
                  RSS Dashboard
                </TabsTrigger>
              </TabsList>
            </motion.div>

            {/* Tab Content */}
            <div className="mt-8">
              <TabsContent value="x-dashboard" className="space-y-6">
                <XDashboard searchQuery={searchQuery} />
              </TabsContent>

              <TabsContent value="news-dashboard" className="space-y-6">
                <NewsDashboard searchQuery={searchQuery} />
              </TabsContent>

              <TabsContent value="rss-dashboard" className="space-y-6">
                <RSSFeedDashboard searchQuery={searchQuery} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
