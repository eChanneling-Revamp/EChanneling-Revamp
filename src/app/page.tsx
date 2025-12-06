import CTA from "@/components/landing/cta";
import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how-it-works";
import Testimonials from "@/components/landing/testimonials";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
