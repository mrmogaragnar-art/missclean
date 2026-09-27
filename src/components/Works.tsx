"use client";

import Image from "next/image";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/I18nProvider";
import { IconInstagram } from "@/components/SocialIcons";

const gallery = [
  { src: "/photos/work-mop.jpg", key: "mop" },
  { src: "/photos/work-table.jpg", key: "table" },
  { src: "/photos/work-carpet.jpg", key: "carpet" },
  { src: "/photos/work-kitchen.jpg", key: "kitchen" },
] as const;

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

      <div className="works-gallery">
        {gallery.map((shot) => (
          <figure key={shot.key} className="works-shot">
            <Image
              src={shot.src}
              alt={t.works.galleryAlt}
              fill
              sizes="(max-width: 719px) 50vw, 25vw"
              className="works-shot-img"
            />
          </figure>
        ))}
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
