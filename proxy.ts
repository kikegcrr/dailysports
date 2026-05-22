import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["es", "en", "fr", "pt", "de", "it", "ar", "zh"];
const DEFAULT_LOCALE = "es";

function getLocale(request: NextRequest): string {
  const acceptLang = request.headers.get("accept-language");
  if (acceptLang) {
    const preferred = acceptLang
      .split(",")
      .map((l) => l.split(";")[0].trim().split("-")[0]);
    for (const lang of preferred) {
      if (LOCALES.includes(lang)) return lang;
    }
  }
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = LOCALES.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  // Root path: rewrite (not redirect) so the URL stays as https://dailysports.es
  if (pathname === "/") {
    return NextResponse.rewrite(url);
  }

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icons|images|ads\\.txt|robots\\.txt|sitemap\\.xml).*)",
  ],
};
