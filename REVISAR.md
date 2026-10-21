# O que revisar antes da live

Todo o conteúdo pesquisado entrou com `"verificado": false`. Enquanto isso, **o site público mostra a linha do tempo vazia e o placar como "em revisão"**. A live (`/live`) e o modo edição (`/?edit=1`) mostram tudo.

Para liberar um item: abra a(s) fonte(s), confira e mude para `"verificado": true` em `src/data/timeline.json`.

## 1. Pontos que pedem atenção especial

| Item | Por quê |
|---|---|
| **Placar do 1º turno** (`primeiroTurno`) | O site do TSE bloqueou a leitura automática. Os números finais vieram da CNN Brasil. Uma prévia do TSE com 99,99% das urnas dava 56.104.268 votos para Flávio, e o total final usado é 56.104.503. Confira no portal de resultados do TSE, principalmente brancos (1,84%) e nulos (2,93%). |
| `2026-08-16-frase-lula-favela` | A citação é um trecho, não uma frase completa (a fonte só traz esse pedaço). |
| `2026-08-31-direito-resposta-jn` | Usei a data da matéria da CNN (31/08). O pedido pode ter sido feito em 29 ou 30/08. |
| `2026-09-04-tse-homologa` | A data veio de um resumo de busca. Não consegui abrir a matéria para confirmar. |
| `2026-09-07-quaest` | A própria CNN dá dois períodos de entrevistas diferentes (3 a 6 e 4 a 7/09). Os números batem. |
| `2026-09-23-record-cancela` | Um texto do Poder360 diz que o debate era dia 23, outro diz 27. Usei 27 (a matéria específica do cancelamento). |
| `2026-10-09-atlas` e `2026-10-19-atlas` | As datas de divulgação vieram de resumos de busca. Os números batem com as manchetes. |
| `2026-10-17-luchsinger` | A data da entrevista (sábado, 17) veio de um resumo de busca. |
| `2026-10-20-lula-condiciona-globo` | O debate da Globo do dia 23 estava confirmado pela CNN em 20/10, mas a ida de Lula está condicionada. Atualize até sexta. |

## 2. Os 35 eventos "a confirmar"

| Data | id | Título |
|---|---|---|
| 16/08 | 2026-08-16-largada | Começa a campanha: Lula em São Bernardo, Flávio em Copacabana ★ |
| 16/08 | 2026-08-16-frase-lula-favela | Frase de Lula sobre "dono de favela" |
| 23/08 | 2026-08-23-debate-band | Primeiro debate tem só 3 candidatos; Lula e Flávio faltam ★ |
| 27/08 | 2026-08-27-jn-lula | Lula é entrevistado no Jornal Nacional |
| 28/08 | 2026-08-28-horario-eleitoral | Horário eleitoral começa no rádio e na TV |
| 28/08 | 2026-08-28-jn-flavio | Flávio Bolsonaro é entrevistado na TV Globo |
| 31/08 | 2026-08-31-direito-resposta-jn | Campanha de Lula pede direito de resposta por falas de Flávio |
| 04/09 | 2026-09-04-tse-homologa | TSE aprova lista de 13 candidaturas |
| 07/09 | 2026-09-07-quaest | Quaest: Lula 36%, Flávio 29% |
| 11/09 | 2026-09-11-tse-marcal | TSE barra a candidatura de Pablo Marçal ★ |
| 17/09 | 2026-09-17-atlas | AtlasIntel: empate num 2º turno |
| 23/09 | 2026-09-23-record-cancela | Record cancela o debate do dia 27 |
| 30/09 | 2026-09-30-lula-desiste-globo | Lula avisa que não vai ao debate da Globo |
| 01/10 | 2026-10-01-globo-cancela | Globo cancela debate após decisões da Justiça ★ |
| 03/10 | 2026-10-03-datafolha | Véspera: Datafolha, Lula 45% x Flávio 42% |
| 03/10 | 2026-10-03-atlas | AtlasIntel: Lula 50,1% x Flávio 49,9% |
| 03/10 | 2026-10-03-frase-flavio-ultimo-ato | Frase de Flávio no último ato do 1º turno |
| 04/10 | 2026-10-04-apuracao | Flávio e Lula vão ao 2º turno ★ |
| 05/10 | 2026-10-05-apoios | Zema apoia Flávio; Cury e Renan ficam neutros |
| 06/10 | 2026-10-06-caiado-apoia-flavio | Caiado anuncia apoio a Flávio |
| 06/10 | 2026-10-06-frase-flavio-goiania | Frase de Flávio em Goiânia |
| 08/10 | 2026-10-08-datafolha | 1º Datafolha do 2º turno: Flávio 52%, Lula 48% ★ |
| 09/10 | 2026-10-09-horario-2t | Propaganda do 2º turno volta à TV |
| 09/10 | 2026-10-09-atlas | AtlasIntel: Flávio 52,8% x Lula 47,2% |
| 09/10 | 2026-10-09-record-cancela-2t | Record cancela debate do dia 11 |
| 13/10 | 2026-10-13-tse-carrossel | TSE mantém fora do ar post contra Flávio |
| 14/10 | 2026-10-14-quaest | Quaest: Flávio 46% x Lula 44% |
| 15/10 | 2026-10-15-datafolha | Datafolha: Flávio 51% x Lula 49% |
| 17/10 | 2026-10-17-tse-mentiroso-master | TSE mantém vídeo de Lula contra Flávio |
| 17/10 | 2026-10-17-luchsinger | Roberta Luchsinger acusa Lula em entrevista |
| 18/10 | 2026-10-18-debate-band | 1º debate direto: Lula e Flávio trocam acusações ★ |
| 18/10 | 2026-10-18-frase-flavio-esconder | "Eu não tenho absolutamente nada a esconder" ★ |
| 18/10 | 2026-10-18-frase-lula-malandro | "Malandro carioca…" ★ |
| 19/10 | 2026-10-19-atlas | AtlasIntel: Flávio 51,1% x Lula 48,9% |
| 20/10 | 2026-10-20-lula-condiciona-globo | Frase de Lula sobre o debate da Globo |

★ = destaque ("Melhores momentos")

## 3. Ficou de fora (sem fonte aceitável ou sem confirmação)

- **Datafolha de agosto e setembro (1º turno):** só achei os números na Gazeta do Povo, que não está na lista de fontes combinada. Os Datafolha de 03/10, 08/10 e 15/10 entraram.
- **Debate do SBT no 2º turno (15/10):** aparece num calendário, mas não achei confirmação de que aconteceu.
- **Resultado do pedido de direito de resposta de Lula (JN):** não achei a decisão do TSE.
- **Ação de Flávio no TSE contra falas de Lula no JN:** só achei em blog de colunista da CNN. Pela regra "nada de blog", ficou fora.
- **Data em que o PSD anunciou neutralidade:** incerta (provavelmente 04/10). Citei a neutralidade dentro do evento do apoio de Caiado.
- **Substituto de Marçal no PRTB (Leonardo Avalanche):** aparece numa lista do Datafolha, mas sem confirmação de registro. Ficou fora.
- **Caso Vorcaro e filme "Dark Horse":** as reportagens de origem são de antes da campanha (maio). Ficou fora do período; as decisões do TSE ligadas ao caso, em outubro, entraram.
- **PoderData/Aya e outros institutos:** não entraram, porque você pediu Datafolha, Quaest e AtlasIntel. Dá para adicionar.
- **Notícias de hoje (21/10):** a busca não trouxe nada novo.
- **Debate da Globo (23/10) e o 2º turno (25/10):** ainda não aconteceram.
