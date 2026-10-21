import { CATEGORIA_ROTULO, type Categoria, type Fonte } from "../lib/schema";
import { formatarNumero, parseValor, useContaAte } from "../lib/hooks";

/** Número que conta de 0 até o valor quando entra na tela. Texto não numérico fica como está. */
export function NumeroAnimado({
  valor,
  className = "",
  atraso = 0,
}: {
  valor: string;
  className?: string;
  atraso?: number;
}) {
  const p = parseValor(valor);
  const { ref, valor: n } = useContaAte<HTMLSpanElement>(p?.numero ?? 0, 1.4, atraso);
  if (!p) return <span className={className}>{valor}</span>;
  return (
    <span ref={ref} className={`tabular ${className}`} aria-label={valor}>
      {p.prefixo}
      {formatarNumero(n, p.decimais, p.milhar)}
      {p.sufixo}
    </span>
  );
}

/** Nomes dos veículos sem repetição (para o modo live). */
export function veiculos(fontes: Fonte[]): string[] {
  return [...new Set(fontes.map((f) => f.veiculo))];
}

export function Fontes({ fontes, className = "" }: { fontes: Fonte[]; className?: string }) {
  return (
    <p className={`font-mono text-[11px] uppercase tracking-[0.14em] text-cinza ${className}`}>
      <span className="mr-2 text-nevoa/70">Fonte{fontes.length > 1 ? "s" : ""}</span>
      {fontes.map((f, i) => {
        // Duas matérias do mesmo veículo viram "Poder360 · 2"
        const repetidas = fontes.filter((g) => g.veiculo === f.veiculo);
        const n = repetidas.length > 1 ? repetidas.indexOf(f) + 1 : 0;
        return (
        <span key={f.url + i}>
          {i > 0 && <span className="mx-1.5 text-linha">/</span>}
          <a
            href={f.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-nevoa underline decoration-linha underline-offset-4 transition-colors hover:text-amarelo hover:decoration-amarelo"
          >
            {f.veiculo}
            {n > 0 && <span className="text-cinza"> · {n}</span>}
          </a>
        </span>
        );
      })}
    </p>
  );
}

export function SeloConfirmar() {
  return (
    <span
      title="Este item ainda não foi revisado. Só aparece no modo edição."
      className="inline-flex items-center gap-1 rounded-sm border border-dashed border-alerta/70 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-alerta"
    >
      a confirmar
    </span>
  );
}

export function RotuloCategoria({ categoria, className = "" }: { categoria: Categoria; className?: string }) {
  return (
    <span className={`font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-nevoa ${className}`}>
      {CATEGORIA_ROTULO[categoria]}
    </span>
  );
}

export function SeloDestaque({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 bg-amarelo px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-noite ${className}`}
    >
      <span aria-hidden>★</span> Melhor momento
    </span>
  );
}
