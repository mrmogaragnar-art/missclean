"use client";

import { locales, type Locale } from "@/config/site";
import { useI18n } from "@/i18n/I18nProvider";

const labels: Record<Locale, string> = {
  es: "ES",
  en: "EN",
  ru: "RU",
  uk: "UK",
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          className={locale === code ? "is-active" : undefined}
          onClick={() => setLocale(code)}
        >
          {labels[code]}
        </button>
      ))}
    </div>
  );
}
