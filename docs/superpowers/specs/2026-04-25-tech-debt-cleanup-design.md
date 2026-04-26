# Tech Debt Cleanup — Design Spec

**Date:** 2026-04-25
**Status:** Approved
**Scope:** Refactor portfolio codebase to eliminate 4 technical debt items

## Context

Portfolio personal de Carlos Gonzalez (goncar.me). Stack: Astro 5 SSG + TypeScript strict + Sass + Zod. Deployed on Vercel.

The codebase has accumulated 4 tech debt items that hurt maintainability and professionalism:

1. `index.astro` is ~378 lines / ~33k tokens due to 13 inline SVGs
2. Tag styling is inconsistent between `Card.astro` (fixed purple gradient) and `[...slug].astro` (per-technology color map)
3. Project content (7 Markdown files) exists only in Spanish despite the site supporting ES/EN
4. English translation has a typo: "Habilities" instead of "Skills"

## Approach

**Enfoque A: Componentizacion Granular** — maximize reuse, single responsibility per file, easy to maintain and extend.

## Execution Order

4 (typo) → 2 (tag colors) → 1 (SVG extraction) → 3 (i18n content)

Rationale: trivial fix first, then unify tags (touches files also modified in i18n), then SVG extraction (independent), finally i18n (broadest change) to minimize conflicts.

---

## Section 1: SVG Skill Icons Extraction

### Problem

`src/pages/[lang]/index.astro` contains 13 inline SVGs for technology skills, making it ~33k tokens and unmaintainable.

### Solution

Extract each SVG into an individual Astro component under `src/components/icons/`:

```
src/components/icons/
  Html.astro
  Css.astro
  Sass.astro
  Javascript.astro
  React.astro
  Node.astro
  Mysql.astro
  Postgresql.astro
  Photoshop.astro
  Illustrator.astro
  AdobeXd.astro
  Github.astro
  Git.astro
  ClaudeCode.astro    ← NEW skill (SVG provided by user)
```

Each component exports the raw SVG. `index.astro` imports them and renders in a clean list:

```astro
<ul class="link-cards">
  <li><Html /><h2>HTML</h2></li>
  <li><Css /><h2>CSS</h2></li>
  <!-- ... -->
  <li><ClaudeCode /><h2>Claude Code</h2></li>
</ul>
```

### Design Decisions

- SVGs remain inline (not `<img>` references) so they can be styled with CSS and the developer can learn SVG internals
- One file per icon for maximum single-responsibility
- `ClaudeCode.astro` is added as a new 14th skill icon using the Anthropic brand SVG (orange `#D97757`)

### Files Affected

- `src/pages/[lang]/index.astro` — remove inline SVGs, add imports
- 14 new files in `src/components/icons/`

---

## Section 2: Unified Tag Color System

### Problem

Two different tag styling systems exist:
- `Card.astro` (project list): fixed purple gradient for all tags
- `[...slug].astro` (project detail): per-technology color map (`tagColors`)

### Solution

Create a shared utility:

```
src/utils/tag-colors.ts
```

```ts
export const tagColors: Record<string, { bg: string; text: string; border: string }> = {
  JavaScript: { bg: "#f7df1e", text: "#000", border: "#f7df1e" },
  HTML:       { bg: "#e34f26", text: "#fff", border: "#e34f26" },
  CSS:        { bg: "#264de4", text: "#fff", border: "#2965f1" },
  React:      { bg: "#61dafb", text: "#000", border: "#61dafb" },
  Vite:       { bg: "#646cff", text: "#fff", border: "#646cff" },
  API:        { bg: "#10b981", text: "#fff", border: "#10b981" },
  Canvas:     { bg: "#f59e0b", text: "#000", border: "#f59e0b" },
};

const fallback = { bg: "#667eea", text: "#fff", border: "#764ba2" };

export function getTagStyle(tag: string): string {
  const colors = tagColors[tag] || fallback;
  return `background: ${colors.bg}; color: ${colors.text}; border: 1px solid ${colors.border};`;
}
```

Both `Card.astro` and `[...slug].astro` import `getTagStyle` and apply it via inline `style` attribute. The hardcoded gradient in `Card.astro` and the duplicated map in `[...slug].astro` are removed.

### Files Affected

- New: `src/utils/tag-colors.ts`
- Modified: `src/components/Card.astro` — import `getTagStyle`, remove gradient CSS
- Modified: `src/pages/[lang]/projects/[...slug].astro` — import `getTagStyle`, remove local `tagColors` map

---

## Section 3: Project Content Internationalization

### Problem

All 7 project Markdown files are in Spanish and display identically for both ES and EN routes.

### Solution

Restructure content collections with language subcarpetas:

```
src/content/projects/
  es/
    tic-tac-toe.md
    omdbapi-movie.md
    apiDog.md
    apiDocReact.md
    Video-Game.md
    to-do.md
    openWeather.md
  en/
    tic-tac-toe.md
    omdbapi-movie.md
    apiDog.md
    apiDocReact.md
    Video-Game.md
    to-do.md
    openWeather.md
```

### Changes Required

1. Move existing `.md` files to `projects/es/`
2. Create EN versions with translated `title`, `description`, and body content
3. Update `.config.ts` — remove legacy `layout` field from schema
4. Update `Projects.astro` — filter collection by lang prefix (`post.id.startsWith(lang + '/')`)
5. Update `[...slug].astro` — filter `getStaticPaths` to match lang with file prefix, adjust slug generation

### Translation Scope

All 7 projects: frontmatter (`title`, `description`) + body content translated to English.

### Files Affected

- 7 existing `.md` files moved to `es/` subfolder
- 7 new `.md` files created in `en/` subfolder
- Modified: `src/content/.config.ts`
- Modified: `src/pages/[lang]/Projects.astro`
- Modified: `src/pages/[lang]/projects/[...slug].astro`

---

## Section 4: Typo Fix

### Problem

`src/i18n/ui.ts` line 42: `'home.title': 'Habilities'` should be `'Skills'`.

### Fix

```diff
- 'home.title': 'Habilities',
+ 'home.title': 'Skills',
```

### Files Affected

- `src/i18n/ui.ts`
