// Valida src/data/timeline.json antes do build.
// Uso: npm run validate
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { TimelineSchema } from "../src/lib/schema";

const arquivo = fileURLToPath(new URL("../src/data/timeline.json", import.meta.url));
const erros: string[] = [];
const avisos: string[] = [];

let json: unknown;
try {
  json = JSON.parse(readFileSync(arquivo, "utf8"));
} catch (e) {
  console.error(`\n✖ timeline.json não é um JSON válido:\n  ${(e as Error).message}\n`);
  console.error("  Dica: confira vírgulas sobrando/faltando e aspas.\n");
  process.exit(1);
}

const r = TimelineSchema.safeParse(json);
if (!r.success) {
  const eventos = (json as { eventos?: { id?: string }[] }).eventos ?? [];
  for (const issue of r.error.issues) {
    const [raiz, idx, ...resto] = issue.path;
    const onde =
      raiz === "eventos" && typeof idx === "number"
        ? `evento #${idx + 1} (${eventos[idx]?.id ?? "sem id"})${resto.length ? " → " + resto.join(".") : ""}`
        : issue.path.join(".") || "(raiz)";
    erros.push(`${onde}: ${issue.message}`);
  }
} else {
  const { meta, eventos } = r.data;
  const ids = new Set<string>();
  for (const e of eventos) {
    if (ids.has(e.id)) erros.push(`id repetido: ${e.id}`);
    ids.add(e.id);
    if (e.data < meta.inicio || e.data > meta.fim)
      erros.push(`${e.id}: data ${e.data} fora do período ${meta.inicio} a ${meta.fim}`);
    const frases = e.resumo.split(/(?<=[.!?])\s+/).filter(Boolean).length;
    if (frases > 2) avisos.push(`${e.id}: resumo tem ${frases} frases (o ideal é até 2)`);
    if (e.categoria === "frase" && !e.autor) avisos.push(`${e.id}: frase sem "autor"`);
  }
  const pendentes = eventos.filter((e) => !e.verificado).length;
  console.log(
    `✔ timeline.json válido — ${eventos.length} eventos, ${eventos.filter((e) => e.destaque).length} destaques, ${pendentes} a confirmar.`,
  );
  if (pendentes) console.log(`  (o site público só mostra os ${eventos.length - pendentes} verificados)`);
}

for (const a of avisos) console.warn(`  ⚠ ${a}`);
if (erros.length) {
  console.error(`\n✖ ${erros.length} erro(s) no timeline.json:\n`);
  for (const e of erros) console.error(`  • ${e}`);
  console.error("");
  process.exit(1);
}
