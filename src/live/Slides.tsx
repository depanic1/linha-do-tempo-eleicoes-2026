import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import type { Evento } from "../lib/schema";
import { CATEGORIA_ROTULO } from "../lib/schema";
import { DIAS, timeline } from "../lib/data";
import { diaSemana, diffDias, fmtCurto, hojeBrasilia, parseISO } from "../lib/dates";
import { parseValor } from "../lib/hooks";
import { NumeroAnimado, veiculos } from "../components/bits";
import { Contagem, Placar } from "../components/Hero";
import type { Formato } from "./Palco";

/** Se o conteúdo não couber na área útil, reduz tudo proporcionalmente (nunca corta). */
export function Ajuste({ children }: { children: ReactNode }) {
  const fora = useRef<HTMLDivElement>(null);
  const dentro = useRef<HTMLDivElement>(null);
  const [escala, setEscala] = useState(1);
  useLayoutEffect(() => {
    const medir = () => {
      if (!fora.current || !dentro.current) return;
      const disponivel = fora.current.clientHeight;
      const ocupado = dentro.current.offsetHeight;
      setEscala(ocupado > disponivel ? disponivel / ocupado : 1);
    };
    medir();
    const ro = new ResizeObserver(medir);
    if (fora.current) ro.observe(fora.current);
    if (dentro.current) ro.observe(dentro.current);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={fora} className="flex h-full items-center overflow-hidden">
      <div ref={dentro} className="w-full shrink-0" style={{ transform: `scale(${escala})`, transformOrigin: "center" }}>
        {children}
      </div>
    </div>
  );
}

const entrada: Variants = {
  oculto: { opacity: 0, y: 30 },
  visivel: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 + i * 0.09, ease: [0.16, 1, 0.3, 1] },
  }),
};

function tamanhoTitulo(texto: string, formato: Formato): number {
  const n = texto.length;
  if (formato === "9x16") return n <= 32 ? 128 : n <= 60 ? 104 : n <= 90 ? 86 : 72; // nunca abaixo de 64px
  return n <= 40 ? 112 : n <= 70 ? 92 : n <= 100 ? 76 : 64;
}

