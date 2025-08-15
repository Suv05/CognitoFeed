"use client"

import { SignUp } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { Brain, Sparkles, ArrowLeft, Users, Shield, Zap } from "lucide-react"
import Link from "next/link"
import ParticleBackground from "@/components/home/particle-background"

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Main Background */}
      <div className="absolute inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />

      <ParticleBackground />

      <div className="relative z-10 min-h-screen">
        {/* Mobile Layout - Stack vertically */}
        <div className="lg:hidden">
          {/* Mobile Header with Logo and Back Button */}
          <div className="px-4 py-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              <Link
                href="/"
                className="inline-flex items-center text-purple-300 hover:text-white transition-colors duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm">Back to Home</span>
              </Link>
            </motion.div>

            {/* Mobile Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-center space-x-3 mb-8"
            >
              <div className="relative">
                <Brain className="h-8 w-8 text-purple-400" />
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
          </div>

          {/* Mobile Sign Up Form - Centered */}
          <div className="flex items-center justify-center px-3 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-md"
            >
              {/* Sign Up Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative"
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-400/20 blur-2xl rounded-3xl" />

                {/* Main Card */}
                <div className="relative bg-gradient-to-br from-black/60 to-purple-950/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 overflow-hidden">
                  {/* Floating Decorations */}
                  <div className="absolute top-4 right-4">
                    <Sparkles className="w-5 h-5 text-purple-400/30" />
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-2 h-2 bg-purple-400/20 rounded-full" />
                  </div>

                  {/* Header */}
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold mb-2">
                      <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        Create Account
                      </span>
                    </h2>
                    <p className="text-purple-200 text-sm">Start your intelligent news journey</p>
                  </div>

                  {/* Clerk Sign Up Component */}
                  <div className="clerk-signup-wrapper w-full overflow-hidden">
                    <SignUp
                      appearance={{
                        elements: {
                          rootBox: "mx-auto w-full",
                          card: "bg-transparent shadow-none border-0 p-0 w-full max-w-none",
                          headerTitle: "hidden",
                          headerSubtitle: "hidden",
                          socialButtonsBlockButton:
                            "bg-gradient-to-r from-purple-900/30 to-purple-800/20 border border-purple-500/30 text-white hover:bg-purple-500/20 hover:border-purple-400/40 transition-all duration-300 text-sm w-full",
                          socialButtonsBlockButtonText: "text-white font-medium text-sm",
                          dividerLine: "bg-purple-500/30",
                          dividerText: "text-purple-200 text-sm",
                          formFieldInput:
                            "bg-black/40 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-lg text-sm w-full",
                          formFieldLabel: "text-purple-200 text-sm font-medium",
                          formButtonPrimary:
                            "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white border-0 shadow-lg shadow-purple-500/25 rounded-lg font-medium transition-all duration-300 text-sm w-full",
                          footerActionLink: "text-purple-300 hover:text-white transition-colors text-sm",
                          identityPreviewText: "text-purple-200 text-sm",
                          identityPreviewEditButton: "text-purple-300 hover:text-white text-sm",
                          formResendCodeLink: "text-purple-300 hover:text-white text-sm",
                          otpCodeFieldInput:
                            "bg-black/40 border-purple-500/30 text-white focus:border-purple-400 focus:ring-purple-400/20 text-sm",
                          alertText: "text-red-300 text-sm",
                          formFieldErrorText: "text-red-300 text-sm",
                          footerActionText: "text-gray-400 text-sm",
                          footer: "w-full",
                          formButtonRow: "w-full",
                          formFieldRow: "w-full",
                          socialButtonsBlockButtonArrow: "hidden",
                        },
                        layout: {
                          socialButtonsPlacement: "top",
                          showOptionalFields: false,
                        },
                      }}
                    />
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 pt-4 border-t border-purple-500/20">
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        <span>Secure</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                        <span>Encrypted</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Desktop Layout - Side by side */}
        <div className="hidden lg:flex min-h-screen">
          {/* Left Side - Branding */}
          <div className="lg:w-1/2 flex flex-col justify-center px-12 xl:px-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-12">
                <div className="relative">
                  <Brain className="h-10 w-10 text-purple-400" />
                  <motion.div
                    className="absolute inset-0 bg-purple-400/30 blur-lg rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  CognitoFeed
                </span>
              </div>

              {/* Hero Content */}
              <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">
                  Join the Future of
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-200 bg-clip-text text-transparent">
                  News Analysis
                </span>
              </h1>

              <p className="text-xl text-purple-200 mb-8 max-w-md leading-relaxed">
                Experience AI-powered sentiment analysis and personalized news insights
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8 max-w-md">
                {[
                  { icon: Shield, text: "Advanced Security & Privacy" },
                  { icon: Zap, text: "Real-time Sentiment Analysis" },
                  { icon: Users, text: "Join 10K+ Active Users" },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-purple-200 text-sm">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 max-w-md">
                {[
                  { value: "10K+", label: "Users" },
                  { value: "1M+", label: "Articles" },
                  { value: "99.5%", label: "Uptime" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-purple-200">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Floating Elements */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/60 rounded-full"
                animate={{ y: [-10, 10, -10], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="absolute top-1/2 left-1/3 w-1 h-1 bg-purple-300/40 rounded-full"
                animate={{ y: [10, -10, 10], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-purple-500/30 rounded-full"
                animate={{ y: [-15, 15, -15], opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <div className="lg:w-1/2 flex items-center justify-center px-6 py-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-md"
            >
              {/* Back Button */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8"
              >
                <Link
                  href="/"
                  className="inline-flex items-center text-purple-300 hover:text-white transition-colors duration-300 group"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm">Back to Home</span>
                </Link>
              </motion.div>

              {/* Sign Up Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative"
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-400/20 blur-2xl rounded-3xl" />

                {/* Main Card */}
                <div className="relative bg-gradient-to-br from-black/60 to-purple-950/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 overflow-hidden">
                  {/* Floating Decorations */}
                  <div className="absolute top-4 right-4">
                    <Sparkles className="w-5 h-5 text-purple-400/30" />
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-2 h-2 bg-purple-400/20 rounded-full" />
                  </div>

                  {/* Header */}
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">
                      <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        Create Account
                      </span>
                    </h2>
                    <p className="text-purple-200 text-sm">Start your intelligent news journey</p>
                  </div>

                  {/* Clerk Sign Up Component */}
                  <div className="clerk-signup-wrapper w-full overflow-hidden">
                    <SignUp
                      appearance={{
                        elements: {
                          rootBox: "mx-auto w-full",
                          card: "bg-transparent shadow-none border-0 p-0 w-full max-w-none",
                          headerTitle: "hidden",
                          headerSubtitle: "hidden",
                          socialButtonsBlockButton:
                            "bg-gradient-to-r from-purple-900/30 to-purple-800/20 border border-purple-500/30 text-white hover:bg-purple-500/20 hover:border-purple-400/40 transition-all duration-300",
                          socialButtonsBlockButtonText: "text-white font-medium",
                          dividerLine: "bg-purple-500/30",
                          dividerText: "text-purple-200 text-sm",
                          formFieldInput:
                            "bg-black/40 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-lg w-full",
                          formFieldLabel: "text-purple-200 text-sm font-medium",
                          formButtonPrimary:
                            "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white border-0 shadow-lg shadow-purple-500/25 rounded-lg font-medium transition-all duration-300 w-full",
                          footerActionLink: "text-purple-300 hover:text-white transition-colors",
                          identityPreviewText: "text-purple-200",
                          identityPreviewEditButton: "text-purple-300 hover:text-white",
                          formResendCodeLink: "text-purple-300 hover:text-white",
                          otpCodeFieldInput:
                            "bg-black/40 border-purple-500/30 text-white focus:border-purple-400 focus:ring-purple-400/20",
                          alertText: "text-red-300",
                          formFieldErrorText: "text-red-300 text-sm",
                          footerActionText: "text-gray-400",
                          footer: "w-full",
                          formButtonRow: "w-full",
                          formFieldRow: "w-full",
                          socialButtonsBlockButtonArrow: "hidden",
                        },
                        layout: {
                          socialButtonsPlacement: "top",
                          showOptionalFields: false,
                        },
                      }}
                    />
                  </div>

                  {/* Additional Info */}
                  <div className="mt-6 pt-6 border-t border-purple-500/20">
                    <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span>Secure Registration</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full" />
                        <span>Privacy Protected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}