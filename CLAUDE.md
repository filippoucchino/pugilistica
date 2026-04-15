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

## Gestione video (sezione "Che cos'è il [corso]?")

Ogni pagina corso (pugilato, hyrox, pb-hiit, ecc.) può mostrare un video verticale
accanto al `DefinitionGrid`. Il componente supporta una prop `video` opzionale: se
presente, il layout diventa 2 colonne su `lg+` (contenuto a sinistra, video a destra)
e su mobile il video appare sopra le card. Se la prop manca, il componente si comporta
come prima (una sola colonna).

### Formato video richiesto

- **Orientamento**: verticale 9:16 (es. 720×1280). Il box ha `aspect-[9/16]` fisso;
  video orizzontali risulterebbero deformati o con bande nere.
- **Durata**: breve (15–30 s tipicamente, il contenuto è un "teaser" del corso).
- **Audio**: opzionale. Se il video è muto, nel comando di conversione webm
  sostituisci `-c:a libopus -b:a 96k` con `-an` (stessa cosa per il pass 1).

### Naming e posizione dei file

Tutti i file video vivono in `public/videos/`. Convenzione di naming:

```
public/videos/
├── corso-<nomecorso>-pugilistica-brianza-barlassina.mp4   ← sorgente originale
├── corso-<nomecorso>-pugilistica-brianza-barlassina.webm  ← generato via ffmpeg
└── corso-<nomecorso>-pugilistica-brianza-barlassina.jpg   ← poster generato via ffmpeg
```

Esempio per Hyrox: `corso-hyrox-pugilistica-brianza-barlassina.mp4`.

### Come aggiungere un nuovo video a una pagina corso

1. Metti il file `.mp4` sorgente in `public/videos/` rispettando la convenzione di naming.
2. Genera `.webm` e poster `.jpg` con i due comandi ffmpeg qui sotto.
3. Nella pagina `.astro` del corso, passa la prop `video` al componente `DefinitionGrid`:

   ```astro
   <DefinitionGrid
     introText="..."
     items={definitionItems}
     video={{
       mp4: "/videos/corso-<nomecorso>-pugilistica-brianza-barlassina.mp4",
       webm: "/videos/corso-<nomecorso>-pugilistica-brianza-barlassina.webm",
       poster: "/videos/corso-<nomecorso>-pugilistica-brianza-barlassina.jpg",
       title: "Allenamento di <descrizione> alla Pugilistica Brianza di Barlassina",
     }}
   />
   ```

4. Lancia `npm run build` per verificare che compili senza errori.

### Comandi ffmpeg

ffmpeg è installato via `winget install Gyan.FFmpeg` (v8.1). Il PATH di sistema è aggiornato: in nuove sessioni di terminale il comando `ffmpeg` è disponibile direttamente. Se una sessione bash già aperta non lo trova, chiudila e riaprila, oppure usa il percorso assoluto:
`/c/Users/filip/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1-full_build/bin/ffmpeg.exe`.

**1) Estrarre il poster (frame al secondo 2):**

```bash
ffmpeg -y -ss 00:00:02 -i public/videos/corso-<nomecorso>-pugilistica-brianza-barlassina.mp4 \
  -frames:v 1 -update 1 -q:v 2 \
  public/videos/corso-<nomecorso>-pugilistica-brianza-barlassina.jpg
```

- `-ss 00:00:02` → seek al secondo 2 (cambia se quel frame non è rappresentativo).
- `-frames:v 1 -update 1` → salva un singolo frame (ffmpeg 8+ richiede `-update 1`).
- `-q:v 2` → qualità JPEG alta (scala 2–31, più basso = migliore).

**2) Convertire mp4 → webm (VP9 CRF 33, 2-pass + Opus 96k):**

Il 2-pass dà un file più piccolo a parità di qualità. Due comandi in sequenza:

```bash
ffmpeg -y -i public/videos/corso-<nomecorso>-pugilistica-brianza-barlassina.mp4 \
  -c:v libvpx-vp9 -b:v 0 -crf 33 -pass 1 -an -f null /dev/null && \
ffmpeg -y -i public/videos/corso-<nomecorso>-pugilistica-brianza-barlassina.mp4 \
  -c:v libvpx-vp9 -b:v 0 -crf 33 -pass 2 -c:a libopus -b:a 96k \
  public/videos/corso-<nomecorso>-pugilistica-brianza-barlassina.webm
```

