import "server-only";

export type Locale = "es" | "en" | "fr" | "pt" | "de" | "it" | "ar" | "zh";

export const SUPPORTED_LOCALES: Locale[] = [
  "es", "en", "fr", "pt", "de", "it", "ar", "zh",
];
export const DEFAULT_LOCALE: Locale = "es";

const dictionaries: Record<Locale, () => Promise<Record<string, unknown>>> = {
  es: () => import("../dictionaries/es.json").then((m) => m.default as Record<string, unknown>),
  en: () => import("../dictionaries/en.json").then((m) => m.default as Record<string, unknown>),
  fr: () => import("../dictionaries/es.json").then((m) => m.default as Record<string, unknown>),
  pt: () => import("../dictionaries/es.json").then((m) => m.default as Record<string, unknown>),
  de: () => import("../dictionaries/en.json").then((m) => m.default as Record<string, unknown>),
  it: () => import("../dictionaries/es.json").then((m) => m.default as Record<string, unknown>),
  ar: () => import("../dictionaries/es.json").then((m) => m.default as Record<string, unknown>),
  zh: () => import("../dictionaries/en.json").then((m) => m.default as Record<string, unknown>),
};

export const hasLocale = (locale: string): locale is Locale =>
  SUPPORTED_LOCALES.includes(locale as Locale);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDictionary = async (locale: Locale): Promise<any> =>
  dictionaries[locale]();
