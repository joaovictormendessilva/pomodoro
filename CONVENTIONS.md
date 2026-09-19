# Convenções do projeto

Padrões de arquitetura, nomenclatura e estilo adotados neste repositório.

---

## 1. Arquitetura

```
src/
├── App.tsx                 composition root (providers, fontes, navegação)
├── index.ts                entry point (registerRootComponent)
├── navigation/
│   ├── index.tsx           AppRoutes
│   ├── routes.ts           nomes das rotas
│   └── types.ts            RootStackParamList e tipos derivados
├── screens/                uma pasta (ou arquivo) por rota
├── components/             componentes compartilhados entre telas
├── hooks/                  hooks compartilhados entre telas
├── services/               I/O: storage, API, notificações
├── types/                  tipos de domínio
├── theme/
│   ├── index.ts            tokens de design (fonte única)
│   └── navigation-theme.ts adaptação do tema para o React Navigation
├── store/                  estado global
└── utils/                  funções puras
```

As pastas `store/` e `utils/` são criadas junto com o primeiro arquivo que as
justifique, nunca vazias.

### Responsabilidade de cada camada

| Camada        | Responsabilidade                                      | Pode depender de                |
| ------------- | ----------------------------------------------------- | ------------------------------- |
| `screens/`    | Compor a tela a partir de hooks e componentes         | todas as camadas abaixo         |
| `components/` | UI reutilizável, sem acesso direto a `services/`      | `theme/`, `types/`, `utils/`    |
| `hooks/`      | Estado e efeitos; ponte entre a UI e os `services/`   | `services/`, `types/`, `utils/` |
| `services/`   | Acesso a recursos externos (AsyncStorage, rede, etc.) | `types/`                        |
| `types/`      | Modelos do domínio, sem código executável             | nenhuma                         |
| `theme/`      | Tokens de cor e tipografia                            | nenhuma                         |
| `utils/`      | Funções puras e testáveis isoladamente                | `types/`                        |

---

## 2. Localização dos arquivos

| O quê                         | Onde                             |
| ----------------------------- | -------------------------------- |
| Componente usado por 1 tela   | `screens/<Tela>/components/`     |
| Componente usado por 2+ telas | `components/`                    |
| Hook usado por 1 tela         | `screens/<Tela>/hooks/`          |
| Hook usado por 2+ telas       | `hooks/`                         |
| `type <Componente>Props`      | no próprio arquivo do componente |
| Tipo de domínio               | `types/<dominio>.ts`             |
| Tipo de uma camada específica | `<camada>/types.ts`              |
| Cor, fonte, tamanho de fonte  | `theme/index.ts`                 |

O critério de escopo é o número de **telas** que usam o código, não o número de
arquivos: uma tela mantém local; duas ou mais tornam global.

---

## 3. Telas

Uma tela começa como arquivo único e vira pasta quando precisa de componentes ou
hooks próprios:

```
screens/Settings.tsx

screens/Settings/
├── index.tsx              conteúdo original da tela
├── components/
│   └── OptionGroup.tsx
└── hooks/
    └── useSettingsForm.ts
```

O import externo não muda nessa transição:

```ts
// navigation/index.tsx
import { SettingsScreen } from "@/screens/Settings";
```

- O arquivo (ou pasta) da tela leva o nome da rota e exporta `<Rota>Screen`.
- `index.tsx` é a API pública da pasta. Código externo não importa
  `@/screens/Settings/components/...`; quando outra tela precisa de um componente
  interno, ele é promovido para `components/`.
- A tela só compõe. Regra de negócio e estado ficam em hooks:

```tsx
export function SettingsScreen() {
  const form = useSettingsForm();
  return <SettingsForm {...form} />;
}
```

---

## 4. Nomenclatura

### Pastas

| Tipo                 | Padrão       | Exemplo                   |
| -------------------- | ------------ | ------------------------- |
| Camada / agrupamento | `kebab-case` | `screens/`, `components/` |
| Pasta de tela        | `PascalCase` | `Settings/`               |

A pasta de tela segue o mesmo padrão do arquivo `Settings.tsx` que ela
substitui, o que mantém o caminho de import estável.

### Arquivos

Arquivo que exporta **um** componente ou hook leva o nome dele. Arquivo que
agrupa código leva `kebab-case`.

| Conteúdo          | Padrão       | Exemplo               |
| ----------------- | ------------ | --------------------- |
| Componente / tela | `PascalCase` | `PomodoroTimer.tsx`   |
| Hook              | `camelCase`  | `useAppState.ts`      |
| Service           | `kebab-case` | `storage-service.ts`  |
| Tipos             | `kebab-case` | `types.ts`            |
| Constantes        | `kebab-case` | `routes.ts`           |
| Util              | `kebab-case` | `format-time.ts`      |
| Store             | `kebab-case` | `timer-store.ts`      |
| Barrel / entry    | `kebab-case` | `index.ts`            |
| Teste             | `kebab-case` | `format-time.test.ts` |

### Identificadores

| Elemento                      | Padrão                 | Exemplo                    |
| ----------------------------- | ---------------------- | -------------------------- |
| Componente                    | `PascalCase`           | `PomodoroTimer`            |
| Type / interface              | `PascalCase`           | `RootStackParamList`       |
| Hook                          | `use` + `camelCase`    | `usePomodoroSettings`      |
| Função                        | `camelCase`            | `formatTime`               |
| Objeto em escopo de módulo    | `camelCase`            | `theme`, `routes`          |
| Primitivo em escopo de módulo | `SCREAMING_SNAKE_CASE` | `TOTAL_STEPS`              |
| Variável dentro de função     | `camelCase`            | `completedSteps`           |
| Valores de union de string    | `kebab-case`           | `"focus" \| "short-break"` |

O prefixo `use` em minúsculo é obrigatório: o `react-hooks/rules-of-hooks`
identifica hooks por ele. Uma função chamada `UseTimer` é tratada como
componente e deixa de ser validada.

---

## 5. Imports

Imports entre camadas usam o alias `@/`. Caminhos relativos ficam restritos a
arquivos da mesma pasta de tela.

```ts
import { theme } from "@/theme";
import { PomodoroTimer } from "./components/PomodoroTimer";
```

---

## 6. Estilo

Cor, fonte e tamanho de fonte sempre vêm do `theme`:

```ts
color: theme.colors.text,
fontSize: theme.fontSizes.body,
fontFamily: theme.fonts.interBold,
```

Espaçamento, raio e espessura de borda são definidos no próprio componente. O
tema não expõe tokens de `spacing`/`radius`. A consistência desses valores vem
do reuso de componentes compartilhados.

Estilos são declarados com `StyleSheet.create` no fim do arquivo. Estilos não
utilizados são sinalizados pelo `eslint-plugin-react-native`.

---

## 7. Ambiente

O repositório usa `core.ignorecase = false`. Como arquivos de componente são
`PascalCase`, isso garante que renomeações que só mudam maiúsculas/minúsculas
sejam registradas no Windows e não quebrem o build em Linux (EAS Build). Em um
clone novo:

```bash
git config core.ignorecase false
```
