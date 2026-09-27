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
   * Ссылки на рилсы/посты Instagram для блока на сайте.
   * Вставьте реальные URL — появятся кнопки «Смотреть».
   */
  instagramEmbeds: [
    "https://www.instagram.com/reel/PLACEHOLDER_1/",
    "https://www.instagram.com/reel/PLACEHOLDER_2/",
  ] as string[],

  prices: {
    hourly: 18,
    minHours: 2,
    visitFee: 40,
    items: {
      sofa_2: 45,
      sofa_3: 60,
      sofa_corner: 80,
      armchair: 25,
      mattress_single: 35,
      mattress_double: 50,
      mattress_king: 65,
      carpet_small: 30,
      carpet_medium: 50,
      carpet_large: 80,
    } as const,
  },
} as const;

export type DryCleanItemId = keyof typeof siteConfig.prices.items;

export const dryCleanItemIds = Object.keys(
  siteConfig.prices.items,
) as DryCleanItemId[];

export type Locale = "es" | "en" | "ru" | "uk";

export const locales: Locale[] = ["es", "en", "ru", "uk"];
export const defaultLocale: Locale = "es";
