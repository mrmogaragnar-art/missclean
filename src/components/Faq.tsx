"use client";

import { useI18n } from "@/i18n/I18nProvider";

export function Faq() {
  const { t } = useI18n();

  return (
    <section className="section faq" id="faq">
      <div className="section-head">
        <h2>{t.faq.title}</h2>
        <p>{t.faq.sub}</p>
      </div>
      <div className="faq-list">
        {t.faq.items.map((item) => (
          <details key={item.q} className="faq-item">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
