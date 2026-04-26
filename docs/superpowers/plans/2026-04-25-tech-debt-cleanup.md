# Tech Debt Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate 4 technical debt items to improve maintainability and professionalism of the goncar.me portfolio.

**Architecture:** Extract 14 SVG icon components from a monolithic page, unify tag color system into a shared utility, restructure content collections for bilingual support, and fix a typo.

**Tech Stack:** Astro 5, TypeScript, Zod, Content Collections

---

## File Structure

### New Files
- `src/utils/tag-colors.ts` — shared tag color map and `getTagStyle()` function
- `src/components/icons/Html.astro` — HTML SVG icon
- `src/components/icons/Css.astro` — CSS SVG icon
- `src/components/icons/Sass.astro` — Sass SVG icon
- `src/components/icons/Javascript.astro` — JavaScript SVG icon
- `src/components/icons/React.astro` — React SVG icon
- `src/components/icons/Node.astro` — Node.js SVG icon
- `src/components/icons/Mysql.astro` — MySQL SVG icon
- `src/components/icons/Postgresql.astro` — PostgreSQL SVG icon
- `src/components/icons/Photoshop.astro` — Adobe Photoshop SVG icon
- `src/components/icons/Illustrator.astro` — Adobe Illustrator SVG icon
- `src/components/icons/AdobeXd.astro` — Adobe XD SVG icon
- `src/components/icons/Github.astro` — GitHub SVG icon
- `src/components/icons/Git.astro` — Git SVG icon
- `src/components/icons/ClaudeCode.astro` — Claude Code SVG icon (NEW skill)
- `src/content/projects/es/tic-tac-toe.md` — (moved from root)
- `src/content/projects/es/omdbapi-movie.md` — (moved from root)
- `src/content/projects/es/apiDog.md` — (moved from root)
- `src/content/projects/es/apiDocReact.md` — (moved from root)
- `src/content/projects/es/Video-Game.md` — (moved from root)
- `src/content/projects/es/to-do.md` — (moved from root)
- `src/content/projects/es/openWeather.md` — (moved from root)
- `src/content/projects/en/tic-tac-toe.md` — English translation
- `src/content/projects/en/omdbapi-movie.md` — English translation
- `src/content/projects/en/apiDog.md` — English translation
- `src/content/projects/en/apiDocReact.md` — English translation
- `src/content/projects/en/Video-Game.md` — English translation
- `src/content/projects/en/to-do.md` — English translation
- `src/content/projects/en/openWeather.md` — English translation

### Modified Files
- `src/i18n/ui.ts` — fix "Habilities" typo
- `src/components/Card.astro` — import `getTagStyle`, replace gradient CSS
- `src/pages/[lang]/projects/[...slug].astro` — import `getTagStyle`, remove local map, update i18n queries
- `src/pages/[lang]/index.astro` — replace inline SVGs with component imports
- `src/pages/[lang]/Projects.astro` — update collection query to filter by lang
- `src/content/.config.ts` — remove legacy `layout` field

---

## Task 1: Fix "Habilities" typo

**Files:**
- Modify: `src/i18n/ui.ts:42`

- [ ] **Step 1: Fix the typo**

In `src/i18n/ui.ts`, change line 42:

```typescript
// Before:
'home.title': 'Habilities',

// After:
'home.title': 'Skills',
```

- [ ] **Step 2: Commit**

```bash
git add src/i18n/ui.ts
git commit -m "fix: correct 'Habilities' typo to 'Skills' in EN translation"
```

---

## Task 2: Create shared tag color utility

**Files:**
- Create: `src/utils/tag-colors.ts`

- [ ] **Step 1: Create the utility file**

Create `src/utils/tag-colors.ts`:

