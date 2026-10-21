import { motion } from "framer-motion";
import type { Turno } from "../lib/schema";
import { timeline } from "../lib/data";
import { fmtBarra } from "../lib/dates";
import { useContagem } from "../lib/hooks";
import { Fontes, NumeroAnimado, SeloConfirmar } from "./bits";

const pad = (n: number) => String(n).padStart(2, "0");

export function Contagem({ grande = false }: { grande?: boolean }) {
  const { aberturaUrnas2T, fechamentoUrnas2T } = timeline.meta;
  const c = useContagem(aberturaUrnas2T, fechamentoUrnas2T);

  const rotulo = (
    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amarelo">
      <span className="mr-2 inline-block size-2 rounded-full bg-amarelo align-middle" />
      Abertura das urnas · 2º turno
    </p>
  );

  if (c.fase !== "antes") {
    return (
      <div>
        {rotulo}
        <p className={`titulo mt-3 text-papel ${grande ? "text-8xl" : "text-[clamp(2.6rem,6vw,4.5rem)]"}`}>
          {c.fase === "votacao" ? "Urnas abertas" : "Urnas fechadas"}
        </p>
        <p className="mt-2 font-mono text-sm text-nevoa">
          {c.fase === "votacao"
            ? `Fecham às 17h (Brasília) · faltam ${Math.floor(c.minutosParaFechar / 60)}h${pad(c.minutosParaFechar % 60)}`
            : "Apuração em andamento — resultado oficial no site do TSE"}
        </p>
      </div>
    );
  }

  const blocos = [
    { v: c.dias, r: c.dias === 1 ? "dia" : "dias" },
    { v: c.horas, r: "horas" },
    { v: c.minutos, r: "min" },
    { v: c.segundos, r: "seg" },
  ];
  return (
    <div>
      {rotulo}
      <div className="mt-4 flex items-start gap-2 sm:gap-3" role="timer" aria-live="off">
        {blocos.map((b, i) => (
          <div key={b.r} className="flex items-start gap-2 sm:gap-3">
            {i > 0 && (
              <span aria-hidden className={`font-mono font-bold text-linha ${grande ? "text-8xl" : "text-[clamp(2.2rem,6vw,4.2rem)]"} leading-none`}>
                :
              </span>
            )}
            <div className="text-center">
              <p className={`font-mono font-bold tabular leading-none text-papel ${grande ? "text-[9rem]" : "text-[clamp(2.4rem,7vw,4.8rem)]"}`}>
                {pad(b.v)}
              </p>
              <p className={`mt-2 font-mono uppercase tracking-[0.2em] text-cinza ${grande ? "text-2xl" : "text-[10px]"}`}>{b.r}</p>
            </div>
          </div>
        ))}
      </div>
      <p className={`mt-4 text-nevoa ${grande ? "text-3xl" : "text-sm"}`}>Domingo, 25 de outubro, às 8h (horário de Brasília)</p>
    </div>
  );
}

