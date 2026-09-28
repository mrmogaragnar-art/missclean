"use client";

import { useState } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { BeforeAfter } from "@/components/BeforeAfter";
import { BookingForm, type CalcSnapshot } from "@/components/BookingForm";
import { Calculator } from "@/components/Calculator";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { VisitTracker } from "@/components/VisitTracker";
import { Works } from "@/components/Works";

export function HomePage() {
  const [snapshot, setSnapshot] = useState<CalcSnapshot | null>(null);

  function applyFromCalculator(
    payload: Omit<CalcSnapshot, "id">,
  ) {
    setSnapshot({ ...payload, id: Date.now() });
  }

  return (
    <>
      <AnimatedBackground />
      <VisitTracker />
      <Header />
      <main>
        <Hero />
        <Services />
        <BeforeAfter />
        <Calculator onApply={applyFromCalculator} />
        <BookingForm snapshot={snapshot} />
        <Works />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
