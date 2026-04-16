/**
 * Single source of truth per gli orari dei corsi e i prezzi della palestra.
 * Tutta la pagina /orari/ legge da qui: se cambia un orario, si modifica
 * solo questo file e la tabella + il JSON-LD si aggiornano di conseguenza.
 */

/* — Tipi — */

/**
 * I "tag" sono le categorie atomiche usate sia per colorare le celle
 * sia per i filtri della legenda. Le celle combinate (es. "BOXE + HYROX")
 * appartengono a più tag contemporaneamente e rispondono a entrambi i filtri.
 */
export type ActivityTag =
  | "open-gym"
  | "boxe"
  | "boxe-agonisti"
  | "kids-boxe"
  | "hyrox"
  | "pb-hiit";

export interface Activity {
  label: string;
  /** Uno o più tag atomici: determina il colore (primo tag) e i filtri che mostrano la cella. */
  tags: readonly ActivityTag[];
  /** Nota aggiuntiva mostrata come piccolo sottotitolo nella cella (es. "6–12 anni"). */
  note?: string;
}

export interface ScheduleCell {
  /**
   * Attività ospitate dalla cella. `null` = cella vuota (visualizzata come "/").
   * Un array con più elementi rappresenta attività che avvengono in parallelo
   * nello stesso slot orario (es. Boxe e Hyrox contemporanei): ogni attività
   * viene renderizzata come una "card" distinta affiancata alle altre, così il
   * filtro evidenzia solo quella selezionata.
   */
  activities: readonly Activity[] | null;
  /** Numero di colonne occupate. Default 1. Usato per OPEN GYM che copre tutti i 5 giorni feriali. */
  colspan?: 1 | 2 | 3 | 4 | 5;
}

export interface ScheduleRow {
  /** Fascia oraria leggibile (es. "09:00 – 10:00"). */
  time: string;
  /** Orario di inizio in formato 24h `HH:MM` — usato dal JSON-LD. */
  startIso: string;
  /** Orario di fine in formato 24h `HH:MM` — usato dal JSON-LD. */
  endIso: string;
  /** Celle della riga: la somma dei `colspan` deve essere esattamente 6 (Lun–Sab). */
  cells: ScheduleCell[];
}

/* — Giorni — */

export const WEEKDAYS_FULL = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"] as const;
export const WEEKDAYS_SHORT = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab"] as const;

/* — Attività disponibili — */

/* — Attività disponibili —
 * Ogni attività ha UN solo tag atomico: le combinazioni (es. Boxe + Hyrox in
 * parallelo) non vivono qui come entità miste, ma si rappresentano a livello
 * di cella mettendo due attività nell'array `activities`. Così il filtro
 * evidenzia solo la card del corso selezionato, non un'ibrida ambigua.
 */
export const ACTIVITIES: Record<string, Activity> = {
  openGym:      { label: "OPEN GYM",       tags: ["open-gym"] },
  boxe:         { label: "BOXE",           tags: ["boxe"] },
  boxeAgonisti: { label: "BOXE AGONISTI",  tags: ["boxe-agonisti"] },
  kidsBoxe:     { label: "KIDS BOXE",      tags: ["kids-boxe"], note: "6–12 anni" },
  hyrox:        { label: "HYROX",          tags: ["hyrox"] },
  pbHiit:       { label: "PB HIIT",        tags: ["pb-hiit"] },
};

/* — Orari unificati (Lun–Sab) —
 * Ogni riga ha 6 colonne (una per giorno, Sabato compreso). La somma dei
 * colspan per riga deve essere 6 — l'assertion in fondo al file lo verifica
 * a build-time. Il Sabato ha meno fasce attive del feriale: le celle vuote
 * si rappresentano con `activities: null` (placeholder "/").
 */