- `libvpx-vp9` + `-crf 33` + `-b:v 0` → VP9 in modalità qualità costante (sweet
  spot per il web; più basso il CRF, migliore la qualità ma file più grande).
- `libopus -b:a 96k` → audio Opus 96 kbps. Se il video è muto, sostituisci con `-an`.
- Il pass 1 scrive un file di log `ffmpeg2pass-0.log` nella directory corrente:
  **eliminalo dopo il pass 2** (`rm ffmpeg2pass-0.log`) per non sporcare il repo.
- Se lanci il comando da `cmd.exe` invece che da bash, sostituisci `/dev/null` con `NUL`.

## Brand assets (logo + favicon)

I file sorgente del logo e della favicon vivono in `public/brand/source/`
(versione "originale", non toccata). Da lì vengono generate tutte le varianti
servite al browser. Convenzione: **mai** linkare i file in `source/` dal sito —
sono solo materiale di partenza.

### Sorgenti
- `public/brand/source/PB_logo.png` — logo badge orizzontale (500×318, PNG con alpha)
- `public/brand/source/favicon.png` — pugile tricolore quadrato (500×500, PNG con alpha)

### Varianti generate

**Dal logo (`PB_logo.png`):**
- `public/brand/logo.png` — copia di lavoro usata in Header e Footer
- `public/brand/og-image.jpg` — 1200×630 per anteprime social (logo centrato su sfondo `#0a0a0a`)

**Dalla favicon (`favicon.png`):**
- `public/favicon-16.png` (16×16) e `public/favicon-32.png` (32×32) — favicon scheda browser
- `public/apple-touch-icon.png` (180×180) — home screen iOS
- `public/icon-192.png` (192×192) e `public/icon-512.png` (512×512) — PWA / Android
- `public/site.webmanifest` — manifest PWA (theme `#c41e1e`, background `#0a0a0a`)

Tutti i link sono già configurati in `src/layouts/BaseLayout.astro` (favicon set
completo, `apple-touch-icon`, `manifest`, `theme-color`, `og:image`, Twitter Card).

### Come rigenerare le varianti dopo aver cambiato un sorgente

Sostituisci il file in `public/brand/source/` mantenendo lo stesso nome, poi
lancia i comandi ffmpeg qui sotto.

**Favicon (tutte le dimensioni):**

```bash
ffmpeg -y -i public/brand/source/favicon.png -vf "scale=16:16:flags=lanczos" -frames:v 1 -update 1 public/favicon-16.png
ffmpeg -y -i public/brand/source/favicon.png -vf "scale=32:32:flags=lanczos" -frames:v 1 -update 1 public/favicon-32.png
ffmpeg -y -i public/brand/source/favicon.png -vf "scale=180:180:flags=lanczos" -frames:v 1 -update 1 public/apple-touch-icon.png
ffmpeg -y -i public/brand/source/favicon.png -vf "scale=192:192:flags=lanczos" -frames:v 1 -update 1 public/icon-192.png
ffmpeg -y -i public/brand/source/favicon.png -vf "scale=512:512:flags=lanczos" -frames:v 1 -update 1 public/icon-512.png
```

**Logo + OG image:**

```bash
ffmpeg -y -i public/brand/source/PB_logo.png -vf "scale=500:-1" -frames:v 1 -update 1 public/brand/logo.png
ffmpeg -y -f lavfi -i "color=c=0x0a0a0a:s=1200x630:d=1" -i public/brand/source/PB_logo.png \
  -filter_complex "[1]scale=800:-1[lg];[0][lg]overlay=(W-w)/2:(H-h)/2" \
  -frames:v 1 -update 1 -q:v 3 public/brand/og-image.jpg
```

Note pratiche:
- Se cambi il colore di sfondo dell'OG image, modifica `c=0x0a0a0a` (esadecimale senza `#`).
- I tag `<img>` in `Header.astro` e `Footer.astro` hanno `width="500" height="318"` espliciti per evitare layout shift: se cambi le proporzioni del logo sorgente, aggiorna anche questi due attributi.
- **`favicon.ico` non viene generato**: ffmpeg non lo supporta nativamente e i browser moderni accettano i PNG. Se in futuro serve supporto IE/legacy, va aggiunto con ImageMagick.

## Form di contatto (Web3Forms)

