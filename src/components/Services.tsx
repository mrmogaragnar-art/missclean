"use client";

import { useI18n } from "@/i18n/I18nProvider";

export function Services() {
  const { t } = useI18n();
  const points = [
    { key: "safe", title: t.services.safeTitle, desc: t.services.safeDesc },
    {
      key: "family",
      title: t.services.familyTitle,
      desc: t.services.familyDesc,
    },
    {
      key: "quality",
      title: t.services.qualityTitle,
      desc: t.services.qualityDesc,
    },
  ] as const;

  return (
    <section className="section services" id="services">
      <div className="section-head">
        <h2>{t.services.title}</h2>
        <p>{t.services.sub}</p>
      </div>

      <div className="services-offers">
        <article className="service-offer">
          <h3>{t.services.hourlyTitle}</h3>
          <p>{t.services.hourlyDesc}</p>
        </article>
        <article className="service-offer">
          <h3>{t.services.dryTitle}</h3>
          <p>{t.services.dryDesc}</p>
        </article>
      </div>

      <ul className="services-points">
        {points.map((point) => (
          <li key={point.key} className="service-point">
            <h4>{point.title}</h4>
            <p>{point.desc}</p>
          </li>
        ))}
      </ul>

      <p className="deadline-note">{t.services.deadline}</p>
    </section>
  );
}
