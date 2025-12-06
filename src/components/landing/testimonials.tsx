"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      content: "eChanneling made it so easy to book a doctor appointment. The entire process took less than 5 minutes!",
      rating: 5,
    },
    {
      name: "Dr. Ahmed Hassan",
      role: "Healthcare Provider",
      content:
        "As a doctor, I appreciate how this platform streamlines my schedule and helps me serve more patients efficiently.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Patient",
      content:
        "The video consultation feature is fantastic. It saved me hours of travel time while getting quality medical advice.",
      rating: 5,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section
      id="testimonials"
      style={{
        paddingTop: "5rem",
        paddingBottom: "5rem",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        backgroundColor: "rgba(248, 250, 252, 0.5)",
      }}
    >
      <div style={{ maxWidth: "1344px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <h2 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#1e293b", marginBottom: "1rem" }}>
            Loved by Patients & Doctors
          </h2>
          <p style={{ fontSize: "1.125rem", color: "rgba(30, 41, 59, 0.6)", maxWidth: "42rem", margin: "0 auto" }}>
            See what people are saying about their experience with eChanneling.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}
        >
          {testimonials.map((testimonial, i) => (
            <motion.div key={i} variants={itemVariants} whileHover={{ y: -8 }}>
              <Card
                style={{
                  padding: "2rem",
                  backgroundColor: "white",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Stars */}
                <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem" }}>
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} style={{ width: "20px", height: "20px", fill: "#fbbf24", color: "#fbbf24" }} />
                  ))}
                </div>

                <p style={{ color: "rgba(30, 41, 59, 0.8)", marginBottom: "1.5rem", flex: 1, fontStyle: "italic" }}>
                  "{testimonial.content}"
                </p>

                <div>
                  <p style={{ fontWeight: "600", color: "#1e293b" }}>{testimonial.name}</p>
                  <p style={{ fontSize: "0.875rem", color: "rgba(30, 41, 59, 0.6)" }}>{testimonial.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
