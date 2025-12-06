"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <motion.header
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "rgba(248, 250, 252, 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e2e8f0",
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <motion.div
          className="flex items-center gap-2"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          whileHover={{ scale: 1.05 }}
        >
          <div
            className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "0.5rem",
              backgroundColor: "#0369a1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="text-primary-foreground font-bold text-lg"
              style={{ color: "white", fontWeight: "bold", fontSize: "1.125rem" }}
            >
              eC
            </span>
          </div>
          <span
            className="font-bold text-xl text-foreground"
            style={{ fontWeight: "bold", fontSize: "1.25rem", color: "#1e293b" }}
          >
            eChanneling
          </span>
        </motion.div>

        <div className="hidden md:flex items-center gap-8" style={{ display: "none", gap: "2rem" }}>
          <a href="#features" className="text-foreground/70 hover:text-foreground transition">
            Features
          </a>
          <a href="#how-it-works" className="text-foreground/70 hover:text-foreground transition">
            How it Works
          </a>
          <a href="#testimonials" className="text-foreground/70 hover:text-foreground transition">
            Testimonials
          </a>
        </div>

        <div className="flex items-center gap-3" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Button variant="outline">Sign In</Button>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            style={{ backgroundColor: "#0369a1", color: "white" }}
          >
            Get Started
          </Button>
        </div>
      </nav>
    </motion.header>
  )
}
