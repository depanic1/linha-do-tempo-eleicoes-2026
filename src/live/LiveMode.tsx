import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { eventosDoModo } from "../lib/data";
import { navegar, useTecla } from "../lib/hooks";
import { DIMENSOES, Palco, type Formato } from "./Palco";
import { Ajuste, Progresso, SlideContagem, SlideEvento, SlidePlacar, SlideVazio } from "./Slides";

type Tela = "evento" | "placar" | "contagem";

const ATALHOS: [string, string][] = [
  ["→ / ←", "próximo / anterior"],
  ["↑ / ↓", "dia anterior / próximo dia"],
  ["D", "só destaques"],
  ["P", "placar"],
  ["C", "contagem regressiva"],
  ["R", "alternar 9:16 / 16:9"],
  ["H", "esconder interface"],
  ["F", "tela cheia"],
  ["G", "guias da zona do TikTok"],
  ["Home / End", "primeiro / último"],
  ["L", "voltar ao site"],
];

function lerParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    formato: (p.get("formato") === "16x9" ? "16x9" : "9x16") as Formato,
    destaques: p.get("destaques") === "1",
    ui: p.get("ui") !== "0",
    guias: p.get("guias") === "1",
    evento: p.get("evento"),
  };
}

export function LiveMode() {
  const inicial = useMemo(lerParams, []);
  const todos = useMemo(() => eventosDoModo("live"), []);
  const [formato, setFormato] = useState<Formato>(inicial.formato);
  const [soDestaques, setSoDestaques] = useState(inicial.destaques);
  const [ui, setUi] = useState(inicial.ui);
  const [guias, setGuias] = useState(inicial.guias);
  const [ajuda, setAjuda] = useState(false);
  const [tela, setTela] = useState<Tela>("evento");
  const [direcao, setDirecao] = useState(1);

  const lista = useMemo(() => (soDestaques ? todos.filter((e) => e.destaque) : todos), [todos, soDestaques]);
  const [id, setId] = useState<string | null>(() => {
    const base = inicial.destaques ? todos.filter((e) => e.destaque) : todos;
    return base.find((e) => e.id === inicial.evento)?.id ?? base[0]?.id ?? null;
  });

  const indice = Math.max(0, lista.findIndex((e) => e.id === id));
  const atual = lista[indice] ?? null;

  // Ao trocar o filtro, fica no evento mais próximo da mesma data
  useEffect(() => {
    if (lista.some((e) => e.id === id)) return;
    const ref = todos.find((e) => e.id === id)?.data ?? "";
    const prox = lista.find((e) => e.data >= ref) ?? lista[lista.length - 1];
    setId(prox?.id ?? null);
  }, [lista, id, todos]);

  // URL sempre reflete a tela: recarregar no OBS volta para o mesmo ponto
  useEffect(() => {
    const p = new URLSearchParams();
    if (formato === "16x9") p.set("formato", "16x9");
    if (soDestaques) p.set("destaques", "1");
    if (!ui) p.set("ui", "0");
    if (guias) p.set("guias", "1");
    if (atual) p.set("evento", atual.id);
    const q = p.toString();
    window.history.replaceState(null, "", "/live" + (q ? `?${q}` : ""));
  }, [formato, soDestaques, ui, guias, atual]);

  const ir = (i: number, dir: number) => {
    if (!lista.length) return;
    const alvo = Math.min(lista.length - 1, Math.max(0, i));
    setTela("evento");
    if (alvo === indice) return;
    setDirecao(dir);
    setId(lista[alvo].id);
  };

  const pularDia = (dir: 1 | -1) => {
    if (!atual) return;
    if (dir === 1) {
      const i = lista.findIndex((e) => e.data > atual.data);
      if (i >= 0) ir(i, 1);
    } else {
      const anteriores = lista.filter((e) => e.data < atual.data);
      if (!anteriores.length) return ir(0, -1);
      const dia = anteriores[anteriores.length - 1].data;
      ir(lista.findIndex((e) => e.data === dia), -1);
    }
  };

  const telaCheia = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen().catch(() => {});
  };

  useTecla((e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const acoes: Record<string, () => void> = {
      ArrowRight: () => ir(indice + 1, 1),
      ArrowLeft: () => ir(indice - 1, -1),
      ArrowDown: () => pularDia(1),
      ArrowUp: () => pularDia(-1),
      Home: () => ir(0, -1),
      End: () => ir(lista.length - 1, 1),
      d: () => setSoDestaques((v) => !v),
      h: () => setUi((v) => !v),
      f: telaCheia,
      r: () => setFormato((f) => (f === "9x16" ? "16x9" : "9x16")),
      g: () => setGuias((v) => !v),
      p: () => setTela((t) => (t === "placar" ? "evento" : "placar")),
      c: () => setTela((t) => (t === "contagem" ? "evento" : "contagem")),
      "?": () => setAjuda((v) => !v),
      Escape: () => {
        setAjuda(false);
        setTela("evento");
      },
    };
    const acao = acoes[k];
    if (acao) {
      e.preventDefault();
      acao();
    }
  });

  const { seguro } = DIMENSOES[formato];
  const vertical = formato === "9x16";
  const chave = tela === "evento" ? `ev-${atual?.id ?? "vazio"}-${formato}` : `${tela}-${formato}`;

  const botao = (ativo = false) =>
    `border px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
      ativo ? "border-amarelo bg-amarelo font-bold text-noite" : "border-linha bg-noite/80 text-nevoa hover:border-nevoa hover:text-papel"
    }`;

  return (
    <>
      <Palco formato={formato} guias={guias}>
        <div
          className="absolute inset-x-0 flex flex-col"
          style={{ top: seguro, bottom: seguro, padding: vertical ? "28px 80px 36px" : "56px 96px 48px" }}
        >
          {/* Cabeçalho com o selo fixo */}
          <div className="flex items-center justify-between font-mono uppercase tracking-[0.18em]" style={{ fontSize: vertical ? 24 : 22 }}>
            <span className="flex items-center gap-3 text-nevoa">
              <span className="inline-block size-4 bg-amarelo" />
              Linha do tempo · Eleições 2026
            </span>
            <span className="text-cinza">@emerson_delfini</span>
          </div>

          <div className="relative my-8 min-h-0 flex-1">
            <AnimatePresence mode="wait" custom={direcao} initial={false}>
              <motion.div
                key={chave}
                custom={direcao}
                className="absolute inset-0"
                initial={{ opacity: 0, x: direcao * 70 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direcao * -70 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <Ajuste>
                  {tela === "placar" ? (
                    <SlidePlacar formato={formato} />
                  ) : tela === "contagem" ? (
                    <SlideContagem />
                  ) : atual ? (
                    <SlideEvento evento={atual} formato={formato} />
                  ) : (
                    <SlideVazio />
                  )}
                </Ajuste>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="pt-6">
            <Progresso data={tela === "evento" ? (atual?.data ?? null) : null} formato={formato} />
          </div>
        </div>
      </Palco>

      {ui && (
        <>
          <div className="fixed left-3 top-3 z-[70] flex flex-wrap gap-1.5">
            <button type="button" className={botao()} onClick={() => navegar("/")}>
              ← Site
            </button>
            <button type="button" className={botao()} onClick={() => setFormato((f) => (f === "9x16" ? "16x9" : "9x16"))}>
              {vertical ? "9:16 → 16:9" : "16:9 → 9:16"}
            </button>
            <button type="button" className={botao(soDestaques)} onClick={() => setSoDestaques((v) => !v)}>
              ★ Destaques
            </button>
            <button type="button" className={botao(tela === "placar")} onClick={() => setTela((t) => (t === "placar" ? "evento" : "placar"))}>
              Placar
            </button>
            <button type="button" className={botao(tela === "contagem")} onClick={() => setTela((t) => (t === "contagem" ? "evento" : "contagem"))}>
              Contagem
            </button>
            <button type="button" className={botao(guias)} onClick={() => setGuias((v) => !v)}>
              Guias
            </button>
            <button type="button" className={botao()} onClick={telaCheia}>
              Tela cheia
            </button>
            <button type="button" className={botao(ajuda)} onClick={() => setAjuda((v) => !v)}>
              ? Atalhos
            </button>
          </div>
          <div className="fixed bottom-3 left-3 right-3 z-[70] flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-cinza">
            <span className="bg-noite/80 px-2 py-1">
              {lista.length ? `${indice + 1} / ${lista.length}` : "0 / 0"}
              {soDestaques && " · só destaques"}
            </span>
            <span className="bg-noite/80 px-2 py-1">← → evento · ↑ ↓ dia · D · P · C · R · H esconder · F tela cheia</span>
          </div>
          <div className="fixed inset-y-0 left-0 z-[65] flex w-[12%] items-center">
            <button type="button" aria-label="Evento anterior" className="h-1/2 w-full opacity-0" onClick={() => ir(indice - 1, -1)} />
          </div>
          <div className="fixed inset-y-0 right-0 z-[65] flex w-[12%] items-center">
            <button type="button" aria-label="Próximo evento" className="h-1/2 w-full opacity-0" onClick={() => ir(indice + 1, 1)} />
          </div>
        </>
      )}

      {ajuda && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4" onClick={() => setAjuda(false)}>
          <div className="w-full max-w-md border border-linha bg-carvao p-6" onClick={(e) => e.stopPropagation()}>
            <p className="titulo text-3xl text-papel">Atalhos do modo live</p>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-sm">
              {ATALHOS.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-amarelo">{k}</dt>
                  <dd className="text-nevoa">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs leading-relaxed text-cinza">
              OBS: use uma Fonte de Navegador de 1080×1920 apontando para <span className="text-nevoa">/live?ui=0</span>. A URL guarda o evento atual.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
