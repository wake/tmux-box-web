# tmux-box Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the tmux-box official landing page — a single-page scrolling site with dark/light theme toggle and bilingual (en/zh-TW) support.

**Architecture:** Astro static site with Tailwind CSS v4 via `@tailwindcss/vite` plugin. Theme tokens migrated from `tmux-box/spa`. i18n via a lightweight client-side Astro island. Deployed to Cloudflare Pages as pure static HTML — no SSR adapter needed. `/app` redirects to separately deployed SPA via `_redirects`.

**Tech Stack:** Astro 5, Tailwind CSS 4, @tailwindcss/vite, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-31-landing-page-design.md`

---

## File Structure

```
tmux-box-web/
├── astro.config.mjs              ← Astro config (vite plugin for Tailwind)
├── tsconfig.json                 ← TypeScript config
├── package.json                  ← Dependencies and scripts
├── public/
│   ├── _redirects                ← Cloudflare Pages /app redirect
│   ├── favicon.svg               ← Favicon
│   └── screenshots/
│       ├── demo-connected.png    ← Copied from tmux-box repo
│       └── demo-disconnected.png ← Copied from tmux-box repo
├── src/
│   ├── styles/
│   │   └── global.css            ← Tailwind import + theme tokens (dark/light)
│   ├── locales/
│   │   ├── en.json               ← English strings
│   │   └── zh-TW.json            ← Traditional Chinese strings
│   ├── lib/
│   │   └── i18n.ts               ← t() helper + locale types
│   ├── layouts/
│   │   └── BaseLayout.astro      ← HTML shell, meta tags, global CSS, OG tags
│   ├── components/
│   │   ├── ThemeToggle.astro     ← Dark/light toggle (inline script, no island)
│   │   ├── LangToggle.astro      ← EN/中文 toggle (inline script, no island)
│   │   ├── Hero.astro            ← Hero section
│   │   ├── Features.astro        ← 5-card feature grid
│   │   ├── HowItWorks.astro      ← 3-step guide
│   │   ├── Screenshots.astro     ← Screenshot gallery
│   │   ├── UnderTheHood.astro    ← Technical highlights
│   │   └── Footer.astro          ← Footer with links + toggles
│   └── pages/
│       └── index.astro           ← Assembles all sections
└── .gitignore
```

**Key decisions:**
- Theme toggle and lang toggle use Astro inline `<script>` tags (not React islands) — zero JS framework overhead.
- i18n works client-side: page renders English by default, `<script>` swaps `textContent` on elements with `data-i18n` attributes when locale changes.
- No `@astrojs/cloudflare` adapter — pure static output.

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `public/_redirects`
- Create: `public/favicon.svg`

- [ ] **Step 1: Initialize Astro project and install dependencies**

```bash
cd /Users/wake/Workspace/wake/tmux-box-web
pnpm create astro@latest . -- --template minimal --install --no-git --typescript strict
```

If interactive prompts appear, answer: no template (minimal), strict TypeScript, install dependencies yes, no git init.

Then install Tailwind:

```bash
pnpm add -D tailwindcss @tailwindcss/vite
```

- [ ] **Step 2: Configure Astro with Tailwind v4**

Overwrite `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
})
```

- [ ] **Step 3: Create .gitignore**

Overwrite `.gitignore`:

```
node_modules/
dist/
.astro/
.DS_Store
```

- [ ] **Step 4: Create Cloudflare Pages redirect**

Write `public/_redirects`:

```
/app  https://app.tmux-box.dev  302
```

- [ ] **Step 5: Create favicon**

Write `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="4" fill="#7a6aaa"/>
  <text x="16" y="22" font-family="monospace" font-size="18" fill="white" text-anchor="middle">T</text>
</svg>
```

- [ ] **Step 6: Verify project builds**

```bash
pnpm build
```

Expected: Build succeeds, `dist/` directory created.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro project with Tailwind v4"
```

---

### Task 2: Theme System

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create global CSS with theme tokens**

Write `src/styles/global.css`:

