import { motion } from "framer-motion";
import type { Evento, Numero } from "../lib/schema";
import { parseValor } from "../lib/hooks";
import { Fontes, NumeroAnimado, RotuloCategoria, SeloConfirmar, SeloDestaque } from "./bits";
import { Midia } from "./Midia";

/** Se todos os valores são percentuais, vira barra; senão, vira bloco de número. */
function todosPercentuais(numeros: Numero[]) {
  return numeros.every((n) => /%\s*$/.test(n.valor) && parseValor(n.valor));
}

export function Numeros({ numeros, grande = false }: { numeros: Numero[]; grande?: boolean }) {
  if (todosPercentuais(numeros)) {
    return (
      <ul className="space-y-2.5">
        {numeros.map((n, i) => {
          const pct = Math.min(100, parseValor(n.valor)!.numero);
          return (
            <li key={n.rotulo + i} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1">
              <span className={`truncate font-medium text-papel ${grande ? "text-lg" : "text-sm"}`}>{n.rotulo}</span>
              <NumeroAnimado
                valor={n.valor}
                atraso={i * 0.08}
                className={`font-mono font-bold text-papel ${grande ? "text-2xl" : "text-base"}`}
              />
              <div className="col-span-2 h-1.5 bg-grafite">
                <motion.div
                  className="h-full origin-left bg-nevoa"
                  style={{ width: `${pct}%` }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    );
  }
  return (
    <dl className="grid grid-cols-2 gap-px bg-linha sm:grid-cols-3">
      {numeros.map((n, i) => (
        <div key={n.rotulo + i} className="bg-carvao p-3">
          <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-cinza">{n.rotulo}</dt>
          <dd className="mt-1">
            <NumeroAnimado valor={n.valor} atraso={i * 0.08} className="font-mono text-2xl font-bold text-papel" />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Cabecalho({ evento, edicao }: { evento: Evento; edicao: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <RotuloCategoria categoria={evento.categoria} />
      {evento.hora && <span className="font-mono text-[11px] tabular text-cinza">{evento.hora}</span>}
      {evento.destaque && <SeloDestaque />}
      {edicao && !evento.verificado && <SeloConfirmar />}
    </div>
  );
}

export function CartaoFrase({ evento, edicao }: { evento: Evento; edicao: boolean }) {
  return (
    <motion.figure
      id={`ev-${evento.id}`}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`relative scroll-mt-28 overflow-hidden py-6 ${evento.destaque ? "border-l-4 border-amarelo pl-6 md:pl-8" : "border-l border-linha pl-6"}`}
    >
      <Cabecalho evento={evento} edicao={edicao} />
      <span aria-hidden className="titulo pointer-events-none absolute -top-6 right-0 text-[10rem] leading-none text-amarelo/15 md:text-[14rem]">
        “
      </span>
      <blockquote className="relative mt-4 font-titulo text-[clamp(1.9rem,4.6vw,3.6rem)] leading-[1.02] text-papel">
        “{evento.titulo}”
      </blockquote>
      {evento.autor && (
        <figcaption className="mt-4 font-mono text-sm uppercase tracking-[0.12em] text-amarelo">— {evento.autor}</figcaption>
      )}
      <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-nevoa">{evento.resumo}</p>
      <Fontes fontes={evento.fontes} className="mt-4" />
    </motion.figure>
  );
}

export function EventCard({ evento, edicao }: { evento: Evento; edicao: boolean }) {
  if (evento.categoria === "frase") return <CartaoFrase evento={evento} edicao={edicao} />;

  const d = evento.destaque;
  return (
    <motion.article
      id={`ev-${evento.id}`}
      initial={d ? { opacity: 0, y: 40, scale: 0.98 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: d ? 0.8 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`relative scroll-mt-28 ${
        d
          ? "border-2 border-amarelo bg-carvao p-5 shadow-[0_0_0_1px_rgba(255,214,10,0.08),0_30px_80px_-40px_rgba(255,214,10,0.35)] md:p-7"
          : "border border-linha bg-carvao/60 p-4 md:p-5"
      }`}
    >
      <Cabecalho evento={evento} edicao={edicao} />
      <h3
        className={`titulo mt-3 text-papel ${d ? "text-[clamp(2rem,4.4vw,3.4rem)]" : "text-[clamp(1.45rem,2.6vw,2rem)]"}`}
      >
        {evento.titulo}
      </h3>
      <p className={`mt-3 max-w-prose leading-relaxed text-nevoa ${d ? "text-[17px]" : "text-[15px]"}`}>{evento.resumo}</p>
      {evento.numeros && evento.numeros.length > 0 && (
        <div className="mt-5">
          <Numeros numeros={evento.numeros} grande={d} />
        </div>
      )}
      {evento.midia && (
        <div className="mt-5">
          <Midia midia={evento.midia} />
        </div>
      )}
      <Fontes fontes={evento.fontes} className="mt-5" />
    </motion.article>
  );
}