```typescript
export const tagColors: Record<string, { bg: string; text: string; border: string }> = {
  JavaScript: { bg: "#f7df1e", text: "#000", border: "#f7df1e" },
  HTML: { bg: "#e34f26", text: "#fff", border: "#e34f26" },
  CSS: { bg: "#264de4", text: "#fff", border: "#2965f1" },
  React: { bg: "#61dafb", text: "#000", border: "#61dafb" },
  Vite: { bg: "#646cff", text: "#fff", border: "#646cff" },
  API: { bg: "#10b981", text: "#fff", border: "#10b981" },
  Canvas: { bg: "#f59e0b", text: "#000", border: "#f59e0b" },
};

const fallback = { bg: "#667eea", text: "#fff", border: "#764ba2" };

export function getTagStyle(tag: string): string {
  const colors = tagColors[tag] || fallback;
  return `background: ${colors.bg}; color: ${colors.text}; border: 1px solid ${colors.border};`;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/tag-colors.ts
git commit -m "feat: add shared tag color utility"
```

---

## Task 3: Update Card.astro to use shared tag colors

**Files:**
- Modify: `src/components/Card.astro`

- [ ] **Step 1: Import getTagStyle and apply it**

In `src/components/Card.astro`, add the import in the frontmatter:

```astro
---
import { getLangFromUrl } from "@i18n/utils";
import { getTagStyle } from "@utils/tag-colors";

const lang = getLangFromUrl(Astro.url);
interface Props {
	title: string;
	body: string;
	tags: string[];
	slug: string;
}

const { tags, title, body, slug } = Astro.props;
---
```

- [ ] **Step 2: Apply inline style to tags**

Change the tag rendering from:

```astro
<span class="tag">{tag}</span>
```

To:

```astro
<span class="tag" style={getTagStyle(tag)}>{tag}</span>
```

- [ ] **Step 3: Remove the hardcoded gradient from the .tag CSS**

Replace the `.tag` style block:

```css
/* Before: */
.tag {
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	padding: 0.25rem 0.75rem;
	border-radius: 9999px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* After: */
.tag {
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	padding: 0.25rem 0.75rem;
	border-radius: 9999px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Card.astro
git commit -m "refactor: use shared tag colors in Card component"
```

---

## Task 4: Update [...slug].astro to use shared tag colors

**Files:**
- Modify: `src/pages/[lang]/projects/[...slug].astro`

- [ ] **Step 1: Replace local tagColors with import**

In the frontmatter, remove the local `tagColors` map and `getTagStyle` function (lines 26-45). Replace with:

```astro
import { getTagStyle } from "@utils/tag-colors";
```

The full updated frontmatter imports section becomes:

```astro
---
import { ClientRouter } from "astro:transitions";
import { getCollection, render } from "astro:content";
import Header from "@components/Header.astro";
import Footer from "@components/Footer.astro";
import Social from "@components/Social.astro";
import Base from "@layouts/Base.astro";
import { useTranslations } from "@i18n/utils";
import { getTagStyle } from "@utils/tag-colors";

export async function getStaticPaths() {
    const posts = await getCollection("projects");
    const langs = ["es", "en"];

    return posts.flatMap((post) =>
        langs.map((lang) => ({
            params: { lang, slug: post.id.replace(/\.md$/, "") },
            props: { post, lang },
        })),
    );
}

const { post, lang } = Astro.props;
const { Content } = await render(post);
const translation = useTranslations(lang as "es" | "en");
---
```

The template already uses `getTagStyle(tag)` in the `style` attribute, so no template changes needed.

- [ ] **Step 2: Verify the dev server shows colored tags on project detail pages**

