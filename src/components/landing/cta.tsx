"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section style={{ paddingTop: "5rem", paddingBottom: "5rem", paddingLeft: "1rem", paddingRight: "1rem" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        style={{ maxWidth: "56rem", margin: "0 auto" }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "1rem",
            background: "linear-gradient(to right, #0369a1, #06b6d4)",
            padding: "4rem",
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "384px",
              height: "384px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "9999px",
              filter: "blur(96px)",
              marginLeft: "-192px",
              marginTop: "-192px",
            }}
            animate={{ x: [0, 30, 0], y: [0, 50, 0] }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          />

          <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
            <motion.h2
              style={{ fontSize: "2.25rem", fontWeight: "bold", color: "white", marginBottom: "1.5rem" }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Ready to Transform Your Healthcare?
            </motion.h2>

            <motion.p
              style={{
                fontSize: "1.125rem",
                color: "rgba(255, 255, 255, 0.9)",
                marginBottom: "2rem",
                maxWidth: "42rem",
                margin: "0 auto 2rem",
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Join thousands of patients who have already experienced seamless healthcare with eChanneling.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                style={{
                  backgroundColor: "white",
                  color: "#0369a1",
                  padding: "1.5rem 2rem",
                  fontSize: "1.125rem",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  margin: "0 auto",
                }}
              >
                Start Your Journey Today
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