```css
@import "tailwindcss";

/* === Tailwind v4 token mapping === */
@theme {
  --color-surface-primary: var(--surface-primary);
  --color-surface-secondary: var(--surface-secondary);
  --color-surface-tertiary: var(--surface-tertiary);
  --color-surface-elevated: var(--surface-elevated);
  --color-surface-hover: var(--surface-hover);
  --color-surface-active: var(--surface-active);
  --color-surface-input: var(--surface-input);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--text-muted);
  --color-text-inverse: var(--text-inverse);
  --color-border-default: var(--border-default);
  --color-border-active: var(--border-active);
  --color-border-subtle: var(--border-subtle);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-accent-muted: var(--accent-muted);
  --color-status-error: var(--status-error);
  --color-status-warning: var(--status-warning);
  --color-status-success: var(--status-success);
}

/* === Dark (default) === */
[data-theme="dark"] {
  --surface-primary: #0a0a1a;
  --surface-secondary: #12122a;
  --surface-tertiary: #08081a;
  --surface-elevated: #1e1e3e;
  --surface-hover: #1a1a32;
  --surface-active: #272444;
  --surface-input: #2a2a2a;
  --text-primary: #e0e0e0;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  --text-inverse: #0a0a1a;
  --border-default: #404040;
  --border-active: #7a6aaa;
  --border-subtle: #2a2a2a;
  --accent: #7a6aaa;
  --accent-hover: #8a7aba;
  --accent-muted: rgba(122, 106, 170, 0.3);
  --status-error: #e06c75;
  --status-warning: #c8b560;
  --status-success: #2a4a3a;
}

/* === Light === */
[data-theme="light"] {
  --surface-primary: #f5f5f5;
  --surface-secondary: #e8e8e8;
  --surface-tertiary: #f0f0f0;
  --surface-elevated: #ffffff;
  --surface-hover: #e0e0e0;
  --surface-active: #d4d0e8;
  --surface-input: #ffffff;
  --text-primary: #1a1a2e;
  --text-secondary: #4a4a5a;
  --text-muted: #8a8a9a;
  --text-inverse: #f5f5f5;
  --border-default: #d0d0d0;
  --border-active: #6a5a9a;
  --border-subtle: #e0e0e0;
  --accent: #6a5a9a;
  --accent-hover: #5a4a8a;
  --accent-muted: rgba(106, 90, 154, 0.15);
  --status-error: #fce4e4;
  --status-warning: #fef3cd;
  --status-success: #d4edda;
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build
```

