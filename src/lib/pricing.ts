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

export function calcDryRange(
  itemIds: DryCleanItemId[],
  bothSides: DryCleanItemId[] = [],
): { from: number; to: number } {
  if (itemIds.length === 0) return { from: 0, to: 0 };
  const from =
    siteConfig.prices.visitFee + itemSum(itemIds, bothSides, "from");
  const to = siteConfig.prices.visitFee + itemSum(itemIds, bothSides, "to");
  return { from, to };
}

/** Нижняя граница сметы (для заявки / «от») */
export function calcDryTotal(
  itemIds: DryCleanItemId[],
  bothSides: DryCleanItemId[] = [],
): number {
  return calcDryRange(itemIds, bothSides).from;
}

export function hasBothSidesOption(id: DryCleanItemId): boolean {
  return Boolean(getItemPrice(id).bothSidesExtra);
}
