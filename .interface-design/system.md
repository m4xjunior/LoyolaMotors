# Loyola Motors — Design System

## Intent

**Who:** Owner/manager of a car body repair and paint shop (chapa y pintura) in Valencia, Spain. Opens the panel between jobs, needs fast situational awareness. Not a tech person — a craftsman running a business.

**Task:** See at a glance what cars are in the shop, job statuses, pending invoices, incoming appointments. Quick actions: register client, open service order, check invoices.

**Feel:** Professional workshop tool. The precision of bodywork alignment. The controlled dark of a paint booth interior. Warm confidence of a local business that knows its craft. Not a Silicon Valley dashboard — a Spanish taller's command center.

## Direction

**Domain:** Taller mecânico, cabina de pintura, chapa y pintura, orden de trabajo, peritaje, presupuesto, facturación, entrega de vehículo.

**Signature:** Accent glow — warm light spilling from under a car being worked at night. The red is not arbitrary brand color; it's the color of taillight assemblies the shop repairs every day. Appears as: subtle glow on primary buttons, hover border warmth on cards, gradient blush on stat cards.

## Palette

### Primitives

```
--taller-fondo:          #0F172A    /* paint booth interior — deep controlled dark */
--taller-superficie:     #1E293B    /* elevated workbench — one step above floor */
--taller-borde:          #334155    /* tool rack edges — visible but quiet */
--taller-tinta:          #F8FAFC    /* invoice paper — crisp white text */
--taller-tinta-suave:    #94A3B8    /* pencil notes — secondary information */
--taller-tinta-apagada:  #64748B    /* faded labels — tertiary, metadata */
```

### Brand

```
--taller-rojo:           #DC2626    /* brake light red — primary actions, identity */
--taller-rojo-resplandor: rgba(220, 38, 38, 0.3)  /* accent glow — the signature */
--taller-acento:         #FF3D24    /* welding spark — secondary warm accent */
```

### Semantic

```
--taller-completado:     #22C55E    /* green status light — work done */
--taller-en-proceso:     #F59E0B    /* amber warning — in progress */
--taller-pendiente:      #EF4444    /* red alert — needs attention */
--taller-info:           #3B82F6    /* diagnostic screen blue — informational */
```

### Status Badge Pattern

```
completado:  bg-[var(--exito)]/10  text-[var(--exito)]  border-[var(--exito)]/30
en_proceso:  bg-[var(--advertencia)]/10  text-[var(--advertencia)]  border-[var(--advertencia)]/30
pendiente:   bg-[var(--peligro)]/10  text-[var(--peligro)]  border-[var(--peligro)]/30
```

Opacity `/10` for backgrounds. `/30` for borders. Consistent across all status indicators.

## Depth

**Strategy: Borders + accent glow (hybrid)**

Dark interfaces need borders for definition — shadows disappear on dark backgrounds. But the Loyola signature is the warm glow, so primary actions get accent-colored shadows.

```
cards:          border-border (quiet edge)
cards hover:    border-primary/30 (warm reveal)
primary button: shadow-[0_4px_12px_rgba(220,38,38,0.3)] (accent glow — the signature)
inputs:         border-border, slightly inset feel
```

No decorative shadows. No dramatic elevation jumps. Borders do the structural work. Glow does the emotional work.

## Surfaces

```
Level 0 (floor):     --taller-fondo       #0F172A    /* page background */
Level 1 (bench):     --taller-superficie   #1E293B    /* cards, panels */
Level 2 (tool):      #334155                          /* dropdowns, popovers */
```

Cards at Level 1 get gradient blush: `bg-gradient-to-br from-primary/5 to-card` — the subtlest warmth, like reflected taillight on a dark surface. You feel it more than see it.

Sidebar: same dark family as canvas (#0F172A), NOT a contrasting color. Border separates, not background.

## Typography

```
--fuente-encabezado: 'Inter', sans-serif
  WHY: Tight, precise, geometric. Like technical specifications on a repair order.
  Weight: 600-700. Tight tracking (-0.02em).

--fuente-cuerpo: 'Fira Sans', sans-serif
  WHY: Humanist but professional. Readable on screens, warm without being soft.
  Weight: 400-500.

--fuente-datos: 'Fira Code', monospace
  WHY: Tabular figures align in columns. Prices, dates, plate numbers need alignment.
  Always paired with tabular-nums.
```

### Hierarchy

```
Page title:    text-3xl  font-bold  tracking-tight  --fuente-encabezado
Section title: text-base font-semibold              --fuente-encabezado
Card label:    text-sm   font-medium                --fuente-cuerpo
Card value:    text-2xl  font-bold  tabular-nums    --fuente-datos
Body:          text-sm                              --fuente-cuerpo
Metadata:      text-xs   text-muted-foreground      --fuente-cuerpo
Data cells:    text-sm   tabular-nums               --fuente-datos
```

## Spacing

**Base: 4px**

Scale: 4, 8, 12, 16, 20, 24, 32 (Tailwind: 1, 2, 3, 4, 5, 6, 8)

```
Component gap (within cards):     gap-1 to gap-2   (4-8px)
Section gap (between components): gap-4 to gap-6   (16-24px)
Page sections:                    gap-6             (24px)
Card padding:                     shadcn defaults (CardHeader/Content/Footer)
```

No values off this grid. `ml-1.5` (6px) is a violation — use `ml-1` (4px) or `ml-2` (8px).

## Border Radius

```
Cards:          rounded-xl    (12px)  — substantial but precise, like smoothed panel edges
Inputs/Buttons: rounded-lg    (10px)  — slightly tighter
Badges:         rounded-md    (6px)   — compact
Pills/Avatars:  rounded-full          — circular
```

Sharp enough to feel technical. Round enough to feel human. The precision of bodywork — no rough edges, but not bubbly.

## Transitions

```
Duration:   300ms (cards, surfaces), 200ms (controls, micro-interactions)
Easing:     cubic-bezier(0.25, 0.8, 0.25, 1) for transforms
Hover:      -translate-y-0.5 on cards (subtle lift, like checking under the hood)
```

No spring/bounce. Professional interfaces don't bounce. Smooth deceleration — like a hydraulic lift settling into position.

## Patterns

### Stat Card (Section Cards)

```jsx
<Card className="bg-gradient-to-br from-primary/5 to-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30">
  <CardHeader>
    <CardDescription>{label}</CardDescription>
    <Badge variant="outline" className="bg-[semantic]/10 text-[semantic]">
      <TrendIcon /> {percentage}%
    </Badge>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold font-[family-name:var(--fuente-datos)] tabular-nums">
      {value}
    </div>
  </CardContent>
  <CardFooter>{description}</CardFooter>
</Card>
```

### Interactive Chart

Card with border-b header. ToggleGroup (desktop) + Select (mobile) for time ranges. Area chart with gradient fills (stop-opacity 0.3 → 0.1). Grid: dashed, no vertical lines. Tooltip with Spanish date formatting.

### Data Table with Tabs

Tabs inside Card. TabsTrigger with count badges (Badge variant="secondary", text-[10px]). Table with semantic status badges. Values right-aligned in monospace. Empty states with Phosphor duotone icon + message + subtitle.

### Primary Button

```
bg-primary text-white shadow-[0_4px_12px_rgba(220,38,38,0.3)]
```

The accent glow is the signature. Every primary action carries a whisper of warm light.
