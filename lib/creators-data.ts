import { Creator } from "@/components/creators/CreatorCard";

export const CREATORS: Creator[] = [
  {
    id: "1",
    name: "El Chiringuito de Jugones",
    username: "elchiringuitotv",
    platform: "youtube",
    sport: "Fútbol",
    followers: "3.8M",
    description:
      "El programa deportivo más polémico y entretenido de la televisión española. Debates nocturnos sobre fútbol con los mejores periodistas.",
    profileUrl: "https://youtube.com/@ElChiringuitodejugones",
    latestPost: {
      title: "¡El debate más tenso del año! ¿Quién ganará LaLiga?",
      url: "https://youtube.com",
      publishedAt: "hace 2h",
    },
    schedule: [
      { day: "Lunes-Viernes", time: "23:30", topic: "Tertulia deportiva en directo" },
      { day: "Sábado",        time: "00:00", topic: "Post-partido LaLiga" },
    ],
    verified: true,
  },
  {
    id: "2",
    name: "Jijantes FC",
    username: "JijantesFC",
    platform: "youtube",
    sport: "Fútbol",
    followers: "2.1M",
    description:
      "Canal de opinión futbolística con debates frescos y análisis profundos de la actualidad del fútbol español e internacional.",
    profileUrl: "https://youtube.com/@JijantesFC",
    latestPost: {
      title: "Análisis: El mejor XI de la temporada en Champions",
      url: "https://youtube.com",
      publishedAt: "hace 5h",
    },
    schedule: [
      { day: "Martes y Jueves", time: "20:00", topic: "Análisis semanal" },
      { day: "Domingo",         time: "19:00", topic: "Resumen de la jornada" },
    ],
    verified: true,
  },
  {
    id: "3",
    name: "Mister Chip",
    username: "misterchip",
    platform: "twitter",
    sport: "Fútbol & Estadísticas",
    followers: "2.1M",
    description:
      "El rey de las estadísticas deportivas. Datos, cifras y análisis en tiempo real de todos los partidos del mundo.",
    profileUrl: "https://twitter.com/misterchip",
    latestPost: {
      title: "Los datos del fin de semana en LaLiga: récords y curiosidades",
      url: "https://twitter.com/misterchip",
      publishedAt: "hace 1h",
    },
    verified: true,
  },
  {
    id: "4",
    name: "Basket Total",
    username: "BasketTotal",
    platform: "youtube",
    sport: "Baloncesto",
    followers: "890K",
    description:
      "El mejor canal de baloncesto en español. Análisis NBA, ACB, EuroLeague y selecciones nacionales con los mejores expertos.",
    profileUrl: "https://youtube.com/@BasketTotal",
    latestPost: {
      title: "NBA Highlights: Los mejores momentos de la noche",
      url: "https://youtube.com",
      publishedAt: "hace 3h",
    },
    schedule: [
      { day: "Lunes",    time: "19:00", topic: "Resumen NBA del fin de semana" },
      { day: "Miércoles",time: "20:30", topic: "Análisis ACB" },
    ],
  },
  {
    id: "5",
    name: "Fabrizio Romano",
    username: "FabrizioRomano",
    platform: "twitter",
    sport: "Mercado de fichajes",
    followers: "22M",
    description:
      "El periodista de fichajes más famoso del mundo. Primicia y exclusivas del mercado de transferencias internacionales.",
    profileUrl: "https://twitter.com/FabrizioRomano",
    latestPost: {
      title: "Here we go! Confirmed transfer breaking news",
      url: "https://twitter.com/FabrizioRomano",
      publishedAt: "hace 30min",
    },
    verified: true,
  },
  {
    id: "6",
    name: "El Larguero",
    username: "ellarguero",
    platform: "youtube",
    sport: "Fútbol & Deportes",
    followers: "1.4M",
    description:
      "El histórico programa deportivo de la Cadena SER. Análisis, entrevistas exclusivas y la mejor tertulia deportiva nocturna.",
    profileUrl: "https://youtube.com/@ElLarguero",
    schedule: [
      { day: "Lunes-Viernes", time: "00:00", topic: "Tertulia deportiva" },
      { day: "Fin de semana", time: "00:30", topic: "Post-partido" },
    ],
    verified: true,
  },
  {
    id: "7",
    name: "NBA España",
    username: "NBASpain",
    platform: "instagram",
    sport: "Baloncesto - NBA",
    followers: "1.2M",
    description:
      "La cuenta oficial de la NBA en España. Highlights, entrevistas, estadísticas y toda la actualidad de la mejor liga de baloncesto.",
    profileUrl: "https://instagram.com/nbaespana",
    latestPost: {
      title: "🔥 Los mejores dunks de la noche NBA",
      url: "https://instagram.com/nbaespana",
      publishedAt: "hace 4h",
    },
    verified: true,
  },
  {
    id: "8",
    name: "Mister Chip TV",
    username: "misterchip_tv",
    platform: "twitch",
    sport: "Fútbol & Estadísticas",
    followers: "450K",
    description:
      "Directos con estadísticas en tiempo real, debates y análisis de las jornadas deportivas. El dato más curioso de cada partido.",
    profileUrl: "https://twitch.tv/misterchip_tv",
    schedule: [
      { day: "Fin de semana", time: "21:00", topic: "Directo de jornada con estadísticas" },
    ],
  },
];
