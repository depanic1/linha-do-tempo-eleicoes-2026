// Datas do JSON são dias do calendário de Brasília ("AAAA-MM-DD").
// Tudo é calculado em UTC para não sofrer com o fuso de quem abre o site.

const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const MESES_LONGO = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];
const SEMANA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function rangeDias(inicio: string, fim: string): string[] {
  const dias: string[] = [];
  const d = parseISO(inicio);
  const end = parseISO(fim).getTime();
  while (d.getTime() <= end) {
    dias.push(toISO(d));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return dias;
}

/** "04 OUT" */
export function fmtCurto(iso: string): string {
  const d = parseISO(iso);
  return `${String(d.getUTCDate()).padStart(2, "0")} ${MESES[d.getUTCMonth()]}`;
}

/** "4 de outubro" */
export function fmtLongo(iso: string): string {
  const d = parseISO(iso);
  return `${d.getUTCDate()} de ${MESES_LONGO[d.getUTCMonth()]}`;
}

/** "04/10" */
export function fmtBarra(iso: string): string {
  const d = parseISO(iso);
  return `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function diaSemana(iso: string): string {
  return SEMANA[parseISO(iso).getUTCDay()];
}

export function diffDias(a: string, b: string): number {
  return Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / 86_400_000);
}

/** Data de hoje no fuso de Brasília. */
export function hojeBrasilia(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
