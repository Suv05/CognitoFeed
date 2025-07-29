"use client"

import { motion } from "framer-motion"
import { Zap, Twitter, Linkedin, Github, Mail,Brain} from "lucide-react"

export default function Footer() {
  const footerLinks = {
    Product: ["Features", "Pricing", "API"],
    Company: ["About", "Blog", "Contact"],
    Resources: ["Help", "Community", "Status"],
    Legal: ["Privacy", "Terms", "Security"],
  }

  return (
    <footer className="bg-black/20 backdrop-blur-sm border-t border-purple-500/20 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          <div className="lg:col-span-2">
            <motion.div
              className="flex items-center space-x-2 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="relative">
                <Brain className="h-8 w-8 text-purple-400" />
                <div className="absolute inset-0 bg-purple-400/20 blur-xl rounded-full" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                CognitoFeed
              </span>
            </motion.div>
            <p className="text-gray-400 mb-8 max-w-sm text-lg">
              AI-driven sentiment analysis for intelligent news insights.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Github, href: "#" },
                { icon: Mail, href: "#" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="w-12 h-12 bg-black/30 rounded-xl flex items-center justify-center text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-6 text-lg">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-purple-500/20 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400">© 2024 CognitoFeed. All rights reserved.</p>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <span className="text-gray-400">Made with ❤️ for the future of news</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
