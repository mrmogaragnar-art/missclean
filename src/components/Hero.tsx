"use client";

import Image from "next/image";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/I18nProvider";
import { IconWhatsApp } from "@/components/SocialIcons";

export function Hero() {
  const { t } = useI18n();

  function goCalc(service: "hourly" | "dry") {
    window.location.hash =
      service === "dry" ? "calculator-dry" : "calculator-hourly";
    document
      .getElementById("calculator")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="brand-mark">miss clean</p>
        <h1>{t.hero.headline}</h1>
        <p className="hero-sub">{t.hero.sub}</p>

        <p className="hero-pick-label">{t.hero.pickLabel}</p>
        <div className="hero-service-pick">
          <button
            type="button"
            className="hero-service-btn"
            onClick={() => goCalc("hourly")}
          >
            <span className="hero-service-title">{t.hero.ctaHourly}</span>
            <span className="hero-service-desc">{t.hero.ctaHourlyHint}</span>
          </button>
          <button
            type="button"
            className="hero-service-btn hero-service-btn-dry"
            onClick={() => goCalc("dry")}
          >
            <span className="hero-service-title">{t.hero.ctaDry}</span>
            <span className="hero-service-desc">{t.hero.ctaDryHint}</span>
          </button>
        </div>

        <div className="hero-actions">
          <a
            className="btn btn-ghost"
            href={siteConfig.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconWhatsApp className="btn-icon" />
            {t.hero.ctaWhatsapp}
          </a>
          <a className="btn btn-ghost hero-link-book" href="#book">
            {t.hero.ctaBook}
          </a>
        </div>
      </div>
      <div className="hero-visual" aria-hidden>
        <Image
          src="/photos/hero.jpg"
          alt=""
          fill
          className="hero-photo"
          priority
          sizes="(max-width: 768px) 100vw, 55vw"
        />
        <Image
          src="/pattern-wave.png"
          alt=""
          fill
          className="hero-pattern"
          sizes="(max-width: 768px) 100vw, 55vw"
        />
      </div>
    </section>
  );
}
