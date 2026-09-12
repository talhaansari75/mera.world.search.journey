import { createServerFn } from "@tanstack/react-start";

export type ForgeResult =
  | { ok: true; theme: string; words: string[] }
  | { ok: false; error: string };

export const forgeWords = createServerFn({ method: "POST" })
  .validator((input: { theme: string }) => ({
    theme: String(input?.theme ?? "").slice(0, 80),
  }))
  .handler(async ({ data }): Promise<ForgeResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "unavailable" };
    const theme = data.theme.trim() || "quiet library";
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 400,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              'Reply with JSON only: {"words":["WORD",...]}. 8-10 uppercase English words, 4-9 letters, A-Z only, theme-related, no phrases.',
          },
          { role: "user", content: `Theme: ${theme}` },
        ],
      }),
    });
    if (!res.ok) return { ok: false, error: `xAI ${res.status}` };
    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content ?? "";
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart < 0 || jsonEnd < 0) return { ok: false, error: "parse" };
    try {
      const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1)) as {
        words?: unknown;
      };
      const words = (Array.isArray(parsed.words) ? parsed.words : [])
        .map((w) => String(w).toUpperCase().replace(/[^A-Z]/g, ""))
        .filter((w) => w.length >= 3 && w.length <= 10)
        .slice(0, 12);
      if (words.length < 5) return { ok: false, error: "short" };
      return { ok: true, theme, words: [...new Set(words)] };
    } catch {
      return { ok: false, error: "parse" };
    }
  });
