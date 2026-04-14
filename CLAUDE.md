# pugilisticabrianza.it

Sito web statico per ASD Pugilistica Brianza, palestra di pugilato a
Barlassina (MB). Il sito presenta i corsi (pugilato, Hyrox, PB Hiit,
lezioni private), la storia della palestra e del coach, e permette
ai potenziali iscritti di prenotare una prova gratuita.

## Stack tecnologico

- **Framework**: Astro 5 (sito statico, SSG)
- **Linguaggio**: TypeScript (strict mode, estende `astro/tsconfigs/strict`)
- **Stile**: Tailwind CSS 3 via `@astrojs/tailwind` (niente CSS inline, niente file .css sparsi)
- **Tailwind config**: `tailwind.config.ts` (TypeScript)
- **Design tokens**: mappati in `tailwind.config.ts` (colori brand/surface/pb, spacing semantici, tipografia)
- **CSS globale**: `src/styles/global.css` definisce le classi custom riutilizzabili (`pb-container`, `pb-section`, `pb-btn-primary`, ecc.)
- **Font**: Bebas Neue (display) + Barlow (body) — caricati da Google Fonts in `global.css`
- **Dati**: `src/data/shared.ts` come single source of truth (info sede, orari, nav links, zone servite, trust items)
- **CMS**: nessuno (contenuti statici nelle pagine e in `shared.ts`)
- **Hosting**: non ancora configurato
- **Package manager**: npm

## Struttura cartelle

```
pugilistica/
├── public/
│   └── favicon.svg                    ← asset statici serviti direttamente
├── src/
│   ├── components/                    ← 22 componenti .astro riutilizzabili
│   │   ├── Header.astro               ← navbar fixed + menu mobile
│   │   ├── Footer.astro               ← footer 4 colonne
│   │   ├── Hero.astro                 ← hero sezione con topline + watermark
│   │   ├── SectionHeading.astro       ← titolo sezione standard
│   │   ├── ServiceCard.astro          ← card corso (home)
│   │   ├── CoachBlock.astro           ← card coach
│   │   ├── FaqAccordion.astro         ← accordion FAQ con JSON-LD
│   │   ├── TrustBar.astro             ← barra affidabilità sotto hero
│   │   ├── LocalSection.astro         ← info sede + mappa
│   │   ├── PricingCard.astro          ← box abbonamento
│   │   ├── ReviewCard.astro           ← recensione Google
│   │   ├── FormField.astro            ← input / select / textarea
│   │   └── ...                        ← e altri componenti di supporto
│   ├── data/
│   │   └── shared.ts                  ← dati condivisi (siteInfo, trustItems, zones, hours, navLinks, ecc.)
│   ├── layouts/
│   │   └── BaseLayout.astro           ← layout unico: head, SEO, Header, slot, Footer, scroll reveal
│   ├── pages/                         ← 9 pagine, una per URL
│   │   ├── index.astro
│   │   ├── pugilato.astro
│   │   ├── hyrox.astro
│   │   ├── pb-hiit.astro
│   │   ├── lezioni-private-pugilato.astro
│   │   ├── chi-siamo.astro
│   │   ├── faq.astro
│   │   ├── contatti.astro
│   │   └── prova-gratuita.astro
│   └── styles/
│       └── global.css                 ← Tailwind directives + classi custom pb-*
├── astro.config.mjs
├── tailwind.config.ts
├── tsconfig.json                      ← path alias @/* → src/*
├── package.json
└── .gitignore
```

## Pagine del sito

- `/` — Home (hero, servizi, segmenti, coach, recensioni, gallery, FAQ)
- `/pugilato/` — Corso pugilato (principale)
- `/hyrox/` — Corso Hyrox
- `/pb-hiit/` — Corso PB Hiit
- `/lezioni-private-pugilato/` — Lezioni private 1:1
- `/chi-siamo/` — Storia, filosofia, coach
- `/faq/` — Domande frequenti (3 gruppi: generali, pratiche, corsi)
- `/contatti/` — Contatti, mappa, orari
- `/prova-gratuita/` — Landing con form di prenotazione

## Convenzioni

