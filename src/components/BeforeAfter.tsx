"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useI18n } from "@/i18n/I18nProvider";

type Point = { x: number; y: number };

type ToolPos = {
  x: number;
  y: number;
  visible: boolean;
};

export function BeforeAfter() {
  const { t } = useI18n();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dirtyRef = useRef<HTMLImageElement | null>(null);
  const strokesRef = useRef<[Point, Point][]>([]);
  const activeRef = useRef(false);
  const lastRef = useRef<Point | null>(null);
  const [ready, setReady] = useState(false);
  const [tool, setTool] = useState<ToolPos>({ x: 0, y: 0, visible: false });

  const pointFromEvent = useCallback((e: { clientX: number; clientY: number }) => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return { x: 0, y: 0 };
    return {
      x: Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)),
    };
  }, []);

  const moveTool = useCallback((e: { clientX: number; clientY: number }) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    setTool({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      visible: true,
    });
  }, []);

  const erase = useCallback((a: Point, b: Point) => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width < 2 || canvas.height < 2) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(28, w * 0.14);
    ctx.beginPath();
    ctx.moveTo(a.x * w, a.y * h);
    ctx.lineTo(b.x * w, b.y * h);
    ctx.stroke();
    // Soften the wipe so a single tap also clears a spot
    ctx.beginPath();
    ctx.arc(b.x * w, b.y * h, ctx.lineWidth * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const dirty = dirtyRef.current;
    if (!canvas || !dirty || !dirty.complete || dirty.naturalWidth === 0) return;
    if (canvas.width < 2 || canvas.height < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(dirty, 0, 0, canvas.width, canvas.height);
    for (const [a, b] of strokesRef.current) erase(a, b);
    setReady(true);
  }, [erase]);

  const resize = useCallback(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const rect = stage.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    const d = Math.min(window.devicePixelRatio || 1, 2);
    const nextW = Math.round(rect.width * d);
    const nextH = Math.round(rect.height * d);
    if (canvas.width !== nextW || canvas.height !== nextH) {
      canvas.width = nextW;
      canvas.height = nextH;
    }
    redraw();
  }, [redraw]);

  useEffect(() => {
    const dirty = new window.Image();
    dirty.decoding = "async";
    dirty.src = "/photos/sofa-before-dirty.png";
    dirtyRef.current = dirty;

    const onReady = () => resize();
    dirty.addEventListener("load", onReady);
    dirty.addEventListener("error", () => setReady(false));
    // Cached images often skip the "load" event
    if (dirty.complete && dirty.naturalWidth > 0) onReady();

    const stage = stageRef.current;
    const observer =
      typeof ResizeObserver !== "undefined" && stage
        ? new ResizeObserver(() => resize())
        : null;
    if (stage && observer) observer.observe(stage);
    else window.addEventListener("resize", resize);

    return () => {
      dirty.removeEventListener("load", onReady);
      observer?.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    activeRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTool(e);
    const p = pointFromEvent(e);
    lastRef.current = p;
    strokesRef.current.push([p, p]);
    erase(p, p);
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    moveTool(e);
    if (!activeRef.current || !lastRef.current) return;
    const next = pointFromEvent(e);
    strokesRef.current.push([lastRef.current, next]);
    erase(lastRef.current, next);
    lastRef.current = next;
  }

  function onPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    activeRef.current = false;
    lastRef.current = null;
    if (e.pointerType === "touch" || e.pointerType === "pen") {
      setTool((prev) => ({ ...prev, visible: false }));
    }
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  function onPointerEnter(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse") moveTool(e);
  }

  function onPointerLeave() {
    if (!activeRef.current) {
      setTool((prev) => ({ ...prev, visible: false }));
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
        className={`ba-stage ${tool.visible ? "is-tool-on" : ""} ${ready ? "is-ready" : ""}`}
        aria-label={t.beforeAfter.aria}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <Image
          src="/photos/sofa-after-clean.png"
          alt=""
          fill
          sizes="(max-width: 719px) 100vw, 680px"
          className="ba-img"
          priority={false}
          draggable={false}
        />
        <canvas ref={canvasRef} className="ba-dirt" aria-hidden />
        <img
          src="/cursor-nozzle.png"
          alt=""
          className={`ba-tool ${tool.visible ? "is-visible" : ""}`}
          style={{ left: `${tool.x}px`, top: `${tool.y}px` }}
          draggable={false}
          aria-hidden
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
