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
import Navbar from "../home/navbar"
import Footer from "../home/footer"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("x-dashboard")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />
      <ParticleBackground />

      <div className="relative z-10 min-h-screen flex flex-col pt-16">
        {/* Navbar */}
        <Navbar />



        {/* Main Dashboard Content */}
        <div className="flex-grow">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Controls and Tab Navigation */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8"
              >
                {/* Tab Navigation */}
                <TabsList className="grid w-full max-w-lg grid-cols-3 bg-black/40 border border-purple-500/20 h-12">
                  <TabsTrigger
                    value="x-dashboard"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white text-purple-200 font-medium"
                  >
                    𝕏 Dashboard
                  </TabsTrigger>
                  <TabsTrigger
                    value="news-dashboard"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white text-purple-200 font-medium"
                  >
                    News Dashboard
                  </TabsTrigger>
                  <TabsTrigger
                    value="rss-dashboard"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white text-purple-200 font-medium"
                  >
                    RSS Dashboard
                  </TabsTrigger>
                </TabsList>

                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search keywords, topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-black/40 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 w-full sm:w-80"
                    />
                  </div>
                  <div className="flex gap-3">
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
              </motion.div>

              {/* Tab Content */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }}
              >
                <TabsContent value="x-dashboard" className="space-y-6 mt-0">
                  <XDashboard searchQuery={searchQuery} />
                </TabsContent>

                <TabsContent value="news-dashboard" className="space-y-6 mt-0">
                  <NewsDashboard searchQuery={searchQuery} />
                </TabsContent>

                <TabsContent value="rss-dashboard" className="space-y-6 mt-0">
                  <RSSFeedDashboard searchQuery={searchQuery} />
                </TabsContent>
              </motion.div>
            </Tabs>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}