Expected: Build succeeds with theme CSS processed.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add theme system with dark/light CSS tokens"
```

---

### Task 3: i18n System

**Files:**
- Create: `src/locales/en.json`
- Create: `src/locales/zh-TW.json`
- Create: `src/lib/i18n.ts`

- [ ] **Step 1: Create English locale**

Write `src/locales/en.json`:

```json
{
  "hero.tagline": "Tame your AI terminals.",
  "hero.subtitle": "A tmux-based workspace for the AI agent era — manage sessions across machines, track agent status at a glance, and never lose context when connections drop.",
  "hero.cta.app": "Open App",
  "hero.cta.github": "GitHub",

  "features.title": "Features",
  "features.sessions.title": "Cross-Machine Sessions",
  "features.sessions.desc": "Install the daemon on any machine, add it as a host, and its tmux sessions appear as local tabs — complete with full PTY relay and automatic session discovery.",
  "features.status.title": "Agent Status at a Glance",
  "features.status.desc": "Tab indicators show each agent's state — running, waiting for input, or errored. Unread badges and desktop notifications keep you informed without switching tabs.",
  "features.reconnect.title": "Seamless Reconnection",
  "features.reconnect.desc": "Built on tmux. Connections drop, pages reload, laptops sleep — open the page and every tab, split, and workflow is exactly where you left it.",
  "features.upload.title": "Drag Files to Remote Agents",
  "features.upload.desc": "Drop an image or document onto the terminal. It uploads to the remote host and injects the file path into the active agent session — cross-machine file sharing in one gesture.",
  "features.theme.title": "Fully Themeable",
  "features.theme.desc": "21 semantic design tokens, 4 built-in themes, a live theme editor with import/export, and full bilingual support with custom locale creation.",

  "howItWorks.title": "How It Works",
  "howItWorks.step1.title": "Install",
  "howItWorks.step1.desc": "Single Go binary. tbox serve starts the daemon. tbox setup wires up Claude Code hooks.",
  "howItWorks.step2.title": "Add Hosts",
  "howItWorks.step2.desc": "Point the web UI at your daemon address. Each host auto-discovers its tmux sessions.",
  "howItWorks.step3.title": "Work",
  "howItWorks.step3.desc": "Tabs open. Agents run. Notifications arrive. Drag files across machines. Pick up on any device.",

  "screenshots.title": "See It in Action",

  "underTheHood.title": "Under the Hood",
  "underTheHood.daemon.title": "Go Daemon",
  "underTheHood.daemon.desc": "Modular architecture with 5 pluggable modules, SQLite WAL storage, WebSocket pub-sub, token authentication.",
  "underTheHood.spa.title": "React SPA",
  "underTheHood.spa.desc": "React 19, Zustand state management, xterm.js 6 terminal emulation, Tailwind CSS 4.",
  "underTheHood.electron.title": "Electron Shell",
  "underTheHood.electron.desc": "Multi-window with tear-off/merge, system tray, browser pane memory management, native keyboard shortcuts.",
  "underTheHood.hooks.title": "Hook System",
  "underTheHood.hooks.desc": "9 Claude Code lifecycle events feed real-time status indicators, zero polling.",

  "footer.openApp": "Open App",
  "footer.version": "Version",

  "lang.en": "EN",
  "lang.zhTW": "中文",
  "theme.dark": "Dark",
  "theme.light": "Light"
}
```

- [ ] **Step 2: Create Traditional Chinese locale**

Write `src/locales/zh-TW.json`:

```json
{
  "hero.tagline": "馴服你的 AI 終端機。",
  "hero.subtitle": "基於 tmux 的平台化工作環境，為 AI Agent 時代打造 — 跨主機管理 session、即時追蹤 agent 狀態、斷線後無縫恢復。",
  "hero.cta.app": "開始使用",
  "hero.cta.github": "GitHub",

  "features.title": "功能特色",
  "features.sessions.title": "跨主機 Session",
  "features.sessions.desc": "在任意主機安裝 daemon、加入 host，遠端的 tmux session 就會出現在本地分頁中 — 完整 PTY 中繼與自動 session 探索。",
  "features.status.title": "Agent 狀態一目了然",
  "features.status.desc": "分頁燈號顯示每個 agent 的即時狀態 — 執行中、等待輸入或錯誤。未讀標記和桌面通知讓你不用切換分頁就能掌握進度。",
  "features.reconnect.title": "無縫重新連線",
  "features.reconnect.desc": "基於 tmux。斷線、重新整理、筆電休眠 — 重新開啟頁面，所有分頁、分割和工作流程都還在原位。",
  "features.upload.title": "拖曳檔案到遠端 Agent",
  "features.upload.desc": "將圖片或文件拖曳到終端機視窗。檔案上傳到遠端主機後，路徑自動注入到 agent session — 一個動作完成跨主機檔案傳遞。",
  "features.theme.title": "完整主題系統",
  "features.theme.desc": "21 個語義設計 token、4 套內建主題、即時主題編輯器支援匯入匯出，以及完整的中英雙語支援與自訂語系功能。",

  "howItWorks.title": "使用方式",
  "howItWorks.step1.title": "安裝",
  "howItWorks.step1.desc": "單一 Go 執行檔。tbox serve 啟動 daemon。tbox setup 自動設定 Claude Code hooks。",
  "howItWorks.step2.title": "加入主機",
  "howItWorks.step2.desc": "在 Web 介面中輸入 daemon 位址，每台主機自動探索其 tmux session。",
  "howItWorks.step3.title": "開始工作",
  "howItWorks.step3.desc": "分頁開啟。Agent 執行。通知送達。跨主機拖曳檔案。在任何裝置接續作業。",

  "screenshots.title": "實際畫面",

  "underTheHood.title": "技術架構",
  "underTheHood.daemon.title": "Go Daemon",
  "underTheHood.daemon.desc": "模組化架構，5 個可插拔模組、SQLite WAL 儲存、WebSocket pub-sub、token 驗證。",
  "underTheHood.spa.title": "React SPA",
  "underTheHood.spa.desc": "React 19、Zustand 狀態管理、xterm.js 6 終端機模擬、Tailwind CSS 4。",
  "underTheHood.electron.title": "Electron Shell",
  "underTheHood.electron.desc": "多視窗 tear-off/merge、系統匣、瀏覽器面板記憶體管理、原生鍵盤快捷鍵。",
  "underTheHood.hooks.title": "Hook 系統",
  "underTheHood.hooks.desc": "9 個 Claude Code 生命週期事件驅動即時狀態指標，零輪詢。",

  "footer.openApp": "開始使用",
  "footer.version": "版本",

  "lang.en": "EN",
  "lang.zhTW": "中文",
  "theme.dark": "深色",
  "theme.light": "淺色"
}
```

- [ ] **Step 3: Create i18n helper**

Write `src/lib/i18n.ts`:

```ts
import en from '../locales/en.json'
import zhTW from '../locales/zh-TW.json'

