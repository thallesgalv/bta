# BTA — Bounty Task Analyzer — Planejamento

## Contexto

Uso pessoal: um mini-CRUD para cadastrar quais criaturas (bestiary Medium/Hard do Tibia) valem mais a pena caçar em uma Bounty Task, com base no rendimento (kills por 20min) observado em sessões de hunt. O objetivo final é uma tabela rankeada (Diamond/Gold/Silver/Bronze) que diga rapidamente qual bounty pegar. Sem backend — 100% client-side, persistido em `localStorage`, hospedado no GitHub Pages.

Decisões confirmadas:
- **Ranking**: percentil automático — a lista é ordenada por Kills/20min (desc) e dividida proporcionalmente em 4 faixas (Diamond → Bronze). Não é salvo no registro, é recalculado a cada render.
- **Imagens das criaturas**: URLs externas diretas do TibiaWiki (fandom), hardcoded por criatura. Nada de download/hospedagem local.
- **Import**: substitui completamente a lista atual em localStorage (não faz merge).

---

## Stack

- **Vite** + **React** + **TypeScript**
- **shadcn/ui** (Radix + Tailwind CSS) — Dialog, Tabs, Table, Button, Checkbox, Input, Label, Command/Popover (combobox), Badge, Textarea
- Sem backend/DB — apenas `localStorage`
- Deploy: **GitHub Pages** (via GitHub Actions, build do Vite com `base` configurado para o nome do repo)

---

## Modelo de dados

```ts
interface HuntRecord {
  id: string;            // normalizeId(monsterName), ex: "lancer_beetle"
  monsterName: string;   // nome de exibição, ex: "Lancer Beetle"
  killsPer20Min: number; // já normalizado (1 casa decimal)
  location: string;
  updatedAt: string;     // ISO timestamp
}

interface BestiaryCreature {
  id: string;
  name: string;
  difficulty: 'Medium' | 'Hard';
  imageUrl: string;      // URL direta do TibiaWiki
}
```

Ranking (`Diamond | Gold | Silver | Bronze`) **não é persistido** — é derivado em tempo de render por `computeRanks()`.

Catálogo de criaturas (`src/data/bestiary.ts`) é uma lista estática hardcoded, só com criaturas de Bestiary Medium/Hard. **Nota de implementação**: essa lista precisa ser levantada via pesquisa (TibiaWiki) na fase de build — é uma tarefa de data-entry/pesquisa própria, não algo que dá pra inferir de antemão.

---

## Regras de negócio

### `normalizeId(name)`
Lowercase, remove acentos, troca espaços/caracteres especiais por `_`. Garante unicidade por criatura (chave de upsert).

### Parser do Hunt Analyser (`parseHuntAnalyser.ts`)
Do texto colado, extrai:
1. **Session length** (`Session length: 00:18h` → minutos totais, ex: 18)
2. Cada linha do bloco **Killed Monsters** (`264x Lancer Beetle` → nome + quantidade)

Para cada monstro extraído:
- Só é considerado se o nome **bater com uma criatura do catálogo hardcoded** (Medium/Hard). Monstros fora da lista (trash mobs) são **ignorados silenciosamente** (com um aviso discreto do tipo "2 criaturas ignoradas: X, Y" — elas não têm bestiary médium/hard, não fazem sentido pro ranking de bounty task).
- Se o checkbox "considerar proporcionalidade de 20min" estiver marcado: `killsPer20Min = kills * (20 / sessionLengthMinutes)`, arredondado a 1 casa decimal.
- Se desmarcado: `killsPer20Min = kills` (valor bruto, sem ajuste).

Como um único paste pode conter **múltiplos monstros válidos** (ex: Lancer Beetle + Wailing Widow), o save da aba Hunt Analyser pode gerar **múltiplos registros de uma vez**, todos com a mesma Location. Por isso a aba mostra uma **prévia parseada** abaixo do textarea (lista simples: criatura → kills/20min calculado → "novo" ou "substituirá existente"), e o botão Salvar reflete isso dinamicamente, ex: `Salvar (1 novo, 1 substituição)`.

### Upsert / duplicidade
- Ao salvar, cada monstro é comparado por `id` contra os registros já salvos.
- Aba Manual (sempre 1 criatura): texto do botão alterna entre `Salvar` e `Substituir registro existente`.
- Aba Hunt Analyser (N criaturas): botão mostra resumo agregado (novos vs. substituições), como descrito acima.

### Validação (botão Salvar desabilitado)
- **Hunt Analyser**: precisa haver ≥1 criatura válida parseada do texto **e** Location preenchida.
- **Manual**: criatura selecionada (combobox) **e** `killsPer20Min > 0` **e** Location preenchida.

