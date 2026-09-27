"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { DryCleanItemId } from "@/config/site";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/I18nProvider";
import type { ServiceType } from "@/lib/pricing";

export type CalcSnapshot = {
  service: ServiceType;
  hours: number;
  items: DryCleanItemId[];
  total: number;
};

type Props = {
  snapshot: CalcSnapshot | null;
};

export function BookingForm({ snapshot }: Props) {
  const { t, locale } = useI18n();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [service, setService] = useState<ServiceType>("hourly");
  const [hours, setHours] = useState<number>(siteConfig.prices.minHours);
  const [items, setItems] = useState<DryCleanItemId[]>([]);
  const [total, setTotal] = useState<number>(
    siteConfig.prices.hourly * siteConfig.prices.minHours,
  );
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  useEffect(() => {
    if (!snapshot) return;
    setService(snapshot.service);
    setHours(snapshot.hours);
    setItems(snapshot.items);
    setTotal(snapshot.total);
  }, [snapshot]);

  function detailsText() {
    if (service === "hourly") {
      return `${hours} h × ${siteConfig.prices.hourly} €`;
    }
    const labels = items.map((id) => t.calculator.items[id]).join(", ");
    return `${t.calculator.visitFee} ${siteConfig.prices.visitFee} € + ${labels || "—"}`;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
          date,
          service:
            service === "hourly" ? t.form.serviceHourly : t.form.serviceDry,
          details: detailsText(),
          total: String(total),
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
      setComment("");
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

      <form className="booking-form" onSubmit={onSubmit}>
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

        <label className="field">
          <span>{t.form.address}</span>
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            autoComplete="street-address"
          />
        </label>

        <label className="field">
          <span>{t.form.date}</span>
          <input
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label className="field">
          <span>{t.form.service}</span>
          <select
            value={service}
            onChange={(e) => setService(e.target.value as ServiceType)}
          >
            <option value="hourly">{t.form.serviceHourly}</option>
            <option value="dry">{t.form.serviceDry}</option>
          </select>
        </label>

        <div className="form-summary">
          <p>{detailsText()}</p>
          <p>
            <strong>
              {t.calculator.total}: {total} €
            </strong>
          </p>
        </div>

        <label className="field field-full">
          <span>{t.form.comment}</span>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? t.form.sending : t.form.submit}
        </button>

        {status === "ok" ? <p className="form-ok">{t.form.success}</p> : null}
        {status === "error" ? <p className="form-error">{t.form.error}</p> : null}
      </form>
    </section>
  );
}
