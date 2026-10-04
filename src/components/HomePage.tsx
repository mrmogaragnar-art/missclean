"use client";

import { useCallback, useState } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { BeforeAfter } from "@/components/BeforeAfter";
import { BookingForm, type CalcSnapshot } from "@/components/BookingForm";
import { Calculator, type CalcApplyPayload } from "@/components/Calculator";
import { Contact } from "@/components/Contact";
import { Faq } from "@/components/Faq";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { VisitTracker } from "@/components/VisitTracker";
import { Works } from "@/components/Works";

function sameSnapshot(
  prev: CalcSnapshot | null,
  next: CalcApplyPayload,
): boolean {
  if (!prev) return false;
  return (
    prev.wantHourly === next.wantHourly &&
    prev.wantDry === next.wantDry &&
    prev.hours === next.hours &&
    prev.carpetSqm === next.carpetSqm &&
    prev.totalLabel === next.totalLabel &&
    prev.items.join() === next.items.join() &&
    prev.bothSides.join() === next.bothSides.join()
  );
}

export function HomePage() {
  const [snapshot, setSnapshot] = useState<CalcSnapshot | null>(null);

  const syncFromCalculator = useCallback((payload: CalcApplyPayload) => {
    setSnapshot((prev) => {
      if (sameSnapshot(prev, payload)) return prev;
      return { ...payload, id: Date.now() };
    });
  }, []);

  return (
    <>
      <AnimatedBackground />
      <VisitTracker />
      <Header />
      <main>
        <Hero />
        <BeforeAfter />
        <Calculator onChange={syncFromCalculator} />
        <BookingForm snapshot={snapshot} />
        <Works />
        <Services />
        <Faq />
        <Contact />
      </main>
      <FloatingWhatsApp />
      <Footer />
    </>
  );
}