Run `pnpm dev` and navigate to a project detail page (e.g., `/es/projects/tic-tac-toe`). Confirm tags display with per-technology colors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/[lang]/projects/[...slug].astro
git commit -m "refactor: use shared tag colors in project detail page"
```

---

## Task 5: Extract SVG icons to individual components

**Files:**
- Create: `src/components/icons/Html.astro`
- Create: `src/components/icons/Css.astro`
- Create: `src/components/icons/Sass.astro`
- Create: `src/components/icons/Javascript.astro`
- Create: `src/components/icons/React.astro`
- Create: `src/components/icons/Node.astro`
- Create: `src/components/icons/Mysql.astro`
- Create: `src/components/icons/Postgresql.astro`
- Create: `src/components/icons/Photoshop.astro`
- Create: `src/components/icons/Illustrator.astro`
- Create: `src/components/icons/AdobeXd.astro`
- Create: `src/components/icons/Github.astro`
- Create: `src/components/icons/Git.astro`
- Create: `src/components/icons/ClaudeCode.astro`

- [ ] **Step 1: Create all 14 icon components**

Each icon component is a `.astro` file containing only the SVG extracted from `index.astro`. The SVG should spread `{...Astro.props}` to allow passing attributes.

**`src/components/icons/Html.astro`:**
```astro
<svg height="800px" width="800px" viewBox="0 0 512 512" {...Astro.props}>
	<path fill="#e34f26" d="M71 460L30 0h451l-41 460-185 52"></path>
	<path fill="#ef652a" d="M256 472l149-41 35-394H256"></path>
	<path fill="#ebebeb" d="M256 208h-75l-5-58h80V94H114l15 171h127zm-1 147l-63-17-4-45h-56l7 89 116 32z"></path>
	<path fill="#ffffff" d="M255 208v57h70l-7 73-63 17v59l116-32 16-174zm0-114v56h137l5-56z"></path>
</svg>
```

**`src/components/icons/Css.astro`:**
```astro
<svg height="800px" width="800px" viewBox="0 0 512 512" {...Astro.props}>
	<path fill="#264de4" d="M72 460L30 0h451l-41 460-184 52"></path>
	<path fill="#2965f1" d="M256 37V472l149-41 35-394"></path>
	<path fill="#ebebeb" d="m114 94h142v56H119m5 58h132v57H129m3 28h56l4 45 64 17v59L139 382"></path>
	<path fill="#ffffff" d="m256 208v57h69l-7 73-62 17v59l115-32 26-288H256v56h80l-5.5 58Z"></path>
</svg>
```

**`src/components/icons/Sass.astro`:**
Copy the full Sass SVG from `index.astro` lines 71-77. The SVG has a single `<path>` with `style="fill:#cd6799"`.

**`src/components/icons/Javascript.astro`:**
Copy the full JavaScript SVG from `index.astro` lines 81-107. This SVG uses `viewBox="-20 80 330 350"` and contains a `<g>` with transform.

**`src/components/icons/React.astro`:**
Copy the full React SVG from `index.astro` lines 111-126. Two paths with `fill="#53C1DE"`.

**`src/components/icons/Node.astro`:**
Copy the full Node.js SVG from `index.astro` lines 131-153. This is a special case — it uses a base64-encoded PNG inside an SVG pattern. Copy it exactly as-is.

**`src/components/icons/Mysql.astro`:**
Copy the full MySQL SVG from `index.astro` lines 157-171. Two paths with `fill="#00546B"`.

**`src/components/icons/Postgresql.astro`:**
Copy the full PostgreSQL SVG from `index.astro` lines 175-212. Contains a `<g>` with 3 paths (black, blue `#336791`, and white).

**`src/components/icons/Photoshop.astro`:**
Copy the full Photoshop SVG from `index.astro` lines 217-233. Two paths with `fill="#31A8FF"` on a `#001E36` background.

**`src/components/icons/Illustrator.astro`:**
Copy the full Illustrator SVG from `index.astro` lines 239-255. Two paths with `fill="#FF9A00"` on a `#330000` background.

**`src/components/icons/AdobeXd.astro`:**
Copy the full Adobe XD SVG from `index.astro` lines 261-276. Two paths with `fill="#FF61F6"` on a `#470137` background.

