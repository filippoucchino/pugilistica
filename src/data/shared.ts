/**
 * Dati condivisi tra le pagine — single source of truth.
 * Importa in qualsiasi pagina o componente con:
 *   import { trustItems, localDetails, zones, siteInfo } from "@/data/shared";
 */

/* — Site info — */
export const siteInfo = {
  name: "ASD Pugilistica Brianza",
  shortName: "Pugilistica Brianza",
  address: "Via Giovanni Segantini 29",
  city: "Barlassina",
  province: "MB",
  cap: "20825",
  phone: "+39 XXX XXX XXXX",
  email: "info@pugilisticabrianza.it",
  founded: 2018,
  url: "https://pugilisticabrianza.it",
  social: {
    facebook: "#",
    instagram: "#",
  },
} as const;

/* — Trust Bar items — */
export const trustItems = [
  {
    icon: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
    title: "Dal 2018",
    subtitle: "ASD attiva",
  },
  {
    icon: '<circle cx="12" cy="8" r="4"/><path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>',
    title: "Coach ex agonista",
    subtitle: "Stefano Rizzo",
  },
  {
    icon: '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    title: "FPI e FIPE",
    subtitle: "Affiliazioni ufficiali",
  },
  {
    icon: '<path d="M5 3l14 9-14 9V3z"/>',
    title: "Prova gratuita",
    subtitle: "Senza impegno",
  },
  {
    icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/>',
    title: "Parcheggio e docce",
    subtitle: "Spogliatoi attrezzati",
  },
];

/* — Local Section details — */
export const localDetails = [
  {
    icon: '<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>',
    text: "Telefono attivo",
  },
  {
    icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    text: "Dal lunedì al sabato",
  },
  {
    icon: '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5" fill="none"/>',
    text: "Parcheggio disponibile",
  },
  {
    icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/>',
    text: "Spogliatoi e docce",
  },
];

/* — Zone servite — */
export const zones = [
  "Barlassina",
  "Seveso",
  "Lissone",
  "Seregno",
  "Desio",
  "Muggiò",
  "Brianza",
];

/* — Nav links (usati in Header e Footer) — */
export const navLinks = [
  { label: "Pugilato", href: "/pugilato/" },
  { label: "Hyrox", href: "/hyrox/" },
  { label: "PB Hiit", href: "/pb-hiit/" },
  { label: "Lezioni private", href: "/lezioni-private-pugilato/" },
  { label: "Chi siamo", href: "/chi-siamo/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Contatti", href: "/contatti/" },
];

/* — Percorsi (subset di navLinks usato nel Footer) — */
export const courseLinks = [
  { label: "Pugilato", href: "/pugilato/" },
  { label: "Hyrox", href: "/hyrox/" },
  { label: "PB Hiit", href: "/pb-hiit/" },
  { label: "Lezioni private", href: "/lezioni-private-pugilato/" },
];

/* — Info links (subset usato nel Footer) — */
export const infoLinks = [
  { label: "Chi siamo", href: "/chi-siamo/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Contatti", href: "/contatti/" },
  { label: "Prova gratuita", href: "/prova-gratuita/" },
];

/* — Orari — */
export const hours = [
  { day: "Lunedì", time: "09:00 – 22:00" },
  { day: "Martedì", time: "09:00 – 22:00" },
  { day: "Mercoledì", time: "09:00 – 22:00" },
  { day: "Giovedì", time: "09:00 – 22:00" },
  { day: "Venerdì", time: "09:00 – 22:00" },
  { day: "Sabato", time: "09:00 – 18:00" },
  { day: "Domenica", time: "Chiuso", closed: true },
] as const;
