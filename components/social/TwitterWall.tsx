"use client";
import { ExternalLink } from "lucide-react";

interface TwitterAccount {
  username: string;
  name: string;
  description: string;
  followers: string;
  topic: string;
}

const ACCOUNTS: TwitterAccount[] = [
  // ── Real Madrid ─────────────────────────────────────────────────────────────
  { username: "realmadrid",      name: "Real Madrid CF",      description: "Cuenta oficial del club más laureado del mundo.",                      followers: "43M",   topic: "Real Madrid" },
  { username: "madridxtra",      name: "MadridXtra",          description: "Noticias del Real Madrid en tiempo real. El primero en publicar.",     followers: "1.3M",  topic: "Real Madrid" },
  { username: "Alfremartinezz",  name: "Alfredo Martínez",    description: "Periodista Onda Cero especializado en el Real Madrid.",                followers: "920K",  topic: "Real Madrid" },
  { username: "marca_rm",        name: "Marca Real Madrid",   description: "Sección Real Madrid del periódico Marca.",                            followers: "580K",  topic: "Real Madrid" },
  { username: "tjcope",          name: "Tiempo de Juego",     description: "La voz madridista de los fines de semana en COPE.",                   followers: "640K",  topic: "Real Madrid" },
  { username: "RamonAlvarezDeM", name: "Ramón Álvarez de Mon",description: "Periodista y comentarista. Análisis del Real Madrid sin filtros.",     followers: "450K",  topic: "Real Madrid" },

  // ── FC Barcelona ────────────────────────────────────────────────────────────
  { username: "FCBarcelona_es",  name: "FC Barcelona",        description: "Canal oficial del FC Barcelona en español.",                           followers: "12M",   topic: "FC Barcelona" },
  { username: "barcauniversal",  name: "BarcaUniversal",      description: "Noticias del FC Barcelona al instante. Fichajes, plantilla y más.",   followers: "1.8M",  topic: "FC Barcelona" },
  { username: "mundodeportivo",  name: "Mundo Deportivo",     description: "El diario del Barça. Todas las noticias culés.",                      followers: "2.8M",  topic: "FC Barcelona" },
  { username: "sport",           name: "Sport",               description: "Diario Sport, el referente del barcelonismo.",                        followers: "1.5M",  topic: "FC Barcelona" },
  { username: "gerardromero",    name: "Gerard Romero",       description: "El periodista más rápido del mundo en el mercado de fichajes. Jijantes.", followers: "3.4M", topic: "FC Barcelona" },
  { username: "AlfredPedret",    name: "Alfred Pedret",       description: "Periodista de Sport especializado en el FC Barcelona.",               followers: "720K",  topic: "FC Barcelona" },

  // ── Atlético de Madrid ───────────────────────────────────────────────────────
  { username: "Atleti",          name: "Atlético de Madrid",  description: "Cuenta oficial del Atlético de Madrid.",                              followers: "5.2M",  topic: "Atlético" },
  { username: "atletidebolsillo",name: "Atleti de Bolsillo",  description: "El mejor agregador de noticias del Atlético. 24/7.",                  followers: "380K",  topic: "Atlético" },
  { username: "As_Atletico",     name: "AS Atlético",         description: "Sección Atlético de Madrid del diario AS.",                           followers: "290K",  topic: "Atlético" },
  { username: "marca_atletico",  name: "Marca Atlético",      description: "Sección Atlético de Madrid de MARCA.",                               followers: "210K",  topic: "Atlético" },

  // ── Clubes de LaLiga ─────────────────────────────────────────────────────────
  { username: "SevillaFC",       name: "Sevilla FC",          description: "Cuenta oficial del Sevilla FC.",                                      followers: "2.1M",  topic: "Clubes" },
  { username: "valenciacf",      name: "Valencia CF",         description: "Cuenta oficial del Valencia CF. Les Ors.",                            followers: "1.9M",  topic: "Clubes" },
  { username: "AthleticClub",   name: "Athletic Club",        description: "Cuenta oficial del Athletic Club de Bilbao.",                         followers: "1.6M",  topic: "Clubes" },
  { username: "RealBetis",       name: "Real Betis",          description: "Cuenta oficial del Real Betis Balompié. ManquePierda.",               followers: "2.3M",  topic: "Clubes" },
  { username: "VillarrealCF",    name: "Villarreal CF",       description: "Cuenta oficial del Villarreal CF. Submarino Amarillo.",               followers: "1.1M",  topic: "Clubes" },
  { username: "RealSociedad",    name: "Real Sociedad",       description: "Cuenta oficial de la Real Sociedad. Aurrerantz.",                     followers: "830K",  topic: "Clubes" },

  // ── Fichajes / Mercado ───────────────────────────────────────────────────────
  { username: "FabrizioRomano",  name: "Fabrizio Romano",     description: "\"Here we go!\" El periodista de transferencias más seguido del mundo.", followers: "22M", topic: "Fichajes" },
  { username: "GianlucaDiMarzio",name: "Di Marzio",           description: "Periodista italiano de Sky Sport. Imprescindible en cada ventana.",   followers: "3.2M",  topic: "Fichajes" },
  { username: "david_ornstein",  name: "David Ornstein",      description: "The Athletic. El mejor en noticias exclusivas de Premier y Europa.",   followers: "2.1M",  topic: "Fichajes" },
  { username: "marca",           name: "MARCA",               description: "El periódico deportivo más leído de España.",                         followers: "5.2M",  topic: "Fichajes" },
  { username: "relevo",          name: "Relevo",              description: "El nuevo referente del periodismo deportivo digital.",                 followers: "580K",  topic: "Fichajes" },

  // ── LaLiga General ──────────────────────────────────────────────────────────
  { username: "LaLiga",          name: "LaLiga EA Sports",    description: "Cuenta oficial de LaLiga. Resultados, stats y todo el fútbol español.", followers: "11M",  topic: "LaLiga" },
  { username: "AS_com",          name: "Diario AS",           description: "El deporte español y mundial en directo.",                             followers: "4.8M",  topic: "LaLiga" },
  { username: "elchiringuitotv", name: "El Chiringuito TV",   description: "El debate deportivo más polémico de España.",                         followers: "3.1M",  topic: "LaLiga" },
  { username: "2010MisterChip",   name: "Mister Chip",         description: "El rey de las estadísticas del fútbol. Datos en tiempo real.",        followers: "2.2M",  topic: "LaLiga" },
  { username: "JijantesFC",      name: "Jijantes FC",         description: "El canal de Gerard Romero y Jan. Opinión sin filtros.",               followers: "940K",  topic: "LaLiga" },
  { username: "Roncero11",       name: "Tomás Roncero",       description: "Subdirector AS. La voz más madridista de la prensa española.",        followers: "750K",  topic: "LaLiga" },
  { username: "EduAguirre7",     name: "Edu Aguirre",         description: "Periodista de El Chiringuito. Siempre al límite.",                    followers: "640K",  topic: "LaLiga" },
  { username: "carrusel",        name: "Carrusel Deportivo",  description: "El programa deportivo referente de los fines de semana en la SER.",   followers: "850K",  topic: "LaLiga" },

  // ── Champions / Europa ───────────────────────────────────────────────────────
  { username: "ChampionsLeague", name: "Champions League",    description: "Cuenta oficial de la UEFA Champions League.",                         followers: "42M",   topic: "Champions" },
  { username: "EuropaLeague",    name: "Europa League",       description: "Cuenta oficial de la UEFA Europa League.",                            followers: "9M",    topic: "Champions" },
  { username: "UEFA",            name: "UEFA",                description: "Organismo rector del fútbol europeo.",                                followers: "5.5M",  topic: "Champions" },
  { username: "UEFAConference",  name: "Conference League",   description: "Cuenta oficial de la UEFA Conference League.",                        followers: "2.1M",  topic: "Champions" },

  // ── Radios y TV Deportiva ────────────────────────────────────────────────────
  { username: "ellarguero",      name: "El Larguero",         description: "El programa nocturno referente del deporte en la Cadena SER.",        followers: "790K",  topic: "Radio & TV" },
  { username: "COPE",            name: "COPE Deportes",       description: "Los mejores programas deportivos de la cadena COPE.",                 followers: "1.1M",  topic: "Radio & TV" },
  { username: "elpartidazo",     name: "El Partidazo COPE",   description: "La noche del deporte en COPE. Con Juanma Castaño.",                  followers: "560K",  topic: "Radio & TV" },
  { username: "ondacero_es",     name: "Onda Cero",           description: "El Transistor y el deporte de Onda Cero.",                           followers: "430K",  topic: "Radio & TV" },
  { username: "laSextaDeportes", name: "La Sexta Deportes",   description: "Los mejores directos del deporte en la televisión.",                 followers: "370K",  topic: "Radio & TV" },

  // ── NBA / Baloncesto ─────────────────────────────────────────────────────────
  { username: "NBASpain",        name: "NBA España",          description: "La NBA en español. Noticias, resultados y vídeos.",                   followers: "1.4M",  topic: "Baloncesto" },
  { username: "acbcom",          name: "ACB Liga Endesa",     description: "La liga de baloncesto más importante del sur de Europa.",             followers: "650K",  topic: "Baloncesto" },
  { username: "euroleague",      name: "EuroLeague",          description: "La competición de clubes de baloncesto más importante de Europa.",    followers: "990K",  topic: "Baloncesto" },
  { username: "BasketTotal",     name: "Basket Total",        description: "El mejor análisis de NBA y ACB en español.",                         followers: "380K",  topic: "Baloncesto" },
  { username: "baloncesto_es",   name: "Baloncesto España",   description: "La selección española de baloncesto. Campeones del mundo.",          followers: "310K",  topic: "Baloncesto" },

  // ── Tenis ───────────────────────────────────────────────────────────────────
  { username: "RafaelNadal",     name: "Rafa Nadal",          description: "22 Grand Slams. El tenista más legendario de la historia.",           followers: "16M",   topic: "Tenis" },
  { username: "alcarazcarlos03", name: "Carlos Alcaraz",      description: "El próximo rey del tenis mundial. 4 Grand Slams ya.",                followers: "5.1M",  topic: "Tenis" },
  { username: "atptour",         name: "ATP Tour",            description: "El circuito profesional masculino de tenis. Oficial.",               followers: "5.8M",  topic: "Tenis" },
  { username: "WTA",             name: "WTA",                 description: "El circuito profesional femenino de tenis. Oficial.",                followers: "4.2M",  topic: "Tenis" },

  // ── Motor ────────────────────────────────────────────────────────────────────
  { username: "F1",              name: "Formula 1",           description: "El deporte del motor más seguido del mundo. Oficial.",               followers: "12M",   topic: "Motor" },
  { username: "MotoGP",          name: "MotoGP",              description: "El campeonato del mundo de motociclismo. Oficial.",                  followers: "5.8M",  topic: "Motor" },
  { username: "CarlosSainz55",   name: "Carlos Sainz Jr.",    description: "Piloto de F1. Ferrari, Williams y el espíritu español en el paddock.", followers: "4.5M", topic: "Motor" },
  { username: "alo_oficial",     name: "Fernando Alonso",     description: "Doble campeón mundial de F1. El fenómeno.",                          followers: "6.8M",  topic: "Motor" },
  { username: "marca_motor",     name: "Marca Motor",         description: "Fórmula 1, MotoGP y todo el motor en español.",                     followers: "420K",  topic: "Motor" },
];

