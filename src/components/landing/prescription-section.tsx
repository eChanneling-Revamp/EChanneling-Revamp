"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileText, Search, Clock, Shield } from "lucide-react";
import Link from "next/link";

export default function PrescriptionSection() {
  return (
    <section
      style={{
        paddingTop: "5rem",
        paddingBottom: "5rem",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        backgroundColor: "#f0f9ff",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <h2
            style={{
              fontSize: "2.25rem",
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: "1rem",
            }}
          >
            Access Your Prescriptions Anytime, Anywhere
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              color: "#64748b",
              maxWidth: "42rem",
              margin: "0 auto",
            }}
          >
            Securely view and manage your prescriptions online. Simply enter
            your prescription number to access complete details.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          {[
            {
              icon: Search,
              title: "Quick Search",
              description:
                "Find prescriptions instantly by prescription number",
            },
            {
              icon: FileText,
              title: "Complete Details",
              description:
                "View full prescription information from your doctor",
            },
            {
              icon: Clock,
              title: "Anytime Access",
              description: "Access your prescriptions 24/7 from any device",
            },
            {
              icon: Shield,
              title: "Secure & Private",
              description: "Your prescription data is encrypted and protected",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              style={{
                padding: "2rem",
                borderRadius: "0.75rem",
                backgroundColor: "white",
                border: "1px solid #e0e7ff",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <feature.icon
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  color: "#0369a1",
                  marginBottom: "1rem",
                }}
              />
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "0.5rem",
                }}
              >
                {feature.title}
              </h3>
              <p style={{ color: "#64748b" }}>{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          style={{ textAlign: "center" }}
        >
          <Link href="/prescriptions/search">
            <Button
              style={{
                backgroundColor: "#0369a1",
                color: "white",
                padding: "1rem 2.5rem",
                fontSize: "1rem",
                borderRadius: "0.5rem",
              }}
            >
              <Search className="w-4 h-4 mr-2" />
              Search Your Prescription Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
