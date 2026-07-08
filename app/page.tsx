"use client";

import { SiteBackground } from "@/components/layout/SiteBackground";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VoiceAssistant } from "@/components/voice/VoiceAssistant";

import { Hero } from "@/components/sections/Hero";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { Services } from "@/components/sections/Services";
import { Capabilities } from "@/components/sections/Capabilities";
import { Process } from "@/components/sections/Process";
import { Products } from "@/components/sections/Products";
import { Work } from "@/components/sections/Work";
import { Impact } from "@/components/sections/Impact";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <SiteBackground />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main id="top">
        <Hero />
        <TechMarquee />
        <Services />
        <Capabilities />
        <Process />
        <Products />
        <Work />
        <Impact />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
        <Contact />
      </main>
      <Footer />
      <VoiceAssistant />
    </>
  );
}