export const schedule: ScheduleRow[] = [
  {
    time: "08:00 – 09:00",
    startIso: "08:00",
    endIso: "09:00",
    cells: [
      { activities: [ACTIVITIES.openGym], colspan: 5 },
      { activities: null },
    ],
  },
  {
    time: "09:00 – 10:00",
    startIso: "09:00",
    endIso: "10:00",
    cells: [
      { activities: [ACTIVITIES.boxe, ACTIVITIES.hyrox] },
      { activities: [ACTIVITIES.openGym] },
      { activities: [ACTIVITIES.boxe, ACTIVITIES.hyrox] },
      { activities: [ACTIVITIES.openGym] },
      { activities: [ACTIVITIES.boxe, ACTIVITIES.hyrox] },
      { activities: null },
    ],
  },
  {
    time: "10:00 – 11:00",
    startIso: "10:00",
    endIso: "11:00",
    cells: [
      { activities: [ACTIVITIES.openGym], colspan: 5 },
      { activities: [ACTIVITIES.hyrox] },
    ],
  },
  {
    // Fascia dedicata al Sabato: nel feriale la palestra è chiusa in questo
    // slot, per questo la cella Lun–Ven è un grande placeholder vuoto.
    time: "11:00 – 12:00",
    startIso: "11:00",
    endIso: "12:00",
    cells: [
      { activities: null, colspan: 5 },
      { activities: [ACTIVITIES.boxe] },
    ],
  },
  {
    time: "12:30 – 13:30",
    startIso: "12:30",
    endIso: "13:30",
    cells: [
      { activities: [ACTIVITIES.boxe, ACTIVITIES.hyrox] },
      { activities: [ACTIVITIES.boxe, ACTIVITIES.hyrox] },
      { activities: [ACTIVITIES.boxe, ACTIVITIES.hyrox] },
      { activities: [ACTIVITIES.boxe, ACTIVITIES.hyrox] },
      { activities: [ACTIVITIES.boxe, ACTIVITIES.hyrox] },
      { activities: null },
    ],
  },
  {
    time: "17:00 – 18:00",
    startIso: "17:00",
    endIso: "18:00",
    cells: [
      { activities: [ACTIVITIES.boxe] },
      { activities: [ACTIVITIES.kidsBoxe] },
      { activities: [ACTIVITIES.boxe] },
      { activities: [ACTIVITIES.kidsBoxe] },
      { activities: [ACTIVITIES.boxe] },
      { activities: null },
    ],
  },
  {
    time: "18:00 – 19:00",
    startIso: "18:00",
    endIso: "19:00",
    cells: [
      { activities: [ACTIVITIES.boxe] },
      { activities: [ACTIVITIES.hyrox] },
      { activities: [ACTIVITIES.boxe] },
      { activities: [ACTIVITIES.hyrox] },
      { activities: [ACTIVITIES.boxe] },
      { activities: null },
    ],
  },
  {
    time: "19:00 – 20:00",
    startIso: "19:00",
    endIso: "20:00",
    cells: [
      { activities: [ACTIVITIES.boxe, ACTIVITIES.pbHiit] },
      { activities: [ACTIVITIES.boxeAgonisti] },
      { activities: [ACTIVITIES.boxe, ACTIVITIES.pbHiit] },
      { activities: [ACTIVITIES.boxeAgonisti] },
      { activities: [ACTIVITIES.boxe, ACTIVITIES.hyrox] },
      { activities: null },
    ],
  },
  {
    time: "20:00 – 21:00",
    startIso: "20:00",
    endIso: "21:00",
    cells: [
      { activities: [ACTIVITIES.hyrox] },
      { activities: [ACTIVITIES.boxeAgonisti] },
      { activities: [ACTIVITIES.hyrox] },
      { activities: [ACTIVITIES.boxeAgonisti] },
      { activities: null },
      { activities: null },
    ],
  },
];

/* — Assertion di sicurezza —
 * Durante il build (astro check / astro build) ogni riga viene verificata:
 * se la somma dei colspan non è 6 (Lun–Sab), il build fallisce con un errore
 * chiaro invece di renderizzare una tabella rotta in produzione.
 */
schedule.forEach((row) => {
  const total = row.cells.reduce((sum, cell) => sum + (cell.colspan ?? 1), 0);
  if (total !== 6) {
    throw new Error(
      `[scheduleData] Riga "${row.time}": la somma dei colspan è ${total}, attesa 6.`,
    );
  }
});

/* — Prezzi e abbonamenti — */

export interface PricingPlan {
  title: string;
  price: string;
  period: string;
  note?: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    title: "Ingresso singolo",
    price: "15€",
    period: "/lezione",
    features: [
      "Partecipa a una singola lezione",
      "Nessun impegno mensile",
      "Ideale per chi è di passaggio",
    ],
    ctaLabel: "Prenota una prova",
    ctaHref: "/prova-gratuita/",
  },
  {
    title: "Boxe",
    price: "50€",
    period: "/mese",
    features: [
      "Accesso a tutte le Boxe Class",
      "Lezioni dal lunedì al sabato",
      "Seguito dal coach durante ogni lezione",
    ],
    ctaLabel: "Inizia con la boxe",
    ctaHref: "/pugilato/",
  },
  {
    title: "Hyrox",
    price: "65€",
    period: "/mese",
    features: [
      "Accesso a tutte le Hyrox Class",
      "Preparazione specifica per la gara",
      "Programmazione sotto coach certificato",
    ],
    ctaLabel: "Scopri Hyrox",
    ctaHref: "/hyrox/",
  },
  {
    title: "PB Hiit",
    price: "50€",
    period: "/mese",
    features: [
      "Accesso a tutte le PB Hiit Class",
      "Allenamento funzionale ad alta intensità",
      "Perfetto per dimagrimento e tono",
    ],
    ctaLabel: "Scopri PB Hiit",
    ctaHref: "/pb-hiit/",
  },
  {
    title: "Open",
    price: "90€",
    period: "/mese",
    note: "Formula all-inclusive",
    features: [
      "Accesso illimitato a tutti i corsi",
      "Boxe, Hyrox, PB Hiit e Open Gym",
      "Massima libertà di allenamento",
    ],
    ctaLabel: "Prenota una prova",
    ctaHref: "/prova-gratuita/",
  },
];

