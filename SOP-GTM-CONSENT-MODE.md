# SOP — Google Tag Manager + Consent Mode v2 con cookie banner custom

Procedura operativa per integrare GTM in un sito **statico** con cookie banner
sviluppato in casa (senza plugin CMP), implementando Google Consent Mode v2 in
modo conforme al GDPR.

Questa SOP raccoglie le decisioni e i dettagli tecnici che hanno richiesto
debugging in sede di prima implementazione su `pugilisticabrianza.it`. Per i
prossimi siti, seguire questi passaggi evita di rifare gli stessi errori.

---

## Quando applicare questa SOP

- Sito statico (Astro, 11ty, Next static export, plain HTML, ecc.)
- Hai un cookie banner custom (no Cookiebot/Iubenda/Complianz)
- Vuoi integrare GA4 e/o Microsoft Clarity (e in futuro Meta Pixel, Hotjar, ecc.)
- Vuoi compliance GDPR + visibilità completa in GTM Preview

Se invece il sito è WordPress, usa un plugin CMP (Cookiebot o Complianz) — fa
tutto questo già pronto.

---

## Decisione di base: usa Consent Mode v2, non "load-on-consent"

Esistono due strategie per gating di GTM:

| Strategia | Funzionamento | Pro | Contro |
|-----------|---------------|-----|--------|
| **Load-on-consent** | GTM non si carica finché l'utente non clicca "Accetta" | Massima privacy, codice semplice | GTM Preview vuoto, no Google Ads modeling, incoerente coi siti WP |
| **Consent Mode v2** ✓ | GTM si carica sempre ma con consenso "denied" di default; tag firano solo quando il consenso passa a "granted" | Standard moderno, GTM Preview funziona, modeling per Google Ads | GTM si scarica anche per chi rifiuta (~30 KB) |

**Scegli sempre Consent Mode v2.** È la scelta corretta in tutti gli scenari
moderni. La compliance GDPR è garantita dal fatto che i tag (GA4, Clarity, ecc.)
**non firano** finché il consenso non è "granted".

---

## Architettura — l'ordine conta

### Nel `<head>`, esattamente in quest'ordine:

```
1. Script consent default (denied su tutto tranne functionality/security)
2. Script check localStorage + eventuale consent update  ← FIX CRITICO
3. Script bootstrap GTM
```

**L'errore più comune** è mettere il check di localStorage nel cookie banner,
che vive a fine `<body>`. In quel caso il check arriva **troppo tardi**: GTM ha
già caricato il container e fatto firare il page view trigger con stato
"denied", oltre la finestra `wait_for_update: 500`. I tag non firano e l'utente
di ritorno **non viene tracciato sul primo pageview**.

Il check di localStorage **deve stare nel `<head>`**, subito dopo il consent
default e prima del bootstrap GTM.

### Nel `<body>`:

```
<noscript> con iframe GTM come primo elemento (fallback no-JS)
```

### Nel cookie banner:

```
Solo i click handler "Accetta" e "Rifiuta", più la rimozione del banner.
NIENTE check di localStorage al pageload (lo fa già il <head>).
```

---

## Snippet pronti al copia-incolla

### 1. Script da mettere nel `<head>`

Sostituisci `GTM-XXXXXXX` col tuo container ID. **Mantieni l'ordine**: consent
default, poi check localStorage, poi bootstrap GTM.

```html
<!-- Google Consent Mode v2 — default state (PRIMA di GTM) -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'personalization_storage': 'denied',
    'functionality_storage': 'granted',
    'security_storage': 'granted',
    'wait_for_update': 500
  });
  // Visitatori di ritorno: se avevano gia' accettato, rilascia subito il consenso
  // PRIMA che GTM si carichi, cosi' i tag firano gia' al primo pageview.
  try {
    if (localStorage.getItem('cookie_consent') === 'accepted') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'personalization_storage': 'granted'
      });
    }
  } catch (e) { /* localStorage non disponibile (modalita' privacy) */ }
</script>

<!-- Google Tag Manager bootstrap -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
```

> **Nota Astro**: se il sito usa Astro, aggiungi `is:inline` ai tag `<script>`
> sopra, altrimenti Astro li tratta come moduli e l'ordine si rompe.

