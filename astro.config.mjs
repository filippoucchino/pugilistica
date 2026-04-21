import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.pugilisticabrianza.it",
  output: "static",
  // Le pagine del progetto usano URL con trailing slash (es. /pugilato/).
  // "always" forza la coerenza: eventuali link senza slash finale vengono normalizzati.
  trailingSlash: "always",
  integrations: [
    tailwind({
      configFile: "./tailwind.config.ts",
    }),
    // Escludi la 404 dalla sitemap (è una utility page, non un contenuto indicizzabile).
    sitemap({
      filter: (page) => !page.includes("/404"),
    }),
  ],
});
