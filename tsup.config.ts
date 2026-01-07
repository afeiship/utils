import { defineConfig } from "tsup";
import { globbySync } from "globby";

// Dynamic entry points: automatically discover all .ts files in src/
const entryPoints = globbySync([
  "src/index.ts",           // Main entry point
  "src/*/index.ts",         // All module index files
  "src/*/[!index]*.ts",     // All individual function files (except index.ts)
]);

export default defineConfig({
  entry: entryPoints,
  outDir: "dist",
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  // Critical for tree-shaking: disable code splitting
  splitting: false,
  sourcemap: true,
  minify: false,
  // Preserve module structure for better tree-shaking
  // Each export will remain as separate exports
  treeshake: true,
});
