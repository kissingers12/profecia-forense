import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Programs from "@/components/Programs";
import Book from "@/components/Book";
import About from "@/components/About";
import Events from "@/components/Events";
import Founder from "@/components/Founder";
import Biography from "@/components/Biography";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Donations from "@/components/Donations";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Book />
        <Programs />
        <About />
        <Events />
        <Founder />
        <Biography />
        <Donations />
        <Testimonials />
        <CTA />
        <Contact />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
