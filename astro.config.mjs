import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://pugilisticabrianza.it",
  integrations: [
    tailwind({
      configFile: "./tailwind.config.ts",
    }),
  ],
});
