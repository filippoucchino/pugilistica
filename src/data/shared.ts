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
  // Numero di telefono visibile — coincide con il WhatsApp del coach.
  phone: "+39 339 754 0061",
  // Numero WhatsApp del coach — formato wa.me (solo cifre, con prefisso internazionale).
  whatsapp: "393397540061",
  // Versione leggibile dello stesso numero, da usare nei testi visibili all'utente.
  whatsappDisplay: "+39 339 754 0061",
  // Formato tel: (solo cifre con + iniziale) per attributi href.
  phoneHref: "tel:+393397540061",
  email: "info@pugilisticabrianza.it",
  founded: 2016,
  foundingDate: "9 gennaio 2016",
  url: "https://pugilisticabrianza.it",
  // URL di embed Google Maps (quello dell'iframe src).
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2788.8970827281223!2d9.1181697!3d45.652888499999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478697b56d7815ed%3A0x1db0ce2fc198d53e!2sPugilistica%20Brianza!5e0!3m2!1sen!2sus!4v1776253444561!5m2!1sen!2sus",
  // Link pubblico "apri in Google Maps" (query sul nome, apre Maps nel browser/app).
  mapExternalUrl:
    "https://www.google.com/maps/search/?api=1&query=Pugilistica+Brianza+Barlassina",
  // Immagine statica usata come facade (generata dai tile OSM per evitare il caricamento iniziale dell'iframe).
  mapPreviewSrc: "/images/map-pugilistica-brianza.png",
  social: {
    facebook: "https://www.facebook.com/pugilistica",
    instagram: "https://www.instagram.com/pugilisticabrianza",
  },
} as const;

/**
 * Costruisce l'URL wa.me con messaggio precompilato.
 * Usa sempre questo helper invece di hardcodare il numero: se cambia,
 * si aggiorna solo `siteInfo.whatsapp` e tutti i link si allineano.
 */
export function buildWhatsappHref(message: string): string {
  return `https://wa.me/${siteInfo.whatsapp}?text=${encodeURIComponent(message)}`;
}

/* — Trust Bar items — */
export const trustItems = [
  {
    icon: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
    title: "Dal 2016",
    subtitle: "ASD attiva",
  },
  {
    icon: '<circle cx="12" cy="8" r="4"/><path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>',
    title: "Coach ex agonista",
    subtitle: "Stefano Rizzo",
  },
  {
    icon: '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    title: "FPI, FIPE e Hyrox",
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
  { label: "Orari", href: "/orari/" },
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
  { label: "Orari", href: "/orari/" },
  { label: "Chi siamo", href: "/chi-siamo/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Contatti", href: "/contatti/" },
  { label: "Prova gratuita", href: "/prova-gratuita/" },
];

/* — Orari — */
// Orari reali di apertura della palestra (allineati al poster corsi).
// Lun–Ven aperti dalle 08:00 (Open Gym) alle 21:00, sabato finestra ridotta
// (10:00–12:00, solo 2 corsi), domenica chiusa.
export const hours = [
  { day: "Lunedì", time: "08:00 – 21:00" },
  { day: "Martedì", time: "08:00 – 21:00" },
  { day: "Mercoledì", time: "08:00 – 21:00" },
  { day: "Giovedì", time: "08:00 – 21:00" },
  { day: "Venerdì", time: "08:00 – 21:00" },
  { day: "Sabato", time: "10:00 – 12:00" },
  { day: "Domenica", time: "Chiuso", closed: true },
] as const;
