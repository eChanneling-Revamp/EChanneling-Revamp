"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Sign up and complete your health profile with your basic information and medical history.",
    },
    {
      number: "02",
      title: "Browse Providers",
      description: "Explore our network of healthcare professionals and read verified reviews from other patients.",
    },
    {
      number: "03",
      title: "Book Appointment",
      description: "Select your preferred doctor, date, and time. Confirm and receive instant booking confirmation.",
    },
    {
      number: "04",
      title: "Attend Consultation",
      description: "Join your appointment via video call or visit the clinic. Get professional medical advice.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section
      id="how-it-works"
      style={{ paddingTop: "5rem", paddingBottom: "5rem", paddingLeft: "1rem", paddingRight: "1rem" }}
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
            Simple 4-Step Process
          </h2>
          <p style={{ fontSize: "1.125rem", color: "rgba(30, 41, 59, 0.6)", maxWidth: "42rem", margin: "0 auto" }}>
            Getting started with eChanneling is straightforward and takes just a few minutes.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={itemVariants} style={{ position: "relative" }}>
              <Card
                style={{
                  padding: "2rem",
                  height: "100%",
                  backgroundColor: "white",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Corner accent */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "128px",
                    height: "128px",
                    backgroundColor: "rgba(3, 105, 161, 0.05)",
                    borderRadius: "9999px",
                    marginRight: "-64px",
                    marginTop: "-64px",
                  }}
                />

                <div style={{ position: "relative", zIndex: 10 }}>
                  <motion.div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "0.5rem",
                      backgroundColor: "rgba(3, 105, 161, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.5rem",
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0369a1" }}>{step.number}</span>
                  </motion.div>

                  <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#1e293b", marginBottom: "0.75rem" }}>
                    {step.title}
                  </h3>
                  <p style={{ color: "rgba(30, 41, 59, 0.6)" }}>{step.description}</p>

                  {i < steps.length - 1 && (
                    <motion.div
                      style={{
                        display: "none",
                        position: "absolute",
                        right: "-16px",
                        top: "50%",
                        width: "32px",
                        height: "32px",
                        backgroundColor: "rgba(3, 105, 161, 0.2)",
                        borderRadius: "9999px",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <CheckCircle2 style={{ width: "20px", height: "20px", color: "#0369a1" }} />
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
