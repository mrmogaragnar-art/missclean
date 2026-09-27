"use client";

import { useState } from "react";
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

  return (
    <>
      <VisitTracker />
      <Header />
      <main>
        <Hero />
        <Services />
        <Calculator onApply={setSnapshot} />
        <BookingForm snapshot={snapshot} />
        <Works />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
