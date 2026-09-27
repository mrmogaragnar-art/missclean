"use client";

import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/I18nProvider";
import {
  IconInstagram,
  IconPhone,
  IconWhatsApp,
} from "@/components/SocialIcons";

export function Contact() {
  const { t } = useI18n();

  return (
    <section className="section contact" id="contact">
      <div className="section-head">
        <h2>{t.contact.title}</h2>
        <p>{t.contact.sub}</p>
      </div>

      <div className="social-row">
        <a
          className="social-link"
          href={siteConfig.phoneHref}
          aria-label={t.contact.call}
          title={t.contact.call}
        >
          <IconPhone className="social-icon" />
          <span className="sr-only">{t.contact.call}</span>
        </a>
        <a
          className="social-link"
          href={siteConfig.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.contact.whatsapp}
          title={t.contact.whatsapp}
        >
          <IconWhatsApp className="social-icon" />
          <span className="sr-only">{t.contact.whatsapp}</span>
        </a>
        <a
          className="social-link"
          href={siteConfig.instagramHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.contact.instagram}
          title={t.contact.instagram}
        >
          <IconInstagram className="social-icon" />
          <span className="sr-only">{t.contact.instagram}</span>
        </a>
      </div>

      <p className="contact-numbers">{siteConfig.phone}</p>
    </section>
  );
}
