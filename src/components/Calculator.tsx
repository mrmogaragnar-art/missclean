"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { siteConfig, type DryCleanItemId } from "@/config/site";
import { useI18n } from "@/i18n/I18nProvider";
import {
  calcDryRange,
  calcHourlyTotal,
  dryNeedsMinimumTopUp,
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
};

export type CalcApplyPayload = {
  wantHourly: boolean;
  wantDry: boolean;
  hours: number;
  items: DryCleanItemId[];
  bothSides: DryCleanItemId[];
  carpetSqm: number;
  total: number;
  totalLabel: string;
};

type Props = {
  onApply: (payload: CalcApplyPayload) => void;
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
  const [wantHourly, setWantHourly] = useState(false);
  const [wantDry, setWantDry] = useState(false);
  const [focus, setFocus] = useState<ServiceType | null>(null);
  const [hours, setHours] = useState<number>(siteConfig.prices.minHours);
  const [items, setItems] = useState<DryCleanItemId[]>([]);
  const [bothSides, setBothSides] = useState<DryCleanItemId[]>([]);
  const [carpetSqm, setCarpetSqm] = useState<number>(siteConfig.carpet.defaultSqm);

  useEffect(() => {
    function applyHash() {
      const next = readServiceFromHash();
      if (!next) return;
      if (next === "hourly") {
        setWantHourly(true);
        setFocus("hourly");
      } else {
        setWantDry(true);
        setFocus("dry");
      }
    }
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const dryRange = useMemo(
    () => calcDryRange(items, bothSides, { carpetSqm }),
    [items, bothSides, carpetSqm],
  );

  const hourlyTotal = useMemo(() => calcHourlyTotal(hours), [hours]);

  const needsMinTopUp = useMemo(
    () => dryNeedsMinimumTopUp(items, bothSides, carpetSqm),
    [items, bothSides, carpetSqm],
  );

  const dryReady = wantDry && (items.length > 0 || carpetSqm > 0);
  const hourlyReady = wantHourly;
  const canApply = hourlyReady || dryReady;

  const dryTotalLabel = useMemo(() => {
    if (!dryReady) return "0 €";
    const hasItems = items.length > 0;
    const money = hasItems
      ? formatMoneyRange(dryRange.from, dryRange.to)
      : `${siteConfig.prices.visitFee} €`;
    if (carpetSqm <= 0) return money;
    return `${money} + ${t.calculator.carpetPriceNote}`;
  }, [
    dryReady,
    items.length,
    carpetSqm,
    dryRange,
    t.calculator.carpetPriceNote,
  ]);

  const totalLabel = useMemo(() => {
    const parts: string[] = [];
    if (hourlyReady) parts.push(`${hourlyTotal} €`);
    if (dryReady) parts.push(dryTotalLabel);
    if (parts.length === 0) return "0 €";
    if (parts.length === 1) return parts[0];
    if (dryReady && carpetSqm > 0) {
      return `${formatMoneyRange(
        hourlyTotal + dryRange.from,
        hourlyTotal + dryRange.to,
      )} + ${t.calculator.carpetPriceNote}`;
    }
    return formatMoneyRange(
      hourlyTotal + dryRange.from,
      hourlyTotal + dryRange.to,
    );
  }, [
    hourlyReady,
    dryReady,
    hourlyTotal,
    dryTotalLabel,
    carpetSqm,
    dryRange,
    t.calculator.carpetPriceNote,
  ]);

  const carpetScale =
    carpetSqm <= 0
      ? 0.36
      : 0.42 + 0.58 * (carpetSqm / siteConfig.carpet.maxSqm);

  function toggleHourly() {
    setWantHourly((v) => {
      const next = !v;
      if (next) setFocus("hourly");
      else if (wantDry) setFocus("dry");
      else setFocus(null);
      return next;
    });
  }

  function toggleDry() {
    setWantDry((v) => {
      const next = !v;
      if (next) setFocus("dry");
      else if (wantHourly) setFocus("hourly");
      else setFocus(null);
      return next;
    });
  }

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

  const activeFocus: ServiceType | null =
    focus ?? (wantHourly ? "hourly" : wantDry ? "dry" : null);
  const showHourlyPanel =
    wantHourly && (!wantDry || activeFocus === "hourly");
  const showDryPanel = wantDry && (!wantHourly || activeFocus === "dry");

  return (
    <section className="section calculator" id="calculator">
      <div className="section-head">
        <h2>{t.calculator.title}</h2>
        <p>{t.calculator.sub}</p>
      </div>

      <p className="service-pick-label">{t.calculator.pickService}</p>
      <div className="service-pick" role="group" aria-label={t.calculator.pickService}>
        <button
          type="button"
          id="calculator-hourly"
          aria-pressed={wantHourly}
          className={`service-pick-card ${wantHourly ? "is-active" : ""}`}
          onClick={toggleHourly}
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
            <span className="service-pick-title">
              {wantHourly ? "✓ " : ""}
              {t.calculator.hourlyTab}
            </span>
            <span className="service-pick-desc">{t.calculator.hourlyHint}</span>
            <span className="service-pick-price">
              {siteConfig.prices.hourly} € / {t.calculator.hoursUnit}
            </span>
          </span>
        </button>

        <button
          type="button"
          id="calculator-dry"
          aria-pressed={wantDry}
          className={`service-pick-card ${wantDry ? "is-active" : ""}`}
          onClick={toggleDry}
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
            <span className="service-pick-title">
              {wantDry ? "✓ " : ""}
              {t.calculator.dryTab}
            </span>
            <span className="service-pick-desc">{t.calculator.dryHint}</span>
            <span className="service-pick-price">
              {t.calculator.visitFee} {siteConfig.prices.visitFee} €
            </span>
          </span>
        </button>
      </div>

      {wantHourly && wantDry ? (
        <div className="calc-focus-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeFocus === "hourly"}
            className={`calc-focus-tab ${activeFocus === "hourly" ? "is-active" : ""}`}
            onClick={() => setFocus("hourly")}
          >
            {t.calculator.hourlyTab}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFocus === "dry"}
            className={`calc-focus-tab ${activeFocus === "dry" ? "is-active" : ""}`}
            onClick={() => setFocus("dry")}
          >
            {t.calculator.dryTab}
          </button>
        </div>
      ) : null}

      {showHourlyPanel ? (
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
      ) : null}

      {showDryPanel ? (
        <div className="calc-panel calc-panel-dry">
          <div className="visit-fee-badge">
            <span>{t.calculator.visitFee}</span>
            <strong>{siteConfig.prices.visitFee} €</strong>
          </div>
          <p className="muted select-hint">{t.calculator.visitFeeHint}</p>
          <p className="muted select-hint">{t.calculator.selectItems}</p>
          {renderGroup(t.calculator.groups.sofas, sofaIds)}
          {renderGroup(t.calculator.groups.chairs, chairIds)}
          {renderGroup(t.calculator.groups.mattresses, mattressIds)}

          <div className={`item-group carpet-group ${carpetSqm > 0 ? "is-active" : ""}`}>
            <h4>{t.calculator.groups.carpets}</h4>
            <div className="carpet-card">
              <div className="carpet-media" aria-hidden>
                <div
                  className={`carpet-visual ${carpetSqm > 0 ? "is-on" : ""}`}
                  style={{ transform: `scale(${carpetScale})` }}
                >
                  <Image
                    src="/photos/carpet-medium.jpg"
                    alt=""
                    fill
                    sizes="(max-width: 719px) 100vw, 320px"
                    className="carpet-img"
                  />
                </div>
              </div>
              <div className="carpet-controls">
                <div className="carpet-size-row">
                  <span className="field-label">{t.calculator.carpetSize}</span>
                  <strong className="carpet-size-value" aria-live="polite">
                    {carpetSqm > 0
                      ? `${carpetSqm} ${t.calculator.carpetUnit}`
                      : t.calculator.carpetOff}
                  </strong>
                </div>
                <input
                  type="range"
                  className="carpet-slider"
                  min={siteConfig.carpet.minSqm}
                  max={siteConfig.carpet.maxSqm}
                  step={siteConfig.carpet.step}
                  value={carpetSqm}
                  onChange={(e) => setCarpetSqm(Number(e.target.value))}
                  aria-label={t.calculator.carpetSize}
                />
                <div className="carpet-slider-ends">
                  <span>{siteConfig.carpet.minSqm}</span>
                  <span>
                    {siteConfig.carpet.maxSqm} {t.calculator.carpetUnit}
                  </span>
                </div>
                <p className="carpet-price-note">{t.calculator.carpetPriceNote}</p>
              </div>
            </div>
          </div>

          {needsMinTopUp && dryReady ? (
            <p className="calc-min-note">{t.calculator.visitFeeApplied}</p>
          ) : null}
        </div>
      ) : null}

      {!wantHourly && !wantDry ? (
        <p className="muted calc-empty-hint">{t.calculator.pickBothHint}</p>
      ) : null}

      <div className="calc-total is-sticky">
        <span>{t.calculator.total}</span>
        <strong>{totalLabel}</strong>
      </div>

      <button
        type="button"
        className="btn btn-primary calc-apply"
        disabled={!canApply}
        onClick={() => {
          if (!canApply) return;
          const dryFrom = dryReady ? dryRange.from : 0;
          onApply({
            wantHourly,
            wantDry: dryReady,
            hours: wantHourly ? hours : siteConfig.prices.minHours,
            items: dryReady ? [...items] : [],
            bothSides: dryReady ? [...bothSides] : [],
            carpetSqm: dryReady ? carpetSqm : 0,
            total: (wantHourly ? hourlyTotal : 0) + dryFrom,
            totalLabel,
          });
          document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        {t.calculator.useInForm}
      </button>
    </section>
  );
}
