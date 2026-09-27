import {
  siteConfig,
  type DryCleanItemId,
} from "@/config/site";

export type ServiceType = "hourly" | "dry";

export function calcHourlyTotal(hours: number): number {
  const h = Math.max(siteConfig.prices.minHours, hours);
  return h * siteConfig.prices.hourly;
}

export function calcDryTotal(itemIds: DryCleanItemId[]): number {
  if (itemIds.length === 0) return 0;
  const itemsSum = itemIds.reduce(
    (sum, id) => sum + siteConfig.prices.items[id],
    0,
  );
  return siteConfig.prices.visitFee + itemsSum;
}
