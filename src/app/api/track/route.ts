import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const locale = String(body.locale ?? "unknown");
    const referrer = String(body.referrer ?? "");
    const userAgent = String(body.userAgent ?? request.headers.get("user-agent") ?? "");
    const path = String(body.path ?? "/");
    const when = new Date().toISOString();

    const text = [
      "👁 Новый визит на сайт Miss Clean",
      `Время: ${when}`,
      `Язык: ${locale}`,
      `Страница: ${path}`,
      `Откуда: ${referrer || "—"}`,
      `Устройство: ${userAgent.slice(0, 180)}`,
    ].join("\n");

    const result = await sendTelegramMessage(text);

    return NextResponse.json({ ok: result.ok, error: result.error ?? null });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