export function Placar({
  turno,
  rotulo,
  edicao,
  grande = false,
  vazio = { titulo: "Aguardando apuração", texto: "Resultado oficial do TSE após o fechamento das urnas, às 17h." },
}: {
  turno: Turno | null;
  rotulo: string;
  edicao: boolean;
  grande?: boolean;
  vazio?: { titulo: string; texto: string };
}) {
  if (!turno) {
    return (
      <div className={`border border-dashed border-linha ${grande ? "p-8" : "p-5"}`}>
        <p className={`font-mono uppercase tracking-[0.2em] text-cinza ${grande ? "text-[26px]" : "text-[11px]"}`}>{rotulo}</p>
        <p className={`titulo mt-3 text-nevoa/60 ${grande ? "text-6xl" : "text-3xl"}`}>{vazio.titulo}</p>
        <div className="mt-4 space-y-3" aria-hidden>
          {[0, 1].map((i) => (
            <div key={i} className="h-2 w-full bg-grafite" />
          ))}
        </div>
        <p className={`mt-3 font-mono text-cinza ${grande ? "text-[24px]" : "text-[11px]"}`}>{vazio.texto}</p>
      </div>
    );
  }

  const ordenados = [...turno.candidatos].sort((a, b) => b.percentual - a.percentual);
  return (
    <div className={`border border-linha bg-carvao/70 ${grande ? "p-8" : "p-5"}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={`font-mono uppercase tracking-[0.2em] text-amarelo ${grande ? "text-[26px]" : "text-[11px]"}`}>
          {rotulo} · {fmtBarra(turno.data)}
        </p>
        <p className={`flex items-center gap-2 font-mono uppercase tracking-[0.14em] text-cinza ${grande ? "text-[22px]" : "text-[11px]"}`}>
          {edicao && !turno.verificado && <SeloConfirmar />}
          {turno.apuradas} das urnas apuradas
        </p>
      </div>
      <ul className={`mt-4 ${grande ? "space-y-6" : "space-y-3.5"}`}>
        {ordenados.map((c, i) => (
          <li key={c.nome}>
            <div className="flex items-baseline justify-between gap-3">
              <p className={`min-w-0 truncate font-semibold text-papel ${grande ? "text-4xl" : "text-[15px]"}`}>
                {c.nome}
                {c.partido && <span className={`ml-2 font-mono font-normal text-cinza ${grande ? "text-2xl" : "text-[11px]"}`}>{c.partido}</span>}
                {c.segundoTurno && (
                  <span className={`ml-2 border border-nevoa/60 px-1 align-middle font-mono font-normal uppercase tracking-[0.12em] text-nevoa ${grande ? "text-lg" : "text-[9px]"}`}>
                    2º turno
                  </span>
                )}
              </p>
              <NumeroAnimado
                valor={`${c.percentual.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`}
                atraso={0.15 + i * 0.1}
                className={`shrink-0 font-mono font-bold text-papel ${grande ? "text-5xl" : "text-lg"}`}
              />
            </div>
            <div className={`mt-1.5 w-full bg-grafite ${grande ? "h-4" : "h-2"}`}>
              <motion.div
                className="h-full origin-left bg-nevoa"
                style={{ width: `${c.percentual}%` }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            {c.votos !== undefined && !grande && (
              <p className="mt-1 font-mono text-[10px] tabular text-cinza">{c.votos.toLocaleString("pt-BR")} votos</p>
            )}
          </li>
        ))}
      </ul>
      {turno.observacao && <p className={`mt-4 text-nevoa ${grande ? "text-2xl" : "text-xs"}`}>{turno.observacao}</p>}
      {!grande && <Fontes fontes={turno.fontes} className="mt-4" />}
    </div>
  );
}

export function Hero({
  edicao,
  primeiro,
  segundo,
  aoAbrirLive,
}: {
  edicao: boolean;
  primeiro: Turno | null;
  segundo: Turno | null;
  aoAbrirLive: () => void;
}) {
  const atualizado = new Date(timeline.meta.atualizadoEm).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="relative pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-linha pb-4 font-mono text-[11px] uppercase tracking-[0.18em]">
        <p className="flex items-center gap-2 text-papel">
          <span aria-hidden className="inline-block size-2.5 bg-amarelo" />
          Arquivo Amarelo <span className="text-cinza">/ @emerson_delfini</span>
        </p>
        <div className="flex items-center gap-4 text-cinza">
          <span className="hidden sm:inline">Atualizado {atualizado.replace(",", " ·")}</span>
          <button
            type="button"
            onClick={aoAbrirLive}
            className="border border-amarelo px-2.5 py-1 font-bold text-amarelo transition-colors hover:bg-amarelo hover:text-noite"
          >
            Modo live <span className="opacity-60">[L]</span>
          </button>
        </div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="titulo mt-10 text-[clamp(3.4rem,11vw,9rem)] !leading-[1.1] text-papel"
      >
        Linha do tempo
        <span className="block text-amarelo">Eleições 2026</span>
      </motion.h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-nevoa md:text-xl">
        A eleição para presidente, dia a dia. De 16 de agosto ao 2º turno, em 25 de outubro. Cada fato com link para a fonte.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        <div className="space-y-8">
          <Contagem />
          <Placar turno={segundo} rotulo="2º turno" edicao={edicao} />
        </div>
        <Placar
          turno={primeiro}
          rotulo="1º turno · votos válidos"
          edicao={edicao}
          vazio={{ titulo: "Placar em revisão", texto: "Os números oficiais do TSE aparecem aqui depois de conferidos." }}
        />
      </div>
    </header>
  );
}
