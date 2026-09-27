"use client";

import Image from "next/image";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nProvider";

export function Header() {
  const { t } = useI18n();

  return (
    <header className="site-header">
      <a href="#top" className="brand-lockup" aria-label="Miss Clean">
        <Image
          src="/logo.png"
          alt="Miss Clean"
          width={56}
          height={56}
          className="brand-logo"
          priority
        />
        <span className="brand-name">miss clean</span>
      </a>

      <nav className="site-nav" aria-label="Main">
        <a href="#services">{t.nav.services}</a>
        <a href="#calculator">{t.nav.calculator}</a>
        <a href="#book">{t.nav.book}</a>
        <a href="#works">{t.nav.works}</a>
        <a href="#contact">{t.nav.contact}</a>
      </nav>

      <LanguageSwitcher />
    </header>
  );
}
