"use client"

import { motion } from "framer-motion"

export default function Footer() {
  const links = [
    { label: "About", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Contact", href: "#" },
  ]

  return (
    <motion.footer
      style={{
        backgroundColor: "white",
        borderTop: "1px solid #e2e8f0",
        paddingTop: "3rem",
        paddingBottom: "3rem",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div style={{ maxWidth: "1344px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div
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
                <span style={{ color: "white", fontWeight: "bold" }}>eC</span>
              </div>
              <span style={{ fontWeight: "bold", fontSize: "1.25rem", color: "#1e293b" }}>eChanneling</span>
            </div>
            <p style={{ color: "rgba(30, 41, 59, 0.6)", maxWidth: "224px" }}>
              Making healthcare accessible, affordable, and convenient for everyone.
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {links.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  style={{ color: "rgba(30, 41, 59, 0.6)" }}
                  whileHover={{ x: 4 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "2rem" }}>
          <p style={{ textAlign: "center", color: "rgba(30, 41, 59, 0.6)" }}>
            © 2025 eChanneling. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
