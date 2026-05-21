import { notFound } from "next/navigation";
import { hasLocale, getDictionary, Locale } from "@/lib/dictionaries";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TickerBar from "@/components/layout/TickerBar";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <div className="flex flex-col min-h-screen">
      <TickerBar />
      <Header lang={lang} dict={dict.nav} />
      <main className="flex-1 max-w-screen-2xl w-full mx-auto px-4 py-6">
        {children}
      </main>
      <Footer lang={lang} />
    </div>
  );
}
