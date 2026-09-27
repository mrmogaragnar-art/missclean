import type { Locale } from "@/config/site";
import { defaultLocale, locales } from "@/config/site";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import ru from "@/messages/ru.json";
import uk from "@/messages/uk.json";

export type Messages = typeof es;

const catalog: Record<Locale, Messages> = { es, en, ru, uk };

export function getMessages(locale: Locale): Messages {
  return catalog[locale] ?? catalog[defaultLocale];
}

export function detectLocaleFromNavigator(
  languages: readonly string[] | undefined,
): Locale {
  if (!languages?.length) return defaultLocale;
  for (const raw of languages) {
    const code = raw.toLowerCase().split("-")[0];
    if (locales.includes(code as Locale)) return code as Locale;
  }
  return defaultLocale;
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
