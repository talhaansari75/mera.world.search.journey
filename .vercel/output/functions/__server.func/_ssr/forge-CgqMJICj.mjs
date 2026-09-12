import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forge-CgqMJICj.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var forgeWords_createServerFn_handler = createServerRpc({
	id: "4f33485af221c800dab2859ff779546149dfbecb82236976d5c5bad3665da07b",
	name: "forgeWords",
	filename: "src/lib/game/forge.ts"
}, (opts) => forgeWords.__executeServer(opts));
var forgeWords = createServerFn({ method: "POST" }).validator((input) => ({ theme: String(input?.theme ?? "").slice(0, 80) })).handler(forgeWords_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "unavailable"
	};
	const theme = data.theme.trim() || "quiet library";
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 400,
			temperature: .7,
			messages: [{
				role: "system",
				content: "Reply with JSON only: {\"words\":[\"WORD\",...]}. 8-10 uppercase English words, 4-9 letters, A-Z only, theme-related, no phrases."
			}, {
				role: "user",
				content: `Theme: ${theme}`
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `xAI ${res.status}`
	};
	const text = (await res.json()).choices?.[0]?.message?.content ?? "";
	const jsonStart = text.indexOf("{");
	const jsonEnd = text.lastIndexOf("}");
	if (jsonStart < 0 || jsonEnd < 0) return {
		ok: false,
		error: "parse"
	};
	try {
		const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
		const words = (Array.isArray(parsed.words) ? parsed.words : []).map((w) => String(w).toUpperCase().replace(/[^A-Z]/g, "")).filter((w) => w.length >= 3 && w.length <= 10).slice(0, 12);
		if (words.length < 5) return {
			ok: false,
			error: "short"
		};
		return {
			ok: true,
			theme,
			words: [...new Set(words)]
		};
	} catch {
		return {
			ok: false,
			error: "parse"
		};
	}
});
//#endregion
export { forgeWords_createServerFn_handler };
