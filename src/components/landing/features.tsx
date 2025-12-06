"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Clock, Users, Shield, Smartphone, Zap, Calendar } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description:
        "Book appointments with just a few clicks. See real-time availability and choose your preferred time slot.",
    },
    {
      icon: Users,
      title: "Expert Providers",
      description: "Access a network of verified healthcare professionals across multiple specialties.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your health data is encrypted and protected with industry-leading security standards.",
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Access your appointments and health records on any device, anytime, anywhere.",
    },
    {
      icon: Zap,
      title: "Instant Consultations",
      description: "Get quick responses to your health queries with our fast consultation system.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Our dedicated support team is always ready to help you with any questions.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
      id="features"
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
            Why Choose eChanneling?
          </h2>
          <p style={{ fontSize: "1.125rem", color: "rgba(30, 41, 59, 0.6)", maxWidth: "42rem", margin: "0 auto" }}>
            Powerful features designed to make healthcare accessible and convenient for everyone.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}
        >
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div key={i} variants={itemVariants} whileHover={{ y: -8, transition: { duration: 0.3 } }}>
                <Card
                  style={{
                    padding: "1.5rem",
                    height: "100%",
                    backgroundColor: "white",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <motion.div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "0.5rem",
                      backgroundColor: "rgba(3, 105, 161, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon style={{ width: "28px", height: "28px", color: "#0369a1" }} />
                  </motion.div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#1e293b", marginBottom: "0.5rem" }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: "rgba(30, 41, 59, 0.6)" }}>{feature.description}</p>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
