"use client";

import Image from "next/image";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/I18nProvider";
import { IconWhatsApp } from "@/components/SocialIcons";

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="brand-mark">miss clean</p>
        <h1>{t.hero.headline}</h1>
        <p className="hero-sub">{t.hero.sub}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#book">
            {t.hero.ctaBook}
          </a>
          <a
            className="btn btn-ghost"
            href={siteConfig.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconWhatsApp className="btn-icon" />
            {t.hero.ctaWhatsapp}
          </a>
        </div>
      </div>
      <div className="hero-visual" aria-hidden>
        <Image
          src="/pattern-wave.png"
          alt=""
          fill
          className="hero-pattern"
          priority
          sizes="(max-width: 768px) 100vw, 55vw"
        />
      </div>
    </section>
  );
}
