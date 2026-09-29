"use client";

import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/I18nProvider";
import { IconWhatsApp } from "@/components/SocialIcons";

export function FloatingWhatsApp() {
  const { t } = useI18n();

  return (
    <a
      className="float-wa"
      href={siteConfig.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.hero.ctaWhatsapp}
    >
      <IconWhatsApp className="float-wa-icon" />
      <span className="float-wa-label">{t.hero.ctaWhatsapp}</span>
    </a>
  );
}
