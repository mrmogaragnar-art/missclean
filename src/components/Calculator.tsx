"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { siteConfig, type DryCleanItemId } from "@/config/site";
import { useI18n } from "@/i18n/I18nProvider";
import {
  calcDryRange,
  calcHourlyTotal,
  formatItemPrice,
  formatMoneyRange,
  getItemPrice,
  hasBothSidesOption,
  type ServiceType,
} from "@/lib/pricing";

const sofaIds: DryCleanItemId[] = [
  "sofa_2",
  "sofa_3",
  "sofa_corner",
  "sofa_folding",
  "sofa_u",
];
const chairIds: DryCleanItemId[] = ["armchair", "office_chair", "chair", "pouf"];
const mattressIds: DryCleanItemId[] = [
  "mattress_single",
  "mattress_double",
];
const carpetIds: DryCleanItemId[] = ["carpet"];

const itemPhotos: Record<DryCleanItemId, string> = {
  sofa_2: "/photos/sofa-2.jpg",
  sofa_3: "/photos/sofa-3.jpg",
  sofa_corner: "/photos/sofa-corner.jpg",
  sofa_folding: "/photos/sofa-folding.jpg",
  sofa_u: "/photos/sofa-u.jpg",
  armchair: "/photos/armchair.jpg",
  office_chair: "/photos/office-chair.jpg",
  chair: "/photos/chair.jpg",
  pouf: "/photos/pouf.jpg",
  mattress_single: "/photos/mattress-single.jpg",
  mattress_double: "/photos/mattress-double.jpg",
  carpet: "/photos/carpet-medium.jpg",
};

type Props = {
  onApply: (payload: {
    service: ServiceType;
    hours: number;
    items: DryCleanItemId[];
    bothSides: DryCleanItemId[];
    total: number;
    totalLabel: string;
  }) => void;
};

function readServiceFromHash(): ServiceType | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash;
  if (hash.includes("dry")) return "dry";
  if (hash.includes("hourly")) return "hourly";
  return null;
}

