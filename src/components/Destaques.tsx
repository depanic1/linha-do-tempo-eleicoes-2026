import { useRef } from "react";
import { motion } from "framer-motion";
import type { Evento } from "../lib/schema";
import { fmtCurto } from "../lib/dates";
import { RotuloCategoria, SeloConfirmar } from "./bits";

export function Destaques({ eventos, edicao }: { eventos: Evento[]; edicao: boolean }) {
  const faixa = useRef<HTMLDivElement>(null);
  const destaques = eventos.filter((e) => e.destaque);
  if (destaques.length === 0) return null;

  const rolar = (dir: 1 | -1) => {
    const el = faixa.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 360) + 16), behavior: "smooth" });
  };

  const botao =
    "flex size-11 items-center justify-center border border-linha text-papel transition-colors hover:border-amarelo hover:text-amarelo";

  return (
    <section aria-labelledby="titulo-destaques" className="relative">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amarelo">★ {destaques.length} momentos</p>
          <h2 id="titulo-destaques" className="titulo mt-2 text-[clamp(2.4rem,6vw,4.5rem)] text-papel">
            Melhores momentos
          </h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button type="button" className={botao} onClick={() => rolar(-1)} aria-label="Momento anterior">
            ←
          </button>
          <button type="button" className={botao} onClick={() => rolar(1)} aria-label="Próximo momento">
            →
          </button>
        </div>
      </div>

      <div
        ref={faixa}
        className="no-scrollbar -mx-4 snap-x snap-mandatory overflow-x-auto scroll-smooth px-4 pb-2 md:-mx-8 md:px-8"
        tabIndex={0}
        aria-label="Carrossel de melhores momentos"
      >
        <ol className="flex gap-4">
          {destaques.map((e, i) => (
            <motion.li
              key={e.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: Math.min(i, 4) * 0.06 }}
              className="w-[82vw] max-w-[400px] shrink-0 snap-start"
            >
              <a
                href={`#ev-${e.id}`}
                className="group flex h-full min-h-[300px] flex-col border border-linha bg-carvao p-5 transition-colors hover:border-amarelo"
              >
                <div className="flex items-center justify-between gap-2 font-mono text-[11px] tabular">
                  <span className="text-amarelo">
                    {String(i + 1).padStart(2, "0")}/{String(destaques.length).padStart(2, "0")}
                  </span>
                  <span className="text-nevoa">{fmtCurto(e.data)}{e.hora ? ` · ${e.hora}` : ""}</span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <RotuloCategoria categoria={e.categoria} />
                  {edicao && !e.verificado && <SeloConfirmar />}
                </div>
                <h3 className={`mt-3 text-papel ${e.categoria === "frase" ? "font-titulo text-[1.7rem] leading-[1.05]" : "titulo text-[1.9rem]"}`}>
                  {e.categoria === "frase" ? `“${e.titulo}”` : e.titulo}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-nevoa">
                  {e.categoria === "frase" && e.autor ? `— ${e.autor}. ` : ""}
                  {e.resumo}
                </p>
                <span className="mt-auto pt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-cinza transition-colors group-hover:text-amarelo">
                  Ver na linha do tempo ↓
                </span>
              </a>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
