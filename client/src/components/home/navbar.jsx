"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Brain, Settings, Bell, User } from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { isSignedIn, user } = useUser();

  const navOpacity = useTransform(scrollY, [0, 100], [0.7, 0.95]);
  const navBlur = useTransform(scrollY, [0, 100], [8, 24]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = ["Features", "Demo", "Reviews"];

  return (
    <motion.nav
      style={{
        backdropFilter: `blur(${navBlur}px)`,
        backgroundColor: `rgba(0, 0, 0, ${navOpacity})`,
      }}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 border-b ${
        isScrolled
          ? "border-purple-500/20 shadow-lg shadow-purple-900/20 bg-black"
          : "border-transparent"
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
            <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
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

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {!isSignedIn ? (
              // Show sign in/up buttons when not signed in
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:bg-white/10 text-sm"
                    asChild
                  >
                    <Link href="/sign-in">
                      <span className="inline-flex animate-text-gradient bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text text-sm text-transparent">
                        Sign In
                      </span>
                    </Link>
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
                    asChild
                  >
                    <Link href="/sign-up">Get Started</Link>
                  </Button>
                </motion.div>
              </>
            ) : (
              // Show authenticated user buttons when signed in
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:bg-white/10 hover:text-purple-300 transition-all duration-300 relative group"
                    title="Settings"
                  >
                    <Settings className="h-4 w-4" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-purple-400/10 rounded-lg opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.2 }}
                    />
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:bg-white/10 hover:text-purple-300 transition-all duration-300 relative group"
                    title="Notifications"
                  >
                    <Bell className="h-4 w-4" />
                    {/* Notification badge */}
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse mr-3" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-purple-400/10 rounded-lg opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.2 }}
                    />
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex items-center"
                >
                  {/* Welcome message */}
                  {/* <span className="text-sm text-purple-200 mr-3 hidden lg:block">
                    Welcome, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0]}
                  </span> */}
                  
                  {/* Clerk UserButton with custom styling */}
                  <div className="relative">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8 ring-2 ring-purple-400/30 ring-offset-2 ring-offset-black hover:ring-purple-400/60 transition-all duration-300",
                          userButtonPopoverCard: "bg-black/90 backdrop-blur-xl border border-purple-500/30",
                          userButtonPopoverActionButton: "text-gray-300 hover:text-white hover:bg-purple-500/20",
                          userButtonPopoverActionButtonText: "text-gray-300",
                          userButtonPopoverFooter: "hidden"
                        }
                      }}
                    />
                  </div>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
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
            
            <div className="pt-3 space-y-3 border-t border-purple-500/20">
              {!isSignedIn ? (
                // Mobile auth buttons for non-signed in users
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start hover:bg-white/10"
                    asChild
                  >
                    <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                      <span className="inline-flex animate-text-gradient bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text text-sm text-transparent">
                        Sign In
                      </span>
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white"
                    asChild
                  >
                    <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </>
              ) : (
                // Mobile auth section for signed in users
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8 ring-2 ring-purple-400/30",
                        }
                      }}
                    />
                    <span className="text-sm text-purple-200">
                      {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0]}
                    </span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start hover:bg-white/10 text-gray-300"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start hover:bg-white/10 text-gray-300"
                  >
                    <Bell className="h-4 w-4 mr-3" />
                    Notifications
                    <div className="ml-auto h-2 w-2 bg-red-500 rounded-full" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}