const locales: Record<string, Record<string, string>> = { en, 'zh-TW': zhTW }

export type Locale = 'en' | 'zh-TW'
export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALES: Locale[] = ['en', 'zh-TW']

export function t(key: string, locale: Locale = DEFAULT_LOCALE): string {
  return locales[locale]?.[key] ?? locales.en[key] ?? key
}

export function getAllTranslations(): Record<Locale, Record<string, string>> {
  return locales as Record<Locale, Record<string, string>>
}
```

- [ ] **Step 4: Verify build**

```bash
pnpm build
```

- [ ] **Step 5: Commit**

```bash
git add src/locales/ src/lib/i18n.ts
git commit -m "feat: add i18n system with en and zh-TW locales"
```

---

### Task 4: Base Layout + Theme/Lang Toggles

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/ThemeToggle.astro`
- Create: `src/components/LangToggle.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create ThemeToggle component**

Write `src/components/ThemeToggle.astro`:

```astro
---
// Inline script handles toggle — no framework needed
---
<button
  id="theme-toggle"
  type="button"
  class="px-3 py-1.5 text-sm rounded border border-border-default text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer"
  aria-label="Toggle theme"
>
  <span id="theme-label-dark" class="hidden">Dark</span>
  <span id="theme-label-light" class="hidden">Light</span>
</button>

<script is:inline>
(function() {
  const stored = localStorage.getItem('tbox-theme')
  const theme = stored === 'light' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', theme)
  updateLabels(theme)

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme')
    const next = current === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('tbox-theme', next)
    updateLabels(next)
  })

  function updateLabels(t) {
    const dark = document.getElementById('theme-label-dark')
    const light = document.getElementById('theme-label-light')
    if (dark) dark.classList.toggle('hidden', t !== 'light')
    if (light) light.classList.toggle('hidden', t !== 'dark')
  }
})()
</script>
```

- [ ] **Step 2: Create LangToggle component**

Write `src/components/LangToggle.astro`:

```astro
---
import { getAllTranslations } from '../lib/i18n'
const allTranslations = getAllTranslations()
---
<button
  id="lang-toggle"
  type="button"
  class="px-3 py-1.5 text-sm rounded border border-border-default text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer"
  aria-label="Toggle language"
>
  <span id="lang-label">EN</span>
</button>

<script is:inline define:vars={{ allTranslations }}>
(function() {
  const stored = localStorage.getItem('tbox-lang')
  const lang = stored === 'zh-TW' ? 'zh-TW' : 'en'
  applyLocale(lang)

  document.getElementById('lang-toggle')?.addEventListener('click', () => {
    const current = localStorage.getItem('tbox-lang') || 'en'
    const next = current === 'en' ? 'zh-TW' : 'en'
    localStorage.setItem('tbox-lang', next)
    applyLocale(next)
  })

  function applyLocale(locale) {
    const strings = allTranslations[locale] || allTranslations['en']
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n')
      if (key && strings[key]) el.textContent = strings[key]
    })
    const label = document.getElementById('lang-label')
    if (label) label.textContent = locale === 'en' ? 'EN' : '中文'
    document.documentElement.setAttribute('lang', locale === 'zh-TW' ? 'zh-Hant-TW' : 'en')
  }
})()
</script>
```

- [ ] **Step 3: Create BaseLayout**

Write `src/layouts/BaseLayout.astro`:

```astro
---
import '../styles/global.css'

