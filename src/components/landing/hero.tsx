"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        paddingTop: "5rem",
        paddingBottom: "8rem",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          top: "2.5rem",
          left: "2.5rem",
          width: "288px",
          height: "288px",
          backgroundColor: "rgba(6, 182, 212, 0.2)",
          borderRadius: "9999px",
          filter: "blur(96px)",
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "384px",
          height: "384px",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          borderRadius: "9999px",
          filter: "blur(96px)",
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
      />

      <div style={{ position: "relative", maxWidth: "56rem", margin: "0 auto", textAlign: "center" }}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Badge */}
          <motion.div variants={itemVariants} style={{ marginBottom: "1.5rem" }}>
            <span
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                color: "#6366f1",
                border: "1px solid rgba(99, 102, 241, 0.2)",
              }}
            >
              🎯 Digital Health Made Simple
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            style={{
              fontSize: "3.5rem",
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: "1.5rem",
              lineHeight: 1.2,
            }}
          >
            Connect with Healthcare{" "}
            <span
              style={{
                background: "linear-gradient(to right, #0369a1, #06b6d4, #6366f1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Anywhere, Anytime
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            style={{
              fontSize: "1.125rem",
              color: "rgba(30, 41, 59, 0.7)",
              marginBottom: "2rem",
              maxWidth: "42rem",
              margin: "0 auto 2rem",
            }}
          >
            Book appointments with trusted healthcare providers, get professional consultations, and manage your health
            with our seamless digital platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                style={{
                  backgroundColor: "#0369a1",
                  color: "white",
                  padding: "1.5rem 2rem",
                  fontSize: "1.125rem",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                style={{
                  padding: "1.5rem 2rem",
                  fontSize: "1.125rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "transparent",
                  border: "1px solid #e2e8f0",
                }}
              >
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Stats */}
          <motion.div
            variants={itemVariants}
            style={{ marginTop: "4rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}
          >
            {[
              { label: "50K+", value: "Active Users" },
              { label: "1000+", value: "Providers" },
              { label: "98%", value: "Satisfaction" },
            ].map((stat, i) => (
              <motion.div key={i} style={{ padding: "1rem" }} whileHover={{ y: -5 }}>
                <div style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#0369a1" }}>{stat.label}</div>
                <div style={{ fontSize: "0.875rem", color: "rgba(30, 41, 59, 0.6)" }}>{stat.value}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
