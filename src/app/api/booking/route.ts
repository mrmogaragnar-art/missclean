import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const address = String(body.address ?? "").trim();
    const date = String(body.date ?? "").trim();
    const service = String(body.service ?? "").trim();
    const details = String(body.details ?? "").trim();
    const total = String(body.total ?? "").trim();
    const comment = String(body.comment ?? "").trim();
    const locale = String(body.locale ?? "").trim();

    if (!name || !phone || !address || !date || !service) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const when = new Date().toISOString();
    const text = [
      "🧹 Новая заявка Miss Clean",
      `Время: ${when}`,
      `Язык сайта: ${locale || "—"}`,
      `Имя: ${name}`,
      `Телефон: ${phone}`,
      `Адрес: ${address}`,
      `Дата: ${date}`,
      `Услуга: ${service}`,
      `Детали: ${details || "—"}`,
      `Сумма: ${total ? `${total} €` : "—"}`,
      `Комментарий: ${comment || "—"}`,
    ].join("\n");

    const result = await sendTelegramMessage(text);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error ?? "Telegram failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
