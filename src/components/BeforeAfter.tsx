"use client";

import Image from "next/image";
import {
  useCallback,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useI18n } from "@/i18n/I18nProvider";

export function BeforeAfter() {
  const { t } = useI18n();
  const [pos, setPos] = useState(28);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, next)));
  }, []);

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  }

  function onPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    dragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  return (
    <section className="section before-after" id="before-after">
      <div className="section-head">
        <h2>{t.beforeAfter.title}</h2>
        <p>{t.beforeAfter.sub}</p>
      </div>

      <div
        ref={trackRef}
        className="ba-stage"
        role="img"
        aria-label={t.beforeAfter.aria}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="ba-layer ba-after">
          <Image
            src="/photos/sofa-after.jpg"
            alt=""
            fill
            sizes="(max-width: 719px) 100vw, 900px"
            className="ba-img"
            draggable={false}
          />
          <span className="ba-tag ba-tag-after">{t.beforeAfter.after}</span>
        </div>

        <div
          className="ba-layer ba-before"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <Image
            src="/photos/sofa-before.jpg"
            alt=""
            fill
            sizes="(max-width: 719px) 100vw, 900px"
            className="ba-img ba-img-dirty"
            draggable={false}
          />
          <span className="ba-stains" aria-hidden />
          <span className="ba-tag ba-tag-before">{t.beforeAfter.before}</span>
        </div>

        <div className="ba-handle" style={{ left: `${pos}%` }} aria-hidden>
          <span className="ba-handle-line" />
          <span className="ba-handle-knob">⟷</span>
        </div>

        <label className="sr-only" htmlFor="ba-range">
          {t.beforeAfter.hint}
        </label>
        <input
          id="ba-range"
          className="ba-range"
          type="range"
          min={4}
          max={96}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-valuetext={`${Math.round(pos)}%`}
        />
      </div>

      <p className="ba-hint">{t.beforeAfter.hint}</p>
    </section>
  );
}
