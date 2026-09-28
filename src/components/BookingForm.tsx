"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { DryCleanItemId } from "@/config/site";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/I18nProvider";
import {
  calcDryTotal,
  calcHourlyTotal,
  type ServiceType,
} from "@/lib/pricing";

export type CalcSnapshot = {
  /** Changes on every "Use in form" click so the form always re-syncs */
  id: number;
  service: ServiceType;
  hours: number;
  items: DryCleanItemId[];
  total: number;
};

type Props = {
  snapshot: CalcSnapshot | null;
};

type Step = 1 | 2;

export function BookingForm({ snapshot }: Props) {
  const { t, locale } = useI18n();

  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [wantHourly, setWantHourly] = useState(false);
  const [wantDry, setWantDry] = useState(false);
  const [hours, setHours] = useState<number>(siteConfig.prices.minHours);
  const [items, setItems] = useState<DryCleanItemId[]>([]);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [fromCalculator, setFromCalculator] = useState(false);
  const [stepError, setStepError] = useState(false);

  useEffect(() => {
    if (!snapshot) return;
    if (snapshot.service === "hourly") {
      setWantHourly(true);
      setHours(snapshot.hours);
    } else {
      setWantDry(true);
      setItems([...snapshot.items]);
    }
    setFromCalculator(true);
    setStep(1);
    setStepError(false);
  }, [snapshot?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function hourlyPart(): number {
    return wantHourly ? calcHourlyTotal(hours) : 0;
  }

  function dryPart(): number {
    if (!wantDry) return 0;
    if (items.length === 0) return siteConfig.prices.visitFee;
    return calcDryTotal(items);
  }

  function displayTotal(): number {
    return hourlyPart() + dryPart();
  }

  function detailsText(): string {
    const parts: string[] = [];
    if (wantHourly) {
      parts.push(
        `${t.form.serviceHourly}: ${hours} h × ${siteConfig.prices.hourly} € = ${hourlyPart()} €`,
      );
    }
    if (wantDry) {
      const labels = items.map((id) => t.calculator.items[id]).join(", ");
      parts.push(
        `${t.form.serviceDry}: ${t.calculator.visitFee} ${siteConfig.prices.visitFee} € + ${labels || t.form.dryItemsLater} = ${dryPart()} €`,
      );
    }
    return parts.join(" · ") || "—";
  }

  function serviceLabel(): string {
    const parts: string[] = [];
    if (wantHourly) parts.push(t.form.serviceHourly);
    if (wantDry) parts.push(t.form.serviceDry);
    return parts.join(" + ") || "—";
  }

  function toggleHourly() {
    setWantHourly((v) => !v);
    setFromCalculator(false);
    setStepError(false);
  }

  function toggleDry() {
    setWantDry((v) => !v);
    setFromCalculator(false);
    setStepError(false);
  }

  function changeHours(delta: number) {
    setHours((prev) => Math.max(siteConfig.prices.minHours, prev + delta));
    setFromCalculator(false);
  }

  function goStep2() {
    if ((!wantHourly && !wantDry) || !date || !time) {
      setStepError(true);
      return;
    }
    setStepError(false);
    setStep(2);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if ((!wantHourly && !wantDry) || !date || !time) {
      setStep(1);
      setStepError(true);
      return;
    }
    setStatus("sending");

    const submitTotal = displayTotal();

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
          date,
          slot: time,
          service: serviceLabel(),
          details: detailsText(),
          total: String(submitTotal),
          comment,
          locale,
        }),
      });

      if (!res.ok) throw new Error("fail");
      setStatus("ok");
      setName("");
      setPhone("");
      setAddress("");
      setDate("");
      setTime("");
      setComment("");
      setStep(1);
      setWantHourly(false);
      setWantDry(false);
      setHours(siteConfig.prices.minHours);
      setItems([]);
      setFromCalculator(false);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="section book" id="book">
      <div className="section-head">
        <h2>{t.form.title}</h2>
        <p>{t.form.sub}</p>
      </div>

      <div className="book-steps" aria-hidden>
        <span className={`book-step-dot ${step === 1 ? "is-active" : "is-done"}`}>
          1
        </span>
        <span className="book-step-line" />
        <span className={`book-step-dot ${step === 2 ? "is-active" : ""}`}>
          2
        </span>
      </div>

      <form className="booking-form" onSubmit={onSubmit}>
        {step === 1 ? (
          <>
            <div className="field-full">
              <p className="field-label">{t.form.step1Title}</p>
              <p className="muted book-step-hint">{t.form.step1Hint}</p>
            </div>

            <div
              className="service-pick field-full"
              role="group"
              aria-label={t.form.service}
            >
              <button
                type="button"
                aria-pressed={wantHourly}
                className={`service-pick-card ${wantHourly ? "is-active" : ""}`}
                onClick={toggleHourly}
              >
                <span className="service-pick-body service-pick-body-solo">
                  <span className="service-pick-title">
                    {wantHourly ? "✓ " : ""}
                    {t.form.serviceHourly}
                  </span>
                  <span className="service-pick-desc">{t.form.serviceHourlyHint}</span>
                </span>
              </button>
              <button
                type="button"
                aria-pressed={wantDry}
                className={`service-pick-card ${wantDry ? "is-active" : ""}`}
                onClick={toggleDry}
              >
                <span className="service-pick-body service-pick-body-solo">
                  <span className="service-pick-title">
                    {wantDry ? "✓ " : ""}
                    {t.form.serviceDry}
                  </span>
                  <span className="service-pick-desc">{t.form.serviceDryHint}</span>
                </span>
              </button>
            </div>

            {wantHourly ? (
              <div className="field-full book-hours">
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
                <p className="muted calc-hint">{t.calculator.minHoursHint}</p>
              </div>
            ) : null}

            {wantDry && items.length === 0 ? (
              <p className="muted field-full book-dry-hint">{t.form.dryHintCalc}</p>
            ) : null}

            {wantDry && items.length > 0 ? (
              <p className="muted field-full">
                {t.form.serviceDry}:{" "}
                {items.map((id) => t.calculator.items[id]).join(", ")}
              </p>
            ) : null}

            <label className="field">
              <span>{t.form.date}</span>
              <input
                required
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setStepError(false);
                }}
              />
            </label>

            <label className="field">
              <span>{t.form.time}</span>
              <input
                required
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  setStepError(false);
                }}
              />
            </label>

            {(wantHourly || wantDry) && (
              <div className="form-summary field-full">
                <p>{detailsText()}</p>
                <p>
                  <strong>
                    {t.calculator.total}: {displayTotal()} €
                  </strong>
                </p>
              </div>
            )}

            {stepError ? (
              <p className="form-error field-full">{t.form.step1Error}</p>
            ) : null}

            <button
              type="button"
              className="btn btn-primary field-full"
              onClick={goStep2}
            >
              {t.form.continue}
            </button>
          </>
        ) : (
          <>
            <div
              className={`form-summary field-full ${fromCalculator ? "is-from-calc" : ""}`}
            >
              <p>
                <strong>{serviceLabel()}</strong>
              </p>
              <p>
                {date} · {time}
              </p>
              <p>{detailsText()}</p>
              <p>
                <strong>
                  {t.calculator.total}: {displayTotal()} €
                </strong>
              </p>
            </div>

            <label className="field">
              <span>{t.form.name}</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </label>

            <label className="field">
              <span>{t.form.phone}</span>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </label>

            <label className="field field-full">
              <span>{t.form.address}</span>
              <input
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                autoComplete="street-address"
              />
            </label>

            <label className="field field-full">
              <span>{t.form.comment}</span>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </label>

            <div className="book-step2-actions field-full">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStep(1)}
              >
                {t.form.back}
              </button>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? t.form.sending : t.form.submit}
              </button>
            </div>
          </>
        )}

        {status === "ok" ? <p className="form-ok field-full">{t.form.success}</p> : null}
        {status === "error" ? (
          <p className="form-error field-full">{t.form.error}</p>
        ) : null}
      </form>
    </section>
  );
}