function NumerosLive({ evento, formato }: { evento: Evento; formato: Formato }) {
  const numeros = evento.numeros ?? [];
  if (!numeros.length) return null;
  const vertical = formato === "9x16";
  const lista = numeros.slice(0, vertical ? 3 : 4); // placar completo fica na tecla P
  const percentuais = lista.every((n) => /%\s*$/.test(n.valor) && parseValor(n.valor));

  if (percentuais) {
    return (
      <ul className={vertical ? "space-y-7" : "space-y-5"}>
        {lista.map((n, i) => (
          <li key={n.rotulo + i}>
            <div className="flex items-baseline justify-between gap-6">
              <span className={`truncate font-semibold text-papel ${vertical ? "text-[44px]" : "text-[36px]"}`}>{n.rotulo}</span>
              <NumeroAnimado
                valor={n.valor}
                atraso={0.3 + i * 0.1}
                className={`shrink-0 font-mono font-bold text-papel ${vertical ? "text-[64px]" : "text-[52px]"}`}
              />
            </div>
            <div className={`mt-2 bg-grafite ${vertical ? "h-5" : "h-4"}`}>
              <motion.div
                className="h-full origin-left bg-nevoa"
                style={{ width: `${Math.min(100, parseValor(n.valor)!.numero)}%` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.3, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <dl className="grid grid-cols-2 gap-[2px] bg-linha">
      {lista.map((n, i) => (
        <div key={n.rotulo + i} className="bg-carvao p-6">
          <dt className="font-mono text-[26px] uppercase tracking-[0.12em] text-cinza">{n.rotulo}</dt>
          <dd className="mt-2">
            <NumeroAnimado valor={n.valor} atraso={0.3 + i * 0.1} className="font-mono text-[60px] font-bold text-papel" />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Etiquetas({ evento, formato }: { evento: Evento; formato: Formato }) {
  const t = formato === "9x16" ? "text-[30px]" : "text-[26px]";
  return (
    <div className="flex flex-wrap items-center gap-5">
      <span className={`font-mono font-bold uppercase tracking-[0.16em] text-nevoa ${t}`}>{CATEGORIA_ROTULO[evento.categoria]}</span>
      {evento.destaque && (
        <span className={`bg-amarelo px-3 py-1 font-mono font-bold uppercase tracking-[0.14em] text-noite ${t}`}>★ Melhor momento</span>
      )}
    </div>
  );
}

function DataGrande({ evento, formato }: { evento: Evento; formato: Formato }) {
  const vertical = formato === "9x16";
  const ano = parseISO(evento.data).getUTCFullYear();
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <p className={`font-mono font-bold leading-none tabular text-amarelo ${vertical ? "text-[116px]" : "text-[104px]"}`}>
          {fmtCurto(evento.data)}
        </p>
        <p className={`mt-3 font-mono uppercase tracking-[0.14em] text-nevoa ${vertical ? "text-[34px]" : "text-[28px]"}`}>
          {diaSemana(evento.data)} · {ano}
          {evento.hora && <span className="text-papel"> · {evento.hora}</span>}
        </p>
      </div>
    </div>
  );
}

function Fonte({ evento, formato }: { evento: Evento; formato: Formato }) {
  return (
    <p className={`font-mono uppercase tracking-[0.14em] text-cinza ${formato === "9x16" ? "text-[28px]" : "text-[24px]"}`}>
      Fonte{veiculos(evento.fontes).length > 1 ? "s" : ""}:{" "}
      <span className="text-nevoa">{veiculos(evento.fontes).join(" / ")}</span>
    </p>
  );
}

export function SlideEvento({ evento, formato }: { evento: Evento; formato: Formato }) {
  const vertical = formato === "9x16";
  const frase = evento.categoria === "frase";
  const img = evento.midia?.tipo === "imagem" && evento.midia.url ? evento.midia : null;

  const titulo = frase ? (
    <motion.blockquote
      variants={entrada}
      custom={2}
      className="font-titulo leading-[1.04] text-papel"
      style={{ fontSize: Math.max(64, tamanhoTitulo(evento.titulo, formato) - 8) }}
    >
      <span aria-hidden className="block h-[0.62em] text-[2.2em] leading-[0.9] text-amarelo">“</span>
      {evento.titulo}”
    </motion.blockquote>
  ) : (
    <motion.h1
      variants={entrada}
      custom={2}
      className="titulo text-papel"
      style={{ fontSize: tamanhoTitulo(evento.titulo, formato), lineHeight: 1.06 }}
    >
      {evento.titulo}
    </motion.h1>
  );

  const corpo = (
    <>
      {frase && evento.autor && (
        <motion.p variants={entrada} custom={3} className={`font-mono uppercase tracking-[0.12em] text-amarelo ${vertical ? "text-[36px]" : "text-[30px]"}`}>
          — {evento.autor}
        </motion.p>
      )}
      <motion.p variants={entrada} custom={3} className={`leading-[1.3] text-nevoa ${vertical ? "text-[44px]" : "text-[38px]"}`}>
        {evento.resumo}
      </motion.p>
      {img && (
        <motion.img variants={entrada} custom={4} src={img.url} alt="" className={`w-full border border-linha object-cover ${vertical ? "max-h-[420px]" : "max-h-[300px]"}`} />
      )}
      {!frase && evento.numeros && evento.numeros.length > 0 && (
        <motion.div variants={entrada} custom={4}>
          <NumerosLive evento={evento} formato={formato} />
        </motion.div>
      )}
      <motion.div variants={entrada} custom={5}>
        <Fonte evento={evento} formato={formato} />
      </motion.div>
    </>
  );

  if (vertical) {
    return (
      <motion.div initial="oculto" animate="visivel" className="flex flex-col gap-10">
        <motion.div variants={entrada} custom={0}>
          <DataGrande evento={evento} formato={formato} />
        </motion.div>
        <motion.div variants={entrada} custom={1}>
          <Etiquetas evento={evento} formato={formato} />
        </motion.div>
        <div className={evento.destaque && !frase ? "border-l-[10px] border-amarelo pl-10" : ""}>{titulo}</div>
        <div className="flex flex-col gap-9">{corpo}</div>
      </motion.div>
    );
  }
  return (
    <motion.div initial="oculto" animate="visivel" className="grid grid-cols-[1.25fr_1fr] items-center gap-24">
      <div className="flex flex-col gap-10">
        <motion.div variants={entrada} custom={0}>
          <DataGrande evento={evento} formato={formato} />
        </motion.div>
        <motion.div variants={entrada} custom={1}>
          <Etiquetas evento={evento} formato={formato} />
        </motion.div>
        <div className={evento.destaque && !frase ? "border-l-[10px] border-amarelo pl-10" : ""}>{titulo}</div>
      </div>
      <div className="flex flex-col gap-9">{corpo}</div>
    </motion.div>
  );
}

export function SlidePlacar({ formato }: { formato: Formato }) {
  const vertical = formato === "9x16";
  return (
    <motion.div initial="oculto" animate="visivel" className="flex flex-col gap-10">
      <motion.h1 variants={entrada} custom={0} className={`titulo text-papel ${vertical ? "text-[120px]" : "text-[96px]"}`}>
        Placar <span className="text-amarelo">oficial</span>
      </motion.h1>
      <motion.div variants={entrada} custom={1}>
        <Placar turno={timeline.primeiroTurno} rotulo="1º turno · votos válidos" edicao={false} grande />
      </motion.div>
      {timeline.segundoTurno && (
        <motion.div variants={entrada} custom={2}>
          <Placar turno={timeline.segundoTurno} rotulo="2º turno" edicao={false} grande />
        </motion.div>
      )}
      <motion.p variants={entrada} custom={3} className="font-mono text-[26px] uppercase tracking-[0.14em] text-cinza">
        Fonte: {timeline.primeiroTurno ? veiculos(timeline.primeiroTurno.fontes).join(" / ") : "TSE"}
      </motion.p>
    </motion.div>
  );
}

export function SlideContagem() {
  return (
    <motion.div initial="oculto" animate="visivel" className="flex flex-col gap-14">
      <motion.h1 variants={entrada} custom={0} className="titulo text-[150px] text-papel">
        Falta <span className="text-amarelo">pouco</span>
      </motion.h1>
      <motion.div variants={entrada} custom={1} className="origin-left [&_p:first-child]:text-[30px]">
        <Contagem grande />
      </motion.div>
    </motion.div>
  );
}

export function SlideVazio() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="titulo text-[110px] text-papel">Sem eventos</h1>
      <p className="text-[40px] text-nevoa">Nenhum evento para mostrar com esse filtro. Aperte D para ver todos.</p>
    </div>
  );
}

/** Barra do rodapé: em que ponto da eleição o evento na tela está. */
export function Progresso({ data, formato }: { data: string | null; formato: Formato }) {
  const { inicio, fim, marcos } = timeline.meta;
  const total = DIAS.length - 1;
  const pos = (iso: string) => Math.min(1, Math.max(0, diffDias(inicio, iso) / total));
  const atual = data ? pos(data) : null;
  const hoje = hojeBrasilia();
  const vertical = formato === "9x16";
  const t = vertical ? "text-[24px]" : "text-[20px]";

  return (
    <div>
      <div className={`flex justify-between font-mono uppercase tracking-[0.14em] text-cinza ${t}`}>
        <span>{fmtCurto(inicio)}</span>
        <span className="text-nevoa">
          {data ? `Dia ${diffDias(inicio, data) + 1} de ${DIAS.length}` : "Eleições 2026"}
        </span>
        <span>{fmtCurto(fim)}</span>
      </div>
      <div className="relative mt-4 h-3 bg-grafite">
        {atual !== null && (
          <motion.div
            className="absolute inset-y-0 left-0 origin-left bg-amarelo"
            initial={false}
            animate={{ width: `${atual * 100}%` }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
        {marcos.map((m) => (
          <span key={m.data} className="absolute -top-1.5 h-6 w-[3px] -translate-x-1/2 bg-papel/70" style={{ left: `${pos(m.data) * 100}%` }} />
        ))}
        {hoje >= inicio && hoje <= fim && (
          <span
            title="hoje"
            className="absolute -top-3 size-0 -translate-x-1/2 border-x-[9px] border-t-[12px] border-x-transparent border-t-papel"
            style={{ left: `${pos(hoje) * 100}%` }}
          />
        )}
      </div>
      <div className={`relative mt-3 h-8 font-mono uppercase tracking-[0.1em] text-cinza ${vertical ? "text-[20px]" : "text-[17px]"}`}>
        {marcos
          .filter((m) => m.data !== inicio && m.data !== fim)
          .map((m) => (
            <span key={m.data} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${pos(m.data) * 100}%` }}>
              {m.curto ?? m.rotulo}
            </span>
          ))}
      </div>
    </div>
  );
}
