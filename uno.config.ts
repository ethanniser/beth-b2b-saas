import transformerVariantGroup from "@unocss/transformer-variant-group";
import { defineConfig, presetIcons, presetWebFonts, presetWind } from "unocss";

export default defineConfig({
  cli: {
    entry: {
      patterns: ["src/**/*.{ts,tsx}"],
      outFile: "public/dist/unocss.css",
    },
  },
  presets: [presetWind(), presetIcons(), presetWebFonts()],
  transformers: [transformerVariantGroup()],
});
