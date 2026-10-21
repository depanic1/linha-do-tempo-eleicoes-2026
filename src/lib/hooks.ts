import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/* ---------- Rota mínima (sem react-router) ---------- */

const ROTA_EVENTO = "rota-mudou";

function lerRota() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

export function navegar(caminho: string) {
  const busca = new URLSearchParams(window.location.search);
  busca.delete("evento");
  const q = busca.toString();
  window.history.pushState(null, "", caminho + (q ? `?${q}` : ""));
  window.dispatchEvent(new Event(ROTA_EVENTO));
  window.scrollTo(0, 0);
}

export function useRota(): string {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("popstate", cb);
      window.addEventListener(ROTA_EVENTO, cb);
      return () => {
        window.removeEventListener("popstate", cb);
        window.removeEventListener(ROTA_EVENTO, cb);
      };
    },
    lerRota,
  );
}

/* ---------- Modo edição (?edit=1 ou tecla E) ---------- */

const CHAVE_EDICAO = "ldt-edicao";

function lerEdicaoInicial(): boolean {
  const p = new URLSearchParams(window.location.search).get("edit");
  try {
    if (p === "1") localStorage.setItem(CHAVE_EDICAO, "1");
    if (p === "0") localStorage.removeItem(CHAVE_EDICAO);
    return localStorage.getItem(CHAVE_EDICAO) === "1";
  } catch {
    return p === "1";
  }
}

export function useModoEdicao(): [boolean, () => void] {
  const [edicao, setEdicao] = useState(lerEdicaoInicial);
  const alternar = useCallback(() => {
    setEdicao((v) => {
      const novo = !v;
      try {
        if (novo) localStorage.setItem(CHAVE_EDICAO, "1");
        else localStorage.removeItem(CHAVE_EDICAO);
      } catch {
        /* sem storage: vale só nesta aba */
      }
      return novo;
    });
  }, []);
  return [edicao, alternar];
}

/* ---------- Atalhos de teclado ---------- */

export function useTecla(handler: (e: KeyboardEvent) => void) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement | null;
      if (alvo && (alvo.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName))) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      ref.current(e);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
}

/* ---------- Contagem regressiva ---------- */

export type EstadoContagem =
  | { fase: "antes"; dias: number; horas: number; minutos: number; segundos: number }
  | { fase: "votacao"; minutosParaFechar: number }
  | { fase: "apuracao" };

export function useContagem(abertura: string, fechamento: string): EstadoContagem {
  const [agora, setAgora] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const ini = Date.parse(abertura);
  const fim = Date.parse(fechamento);
  if (agora >= fim) return { fase: "apuracao" };
  if (agora >= ini) return { fase: "votacao", minutosParaFechar: Math.ceil((fim - agora) / 60000) };
  let s = Math.floor((ini - agora) / 1000);
  const dias = Math.floor(s / 86400);
  s -= dias * 86400;
  const horas = Math.floor(s / 3600);
  s -= horas * 3600;
  const minutos = Math.floor(s / 60);
  return { fase: "antes", dias, horas, minutos, segundos: s - minutos * 60 };
}

/* ---------- Número que conta de 0 até o valor ---------- */

type ValorParseado = {
  prefixo: string;
  numero: number;
  sufixo: string;
  decimais: number;
  milhar: boolean;
};

/** Entende "44,1%", "52.000.000 votos", "+3 pts", "R$ 1,2 bi". */
export function parseValor(valor: string): ValorParseado | null {
  const m = valor.match(/\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?/);
  if (!m || m.index === undefined) return null;
  const token = m[0];
  const milhar = token.includes(".");
  const [inteiro, frac = ""] = token.split(",");
  return {
    prefixo: valor.slice(0, m.index),
    numero: Number(inteiro.replace(/\./g, "") + (frac ? "." + frac : "")),
    sufixo: valor.slice(m.index + token.length),
    decimais: frac.length,
    milhar,
  };
}

export function formatarNumero(n: number, decimais: number, milhar: boolean): string {
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais,
    useGrouping: milhar,
  });
}

export function useContaAte<T extends Element>(alvo: number, duracao = 1.4, atraso = 0) {
  const ref = useRef<T>(null);
  const visivel = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduzir = useReducedMotion();
  const [valor, setValor] = useState(reduzir ? alvo : 0);

  useEffect(() => {
    if (!visivel) return;
    if (reduzir) {
      setValor(alvo);
      return;
    }
    const ctrl = animate(0, alvo, {
      duration: duracao,
      delay: atraso,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setValor,
    });
    return () => ctrl.stop();
  }, [visivel, alvo, duracao, atraso, reduzir]);

  return { ref, valor, visivel };
}
