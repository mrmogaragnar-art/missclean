/**
 * Контакты, цены и ссылки Miss Clean.
 * Меняйте значения здесь — больше нигде.
 */

export type DryCleanPrice = {
  /** Нижняя граница / фиксированная цена */
  from: number;
  /** Верхняя граница (если цена «от–до») */
  to?: number;
  /** Доплата за чистку с двух сторон (матрасы) */
  bothSidesExtra?: number;
};

export const siteConfig = {
  brand: "Miss Clean",
  city: "Valencia",
  /** Канонический URL сайта (мета, sitemap, schema, llms.txt) */
  siteUrl: "https://miss-clean.vercel.app",
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
      sofa_2: { from: 50 },
      sofa_3: { from: 60, to: 70 },
      sofa_corner: { from: 70, to: 90 },
      sofa_folding: { from: 80, to: 100 },
      sofa_u: { from: 100, to: 150 },
      armchair: { from: 25, to: 30 },
      office_chair: { from: 20 },
      chair: { from: 10, to: 15 },
      pouf: { from: 10, to: 15 },
      mattress_single: { from: 40, bothSidesExtra: 10 },
      mattress_double: { from: 50, bothSidesExtra: 20 },
    } satisfies Record<string, DryCleanPrice> as Record<
      | "sofa_2"
      | "sofa_3"
      | "sofa_corner"
      | "sofa_folding"
      | "sofa_u"
      | "armchair"
      | "office_chair"
      | "chair"
      | "pouf"
      | "mattress_single"
      | "mattress_double",
      DryCleanPrice
    >,
  },

  /** Ползунок размера ковра (м²). Цена — при консультации. */
  carpet: {
    minSqm: 0,
    maxSqm: 6,
    step: 1,
    defaultSqm: 0,
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
