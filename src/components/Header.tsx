"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nProvider";

export function Header() {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className={`site-header ${menuOpen ? "is-menu-open" : ""}`}>
      <a href="#top" className="brand-lockup" aria-label="Miss Clean" onClick={closeMenu}>
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

      <div className="header-actions">
        <LanguageSwitcher />
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="sr-only">{menuOpen ? "Close" : "Menu"}</span>
          <span className="nav-toggle-bar" aria-hidden />
          <span className="nav-toggle-bar" aria-hidden />
          <span className="nav-toggle-bar" aria-hidden />
        </button>
      </div>

      <nav
        id="site-nav"
        className={`site-nav ${menuOpen ? "is-open" : ""}`}
        aria-label="Main"
      >
        <a href="#services" onClick={closeMenu}>
          {t.nav.services}
        </a>
        <a href="#calculator" onClick={closeMenu}>
          {t.nav.calculator}
        </a>
        <a href="#book" onClick={closeMenu}>
          {t.nav.book}
        </a>
        <a href="#works" onClick={closeMenu}>
          {t.nav.works}
        </a>
        <a href="#contact" onClick={closeMenu}>
          {t.nav.contact}
        </a>
      </nav>
    </header>
  );
}