/* — Note aggiuntive della pagina — */

export const scheduleNotes = {
  closedDay: "Domenica chiusa",
  annualFee: "Iscrizione annuale: 20€",
  medical: "Certificato medico obbligatorio per l'accesso in palestra.",
  fisioMedical:
    "Pugilistica Brianza è convenzionata con Fisio Medical di Cogliate (MB) per visite mediche sportive agevolate.",
} as const;

/* — Etichette delle attività (per legenda e JSON-LD) —
 * Una voce per ogni ActivityTag: queste sono le 6 categorie della legenda.
 * Le celle combinate ("BOXE + HYROX", "BOXE + PB HIIT") non hanno una voce
 * propria — appartengono contemporaneamente a due tag.
 */

export const activityLabels: Record<ActivityTag, string> = {
  "open-gym": "Open Gym",
  boxe: "Boxe",
  "boxe-agonisti": "Boxe Agonisti",
  "kids-boxe": "Kids Boxe",
  hyrox: "Hyrox",
  "pb-hiit": "PB Hiit",
};

/* — Descrizioni brevi delle attività per JSON-LD Event.description — */

const activityDescriptions: Record<ActivityTag, string> = {
  "open-gym":
    "Sessione di allenamento libera in palestra con disponibilità di sacchi, pesi e attrezzature.",
  boxe: "Corso di pugilato per tutti i livelli con tecnica, sparring leggero e preparazione atletica.",
  "boxe-agonisti": "Allenamento avanzato riservato ai pugili agonisti in preparazione ai match.",
  "kids-boxe": "Corso di pugilato per bambini e ragazzi dai 6 ai 12 anni.",
  hyrox: "Allenamento Hyrox: forza funzionale, corsa e stazioni tematiche.",
  "pb-hiit": "Allenamento PB Hiit: interval training ad alta intensità per forza e resistenza.",
};

/* — Helper: costruzione dei nodi Event per il JSON-LD —
 * Una cella con più tag contribuisce a più eventi (es. "BOXE + HYROX" finisce
 * sia nell'evento Boxe sia nell'evento Hyrox), così l'orario completo di ogni
 * disciplina risulta corretto indipendentemente dalle celle combinate.
 */

const DAY_OF_WEEK_MAP = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/** Una fascia oraria con i giorni in cui l'attività è programmata. */
export type ScheduleEntry = {
  start: string;
  end: string;
  byDay: string[];
};

export type RecurringEvent = {
  tag: ActivityTag;
  name: string;
  description: string;
  /** Fasce orarie con i rispettivi giorni (mappatura precisa slot → giorni). */
  entries: ScheduleEntry[];
};

function ensureEvent(
  map: Map<ActivityTag, RecurringEvent>,
  tag: ActivityTag,
): RecurringEvent {
  let evt = map.get(tag);
  if (!evt) {
    evt = {
      tag,
      name: activityLabels[tag],
      description: activityDescriptions[tag],
      entries: [],
    };
    map.set(tag, evt);
  }
  return evt;
}

/**
 * Aggrega tutte le righe dello `schedule` per tag di attività e restituisce
 * un array di eventi ricorrenti con la mappatura precisa slot → giorni.
 *
 * Esempio: Boxe avrà entries come:
 *   { start: "09:00", end: "10:00", byDay: ["Monday", "Wednesday", "Friday"] }
 *   { start: "12:30", end: "13:30", byDay: ["Monday", ..., "Friday"] }
 *   { start: "17:00", end: "18:00", byDay: ["Monday", "Wednesday", "Friday"] }
 *   ...
 */
export function buildEvents(): RecurringEvent[] {
  const byTag = new Map<ActivityTag, RecurringEvent>();

  schedule.forEach((row) => {
    let dayIndex = 0;
    row.cells.forEach((cell) => {
      const span = cell.colspan ?? 1;
      if (cell.activities) {
        cell.activities.forEach((activity) => {
          activity.tags.forEach((tag) => {
            const evt = ensureEvent(byTag, tag);

            // Trova o crea l'entry per questa fascia oraria
            let entry = evt.entries.find(
              (e) => e.start === row.startIso && e.end === row.endIso,
            );
            if (!entry) {
              entry = { start: row.startIso, end: row.endIso, byDay: [] };
              evt.entries.push(entry);
            }

            // Aggiunge i giorni coperti dalla cella a questa specifica fascia
            for (let i = 0; i < span; i++) {
              const day = DAY_OF_WEEK_MAP[dayIndex + i];
              if (day && !entry.byDay.includes(day)) {
                entry.byDay.push(day);
              }
            }
          });
        });
      }
      dayIndex += span;
    });
  });

  return Array.from(byTag.values());
}