**`src/components/icons/Github.astro`:**
Copy the full GitHub SVG from `index.astro` lines 282-295. Single path with `fill="#fff"`.

**`src/components/icons/Git.astro`:**
Copy the full Git SVG from `index.astro` lines 299-309. Single path with `fill="#DE4C36"`.

**`src/components/icons/ClaudeCode.astro`:**
```astro
<svg preserveAspectRatio="xMidYMid" viewBox="0 0 256 257" {...Astro.props}>
	<path fill="#D97757" d="m50.228 170.321 50.357-28.257.843-2.463-.843-1.361h-2.462l-8.426-.518-28.775-.778-24.952-1.037-24.175-1.296-6.092-1.297L0 125.796l.583-3.759 5.12-3.434 7.324.648 16.202 1.101 24.304 1.685 17.629 1.037 26.118 2.722h4.148l.583-1.685-1.426-1.037-1.101-1.037-25.147-17.045-27.22-18.017-14.258-10.37-7.713-5.25-3.888-4.925-1.685-10.758 7-7.713 9.397.649 2.398.648 9.527 7.323 20.35 15.75L94.817 91.9l3.889 3.24 1.555-1.102.195-.777-1.75-2.917-14.453-26.118-15.425-26.572-6.87-11.018-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0 82.05 1.426l4.472 3.888 6.61 15.101 10.694 23.786 16.591 32.34 4.861 9.592 2.592 8.879.973 2.722h1.685v-1.556l1.36-18.211 2.528-22.36 2.463-28.776.843-8.1 4.018-9.722 7.971-5.25 6.222 2.981 5.12 7.324-.713 4.73-3.046 19.768-5.962 30.98-3.889 20.739h2.268l2.593-2.593 10.499-13.934 17.628-22.036 7.778-8.749 9.073-9.657 5.833-4.601h11.018l8.1 12.055-3.628 12.443-11.342 14.388-9.398 12.184-13.48 18.147-8.426 14.518.778 1.166 2.01-.194 30.46-6.481 16.462-2.982 19.637-3.37 8.88 4.148.971 4.213-3.5 8.62-20.998 5.184-24.628 4.926-36.682 8.685-.454.324.519.648 16.526 1.555 7.065.389h17.304l32.21 2.398 8.426 5.574 5.055 6.805-.843 5.184-12.962 6.611-17.498-4.148-40.83-9.721-14-3.5h-1.944v1.167l11.666 11.406 21.387 19.314 26.767 24.887 1.36 6.157-3.434 4.86-3.63-.518-23.526-17.693-9.073-7.972-20.545-17.304h-1.36v1.814l4.73 6.935 25.017 37.59 1.296 11.536-1.814 3.76-6.481 2.268-7.13-1.297-14.647-20.544-15.1-23.138-12.185-20.739-1.49.843-7.194 77.448-3.37 3.953-7.778 2.981-6.48-4.925-3.436-7.972 3.435-15.749 4.148-20.544 3.37-16.333 3.046-20.285 1.815-6.74-.13-.454-1.49.194-15.295 20.999-23.267 31.433-18.406 19.702-4.407 1.75-7.648-3.954.713-7.064 4.277-6.286 25.47-32.405 15.36-20.092 9.917-11.6-.065-1.686h-.583L44.07 198.125l-12.055 1.555-5.185-4.86.648-7.972 2.463-2.593 20.35-13.999-.064.065Z"></path>
</svg>
```

**Important:** Every icon component must spread `{...Astro.props}` on the root `<svg>` element to allow passing class, style, or other attributes from the parent.

- [ ] **Step 2: Commit icon components**

```bash
git add src/components/icons/
git commit -m "feat: extract SVG skill icons into individual components"
```

---

## Task 6: Refactor index.astro to use icon components

**Files:**
- Modify: `src/pages/[lang]/index.astro`

- [ ] **Step 1: Update the frontmatter with icon imports**

