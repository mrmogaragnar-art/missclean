"use client";

import Image from "next/image";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/I18nProvider";
import { IconInstagram } from "@/components/SocialIcons";

export function Works() {
  const { t } = useI18n();
  const embeds = siteConfig.instagramEmbeds.filter(
    (url) => !url.includes("PLACEHOLDER"),
  );

  return (
    <section className="section works" id="works">
      <div className="section-head">
        <h2>{t.works.title}</h2>
        <p>{t.works.sub}</p>
      </div>

      <div className="works-visual">
        <Image
          src="/pattern-people.png"
          alt=""
          width={720}
          height={420}
          className="works-pattern"
        />
      </div>

      <div className="works-actions">
        <a
          className="btn btn-primary"
          href={siteConfig.instagramHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconInstagram className="btn-icon" />
          {t.works.openProfile}
        </a>

        {embeds.map((url) => (
          <a
            key={url}
            className="btn btn-ghost"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.works.watch}
          </a>
        ))}
      </div>
    </section>
  );
}
