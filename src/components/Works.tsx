"use client";

import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/I18nProvider";
import { IconInstagram } from "@/components/SocialIcons";

function reelEmbedSrc(url: string): string {
  const clean = url.split("?")[0].replace(/\/$/, "");
  return `${clean}/embed`;
}

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

      {embeds.length > 0 ? (
        <div className="works-reels">
          {embeds.map((url) => (
            <div key={url} className="works-reel">
              <iframe
                src={reelEmbedSrc(url)}
                title={t.works.galleryAlt}
                className="works-reel-frame"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      ) : null}

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
      </div>
    </section>
  );
}