Replace the current frontmatter (lines 1-14) with:

```astro
---
import Layout from "@layouts/Layout.astro";
import Header from "@components/Header.astro";
import Hero from "@components/Hero.astro";
import Footer from "@components/Footer.astro";
import { useTranslations } from "@i18n/utils";

import Html from "@components/icons/Html.astro";
import Css from "@components/icons/Css.astro";
import Sass from "@components/icons/Sass.astro";
import Javascript from "@components/icons/Javascript.astro";
import ReactIcon from "@components/icons/React.astro";
import Node from "@components/icons/Node.astro";
import Mysql from "@components/icons/Mysql.astro";
import Postgresql from "@components/icons/Postgresql.astro";
import Photoshop from "@components/icons/Photoshop.astro";
import Illustrator from "@components/icons/Illustrator.astro";
import AdobeXd from "@components/icons/AdobeXd.astro";
import Github from "@components/icons/Github.astro";
import Git from "@components/icons/Git.astro";
import ClaudeCode from "@components/icons/ClaudeCode.astro";

export function getStaticPaths() {
	return [{ params: { lang: "es" } }, { params: { lang: "en" } }];
}

const { lang } = Astro.params;
const translation = useTranslations(lang as "es" | "en");
---
```

Note: React import is named `ReactIcon` to avoid conflicts with the React namespace.

- [ ] **Step 2: Replace the skills section body**

Replace all the `<ul class="link-cards">` blocks (lines 31-310) with:

```astro
<ul class="link-cards">
	<li class="link-cards"><Html /><h2>HTML</h2></li>
</ul>
<ul class="link-cards">
	<li class="link-cards"><Css /><h2>CSS</h2></li>
</ul>
<ul class="link-cards">
	<li class="link-cards"><Sass /><h2>SASS</h2></li>
</ul>
<ul class="link-cards">
	<li class="link-cards"><Javascript /><h2>JavaScript</h2></li>
</ul>
<ul class="link-cards">
	<li class="link-cards"><ReactIcon /><h2>React.js</h2></li>
</ul>
<ul class="link-cards">
	<li class="link-cards"><Node /><h2>Node.JS</h2></li>
</ul>
<ul class="link-cards">
	<li class="link-cards"><Mysql /><h2>MySQL</h2></li>
</ul>
<ul class="link-cards">
	<li class="link-cards"><Postgresql /><h2>PostgreSQL</h2></li>
</ul>
<ul class="link-cards">
	<li class="link-cards"><Photoshop /><h2>Adobe Photoshop</h2></li>
</ul>
<ul class="link-cards">
	<li class="link-cards"><Illustrator /><h2>Adobe Illustrator</h2></li>
</ul>
<ul class="link-cards">
	<li class="link-cards"><AdobeXd /><h2>Adobe XD</h2></li>
</ul>
<ul class="link-cards">
	<li class="link-cards"><Github /><h2>GitHub</h2></li>
</ul>
<ul class="link-cards">
	<li class="link-cards"><Git /><h2>Git</h2></li>
</ul>
<ul class="link-cards">
	<li class="link-cards"><ClaudeCode /><h2>Claude Code</h2></li>
</ul>
```

The `<style>` section (lines 319-377) remains unchanged.

- [ ] **Step 3: Verify the dev server renders all skill icons correctly**

Run `pnpm dev` and navigate to `/es/`. Confirm all 14 icons render with the grayscale filter and hover-to-color effect. Verify Claude Code icon appears as the last skill.

- [ ] **Step 4: Commit**

```bash
git add src/pages/[lang]/index.astro
git commit -m "refactor: replace inline SVGs with icon components in index page"
```

---

## Task 7: Restructure content collections for i18n

**Files:**
- Move: `src/content/projects/*.md` to `src/content/projects/es/`
- Create: `src/content/projects/en/*.md` (7 translated files)
- Modify: `src/content/.config.ts`