### Ranking (`computeRanks`)
Ordena todos os `HuntRecord` por `killsPer20Min` desc. Para cada posição `i` num total de `n`, `bucket = floor((i / n) * 4)` clampado 0–3, mapeado para `[Diamond, Gold, Silver, Bronze]`. Isso escala corretamente mesmo com poucos registros (1, 2, 3...), sem depender de múltiplos de 4.

### Import / Export
- **Export**: botão fica **desabilitado se a lista estiver vazia**. Ao clicar, abre um dialog com um `<Textarea readOnly>` contendo `JSON.stringify(records, null, 2)`, botão "Copiar" (clipboard) e botão "Baixar .json".
- **Import**: sempre habilitado (mesmo com lista vazia — é assim que ela é populada). Dialog com `<Textarea>` para colar o array JSON + botão "Importar". Valida o shape (`HuntRecord[]`) antes de aplicar. Ao confirmar, **substitui integralmente** o localStorage (conforme decidido).

---

## Telas / Componentes

### `/` (index)
- Header: título "BTA" + botões `Novo cadastro` (primário), `Importar`, `Exportar` (desabilitado se lista vazia).
- Tabela abaixo: colunas **Imagem | Nome | Ranking (badge colorido) | Kills per 20 min | Location**.
  - Badge de ranking colorido: Diamond (ciano/branco-gelo), Gold (amarelo), Silver (cinza), Bronze (cobre/laranja).
  - Cada linha com ações de **editar** (abre modal na aba Manual pré-preenchida) e **excluir** (remove 1 registro) — extensão razoável do "CRUD" que o pedido original menciona, já que uma tabela sem exclusão individual não seria um CRUD completo.
  - Estado vazio: mensagem "Nenhum registro cadastrado ainda".

### Modal "Novo cadastro" (`NewRecordModal`)
- Duas tabs: **Hunt Analyser** (default) / **Manual**.
- **Aba Hunt Analyser**:
  - `Textarea` (paste do log)
  - `Checkbox` "Considerar proporcionalidade de 20min de hunt" (marcado por default)
  - `Input` Location (obrigatório)
  - Prévia parseada (lista de criaturas detectadas + valor calculado + novo/substituição)
- **Aba Manual**:
  - Combobox de criatura (Command+Popover do shadcn), filtrado só com bestiary Medium/Hard, mostrando thumbnail + nome
  - `Input` numérico Kills per 20min
  - `Input` Location (obrigatório)
- Botões: `Salvar` (texto dinâmico conforme upsert, disabled conforme validação) e `Fechar`.

---

## Estrutura de projeto

```
bta/
  src/
    components/
      NewRecordModal/
        NewRecordModal.tsx
        HuntAnalyserTab.tsx
        ManualTab.tsx
      RecordsTable.tsx
      ImportDialog.tsx
      ExportDialog.tsx
      ui/                    # gerado pelo shadcn CLI
    data/
      bestiary.ts            # catálogo hardcoded (nome, dificuldade, imageUrl)
    lib/
      normalizeId.ts
      parseHuntAnalyser.ts
      ranking.ts
      storage.ts             # get/set localStorage, key "bta:hunt-records"
    types/
      index.ts
    App.tsx
    main.tsx
  public/
  .github/workflows/deploy.yml
  vite.config.ts             # base: '/bta/'
  tailwind.config.ts
  package.json
```

---

## Fases de implementação

1. Scaffold Vite + React + TS; instalar/configurar Tailwind + shadcn/ui.
2. Types, `storage.ts`, `normalizeId.ts`, `ranking.ts`.
3. Pesquisar e montar `bestiary.ts` (lista real de criaturas Medium/Hard + URLs do TibiaWiki) — requer pesquisa web.
4. `parseHuntAnalyser.ts` + validar com o exemplo de log fornecido.
5. `NewRecordModal` com as duas tabs e a prévia parseada.
6. `RecordsTable` com badges de ranking e ações editar/excluir.
7. `ImportDialog` / `ExportDialog`.
8. Ligar tudo em `App.tsx` + persistência.
9. Passe de estilo (tema dark, visual inspirado em Tibia).
10. Configurar deploy GitHub Pages (precisa criar/conectar repositório no GitHub).

## Verificação
- Testar o parser colando exatamente o log de exemplo do pedido e confirmar `killsPer20Min` calculado (ex: 264 kills em 18min com proporção 20min → 293.3).
- Testar fluxo completo no browser: cadastrar via Hunt Analyser, cadastrar manualmente, editar, excluir, exportar (copiar JSON), importar (colar JSON e confirmar substituição total).
- Confirmar que o ranking recalcula corretamente ao adicionar/remover registros (quartis proporcionais).
- Build de produção (`vite build`) e checar que o deploy no GitHub Pages carrega os assets corretamente com o `base` configurado.
