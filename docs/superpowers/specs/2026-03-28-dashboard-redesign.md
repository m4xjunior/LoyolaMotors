# Dashboard Loyola Motors — Redesign Spec

## Objetivo

Portar os componentes reais do dashboard shadcn v4 (https://github.com/shadcn-ui/ui/tree/e56c4761054362cb2190579eb2222d0b5336ad7e/apps/v4/app/(examples)/dashboard) para o projeto Loyola Motors, substituindo a implementação genérica atual. Aplicar a identidade visual Loyola Motors extraída do site público.

## Princípio

**Usar os componentes do repositório shadcn v4 como base, não como inspiração.** Portar a estrutura real (section-cards.tsx, chart-area-interactive.tsx, data-table.tsx) adaptando:
- Next.js → React Router (sem server components, sem cookies)
- Tabler Icons → Phosphor Icons (já usados no projeto)
- Dados genéricos → serviços existentes do projeto (servicioClientes, etc.)
- Tema default → Design System Loyola Motors

## Componentes a Portar do Repositório Shadcn V4

### 1. SectionCards (section-cards.tsx → TarjetasSeccion)
**Fonte:** `apps/v4/app/(examples)/dashboard/components/section-cards.tsx`

Portar fielmente:
- Grid responsivo com `@container` queries (`@xl:grid-cols-2`, `@5xl:grid-cols-4`)
- Cada card usa `Card` + `CardHeader` + `CardAction` + `CardFooter`
- `CardAction` contém `Badge` com ícone de tendência e percentagem
- `CardFooter` com texto descritivo + ícone de tendência
- Gradiente: `from-primary/5 to-card` (dark variant)

**Adaptações Loyola:**
- Ícones: Phosphor Icons (Users, Car, Clock, CheckCircle) em vez de Tabler
- Dados: estatísticas de `servicioClientes.obtenerTodos()`, `servicioServicios.obtenerTodos()`, `servicioVehiculos.obtenerTodos()`
- Valores sem dados: mostrar `0` (estado real), não dados fictícios
- Tipografia valores: `font-[family-name:var(--fuente-datos)]` (Fira Code)

### 2. ChartAreaInteractive (chart-area-interactive.tsx → GraficoAreaInteractivo)
**Fonte:** `apps/v4/app/(examples)/dashboard/components/chart-area-interactive.tsx`

Portar fielmente:
- `Card` com `CardHeader` + `CardAction` contendo toggle de período
- `ToggleGroup` (desktop) / `Select` (mobile) — switch via `@container` query a 767px
- `ChartContainer` + `AreaChart` recharts com áreas empilhadas
- Gradient fills com `linearGradient` (stop-opacity 0.3 → 0.1)
- `CartesianGrid vertical={false}`, `XAxis` com tickFormatter de datas
- `ChartTooltip` com `ChartTooltipContent` e `labelFormatter`

**Adaptações Loyola:**
- Series: "Servicios" (cor `var(--primary)` = #DC2626) + "Facturado" (cor `var(--info)` = #3B82F6)
- Dados: agrega por dia a partir de `servicioServicios.obtenerTodos()`
- Formato datas: `dd MMM` em espanhol (`date-fns/locale/es`)
- Períodos: 90 días / 30 días / 7 días

### 3. DataTable (data-table.tsx → TablaServicios)
**Fonte:** `apps/v4/app/(examples)/dashboard/components/data-table.tsx`

Portar a estrutura de Tabs + Table (SEM drag-and-drop, SEM inline edit):
- `Tabs` com `TabsList` + `TabsTrigger` (com contadores em badges)
- `Table` + `TableHeader` + `TableBody` + `TableRow` + `TableHead` + `TableCell`
- `Badge variant="outline"` com classes semânticas por estado
- Responsive: tabela com scroll horizontal

**Adaptações Loyola:**
- Tabs: "Servicios" (contador), "Clientes" (contador), "Vehiculos" (contador)
- Colunas Servicios: Cliente, Servicio, Estado (badge), Fecha, Valor
- Colunas Clientes: Nombre, Email, Teléfono
- Colunas Vehiculos: Marca/Modelo, Matrícula, Cliente
- Status badges: cores semânticas `--exito` (completado), `--advertencia` (en_proceso), `--peligro` (pendiente)
- Empty state por tab: ícone + mensagem

## Design System Loyola Motors (extraído do site público)

### Cores
```
--primary: #DC2626          (vermelho Loyola)
--background: #0F172A       (slate-900, fundo admin)
--card: #1E293B             (slate-800, cards)
--border: #334155           (slate-700, bordas)
--foreground: #F8FAFC       (texto principal)
--muted-foreground: #94A3B8 (texto secundário)
--exito: #22C55E            (verde, completado)
--advertencia: #F59E0B      (amarelo, en proceso)
--peligro: #EF4444          (vermelho, pendiente)
--info: #3B82F6             (azul, info)
--acento: #FF3D24           (laranja-vermelho, accent secundário)
```

### Tipografia
```
--fuente-encabezado: 'Inter', sans-serif     (headings, 600-700)
--fuente-cuerpo: 'Fira Sans', sans-serif     (body, 400-500)
--fuente-datos: 'Fira Code', monospace       (valores numéricos, tabular-nums)
```

### Efeitos
- Cards: `bg-gradient-to-br from-primary/5 to-card`
- Hover: `transition-all duration-300`, `hover:-translate-y-0.5`, `hover:border-primary/30`
- Sombras: `shadow-lg shadow-black/20` (cards), accent glow `shadow-[0_4px_12px_rgba(220,38,38,0.3)]` (botões)
- Border-radius: `rounded-xl` (12px) para cards, `rounded-lg` (10px) para inputs/buttons
- Transições: `cubic-bezier(0.25, 0.8, 0.25, 1)` para transforms

## Componentes shadcn/ui Já Instalados (reutilizar, NÃO criar novos)

Card, Badge, Button, Table, Tabs, ToggleGroup, Select, ChartContainer, ChartTooltip, Skeleton, Progress, Separator

## Serviços de Dados Existentes (reutilizar)

- `servicioClientes.obtenerTodos()` → lista de clientes
- `servicioServicios.obtenerTodos()` → lista de serviços (com estado, costo, fecha)
- `servicioVehiculos.obtenerTodos()` → lista de veículos

## Arquivos a Modificar

- `src/paginas/PaginaPanel.jsx` — reescrita completa (único arquivo)

## Fora de Escopo

- Drag-and-drop na tabela (dnd-kit)
- Inline editing de células
- Drawer de detalhes de row
- Zod schema validation
- Criação de novos componentes em arquivos separados
- Refactoring de helpers em outros arquivos
- Mudanças no sidebar ou layout
