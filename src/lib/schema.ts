import { z } from "zod";

export const CATEGORIAS = [
  "resultado",
  "debate",
  "pesquisa",
  "polemica",
  "agenda",
  "justica-eleitoral",
  "frase",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

export const CATEGORIA_ROTULO: Record<Categoria, string> = {
  resultado: "Resultado",
  debate: "Debate",
  pesquisa: "Pesquisa",
  polemica: "Polêmica",
  agenda: "Agenda",
  "justica-eleitoral": "Justiça Eleitoral",
  frase: "Frase",
};

const dataISO = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "data deve estar no formato AAAA-MM-DD");

const url = z.string().url("URL inválida (precisa começar com https://)");

export const FonteSchema = z.object({
  veiculo: z.string().min(1, "veiculo vazio"),
  url,
});

export const NumeroSchema = z.object({
  rotulo: z.string().min(1),
  valor: z.string().min(1),
});

export const MidiaSchema = z.object({
  tipo: z.enum(["imagem", "tiktok", "youtube"]),
  // "" = sem mídia ainda (é ignorada na tela)
  url: z.union([z.literal(""), url]),
  legenda: z.string().optional(),
  credito: z.string().optional(),
});

export const EventoSchema = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9-]+$/, "id só pode ter letras minúsculas, números e hífen"),
  data: dataISO,
  hora: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "hora deve estar no formato HH:MM")
    .optional(),
  titulo: z.string().min(1).max(140, "título muito longo (máx. 140 caracteres)"),
  resumo: z.string().min(1),
  categoria: z.enum(CATEGORIAS),
  // Só para categoria "frase": quem disse e em que contexto
  autor: z.string().optional(),
  destaque: z.boolean().default(false),
  numeros: z.array(NumeroSchema).optional(),
  midia: MidiaSchema.optional(),
  fontes: z.array(FonteSchema).min(1, "evento sem fonte não é publicado"),
  verificado: z.boolean().default(false),
});

export const CandidatoResultadoSchema = z.object({
  nome: z.string().min(1),
  partido: z.string().optional(),
  percentual: z.number().min(0).max(100),
  votos: z.number().int().nonnegative().optional(),
  segundoTurno: z.boolean().optional(),
});

export const TurnoSchema = z.object({
  data: dataISO,
  apuradas: z.string().min(1),
  candidatos: z.array(CandidatoResultadoSchema).min(1),
  observacao: z.string().optional(),
  fontes: z.array(FonteSchema).min(1),
  verificado: z.boolean().default(false),
});

export const MarcoSchema = z.object({
  data: dataISO,
  rotulo: z.string().min(1),
  // Rótulo curto para a barra de progresso do modo live
  curto: z.string().optional(),
});

export const MetaSchema = z.object({
  titulo: z.string(),
  atualizadoEm: z.string(),
  inicio: dataISO,
  fim: dataISO,
  aberturaUrnas2T: z.string().datetime({ offset: true }),
  fechamentoUrnas2T: z.string().datetime({ offset: true }),
  marcos: z.array(MarcoSchema).default([]),
  calendarioFonte: FonteSchema.optional(),
});

export const TimelineSchema = z.object({
  meta: MetaSchema,
  primeiroTurno: TurnoSchema.nullable(),
  segundoTurno: TurnoSchema.nullable(),
  eventos: z.array(EventoSchema),
});

export type Fonte = z.infer<typeof FonteSchema>;
export type Numero = z.infer<typeof NumeroSchema>;
export type Midia = z.infer<typeof MidiaSchema>;
export type Evento = z.infer<typeof EventoSchema>;
export type Turno = z.infer<typeof TurnoSchema>;
export type Meta = z.infer<typeof MetaSchema>;
export type Timeline = z.infer<typeof TimelineSchema>;

/** Esqueleto tolerante: valida meta/placar e deixa cada evento ser validado sozinho. */
export const TimelineLooseSchema = TimelineSchema.extend({
  eventos: z.array(z.unknown()),
});
