/**
 * Builder centralizzati per i dati strutturati Schema.org (JSON-LD).
 *
 * Ogni funzione restituisce un singolo nodo (senza @context).
 * buildPageSchema() li raccoglie in un @graph con @context unico.
 *
 * Importa nelle pagine:
 *   import { buildPageSchema, buildGym, buildBreadcrumb, ... } from "@/data/schema";
 */

import { siteInfo, reviews, reviewAggregation } from "./shared";
import { buildEvents, type ActivityTag } from "./scheduleData";

// ─── Costanti @id ──────────────────────────────────────────────────────────────

const SITE_URL = siteInfo.url; // https://www.pugilisticabrianza.it

export const GYM_ID = `${SITE_URL}/#gym`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const FREE_TRIAL_ID = `${SITE_URL}/#free-trial`;

// ─── Interfacce ────────────────────────────────────────────────────────────────

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export interface CoachRef {
  name: string;
  slug: string;
}

export interface VideoSchemaOpts {
  name: string;
  description: string;
  mp4Path: string;
  posterPath: string;
  uploadDate: string;
}

export interface CourseSchemaOpts {
  name: string;
  slug: string;
  description: string;
  /** Prezzo mensile in EUR (solo cifre, es. "50") */
  price: string;
  coaches: CoachRef[];
  video?: VideoSchemaOpts;
  /** Tag delle attività per generare il courseSchedule nel CourseInstance */
  scheduleTags?: ActivityTag[];
}

export interface PersonSchemaOpts {
  name: string;
  slug: string;
  role: string;
  description: string;
  credentials: string[];
}

export interface ServiceSchemaOpts {
  name: string;
  slug: string;
  description: string;
  coaches: CoachRef[];
}

// ─── Builder functions ─────────────────────────────────────────────────────────

/** SportsActivityLocation completo — da usare su homepage, contatti, orari */
export function buildGym(): Record<string, unknown> {
  return {
    "@type": "SportsActivityLocation",
    "@id": GYM_ID,
    name: siteInfo.name,
    url: SITE_URL,
    telephone: siteInfo.phone,
    email: siteInfo.email,
    logo: `${SITE_URL}/brand/logo.png`,
    image: `${SITE_URL}/brand/og-image.jpg`,
    foundingDate: "2016-01-09",
    currenciesAccepted: "EUR",
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteInfo.address,
      addressLocality: siteInfo.city,
      postalCode: siteInfo.cap,
      addressRegion: siteInfo.province,
      addressCountry: "IT",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 45.65292782389744,
      longitude: 9.118172383931599,
    },
    hasMap: siteInfo.mapExternalUrl,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "11:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "12:30",
        closes: "13:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "17:00",
        closes: "21:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "12:00",
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteInfo.phone,
      email: siteInfo.email,
      contactType: "customer service",
      availableLanguage: "Italian",
    },
    sameAs: [siteInfo.social.facebook, siteInfo.social.instagram, siteInfo.social.youtube],
    areaServed: [
      "Barlassina",
      "Seveso",
      "Lissone",
      "Seregno",
      "Desio",
      "Muggiò",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: reviewAggregation.ratingValue,
      bestRating: 5,
      worstRating: 1,
      reviewCount: reviewAggregation.reviewCount,
    },
    review: reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: r.text,
    })),
  };
}

/**
 * Riferimento identificativo alla palestra (per pagine che non la ridefiniscono
 * e per proprietà come provider, publisher, offeredBy, location, worksFor).
 * Google non risolve gli @id cross-page nella validazione, quindi includiamo
 * i campi che Rich Results Test segnala come "missing optional" per Local Business:
 * telephone, priceRange, address, image. Le recensioni e gli orari di apertura
 * restano solo nel nodo completo di buildGym() (home/contatti/orari).
 */
