import {
  siteConfig,
  type DryCleanItemId,
  type DryCleanPrice,
} from "@/config/site";

export type ServiceType = "hourly" | "dry";

export function getItemPrice(id: DryCleanItemId): DryCleanPrice {
  return siteConfig.prices.items[id];
}

export function itemPriceFrom(id: DryCleanItemId): number {
  return getItemPrice(id).from;
}

export function itemPriceTo(id: DryCleanItemId): number {
  const p = getItemPrice(id);
  return p.to ?? p.from;
}

export function formatItemPrice(
  id: DryCleanItemId,
  bothSides = false,
): string {
  const p = getItemPrice(id);
  const extra = bothSides && p.bothSidesExtra ? p.bothSidesExtra : 0;
  const from = p.from + extra;
  const to = (p.to ?? p.from) + extra;
  if (from === to) return `${from} €`;
  return `${from}–${to} €`;
}

export function formatMoneyRange(from: number, to: number): string {
  if (from === to) return `${from} €`;
  return `${from}–${to} €`;
}

export function calcHourlyTotal(hours: number): number {
  const h = Math.max(siteConfig.prices.minHours, hours);
  return h * siteConfig.prices.hourly;
}

function itemSum(
  itemIds: DryCleanItemId[],
  bothSides: DryCleanItemId[],
  pick: "from" | "to",
): number {
  const both = new Set(bothSides);
  return itemIds.reduce((sum, id) => {
    const p = getItemPrice(id);
    const base = pick === "to" ? (p.to ?? p.from) : p.from;
    const extra =
      both.has(id) && p.bothSidesExtra ? p.bothSidesExtra : 0;
    return sum + base + extra;
  }, 0);
}

/** Сумма позиций химчистки без минимального выезда */
export function calcDryItemsRange(
  itemIds: DryCleanItemId[],
  bothSides: DryCleanItemId[] = [],
): { from: number; to: number } {
  return {
    from: itemSum(itemIds, bothSides, "from"),
    to: itemSum(itemIds, bothSides, "to"),
  };
}

/**
 * Итог химчистки: минимум заказа = visitFee (40 €).
 * Если сумма позиций ниже — поднимаем до 40 €.
 * Если выше — считаем только позиции (выезд уже «заложен»).
 */
export function calcDryRange(
  itemIds: DryCleanItemId[],
  bothSides: DryCleanItemId[] = [],
  options?: { carpetSqm?: number },
): { from: number; to: number } {
  const carpetSqm = options?.carpetSqm ?? 0;
  if (itemIds.length === 0 && carpetSqm <= 0) return { from: 0, to: 0 };

  const fee = siteConfig.prices.visitFee;

  if (itemIds.length === 0 && carpetSqm > 0) {
    return { from: fee, to: fee };
  }

  const items = calcDryItemsRange(itemIds, bothSides);
  return {
    from: Math.max(fee, items.from),
    to: Math.max(fee, items.to),
  };
}

/** Нижняя граница сметы (для заявки / «от») */
export function calcDryTotal(
  itemIds: DryCleanItemId[],
  bothSides: DryCleanItemId[] = [],
): number {
  return calcDryRange(itemIds, bothSides).from;
}

/** Нужно ли дотянуть заказ до минимума 40 € */
export function dryNeedsMinimumTopUp(
  itemIds: DryCleanItemId[],
  bothSides: DryCleanItemId[] = [],
  carpetSqm = 0,
): boolean {
  if (itemIds.length === 0 && carpetSqm <= 0) return false;
  if (itemIds.length === 0 && carpetSqm > 0) return true;
  return calcDryItemsRange(itemIds, bothSides).from < siteConfig.prices.visitFee;
}

export function hasBothSidesOption(id: DryCleanItemId): boolean {
  return Boolean(getItemPrice(id).bothSidesExtra);
}
