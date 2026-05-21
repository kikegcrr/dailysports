import { hasLocale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad — dailySports",
  description: "Política de privacidad y uso de cookies de dailySports.",
};

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div>
        <h1 className="text-3xl font-display tracking-wide text-white mb-2">Política de Privacidad</h1>
        <p className="text-gray-400 text-sm">Última actualización: mayo de 2025</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-6 text-gray-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">1. Información que recopilamos</h2>
          <p>
            dailySports es una plataforma de noticias y resultados deportivos en tiempo real. No recopilamos datos personales identificables salvo cuando el usuario se registra voluntariamente. Los datos de registro (nombre de usuario, correo electrónico) se almacenan de forma segura y no se comparten con terceros sin consentimiento explícito.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">2. Cookies</h2>
          <p>
            Utilizamos cookies propias para mantener la sesión del usuario y recordar sus preferencias de idioma. Adicionalmente, empleamos cookies de terceros para los siguientes fines:
          </p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li><strong className="text-white">Google AdSense:</strong> mostramos anuncios publicitarios servidos por Google LLC. Google utiliza cookies para personalizar anuncios en función de visitas anteriores. Puedes consultar la política de privacidad de Google en <span className="text-gold-400">policies.google.com/privacy</span>.</li>
            <li><strong className="text-white">Supabase:</strong> plataforma de base de datos utilizada para gestionar cuentas de usuario.</li>
            <li><strong className="text-white">APIs externas:</strong> accedemos a APIs de ESPN, Twitch y YouTube para mostrar resultados y contenido. Estas plataformas tienen sus propias políticas de privacidad.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">3. Google AdSense y publicidad</h2>
          <p>
            Este sitio web participa en el programa Google AdSense. Google, como proveedor externo, utiliza cookies para mostrar anuncios basados en las visitas anteriores de los usuarios a este y otros sitios web. El uso de la cookie de publicidad de Google permite a Google y sus socios mostrar anuncios a los usuarios en función de su visita a este y otros sitios web. Los usuarios pueden inhabilitar la publicidad personalizada en <span className="text-gold-400">www.google.com/settings/ads</span>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">4. Datos de uso</h2>
          <p>
            Podemos recopilar datos anónimos de uso (páginas visitadas, tiempo en el sitio) con fines estadísticos para mejorar la experiencia del usuario. Estos datos no permiten identificar a ningún usuario de forma individual.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">5. Derechos del usuario</h2>
          <p>
            De acuerdo con el Reglamento General de Protección de Datos (RGPD), tienes derecho a acceder, rectificar y suprimir tus datos personales. Para ejercer estos derechos, contacta con nosotros en <span className="text-gold-400">kikegc11@gmail.com</span>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">6. Cambios en esta política</h2>
          <p>
            Nos reservamos el derecho de modificar esta política de privacidad. Los cambios se publicarán en esta página con la fecha de actualización. Te recomendamos revisarla periódicamente.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">7. Contacto</h2>
          <p>
            Si tienes preguntas sobre esta política, escríbenos a <span className="text-gold-400">kikegc11@gmail.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