const TOPICS = [
  "Real Madrid", "FC Barcelona", "Atlético", "Clubes",
  "Fichajes", "LaLiga", "Champions", "Radio & TV",
  "Baloncesto", "Tenis", "Motor",
] as const;

const TOPIC_COLOR: Record<string, { dot: string; badge: string; border: string }> = {
  "Real Madrid":  { dot: "bg-white",        badge: "text-white bg-white/10 border-white/20",                   border: "border-white/20" },
  "FC Barcelona": { dot: "bg-blue-400",     badge: "text-blue-400 bg-blue-500/10 border-blue-500/20",          border: "border-blue-500/20" },
  "Atlético":     { dot: "bg-red-400",      badge: "text-red-400 bg-red-500/10 border-red-500/20",             border: "border-red-500/20" },
  "Clubes":       { dot: "bg-purple-400",   badge: "text-purple-400 bg-purple-500/10 border-purple-500/20",    border: "border-purple-500/20" },
  "Fichajes":     { dot: "bg-emerald-400",  badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", border: "border-emerald-500/20" },
  "LaLiga":       { dot: "bg-orange-400",   badge: "text-orange-400 bg-orange-500/10 border-orange-500/20",    border: "border-orange-500/20" },
  "Champions":    { dot: "bg-sky-400",      badge: "text-sky-400 bg-sky-500/10 border-sky-500/20",             border: "border-sky-500/20" },
  "Radio & TV":   { dot: "bg-rose-400",     badge: "text-rose-400 bg-rose-500/10 border-rose-500/20",          border: "border-rose-500/20" },
  "Baloncesto":   { dot: "bg-amber-400",    badge: "text-amber-400 bg-amber-500/10 border-amber-500/20",       border: "border-amber-500/20" },
  "Tenis":        { dot: "bg-lime-400",     badge: "text-lime-400 bg-lime-500/10 border-lime-500/20",          border: "border-lime-500/20" },
  "Motor":        { dot: "bg-yellow-400",   badge: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",    border: "border-yellow-500/20" },
};

function AccountCard({ acc }: { acc: TwitterAccount }) {
  const colors = TOPIC_COLOR[acc.topic] ?? TOPIC_COLOR["LaLiga"];
  return (
    <a
      href={`https://twitter.com/${acc.username}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-start gap-3 p-3 rounded-xl bg-sport-card border ${colors.border} hover:border-sky-500/50 hover:bg-sky-500/5 transition-all`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://unavatar.io/twitter/${acc.username}`}
        alt={acc.name}
        className="w-10 h-10 rounded-full border border-white/10 shrink-0 object-cover bg-sport-border"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.name)}&background=0f172a&color=ffffff&size=40`;
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className="text-sm font-semibold text-white truncate group-hover:text-sky-300 transition-colors">
            {acc.name}
          </p>
          <ExternalLink size={12} className="text-gray-600 group-hover:text-sky-400 shrink-0 transition-colors" />
        </div>
        <p className="text-xs text-gray-500 mb-1">@{acc.username} · {acc.followers}</p>
        <p className="text-xs text-gray-400 line-clamp-2">{acc.description}</p>
      </div>
    </a>
  );
}

export default function TwitterWall() {
  return (
    <div className="space-y-6">
      {TOPICS.map((topic) => {
        const topicAccounts = ACCOUNTS.filter((a) => a.topic === topic);
        if (!topicAccounts.length) return null;
        const colors = TOPIC_COLOR[topic];
        return (
          <div key={topic}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
              <h3 className="text-sm font-semibold text-white">{topic}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${colors.badge}`}>
                {topicAccounts.length} cuentas
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {topicAccounts.map((acc) => (
                <AccountCard key={acc.username} acc={acc} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
