import { useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { CATEGORIAS, CATEGORIA_ROTULO, type Categoria, type Evento } from "../lib/schema";
import { DIAS, agruparPorDia, marcoDoDia } from "../lib/data";
import { diaSemana, fmtCurto } from "../lib/dates";
import { EventCard } from "./EventCard";

type Filtro = Categoria | "todos";

type Linha =
  | { tipo: "dia"; data: string; indice: number; eventos: Evento[]; marco?: string }
  | { tipo: "vazio"; de: string; ate: string; qtd: number };

function montarLinhas(eventos: Evento[]): Linha[] {
  const porDia = agruparPorDia(eventos);
  const linhas: Linha[] = [];
  let vazio: string[] = [];
  const fecharVazio = () => {
    if (vazio.length) linhas.push({ tipo: "vazio", de: vazio[0], ate: vazio[vazio.length - 1], qtd: vazio.length });
    vazio = [];
  };
  DIAS.forEach((data, i) => {
    const doDia = porDia.get(data) ?? [];
    const marco = marcoDoDia(data);
    if (doDia.length || marco) {
      fecharVazio();
      linhas.push({ tipo: "dia", data, indice: i + 1, eventos: doDia, marco });
    } else {
      vazio.push(data);
    }
  });
  fecharVazio();
  return linhas;
}

function Filtros({
  eventos,
  filtro,
  setFiltro,
  soDestaques,
  setSoDestaques,
}: {
  eventos: Evento[];
  filtro: Filtro;
  setFiltro: (f: Filtro) => void;
  soDestaques: boolean;
  setSoDestaques: (v: boolean) => void;
}) {
  const contagem = useMemo(() => {
    const c = new Map<Categoria, number>();
    for (const e of eventos) c.set(e.categoria, (c.get(e.categoria) ?? 0) + 1);
    return c;
  }, [eventos]);

  const pill = (ativo: boolean) =>
    `shrink-0 rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
      ativo
        ? "border-amarelo bg-amarelo font-bold text-noite"
        : "border-linha text-nevoa hover:border-nevoa hover:text-papel disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-linha"
    }`;

  return (
    <div className="sticky top-0 z-40 -mx-4 border-b border-linha bg-noite/85 px-4 py-3 backdrop-blur-md md:-mx-8 md:px-8">
      <div className="no-scrollbar flex gap-2 overflow-x-auto" role="toolbar" aria-label="Filtrar por categoria">
        <button type="button" className={pill(filtro === "todos")} aria-pressed={filtro === "todos"} onClick={() => setFiltro("todos")}>
          Tudo <span className="tabular opacity-60">{eventos.length}</span>
        </button>
        {CATEGORIAS.map((c) => {
          const n = contagem.get(c) ?? 0;
          return (
            <button
              key={c}
              type="button"
              disabled={n === 0}
              aria-pressed={filtro === c}
              className={pill(filtro === c)}
              onClick={() => setFiltro(filtro === c ? "todos" : c)}
            >
              {CATEGORIA_ROTULO[c]} <span className="tabular opacity-60">{n}</span>
            </button>
          );
        })}
        <span className="mx-1 w-px shrink-0 bg-linha" aria-hidden />
        <button type="button" aria-pressed={soDestaques} className={pill(soDestaques)} onClick={() => setSoDestaques(!soDestaques)}>
          ★ Só destaques
        </button>
      </div>
    </div>
  );
}

function Marcador({ linha }: { linha: Extract<Linha, { tipo: "dia" }> }) {
  const temDestaque = linha.eventos.some((e) => e.destaque);
  const vazio = linha.eventos.length === 0;
  return (
    <motion.span
      aria-hidden
      className={`absolute left-5 top-1.5 z-10 -translate-x-1/2 rounded-full border-2 md:left-44 ${
        temDestaque ? "size-4" : vazio ? "size-2.5" : "size-3"
      }`}
      initial={{ backgroundColor: "#0b0b0c", borderColor: vazio ? "#2a2a2e" : "#8a8a90" }}
      whileInView={{
        backgroundColor: temDestaque || linha.marco ? "#ffd60a" : vazio ? "#2a2a2e" : "#f4f4f2",
        borderColor: temDestaque || linha.marco ? "#ffd60a" : vazio ? "#2a2a2e" : "#f4f4f2",
      }}
      viewport={{ margin: "0px 0px -50% 0px" }}
      transition={{ duration: 0.3 }}
    />
  );
}

export function Timeline({ eventos, edicao }: { eventos: Evento[]; edicao: boolean }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [soDestaques, setSoDestaques] = useState(false);
  const trilho = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trilho, offset: ["start 50%", "end 50%"] });
  const preenchimento = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  const filtrados = useMemo(
    () => eventos.filter((e) => (filtro === "todos" || e.categoria === filtro) && (!soDestaques || e.destaque)),
    [eventos, filtro, soDestaques],
  );
  const linhas = useMemo(() => montarLinhas(filtrados), [filtrados]);
  const filtrando = filtro !== "todos" || soDestaques;

  return (
    <section id="linha" aria-labelledby="titulo-linha" className="relative">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h2 id="titulo-linha" className="titulo text-[clamp(2.4rem,6vw,4.5rem)] text-papel">
          Dia a dia
        </h2>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-cinza">
          16 AGO → 25 OUT · {DIAS.length} dias
        </p>
      </div>

      <Filtros eventos={eventos} filtro={filtro} setFiltro={setFiltro} soDestaques={soDestaques} setSoDestaques={setSoDestaques} />

      <div ref={trilho} className="relative mt-10 pb-10">
        {/* trilho de fundo + preenchimento amarelo que acompanha o scroll */}
        <div aria-hidden className="absolute bottom-0 left-5 top-0 w-[3px] -translate-x-1/2 bg-linha md:left-44" />
        <motion.div
          aria-hidden
          style={{ scaleY: preenchimento }}
          className="absolute bottom-0 left-5 top-0 w-[3px] -translate-x-1/2 origin-top bg-amarelo shadow-[0_0_14px_rgba(255,214,10,0.55)] md:left-44"
        />

        {filtrados.length === 0 && (
          <p className="relative py-16 pl-12 font-mono text-sm text-cinza md:pl-56">
            {eventos.length === 0 ? "Os eventos aparecem aqui assim que forem revisados." : "Nenhum evento com esse filtro ainda."}
          </p>
        )}

        <ol className="relative space-y-10">
          {linhas.map((l) =>
            l.tipo === "vazio" ? (
              <li key={l.de} className="relative pl-12 md:grid md:grid-cols-[11rem_1fr] md:pl-0">
                <span aria-hidden className="absolute left-5 top-1.5 size-1.5 -translate-x-1/2 rounded-full bg-linha md:left-44" />
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cinza/60 md:pr-10 md:text-right">
                  {l.qtd === 1 ? fmtCurto(l.de) : `${fmtCurto(l.de)} – ${fmtCurto(l.ate)}`}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cinza/40 md:pl-10">
                  {filtrando ? "—" : l.qtd === 1 ? "sem registro" : `${l.qtd} dias sem registro`}
                </p>
              </li>
            ) : (
              <li key={l.data} className="relative pl-12 md:grid md:grid-cols-[11rem_1fr] md:pl-0">
                <Marcador linha={l} />
                <div className="mb-3 md:mb-0 md:pr-10 md:text-right">
                  <div className="md:sticky md:top-24">
                    <p className="font-mono text-2xl font-bold tabular text-papel">{fmtCurto(l.data)}</p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cinza">
                      {diaSemana(l.data)}
                      <span className="md:block">
                        <span className="md:hidden"> · </span>dia {l.indice} de {DIAS.length}
                      </span>
                    </p>
                    {l.marco && (
                      <p className="mt-2 inline-block bg-amarelo px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-noite">
                        {l.marco}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-5 md:pl-10">
                  {l.eventos.map((e) => (
                    <EventCard key={e.id} evento={e} edicao={edicao} />
                  ))}
                  {l.eventos.length === 0 && !filtrando && (
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cinza/50">sem eventos registrados</p>
                  )}
                </div>
              </li>
            ),
          )}
        </ol>
      </div>
    </section>
  );
}
