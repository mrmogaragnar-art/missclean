type TelegramPayload = {
  text: string;
};

export async function sendTelegramMessage(
  text: string,
): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram env missing: TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID");
    return { ok: false, error: "Telegram is not configured" };
  }

  const payload: TelegramPayload = { text };

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: payload.text,
          disable_web_page_preview: true,
        }),
      },
    );

    if (!res.ok) {
      const body = await res.text();
      console.error("Telegram API error", res.status, body);
      return { ok: false, error: "Telegram API error" };
    }

    return { ok: true };
  } catch (error) {
    console.error("Telegram send failed", error);
    return { ok: false, error: "Network error" };
  }
}
