import { useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { gsap } from "gsap"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Investment Analyst",
    company: "Goldman Sachs",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "CognitoFeed has revolutionized our market sentiment analysis with incredible AI accuracy.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Data Scientist",
    company: "Tesla",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "The sentiment analysis pipeline is remarkably sophisticated and reliable.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Portfolio Manager",
    company: "Vanguard",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Personalization is outstanding. It's like having an AI analyst on our team.",
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const sectionRef = useRef(null)
  const carouselRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView && typeof window !== "undefined" && carouselRef.current) {
      const carousel = carouselRef.current
      const scrollWidth = carousel.scrollWidth
      const animationDuration = scrollWidth / 40

      gsap.to(carousel, {
        x: -scrollWidth / 2,
        duration: animationDuration,
        ease: "none",
        repeat: -1,
      })
    }
  }, [isInView])

  return (
    <section ref={sectionRef} id="reviews" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl sm:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Trusted by</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-16">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "99.2%", label: "Accuracy" },
              { value: "50M+", label: "Articles" },
              { value: "4.9/5", label: "Rating" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden">
            <div ref={carouselRef} className="flex space-x-8" style={{ width: "fit-content" }}>
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <Card
                  key={index}
                  className="flex-shrink-0 w-96 bg-black/20 border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-500 group"
                >
                  <div className="p-8">
                    <Quote className="w-10 h-10 text-purple-400/30 mb-6" />

                    <p className="text-gray-300 mb-8 leading-relaxed text-lg">"{testimonial.content}"</p>

                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    <div className="flex items-center">
                      <Avatar className="w-12 h-12 mr-4">
                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-white group-hover:text-purple-300 transition-colors text-lg">
                          {testimonial.name}
                        </div>
                        <div className="text-gray-400">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  )
}