- [ ] **Step 1: Create es/ directory and move existing files**

```bash
mkdir -p src/content/projects/es
git mv src/content/projects/tic-tac-toe.md src/content/projects/es/
git mv src/content/projects/omdbapi-movie.md src/content/projects/es/
git mv src/content/projects/apiDog.md src/content/projects/es/
git mv src/content/projects/apiDocReact.md src/content/projects/es/
git mv src/content/projects/Video-Game.md src/content/projects/es/
git mv src/content/projects/to-do.md src/content/projects/es/
git mv src/content/projects/openWeather.md src/content/projects/es/
```

- [ ] **Step 2: Remove legacy `layout` field from schema**

In `src/content/.config.ts`, remove the `layout` line:

```typescript
import { defineCollection, z } from "astro:content";

const projects = defineCollection({
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        description: z.string(),
        image: z.string().optional(),
        link: z.string().optional(),
        tags: z.array(z.string()),
        slug: z.string().optional(),
    }),
});

export const collections = {
    projects,
};
```

- [ ] **Step 3: Remove `layout` field from all ES markdown frontmatter**

In each of the 7 files under `src/content/projects/es/`, remove the `layout: "../../layouts/Posts.astro"` line from the frontmatter.

- [ ] **Step 4: Create English translations**

Create `src/content/projects/en/` directory and 7 translated files:

**`src/content/projects/en/tic-tac-toe.md`:**
```markdown
---
title: 'Tic-Tac-Toe'
pubDate: 04-07-2023
description: 'The classic tic-tac-toe game, also known as noughts and crosses'
image: '/tictactoe.png'
link: 'https://ta-te-ti-pi.vercel.app/'
tags: ['JavaScript', 'HTML', 'CSS']
---

Tic-Tac-Toe, also known as noughts and crosses, is a paper-and-pencil game for two players: O and X, who take turns marking spaces on a 3x3 grid.
```

**`src/content/projects/en/omdbapi-movie.md`:**
```markdown
---
title: 'OMDb API - Movie'
pubDate: 12-06-2023
description: 'Mobile application where you can browse information about different movies and series'
image: '/omdbapi.png'
link: 'https://goncar29.github.io/omdbapi-movie/'
tags: ['JavaScript', 'HTML', 'CSS', 'API']
---

The OMDb API is a RESTful web service to obtain movie information. This is a mobile application where you can browse general information about different movies, including ratings and details. You can also save your favorites.
```

**`src/content/projects/en/apiDog.md`:**
```markdown
---
title: 'ApiDog'
pubDate: 06-11-2022
description: 'Web page for browsing dog images'
image: '/apidog.png'
link: 'https://goncar29.github.io/api-rest-thedogapi/'
tags: ['JavaScript', 'API']
---

On this page you can upload photos of your pet and browse many others randomly. The page also lets you save images to a favorites list.
```

**`src/content/projects/en/apiDocReact.md`:**
```markdown
---
title: 'ApiDoc'
pubDate: 16-10-2023
description: 'Website for contacting doctors'
image: '/apiDoc.png'
link: 'https://api-doc-react.vercel.app/'
tags: ['React', 'Vite', 'CSS']
---

On this website you can view detailed information about doctors, contact them and see their contact details. You can add them to a favorites list for easier searching.
```

**`src/content/projects/en/Video-Game.md`:**
```markdown
---
title: 'Video-Game'
pubDate: 25-11-2022
description: 'Mini game with three levels'
image: '/videogame.png'
link: 'https://goncar29.github.io/video-games-js/'
tags: ['JavaScript', 'Canvas']
---

A small three-level game where you must follow the path without straying, racing against the clock. If you win, you can try again and see if you beat your own record.
```

