# Linha do Tempo — Eleições 2026

A eleição presidencial de 2026, dia a dia, de 16/08 a 25/10. Feito para a live do TikTok (Arquivo Amarelo / @emerson_delfini) e para o público.

Vite + React + TypeScript + Tailwind + Framer Motion. Sem backend: todo o conteúdo está em `src/data/timeline.json`.

---

## Rodar no computador

Precisa do Node 20 ou mais novo.

```bash
npm install
npm run dev
```

Abra http://localhost:5173. As mudanças no JSON aparecem na hora.

| Endereço | O que é |
|---|---|
| `/` | Site público (só eventos com `"verificado": true`) |
| `/?edit=1` | Modo edição: mostra tudo, com selo **a confirmar** nos não revisados. Fica ligado até você abrir `/?edit=0` ou apertar **E** |
| `/live` | Modo live 9:16 (1080×1920) |

## Modo live

| Tecla | Ação |
|---|---|
| → / ← | próximo / anterior evento |
| ↑ / ↓ | dia anterior / próximo dia |
| D | só destaques |
| P | placar oficial (1º e 2º turno) |
| C | contagem regressiva |
| R | alterna 9:16 ↔ 16:9 |
| H | esconde os botões |
| F | tela cheia |
| G | mostra as faixas de 220px que o TikTok cobre |
| Home / End | primeiro / último |
| ? | lista de atalhos |
| L | volta para o site |

A URL guarda onde você está (`/live?evento=2026-10-18-debate-band`). Se o OBS recarregar, a página volta para o mesmo evento.

**No OBS:** crie uma *Fonte de navegador* com largura 1080 e altura 1920 apontando para `https://SEU-SITE/live?ui=0`. O `ui=0` já abre sem os botões. Para comandar pelo teclado, clique com o botão direito na fonte e escolha **Interagir**. Para 16:9, use 1920×1080 e `/live?formato=16x9&ui=0`.

---

## Editar o JSON

Arquivo: `src/data/timeline.json`. Para criar um evento, copie um bloco e mude os campos:

```json
{
  "id": "2026-10-23-debate-globo",
  "data": "2026-10-23",
  "hora": "22:00",
  "titulo": "Lula e Flávio fazem o último debate, na Globo",
  "resumo": "Até 2 frases, linguagem simples.",
  "categoria": "debate",
  "destaque": true,
  "numeros": [{ "rotulo": "Lula", "valor": "50,0%" }],
  "midia": { "tipo": "youtube", "url": "https://www.youtube.com/watch?v=..." },
  "fontes": [{ "veiculo": "g1", "url": "https://g1.globo.com/..." }],
  "verificado": false
}
```

- **id**: único, só minúsculas, números e hífen. Use `data-assunto`.
- **categoria**: `resultado`, `debate`, `pesquisa`, `polemica`, `agenda`, `justica-eleitoral` ou `frase`.
- **frase**: o `titulo` é a citação (sem aspas) e o campo `autor` diz quem falou e onde.
- **numeros**: valores terminados em `%` viram barras. Os outros viram blocos de número. Todos contam de 0 até o valor.
- **destaque: true**: entra em "Melhores momentos" e ganha card com borda amarela.
- **fontes**: obrigatório, pelo menos 1. **Evento sem fonte não aparece no site.**
- **verificado**: mude para `true` depois de revisar. Só então o evento aparece no site público.
- A ordem no arquivo não importa: o site ordena por data e hora.

**Placar:** `primeiroTurno` já está preenchido. Depois da apuração do dia 25, preencha `segundoTurno` no mesmo formato, em vez de `null`. Ele também só aparece no site público com `"verificado": true`.

Para checar o arquivo sem abrir o site:

```bash
npm run validate
```

O validador aponta o evento com problema, por exemplo `evento #12 (2026-10-05-apoios) → fontes: evento sem fonte não é publicado`. O build não roda enquanto houver erro.

---

## Publicar na Vercel

**Opção A: pelo site, sem terminal**

1. Suba esta pasta para um repositório no GitHub.
2. Em vercel.com, clique em **Add New → Project** e importe o repositório.
3. A Vercel reconhece o Vite. Confira: Build Command `npm run build`, Output Directory `dist`.
4. Clique em **Deploy**.

Depois disso, cada `git push` com o JSON editado publica sozinho em cerca de 1 minuto.

**Opção B: pela linha de comando**

```bash
npm i -g vercel
vercel
```

Para publicar em produção:

```bash
vercel --prod
```

O `vercel.json` já faz `/live` funcionar quando a página é recarregada direto nesse endereço.

Para testar a versão de produção no seu computador:

```bash
npm run build
```

Depois, para abrir em http://localhost:4173:

```bash
npm run preview
```

---

## Estrutura

```
src/
  data/timeline.json      ← conteúdo (o único arquivo editado no dia a dia)
  lib/schema.ts           ← formato do JSON (Zod) e tipos
  lib/data.ts             ← carrega, valida, descarta evento sem fonte, filtra por modo
  lib/dates.ts            ← datas em horário de Brasília
  lib/hooks.ts            ← rota, modo edição, teclado, contagem, número animado
  components/             ← Hero (contagem + placar), Destaques, Timeline, cards
  live/                   ← modo live (palco 1080×1920, slides, barra de progresso)
scripts/validate-timeline.ts
```

Princípios de design: todos os candidatos usam a mesma cor neutra; o amarelo marca só destaque editorial. As animações respeitam a opção do sistema "reduzir movimento".