export function buildGymRef(): Record<string, unknown> {
  return {
    "@type": "SportsActivityLocation",
    "@id": GYM_ID,
    name: siteInfo.name,
    url: SITE_URL,
    telephone: siteInfo.phone,
    priceRange: "€€",
    image: `${SITE_URL}/brand/og-image.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteInfo.address,
      addressLocality: siteInfo.city,
      postalCode: siteInfo.cap,
      addressRegion: siteInfo.province,
      addressCountry: "IT",
    },
  };
}

/** WebSite — solo per homepage */
export function buildWebSite(): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteInfo.shortName,
    url: SITE_URL,
    description:
      "Palestra di pugilato a Barlassina in Brianza. Corsi di pugilato, Hyrox e PB Hiit.",
    publisher: buildGymRef(),
    inLanguage: "it-IT",
  };
}

/**
 * WebPage (o sottotipo) per qualsiasi pagina.
 * @param path   Pathname con slash (es. "/" o "/pugilato/")
 * @param name   Titolo della pagina
 * @param description  Meta description
 * @param type   Sottotipo WebPage (default "WebPage"); "AboutPage", "ContactPage", "FAQPage", ecc.
 */
export function buildWebPage(
  path: string,
  name: string,
  description: string,
  type: string = "WebPage",
): Record<string, unknown> {
  const url = `${SITE_URL}${path}`;
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "it-IT",
  };
}

/**
 * BreadcrumbList — accetta gli item dopo "Home" (Home è aggiunto automaticamente).
 * @param items  Array di {name, href} — href relativo con slash (es. "/pugilato/")
 */
export function buildBreadcrumb(items: BreadcrumbItem[]): Record<string, unknown> {
  const allItems: BreadcrumbItem[] = [{ name: "Home", href: "/" }, ...items];
  const lastHref = allItems[allItems.length - 1]?.href ?? "/";
  return {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}${lastHref}#breadcrumb`,
    itemListElement: allItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

/** FAQPage con Question/Answer */
export function buildFaqPage(
  items: FaqItem[],
  pageSlug: string,
): Record<string, unknown> {
  const path = pageSlug ? `/${pageSlug}/` : "/";
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}${path}#faqpage`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** Course per pagine corso (pugilato, hyrox, pb-hiit) */
export function buildCourse(opts: CourseSchemaOpts): Record<string, unknown> {
  const url = `${SITE_URL}/${opts.slug}/`;
  const node: Record<string, unknown> = {
    "@type": "Course",
    "@id": `${url}#course`,
    name: opts.name,
    description: opts.description,
    url,
    provider: buildGymRef(),
    inLanguage: "it-IT",
    offers: [
      {
        "@type": "Offer",
        category: "Paid",
        price: opts.price,
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: opts.price,
          priceCurrency: "EUR",
          unitCode: "MON",
          referenceQuantity: {
            "@type": "QuantitativeValue",
            value: 1,
            unitCode: "MON",
          },
        },
      },
      {
        "@type": "Offer",
        category: "Free",
        name: "Prova gratuita",
        price: "0",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        description: "Prima lezione gratuita e senza impegno",
      },
    ],
  };

  // CourseInstance: instructor + courseSchedule (orari ricorrenti dal calendario)
  const hasCoaches = opts.coaches.length > 0;
  const hasTags = opts.scheduleTags && opts.scheduleTags.length > 0;

  if (hasCoaches || hasTags) {
    const instance: Record<string, unknown> = {
      "@type": "CourseInstance",
      courseMode: "https://schema.org/OnSite",
    };

    if (hasCoaches) {
      instance.instructor = opts.coaches.map((c) => ({
        "@type": "Person",
        "@id": `${SITE_URL}/#person-${c.slug}`,
        name: c.name,
      }));
    }

    if (hasTags) {
      const currentYear = new Date().getFullYear();
      const allEvents = buildEvents();
      const relevant = allEvents.filter((evt) =>
        opts.scheduleTags!.includes(evt.tag),
      );
      // Ogni entry (fascia oraria + giorni) diventa un oggetto Schedule
      const schedules = relevant.flatMap((evt) =>
        evt.entries.map((entry) => ({
          "@type": "Schedule",
          repeatFrequency: "P1W",
          repeatCount: 52,
          byDay: entry.byDay.map((d) => `https://schema.org/${d}`),
          startTime: entry.start,
          endTime: entry.end,
          startDate: `${currentYear}-01-01`,
          endDate: `${currentYear}-12-31`,
          scheduleTimezone: "Europe/Rome",
        })),
      );
      if (schedules.length > 0) {
        instance.courseSchedule = schedules;
      }
    }

    node.hasCourseInstance = instance;
  }

  return node;
}

/** VideoObject per video nelle pagine corso */
export function buildVideo(
  opts: VideoSchemaOpts,
  pageSlug: string,
): Record<string, unknown> {
  return {
    "@type": "VideoObject",
    "@id": `${SITE_URL}/${pageSlug}/#video`,
    name: opts.name,
    description: opts.description,
    contentUrl: `${SITE_URL}${opts.mp4Path}`,
    thumbnailUrl: `${SITE_URL}${opts.posterPath}`,
    uploadDate: opts.uploadDate,
    encodingFormat: "video/mp4",
  };
}

/** Service per lezioni private */
export function buildService(opts: ServiceSchemaOpts): Record<string, unknown> {
  const url = `${SITE_URL}/${opts.slug}/`;
  const node: Record<string, unknown> = {
    "@type": "Service",
    "@id": `${url}#service`,
    name: opts.name,
    description: opts.description,
    url,
    serviceType: "Lezioni private di pugilato",
    provider: buildGymRef(),
    areaServed: {
      "@type": "City",
      name: "Barlassina",
    },
  };

  if (opts.coaches.length > 0) {
    node.broker = opts.coaches.map((c) => ({
      "@type": "Person",
      "@id": `${SITE_URL}/#person-${c.slug}`,
      name: c.name,
    }));
  }

  return node;
}

/** Person per team members */
export function buildPerson(opts: PersonSchemaOpts): Record<string, unknown> {
  const node: Record<string, unknown> = {
    "@type": "Person",
    "@id": `${SITE_URL}/#person-${opts.slug}`,
    name: opts.name,
    jobTitle: opts.role,
    description: opts.description,
    worksFor: buildGymRef(),
  };

  if (opts.credentials.length > 0) {
    node.hasCredential = opts.credentials.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: c,
    }));
  }

  return node;
}

