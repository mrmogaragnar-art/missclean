"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useI18n } from "@/i18n/I18nProvider";

type Point = { x: number; y: number };

export function BeforeAfter() {
  const { t } = useI18n();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dirtyRef = useRef<HTMLImageElement | null>(null);
  const strokesRef = useRef<[Point, Point][]>([]);
  const activeRef = useRef(false);
  const lastRef = useRef<Point | null>(null);

  const pointFromEvent = useCallback((e: { clientX: number; clientY: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  }, []);

  const erase = useCallback((a: Point, b: Point) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = w * 0.105;
    ctx.beginPath();
    ctx.moveTo(a.x * w, a.y * h);
    ctx.lineTo(b.x * w, b.y * h);
    ctx.stroke();
    ctx.restore();
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const dirty = dirtyRef.current;
    if (!canvas || !dirty || !dirty.complete) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(dirty, 0, 0, canvas.width, canvas.height);
    for (const [a, b] of strokesRef.current) erase(a, b);
  }, [erase]);

  const resize = useCallback(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const rect = stage.getBoundingClientRect();
    const d = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(rect.width * d);
    canvas.height = Math.round(rect.height * d);
    redraw();
  }, [redraw]);

  useEffect(() => {
    const dirty = new window.Image();
    dirty.src = "/photos/sofa-before-dirty.png?v=2";
    dirtyRef.current = dirty;

    const onLoad = () => resize();
    dirty.addEventListener("load", onLoad);

    const stage = stageRef.current;
    const observer =
      typeof ResizeObserver !== "undefined" && stage
        ? new ResizeObserver(() => resize())
        : null;
    if (stage && observer) observer.observe(stage);
    else window.addEventListener("resize", resize);

    return () => {
      dirty.removeEventListener("load", onLoad);
      observer?.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  function onPointerDown(e: ReactPointerEvent<HTMLCanvasElement>) {
    activeRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = pointFromEvent(e);
    lastRef.current = p;
    strokesRef.current.push([p, p]);
    erase(p, p);
  }

  function onPointerMove(e: ReactPointerEvent<HTMLCanvasElement>) {
    if (!activeRef.current || !lastRef.current) return;
    const next = pointFromEvent(e);
    strokesRef.current.push([lastRef.current, next]);
    erase(lastRef.current, next);
    lastRef.current = next;
  }

  function onPointerUp(e: ReactPointerEvent<HTMLCanvasElement>) {
    activeRef.current = false;
    lastRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  function reset() {
    strokesRef.current = [];
    redraw();
  }

  return (
    <section className="section before-after" id="before-after">
      <div className="section-head">
        <h2>{t.beforeAfter.title}</h2>
        <p>{t.beforeAfter.sub}</p>
      </div>

      <div
        ref={stageRef}
        className="ba-stage"
        aria-label={t.beforeAfter.aria}
      >
        <Image
          src="/photos/sofa-after-clean.png"
          alt=""
          fill
          sizes="(max-width: 719px) 100vw, 680px"
          className="ba-img"
          priority={false}
          draggable={false}
          key="sofa-after-v2"
        />
        <canvas
          ref={canvasRef}
          className="ba-dirt"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        <span className="ba-badge">{t.beforeAfter.badge}</span>
      </div>

      <div className="ba-actions">
        <button type="button" className="btn btn-ghost" onClick={reset}>
          {t.beforeAfter.reset}
        </button>
      </div>

      <p className="ba-hint">{t.beforeAfter.hint}</p>
    </section>
  );
}