Il form su `/contatti/` è gestito via [Web3Forms](https://web3forms.com): POST a
`api.web3forms.com/submit`, Web3Forms inoltra l'email al destinatario configurato
sul loro account. Niente backend, sito resta statico.

- L'`access_key` è hard-coded nel sorgente di `src/pages/contatti.astro` ed è
  **pubblica per design** (identifica l'account, non è una password). Se inizia
  ad arrivare spam, si ruota dalla dashboard Web3Forms.
- **Honeypot**: campo `botcheck` nascosto — se un bot lo compila, Web3Forms scarta.
- L'invio è gestito da uno `<script is:inline>` in fondo alla pagina che intercetta
  il submit, manda via `fetch` e mostra successo/errore **inline** (niente redirect,
  niente `alert`). Selettori: `#contact-form`, `#contact-submit`, `#contact-success`, `#contact-error`.
- Piano free Web3Forms: 250 invii/mese.

### Attributi del tag `<video>` (già gestiti dal componente)

Il componente `DefinitionGrid` genera il tag con questi attributi, già commentati
nel sorgente — non serve rifarlo manualmente:

- `preload="none"` → nessun download automatico, parte solo al play (risparmio banda).
- `controls` + `playsinline` → controlli nativi, play inline su iOS.
- `poster` → immagine di anteprima.
- Due `<source>` in ordine: prima `.webm` (se passato), poi `.mp4` come fallback universale.
- Testo di fallback con link di download dentro `<video>` per browser antichi.

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
Ultimo aggiornamento: 2026-04-15

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
- Video verticale aggiunto alla pagina `/pugilato/` nella sezione "Che cos'è il Pugilato?":
  `DefinitionGrid.astro` esteso con prop `video` opzionale (layout 2 colonne su lg+, stack con video sopra su mobile);
  asset in `public/videos/` (mp4 sorgente + webm VP9 CRF 33 + poster jpg estratto al secondo 2);
  `ffmpeg` installato via `winget install Gyan.FFmpeg` v8.1
- Video verticale aggiunto alla pagina `/hyrox/` nella sezione "Che cos'è Hyrox?":
  asset in `public/videos/` (mp4 + webm VP9 CRF 33 + poster jpg estratto a 00:01:08)
- Video verticale aggiunto alla pagina `/pb-hiit/` nella sezione "Che cos'è PB Hiit?":
  asset in `public/videos/` (mp4 + webm VP9 CRF 33 + poster jpg estratto al secondo 2);
  tutte e tre le pagine corso (pugilato, hyrox, pb-hiit) ora hanno il loro video verticale
- Pagina `/contatti/` rivista: rimossa l'email a vista, aggiunto form di contatto via
  Web3Forms (con honeypot, gestione successo/errore inline) e nuova sezione dedicata
  "Seguici sui social" sotto la mappa con due card grandi cliccabili
- Numero di telefono reale impostato in `src/data/shared.ts` (`siteInfo.phone` + nuovo
  `siteInfo.phoneHref`), coincide con il WhatsApp del coach
- URL social reali (Facebook + Instagram) salvati in `siteInfo.social`; nuovo componente
  `SocialLinks.astro` come unico posto dove vivono gli SVG di IG/FB (prop `size`/`label`/`align`)
- Footer ridisegnato: logo grande, icone social sotto il brand, bottom bar con solo copyright
- Brand assets integrati: logo badge nell'Header e Footer (sostituisce il testo), favicon
  pugile tricolore, set completo (16/32/180/192/512), `site.webmanifest`, `og-image.jpg`
  1200×630 per anteprime social, `theme-color` e Twitter Card in `BaseLayout`
- JSON-LD `SportsActivityLocation` della home arricchito con `logo`, `image`, `telephone`, `sameAs`

### In corso
- Nessuna attività in corso

### Prossimo step
- Sostituire i placeholder con asset reali: foto coach, gallery palestra, mappa Google embed
- Scegliere hosting e configurare il deploy automatico da GitHub (Vercel, Netlify o GitHub Pages + Action)
- Valutare blocco indicizzazione (`robots.txt` + meta `noindex` in `BaseLayout`) finché il sito non è pronto per il pubblico
- Verificare la leggibilità del favicon a 16×16 (il pugile ha molti dettagli): se non si distingue,
  valutare una versione semplificata o un monogramma "PB" per le dimensioni piccole
