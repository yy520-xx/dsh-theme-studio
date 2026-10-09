// dsh-theme-studio · client 入口
import { THEMES, DEFAULT_CONFIG, STORAGE_KEY } from './themes.js'
import { mountPanel } from './panel.js'

export const name = 'dsh-theme-studio'

const STYLE_ID = 'dsh-theme-studio-style'
const BG_ID = 'dsh-theme-studio-bg'

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
  } catch (e) { /* 忽略损坏配置 */ }
  return { ...DEFAULT_CONFIG }
}

function saveConfig(cfg) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg)) } catch (e) { /* 隐私模式等 */ }
}

// hex(#rgb/#rrggbb) 转 rgba
function hexToRgba(hex, a) {
  let h = (hex || '').replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  if (Number.isNaN(n) || h.length !== 6) return `rgba(0,0,0,${a})`
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

function buildCss(cfg) {
  const t = THEMES[cfg.theme] || THEMES.abyss
  const accent = cfg.accent || t.accent
  const accent2 = t.accent2 || accent
  const light = t.mode === 'light'

  // 背景层
  let bgImage = 'none'
  if (cfg.bgType === 'image' && cfg.bgImage) {
    bgImage = `url("${cfg.bgImage}")`
  } else if (cfg.bgType === 'gradient') {
    bgImage = cfg.gradient || t.gradient || `linear-gradient(160deg, ${t.surface}, ${t.bg})`
  }
  const scrimColor = light ? hexToRgba('#ffffff', Math.min(0.55, cfg.scrim * 0.7)) : hexToRgba('#000000', cfg.scrim)

  // 兼容映射：自有变量 + 各家常见设计 token
  const rootVars = `
  color-scheme: ${t.mode};
  --dsh-bg:${t.bg}; --dsh-surface:${t.surface}; --dsh-text:${t.text}; --dsh-muted:${t.muted};
  --dsh-accent:${accent}; --dsh-accent-2:${accent2};
  --dsh-blur:${cfg.blur}px; --dsh-panel-op:${cfg.panelOpacity}; --dsh-radius:${cfg.radius}px;
  --bg:${t.bg}; --background:${t.bg}; --color-bg:${t.bg}; --color-background:${t.bg}; --c-bg:${t.bg}; --app-bg:${t.bg}; --base-bg:${t.bg};
  --surface:${t.surface}; --color-surface:${t.surface}; --c-surface:${t.surface}; --panel-bg:${t.surface}; --card-bg:${t.surface};
  --bg-elevated:${t.surface}; --color-bg-elevated:${t.surface}; --el-bg-color:${t.surface}; --semi-color-bg-2:${t.surface};
  --text:${t.text}; --foreground:${t.text}; --color-text:${t.text}; --color-fg:${t.text}; --c-text:${t.text}; --text-color:${t.text}; --el-text-color-primary:${t.text}; --semi-color-text-0:${t.text};
  --muted:${t.muted}; --color-text-secondary:${t.muted}; --c-text-muted:${t.muted}; --text-color-secondary:${t.muted}; --el-text-color-secondary:${t.muted}; --semi-color-text-2:${t.muted};
  --accent:${accent}; --primary:${accent}; --color-primary:${accent}; --c-primary:${accent}; --brand:${accent}; --el-color-primary:${accent}; --semi-color-primary:${accent}; --link-color:${accent};
  --muted-foreground:${t.muted}; --card:${t.surface}; --border:${hexToRgba(t.muted, 0.25)};`

  // 毛玻璃容器（blur=0 且不透明时关闭，完全保留宿主原貌）
  const glass = (cfg.blur > 0 || cfg.panelOpacity < 1) ? `
:where(aside,nav,header,footer,[class*="sidebar"],[class*="side-bar"],[class*="panel"],[class*="card"],[class*="drawer"],[class*="modal"],[class*="dialog"],[class*="popover"],[class*="toolbar"]){
  background-color: color-mix(in srgb, var(--dsh-surface) calc(var(--dsh-panel-op)*100%), transparent) !important;
  ${cfg.blur > 0 ? `backdrop-filter: blur(var(--dsh-blur)); -webkit-backdrop-filter: blur(var(--dsh-blur));` : ''}
}` : ''

  return `
:root{${rootVars}
}
html,body{ background-color: var(--dsh-bg) !important; color: var(--dsh-text); }
#app,#root{ background-color: transparent !important; }
#${BG_ID}{
  position:fixed; inset:0; z-index:0; pointer-events:none;
  background-color: var(--dsh-bg);
  background-image: ${bgImage};
  background-size:cover; background-position:center; background-repeat:no-repeat;
}
#${BG_ID}::after{ content:""; position:absolute; inset:0; background:${scrimColor}; }
#app,#root{ position:relative; z-index:1; }
:where(a,[class*="link"]){ color: var(--dsh-accent); }
:where(a,[class*="link"]):hover{ color: var(--dsh-accent-2); }
:focus-visible{ outline:2px solid var(--dsh-accent); outline-offset:2px; }
::selection{ background: color-mix(in srgb, var(--dsh-accent) 32%, transparent); }
*{ scrollbar-color: var(--dsh-accent) transparent; }
::-webkit-scrollbar-thumb{ background: color-mix(in srgb, var(--dsh-accent) 55%, transparent); border-radius:8px; }
:where(button,[class*="btn"]){ border-radius: var(--dsh-radius); }
${glass}
${cfg.customCss || ''}`
}

function ensureEl(tag, id) {
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement(tag)
    el.id = id
    document.head.appendChild(el)
  }
  return el
}

function render(cfg) {
  ensureEl('style', STYLE_ID).textContent = buildCss(cfg)
  if (!document.getElementById(BG_ID)) {
    const bg = document.createElement('div')
    bg.id = BG_ID
    document.body.appendChild(bg)
  }
}

export async function apply(ctx) {
  let cfg = loadConfig()
  render(cfg)

  const api = {
    get: () => cfg,
    set: (patch) => { cfg = { ...cfg, ...patch }; render(cfg); saveConfig(cfg) },
    reset: () => { cfg = { ...DEFAULT_CONFIG }; render(cfg); saveConfig(cfg) },
  }
  const panel = mountPanel(api)

  const cleanup = () => {
    document.getElementById(STYLE_ID)?.remove()
    document.getElementById(BG_ID)?.remove()
    panel.cleanup()
  }
  if (ctx?.effect) ctx.effect(() => cleanup)
}

export default { name, apply }
