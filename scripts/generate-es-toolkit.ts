// scripts/generate-es-toolkit.ts
import { createRequire } from "module";
import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";

const require = createRequire(import.meta.url);

// === 配置区 ===
const OUTPUT_DIR = resolve(process.cwd(), "src/toolkit");
const MODULES = [
  { name: "array", path: "es-toolkit/array" },
  { name: "object", path: "es-toolkit/object" },
  { name: "function", path: "es-toolkit/function" },
  { name: "math", path: "es-toolkit/math" },
  { name: "object", path: "es-toolkit/object" },
  { name: "predicate", path: "es-toolkit/predicate" },
  { name: "promise", path: "es-toolkit/promise" },
  { name: "promise", path: "es-toolkit/promise" },
  { name: "string", path: "es-toolkit/string" },
  { name: "util", path: "es-toolkit/util" },
  { name: "error", path: "es-toolkit/error" },
  { name: "compat", path: "es-toolkit/compat" },
  // 可按需添加：{ name: 'string', path: 'es-toolkit/string' }, ...
];

// 按模块指定要排除的函数
const EXCLUDED_BY_MODULE: Record<string, Set<string>> = {
  array: new Set(["compact"]), // ← 在这里自定义排除项
  object: new Set(), // 例如：new Set(['someUnsafeFn'])
  function: new Set(),
};

// === 脚本逻辑 ===
mkdirSync(OUTPUT_DIR, { recursive: true });

const allReExports: string[] = [];

for (const { name, path } of MODULES) {
  try {
    const exports = Object.keys(require(path));
    const excluded = EXCLUDED_BY_MODULE[name] || new Set<string>();
    const filtered = exports.filter((k) => !excluded.has(k)).sort();

    if (filtered.length === 0) {
      console.warn(`⚠️  No exports left for module "${name}" after exclusion.`);
      continue;
    }

    const content = `export {\n  ${filtered.join(",\n  ")}\n} from '${path}';\n`;
    const outputPath = resolve(OUTPUT_DIR, `${name}.ts`);
    writeFileSync(outputPath, content, "utf8");

    // 用于统一入口
    allReExports.push(`export * from './${name}';`);

    console.log(`✅ ${name}: ${filtered.length} exports (excluded: ${Array.from(excluded)})`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`❌ Failed to process module "${name}":`, message);
  }
}

// 生成统一入口（可选）
const indexContent = `${allReExports.join("\n")}\n`;
writeFileSync(resolve(OUTPUT_DIR, "index.ts"), indexContent, "utf8");
console.log(`📄 Unified entry written to ${OUTPUT_DIR}/index.ts`);
console.log(`✨ Done! Use: import { chunk, groupBy } from '@/utils/toolkit';`);