- **Componenti**: PascalCase (es. `HeroSection.astro`)
- **Pagine**: lowercase con trattini (es. `chi-siamo.astro`)
- **Variabili e funzioni**: camelCase (es. `trustItems`)
- **Niente `any`** in TypeScript
- **Tailwind per tutto lo stile**, mai `style=""` inline (eccezione: SVG stroke-width e simili attributi nativi SVG)
- **Commenti in italiano**
- **Path alias**: usa `@/data/shared` invece di path relativi lunghi (alias `@/*` → `src/*` già configurato in `tsconfig.json`)
- **Single source of truth**: dati condivisi (sede, orari, nav) vivono **solo** in `src/data/shared.ts` — non ridichiarare inline nelle pagine
- **Classi custom**: le classi `pb-*` (container, section, btn, topline, ecc.) sono definite in `src/styles/global.css` — usale al posto di ripetere catene lunghe di utility Tailwind

## Comandi

- `npm run dev` — avvia in locale su http://localhost:4321 (o prima porta libera successiva se 4321 è occupata)
- `npm run build` — `astro check && astro build`, genera il sito statico in `dist/`
- `npm run preview` — anteprima del build di produzione in locale

## Regole per Claude

- Spiega sempre cosa stai facendo e perché, in italiano semplice
- Non dare nulla per scontato: sono un principiante
- Procedi un passo alla volta
- Prima di scrivere codice, descrivi cosa intendi fare
- Commenta il codice in italiano quando il "perché" non è ovvio
- Suggerisci sempre la soluzione più semplice per un principiante
- Non rimuovere codice esistente senza spiegare perché
- Se qualcosa potrebbe causare problemi, avvisami prima
- Prima di fare azioni che modificano il repo remoto (push, PR, rename branch condivisi), chiedi conferma
- Se trovi duplicazione di dati già presenti in `src/data/shared.ts`, proponi il refactor invece di perpetuarla

## Stato attuale
Ultimo aggiornamento: 2026-04-14

### Completato
- Setup iniziale progetto Astro 5 + TypeScript (strict) + Tailwind 3
- Design system completo in `tailwind.config.ts` (colori brand/surface/pb, tipografia Bebas Neue/Barlow, spacing semantici, grid templates custom)
- `src/styles/global.css` con classi riutilizzabili `pb-*` (container, section, btn, topline, divider, hero-glow, hero-watermark, fade-up)
- 22 componenti riutilizzabili in `src/components/`
- Layout unico `BaseLayout.astro` con SEO meta, Open Graph, canonical, slot per JSON-LD, IntersectionObserver per scroll reveal
- 9 pagine create e funzionanti, con JSON-LD `FAQPage` sui FAQ e `SportsActivityLocation` sulla home
- `src/data/shared.ts` come single source of truth (siteInfo, trustItems, localDetails, zones, navLinks, courseLinks, infoLinks, hours)
- Header e Footer collegati a `shared.ts`, tutte le pagine deduplicate per dati comuni
- Encoding UTF-8 corretto in tutti i file (à, è, ì, ò, ù, é, €, —, →)
- `npm install` completato
- Build di produzione verificata: 0 errori, 0 warning, 9 pagine generate in `dist/`
- Repo Git inizializzato, primo commit, branch rinominato in `main`, push su https://github.com/filippoucchino/pugilistica

### In corso
- Nessuna attività in corso

### Prossimo step
- Sostituire i placeholder con asset reali: foto coach, gallery palestra, mappa Google embed, favicon definitiva
- Aggiornare i dati segnaposto in `src/data/shared.ts`: numero di telefono (`+39 XXX XXX XXXX`), link social Facebook/Instagram
- Collegare il form di `/prova-gratuita/` a un backend o servizio (Formspree, Netlify Forms, Web3Forms, ecc.)
- Aggiungere immagini Open Graph (`og:image`) per ogni pagina
- Scegliere hosting e configurare il deploy automatico da GitHub (Vercel, Netlify o GitHub Pages + Action)
- Valutare blocco indicizzazione (`robots.txt` + meta `noindex` in `BaseLayout`) finché il sito non è pronto per il pubblico