/** Offer prova gratuita standalone (per homepage e prova-gratuita) */
export function buildFreeTrialOffer(): Record<string, unknown> {
  return {
    "@type": "Offer",
    "@id": FREE_TRIAL_ID,
    name: "Prova gratuita",
    description:
      "Prima lezione gratuita e senza impegno a Pugilistica Brianza",
    price: "0",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    offeredBy: buildGymRef(),
  };
}

/**
 * Genera nodi Event Schema.org con orari precisi (slot → giorni).
 * Senza filtro restituisce tutti gli eventi (per /orari/).
 * Con filtro per tag restituisce solo gli eventi rilevanti (per le pagine corso).
 *
 * Esempio: buildScheduleEvents(["boxe", "kids-boxe"]) → Event[] per pugilato
 */
export function buildScheduleEvents(
  tags?: ActivityTag[],
): Record<string, unknown>[] {
  const allEvents = buildEvents();
  const filtered = tags
    ? allEvents.filter((evt) => tags.includes(evt.tag))
    : allEvents;

  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear}-01-01`;
  const endDate = `${currentYear}-12-31`;

  return filtered.map((evt) => ({
    "@type": "Event",
    name: `${evt.name} - Pugilistica Brianza`,
    description: evt.description,
    startDate,
    endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: buildGymRef(),
    organizer: {
      "@type": "SportsOrganization",
      name: siteInfo.name,
      url: SITE_URL,
    },
    eventSchedule: evt.entries.map((entry) => ({
      "@type": "Schedule",
      repeatFrequency: "P1W",
      byDay: entry.byDay.map((d) => `https://schema.org/${d}`),
      startTime: entry.start,
      endTime: entry.end,
      startDate,
      endDate,
      scheduleTimezone: "Europe/Rome",
    })),
  }));
}

/**
 * Wrapper @graph — raccoglie tutti i nodi in un unico oggetto JSON-LD.
 * Passare i nodi come argomenti rest:
 *   buildPageSchema(buildGym(), buildWebSite(), buildBreadcrumb([...]))
 */
export function buildPageSchema(
  ...nodes: Record<string, unknown>[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
