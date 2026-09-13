import { createServerFn } from "@tanstack/react-start";

export type ForgeResult =
  | { ok: true; theme: string; words: string[] }
  | { ok: false; error: string };

const FORGE_WINDOW_MS = 60_000;
const FORGE_MAX_REQUESTS = 5;

let windowStartedAt = Date.now();
let requestCount = 0;

function allowForgeRequest() {
  const now = Date.now();

  if (now - windowStartedAt >= FORGE_WINDOW_MS) {
    windowStartedAt = now;
    requestCount = 0;
  }

  if (requestCount >= FORGE_MAX_REQUESTS) {
    return false;
  }

  requestCount += 1;
  return true;
}

export const forgeWords = createServerFn({ method: "POST" })
  .validator((input: { theme: string }) => ({
    theme: String(input?.theme ?? "").slice(0, 80),
  }))
  .handler(async ({ data }): Promise<ForgeResult> => {
    const apiKey = process.env.XAI_API_KEY;

    if (!apiKey) {
      return { ok: false, error: "unavailable" };
    }

    if (!allowForgeRequest()) {
      return { ok: false, error: "rate_limit" };
    }

    const theme = data.theme.trim() || "quiet library";

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 15_000);

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          max_tokens: 200,
          temperature: 0.7,
          messages: [
            {
              role: "system",
              content:
                'Reply with JSON only: {"words":["WORD",...]}. 8-10 uppercase English words, 4-9 letters, A-Z only, theme-related, no phrases, no duplicates.',
            },
            {
              role: "user",
              content: `Theme: ${theme}`,
            },
          ],
        }),
      });

      if (!res.ok) {
        return {
          ok: false,
          error: res.status === 429 ? "rate_limit" : `xAI ${res.status}`,
        };
      }

      const body = (await res.json()) as {
        choices?: {
          message?: {
            content?: string;
          };
        }[];
      };

      const text = body.choices?.[0]?.message?.content ?? "";

      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");

      if (jsonStart < 0 || jsonEnd <= jsonStart) {
        return { ok: false, error: "parse" };
      }

      try {
        const parsed = JSON.parse(
          text.slice(jsonStart, jsonEnd + 1),
        ) as {
          words?: unknown;
        };

        const words = Array.isArray(parsed.words)
          ? parsed.words
              .filter((word): word is string => typeof word === "string")
              .map((word) =>
                word.toUpperCase().replace(/[^A-Z]/g, ""),
              )
              .filter((word) => word.length >= 4 && word.length <= 9)
          : [];

        const uniqueWords = [...new Set(words)].slice(0, 12);

        if (uniqueWords.length < 5) {
          return { ok: false, error: "short" };
        }

        return {
          ok: true,
          theme,
          words: uniqueWords,
        };
      } catch {
        return { ok: false, error: "parse" };
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return { ok: false, error: "timeout" };
      }

      return { ok: false, error: "network" };
    } finally {
      clearTimeout(timeout);
    }
  });
