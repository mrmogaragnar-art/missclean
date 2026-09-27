"use client";

import Image from "next/image";
import { useI18n } from "@/i18n/I18nProvider";

export function Services() {
  const { t } = useI18n();

  return (
    <section className="section services" id="services">
      <div className="section-head">
        <h2>{t.services.title}</h2>
        <p>{t.services.sub}</p>
      </div>
      <div className="services-grid">
        <article className="service-block">
          <div className="service-media">
            <Image
              src="/photos/hourly.jpg"
              alt=""
              fill
              sizes="(max-width: 719px) 100vw, 50vw"
              className="service-img"
            />
          </div>
          <h3>{t.services.hourlyTitle}</h3>
          <p>{t.services.hourlyDesc}</p>
        </article>
        <article className="service-block">
          <div className="service-media">
            <Image
              src="/photos/upholstery.jpg"
              alt=""
              fill
              sizes="(max-width: 719px) 100vw, 50vw"
              className="service-img"
            />
          </div>
          <h3>{t.services.dryTitle}</h3>
          <p>{t.services.dryDesc}</p>
        </article>
      </div>
      <p className="deadline-note">{t.services.deadline}</p>
    </section>
  );
}