interface Props {
  title: string
  description: string
}

const { title, description } = Astro.props
---
<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <title>{title}</title>
  {/* Apply stored theme before paint to prevent flash */}
  <script is:inline>
    (function() {
      const t = localStorage.getItem('tbox-theme')
      if (t === 'light') document.documentElement.setAttribute('data-theme', 'light')
    })()
  </script>
</head>
<body class="bg-surface-primary text-text-primary antialiased">
  <slot />
</body>
</html>
```

- [ ] **Step 4: Create minimal index page**

Overwrite `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
import ThemeToggle from '../components/ThemeToggle.astro'
import LangToggle from '../components/LangToggle.astro'
---
<BaseLayout title="tmux-box" description="A tmux-based workspace for the AI agent era.">
  <div class="min-h-screen flex items-center justify-center gap-4">
    <p class="text-text-secondary">tmux-box — scaffolding complete</p>
    <ThemeToggle />
    <LangToggle />
  </div>
</BaseLayout>
```

- [ ] **Step 5: Verify build and dev server**

```bash
pnpm build
```

Expected: Build succeeds. Optionally run `pnpm dev` and confirm theme toggle works.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/ src/components/ThemeToggle.astro src/components/LangToggle.astro src/pages/index.astro
git commit -m "feat: add BaseLayout with theme and language toggles"
```

---