**`src/content/projects/en/to-do.md`:**
```markdown
---
title: 'TO-DO'
pubDate: 17-07-2023
description: 'Application to organize and list things to do'
image: '/TO-DO.png'
link: 'https://goncar29.github.io/introReact/'
tags: ['React', 'Vite', 'CSS']
---

To-Do is a local web application that helps you organize your day-to-day by managing, prioritizing, and achieving your goals. Besides completing tasks, you can edit them, mark them as done, and delete them.
```

**`src/content/projects/en/openWeather.md`:**
```markdown
---
title: 'openWeather'
pubDate: 14-02-2022
description: 'Weather web application'
image: '/openweathermap.png'
link: 'https://goncar29.github.io/openweathermap/'
tags: ['JavaScript', 'HTML', 'CSS', 'API']
---

OpenWeather is a web application for obtaining weather information. It displays climate data for any specified city, including current conditions and forecasts.
```

- [ ] **Step 5: Commit**

```bash
git add src/content/
git commit -m "feat: restructure project content for i18n with ES/EN translations"
```

---

## Task 8: Update Projects.astro to filter by language

**Files:**
- Modify: `src/pages/[lang]/Projects.astro`

- [ ] **Step 1: Update collection query to filter by lang**

Replace the posts query (lines 16-21) with:

```astro
const posts = (await getCollection("projects"))
    .filter((post) => post.id.startsWith(`${lang}/`))
    .map((post) => ({
        ...post,
        slug: post.data.slug || post.id.replace(/\.md$/, "").replace(`${lang}/`, ""),
    }))
    .sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());
```

This filters projects by the current language prefix and strips the lang prefix from the slug so URLs stay clean (e.g., `/es/projects/tic-tac-toe` not `/es/projects/es/tic-tac-toe`).

- [ ] **Step 2: Commit**

```bash
git add src/pages/[lang]/Projects.astro
git commit -m "feat: filter project collection by language in Projects page"
```

---

## Task 9: Update [...slug].astro for i18n content

**Files:**
- Modify: `src/pages/[lang]/projects/[...slug].astro`

- [ ] **Step 1: Update getStaticPaths to use lang-prefixed content**

Replace the current `getStaticPaths` function with:

```typescript
export async function getStaticPaths() {
    const posts = await getCollection("projects");
    const langs = ["es", "en"];

    return posts
        .filter((post) => langs.some((lang) => post.id.startsWith(`${lang}/`)))
        .map((post) => {
            const lang = post.id.split("/")[0];
            const slug = post.id.replace(/\.md$/, "").replace(`${lang}/`, "");
            return {
                params: { lang, slug },
                props: { post, lang },
            };
        });
}
```

This maps each lang-prefixed content file to the correct route. For example, `es/tic-tac-toe.md` generates the route `/es/projects/tic-tac-toe`.

- [ ] **Step 2: Verify the dev server shows translated content**

Run `pnpm dev`. Navigate to:
- `/es/Projects` — should show Spanish titles/descriptions
- `/en/Projects` — should show English titles/descriptions
- Click into a project detail in both languages to verify content is translated

- [ ] **Step 3: Commit**

```bash
git add src/pages/[lang]/projects/[...slug].astro
git commit -m "feat: update project detail routes for i18n content"
```

---

## Task 10: Final verification

- [ ] **Step 1: Run the dev server and verify all pages**

```bash
pnpm dev
```

Check:
1. `/es/` — all 14 skill icons render (including Claude Code), "Habilidades" heading
2. `/en/` — all 14 skill icons render, "Skills" heading (not "Habilities")
3. `/es/Projects` — 7 projects with Spanish descriptions, per-technology colored tags
4. `/en/Projects` — 7 projects with English descriptions, per-technology colored tags
5. `/es/projects/tic-tac-toe` — Spanish content, colored tags
6. `/en/projects/tic-tac-toe` — English content, colored tags

- [ ] **Step 2: Run astro check**

```bash
pnpm astro check
```

Fix any TypeScript errors if they appear.

- [ ] **Step 3: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: address issues found during verification"
```
