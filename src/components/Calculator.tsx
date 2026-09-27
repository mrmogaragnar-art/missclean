"use client";

import Image from "next/image";
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

const itemPhotos: Record<DryCleanItemId, string> = {
  sofa_2: "/photos/sofa-2.jpg",
  sofa_3: "/photos/sofa-3.jpg",
  sofa_corner: "/photos/sofa-corner.jpg",
  armchair: "/photos/armchair.jpg",
  mattress_single: "/photos/mattress-single.jpg",
  mattress_double: "/photos/mattress-double.jpg",
  mattress_king: "/photos/mattress-king.jpg",
  carpet_small: "/photos/carpet-small.jpg",
  carpet_medium: "/photos/carpet-medium.jpg",
  carpet_large: "/photos/carpet-large.jpg",
};

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

  function changeHours(delta: number) {
    setHours((prev) =>
      Math.max(siteConfig.prices.minHours, prev + delta),
    );
  }

  function renderGroup(title: string, ids: DryCleanItemId[]) {
    return (
      <div className="item-group">
        <h4>{title}</h4>
        <div className="item-grid">
          {ids.map((id) => {
            const active = items.includes(id);
            return (
              <button
                key={id}
                type="button"
                className={`item-card ${active ? "is-active" : ""}`}
                onClick={() => toggleItem(id)}
                aria-pressed={active}
              >
                <span className="item-card-media">
                  <Image
                    src={itemPhotos[id]}
                    alt=""
                    fill
                    sizes="(max-width: 719px) 45vw, 180px"
                    className="item-card-img"
                  />
                  {active ? (
                    <span className="item-card-check" aria-hidden>
                      ✓
                    </span>
                  ) : null}
                </span>
                <span className="item-card-body">
                  <span className="item-card-name">{t.calculator.items[id]}</span>
                  <strong className="item-card-price">
                    {siteConfig.prices.items[id]} €
                  </strong>
                </span>
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
        <div className="calc-panel calc-panel-hourly">
          <div className="calc-hourly-visual">
            <Image
              src="/photos/hourly.jpg"
              alt=""
              fill
              sizes="(max-width: 719px) 100vw, 320px"
              className="calc-hourly-img"
            />
          </div>
          <div className="calc-hourly-controls">
            <p className="field-label">{t.calculator.hours}</p>
            <div className="hours-stepper">
              <button
                type="button"
                className="hours-btn"
                onClick={() => changeHours(-1)}
                disabled={hours <= siteConfig.prices.minHours}
                aria-label={t.calculator.decreaseHours}
              >
                −
              </button>
              <span className="hours-value" aria-live="polite">
                {hours}
              </span>
              <button
                type="button"
                className="hours-btn"
                onClick={() => changeHours(1)}
                aria-label={t.calculator.increaseHours}
              >
                +
              </button>
            </div>
            <p className="calc-formula">
              <span>
                {siteConfig.prices.hourly} € × {hours} {t.calculator.hoursUnit}
              </span>
              <strong>
                = {total} €
              </strong>
            </p>
            <p className="muted calc-hint">{t.calculator.minHoursHint}</p>
          </div>
        </div>
      ) : (
        <div className="calc-panel calc-panel-dry">
          <div className="calc-dry-accent">
            <Image
              src="/photos/sofa-room.jpg"
              alt=""
              fill
              sizes="(max-width: 719px) 100vw, 280px"
              className="calc-dry-accent-img"
            />
          </div>
          <div className="visit-fee-badge">
            <span>{t.calculator.visitFee}</span>
            <strong>{siteConfig.prices.visitFee} €</strong>
          </div>
          <p className="muted select-hint">{t.calculator.selectItems}</p>
          {renderGroup(t.calculator.groups.sofas, sofaIds)}
          {renderGroup(t.calculator.groups.mattresses, mattressIds)}
          {renderGroup(t.calculator.groups.carpets, carpetIds)}
        </div>
      )}

      <div className="calc-total is-sticky">
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