### Task 5: Hero Section

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Copy screenshot to public/**

```bash
cp /Users/wake/Workspace/wake/tmux-box/demo-connected.png /Users/wake/Workspace/wake/tmux-box-web/public/screenshots/demo-connected.png
```

Create directory first if needed:

```bash
mkdir -p /Users/wake/Workspace/wake/tmux-box-web/public/screenshots
```

- [ ] **Step 2: Create Hero component**

Write `src/components/Hero.astro`:

```astro
---
---
<section class="relative px-6 py-24 md:py-32 max-w-5xl mx-auto text-center">
  <h1 class="text-4xl md:text-6xl font-bold tracking-tight" data-i18n="hero.tagline">
    Tame your AI terminals.
  </h1>
  <p class="mt-6 text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed" data-i18n="hero.subtitle">
    A tmux-based workspace for the AI agent era — manage sessions across machines, track agent status at a glance, and never lose context when connections drop.
  </p>
  <div class="mt-10 flex items-center justify-center gap-4">
    <a
      href="/app"
      class="px-6 py-3 rounded-lg bg-accent text-text-inverse font-medium hover:bg-accent-hover transition-colors"
      data-i18n="hero.cta.app"
    >
      Open App
    </a>
    <a
      href="https://github.com/wake/tmux-box"
      target="_blank"
      rel="noopener noreferrer"
      class="px-6 py-3 rounded-lg border border-border-default text-text-primary hover:bg-surface-hover transition-colors"
      data-i18n="hero.cta.github"
    >
      GitHub
    </a>
  </div>
  <div class="mt-16">
    <img
      src="/screenshots/demo-connected.png"
      alt="tmux-box interface showing multi-tab terminal with session panel"
      class="rounded-xl border border-border-subtle shadow-2xl mx-auto max-w-full"
    />
  </div>
</section>
```

- [ ] **Step 3: Wire Hero into index page**

Overwrite `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
import Hero from '../components/Hero.astro'
---
<BaseLayout title="tmux-box" description="A tmux-based workspace for the AI agent era.">
  <main>
    <Hero />
  </main>
</BaseLayout>
```

- [ ] **Step 4: Verify build**

```bash
pnpm build
```

- [ ] **Step 5: Commit**

```bash
git add public/screenshots/ src/components/Hero.astro src/pages/index.astro
git commit -m "feat: add Hero section with screenshot"
```

---

### Task 6: Features Section

**Files:**
- Create: `src/components/Features.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create Features component**

Write `src/components/Features.astro`:

```astro
---
const features = [
  {
    titleKey: 'features.sessions.title',
    titleDefault: 'Cross-Machine Sessions',
    descKey: 'features.sessions.desc',
    descDefault: 'Install the daemon on any machine, add it as a host, and its tmux sessions appear as local tabs — complete with full PTY relay and automatic session discovery.',
    icon: '⌘',
  },
  {
    titleKey: 'features.status.title',
    titleDefault: 'Agent Status at a Glance',
    descKey: 'features.status.desc',
    descDefault: 'Tab indicators show each agent\'s state — running, waiting for input, or errored. Unread badges and desktop notifications keep you informed without switching tabs.',
    icon: '●',
  },
  {
    titleKey: 'features.reconnect.title',
    titleDefault: 'Seamless Reconnection',
    descKey: 'features.reconnect.desc',
    descDefault: 'Built on tmux. Connections drop, pages reload, laptops sleep — open the page and every tab, split, and workflow is exactly where you left it.',
    icon: '↻',
  },
  {
    titleKey: 'features.upload.title',
    titleDefault: 'Drag Files to Remote Agents',
    descKey: 'features.upload.desc',
    descDefault: 'Drop an image or document onto the terminal. It uploads to the remote host and injects the file path into the active agent session — cross-machine file sharing in one gesture.',
    icon: '⇪',
  },
  {
    titleKey: 'features.theme.title',
    titleDefault: 'Fully Themeable',
    descKey: 'features.theme.desc',
    descDefault: '21 semantic design tokens, 4 built-in themes, a live theme editor with import/export, and full bilingual support with custom locale creation.',
    icon: '◐',
  },
]
---
<section class="px-6 py-24 max-w-5xl mx-auto">
  <h2 class="text-3xl font-bold text-center mb-16" data-i18n="features.title">Features</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {features.map((f) => (
      <div class="p-6 rounded-xl bg-surface-secondary border border-border-subtle">
        <div class="text-2xl mb-4 w-10 h-10 rounded-lg bg-accent-muted flex items-center justify-center text-accent">
          {f.icon}
        </div>
        <h3 class="text-lg font-semibold mb-2" data-i18n={f.titleKey}>{f.titleDefault}</h3>
        <p class="text-text-secondary text-sm leading-relaxed" data-i18n={f.descKey}>{f.descDefault}</p>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 2: Add Features to index page**

In `src/pages/index.astro`, add the import and component:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
import Hero from '../components/Hero.astro'
import Features from '../components/Features.astro'
---
<BaseLayout title="tmux-box" description="A tmux-based workspace for the AI agent era.">
  <main>
    <Hero />
    <Features />
  </main>
</BaseLayout>
```

- [ ] **Step 3: Verify build**

```bash
pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Features.astro src/pages/index.astro
git commit -m "feat: add Features section with 5 feature cards"
```

---

### Task 7: How It Works Section

**Files:**
- Create: `src/components/HowItWorks.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create HowItWorks component**

Write `src/components/HowItWorks.astro`:

```astro
---
const steps = [
  {
    num: '1',
    titleKey: 'howItWorks.step1.title',
    titleDefault: 'Install',
    descKey: 'howItWorks.step1.desc',
    descDefault: 'Single Go binary. tbox serve starts the daemon. tbox setup wires up Claude Code hooks.',
  },
  {
    num: '2',
    titleKey: 'howItWorks.step2.title',
    titleDefault: 'Add Hosts',
    descKey: 'howItWorks.step2.desc',
    descDefault: 'Point the web UI at your daemon address. Each host auto-discovers its tmux sessions.',
  },
  {
    num: '3',
    titleKey: 'howItWorks.step3.title',
    titleDefault: 'Work',
    descKey: 'howItWorks.step3.desc',
    descDefault: 'Tabs open. Agents run. Notifications arrive. Drag files across machines. Pick up on any device.',
  },
]
---
<section class="px-6 py-24 max-w-5xl mx-auto">
  <h2 class="text-3xl font-bold text-center mb-16" data-i18n="howItWorks.title">How It Works</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    {steps.map((s) => (
      <div class="text-center">
        <div class="w-12 h-12 rounded-full bg-accent text-text-inverse font-bold text-xl flex items-center justify-center mx-auto mb-4">
          {s.num}
        </div>
        <h3 class="text-lg font-semibold mb-2" data-i18n={s.titleKey}>{s.titleDefault}</h3>
        <p class="text-text-secondary text-sm leading-relaxed" data-i18n={s.descKey}>{s.descDefault}</p>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 2: Add HowItWorks to index page**

In `src/pages/index.astro`, add import and component after Features:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
import Hero from '../components/Hero.astro'
import Features from '../components/Features.astro'
import HowItWorks from '../components/HowItWorks.astro'
---
<BaseLayout title="tmux-box" description="A tmux-based workspace for the AI agent era.">
  <main>
    <Hero />
    <Features />
    <HowItWorks />
  </main>
</BaseLayout>
```

- [ ] **Step 3: Verify build**

```bash
pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/HowItWorks.astro src/pages/index.astro
git commit -m "feat: add How It Works section"
```

---

### Task 8: Screenshots Section

**Files:**
- Create: `src/components/Screenshots.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Copy additional screenshot**

```bash
cp /Users/wake/Workspace/wake/tmux-box/demo-disconnected.png /Users/wake/Workspace/wake/tmux-box-web/public/screenshots/demo-disconnected.png
```

- [ ] **Step 2: Create Screenshots component**

Write `src/components/Screenshots.astro`:

```astro
---
const images = [
  {
    src: '/screenshots/demo-connected.png',
    alt: 'tmux-box connected — multi-tab terminal with session panel and active connections',
  },
  {
    src: '/screenshots/demo-disconnected.png',
    alt: 'tmux-box reconnecting — automatic session recovery after connection drop',
  },
]
---
<section class="px-6 py-24 max-w-5xl mx-auto">
  <h2 class="text-3xl font-bold text-center mb-16" data-i18n="screenshots.title">See It in Action</h2>
  <div class="space-y-8">
    {images.map((img) => (
      <img
        src={img.src}
        alt={img.alt}
        class="rounded-xl border border-border-subtle shadow-lg mx-auto max-w-full"
        loading="lazy"
      />
    ))}
  </div>
</section>
```

- [ ] **Step 3: Add Screenshots to index page**

In `src/pages/index.astro`, add import and component after HowItWorks:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
import Hero from '../components/Hero.astro'
import Features from '../components/Features.astro'
import HowItWorks from '../components/HowItWorks.astro'
import Screenshots from '../components/Screenshots.astro'
---
<BaseLayout title="tmux-box" description="A tmux-based workspace for the AI agent era.">
  <main>
    <Hero />
    <Features />
    <HowItWorks />
    <Screenshots />
  </main>
</BaseLayout>
```

- [ ] **Step 4: Verify build**

```bash
pnpm build
```

- [ ] **Step 5: Commit**

```bash
git add public/screenshots/demo-disconnected.png src/components/Screenshots.astro src/pages/index.astro
git commit -m "feat: add Screenshots section"
```

---

### Task 9: Under the Hood Section

**Files:**
- Create: `src/components/UnderTheHood.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create UnderTheHood component**

Write `src/components/UnderTheHood.astro`:

```astro
---
const items = [
  {
    titleKey: 'underTheHood.daemon.title',
    titleDefault: 'Go Daemon',
    descKey: 'underTheHood.daemon.desc',
    descDefault: 'Modular architecture with 5 pluggable modules, SQLite WAL storage, WebSocket pub-sub, token authentication.',
  },
  {
    titleKey: 'underTheHood.spa.title',
    titleDefault: 'React SPA',
    descKey: 'underTheHood.spa.desc',
    descDefault: 'React 19, Zustand state management, xterm.js 6 terminal emulation, Tailwind CSS 4.',
  },
  {
    titleKey: 'underTheHood.electron.title',
    titleDefault: 'Electron Shell',
    descKey: 'underTheHood.electron.desc',
    descDefault: 'Multi-window with tear-off/merge, system tray, browser pane memory management, native keyboard shortcuts.',
  },
  {
    titleKey: 'underTheHood.hooks.title',
    titleDefault: 'Hook System',
    descKey: 'underTheHood.hooks.desc',
    descDefault: '9 Claude Code lifecycle events feed real-time status indicators, zero polling.',
  },
]
---
<section class="px-6 py-24 max-w-5xl mx-auto">
  <h2 class="text-3xl font-bold text-center mb-16" data-i18n="underTheHood.title">Under the Hood</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    {items.map((item) => (
      <div class="p-6 rounded-xl border border-border-subtle bg-surface-secondary">
        <h3 class="text-base font-semibold mb-2 text-accent" data-i18n={item.titleKey}>{item.titleDefault}</h3>
        <p class="text-text-secondary text-sm leading-relaxed" data-i18n={item.descKey}>{item.descDefault}</p>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 2: Add UnderTheHood to index page**

In `src/pages/index.astro`, add import and component after Screenshots:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
import Hero from '../components/Hero.astro'
import Features from '../components/Features.astro'
import HowItWorks from '../components/HowItWorks.astro'
import Screenshots from '../components/Screenshots.astro'
import UnderTheHood from '../components/UnderTheHood.astro'
---
<BaseLayout title="tmux-box" description="A tmux-based workspace for the AI agent era.">
  <main>
    <Hero />
    <Features />
    <HowItWorks />
    <Screenshots />
    <UnderTheHood />
  </main>
</BaseLayout>
```

- [ ] **Step 3: Verify build**

```bash
pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/UnderTheHood.astro src/pages/index.astro
git commit -m "feat: add Under the Hood section"
```

---

### Task 10: Footer Section

**Files:**
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create Footer component**

Write `src/components/Footer.astro`:

```astro
---
import ThemeToggle from './ThemeToggle.astro'
import LangToggle from './LangToggle.astro'
---
<footer class="px-6 py-12 border-t border-border-subtle">
  <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
    <div class="flex items-center gap-4">
      <a
        href="/app"
        class="px-5 py-2 rounded-lg bg-accent text-text-inverse font-medium hover:bg-accent-hover transition-colors text-sm"
        data-i18n="footer.openApp"
      >
        Open App
      </a>
      <a
        href="https://github.com/wake/tmux-box"
        target="_blank"
        rel="noopener noreferrer"
        class="text-text-secondary hover:text-text-primary transition-colors text-sm"
      >
        GitHub
      </a>
    </div>
    <div class="flex items-center gap-3">
      <span class="text-text-muted text-xs">
        <span data-i18n="footer.version">Version</span> 1.0.0-alpha.37
      </span>
      <ThemeToggle />
      <LangToggle />
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Add Footer to index page**

Final `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
import Hero from '../components/Hero.astro'
import Features from '../components/Features.astro'
import HowItWorks from '../components/HowItWorks.astro'
import Screenshots from '../components/Screenshots.astro'
import UnderTheHood from '../components/UnderTheHood.astro'
import Footer from '../components/Footer.astro'
---
<BaseLayout title="tmux-box" description="A tmux-based workspace for the AI agent era.">
  <main>
    <Hero />
    <Features />
    <HowItWorks />
    <Screenshots />
    <UnderTheHood />
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 3: Verify build**

```bash
pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.astro src/pages/index.astro
git commit -m "feat: add Footer with theme/lang toggles and links"
```

---

### Task 11: Final Verification

**Files:** None (verification only)

- [ ] **Step 1: Full build**

```bash
pnpm build
```

Expected: Clean build, no warnings. `dist/` contains `index.html` and assets.

- [ ] **Step 2: Preview locally**

```bash
pnpm preview
```

Open in browser. Verify:
- All 6 sections render correctly
- Theme toggle switches dark ↔ light
- Language toggle switches EN ↔ 中文
- All `data-i18n` elements update when switching language
- Screenshots load
- CTA links work (`/app` → redirect, GitHub → external)
- Responsive layout at mobile/tablet/desktop widths

- [ ] **Step 3: Check dist output**

```bash
ls -la dist/
```

Confirm `_redirects` is present in `dist/` (copied from `public/`).

- [ ] **Step 4: Commit any fixes**

If any issues found, fix and commit. Otherwise skip.