### 2. Snippet `<noscript>` — primo elemento del `<body>`

```html
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
    height="0" width="0" style="display:none;visibility:hidden"
    title="Google Tag Manager"></iframe>
</noscript>
```

Con Consent Mode v2 + tag con consent gating, anche il fallback no-JS rispetta i
default "denied" perché senza JS non c'è modo di chiamare `gtag('consent',
'update', ...)`. Quindi il `<noscript>` va incluso senza problemi GDPR.

### 3. Cookie banner — click handlers

Lo script del banner gestisce solo i click. Non controllare localStorage al
pageload per chiamare `grantConsent()` — quel ramo è già gestito nel `<head>`.

```html
<script>
  function grantConsent() {
    if (typeof window.gtag !== "function") return;
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      personalization_storage: "granted",
      // Se aggiungi pubblicita' (Google Ads, Meta Pixel), aggiungi anche:
      // ad_storage: "granted",
      // ad_user_data: "granted",
      // ad_personalization: "granted",
    });
  }

  // Al pageload rimuovi il banner se l'utente ha gia' espresso una preferenza.
  // Il consent update per gli "accepted" di ritorno e' gia' stato emesso in <head>.
  (function () {
    if (localStorage.getItem("cookie_consent")) {
      var banner = document.getElementById("cookie-banner");
      if (banner) banner.remove();
    }
  })();

  document.getElementById("cookie-accept")?.addEventListener("click", function () {
    localStorage.setItem("cookie_consent", "accepted");
    var banner = document.getElementById("cookie-banner");
    if (banner) banner.remove();
    grantConsent();
  });

  document.getElementById("cookie-reject")?.addEventListener("click", function () {
    localStorage.setItem("cookie_consent", "rejected");
    var banner = document.getElementById("cookie-banner");
    if (banner) banner.remove();
    // Nessun update di consenso: i default "denied" restano in vigore.
  });
