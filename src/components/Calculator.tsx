"use client";

import { useMemo, useState } from "react";
import { siteConfig, type DryCleanItemId } from "@/config/site";
import { useI18n } from "@/i18n/I18nProvider";
import { calcDryTotal, calcHourlyTotal, type ServiceType } from "@/lib/pricing";

const sofaIds: DryCleanItemId[] = [
  "sofa_2",
  "sofa_3",
  "sofa_corner",
  "armchair",
];
const mattressIds: DryCleanItemId[] = [
  "mattress_single",
  "mattress_double",
  "mattress_king",
];
const carpetIds: DryCleanItemId[] = [
  "carpet_small",
  "carpet_medium",
  "carpet_large",
];

type Props = {
  onApply: (payload: {
    service: ServiceType;
    hours: number;
    items: DryCleanItemId[];
    total: number;
  }) => void;
};

export function Calculator({ onApply }: Props) {
  const { t } = useI18n();
  const [tab, setTab] = useState<ServiceType>("hourly");
  const [hours, setHours] = useState<number>(siteConfig.prices.minHours);
  const [items, setItems] = useState<DryCleanItemId[]>([]);

  const total = useMemo(() => {
    if (tab === "hourly") return calcHourlyTotal(hours);
    return calcDryTotal(items);
  }, [tab, hours, items]);

  function toggleItem(id: DryCleanItemId) {
    setItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function renderGroup(title: string, ids: DryCleanItemId[]) {
    return (
      <div className="item-group">
        <h4>{title}</h4>
        <div className="item-list">
          {ids.map((id) => {
            const active = items.includes(id);
            return (
              <button
                key={id}
                type="button"
                className={`item-chip ${active ? "is-active" : ""}`}
                onClick={() => toggleItem(id)}
              >
                <span>{t.calculator.items[id]}</span>
                <strong>{siteConfig.prices.items[id]} €</strong>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <section className="section calculator" id="calculator">
      <div className="section-head">
        <h2>{t.calculator.title}</h2>
        <p>{t.calculator.sub}</p>
      </div>

      <div className="tabs">
        <button
          type="button"
          className={tab === "hourly" ? "is-active" : undefined}
          onClick={() => setTab("hourly")}
        >
          {t.calculator.hourlyTab}
        </button>
        <button
          type="button"
          className={tab === "dry" ? "is-active" : undefined}
          onClick={() => setTab("dry")}
        >
          {t.calculator.dryTab}
        </button>
      </div>

      {tab === "hourly" ? (
        <div className="calc-panel">
          <label className="field">
            <span>{t.calculator.hours}</span>
            <input
              type="number"
              min={siteConfig.prices.minHours}
              step={1}
              value={hours}
              onChange={(e) =>
                setHours(
                  Math.max(
                    siteConfig.prices.minHours,
                    Number(e.target.value) || siteConfig.prices.minHours,
                  ),
                )
              }
            />
          </label>
          <p className="muted">
            {siteConfig.prices.hourly} € × {hours} = {total} €
          </p>
        </div>
      ) : (
        <div className="calc-panel">
          <p className="visit-fee">
            {t.calculator.visitFee}: <strong>{siteConfig.prices.visitFee} €</strong>
          </p>
          <p className="muted">{t.calculator.selectItems}</p>
          {renderGroup(t.calculator.groups.sofas, sofaIds)}
          {renderGroup(t.calculator.groups.mattresses, mattressIds)}
          {renderGroup(t.calculator.groups.carpets, carpetIds)}
        </div>
      )}

      <div className="calc-total">
        <span>{t.calculator.total}</span>
        <strong>{total} €</strong>
      </div>

      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          onApply({ service: tab, hours, items, total });
          document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        {t.calculator.useInForm}
      </button>
    </section>
  );
}
