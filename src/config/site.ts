/**
 * Контакты, цены и ссылки Miss Clean.
 * Меняйте значения здесь — больше нигде.
 */

export const siteConfig = {
  brand: "Miss Clean",
  city: "Valencia",
  lastOrderHour: 20,

  /** Телефон для звонков */
  phone: "+34 651 156 133",
  phoneHref: "tel:+34651156133",

  /** WhatsApp без пробелов и плюса в цифрах ссылки */
  whatsapp: "+34 651 156 133",
  whatsappHref: "https://wa.me/34651156133",

  /** Instagram профиль */
  instagram: "miss.clean.vln",
  instagramHref: "https://www.instagram.com/miss.clean.vln/",

  /**
   * Ссылки на рилсы Instagram для блока «Как мы работаем».
   * Вставьте/замените URL — появятся встроенные видео.
   */
  instagramEmbeds: [
    "https://www.instagram.com/reel/DcSwe2UN7B7/",
    "https://www.instagram.com/reel/DavBnKstQgG/",
    "https://www.instagram.com/reel/DdrTRiANvnK/",
  ] as string[],

  prices: {
    hourly: 18,
    minHours: 2,
    visitFee: 40,
    items: {
      sofa_2: 45,
      sofa_3: 60,
      sofa_corner: 80,
      armchair: 28,
      chair: 15,
      mattress_single: 35,
      mattress_double: 50,
      mattress_king: 65,
      carpet_small: 30,
      carpet_medium: 50,
      carpet_large: 80,
    } as const,
  },

  /** Слоты для быстрой записи (локальное время Валенсии / устройства) */
  bookingSlots: ["10:00", "12:00", "15:00", "18:00"] as const,
  bookingDaysAhead: 7,
} as const;

export type DryCleanItemId = keyof typeof siteConfig.prices.items;

export const dryCleanItemIds = Object.keys(
  siteConfig.prices.items,
) as DryCleanItemId[];

export type Locale = "es" | "en" | "ru" | "uk";

export const locales: Locale[] = ["es", "en", "ru", "uk"];
export const defaultLocale: Locale = "es";
