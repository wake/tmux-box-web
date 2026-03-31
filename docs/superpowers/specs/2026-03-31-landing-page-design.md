# tmux-box Landing Page Design Spec

> Date: 2026-03-31

## Overview

tmux-box 的官方介紹網站。單頁捲動式結構，介紹產品功能，並提供入口導向獨立部署的 SPA。

**定位：** 務實、不浮誇。面向已經在用 terminal 做 AI 開發的工程師。強調既有技術的貼心整合，而非突破性創新。

## Architecture

```
tmux-box-web/                ← 本 repo（Astro 專案）
├── src/
│   ├── layouts/             ← BaseLayout（theme toggle + i18n + meta）
│   ├── pages/
│   │   └── index.astro      ← 單頁捲動式介紹
│   ├── components/          ← Hero, Features, HowItWorks, Screenshots, UnderTheHood, Footer
│   ├── styles/              ← 從 tmux-box/spa 移植的語義 CSS tokens（dark/light）
│   └── locales/             ← en.json + zh-TW.json
├── public/                  ← 截圖、favicon、OG image
├── astro.config.mjs         ← Cloudflare Pages adapter
└── package.json
```

### Key Decisions

- **框架：** Astro + Tailwind CSS
- **部署：** Cloudflare Pages
- **SPA 嵌入方式：** `/app` 路由由 Cloudflare Pages `_redirects` 做 302 到獨立部署的 SPA（訪客自行輸入 daemon 地址）
- **主題：** 從 tmux-box SPA 移植 21 個語義 CSS tokens，支援深色/亮色切換
- **語系：** 中英雙語（en + zh-TW），Astro 靜態產出或 client-side island 切換
- **SPA onboarding：** 暫不處理，SPA 已有 host 管理功能

## Theme System

從 `tmux-box/spa` 移植的 21 個語義 CSS token，分 6 組：

| Group | Tokens |
|-------|--------|
| Surface | primary, secondary, tertiary, elevated, hover, active, input |
| Text | primary, secondary, muted, inverse |
| Border | default, active, subtle |
| Accent | base, hover, muted |
| Terminal | background, foreground, cursor |
| Status | error, warning, success |

內建 Dark / Light 兩個主題，透過 CSS variables 切換。

## i18n

- 結構：`src/locales/en.json` + `src/locales/zh-TW.json`
- 切換方式：Footer 語系切換按鈕（client-side JS island）
- 預設語系：英文

## Page Sections

### 1. Hero

- **Tagline (en):** "Tame your AI terminals."
- **Tagline (zh-TW):** 「馴服你的 AI 終端機。」
- **Subtitle (en):** A tmux-based workspace for the AI agent era — manage sessions across machines, track agent status at a glance, and never lose context when connections drop.
- **CTA buttons:**
  - [Open App] → `/app` (302 redirect to SPA)
  - [GitHub →] → `https://github.com/wake/tmux-box`
- **Visual:** 全幅截圖，展示多 tab、session panel、連線狀態（使用 `demo-connected.png` 或重新截圖）

### 2. Features — 5 cards

以 grid 佈局呈現（桌面 2-3 欄，行動裝置 1 欄）。

#### ① Cross-Machine Sessions

**en:** Install the daemon on any machine, add it as a host, and its tmux sessions appear as local tabs — complete with full PTY relay and automatic session discovery.

**概念：** 安裝 daemon → 加 host → 遠端 session 變本地 tab

#### ② Agent Status at a Glance

**en:** Tab indicators show each agent's state — running, waiting for input, or errored. Unread badges and desktop notifications keep you informed without switching tabs.

**概念：** Tab 燈號 + 未讀 badge + 桌面通知

#### ③ Seamless Reconnection

**en:** Built on tmux. Connections drop, pages reload, laptops sleep — open the page and every tab, split, and workflow is exactly where you left it.

**概念：** tmux 為基礎，斷線自動恢復

#### ④ Drag Files to Remote Agents

**en:** Drop an image or document onto the terminal. It uploads to the remote host and injects the file path into the active agent session — cross-machine file sharing in one gesture.

**概念：** 拖曳上傳 → 注入路徑到 agent

#### ⑤ Fully Themeable

**en:** 21 semantic design tokens, 4 built-in themes, a live theme editor with import/export, and full bilingual support (English + Traditional Chinese) with custom locale creation.

**概念：** 主題系統 + i18n

### 3. How It Works — 3 steps

簡潔的圖解或 icon 步驟。

1. **Install** — Single Go binary. `tbox serve` starts the daemon. `tbox setup` wires up Claude Code hooks.
2. **Add hosts** — Point the web UI at your daemon address. Each host auto-discovers its tmux sessions.
3. **Work** — Tabs open. Agents run. Notifications arrive. Drag files across machines. Pick up on any device.

### 4. Screenshots

2-3 張實際截圖，深色背景襯托：

- **Terminal mode** — 多 tab 介面 + session panel + 連線狀態
- **Agent indicators** — Tab 燈號 + 未讀提示 + 通知
- **Themes / Settings** — 主題編輯器或設定介面

可用的現有素材：
- `tmux-box/demo-connected.png`
- `tmux-box/demo-disconnected.png`
- `tmux-box/stream-ui-demo-full.png`（stream 模式截圖，本次不使用）

### 5. Under the Hood

面向想深入了解技術架構的開發者。簡潔條列：

- **Go daemon** — Modular architecture with 5 pluggable modules, SQLite WAL storage, WebSocket pub-sub, token authentication
- **React SPA** — React 19, Zustand state management, xterm.js 6 terminal emulation, Tailwind CSS 4
- **Electron shell** — Multi-window with tear-off/merge, system tray, browser pane memory management, native keyboard shortcuts
- **Hook system** — 9 Claude Code lifecycle events feed real-time status indicators, zero polling

### 6. Footer

- [Open App →] — `/app` redirect
- [GitHub] — repo link
- Version badge — 從 VERSION 檔讀取或手動維護
- Language toggle — EN / 中文
- Theme toggle — Dark / Light

## Excluded Features

以下功能**不在本次介紹範圍**：

- Terminal ↔ Stream mode switching / handoff（功能未確定是否上線）
- Stream mode conversation UI
- SPA onboarding wizard（SPA 已有 host 管理，暫不另做）

## Technical Notes

### Cloudflare Pages Redirect

```
# public/_redirects
/app  https://app.tmux-box.dev  302
```

（實際 SPA 部署 URL 待定）

### Build & Deploy

```bash
pnpm install
pnpm build          # astro build
# Output: dist/     → deploy to Cloudflare Pages
```

### Development

```bash
pnpm dev            # astro dev
```

### Dependencies

- astro
- @astrojs/cloudflare (adapter)
- tailwindcss v4
- @tailwindcss/vite
