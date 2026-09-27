"use client";

import { useI18n } from "@/i18n/I18nProvider";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="site-footer">
      <p>{t.footer.rights}</p>
      <p>{t.footer.note}</p>
    </footer>
  );
}
