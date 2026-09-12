import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { _ as Compass, a as Trophy, b as BookOpen, c as Sparkles, d as Pause, f as Lock, g as Crown, h as Download, i as Type, l as RotateCcw, m as House, n as User, p as Lightbulb, r as Upload, s as Store, t as WholeWord, u as Play, v as Check, y as ChartColumn } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { a as Tooltip, i as ResponsiveContainer, n as XAxis, r as Area, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B13p22L_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GameAudio = class {
	ctx = null;
	gains = {};
	musicTimer = null;
	musicOn = false;
	vols = {
		master: .7,
		sfx: .8,
		music: .25
	};
	unlock() {
		if (typeof window === "undefined") return;
		const AC = window.AudioContext || window.webkitAudioContext;
		if (!AC) return;
		if (!this.ctx) {
			this.ctx = new AC({ latencyHint: "interactive" });
			const master = this.ctx.createGain();
			const sfx = this.ctx.createGain();
			const music = this.ctx.createGain();
			sfx.connect(master);
			music.connect(master);
			master.connect(this.ctx.destination);
			this.gains.master = master;
			this.gains.sfx = sfx;
			this.gains.music = music;
			this.applyVols();
		}
		if (this.ctx.state === "suspended") this.ctx.resume();
	}
	setVol(bus, v) {
		this.vols[bus] = v;
		this.applyVols();
	}
	applyVols() {
		const now = this.ctx?.currentTime ?? 0;
		const curve = (x) => x * x;
		this.gains.master?.gain.setTargetAtTime(curve(this.vols.master), now, .03);
		this.gains.sfx?.gain.setTargetAtTime(curve(this.vols.sfx), now, .03);
		this.gains.music?.gain.setTargetAtTime(curve(this.vols.music), now, .03);
	}
	tone(freq, dur, type = "sine", gain = .08, bus = "sfx", slide) {
		if (!this.ctx || !this.gains[bus]) return;
		const t0 = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const g = this.ctx.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(freq, t0);
		if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t0 + dur);
		g.gain.setValueAtTime(1e-4, t0);
		g.gain.exponentialRampToValueAtTime(gain, t0 + .012);
		g.gain.exponentialRampToValueAtTime(1e-4, t0 + dur);
		osc.connect(g);
		g.connect(this.gains[bus]);
		osc.start(t0);
		osc.stop(t0 + dur + .02);
		osc.onended = () => {
			osc.disconnect();
			g.disconnect();
		};
	}
	click() {
		this.tone(720 + Math.random() * 40, .05, "triangle", .04);
	}
	select() {
		this.tone(420 + Math.random() * 80, .06, "sine", .035);
	}
	found() {
		this.tone(523, .12, "triangle", .07);
		this.tone(784, .16, "sine", .05);
	}
	error() {
		this.tone(180, .14, "square", .04, "sfx", 110);
	}
	win() {
		[
			523,
			659,
			784,
			1046
		].forEach((n, i) => {
			setTimeout(() => this.tone(n, .22, "triangle", .06), i * 90);
		});
	}
	coin() {
		this.tone(980, .08, "square", .035);
		this.tone(1320, .12, "sine", .03);
	}
	hint() {
		this.tone(640, .1, "sine", .04, "sfx", 420);
	}
	startMusic() {
		this.unlock();
		this.musicOn = true;
		this.tickMusic();
	}
	stopMusic() {
		this.musicOn = false;
		if (this.musicTimer != null) window.clearTimeout(this.musicTimer);
		this.musicTimer = null;
	}
	tickMusic() {
		if (!this.musicOn || !this.ctx) return;
		const scale = [
			196,
			233,
			262,
			311,
			349
		];
		const n = scale[Math.floor(Math.random() * scale.length)];
		this.tone(n, 1.6, "sine", .03, "music");
		this.tone(n * 2, 1.4, "triangle", .012, "music");
		this.musicTimer = window.setTimeout(() => this.tickMusic(), 1800 + Math.random() * 600);
	}
};
var audio = new GameAudio();
var EN = {
	appName: "Lexora",
	tagline: "Find the words. Keep the journey.",
	tapToBegin: "Tap to begin",
	play: "Begin journey",
	continue: "Continue",
	journey: "Journey",
	daily: "Daily",
	modes: "Modes",
	shop: "Shop",
	stats: "Ledger",
	achievements: "Marks",
	settings: "Settings",
	profile: "Profile",
	dictionary: "Lexicon",
	spin: "Fortune",
	forge: "Forge",
	home: "Home",
	more: "More",
	classic: "Classic",
	timed: "Time attack",
	zen: "Zen",
	fog: "Fog",
	rush: "Category rush",
	endless: "Endless",
	hintFirst: "First letter",
	hintLetter: "Reveal letter",
	hintWord: "Reveal word",
	coins: "Coins",
	gems: "Gems",
	energy: "Energy",
	xp: "XP",
	claim: "Claim",
	claimed: "Claimed",
	streak: "Streak",
	pause: "Pause",
	resume: "Resume",
	quit: "Leave folio",
	next: "Next folio",
	retry: "Try again",
	found: "Found",
	remaining: "Remaining",
	levelComplete: "Folio complete",
	perfect: "Perfect",
	noHints: "No hints",
	speedBonus: "Swift hand",
	buy: "Buy",
	owned: "Owned",
	exportSave: "Export save",
	importSave: "Import save",
	reset: "Reset progress",
	language: "Language",
	theme: "Theme",
	sound: "Sound",
	music: "Music",
	reduceMotion: "Reduce motion",
	dark: "Ink",
	light: "Paper",
	sepia: "Sepia",
	amoled: "Void",
	offline: "Offline",
	online: "Online",
	wordOfDay: "Word of the day",
	playerName: "Reader name",
	dailyReward: "Morning gift",
	luckySpin: "Spin the wheel",
	energyEmpty: "Energy spent — wait or refill",
	refill: "Refill",
	howTo: "Drag through letters in a straight line.",
	worlds: "Worlds",
	legend: "Legend",
	locked: "Locked",
	boss: "Titan",
	resultWin: "Every word found.",
	resultLose: "Time folded in.",
	combo: "Combo",
	mistakes: "Misreads",
	time: "Time",
	hints: "Hints",
	saveCopied: "Save copied",
	saveImported: "Save restored",
	confirmReset: "Erase all local progress?",
	cancel: "Cancel",
	confirm: "Confirm",
	vibration: "Haptics",
	screenShake: "Screen shake",
	largeText: "Large type",
	showDirections: "Hint compass",
	autoHint: "Idle hint glow",
	highContrast: "High contrast",
	colorBlind: "Colour-safe grid",
	masterVol: "Master",
	sfxVol: "Tones",
	musicVol: "Underscore",
	appearance: "Appearance",
	gameplay: "Play",
	audio: "Audio",
	access: "Ease",
	data: "Data",
	general: "General",
	back: "Back",
	shopHints: "Hint bundle",
	shopEnergy: "Full energy",
	shopGemEnergy: "Instant energy",
	shopSpin: "Extra spin",
	notEnough: "Not enough",
	comeTomorrow: "Return tomorrow",
	spinNow: "Spin",
	forgePrompt: "A theme for new words",
	forgeGo: "Compose folio",
	forgeWait: "Composing…",
	forgeFail: "Forge is quiet — using the archive",
	words: "Words",
	accuracy: "Accuracy",
	playtime: "Hours at the desk",
	bestTime: "Swiftest folio",
	favorite: "Favourite shelf",
	greetingDawn: "Morning, reader",
	greetingDay: "Good day",
	greetingDusk: "Evening",
	greetingNight: "The lamps are lit",
	nextEnergy: "Next energy",
	worldComplete: "World quieted",
	tutorial: "Draw a line through a hidden word.",
	skip: "Skip",
	close: "Close",
	avatars: "Marks",
	selectLevel: "Open a folio",
	reward: "Reward"
};
var UR = {
	...EN,
	tagline: "الفاظ ڈھونڈیں۔ سفر جاری رکھیں۔",
	tapToBegin: "شروع کرنے کے لیے چھوئیں",
	play: "سفر شروع کریں",
	continue: "جاری رکھیں",
	journey: "سفر",
	daily: "روزانہ",
	modes: "انداز",
	shop: "دکان",
	stats: "کھاتہ",
	achievements: "نشانات",
	settings: "ترتیبات",
	profile: "پروفائل",
	dictionary: "لغت",
	spin: "قسمت",
	forge: "تخلیق",
	home: "گھر",
	more: "مزید",
	classic: "کلاسک",
	timed: "وقت کی دوڑ",
	zen: "سکون",
	fog: "دھند",
	rush: "زمرہ دوڑ",
	endless: "لامتناہی",
	hintFirst: "پہلا حرف",
	hintLetter: "ایک حرف",
	hintWord: "پورا لفظ",
	coins: "سکے",
	gems: "جواہر",
	energy: "توانائی",
	claim: "حاصل کریں",
	claimed: "مل چکا",
	streak: "سلسلہ",
	pause: "توقف",
	resume: "واپس",
	quit: "چھوڑیں",
	next: "اگلا صفحہ",
	retry: "دوبارہ",
	found: "ملے",
	remaining: "باقی",
	levelComplete: "صفحہ مکمل",
	perfect: "کامل",
	noHints: "بلا اشارہ",
	speedBonus: "تیز ہاتھ",
	buy: "خریدیں",
	owned: "موجود",
	exportSave: "محفوظ برآمد",
	importSave: "محفوظ درآمد",
	reset: "پیشرفت مٹائیں",
	language: "زبان",
	theme: "رنگ",
	sound: "آواز",
	music: "موسیقی",
	reduceMotion: "کم حرکت",
	dark: "سیاہی",
	light: "کاغذ",
	sepia: "خاکی",
	amoled: "خلا",
	offline: "آف لائن",
	online: "آن لائن",
	wordOfDay: "آج کا لفظ",
	playerName: "پڑھنے والے کا نام",
	dailyReward: "صبح کا تحفہ",
	luckySpin: "چکر لگائیں",
	energyEmpty: "توانائی ختم — انتظار یا بھریں",
	refill: "بھریں",
	howTo: "حروف پر سیدھی لکیر کھینچیں۔",
	worlds: "جہان",
	legend: "افسانہ",
	locked: "مقفل",
	boss: "دیو",
	resultWin: "ہر لفظ مل گیا۔",
	resultLose: "وقت سمٹ گیا۔",
	combo: "زنجیر",
	mistakes: "غلطیاں",
	time: "وقت",
	hints: "اشارے",
	saveCopied: "محفوظ نقل ہو گیا",
	saveImported: "محفوظ واپس آ گیا",
	confirmReset: "ساری پیشرفت مٹا دیں؟",
	cancel: "منسوخ",
	confirm: "تصدیق",
	vibration: "لرزش",
	screenShake: "لرزشِ پردہ",
	largeText: "بڑا متن",
	showDirections: "سمت نما",
	autoHint: "خاموش اشارہ",
	highContrast: "زیادہ تضاد",
	colorBlind: "رنگ محفوظ",
	masterVol: "مرکزی",
	sfxVol: "آوازیں",
	musicVol: "پس منظر",
	appearance: "شکل",
	gameplay: "کھیل",
	audio: "آڈیو",
	access: "آسانی",
	data: "ڈیٹا",
	general: "عام",
	back: "واپس",
	shopHints: "اشاروں کا گچھا",
	shopEnergy: "پوری توانائی",
	shopGemEnergy: "فوری توانائی",
	shopSpin: "اضافی چکر",
	notEnough: "ناکافی",
	comeTomorrow: "کل آئیے",
	spinNow: "گھمائیں",
	forgePrompt: "نئے الفاظ کا موضوع",
	forgeGo: "صفحہ بنائیں",
	forgeWait: "لکھا جا رہا ہے…",
	forgeFail: "تخلیق خاموش — محفوظ ذخیرہ استعمال",
	words: "الفاظ",
	accuracy: "درستگی",
	playtime: "میز پر گھنٹے",
	bestTime: "سب سے تیز",
	favorite: "پسندیدہ تہہ",
	greetingDawn: "صبح بخیر",
	greetingDay: "سلام",
	greetingDusk: "شام بخیر",
	greetingNight: "چراغ جل رہے ہیں",
	nextEnergy: "اگلی توانائی",
	worldComplete: "جہان خاموش ہوا",
	tutorial: "چھپے لفظ پر لکیر کھینچیں۔",
	skip: "چھوڑیں",
	close: "بند",
	avatars: "نشان",
	selectLevel: "صفحہ کھولیں",
	reward: "انعام"
};
var AR = {
	...EN,
	tagline: "ابحث عن الكلمات. واصل الرحلة.",
	tapToBegin: "المس للبدء",
	play: "ابدأ الرحلة",
	continue: "متابعة",
	journey: "الرحلة",
	daily: "يومي",
	modes: "أنماط",
	shop: "المتجر",
	stats: "السجل",
	achievements: "أوسمة",
	settings: "إعدادات",
	profile: "الملف",
	pause: "إيقاف",
	resume: "استئناف",
	quit: "خروج",
	next: "التالي",
	language: "اللغة",
	theme: "السمة",
	back: "رجوع"
};
var HI = {
	...EN,
	tagline: "शब्द खोजो। यात्रा जारी रखो।",
	tapToBegin: "शुरू करने के लिए स्पर्श करें",
	play: "यात्रा शुरू करें",
	continue: "जारी रखें",
	journey: "यात्रा",
	daily: "दैनिक",
	modes: "मोड",
	shop: "दुकान",
	settings: "सेटिंग्स",
	language: "भाषा",
	back: "वापस"
};
var ES = {
	...EN,
	tagline: "Encuentra las palabras. Sigue el viaje.",
	tapToBegin: "Toca para empezar",
	play: "Empezar viaje",
	continue: "Continuar",
	journey: "Viaje",
	daily: "Diario",
	modes: "Modos",
	shop: "Tienda",
	settings: "Ajustes",
	language: "Idioma",
	back: "Volver"
};
var FR = {
	...EN,
	tagline: "Trouvez les mots. Poursuivez le voyage.",
	tapToBegin: "Touchez pour commencer",
	play: "Commencer",
	continue: "Continuer",
	journey: "Voyage",
	daily: "Quotidien",
	modes: "Modes",
	shop: "Boutique",
	settings: "Réglages",
	language: "Langue",
	back: "Retour"
};
var DE = {
	...EN,
	tagline: "Finde die Wörter. Setze die Reise fort.",
	tapToBegin: "Tippen zum Start",
	play: "Reise beginnen",
	continue: "Weiter",
	journey: "Reise",
	daily: "Täglich",
	modes: "Modi",
	shop: "Laden",
	settings: "Einstellungen",
	language: "Sprache",
	back: "Zurück"
};
var TR = {
	...EN,
	tagline: "Kelimeleri bul. Yolculuğa devam et.",
	tapToBegin: "Başlamak için dokun",
	play: "Yolculuğu başlat",
	continue: "Devam",
	journey: "Yolculuk",
	daily: "Günlük",
	modes: "Modlar",
	shop: "Dükkân",
	settings: "Ayarlar",
	language: "Dil",
	back: "Geri"
};
var ZH = {
	...EN,
	tagline: "找出词语，继续旅程。",
	tapToBegin: "点击开始",
	play: "开始旅程",
	continue: "继续",
	journey: "旅程",
	daily: "每日",
	modes: "模式",
	shop: "商店",
	settings: "设置",
	language: "语言",
	back: "返回"
};
var JA = {
	...EN,
	tagline: "言葉を見つけ、旅を続ける。",
	tapToBegin: "タップして始める",
	play: "旅を始める",
	continue: "続ける",
	journey: "旅",
	daily: "デイリー",
	modes: "モード",
	shop: "ショップ",
	settings: "設定",
	language: "言語",
	back: "戻る"
};
var TABLES = {
	en: EN,
	ur: UR,
	hi: HI,
	ar: AR,
	ru: {
		...EN,
		tagline: "Alfaaz dhoondo. Safar jaari rakho.",
		tapToBegin: "Shuru karne ke liye chhooen",
		play: "Safar shuru karein",
		continue: "Jaari rakhein",
		journey: "Safar",
		daily: "Rozana",
		modes: "Andaaz",
		shop: "Dukaan",
		stats: "Khata",
		settings: "Tarteeb",
		language: "Zubaan",
		back: "Wapis",
		pause: "Rukein",
		resume: "Wapis",
		hintFirst: "Pehla harf",
		hintWord: "Poora lafz"
	},
	bn: EN,
	tr: TR,
	es: ES,
	fr: FR,
	de: DE,
	zh: ZH,
	ja: JA
};
var LANG_META = [
	{
		id: "en",
		label: "English",
		dir: "ltr"
	},
	{
		id: "ur",
		label: "اردو",
		dir: "rtl"
	},
	{
		id: "ru",
		label: "Roman Urdu",
		dir: "ltr"
	},
	{
		id: "hi",
		label: "हिन्दी",
		dir: "ltr"
	},
	{
		id: "ar",
		label: "العربية",
		dir: "rtl"
	},
	{
		id: "tr",
		label: "Türkçe",
		dir: "ltr"
	},
	{
		id: "es",
		label: "Español",
		dir: "ltr"
	},
	{
		id: "fr",
		label: "Français",
		dir: "ltr"
	},
	{
		id: "de",
		label: "Deutsch",
		dir: "ltr"
	},
	{
		id: "zh",
		label: "中文",
		dir: "ltr"
	},
	{
		id: "ja",
		label: "日本語",
		dir: "ltr"
	},
	{
		id: "bn",
		label: "বাংলা",
		dir: "ltr"
	}
];
function t(lang, key) {
	return TABLES[lang]?.[key] ?? EN[key] ?? key;
}
function dirFor(lang) {
	return LANG_META.find((l) => l.id === lang)?.dir ?? "ltr";
}
function greetingKey(h = (/* @__PURE__ */ new Date()).getHours()) {
	if (h < 5) return "greetingNight";
	if (h < 12) return "greetingDawn";
	if (h < 17) return "greetingDay";
	if (h < 21) return "greetingDusk";
	return "greetingNight";
}
function detectLang() {
	if (typeof navigator === "undefined") return "en";
	const n = (navigator.language || "en").toLowerCase();
	if (n.startsWith("ur")) return "ur";
	if (n.startsWith("ar")) return "ar";
	if (n.startsWith("hi")) return "hi";
	if (n.startsWith("tr")) return "tr";
	if (n.startsWith("es")) return "es";
	if (n.startsWith("fr")) return "fr";
	if (n.startsWith("de")) return "de";
	if (n.startsWith("zh")) return "zh";
	if (n.startsWith("ja")) return "ja";
	if (n.startsWith("bn")) return "bn";
	return "en";
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatDuration(seconds) {
	const s = Math.max(0, Math.floor(seconds));
	return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}
function seededRng(seed) {
	let s = seed >>> 0 || 1;
	return () => {
		s = Math.imul(s, 1664525) + 1013904223 >>> 0;
		return s / 4294967296;
	};
}
function shuffle(arr, rand) {
	const a = arr.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
function pick(arr, rand) {
	return arr[Math.floor(rand() * arr.length)];
}
function todayKey(d = /* @__PURE__ */ new Date()) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function hashString(str) {
	let h = 2166136261;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
var CATEGORIES = {
	animals: [
		"LION",
		"TIGER",
		"ZEBRA",
		"PANDA",
		"KOALA",
		"HORSE",
		"SHEEP",
		"GOAT",
		"WOLF",
		"FOX",
		"BEAR",
		"DEER",
		"CAMEL",
		"WHALE",
		"OTTER",
		"BADGER",
		"LYNX",
		"PUMA",
		"HIPPO",
		"RHINO",
		"MOUSE",
		"SQUIRREL",
		"MOOSE",
		"BISON",
		"LEMUR",
		"SLOTH",
		"WOMBAT",
		"JACKAL",
		"HYENA",
		"WALRUS",
		"SEAL",
		"FERRET",
		"WEASEL",
		"JAGUAR",
		"COUGAR",
		"ALPACA",
		"DONKEY",
		"YAK",
		"BOAR",
		"HARE",
		"MINK",
		"ORCA",
		"SHARK",
		"RAY",
		"EEL"
	],
	birds: [
		"EAGLE",
		"HAWK",
		"OWL",
		"SWAN",
		"DUCK",
		"GOOSE",
		"CROW",
		"RAVEN",
		"ROBIN",
		"SPARROW",
		"FINCH",
		"WREN",
		"HERON",
		"STORK",
		"CRANE",
		"IBIS",
		"PARROT",
		"MACAW",
		"TOUCAN",
		"PELICAN",
		"FALCON",
		"CONDOR",
		"OSPREY",
		"PIGEON",
		"DOVE",
		"QUAIL",
		"TURKEY",
		"PEACOCK",
		"OSTRICH",
		"EMU",
		"KIWI",
		"PENGUIN",
		"ALBATROSS",
		"STARLING",
		"MAGPIE",
		"JAY",
		"LARK",
		"THRUSH",
		"ORIOLE",
		"WARBLER"
	],
	fruits: [
		"APPLE",
		"MANGO",
		"PEACH",
		"GRAPE",
		"LEMON",
		"LIME",
		"MELON",
		"BERRY",
		"CHERRY",
		"PAPAYA",
		"GUAVA",
		"PLUM",
		"PEAR",
		"FIG",
		"DATE",
		"KIWI",
		"BANANA",
		"ORANGE",
		"APRICOT",
		"COCONUT",
		"LYCHEE",
		"DURIAN",
		"OLIVE",
		"RAISIN",
		"PRUNE",
		"QUINCE",
		"POMELO",
		"CITRON",
		"TAMARIND"
	],
	vegetables: [
		"ONION",
		"GARLIC",
		"CARROT",
		"POTATO",
		"TOMATO",
		"PEPPER",
		"SPINACH",
		"CABBAGE",
		"LETTUCE",
		"CELERY",
		"RADISH",
		"TURNIP",
		"BEET",
		"SQUASH",
		"PUMPKIN",
		"CORN",
		"BEANS",
		"PEAS",
		"OKRA",
		"LEEK",
		"FENNEL",
		"KALE",
		"CHARD",
		"YAM",
		"GINGER"
	],
	countries: [
		"JAPAN",
		"BRAZIL",
		"CANADA",
		"FRANCE",
		"SPAIN",
		"ITALY",
		"EGYPT",
		"KENYA",
		"CHINA",
		"INDIA",
		"NEPAL",
		"PERU",
		"CHILE",
		"MEXICO",
		"POLAND",
		"GREECE",
		"TURKEY",
		"SUDAN",
		"GHANA",
		"NORWAY",
		"SWEDEN",
		"FINLAND",
		"IRELAND",
		"MOROCCO",
		"TUNISIA",
		"JORDAN",
		"QATAR",
		"OMAN",
		"YEMEN",
		"MALTA",
		"CUBA",
		"HAITI",
		"SAMOA",
		"TONGA",
		"FIJI",
		"PAKISTAN",
		"IRAN",
		"IRAQ",
		"SYRIA",
		"LEBANON"
	],
	cities: [
		"PARIS",
		"TOKYO",
		"LONDON",
		"CAIRO",
		"DUBAI",
		"LAHORE",
		"KARACHI",
		"ISLAMABAD",
		"DELHI",
		"MUMBAI",
		"BERLIN",
		"ROME",
		"OSLO",
		"SEOUL",
		"OSAKA",
		"KYOTO",
		"MIAMI",
		"BOSTON",
		"AUSTIN",
		"DENVER",
		"LISBON",
		"MADRID",
		"ATHENS",
		"PRAGUE",
		"VIENNA",
		"ZURICH",
		"GENEVA",
		"DUBLIN",
		"NAIROBI",
		"LAGOS",
		"RIYADH",
		"JEDDAH",
		"DOHA",
		"MUSCAT",
		"AMMAN",
		"BEIRUT",
		"ISTANBUL",
		"ANKARA",
		"TEHRAN",
		"BAGHDAD"
	],
	sports: [
		"SOCCER",
		"TENNIS",
		"CRICKET",
		"HOCKEY",
		"RUGBY",
		"GOLF",
		"BOXING",
		"SKIING",
		"SURFING",
		"ROWING",
		"FENCING",
		"ARCHERY",
		"JUDO",
		"KARATE",
		"DIVING",
		"POLO",
		"SQUASH",
		"CYCLING",
		"RUNNING",
		"JUMPING",
		"THROWING",
		"SWIMMING",
		"SKATING",
		"CLIMBING",
		"SAILING",
		"RACING",
		"WRESTLING",
		"VOLLEY",
		"BASEBALL"
	],
	professions: [
		"DOCTOR",
		"NURSE",
		"TEACHER",
		"PILOT",
		"CHEF",
		"BAKER",
		"ARTIST",
		"WRITER",
		"SINGER",
		"DANCER",
		"ACTOR",
		"JUDGE",
		"LAWYER",
		"FARMER",
		"MINER",
		"SAILOR",
		"SOLDIER",
		"GUARD",
		"DRIVER",
		"BUILDER",
		"MASON",
		"POTTER",
		"WEAVER",
		"TAILOR",
		"BARBER",
		"BANKER",
		"TRADER",
		"SCOUT",
		"RANGER",
		"EDITOR"
	],
	technology: [
		"ROBOT",
		"SERVER",
		"ROUTER",
		"PIXEL",
		"MODEM",
		"CHIP",
		"CODE",
		"LOGIC",
		"ARRAY",
		"CACHE",
		"CLOUD",
		"DRONE",
		"LASER",
		"RADAR",
		"SENSOR",
		"TABLET",
		"LAPTOP",
		"SCREEN",
		"MOUSE",
		"KEYBOARD",
		"PRINTER",
		"CAMERA",
		"PHONE",
		"SIGNAL",
		"PACKET",
		"BINARY",
		"VECTOR",
		"MATRIX",
		"THREAD",
		"SOCKET"
	],
	space: [
		"ORBIT",
		"COMET",
		"NEBULA",
		"QUASAR",
		"PULSAR",
		"PLANET",
		"MOON",
		"STAR",
		"NOVA",
		"GALAXY",
		"COSMOS",
		"VACUUM",
		"ROCKET",
		"SHUTTLE",
		"SATURN",
		"VENUS",
		"MARS",
		"EARTH",
		"PLUTO",
		"CERES",
		"TITAN",
		"EUROPA",
		"PHOBOS",
		"DEIMOS",
		"SOLAR",
		"LUNAR",
		"ASTEROID",
		"METEOR",
		"ECLIPSE",
		"AURORA"
	],
	ocean: [
		"WAVE",
		"TIDE",
		"CORAL",
		"REEF",
		"SHELL",
		"PEARL",
		"ANCHOR",
		"HARBOR",
		"LAGOON",
		"ATOLL",
		"CURRENT",
		"WHIRL",
		"SPONGE",
		"KELP",
		"ALGAE",
		"SQUID",
		"OCTOPUS",
		"JELLY",
		"CRAB",
		"LOBSTER",
		"SHRIMP",
		"OYSTER",
		"CLAM",
		"STARFISH",
		"URCHIN",
		"NARWHAL",
		"DOLPHIN",
		"PORPOISE",
		"MANATEE",
		"TURTLE"
	],
	body: [
		"HEART",
		"LIVER",
		"LUNGS",
		"BRAIN",
		"SPINE",
		"SKULL",
		"ELBOW",
		"KNEE",
		"WRIST",
		"ANKLE",
		"THUMB",
		"PALM",
		"TOOTH",
		"TONGUE",
		"THROAT",
		"NERVE",
		"VEIN",
		"BONE",
		"MUSCLE",
		"SKIN",
		"HAIR",
		"NAIL",
		"PUPIL",
		"IRIS",
		"RETINA",
		"CORNEA"
	],
	emotions: [
		"JOY",
		"HOPE",
		"FEAR",
		"RAGE",
		"CALM",
		"PRIDE",
		"SHAME",
		"GRIEF",
		"AWE",
		"WONDER",
		"BLISS",
		"ENVY",
		"TRUST",
		"PEACE",
		"ANGER",
		"SORROW",
		"COURAGE",
		"MERCY",
		"KINDNESS",
		"PATIENCE",
		"WARMTH",
		"LONGING",
		"RELIEF",
		"GUSTO"
	],
	food: [
		"BREAD",
		"RICE",
		"SOUP",
		"STEW",
		"CURRY",
		"SALAD",
		"PIZZA",
		"PASTA",
		"NOODLE",
		"HONEY",
		"SUGAR",
		"SPICE",
		"SAUCE",
		"CHEESE",
		"BUTTER",
		"YOGURT",
		"CREAM",
		"KABAB",
		"BIRYANI",
		"SAMOSA",
		"FALAFEL",
		"HUMMUS",
		"TAHINI",
		"NAAN",
		"ROTI",
		"HALVA",
		"KHEER",
		"LADDU",
		"JALEBI",
		"PAKORA"
	],
	colors: [
		"RED",
		"BLUE",
		"GREEN",
		"AMBER",
		"IVORY",
		"EBONY",
		"AZURE",
		"TEAL",
		"OLIVE",
		"MAROON",
		"CRIMSON",
		"VIOLET",
		"INDIGO",
		"SILVER",
		"GOLDEN",
		"COPPER",
		"BRONZE",
		"SCARLET",
		"MAGENTA",
		"CYAN",
		"PEACH",
		"CORAL",
		"SABLE",
		"SLATE",
		"PEARL"
	],
	weather: [
		"RAIN",
		"SNOW",
		"HAIL",
		"WIND",
		"STORM",
		"CLOUD",
		"FOG",
		"MIST",
		"FROST",
		"THAW",
		"DROUGHT",
		"BREEZE",
		"GALE",
		"THUNDER",
		"LIGHTNING",
		"MONSOON",
		"CYCLONE",
		"TYPHOON",
		"BLIZZARD",
		"DRIZZLE",
		"SHOWER",
		"SUNNY",
		"HUMID",
		"ARID"
	],
	nature: [
		"RIVER",
		"LAKE",
		"HILL",
		"VALLEY",
		"FOREST",
		"MEADOW",
		"DESERT",
		"CANYON",
		"CLIFF",
		"CAVE",
		"GROVE",
		"GLADE",
		"MARSH",
		"SWAMP",
		"PRAIRIE",
		"TUNDRA",
		"GLACIER",
		"VOLCANO",
		"ISLAND",
		"DELTA",
		"BASIN",
		"RIDGE",
		"PEAK",
		"SLOPE",
		"STREAM",
		"BROOK",
		"SPRING",
		"OASIS",
		"DUNE",
		"REEF"
	],
	music: [
		"PIANO",
		"VIOLIN",
		"GUITAR",
		"FLUTE",
		"HARP",
		"DRUM",
		"CELLO",
		"ORGAN",
		"HORN",
		"OBOE",
		"SITAR",
		"TABLA",
		"REBAB",
		"OUD",
		"LYRE",
		"SONG",
		"CHOIR",
		"OPERA",
		"SONATA",
		"FUGUE",
		"BALLAD",
		"HYMN",
		"CHANT",
		"RHYTHM",
		"MELODY",
		"HARMONY",
		"TEMPO",
		"SCALE",
		"CHORD",
		"OCTAVE"
	],
	vehicles: [
		"TRAIN",
		"PLANE",
		"SHIP",
		"TRUCK",
		"WAGON",
		"COACH",
		"FERRY",
		"CANOE",
		"YACHT",
		"SCOOTER",
		"CYCLE",
		"GLIDER",
		"ROCKET",
		"BARGE",
		"KAYAK",
		"RAFT",
		"CART",
		"TRACTOR",
		"TANKER",
		"LINER",
		"SUBWAY",
		"TRAM",
		"TAXI",
		"JEEP",
		"VAN"
	],
	school: [
		"BOOK",
		"PEN",
		"PENCIL",
		"PAPER",
		"RULER",
		"ERASER",
		"GLOBE",
		"MAP",
		"DESK",
		"CHALK",
		"LESSON",
		"EXAM",
		"ESSAY",
		"THESIS",
		"ALGEBRA",
		"GEOMETRY",
		"HISTORY",
		"PHYSICS",
		"BIOLOGY",
		"CHEMISTRY",
		"POETRY",
		"DRAMA",
		"MUSIC",
		"ART",
		"SPORT"
	],
	flowers: [
		"ROSE",
		"LILY",
		"IRIS",
		"TULIP",
		"DAISY",
		"VIOLET",
		"ORCHID",
		"JASMINE",
		"LOTUS",
		"PEONY",
		"POPPY",
		"LILAC",
		"ASTER",
		"DAHLIA",
		"PANSY",
		"MYRTLE",
		"LAUREL",
		"CLOVER",
		"FERN",
		"MOSS",
		"IVY",
		"CEDAR",
		"MAPLE",
		"OAK",
		"PINE",
		"BIRCH",
		"WILLOW"
	],
	islamic: [
		"IMAN",
		"SABR",
		"TAQWA",
		"SALAH",
		"ZAKAT",
		"HAJJ",
		"SAWM",
		"QURAN",
		"SUNNAH",
		"HADITH",
		"MASJID",
		"MINBAR",
		"MIHRAB",
		"KAABA",
		"ZAMZAM",
		"ARAFAH",
		"MINA",
		"TAWAF",
		"SAFA",
		"MARWA",
		"FATIHA",
		"TAWBA",
		"TAWAKKUL",
		"IKHLAS",
		"RAHMA",
		"NUR",
		"HIDAYAH",
		"BARAKA",
		"DUA",
		"TASBIH",
		"TAKBIR",
		"ADHAN",
		"IQAMA",
		"WUDU",
		"JANAZAH",
		"EID",
		"RAMADAN",
		"SHAWWAL",
		"MUHARRAM"
	],
	romanUrdu: [
		"DOST",
		"PYAAR",
		"KHUSH",
		"KITAB",
		"QALAM",
		"SITARA",
		"CHAND",
		"SURAJ",
		"ZAMEEN",
		"AASMAN",
		"DARYA",
		"PAHAR",
		"GULAB",
		"YASMIN",
		"UMMEED",
		"SABAR",
		"SHUKAR",
		"DUA",
		"ROSHNI",
		"ANDHERA",
		"SAFAR",
		"MANZIL",
		"RASTA",
		"GHAZAL",
		"SHAYARI",
		"DIL",
		"JAN",
		"WATAN",
		"GAON",
		"SHEHAR",
		"BACHPAN",
		"YAAD",
		"KHAWAB",
		"HAQEEQAT",
		"MEHMAN",
		"MEZBAN",
		"CHAI",
		"ROTI",
		"NAMAK",
		"MITHA"
	],
	verbs: [
		"WRITE",
		"READ",
		"SEEK",
		"FIND",
		"BUILD",
		"CRAFT",
		"LEARN",
		"TEACH",
		"GUIDE",
		"WATCH",
		"LISTEN",
		"SPEAK",
		"THINK",
		"DREAM",
		"CLIMB",
		"CROSS",
		"CARRY",
		"SHARE",
		"GIVE",
		"TAKE",
		"KEEP",
		"OPEN",
		"CLOSE",
		"BEGIN",
		"FINISH",
		"CREATE",
		"SOLVE",
		"PLAY",
		"MOVE",
		"REST",
		"GROW",
		"SHINE",
		"BLOOM",
		"FLOW",
		"RISE",
		"FALL"
	]
};
var CATEGORY_KEYS = Object.keys(CATEGORIES);
var CATEGORY_LABEL = {
	animals: "Animals",
	birds: "Birds",
	fruits: "Fruits",
	vegetables: "Vegetables",
	countries: "Countries",
	cities: "Cities",
	sports: "Sports",
	professions: "Professions",
	technology: "Technology",
	space: "Space",
	ocean: "Ocean",
	body: "Body",
	emotions: "Emotions",
	food: "Food",
	colors: "Colors",
	weather: "Weather",
	nature: "Nature",
	music: "Music",
	vehicles: "Vehicles",
	school: "School",
	flowers: "Flora",
	islamic: "Noor",
	romanUrdu: "Roman Urdu",
	verbs: "Verbs"
};
var WORLD_CATEGORIES = [
	[
		"animals",
		"birds",
		"nature",
		"flowers"
	],
	[
		"ocean",
		"food",
		"fruits",
		"vegetables"
	],
	[
		"countries",
		"cities",
		"vehicles",
		"weather"
	],
	[
		"music",
		"colors",
		"emotions",
		"school"
	],
	[
		"space",
		"technology",
		"islamic",
		"romanUrdu"
	]
];
var WORLD_META = [
	{
		id: 1,
		name: "Meadow",
		tagline: "Soft hills, patient names"
	},
	{
		id: 2,
		name: "Harbor",
		tagline: "Salt, spice, and tide"
	},
	{
		id: 3,
		name: "Atlas",
		tagline: "Roads drawn in ink"
	},
	{
		id: 4,
		name: "Atelier",
		tagline: "Colour, chord, and craft"
	},
	{
		id: 5,
		name: "Cosmos",
		tagline: "Quiet lights, far names"
	}
];
function allWords() {
	const set = /* @__PURE__ */ new Set();
	for (const list of Object.values(CATEGORIES)) for (const w of list) {
		const u = w.toUpperCase().replace(/[^A-Z]/g, "");
		if (u.length >= 3 && u.length <= 12) set.add(u);
	}
	return [...set];
}
function wordsForCategory(cat) {
	return (CATEGORIES[cat] ?? allWords()).map((w) => w.toUpperCase().replace(/[^A-Z]/g, "")).filter((w) => w.length >= 3);
}
var WORD_MEANINGS = {
	SABR: "Patience — remaining steady.",
	IMAN: "Faith — a quiet certainty.",
	NUR: "Light — that which reveals.",
	SAFAR: "Journey — the road itself.",
	MANZIL: "Destination — where the road ends.",
	GHAZAL: "A lyric form of couplets.",
	TAQWA: "God-consciousness, a careful heart.",
	RAHMA: "Mercy — tenderness given freely."
};
function campaignLevel(n) {
	const i = Math.max(1, Math.min(40, n));
	const world = Math.ceil(i / 8);
	const index = (i - 1) % 8 + 1;
	const boss = index === 8;
	const cats = WORLD_CATEGORIES[world - 1] ?? WORLD_CATEGORIES[0];
	const category = cats[(index - 1) % cats.length];
	const size = Math.min(12, 8 + Math.floor((world - 1) / 1) + (boss ? 1 : 0));
	const wordCount = 5 + world + (boss ? 2 : Math.floor((index - 1) / 3));
	const dirs = world === 1 ? index <= 3 ? 3 : 4 : world === 2 ? 6 : 8;
	const difficulty = world <= 1 ? "easy" : world === 2 ? "medium" : world <= 4 ? "hard" : "expert";
	const timeLimit = boss ? 90 + world * 20 : world >= 4 ? 140 + world * 10 : void 0;
	return {
		id: `w${world}-${index}`,
		world,
		index,
		title: boss ? `${WORLD_META[world - 1]?.name} Titan` : `${WORLD_META[world - 1]?.name} ${index}`,
		size,
		wordCount: Math.min(14, wordCount),
		category,
		difficulty,
		dirs,
		boss,
		timeLimit
	};
}
function allCampaign() {
	return Array.from({ length: 40 }, (_, i) => campaignLevel(i + 1));
}
function legendLevel(n) {
	const size = Math.min(16, 10 + Math.floor(n / 12));
	const wordCount = Math.min(18, 8 + Math.floor(n / 8));
	const category = CATEGORY_KEYS[n % CATEGORY_KEYS.length];
	return {
		id: `legend-${n}`,
		world: 6,
		index: n,
		title: `Legend ${n}`,
		size,
		wordCount,
		category,
		difficulty: n > 20 ? "expert" : "hard",
		dirs: 8,
		timeLimit: n % 5 === 0 ? 120 : void 0
	};
}
function sessionFromLevel(level, mode = "classic") {
	const seed = hashString(level.id + ":lexora");
	return {
		mode: level.timeLimit && mode === "classic" ? "timed" : mode,
		levelId: level.id,
		title: level.title,
		category: level.category,
		seed,
		size: level.size,
		wordCount: level.wordCount,
		dirs: level.dirs,
		timeLimit: mode === "zen" ? void 0 : level.timeLimit,
		energyCost: mode === "zen" || mode === "daily" ? 0 : 1
	};
}
function dailySession(dateKey) {
	const seed = hashString(`daily:${dateKey}`);
	const cat = CATEGORY_KEYS[seed % CATEGORY_KEYS.length];
	return {
		mode: "daily",
		levelId: `daily-${dateKey}`,
		title: "Daily folio",
		category: cat,
		seed,
		size: 10,
		wordCount: 8,
		dirs: 8,
		timeLimit: 150,
		energyCost: 0
	};
}
function endlessSession(wave) {
	const seed = hashString(`endless:${wave}:${Date.now() % 1e5}`);
	const cat = CATEGORY_KEYS[wave % CATEGORY_KEYS.length];
	const size = Math.min(14, 8 + Math.floor(wave / 3));
	return {
		mode: "endless",
		title: `Wave ${wave}`,
		category: cat,
		seed,
		size,
		wordCount: Math.min(16, 5 + wave),
		dirs: wave < 2 ? 4 : 8,
		energyCost: 0
	};
}
function modeSession(mode, extra) {
	const cat = extra?.category ?? CATEGORY_KEYS[Math.floor(Math.random() * CATEGORY_KEYS.length)];
	return {
		mode,
		title: mode === "timed" ? "Time attack" : mode === "fog" ? "Fog bank" : mode === "rush" ? `${CATEGORY_LABEL[cat] ?? cat} rush` : mode === "zen" ? "Zen folio" : "Classic folio",
		category: cat,
		seed: Math.random() * 4294967295 >>> 0,
		size: mode === "rush" ? 9 : mode === "fog" ? 10 : 9,
		wordCount: mode === "rush" ? 8 : 6,
		dirs: mode === "zen" ? 4 : 8,
		timeLimit: mode === "timed" || mode === "rush" ? 90 : mode === "fog" ? 120 : void 0,
		energyCost: mode === "zen" ? 0 : 1,
		...extra
	};
}
function xpForLevel(playerXp) {
	let level = 1;
	let need = 80;
	let remain = playerXp;
	while (remain >= need && level < 99) {
		remain -= need;
		level += 1;
		need = Math.floor(80 * Math.pow(1.12, level - 1));
	}
	return {
		level,
		into: remain,
		need
	};
}
function starsFor(result) {
	let s = 1;
	if (result.hintsUsed === 0) s += 1;
	if (result.mistakes === 0) s += 1;
	if (result.timeLimit && result.elapsed < result.timeLimit * .45) s = Math.max(s, 3);
	return Math.min(3, s);
}
var ACHIEVEMENTS = [
	{
		id: "first_word",
		title: "First ink",
		detail: "Find a word.",
		test: (s) => s.wordsFound >= 1
	},
	{
		id: "words_100",
		title: "Hundred names",
		detail: "Find 100 words.",
		test: (s) => s.wordsFound >= 100
	},
	{
		id: "words_500",
		title: "Lexicon hand",
		detail: "Find 500 words.",
		test: (s) => s.wordsFound >= 500
	},
	{
		id: "levels_10",
		title: "Ten folios",
		detail: "Complete 10 levels.",
		test: (s) => s.levelsCompleted >= 10
	},
	{
		id: "levels_40",
		title: "World walker",
		detail: "Finish the five worlds.",
		test: (s) => s.levelsCompleted >= 40
	},
	{
		id: "no_hint_10",
		title: "Unaided",
		detail: "Clear 10 levels without hints.",
		test: (_s, e) => Number(e?.noHintLevels ?? 0) >= 10
	},
	{
		id: "speed",
		title: "Swift hand",
		detail: "Finish a folio under 30 seconds.",
		test: (_s, e) => !!e?.fastClear
	},
	{
		id: "perfect_5",
		title: "Clean copy",
		detail: "Five perfect folios.",
		test: (s) => s.perfects >= 5
	},
	{
		id: "daily_7",
		title: "Week at the desk",
		detail: "Seven-day streak.",
		test: (s) => s.longestStreak >= 7
	},
	{
		id: "coins_5k",
		title: "Full purse",
		detail: "Earn 5,000 coins.",
		test: (s) => s.coinsEarned >= 5e3
	},
	{
		id: "boss",
		title: "Titan slayer",
		detail: "Defeat a world titan.",
		test: (s) => s.bosses >= 1
	},
	{
		id: "boss_5",
		title: "Five titans",
		detail: "Defeat every world titan.",
		test: (s) => s.bosses >= 5
	},
	{
		id: "survivor",
		title: "Last grain",
		detail: "Win a timed folio with under 5s left.",
		test: (_s, e) => !!e?.clutch
	},
	{
		id: "fog",
		title: "Fog walker",
		detail: "Clear a fog folio.",
		test: (s) => s.fogClears >= 1
	},
	{
		id: "timed",
		title: "Against the lamp",
		detail: "Clear a time attack.",
		test: (s) => s.timedClears >= 1
	},
	{
		id: "zen_5",
		title: "Quiet desk",
		detail: "Five zen folios.",
		test: (s) => s.zenClears >= 5
	},
	{
		id: "combo",
		title: "Linked hand",
		detail: "Reach a 5-word combo.",
		test: (s) => s.bestCombo >= 5
	},
	{
		id: "spin",
		title: "Fortune’s nod",
		detail: "Spin the wheel.",
		test: (s) => s.spins >= 1
	},
	{
		id: "dailies_3",
		title: "Three mornings",
		detail: "Complete 3 dailies.",
		test: (s) => s.dailies >= 3
	},
	{
		id: "shopper",
		title: "Patron",
		detail: "Spend 500 coins.",
		test: (s) => s.coinsSpent >= 500
	},
	{
		id: "accuracy",
		title: "Sure eye",
		detail: "Finish with zero misreads.",
		test: (_s, e) => !!e?.noMistakes
	},
	{
		id: "legend",
		title: "Legend ink",
		detail: "Open a Legend folio.",
		test: (_s, e) => !!e?.legend
	}
];
function newlyUnlocked(have, stats, extra) {
	return ACHIEVEMENTS.filter((a) => !have[a.id] && a.test(stats, extra));
}
var ENERGY_MAX = 20;
var ENERGY_MS = 3e5;
var SAVE_VERSION = 1;
var HINT_COST = {
	first: 10,
	letter: 20,
	word: 50
};
var AVATARS = [
	"L",
	"N",
	"S",
	"M",
	"A",
	"K",
	"R",
	"H"
];
var defaultSettings = () => ({
	lang: typeof navigator === "undefined" ? "en" : detectLang(),
	theme: "dark",
	master: .75,
	music: .2,
	sfx: .8,
	reduceMotion: false,
	screenShake: true,
	vibration: true,
	showDirections: true,
	largeText: false,
	colorBlind: false,
	highContrast: false,
	autoHint: false,
	confirmQuit: true
});
var defaultStats = () => ({
	wordsFound: 0,
	levelsCompleted: 0,
	timePlayed: 0,
	hintsUsed: 0,
	mistakes: 0,
	longestStreak: 0,
	currentStreak: 0,
	coinsEarned: 0,
	coinsSpent: 0,
	perfects: 0,
	dailies: 0,
	bosses: 0,
	fogClears: 0,
	timedClears: 0,
	zenClears: 0,
	bestCombo: 0,
	fastestLevel: 0,
	spins: 0
});
function computeEnergy(energy, energyAt, now = Date.now()) {
	if (energy >= ENERGY_MAX) return {
		energy,
		energyAt
	};
	const gained = Math.floor((now - energyAt) / ENERGY_MS);
	if (gained <= 0) return {
		energy,
		energyAt
	};
	const next = Math.min(ENERGY_MAX, energy + gained);
	return {
		energy: next,
		energyAt: energyAt + (next - energy) * ENERGY_MS
	};
}
var blank = () => ({
	version: SAVE_VERSION,
	name: "Reader",
	avatar: "L",
	xp: 0,
	coins: 180,
	gems: 5,
	energy: ENERGY_MAX,
	energyAt: Date.now(),
	campaignIndex: 1,
	records: {},
	achievements: {},
	noHintLevels: 0,
	settings: defaultSettings(),
	stats: defaultStats(),
	hintPacks: 2,
	lastDailyClaim: "",
	lastDailyPlay: "",
	lastSpin: "",
	lastLogin: "",
	seenTutorial: false,
	ownedThemes: ["dark", "light"],
	wordLog: {},
	toast: null
});
var ENERGY_MS_VALUE = ENERGY_MS;
var useGame = create()(persist((set, get) => ({
	...blank(),
	hydrated: false,
	markHydrated: () => set({ hydrated: true }),
	setName: (n) => set({ name: n.slice(0, 18) || "Reader" }),
	setAvatar: (a) => set({ avatar: a }),
	patchSettings: (p) => set({ settings: {
		...get().settings,
		...p
	} }),
	energyNow: () => {
		const e = computeEnergy(get().energy, get().energyAt);
		if (e.energy !== get().energy) set(e);
		return e.energy;
	},
	spendEnergy: (n) => {
		const e = computeEnergy(get().energy, get().energyAt);
		if (e.energy < n) {
			set(e);
			return false;
		}
		const next = e.energy - n;
		set({
			energy: next,
			energyAt: next >= ENERGY_MAX ? Date.now() : e.energy >= ENERGY_MAX ? Date.now() : e.energyAt
		});
		return true;
	},
	addCoins: (n) => set((s) => ({
		coins: s.coins + n,
		stats: n > 0 ? {
			...s.stats,
			coinsEarned: s.stats.coinsEarned + n
		} : s.stats
	})),
	spendCoins: (n) => {
		if (get().coins < n) return false;
		set((s) => ({
			coins: s.coins - n,
			stats: {
				...s.stats,
				coinsSpent: s.stats.coinsSpent + n
			}
		}));
		return true;
	},
	spendGems: (n) => {
		if (get().gems < n) return false;
		set({ gems: get().gems - n });
		return true;
	},
	refillEnergy: (full) => {
		if (full) {
			if (!get().spendGems(8)) return false;
			set({
				energy: ENERGY_MAX,
				energyAt: Date.now()
			});
			return true;
		}
		if (!get().spendCoins(40)) return false;
		const e = computeEnergy(get().energy, get().energyAt);
		set({
			energy: Math.min(ENERGY_MAX, e.energy + 5),
			energyAt: Date.now()
		});
		return true;
	},
	applyResult: (r, extra) => {
		const s = get();
		const won = r.won;
		const rec = s.records[r.session.levelId ?? ""] ?? null;
		const stars = won ? starsFor({
			...r,
			timeLimit: r.session.timeLimit
		}) : 0;
		const records = { ...s.records };
		if (won && r.session.levelId) records[r.session.levelId] = {
			stars: Math.max(rec?.stars ?? 0, stars),
			bestTime: rec ? Math.min(rec.bestTime, r.elapsed) : r.elapsed,
			hintsUsed: r.hintsUsed,
			completedAt: Date.now()
		};
		let campaignIndex = s.campaignIndex;
		if (won && r.session.levelId?.startsWith("w")) {
			Number(r.session.levelId.replace(/\D+/g, "").slice(-0) || 0);
			const match = /^w(\d+)-(\d+)$/.exec(r.session.levelId);
			if (match) {
				const abs = (Number(match[1]) - 1) * 8 + Number(match[2]);
				campaignIndex = Math.max(campaignIndex, Math.min(40, abs + 1));
			}
		}
		const stats = {
			...s.stats,
			wordsFound: s.stats.wordsFound + r.found.length,
			levelsCompleted: s.stats.levelsCompleted + (won ? 1 : 0),
			timePlayed: s.stats.timePlayed + r.elapsed,
			hintsUsed: s.stats.hintsUsed + r.hintsUsed,
			mistakes: s.stats.mistakes + r.mistakes,
			coinsEarned: s.stats.coinsEarned + r.coins,
			perfects: s.stats.perfects + (r.perfect ? 1 : 0),
			dailies: s.stats.dailies + (r.session.mode === "daily" && won ? 1 : 0),
			bosses: s.stats.bosses + (extra?.boss && won ? 1 : 0),
			fogClears: s.stats.fogClears + (r.session.mode === "fog" && won ? 1 : 0),
			timedClears: s.stats.timedClears + ((r.session.mode === "timed" || r.session.timeLimit) && won ? 1 : 0),
			zenClears: s.stats.zenClears + (r.session.mode === "zen" && won ? 1 : 0),
			bestCombo: Math.max(s.stats.bestCombo, r.comboMax),
			fastestLevel: won && r.elapsed > 0 ? s.stats.fastestLevel === 0 ? r.elapsed : Math.min(s.stats.fastestLevel, r.elapsed) : s.stats.fastestLevel
		};
		const noHintLevels = s.noHintLevels + (won && r.hintsUsed === 0 ? 1 : 0);
		const unlocked = newlyUnlocked(s.achievements, stats, {
			noHintLevels,
			fastClear: won && r.elapsed < 30,
			clutch: won && !!r.session.timeLimit && r.session.timeLimit - r.elapsed < 5,
			noMistakes: won && r.mistakes === 0,
			legend: !!extra?.legend
		});
		const achievements = { ...s.achievements };
		for (const a of unlocked) achievements[a.id] = Date.now();
		const bonus = unlocked.reduce((n, a, i) => n + 40 + i * 10, 0);
		set({
			coins: s.coins + r.coins + bonus,
			xp: s.xp + r.xp,
			records,
			campaignIndex,
			stats,
			noHintLevels,
			achievements,
			lastDailyPlay: r.session.mode === "daily" && won ? todayKey() : s.lastDailyPlay,
			seenTutorial: true
		});
		return unlocked.map((a) => a.title);
	},
	buyHints: () => {
		if (!get().spendCoins(80)) return false;
		set({ hintPacks: get().hintPacks + 3 });
		return true;
	},
	claimDaily: () => {
		const key = todayKey();
		const s = get();
		if (s.lastDailyClaim === key) return null;
		const yesterday = todayKey(/* @__PURE__ */ new Date(Date.now() - 864e5));
		const streak = s.lastDailyClaim === yesterday ? Math.min(7, (s.stats.currentStreak || 0) + 1) : 1;
		const coins = 20 + streak * 8;
		const gems = streak === 7 ? 3 : streak === 3 ? 1 : 0;
		set({
			lastDailyClaim: key,
			lastLogin: key,
			coins: s.coins + coins,
			gems: s.gems + gems,
			stats: {
				...s.stats,
				currentStreak: streak,
				longestStreak: Math.max(s.stats.longestStreak, streak),
				coinsEarned: s.stats.coinsEarned + coins
			}
		});
		return {
			coins,
			gems,
			day: streak
		};
	},
	spin: () => {
		const key = todayKey();
		if (!(get().lastSpin !== key) && !get().spendCoins(60)) return null;
		const table = [
			{
				w: 30,
				label: "40 coins",
				coins: 40
			},
			{
				w: 24,
				label: "80 coins",
				coins: 80
			},
			{
				w: 16,
				label: "Hint pack",
				hints: 2
			},
			{
				w: 12,
				label: "120 coins",
				coins: 120
			},
			{
				w: 10,
				label: "1 gem",
				gems: 1
			},
			{
				w: 5,
				label: "3 gems",
				gems: 3
			},
			{
				w: 3,
				label: "Jackpot",
				coins: 400,
				gems: 2
			}
		];
		const total = table.reduce((n, x) => n + x.w, 0);
		let roll = Math.random() * total;
		let pick = table[0];
		for (const row of table) {
			roll -= row.w;
			if (roll <= 0) {
				pick = row;
				break;
			}
		}
		set({
			lastSpin: key,
			coins: get().coins + (pick.coins ?? 0),
			gems: get().gems + (pick.gems ?? 0),
			hintPacks: get().hintPacks + (pick.hints ?? 0),
			stats: {
				...get().stats,
				spins: get().stats.spins + 1,
				coinsEarned: get().stats.coinsEarned + (pick.coins ?? 0)
			}
		});
		return pick;
	},
	logWord: (w) => set((s) => ({ wordLog: {
		...s.wordLog,
		[w]: (s.wordLog[w] ?? 0) + 1
	} })),
	setToast: (t) => set({ toast: t }),
	exportSave: () => {
		const s = get();
		const blob = {
			version: s.version,
			name: s.name,
			avatar: s.avatar,
			xp: s.xp,
			coins: s.coins,
			gems: s.gems,
			energy: s.energy,
			energyAt: s.energyAt,
			campaignIndex: s.campaignIndex,
			records: s.records,
			achievements: s.achievements,
			noHintLevels: s.noHintLevels,
			settings: s.settings,
			stats: s.stats,
			hintPacks: s.hintPacks,
			lastDailyClaim: s.lastDailyClaim,
			lastDailyPlay: s.lastDailyPlay,
			lastSpin: s.lastSpin,
			lastLogin: s.lastLogin,
			seenTutorial: s.seenTutorial,
			ownedThemes: s.ownedThemes,
			wordLog: s.wordLog,
			toast: null
		};
		return JSON.stringify(blob);
	},
	importSave: (raw) => {
		try {
			const data = JSON.parse(raw);
			if (!data || typeof data !== "object") return false;
			const base = blank();
			set({
				...base,
				...data,
				settings: {
					...base.settings,
					...data.settings
				},
				stats: {
					...base.stats,
					...data.stats
				},
				version: SAVE_VERSION,
				toast: null,
				hydrated: true
			});
			return true;
		} catch {
			return false;
		}
	},
	resetAll: () => set({
		...blank(),
		hydrated: true,
		settings: get().settings
	})
}), {
	name: "lexora-save-v1",
	version: SAVE_VERSION,
	storage: createJSONStorage(() => {
		if (typeof window === "undefined") return {
			getItem: () => null,
			setItem: () => {},
			removeItem: () => {}
		};
		return localStorage;
	}),
	skipHydration: true,
	partialize: (s) => ({
		version: s.version,
		name: s.name,
		avatar: s.avatar,
		xp: s.xp,
		coins: s.coins,
		gems: s.gems,
		energy: s.energy,
		energyAt: s.energyAt,
		campaignIndex: s.campaignIndex,
		records: s.records,
		achievements: s.achievements,
		noHintLevels: s.noHintLevels,
		settings: s.settings,
		stats: s.stats,
		hintPacks: s.hintPacks,
		lastDailyClaim: s.lastDailyClaim,
		lastDailyPlay: s.lastDailyPlay,
		lastSpin: s.lastSpin,
		lastLogin: s.lastLogin,
		seenTutorial: s.seenTutorial,
		ownedThemes: s.ownedThemes,
		wordLog: s.wordLog,
		toast: null
	})
}));
function currentEnergy(energy, energyAt, now = Date.now()) {
	return computeEnergy(energy, energyAt, now).energy;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium transition-[transform,background-color,color,opacity,box-shadow] duration-150 ease-out select-none disabled:opacity-40 disabled:pointer-events-none active:not-disabled:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", {
	variants: {
		variant: {
			primary: "bg-primary text-primary-fg shadow-[0_1px_0_color-mix(in_oklab,white_18%,transparent)_inset] hover:brightness-110",
			secondary: "bg-surface-2 text-fg shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)] hover:bg-surface",
			ghost: "bg-transparent text-fg hover:bg-surface-2",
			paper: "bg-paper text-ink hover:brightness-95",
			danger: "bg-danger text-primary-fg"
		},
		size: {
			sm: "h-9 px-3 text-sm rounded-[10px]",
			md: "h-11 px-4 text-sm rounded-xl",
			lg: "h-12 px-5 text-base rounded-2xl min-h-12",
			icon: "size-11 rounded-xl"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function CurrencyBar() {
	const coins = useGame((s) => s.coins);
	const gems = useGame((s) => s.gems);
	const energyRaw = useGame((s) => s.energy);
	const energyAt = useGame((s) => s.energyAt);
	const lang = useGame((s) => s.settings.lang);
	const energy = currentEnergy(energyRaw, energyAt);
	const [, setPulse] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (energy >= 20) return;
		const id = window.setInterval(() => setPulse((n) => n + 1), 1e3);
		return () => window.clearInterval(id);
	}, [energy]);
	const remain = energy >= 20 ? 0 : ENERGY_MS_VALUE - (Date.now() - energyAt) % ENERGY_MS_VALUE;
	const m = Math.floor(remain / 6e4);
	const sec = Math.floor(remain % 6e4 / 1e3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				label: String(coins),
				title: t(lang, "coins"),
				tone: "accent"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				label: String(gems),
				title: t(lang, "gems"),
				tone: "primary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				label: `${energy}/20`,
				title: energy < 20 ? `${t(lang, "nextEnergy")} ${m}:${String(sec).padStart(2, "0")}` : t(lang, "energy"),
				tone: "plain"
			})
		]
	});
}
function Chip({ label, title, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		title,
		className: cn("flex h-8 min-w-12 items-center justify-center rounded-full px-2.5 text-xs tabular-nums", "shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_10%,transparent)]", tone === "accent" && "bg-surface text-accent", tone === "primary" && "bg-surface text-primary", tone === "plain" && "bg-surface text-fg"),
		children: label
	});
}
var NAV = [
	{
		id: "home",
		icon: House,
		key: "home"
	},
	{
		id: "journey",
		icon: Compass,
		key: "journey"
	},
	{
		id: "daily",
		icon: Sparkles,
		key: "daily"
	},
	{
		id: "shop",
		icon: Store,
		key: "shop"
	},
	{
		id: "dictionary",
		icon: BookOpen,
		key: "more"
	}
];
function BottomNav({ screen, onGo }) {
	const lang = useGame((s) => s.settings.lang);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "safe-bottom grid grid-cols-5 gap-1 border-t border-border bg-bg/90 px-2 pt-2 backdrop-blur-md",
		children: NAV.map((item) => {
			const active = screen === item.id || item.id === "dictionary" && [
				"dictionary",
				"stats",
				"achievements",
				"settings",
				"profile",
				"spin",
				"modes"
			].includes(screen);
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => onGo(item.id),
				className: cn("flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] tracking-wide", active ? "text-fg" : "text-subtle"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "size-5",
					strokeWidth: active ? 2.2 : 1.7
				}), t(lang, item.key)]
			}, item.id);
		})
	});
}
function ScreenHeader({ title, onBack, right }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "safe-top flex items-center gap-2 px-4 pb-3 pt-3",
		children: [
			onBack ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				onClick: onBack,
				"aria-label": "Back",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-lg leading-none",
					children: "‹"
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-11" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "flex-1 text-center font-display text-xl font-medium tracking-tight",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-w-11 justify-end",
				children: right
			})
		]
	});
}
function Panel({ children, className, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(onClick ? "button" : "div", {
		onClick,
		className: cn("rounded-[22px] bg-surface p-4 text-left shadow-[var(--shadow-border)]", className),
		children
	});
}
var DIRS = [
	{
		r: 0,
		c: 1
	},
	{
		r: 1,
		c: 0
	},
	{
		r: 1,
		c: 1
	},
	{
		r: 0,
		c: -1
	},
	{
		r: -1,
		c: 0
	},
	{
		r: -1,
		c: -1
	},
	{
		r: 1,
		c: -1
	},
	{
		r: -1,
		c: 1
	}
];
var FILL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function fits(grid, word, r, c, dir) {
	const n = grid.length;
	for (let i = 0; i < word.length; i++) {
		const rr = r + dir.r * i;
		const cc = c + dir.c * i;
		if (rr < 0 || cc < 0 || rr >= n || cc >= n) return false;
		const ch = grid[rr][cc];
		if (ch && ch !== word[i]) return false;
	}
	return true;
}
function place(grid, word, r, c, dir) {
	const cells = [];
	for (let i = 0; i < word.length; i++) {
		const rr = r + dir.r * i;
		const cc = c + dir.c * i;
		grid[rr][cc] = word[i];
		cells.push({
			r: rr,
			c: cc
		});
	}
	return cells;
}
function generatePuzzle(opts) {
	const rand = seededRng(opts.seed);
	const size = Math.max(6, Math.min(16, opts.size));
	const dirCount = Math.max(3, Math.min(8, opts.dirs ?? 8));
	const dirs = DIRS.slice(0, dirCount);
	const pool = (opts.customWords?.length ? opts.customWords : wordsForCategory(opts.category)).map((w) => w.toUpperCase().replace(/[^A-Z]/g, "")).filter((w) => w.length >= 3 && w.length <= size);
	const ranked = shuffle([...new Set(pool)], rand).sort((a, b) => b.length - a.length);
	const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => null));
	const placements = [];
	const used = /* @__PURE__ */ new Set();
	for (const word of ranked) {
		if (placements.length >= opts.wordCount) break;
		if (used.has(word)) continue;
		let placed = false;
		for (let attempt = 0; attempt < 120 && !placed; attempt++) {
			const dir = dirs[Math.floor(rand() * dirs.length)];
			const r = Math.floor(rand() * size);
			const c = Math.floor(rand() * size);
			if (fits(grid, word, r, c, dir)) {
				const cells = place(grid, word, r, c, dir);
				placements.push({
					word,
					cells
				});
				used.add(word);
				placed = true;
			}
		}
	}
	if (placements.length < Math.min(3, opts.wordCount) && opts.category !== "verbs") return generatePuzzle({
		...opts,
		seed: opts.seed + 97,
		category: "verbs",
		customWords: void 0
	});
	const lettersInPlay = placements.map((p) => p.word).join("") || FILL;
	return {
		size,
		grid: grid.map((row) => row.map((ch) => {
			if (ch) return ch;
			if (rand() < .28) return pick(lettersInPlay.split(""), rand);
			return FILL[Math.floor(rand() * 26)];
		})),
		placements,
		words: placements.map((p) => p.word),
		category: opts.category,
		seed: opts.seed
	};
}
/** Build a collinear path from start through current, 8-direction only. */
function linePath(start, end) {
	const dr = end.r - start.r;
	const dc = end.c - start.c;
	if (dr === 0 && dc === 0) return [start];
	const stepR = Math.sign(dr);
	const stepC = Math.sign(dc);
	const lenR = Math.abs(dr);
	const lenC = Math.abs(dc);
	if (lenR !== 0 && lenC !== 0 && lenR !== lenC) return [start];
	const n = Math.max(lenR, lenC);
	const cells = [];
	for (let i = 0; i <= n; i++) cells.push({
		r: start.r + stepR * i,
		c: start.c + stepC * i
	});
	return cells;
}
function matchPlacement(placements, cells, remaining) {
	if (cells.length < 3) return null;
	const key = cells.map((c) => `${c.r},${c.c}`).join(">");
	const rev = [...cells].reverse().map((c) => `${c.r},${c.c}`).join(">");
	for (const p of placements) {
		if (!remaining.has(p.word)) continue;
		const pk = p.cells.map((c) => `${c.r},${c.c}`).join(">");
		const pr = [...p.cells].reverse().map((c) => `${c.r},${c.c}`).join(">");
		if (pk === key || pr === key || pk === rev || pr === rev) return p;
	}
	return null;
}
var FOUND_STROKES = [
	"#5c68b8",
	"#3f8f74",
	"#8a7048",
	"#4f6fa8",
	"#7a5ea8",
	"#3d7a72"
];
function cellKey(c) {
	return `${c.r},${c.c}`;
}
function centers(cells, size, n) {
	const u = size / n;
	return cells.map((c) => ({
		x: c.c * u + u / 2,
		y: c.r * u + u / 2
	}));
}
function WordGrid({ puzzle, found, fog, hinted, largeText, colorBlind, disabled, onFound, onMiss, onSelectTick }) {
	const wrapRef = (0, import_react.useRef)(null);
	const [px, setPx] = (0, import_react.useState)(320);
	const [path, setPath] = (0, import_react.useState)([]);
	const [bad, setBad] = (0, import_react.useState)(false);
	const selecting = (0, import_react.useRef)(false);
	const startRef = (0, import_react.useRef)(null);
	const pathRef = (0, import_react.useRef)([]);
	const lastTick = (0, import_react.useRef)("");
	const n = puzzle.size;
	const remaining = (0, import_react.useMemo)(() => {
		const s = new Set(puzzle.words);
		for (const w of found) s.delete(w);
		return s;
	}, [puzzle.words, found]);
	(0, import_react.useEffect)(() => {
		const el = wrapRef.current;
		if (!el) return;
		const ro = new ResizeObserver(() => {
			const w = el.clientWidth;
			setPx(Math.max(200, w));
		});
		ro.observe(el);
		setPx(el.clientWidth);
		return () => ro.disconnect();
	}, []);
	const foundCells = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Set();
		for (const p of puzzle.placements) if (found.has(p.word)) for (const c of p.cells) m.add(cellKey(c));
		return m;
	}, [puzzle.placements, found]);
	const hintedSet = (0, import_react.useMemo)(() => new Set(hinted.map(cellKey)), [hinted]);
	const pathSet = (0, import_react.useMemo)(() => new Set(path.map(cellKey)), [path]);
	const visible = (0, import_react.useCallback)((c) => {
		if (!fog) return true;
		const k = cellKey(c);
		return foundCells.has(k) || pathSet.has(k) || hintedSet.has(k);
	}, [
		fog,
		foundCells,
		pathSet,
		hintedSet
	]);
	const atPoint = (0, import_react.useCallback)((clientX, clientY) => {
		const el = wrapRef.current;
		if (!el) return null;
		const rect = el.getBoundingClientRect();
		const u = rect.width / n;
		const c = Math.floor((clientX - rect.left) / u);
		const r = Math.floor((clientY - rect.top) / u);
		if (r < 0 || c < 0 || r >= n || c >= n) return null;
		return {
			r,
			c
		};
	}, [n]);
	const updatePath = (0, import_react.useCallback)((cell) => {
		const start = startRef.current;
		if (!start) {
			setPath([cell]);
			pathRef.current = [cell];
			startRef.current = cell;
			return;
		}
		const next = linePath(start, cell).filter((x) => x.r >= 0 && x.c >= 0 && x.r < n && x.c < n);
		if (next.length) {
			const key = next.map(cellKey).join("|");
			if (key !== lastTick.current) {
				lastTick.current = key;
				if (next.length !== path.length) onSelectTick?.();
			}
			setPath(next);
			pathRef.current = next;
		}
	}, [
		n,
		onSelectTick,
		path.length
	]);
	const endSelect = (0, import_react.useCallback)(() => {
		if (!selecting.current) return;
		selecting.current = false;
		const cells = pathRef.current;
		startRef.current = null;
		const hit = matchPlacement(puzzle.placements, cells, remaining);
		if (hit) {
			onFound(hit.word);
			pathRef.current = [];
			setPath([]);
		} else {
			if (cells.length >= 3) {
				onMiss();
				setBad(true);
				window.setTimeout(() => setBad(false), 220);
			}
			pathRef.current = [];
			setPath([]);
		}
		lastTick.current = "";
	}, [
		puzzle.placements,
		remaining,
		onFound,
		onMiss
	]);
	(0, import_react.useEffect)(() => {
		const up = () => endSelect();
		window.addEventListener("pointerup", up);
		window.addEventListener("pointercancel", up);
		return () => {
			window.removeEventListener("pointerup", up);
			window.removeEventListener("pointercancel", up);
		};
	}, [endSelect]);
	const onPointerDown = (e) => {
		if (disabled) return;
		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		const cell = atPoint(e.clientX, e.clientY);
		if (!cell) return;
		selecting.current = true;
		startRef.current = cell;
		pathRef.current = [cell];
		setPath([cell]);
	};
	const onPointerMove = (e) => {
		if (!selecting.current) return;
		const cell = atPoint(e.clientX, e.clientY);
		if (cell) updatePath(cell);
	};
	const strokeW = px / n * .72;
	const fontPx = Math.max(12, px / n * (largeText ? .5 : .42));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapRef,
		className: cn("paper-grid relative aspect-square w-full touch-none overflow-hidden rounded-[22px] select-none", bad && "shake-error"),
		style: { touchAction: "none" },
		onPointerDown,
		onPointerMove,
		role: "grid",
		"aria-label": "Word search grid",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			className: "pointer-events-none absolute inset-0 h-full w-full",
			viewBox: `0 0 ${px} ${px}`,
			children: [puzzle.placements.map((p, i) => {
				if (!found.has(p.word) || p.cells.length < 2) return null;
				const pts = centers(p.cells, px, n);
				const a = pts[0];
				const b = pts[pts.length - 1];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: a.x,
					y1: a.y,
					x2: b.x,
					y2: b.y,
					stroke: colorBlind ? FOUND_STROKES[i % FOUND_STROKES.length] : "var(--color-found)",
					strokeWidth: strokeW,
					strokeLinecap: "round",
					opacity: .38
				}, p.word);
			}), path.length >= 2 && (() => {
				const pts = centers(path, px, n);
				const a = pts[0];
				const b = pts[pts.length - 1];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: a.x,
					y1: a.y,
					x2: b.x,
					y2: b.y,
					stroke: "var(--color-primary)",
					strokeWidth: strokeW,
					strokeLinecap: "round",
					opacity: .55
				});
			})()]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative grid h-full w-full",
			style: {
				gridTemplateColumns: `repeat(${n}, 1fr)`,
				gridTemplateRows: `repeat(${n}, 1fr)`
			},
			children: puzzle.grid.map((row, r) => row.map((ch, c) => {
				const cell = {
					r,
					c
				};
				const k = cellKey(cell);
				const on = pathSet.has(k);
				const done = foundCells.has(k);
				const glow = hintedSet.has(k) && !done;
				const show = visible(cell);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "gridcell",
					className: cn("relative flex items-center justify-center font-display font-medium text-ink", on && "text-primary", done && "text-ink"),
					style: {
						fontSize: fontPx,
						letterSpacing: "0.02em"
					},
					children: [
						glow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-[18%] rounded-full bg-accent/35" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("relative", !show && "opacity-0"),
							children: ch
						}),
						fog && !show && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-[22%] rounded-[4px] bg-ink/18" })
					]
				}, k);
			}))
		})]
	});
}
function PlayScreen({ session, onExit, onResult }) {
	const lang = useGame((s) => s.settings.lang);
	const settings = useGame((s) => s.settings);
	const spendCoins = useGame((s) => s.spendCoins);
	const hintPacks = useGame((s) => s.hintPacks);
	const logWord = useGame((s) => s.logWord);
	const seenTutorial = useGame((s) => s.seenTutorial);
	const puzzle = (0, import_react.useMemo)(() => generatePuzzle({
		size: session.size,
		wordCount: session.wordCount,
		category: session.category,
		seed: session.seed,
		dirs: session.dirs,
		customWords: session.customWords
	}), [session]);
	const [found, setFound] = (0, import_react.useState)(() => /* @__PURE__ */ new Set());
	const [paused, setPaused] = (0, import_react.useState)(false);
	const [hintsUsed, setHintsUsed] = (0, import_react.useState)(0);
	const [mistakes, setMistakes] = (0, import_react.useState)(0);
	const [combo, setCombo] = (0, import_react.useState)(0);
	const [comboMax, setComboMax] = (0, import_react.useState)(0);
	const [hinted, setHinted] = (0, import_react.useState)([]);
	const [showHow, setShowHow] = (0, import_react.useState)(!seenTutorial);
	const [ended, setEnded] = (0, import_react.useState)(false);
	const startedAt = (0, import_react.useRef)(performance.now());
	const pausedAt = (0, import_react.useRef)(0);
	const pausedTotal = (0, import_react.useRef)(0);
	const lastFind = (0, import_react.useRef)(0);
	const [tick, setTick] = (0, import_react.useState)(0);
	const elapsed = Math.max(0, (tick - startedAt.current - pausedTotal.current) / 1e3);
	const timeLeft = session.timeLimit ? Math.max(0, session.timeLimit - elapsed) : null;
	(0, import_react.useEffect)(() => {
		let id = 0;
		const loop = (t) => {
			if (!paused) setTick(t);
			id = requestAnimationFrame(loop);
		};
		id = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(id);
	}, [paused]);
	(0, import_react.useEffect)(() => {
		if (paused) pausedAt.current = performance.now();
		else if (pausedAt.current) {
			pausedTotal.current += performance.now() - pausedAt.current;
			pausedAt.current = 0;
		}
	}, [paused]);
	const finish = (won) => {
		if (ended) return;
		setEnded(true);
		const foundList = [...found];
		if (won) audio.win();
		const noHint = hintsUsed === 0;
		const perfect = mistakes === 0 && won;
		const speed = won && session.timeLimit && elapsed < session.timeLimit * .5;
		const coins = won ? 50 + foundList.reduce((n, w) => n + Math.max(0, w.length - 3) * 4, 0) + (noHint ? 30 : 0) + (perfect ? 50 : 0) + (speed ? 20 : 0) + comboMax * 4 : Math.max(8, foundList.length * 6);
		const xp = (won ? 28 : 8) + foundList.length * 4 + (session.levelId?.includes("-8") ? 40 : 0);
		onResult({
			session,
			found: foundList,
			words: puzzle.words,
			elapsed,
			hintsUsed,
			mistakes,
			comboMax,
			coins,
			xp,
			perfect,
			won
		});
	};
	(0, import_react.useEffect)(() => {
		if (timeLeft === 0 && !ended) finish(false);
	}, [timeLeft, ended]);
	const onFound = (word) => {
		if (found.has(word) || ended) return;
		const next = new Set(found);
		next.add(word);
		setFound(next);
		logWord(word);
		audio.found();
		if (settings.vibration) navigator.vibrate?.(14);
		const now = performance.now();
		const nextCombo = now - lastFind.current < 6e3 ? combo + 1 : 1;
		lastFind.current = now;
		setCombo(nextCombo);
		setComboMax((m) => Math.max(m, nextCombo));
		setHinted([]);
		setShowHow(false);
		if (next.size >= puzzle.words.length) window.setTimeout(() => finish(true), 280);
	};
	const onMiss = () => {
		setMistakes((m) => m + 1);
		setCombo(0);
		audio.error();
		if (settings.vibration) navigator.vibrate?.([
			8,
			30,
			8
		]);
	};
	const payHint = (kind) => {
		const cost = HINT_COST[kind];
		const packs = useGame.getState().hintPacks;
		if (packs > 0) {
			useGame.setState({ hintPacks: packs - 1 });
			return true;
		}
		return spendCoins(cost);
	};
	const remainingPlacements = puzzle.placements.filter((p) => !found.has(p.word));
	const useHint = (kind) => {
		if (ended || remainingPlacements.length === 0) return;
		if (!payHint(kind)) {
			useGame.getState().setToast(t(lang, "notEnough"));
			return;
		}
		audio.hint();
		setHintsUsed((n) => n + 1);
		const p = remainingPlacements[0];
		if (kind === "first") setHinted([p.cells[0]]);
		if (kind === "letter") {
			const idx = Math.floor(p.cells.length / 2);
			setHinted([p.cells[idx]]);
		}
		if (kind === "word") {
			setHinted(p.cells);
			window.setTimeout(() => onFound(p.word), 280);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "safe-top flex items-center gap-2 px-3 pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => setPaused(true),
						"aria-label": t(lang, "pause"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-display text-base font-medium leading-tight",
							children: session.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-muted",
							children: [CATEGORY_LABEL[session.category] ?? session.category, combo > 1 ? ` · ${t(lang, "combo")} ×${combo}` : ""]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-full bg-surface px-3 py-1.5 text-xs tabular-nums text-fg shadow-[var(--shadow-border)]",
						children: timeLeft != null ? formatDuration(timeLeft) : formatDuration(elapsed)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 px-3 pt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WordGrid, {
					puzzle,
					found,
					fog: session.mode === "fog",
					hinted,
					largeText: settings.largeText,
					colorBlind: settings.colorBlind,
					disabled: paused || ended,
					onFound,
					onMiss,
					onSelectTick: () => audio.select()
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 flex flex-wrap gap-1.5",
					children: puzzle.words.map((w) => {
						const done = found.has(w);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: `rounded-full px-2.5 py-1 text-[11px] tracking-[0.14em] ${done ? "bg-surface text-subtle line-through" : "bg-surface-2 text-fg"}`,
							children: w
						}, w);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "safe-bottom grid grid-cols-3 gap-2 px-3 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HintBtn, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Type, { className: "size-4" }),
						label: t(lang, "hintFirst"),
						cost: hintPacks > 0 ? "pack" : String(HINT_COST.first),
						onClick: () => useHint("first")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HintBtn, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "size-4" }),
						label: t(lang, "hintLetter"),
						cost: hintPacks > 0 ? "pack" : String(HINT_COST.letter),
						onClick: () => useHint("letter")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HintBtn, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WholeWord, { className: "size-4" }),
						label: t(lang, "hintWord"),
						cost: hintPacks > 0 ? "pack" : String(HINT_COST.word),
						onClick: () => useHint("word")
					})
				]
			}),
			showHow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-x-0 top-[30%] z-10 flex justify-center px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-2xl bg-ink/80 px-4 py-3 text-center text-sm text-paper shadow-[var(--shadow-lift)]",
					children: t(lang, "tutorial")
				})
			}),
			paused && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-30 flex items-end justify-center bg-bg/70 p-4 backdrop-blur-sm sm:items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-[28px] bg-bg-elevated p-5 shadow-[var(--shadow-lift)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: t(lang, "pause")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted",
							children: [
								found.size,
								"/",
								puzzle.words.length,
								" ",
								t(lang, "found")
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => {
									audio.click();
									setPaused(false);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), t(lang, "resume")]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: onExit,
								children: t(lang, "quit")
							})]
						})
					]
				})
			})
		]
	});
}
function HintBtn({ icon, label, cost, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: "flex min-h-12 flex-col items-center justify-center rounded-2xl bg-surface px-1 py-2 text-center shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 text-[10px] text-fg",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] tabular-nums text-subtle",
				children: cost
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var forgeWords = createServerFn({ method: "POST" }).validator((input) => ({ theme: String(input?.theme ?? "").slice(0, 80) })).handler(createSsrRpc("4f33485af221c800dab2859ff779546149dfbecb82236976d5c5bad3665da07b"));
function LexoraMark({ className, size = 36 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: size,
		height: size,
		viewBox: "0 0 32 32",
		className: cn("shrink-0", className),
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "1.2",
				y: "1.2",
				width: "29.6",
				height: "29.6",
				rx: "7",
				fill: "var(--color-paper)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "1.2",
				y: "1.2",
				width: "29.6",
				height: "29.6",
				rx: "7",
				fill: "none",
				stroke: "var(--color-accent)",
				strokeWidth: "1.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "16",
				y: "22.5",
				textAnchor: "middle",
				fontFamily: "Fraunces, Georgia, serif",
				fontSize: "16",
				fontWeight: "600",
				fill: "var(--color-primary)",
				children: "L"
			})
		]
	});
}
function Splash({ onBegin }) {
	const lang = useGame((s) => s.settings.lang);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: onBegin,
		className: "flex min-h-dvh w-full flex-col items-center justify-center bg-bg px-8 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "stagger-in flex flex-col items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LexoraMark, { size: 72 }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-6 font-display text-5xl font-medium tracking-tight",
					children: "Lexora"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-[16rem] text-sm text-muted",
					children: t(lang, "tagline")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-12 text-xs tracking-[0.22em] text-subtle uppercase",
					children: t(lang, "tapToBegin")
				})
			]
		})
	});
}
function HomeScreen({ onPlay, onGo }) {
	const lang = useGame((s) => s.settings.lang);
	const name = useGame((s) => s.name);
	const campaignIndex = useGame((s) => s.campaignIndex);
	const stats = useGame((s) => s.stats);
	const lastDailyPlay = useGame((s) => s.lastDailyPlay);
	const progress = xpForLevel(useGame((s) => s.xp));
	const level = campaignLevel(Math.min(campaignIndex, 40));
	const dailyDone = lastDailyPlay === todayKey();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "safe-top flex items-start justify-between px-5 pt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-wide text-muted",
					children: t(lang, greetingKey())
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-medium tracking-tight",
					children: name
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyBar, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1.5 overflow-hidden rounded-full bg-surface-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-primary",
						style: { width: `${Math.min(100, progress.into / progress.need * 100)}%` }
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-[11px] tabular-nums text-subtle",
					children: [
						t(lang, "xp"),
						" ",
						progress.level,
						" · ",
						progress.into,
						"/",
						progress.need
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "stagger-in mt-6 flex flex-1 flex-col gap-3 px-4 pb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onPlay(sessionFromLevel(level)),
						className: "rounded-[28px] bg-paper px-5 py-6 text-left text-ink shadow-[var(--shadow-lift)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] tracking-[0.18em] text-ink-soft uppercase",
								children: t(lang, "continue")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-display text-2xl font-medium",
								children: level.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-ink-soft",
								children: [
									CATEGORY_LABEL[level.category],
									" · ",
									level.size,
									"×",
									level.size
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
							onClick: () => onGo("daily"),
							className: "min-h-[7rem]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] tracking-wide text-muted uppercase",
									children: t(lang, "daily")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-display text-lg",
									children: dailyDone ? t(lang, "claimed") : t(lang, "daily")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-subtle",
									children: [
										stats.currentStreak,
										"-day ",
										t(lang, "streak")
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
							onClick: () => onGo("modes"),
							className: "min-h-[7rem]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] tracking-wide text-muted uppercase",
									children: t(lang, "modes")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-display text-lg",
									children: t(lang, "zen")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-subtle",
									children: [
										t(lang, "timed"),
										" · ",
										t(lang, "fog")
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
								onClick: () => onGo("shop"),
								label: t(lang, "shop")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
								onClick: () => onGo("spin"),
								label: t(lang, "spin")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
								onClick: () => onGo("achievements"),
								label: t(lang, "achievements")
							})
						]
					})
				]
			})
		]
	});
}
function Mini({ label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick,
		className: "min-h-12 rounded-2xl bg-surface text-sm shadow-[var(--shadow-border)]",
		children: label
	});
}
function JourneyScreen({ onPlay, onBack }) {
	const lang = useGame((s) => s.settings.lang);
	const campaignIndex = useGame((s) => s.campaignIndex);
	const records = useGame((s) => s.records);
	const levels = (0, import_react.useMemo)(() => allCampaign(), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenHeader, {
			title: t(lang, "journey"),
			onBack,
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyBar, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-4 pb-8",
			children: [WORLD_META.map((world) => {
				const slice = levels.filter((l) => l.world === world.id);
				const cleared = slice.filter((l) => records[l.id]).length;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-end justify-between px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: world.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: world.tagline
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs tabular-nums text-subtle",
							children: [cleared, "/8"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-4 gap-2",
						children: slice.map((lv) => {
							const locked = (lv.world - 1) * 8 + lv.index > campaignIndex;
							const rec = records[lv.id];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: locked,
								onClick: () => onPlay(sessionFromLevel(lv)),
								className: cn("relative flex aspect-square flex-col items-center justify-center rounded-2xl bg-surface shadow-[var(--shadow-border)]", locked && "opacity-40", lv.boss && "bg-paper text-ink"),
								children: locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-lg",
										children: lv.index
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] tracking-wide text-subtle",
										children: lv.boss ? t(lang, "boss") : `${lv.size}²`
									}),
									rec && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-0.5 text-[10px] text-accent",
										children: "★".repeat(rec.stars)
									})
								] })
							}, lv.id);
						})
					})]
				}, world.id);
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-display text-xl",
					children: t(lang, "legend")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-2",
					children: Array.from({ length: 8 }, (_, i) => {
						const n = i + 1;
						const locked = campaignIndex <= 40 && n > 1 && campaignIndex < 40;
						const lv = legendLevel(n);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							disabled: campaignIndex < 40 && n > 0 ? campaignIndex < 40 && n > 4 : false,
							onClick: () => onPlay(sessionFromLevel(lv, "classic")),
							className: "flex aspect-square flex-col items-center justify-center rounded-2xl bg-surface-2 text-sm",
							children: locked && campaignIndex < 20 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4 text-subtle" }) : n
						}, lv.id);
					})
				})]
			})]
		})]
	});
}
function ModesScreen({ onPlay, onBack }) {
	const lang = useGame((s) => s.settings.lang);
	const [theme, setTheme] = (0, import_react.useState)("quiet library");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [wave, setWave] = (0, import_react.useState)(1);
	const [cat, setCat] = (0, import_react.useState)(CATEGORY_KEYS[0]);
	const runForge = async () => {
		setBusy(true);
		audio.click();
		try {
			const res = await forgeWords({ data: { theme } });
			if (res.ok) onPlay({
				mode: "forge",
				title: theme.slice(0, 24) || t(lang, "forge"),
				category: "verbs",
				seed: Date.now() >>> 0,
				size: 10,
				wordCount: res.words.length,
				dirs: 8,
				energyCost: 1,
				customWords: res.words
			});
			else {
				useGame.getState().setToast(t(lang, "forgeFail"));
				onPlay(modeSession("classic", { title: t(lang, "forge") }));
			}
		} catch {
			useGame.getState().setToast(t(lang, "forgeFail"));
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenHeader, {
			title: t(lang, "modes"),
			onBack
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 space-y-3 overflow-y-auto px-4 pb-8",
			children: [
				[
					["classic", "classic"],
					["timed", "timed"],
					["zen", "zen"],
					["fog", "fog"]
				].map(([mode, key]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					onClick: () => onPlay(modeSession(mode)),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg",
						children: t(lang, key)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: t(lang, "howTo")
					})]
				}, mode)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg",
						children: t(lang, "rush")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex gap-2 overflow-x-auto pb-1",
						children: CATEGORY_KEYS.slice(0, 12).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setCat(c),
							className: cn("shrink-0 rounded-full px-3 py-1.5 text-xs", cat === c ? "bg-paper text-ink" : "bg-surface-2 text-muted"),
							children: CATEGORY_LABEL[c]
						}, c))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3 w-full",
						onClick: () => onPlay(modeSession("rush", { category: cat })),
						children: t(lang, "play")
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg",
					children: t(lang, "endless")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "mt-3 w-full",
					variant: "secondary",
					onClick: () => {
						onPlay(endlessSession(wave));
						setWave((w) => w + 1);
					},
					children: [
						t(lang, "play"),
						" · ",
						wave
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg",
						children: t(lang, "forge")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: t(lang, "forgePrompt")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: theme,
						onChange: (e) => setTheme(e.target.value),
						className: "mt-3 h-11 w-full rounded-xl bg-bg px-3 text-sm shadow-[var(--shadow-border)] outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3 w-full",
						disabled: busy,
						onClick: () => void runForge(),
						children: busy ? t(lang, "forgeWait") : t(lang, "forgeGo")
					})
				] })
			]
		})]
	});
}
function DailyScreen({ onPlay, onBack }) {
	const lang = useGame((s) => s.settings.lang);
	const claimDaily = useGame((s) => s.claimDaily);
	const lastClaim = useGame((s) => s.lastDailyClaim);
	const lastPlay = useGame((s) => s.lastDailyPlay);
	const streak = useGame((s) => s.stats.currentStreak);
	const key = todayKey();
	const claimed = lastClaim === key;
	const played = lastPlay === key;
	const bank = allWords();
	const wotd = bank[key.split("-").join("").length % bank.length];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenHeader, {
			title: t(lang, "daily"),
			onBack,
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyBar, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "bg-paper text-ink",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] tracking-[0.16em] uppercase text-ink-soft",
							children: t(lang, "wordOfDay")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-3xl tracking-[0.12em]",
							children: wotd
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-ink-soft",
							children: WORD_MEANINGS[wotd] ?? t(lang, "howTo")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg",
						children: t(lang, "dailyReward")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							t(lang, "streak"),
							" ",
							streak
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex gap-1.5",
						children: Array.from({ length: 7 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-8 flex-1 rounded-lg", i < streak ? "bg-primary/80" : "bg-surface-2") }, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4 w-full",
						disabled: claimed,
						onClick: () => {
							const r = claimDaily();
							if (r) {
								audio.coin();
								useGame.getState().setToast(`+${r.coins}`);
							}
						},
						children: claimed ? t(lang, "claimed") : t(lang, "claim")
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					variant: "paper",
					disabled: played,
					onClick: () => onPlay(dailySession(key)),
					children: played ? t(lang, "claimed") : t(lang, "play")
				})
			]
		})]
	});
}
function ShopScreen({ onBack }) {
	const lang = useGame((s) => s.settings.lang);
	const buyHints = useGame((s) => s.buyHints);
	const refillEnergy = useGame((s) => s.refillEnergy);
	const spendCoins = useGame((s) => s.spendCoins);
	const ownedThemes = useGame((s) => s.ownedThemes);
	const patchSettings = useGame((s) => s.patchSettings);
	const toast = (ok, msg) => useGame.getState().setToast(ok ? msg : t(lang, "notEnough"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenHeader, {
			title: t(lang, "shop"),
			onBack,
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyBar, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopRow, {
					title: t(lang, "shopHints"),
					price: "80",
					onBuy: () => toast(buyHints(), t(lang, "shopHints"))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopRow, {
					title: t(lang, "refill"),
					price: "40",
					onBuy: () => toast(refillEnergy(false), t(lang, "refill"))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopRow, {
					title: t(lang, "shopEnergy"),
					price: "8 gems",
					onBuy: () => toast(refillEnergy(true), t(lang, "shopEnergy"))
				}),
				["sepia", "amoled"].map((th) => {
					const have = ownedThemes.includes(th);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopRow, {
						title: t(lang, th),
						price: have ? t(lang, "owned") : "220",
						disabled: have,
						onBuy: () => {
							if (!spendCoins(220)) return toast(false, "");
							useGame.setState({ ownedThemes: [...ownedThemes, th] });
							patchSettings({ theme: th });
							toast(true, t(lang, th));
						}
					}, th);
				})
			]
		})]
	});
}
function ShopRow({ title, price, onBuy, disabled }) {
	const lang = useGame((s) => s.settings.lang);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs tabular-nums text-muted",
			children: price
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "sm",
			disabled,
			onClick: onBuy,
			children: disabled ? t(lang, "owned") : t(lang, "buy")
		})]
	});
}
function SpinScreen({ onBack }) {
	const lang = useGame((s) => s.settings.lang);
	const lastSpin = useGame((s) => s.lastSpin);
	const spin = useGame((s) => s.spin);
	const [angle, setAngle] = (0, import_react.useState)(0);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [prize, setPrize] = (0, import_react.useState)(null);
	const free = lastSpin !== todayKey();
	const go = () => {
		if (busy) return;
		const result = spin();
		if (!result) {
			useGame.getState().setToast(t(lang, "notEnough"));
			return;
		}
		setBusy(true);
		audio.click();
		const extra = 1800 + Math.floor(Math.random() * 360);
		setAngle((a) => a + extra);
		window.setTimeout(() => {
			setPrize(result.label);
			audio.coin();
			setBusy(false);
		}, 1400);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenHeader, {
			title: t(lang, "spin"),
			onBack,
			right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyBar, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col items-center px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-4 size-56",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-full rounded-full bg-surface shadow-[var(--shadow-border)]",
							style: {
								background: "conic-gradient(from 0deg, var(--color-surface-2) 0 25%, var(--color-surface) 0 50%, var(--color-surface-2) 0 75%, var(--color-surface) 0 100%)",
								transform: `rotate(${angle}deg)`,
								transition: busy ? "transform 1.3s cubic-bezier(0.22, 1, 0.36, 1)" : "none"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 border-x-8 border-t-[16px] border-x-transparent border-t-accent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-16 rounded-full bg-bg-elevated shadow-[var(--shadow-border)]" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 font-display text-xl",
					children: prize ?? t(lang, "luckySpin")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "mt-4 min-w-40",
					disabled: busy,
					onClick: go,
					children: [
						t(lang, "spinNow"),
						" ",
						free ? "" : "· 60"
					]
				})
			]
		})]
	});
}
function StatsScreen({ onBack }) {
	const lang = useGame((s) => s.settings.lang);
	const stats = useGame((s) => s.stats);
	const wordLog = useGame((s) => s.wordLog);
	const records = useGame((s) => s.records);
	const data = (0, import_react.useMemo)(() => {
		const rows = Object.values(records).sort((a, b) => a.completedAt - b.completedAt).slice(-10).map((r, i) => ({
			i: i + 1,
			t: Math.round(r.bestTime)
		}));
		return rows.length ? rows : [{
			i: 1,
			t: 0
		}];
	}, [records]);
	const topWord = Object.entries(wordLog).sort((a, b) => b[1] - a[1])[0];
	const acc = stats.wordsFound + stats.mistakes === 0 ? 100 : Math.round(stats.wordsFound / (stats.wordsFound + stats.mistakes) * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenHeader, {
			title: t(lang, "stats"),
			onBack
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 overflow-y-auto px-4 pb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: t(lang, "words"),
							value: stats.wordsFound
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: t(lang, "journey"),
							value: stats.levelsCompleted
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: t(lang, "accuracy"),
							value: `${acc}%`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: t(lang, "streak"),
							value: stats.longestStreak
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: t(lang, "playtime"),
							value: formatDuration(stats.timePlayed)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: t(lang, "bestTime"),
							value: stats.fastestLevel ? formatDuration(stats.fastestLevel) : "—"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs text-muted",
					children: t(lang, "time")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-36",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "i",
									hide: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "var(--color-bg-elevated)",
									border: "none",
									borderRadius: 12,
									fontSize: 12
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "t",
									stroke: "var(--color-primary)",
									fill: "var(--color-primary)",
									fillOpacity: .2
								})
							]
						})
					})
				})] }),
				topWord && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: t(lang, "favorite")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-2xl tracking-widest",
						children: topWord[0]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-subtle",
						children: ["×", topWord[1]]
					})
				] })
			]
		})]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-xl tabular-nums",
			children: value
		})]
	});
}
function AchievementsScreen({ onBack }) {
	const lang = useGame((s) => s.settings.lang);
	const have = useGame((s) => s.achievements);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenHeader, {
			title: t(lang, "achievements"),
			onBack
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-2 overflow-y-auto px-4 pb-8",
			children: ACHIEVEMENTS.map((a) => {
				const on = !!have[a.id];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]", !on && "opacity-50"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: cn("size-4", on ? "text-accent" : "text-subtle") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: a.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: a.detail
							})]
						}),
						on && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-success" })
					]
				}, a.id);
			})
		})]
	});
}
function ProfileScreen({ onBack }) {
	const lang = useGame((s) => s.settings.lang);
	const name = useGame((s) => s.name);
	const avatar = useGame((s) => s.avatar);
	const setName = useGame((s) => s.setName);
	const setAvatar = useGame((s) => s.setAvatar);
	const p = xpForLevel(useGame((s) => s.xp));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenHeader, {
			title: t(lang, "profile"),
			onBack
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-20 items-center justify-center rounded-3xl bg-paper font-display text-4xl text-ink",
						children: avatar
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted",
						children: [
							t(lang, "xp"),
							" ",
							p.level
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mt-6 block text-xs text-muted",
					children: t(lang, "playerName")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: name,
					onChange: (e) => setName(e.target.value),
					className: "mt-1 h-11 w-full rounded-xl bg-surface px-3 text-sm shadow-[var(--shadow-border)] outline-none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-xs text-muted",
					children: t(lang, "avatars")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 grid grid-cols-8 gap-2",
					children: AVATARS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setAvatar(a),
						className: cn("flex aspect-square items-center justify-center rounded-xl bg-surface font-display", a === avatar && "bg-paper text-ink"),
						children: a
					}, a))
				})
			]
		})]
	});
}
function SettingsScreen({ onBack }) {
	const s = useGame((s) => s.settings);
	const patch = useGame((s) => s.patchSettings);
	const lang = s.lang;
	const exportSave = useGame((s) => s.exportSave);
	const importSave = useGame((s) => s.importSave);
	const resetAll = useGame((s) => s.resetAll);
	const [openReset, setOpenReset] = (0, import_react.useState)(false);
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(exportSave());
			useGame.getState().setToast(t(lang, "saveCopied"));
		} catch {
			useGame.getState().setToast(t(lang, "saveCopied"));
		}
	};
	const load = async () => {
		const raw = window.prompt("JSON");
		if (!raw) return;
		const ok = importSave(raw);
		useGame.getState().setToast(ok ? t(lang, "saveImported") : t(lang, "notEnough"));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenHeader, {
				title: t(lang, "settings"),
				onBack
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5 overflow-y-auto px-4 pb-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 text-xs tracking-wide text-muted uppercase",
						children: t(lang, "language")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: LANG_META.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								patch({ lang: l.id });
								document.documentElement.dir = dirFor(l.id);
								document.documentElement.lang = l.id;
							},
							className: cn("rounded-full px-3 py-1.5 text-xs", s.lang === l.id ? "bg-paper text-ink" : "bg-surface text-muted"),
							children: l.label
						}, l.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 text-xs tracking-wide text-muted uppercase",
						children: t(lang, "theme")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-4 gap-2",
						children: [
							"dark",
							"light",
							"sepia",
							"amoled"
						].map((th) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								patch({ theme: th });
								document.documentElement.dataset.theme = th;
							},
							className: cn("h-11 rounded-2xl text-xs", s.theme === th ? "bg-paper text-ink" : "bg-surface text-muted"),
							children: t(lang, th)
						}, th))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-2 text-xs tracking-wide text-muted uppercase",
							children: t(lang, "audio")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							label: t(lang, "masterVol"),
							value: s.master,
							onChange: (v) => {
								patch({ master: v });
								audio.setVol("master", v);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							label: t(lang, "sfxVol"),
							value: s.sfx,
							onChange: (v) => {
								patch({ sfx: v });
								audio.setVol("sfx", v);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							label: t(lang, "musicVol"),
							value: s.music,
							onChange: (v) => {
								patch({ music: v });
								audio.setVol("music", v);
							}
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-2 text-xs tracking-wide text-muted uppercase",
								children: t(lang, "gameplay")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: t(lang, "showDirections"),
								on: s.showDirections,
								onChange: (v) => patch({ showDirections: v })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: t(lang, "autoHint"),
								on: s.autoHint,
								onChange: (v) => patch({ autoHint: v })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: t(lang, "vibration"),
								on: s.vibration,
								onChange: (v) => patch({ vibration: v })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: t(lang, "screenShake"),
								on: s.screenShake,
								onChange: (v) => patch({ screenShake: v })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-2 text-xs tracking-wide text-muted uppercase",
								children: t(lang, "access")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: t(lang, "reduceMotion"),
								on: s.reduceMotion,
								onChange: (v) => {
									patch({ reduceMotion: v });
									document.documentElement.dataset.reduceMotion = v ? "on" : "off";
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: t(lang, "largeText"),
								on: s.largeText,
								onChange: (v) => patch({ largeText: v })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: t(lang, "highContrast"),
								on: s.highContrast,
								onChange: (v) => patch({ highContrast: v })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: t(lang, "colorBlind"),
								on: s.colorBlind,
								onChange: (v) => patch({ colorBlind: v })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-2 text-xs tracking-wide text-muted uppercase",
								children: t(lang, "data")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								className: "w-full",
								onClick: () => void copy(),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }),
									" ",
									t(lang, "exportSave")
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								className: "w-full",
								onClick: () => void load(),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }),
									" ",
									t(lang, "importSave")
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								className: "w-full text-danger",
								onClick: () => setOpenReset(true),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }),
									" ",
									t(lang, "reset")
								]
							})
						]
					})
				]
			}),
			openReset && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 flex items-center justify-center bg-bg/70 p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-[24px] bg-bg-elevated p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg",
						children: t(lang, "confirmReset")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							className: "flex-1",
							onClick: () => setOpenReset(false),
							children: t(lang, "cancel")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							className: "flex-1",
							onClick: () => {
								resetAll();
								setOpenReset(false);
							},
							children: t(lang, "confirm")
						})]
					})]
				})
			})
		]
	});
}
function Slider({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "mb-3 block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex justify-between text-sm",
			children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums text-muted",
				children: Math.round(value * 100)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			min: 0,
			max: 1,
			step: .01,
			value,
			onChange: (e) => onChange(Number(e.target.value)),
			className: "mt-2 w-full accent-[var(--color-primary)]"
		})]
	});
}
function Toggle({ label, on, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: () => onChange(!on),
		className: "flex h-12 w-full items-center justify-between rounded-2xl bg-surface px-4 text-sm shadow-[var(--shadow-border)]",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("h-6 w-10 rounded-full p-0.5", on ? "bg-primary" : "bg-surface-2"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("block size-5 rounded-full bg-paper transition-transform", on && "translate-x-4") })
		})]
	});
}
function DictionaryScreen({ onBack, onMore }) {
	const lang = useGame((s) => s.settings.lang);
	const [q, setQ] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => allWords().sort(), []).filter((w) => w.includes(q.toUpperCase())).slice(0, 80);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenHeader, {
				title: t(lang, "more"),
				onBack
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 px-4",
				children: [
					["modes", Compass],
					["spin", Sparkles],
					["stats", ChartColumn],
					["achievements", Trophy],
					["profile", User],
					["settings", Crown]
				].map(([id, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onMore(id),
					className: "flex min-h-14 items-center gap-3 rounded-2xl bg-surface px-4 text-left shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm",
						children: t(lang, id)
					})]
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: t(lang, "dictionary")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "APPLE",
						className: "mt-2 h-11 w-full rounded-xl bg-surface px-3 text-sm tracking-widest shadow-[var(--shadow-border)] outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 max-h-56 space-y-1 overflow-y-auto",
						children: filtered.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between rounded-xl px-2 py-1.5 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display tracking-widest",
								children: w
							}), WORD_MEANINGS[w] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "max-w-[60%] truncate text-[11px] text-muted",
								children: WORD_MEANINGS[w]
							})]
						}, w))
					})
				]
			})
		]
	});
}
function ResultScreen({ coins, xp, won, perfect, elapsed, found, total, hintsUsed, marks, onNext, onHome }) {
	const lang = useGame((s) => s.settings.lang);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-bg px-6 text-center",
		children: [
			won && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Confetti, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.2em] text-muted uppercase",
				children: won ? t(lang, "levelComplete") : t(lang, "resultLose")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl",
				children: won ? t(lang, "resultWin") : `${found}/${total}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid w-full max-w-sm grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t(lang, "coins"),
						value: `+${coins}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t(lang, "xp"),
						value: `+${xp}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t(lang, "time"),
						value: formatDuration(elapsed)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap justify-center gap-2",
				children: [
					perfect && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-paper px-3 py-1 text-xs text-ink",
						children: t(lang, "perfect")
					}),
					hintsUsed === 0 && won && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-surface px-3 py-1 text-xs",
						children: t(lang, "noHints")
					}),
					marks.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-surface px-3 py-1 text-xs text-accent",
						children: m
					}, m))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex w-full max-w-sm flex-col gap-2",
				children: [won && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: onNext,
					children: t(lang, "next")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: won ? "secondary" : "primary",
					onClick: onHome,
					children: t(lang, "home")
				})]
			})
		]
	});
}
function Confetti() {
	const bits = (0, import_react.useMemo)(() => Array.from({ length: 18 }, (_, i) => ({
		i,
		left: `${6 + i * 17 % 90}%`,
		delay: `${i % 6 * 40}ms`,
		color: i % 3 === 0 ? "var(--color-primary)" : i % 3 === 1 ? "var(--color-accent)" : "var(--color-paper)",
		dx: `${(i % 2 === 0 ? -1 : 1) * (20 + i % 5 * 8)}px`
	})), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 overflow-hidden",
		children: bits.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "confetti-bit",
			style: {
				left: b.left,
				background: b.color,
				animationDelay: b.delay,
				"--dx": b.dx
			}
		}, b.i))
	});
}
function GameApp() {
	const hydrated = useGame((s) => s.hydrated);
	const markHydrated = useGame((s) => s.markHydrated);
	const settings = useGame((s) => s.settings);
	const toast = useGame((s) => s.toast);
	const setToast = useGame((s) => s.setToast);
	const energyNow = useGame((s) => s.energyNow);
	const spendEnergy = useGame((s) => s.spendEnergy);
	const applyResult = useGame((s) => s.applyResult);
	const [booted, setBooted] = (0, import_react.useState)(false);
	const [screen, setScreen] = (0, import_react.useState)("splash");
	const [session, setSession] = (0, import_react.useState)(null);
	const [result, setResult] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		Promise.resolve(useGame.persist.rehydrate()).then(() => markHydrated());
	}, [markHydrated]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		document.documentElement.dataset.theme = settings.theme;
		document.documentElement.dataset.reduceMotion = settings.reduceMotion ? "on" : "off";
		document.documentElement.lang = settings.lang;
		document.documentElement.dir = dirFor(settings.lang);
		audio.setVol("master", settings.master);
		audio.setVol("sfx", settings.sfx);
		audio.setVol("music", settings.music);
	}, [hydrated, settings]);
	(0, import_react.useEffect)(() => {
		if (!toast) return;
		const id = window.setTimeout(() => setToast(null), 1800);
		return () => window.clearTimeout(id);
	}, [toast, setToast]);
	(0, import_react.useEffect)(() => {
		const onHide = () => {
			if (document.visibilityState === "hidden") {} else audio.unlock();
		};
		document.addEventListener("visibilitychange", onHide);
		return () => document.removeEventListener("visibilitychange", onHide);
	}, []);
	const begin = () => {
		audio.unlock();
		audio.click();
		if (settings.music > .02) audio.startMusic();
		energyNow();
		setBooted(true);
		setScreen("home");
	};
	const goPlay = (s) => {
		audio.click();
		energyNow();
		if (s.energyCost > 0 && !spendEnergy(s.energyCost)) {
			setToast("energy");
			setScreen("shop");
			return;
		}
		setSession(s);
		setScreen("play");
	};
	const onResult = (r) => {
		const boss = !!r.session.levelId?.endsWith("-8");
		const legend = !!r.session.levelId?.startsWith("legend");
		const marks = applyResult(r, {
			boss,
			legend
		});
		if (r.coins > 0) audio.coin();
		setResult({
			...r,
			marks
		});
		setScreen("result");
	};
	const nextLevel = () => {
		const cur = session;
		setResult(null);
		if (cur?.levelId?.startsWith("w")) {
			const m = /^w(\d+)-(\d+)$/.exec(cur.levelId);
			if (m) {
				const abs = (Number(m[1]) - 1) * 8 + Number(m[2]) + 1;
				if (abs <= 40) {
					goPlay(sessionFromLevel(campaignLevel(abs)));
					return;
				}
			}
		}
		setScreen("journey");
	};
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-10 rounded-2xl bg-paper" })
	});
	if (!booted || screen === "splash") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, { onBegin: begin });
	const showNav = !["play", "result"].includes(screen);
	const body = (() => {
		switch (screen) {
			case "play": return session ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayScreen, {
				session,
				onExit: () => setScreen("home"),
				onResult
			}) : null;
			case "result": return result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultScreen, {
				coins: result.coins,
				xp: result.xp,
				won: result.won,
				perfect: result.perfect,
				elapsed: result.elapsed,
				found: result.found.length,
				total: result.words.length,
				hintsUsed: result.hintsUsed,
				marks: result.marks,
				onNext: nextLevel,
				onHome: () => setScreen("home")
			}) : null;
			case "journey": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JourneyScreen, {
				onPlay: goPlay,
				onBack: () => setScreen("home")
			});
			case "modes": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModesScreen, {
				onPlay: goPlay,
				onBack: () => setScreen("home")
			});
			case "daily": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DailyScreen, {
				onPlay: goPlay,
				onBack: () => setScreen("home")
			});
			case "shop": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopScreen, { onBack: () => setScreen("home") });
			case "spin": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpinScreen, { onBack: () => setScreen("home") });
			case "stats": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsScreen, { onBack: () => setScreen("home") });
			case "achievements": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AchievementsScreen, { onBack: () => setScreen("home") });
			case "profile": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileScreen, { onBack: () => setScreen("home") });
			case "settings": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsScreen, { onBack: () => setScreen("home") });
			case "dictionary": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DictionaryScreen, {
				onBack: () => setScreen("home"),
				onMore: (id) => setScreen(id)
			});
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeScreen, {
				onPlay: goPlay,
				onGo: setScreen
			});
		}
	})();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh max-w-[430px] flex-col bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-0 flex-1 flex-col",
				children: body
			}),
			showNav && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {
				screen,
				onGo: setScreen
			}),
			toast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-full bg-ink px-4 py-2 text-xs text-paper shadow-[var(--shadow-lift)]",
					children: toast === "energy" ? "Energy spent" : toast
				})
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameApp, {});
}
//#endregion
export { Home as component };
