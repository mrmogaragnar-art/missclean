import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

function deviceKindLabel(kind: string): string {
  if (kind === "phone") return "📱 Телефон";
  if (kind === "tablet") return "📲 Планшет";
  if (kind === "desktop") return "💻 Компьютер";
  return kind || "—";
}

function batteryLabel(
  level: unknown,
  charging: unknown,
): string {
  if (typeof level !== "number" || Number.isNaN(level)) {
    return "недоступно";
  }
  const charge =
    charging === true ? "заряжается" : charging === false ? "не на зарядке" : "";
  return charge ? `${level}% (${charge})` : `${level}%`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const locale = String(body.locale ?? "unknown");
    const referrer = String(body.referrer ?? "");
    const userAgent = String(
      body.userAgent ?? request.headers.get("user-agent") ?? "",
    );
    const path = String(body.path ?? "/");
    const deviceKind = String(body.deviceKind ?? "");
    const platform = String(body.platform ?? "");
    const language = String(body.language ?? "");
    const screen = String(body.screen ?? "");
    const viewport = String(body.viewport ?? "");
    const pixelRatio = body.pixelRatio != null ? String(body.pixelRatio) : "";
    const timezone = String(body.timezone ?? "");
    const connection = String(body.connection ?? "");
    const touchPoints = body.touchPoints != null ? String(body.touchPoints) : "";
    const when = new Date().toLocaleString("ru-RU", {
      timeZone: "Europe/Madrid",
      dateStyle: "short",
      timeStyle: "medium",
    });

    const text = [
      "👁 Новый визит — Miss Clean",
      `⏰ ${when} (Valencia)`,
      `🌐 Язык сайта: ${locale}${language ? ` · браузер: ${language}` : ""}`,
      `📄 Страница: ${path}`,
      `🔗 Откуда: ${referrer || "—"}`,
      "",
      deviceKindLabel(deviceKind),
      platform ? `🖥 Платформа: ${platform}` : null,
      screen ? `📐 Экран: ${screen}${pixelRatio ? ` @${pixelRatio}x` : ""}` : null,
      viewport ? `🪟 Окно: ${viewport}` : null,
      touchPoints ? `👆 Touch points: ${touchPoints}` : null,
      `🔋 Заряд: ${batteryLabel(body.batteryLevel, body.batteryCharging)}`,
      connection ? `📶 Сеть: ${connection}` : null,
      timezone ? `🕒 Часовой пояс: ${timezone}` : null,
      "",
      `UA: ${userAgent.slice(0, 220)}`,
    ]
      .filter((line) => line != null)
      .join("\n");

    const result = await sendTelegramMessage(text);

    return NextResponse.json({ ok: result.ok, error: result.error ?? null });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