export function Calculator({ onApply }: Props) {
  const { t } = useI18n();
  const [tab, setTab] = useState<ServiceType>("hourly");
  const [hours, setHours] = useState<number>(siteConfig.prices.minHours);
  const [items, setItems] = useState<DryCleanItemId[]>([]);
  const [bothSides, setBothSides] = useState<DryCleanItemId[]>([]);

  useEffect(() => {
    function applyHash() {
      const next = readServiceFromHash();
      if (next) setTab(next);
    }
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const dryRange = useMemo(
    () => calcDryRange(items, bothSides),
    [items, bothSides],
  );

  const hourlyTotal = useMemo(() => calcHourlyTotal(hours), [hours]);

  const totalLabel = useMemo(() => {
    if (tab === "hourly") return `${hourlyTotal} €`;
    if (items.length === 0) return `0 €`;
    return formatMoneyRange(dryRange.from, dryRange.to);
  }, [tab, hourlyTotal, items.length, dryRange]);

  function toggleItem(id: DryCleanItemId) {
    setItems((prev) => {
      if (prev.includes(id)) {
        setBothSides((sides) => sides.filter((x) => x !== id));
        return prev.filter((x) => x !== id);
      }
      return [...prev, id];
    });
  }

  function toggleBothSides(e: MouseEvent, id: DryCleanItemId) {
    e.preventDefault();
    e.stopPropagation();
    if (!items.includes(id)) {
      setItems((prev) => [...prev, id]);
      setBothSides((prev) => (prev.includes(id) ? prev : [...prev, id]));
      return;
    }
    setBothSides((prev) =>
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
            const twoSides = bothSides.includes(id);
            const canBoth = hasBothSidesOption(id);
            return (
              <div
                key={id}
                className={`item-card ${active ? "is-active" : ""}`}
              >
                <button
                  type="button"
                  className="item-card-main"
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
                    <span className="item-card-name">
                      {t.calculator.items[id]}
                    </span>
                    <strong className="item-card-price">
                      {formatItemPrice(id, twoSides)}
                    </strong>
                  </span>
                </button>
                {canBoth ? (
                  <button
                    type="button"
                    className={`item-both-sides ${twoSides ? "is-on" : ""}`}
                    onClick={(e) => toggleBothSides(e, id)}
                    aria-pressed={twoSides}
                  >
                    {t.calculator.bothSides} (+
                    {getItemPrice(id).bothSidesExtra ?? 10} €)
                  </button>
                ) : null}
              </div>
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

      <p className="service-pick-label">{t.calculator.pickService}</p>
      <div className="service-pick" role="tablist" aria-label={t.calculator.pickService}>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "hourly"}
          className={`service-pick-card ${tab === "hourly" ? "is-active" : ""}`}
          onClick={() => setTab("hourly")}
        >
          <span className="service-pick-media">
            <Image
              src="/photos/hourly.jpg"
              alt=""
              fill
              sizes="(max-width: 719px) 50vw, 280px"
              className="service-pick-img"
            />
          </span>
          <span className="service-pick-body">
            <span className="service-pick-title">{t.calculator.hourlyTab}</span>
            <span className="service-pick-desc">{t.calculator.hourlyHint}</span>
            <span className="service-pick-price">
              {siteConfig.prices.hourly} € / {t.calculator.hoursUnit}
            </span>
          </span>
        </button>

        <button
          type="button"
          role="tab"
          id="calculator-dry"
          aria-selected={tab === "dry"}
          className={`service-pick-card ${tab === "dry" ? "is-active" : ""}`}
          onClick={() => setTab("dry")}
        >
          <span className="service-pick-media">
            <Image
              src="/photos/upholstery.jpg"
              alt=""
              fill
              sizes="(max-width: 719px) 50vw, 280px"
              className="service-pick-img"
            />
          </span>
          <span className="service-pick-body">
            <span className="service-pick-title">{t.calculator.dryTab}</span>
            <span className="service-pick-desc">{t.calculator.dryHint}</span>
            <span className="service-pick-price">
              {t.calculator.visitFee} {siteConfig.prices.visitFee} €
            </span>
          </span>
        </button>
      </div>

      {tab === "hourly" ? (
        <div className="calc-panel calc-panel-hourly">
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
              <strong>= {hourlyTotal} €</strong>
            </p>
            <p className="muted calc-hint">{t.calculator.minHoursHint}</p>
          </div>
        </div>
      ) : (
        <div className="calc-panel calc-panel-dry">
          <div className="visit-fee-badge">
            <span>{t.calculator.visitFee}</span>
            <strong>{siteConfig.prices.visitFee} €</strong>
          </div>
          <p className="muted select-hint">{t.calculator.selectItems}</p>
          {renderGroup(t.calculator.groups.sofas, sofaIds)}
          {renderGroup(t.calculator.groups.chairs, chairIds)}
          {renderGroup(t.calculator.groups.mattresses, mattressIds)}
          {renderGroup(t.calculator.groups.carpets, carpetIds)}
        </div>
      )}

      <div className="calc-total is-sticky">
        <span>{t.calculator.total}</span>
        <strong>{totalLabel}</strong>
      </div>

      <button
        type="button"
        className="btn btn-primary calc-apply"
        onClick={() => {
          const total =
            tab === "hourly" ? hourlyTotal : dryRange.from;
          onApply({
            service: tab,
            hours: tab === "hourly" ? hours : siteConfig.prices.minHours,
            items: tab === "dry" ? [...items] : [],
            bothSides: tab === "dry" ? [...bothSides] : [],
            total,
            totalLabel:
              tab === "hourly"
                ? `${hourlyTotal} €`
                : items.length === 0
                  ? `${siteConfig.prices.visitFee} €`
                  : formatMoneyRange(dryRange.from, dryRange.to),
          });
          document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        {t.calculator.useInForm}
      </button>
    </section>
  );
}
