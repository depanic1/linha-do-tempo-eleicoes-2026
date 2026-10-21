import raw from "../data/timeline.json";
import { EventoSchema, TimelineLooseSchema, type Evento, type Timeline } from "./schema";
import { rangeDias } from "./dates";

export type Modo = "publico" | "edicao" | "live";

function carregar(): { timeline: Timeline; descartados: string[] } {
  const base = TimelineLooseSchema.parse(raw);
  const descartados: string[] = [];
  const eventos: Evento[] = [];

  for (const item of base.eventos) {
    const r = EventoSchema.safeParse(item);
    if (r.success) {
      eventos.push(r.data);
    } else {
      // Regra dura: evento inválido (ex.: sem fonte) não renderiza.
      const id = (item as { id?: string })?.id ?? "(sem id)";
      descartados.push(`${id}: ${r.error.issues.map((i) => i.message).join("; ")}`);
    }
  }

  eventos.sort((a, b) =>
    a.data === b.data ? (a.hora ?? "99:99").localeCompare(b.hora ?? "99:99") : a.data.localeCompare(b.data),
  );

  if (descartados.length && import.meta.env.DEV) {
    console.warn("[timeline] eventos descartados:", descartados);
  }
  return { timeline: { ...base, eventos }, descartados };
}

export const { timeline, descartados } = carregar();
export const DIAS = rangeDias(timeline.meta.inicio, timeline.meta.fim);

/** Site público só mostra o que foi revisado; edição e live mostram tudo. */
export function eventosDoModo(modo: Modo): Evento[] {
  return modo === "publico" ? timeline.eventos.filter((e) => e.verificado) : timeline.eventos;
}

export function turnoVisivel<T extends { verificado: boolean } | null>(turno: T, modo: Modo): T | null {
  if (!turno) return null;
  return modo === "publico" && !turno.verificado ? null : turno;
}

export function agruparPorDia(eventos: Evento[]): Map<string, Evento[]> {
  const mapa = new Map<string, Evento[]>();
  for (const e of eventos) {
    const lista = mapa.get(e.data);
    if (lista) lista.push(e);
    else mapa.set(e.data, [e]);
  }
  return mapa;
}

export function marcoDoDia(iso: string): string | undefined {
  return timeline.meta.marcos.find((m) => m.data === iso)?.rotulo;
}