</script>
```

### 4. Content Security Policy

Se il sito ha una CSP stretta (`.htaccess`, `vercel.json`, header HTTP, ecc.),
estendila con i domini di GTM, GA4 e Clarity. Esempio per setup minimo
(GA4 + Clarity, no Google Ads):

```
script-src ... https://www.googletagmanager.com https://www.google-analytics.com https://*.clarity.ms;
connect-src ... https://www.google-analytics.com https://*.analytics.google.com https://*.google-analytics.com https://*.clarity.ms;
img-src ... https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.clarity.ms;
frame-src ... https://www.googletagmanager.com;
```

Il wildcard `*.clarity.ms` copre `c.clarity.ms`, `b.clarity.ms`,
`www.clarity.ms` senza enumerarli. `*.google-analytics.com` copre i regional
endpoint di GA4 (es. `region1.google-analytics.com`).

---

## Configurazione lato GTM (passaggio cruciale, da non saltare)

Questa parte si fa sulla dashboard `tagmanager.google.com`, non nel codice del
sito. **Senza questa configurazione, i tag firano sempre ignorando il consenso**
e il Consent Mode v2 non gating funziona.

Per ogni tag analytics/marketing (GA4, Clarity, Meta Pixel, ecc.):

1. Apri il tag dentro GTM
2. Espandi "**Configurazione avanzata**"
3. Scorri fino a "**Impostazioni di consenso**" (in fondo)
4. Sotto "**Consenso aggiuntivo richiesto**" aggiungi la categoria appropriata:
   - **GA4**: `analytics_storage`
   - **Microsoft Clarity**: `analytics_storage`
   - **Meta Pixel**: `ad_storage` + `ad_user_data`
   - **Google Ads Conversion**: `ad_storage` + `ad_user_data`
   - **Hotjar**: `analytics_storage`
5. Salva il tag
6. **Pubblica** il container (in alto a destra) — senza pubblicare, le modifiche
   non vanno live

---

## Privacy Policy — punti minimi da coprire

Aggiungi (o aggiorna) le seguenti voci nell'informativa:

1. **Sezione "Servizi di terze parti"** — una sottosezione per ciascun strumento:
   - **Google Tag Manager**: container, applica Consent Mode v2 con default "denied"
   - **Google Analytics 4**: finalità (analisi traffico), conservazione (14 mesi),
     fornitore (Google Ireland, trasferimento USA), menzione dei "cookieless pings"
   - **Microsoft Clarity**: finalità (heatmap, session replay), maschera campi
     sensibili, fornitore (Microsoft, trasferimento USA), conservazione (1 anno)

2. **Sezione "Cookie"** — distingui due blocchi:
   - **Cookie tecnici (sempre attivi)**: localStorage `cookie_consent`, eventuali
     cookie di Google Fonts/Maps
   - **Cookie di analisi (solo con consenso)**: `_ga`, `_ga_*` (GA4), `_clck`,
     `_clsk` (Clarity)

3. **Sezione "Trasferimento dati extra-UE"**: includi Google e Microsoft sotto
   EU-U.S. Data Privacy Framework

4. **Sezione "Conservazione dati"**: GA4 14 mesi, Clarity 1 anno

---

## Test di verifica (ordine consigliato)

### Test 1 — GTM Preview "Inizializzazione del consenso"

1. Apri il sito in incognito (no localStorage)
2. Apri GTM Preview con il tuo container ID
3. Naviga sulla home del sito
4. Su GTM Preview, clicca l'evento "**Inizializzazione del consenso**"
5. Tab "**Consenso**": la tabella deve essere popolata con le 7 categorie:
   - `ad_*`, `analytics_storage`, `personalization_storage`: **Negato**
   - `functionality_storage`, `security_storage`: **Concesso**

Se la tabella è vuota, lo script consent default non sta firando o non è in
ordine corretto.

### Test 2 — Tag bloccati senza consenso

1. Sempre in incognito, sulla stessa pagina
2. Clicca **"Rifiuta"** sul cookie banner (oppure non cliccare nulla)
3. GTM Preview → evento "**Contenitore caricato**" → tab "**Tag**"
4. GA4 e Clarity devono apparire in "**Tag non attivati**"

### Test 3 — Tag attivi dopo consenso (visitatore di ritorno)

1. Clicca "**Accetta**" sul banner
2. **Naviga su un'altra pagina** del sito (importante: simulando ritorno)
3. GTM Preview → evento "**Contenitore caricato**" → tab "**Tag**"
4. GA4 e Clarity devono apparire in "**Tag attivati**" con stato "**Riuscito**"

### Test 4 — Conferma su GA4 Realtime

1. Apri `analytics.google.com` → proprietà → Realtime
2. Naviga sul sito (con consenso accettato)
3. Devi vedere te stesso come visitatore attivo entro 30 secondi

### Test 5 — Persistenza consenso

1. Chiudi il browser, riapri
2. Carica la home
3. Il banner **non** deve riapparire (consenso salvato)
4. GTM Preview → "Inizializzazione del consenso" → colonna "**Aggiornamento
   nella pagina**" deve essere già popolata con `analytics_storage: Concesso`

Se la colonna "Aggiornamento nella pagina" è vuota su return visitor, significa
che il check di localStorage **non è nel `<head>`** ma in fondo al body —
torna allo Snippet 1.

---

## Errori comuni e come evitarli

| Sintomo | Causa probabile | Fix |
|---------|----------------|-----|
| Tag "Non attivati" anche dopo Accept | Check localStorage in fondo al `<body>` invece che nel `<head>` | Sposta il check nel `<head>` (Snippet 1) |
| Tag firano sempre, anche senza consenso | Manca "Built-in Consent Settings" sui tag in GTM | Configura `analytics_storage` come consenso richiesto |
| Console errori CSP `Refused to load script` | CSP non include i domini Google/Microsoft | Estendi `script-src` / `connect-src` / `img-src` / `frame-src` |
| GTM Preview "Inizializzazione del consenso" vuota | Lo script consent default non parte o parte dopo GTM | Verifica ordine: default → localStorage → bootstrap |
| GA4 Realtime non vede il pageview iniziale | Comportamento atteso per first-time accepter (vedi sotto) | Workaround opzionale con custom trigger |
| `<noscript>` GTM bypassa il consenso | Errore di interpretazione: con Consent Mode v2 + tag con consent gating, il noscript NON bypassa | Nessun fix necessario — tieni il noscript |

---

## Limitazione nota: il first-time accepter perde il primo pageview

Quando un utente atterra per la prima volta sul sito e clicca "Accetta", il
pageview di **quella prima pagina** non viene tracciato. Motivo: il tempo umano
per leggere il banner e cliccare supera quasi sempre i 500ms del
`wait_for_update`. I tag tentano di firare con stato "denied", vengono bloccati,
e non si riattivano automaticamente quando arriva il consenso.

Dalla **pagina successiva** (qualsiasi navigazione interna) tutto torna normale.

**Workaround opzionale** se vuoi recuperare anche il primo pageview:

1. In `grantConsent()`, oltre all'update emetti un custom event:
   ```js
   window.dataLayer.push({ event: 'consent_granted' });
   ```
2. In GTM, crea un trigger custom su evento `consent_granted`
3. Configura GA4 e Clarity per firare anche su questo trigger (oltre a "All Pages")

Nella maggior parte dei casi la perdita di 1 pageview/sessione è accettabile e
questo workaround non vale la complessità. Decidi caso per caso.

---

## Aggiungere altri tracker in futuro

Se in futuro aggiungi Meta Pixel, Hotjar, LinkedIn Insight Tag, ecc.:

1. **GTM**: aggiungi il tag dentro GTM e configura le "Built-in Consent
   Settings" appropriate (vedi tabella sotto)
2. **CSP**: estendi `script-src`, `connect-src`, `img-src`, `frame-src` con i
   nuovi domini
3. **`grantConsent()`** in cookie banner: aggiungi le categorie di consenso
   richieste dai nuovi tag
4. **Cookie banner text**: cita esplicitamente i nuovi strumenti (es.
   "...Google Analytics, Microsoft Clarity, Meta Pixel...")
5. **Privacy policy**: aggiungi una sottosezione per ciascun nuovo strumento +
   aggiorna sezioni cookie / extra-UE / conservazione

---

## Categorie Consent Mode v2 — riferimento rapido

| Categoria | Cosa abilita | Default consigliato | Strumenti che la richiedono |
|-----------|-------------|---------------------|----------------------------|
| `ad_storage` | Cookie pubblicitari | denied | Google Ads, Meta Pixel, LinkedIn Insight |
| `ad_user_data` | Invio user data a Google per advertising | denied | Google Ads |
| `ad_personalization` | Pubblicità personalizzata | denied | Google Ads remarketing |
| `analytics_storage` | Cookie analytics (GA4) | denied | GA4, Clarity, Hotjar |
| `personalization_storage` | Preferenze (lingua, ecc.) | denied | Funzioni di personalizzazione |
| `functionality_storage` | Funzionamento sito | granted | Cookie tecnici |
| `security_storage` | Sicurezza (auth, anti-frode) | granted | Cookie di sessione |

---

## Checklist finale prima del go-live

- [ ] Script `<head>` con consent default + localStorage check + GTM bootstrap (in quest'ordine)
- [ ] `<noscript>` GTM come primo elemento del `<body>`
- [ ] Cookie banner con click handler "Accetta" che chiama `grantConsent()`
- [ ] CSP estesa con domini necessari
- [ ] Tag GTM (GA4, Clarity, ecc.) con "Built-in Consent Settings" configurati
- [ ] Container GTM **pubblicato** (non solo salvato)
- [ ] Privacy policy aggiornata con sezioni dedicate
- [ ] Test 1-5 superati su GTM Preview
- [ ] GA4 Realtime conferma il tracking dopo consenso
- [ ] Banner cookie cita esplicitamente gli strumenti utilizzati

---

## Riferimenti utili

- Google: [Consent Mode v2 reference](https://developers.google.com/tag-platform/security/concepts/consent-mode)
- Google: [Built-in Consent Checks per i tag](https://support.google.com/tagmanager/answer/10718549)
- Microsoft: [Clarity GDPR](https://learn.microsoft.com/en-us/clarity/setup-and-installation/cookie-consent)
- Garante Privacy IT: [Linee guida cookie](https://www.garanteprivacy.it/cookie)
