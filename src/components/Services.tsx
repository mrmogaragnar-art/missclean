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

  function goCalc(service: "hourly" | "dry") {
    window.location.hash = service === "dry" ? "calculator-dry" : "calculator-hourly";
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  }

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
          <button
            type="button"
            className="btn btn-ghost service-offer-cta"
            onClick={() => goCalc("hourly")}
          >
            {t.services.hourlyCta}
          </button>
        </article>
        <article className="service-offer service-offer-dry">
          <h3>{t.services.dryTitle}</h3>
          <p>{t.services.dryDesc}</p>
          <button
            type="button"
            className="btn btn-primary service-offer-cta"
            onClick={() => goCalc("dry")}
          >
            {t.services.dryCta}
          </button>
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
