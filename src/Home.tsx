import { descartados, eventosDoModo, timeline, turnoVisivel } from "./lib/data";
import { navegar } from "./lib/hooks";
import { Hero } from "./components/Hero";
import { Destaques } from "./components/Destaques";
import { Timeline } from "./components/Timeline";

export function Home({ edicao }: { edicao: boolean }) {
  const modo = edicao ? "edicao" : "publico";
  const eventos = eventosDoModo(modo);
  const pendentes = timeline.eventos.filter((e) => !e.verificado).length;

  return (
    <>
      <main className="relative z-10 mx-auto max-w-6xl px-4 md:px-8">
        <Hero
          edicao={edicao}
          primeiro={turnoVisivel(timeline.primeiroTurno, modo)}
          segundo={turnoVisivel(timeline.segundoTurno, modo)}
          aoAbrirLive={() => navegar("/live")}
        />
        <div className="mt-24">
          <Destaques eventos={eventos} edicao={edicao} />
        </div>
        <div className="mt-24">
          <Timeline eventos={eventos} edicao={edicao} />
        </div>
      </main>

      <footer className="relative z-10 mt-16 border-t border-linha">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-cinza md:grid-cols-[1.4fr_1fr] md:px-8">
          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-papel">Como este site funciona</p>
            <p>
              Todo fato tem link para a fonte original: TSE ou grandes veículos de imprensa. O que não tem fonte não entra.
              Todos os candidatos aparecem com a mesma cor; a ordem do placar segue o número de votos.
            </p>
            {timeline.meta.calendarioFonte && (
              <p>
                Datas do calendário eleitoral:{" "}
                <a className="text-nevoa underline underline-offset-4 hover:text-amarelo" href={timeline.meta.calendarioFonte.url} target="_blank" rel="noopener noreferrer">
                  {timeline.meta.calendarioFonte.veiculo}
                </a>
                .
              </p>
            )}
          </div>
          <div className="space-y-2 md:text-right">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-papel">Arquivo Amarelo</p>
            <p>@emerson_delfini · comentário político no TikTok</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em]">Atalhos: L = modo live</p>
          </div>
        </div>
      </footer>

      {edicao && (
        <div className="fixed bottom-3 left-3 z-50 max-w-[calc(100vw-1.5rem)] border border-alerta/60 bg-noite/95 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-alerta backdrop-blur sm:bottom-4 sm:left-4 sm:text-[11px]">
          Edição · {timeline.eventos.length} eventos · {pendentes} a confirmar
          {descartados.length > 0 && <span className="text-red-400"> · {descartados.length} descartado(s)</span>}
          <span className="hidden text-cinza sm:inline"> · E para sair</span>
        </div>
      )}
    </>
  );
}
