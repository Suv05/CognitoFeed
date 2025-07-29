"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, Brain } from "lucide-react"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  const navOpacity = useTransform(scrollY, [0, 100], [0.7, 0.95])
  const navBlur = useTransform(scrollY, [0, 100], [8, 24])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = ["Features", "Demo", "Pricing"]

  return (
    <motion.nav
      style={{
        backdropFilter: `blur(${navBlur}px)`,
        backgroundColor: `rgba(0, 0, 0, ${navOpacity})`,
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        isScrolled ? "border-purple-500/20 shadow-lg shadow-purple-900/20" : "border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3 relative z-10"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <Brain className="h-7 w-7 text-purple-400" />
              <motion.div
                className="absolute inset-0 bg-purple-400/30 blur-lg rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              CognitoFeed
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
              >
                <motion.a
                  href={`#${item.toLowerCase()}`}
                  className="relative px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300 group text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="relative z-10">{item}</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-purple-400/10 rounded-lg opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.2 }}
                  />
                  <motion.div
                    className="absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-purple-400 to-purple-300 rounded-full"
                    initial={{ width: 0, x: "-50%" }}
                    whileHover={{ width: "70%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/5 text-sm">
                Sign In
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white border-0 shadow-lg shadow-purple-500/25 text-sm px-6"
              >
                Get Started
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-black/90 backdrop-blur-xl border-t border-purple-500/20"
        >
          <div className="px-6 py-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block px-3 py-2 text-gray-300 hover:text-purple-300 text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="pt-3 space-y-2 border-t border-purple-500/20">
              <Button variant="ghost" size="sm" className="w-full justify-start text-gray-300">
                Sign In
              </Button>
              <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white">
                Get Started
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
