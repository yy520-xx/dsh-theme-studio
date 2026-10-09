// dsh-theme-studio · 原生 DOM 设置面板（框架无关）
import { THEMES, THEME_ORDER } from './themes.js'

const PANEL_STYLE_ID = 'dsh-theme-studio-panel-style'

const CSS = `
.dts-root{position:fixed;right:16px;bottom:16px;z-index:2147483600;font-family:system-ui,-apple-system,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif;}
.dts-fab{width:46px;height:46px;border-radius:50%;border:none;cursor:pointer;
  background:linear-gradient(135deg,var(--dsh-accent,#3b82f6),var(--dsh-accent-2,#8b5cf6));
  color:#fff;display:flex;align-items:center;justify-content:center;
  box-shadow:0 8px 24px rgba(0,0,0,.35);transition:transform .15s;}
.dts-fab:hover{transform:scale(1.07);}
.dts-panel{width:min(340px,calc(100vw - 32px));max-height:min(72vh,640px);overflow-y:auto;
  background:rgba(17,20,28,.92);color:#e8ecf4;border:1px solid rgba(255,255,255,.1);
  border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,.5);
  backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);padding:14px 14px 16px;display:none;}
.dts-panel.open{display:block;}
.dts-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.dts-title{font-size:14px;font-weight:700;letter-spacing:.3px;}
.dts-x{background:none;border:none;color:#9aa4b8;cursor:pointer;font-size:18px;line-height:1;padding:2px 6px;}
.dts-sec{margin-top:12px;}
.dts-lbl{font-size:11px;color:#9aa4b8;text-transform:uppercase;letter-spacing:.6px;margin-bottom:7px;display:block;}
.dts-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;}
.dts-sw{height:34px;border-radius:9px;cursor:pointer;border:2px solid transparent;position:relative;overflow:hidden;}
.dts-sw span{position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;font-size:8px;color:#fff;padding-bottom:2px;text-shadow:0 1px 2px rgba(0,0,0,.7);}
.dts-sw.active{border-color:#fff;box-shadow:0 0 0 2px var(--dsh-accent,#3b82f6);}
.dts-row{display:flex;align-items:center;gap:8px;margin:8px 0;}
.dts-row label{font-size:12px;color:#c6cdda;flex:0 0 64px;}
.dts-row input[type=range]{flex:1;accent-color:var(--dsh-accent,#3b82f6);}
.dts-row .dts-v{font-size:11px;color:#9aa4b8;flex:0 0 42px;text-align:right;}
.dts-color{width:38px;height:30px;border:none;padding:0;border-radius:7px;background:transparent;cursor:pointer;}
.dts-text,.dts-url,textarea.dts-ta{width:100%;box-sizing:border-box;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);
  color:#e8ecf4;border-radius:9px;padding:8px 10px;font-size:12px;outline:none;}
.dts-text:focus,.dts-url:focus,textarea.dts-ta:focus{border-color:var(--dsh-accent,#3b82f6);}
textarea.dts-ta{min-height:64px;resize:vertical;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11px;line-height:1.5;}
.dts-seg{display:flex;gap:6px;}
.dts-seg button{flex:1;padding:7px 0;font-size:12px;border-radius:8px;cursor:pointer;
  background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:#c6cdda;}
.dts-seg button.active{background:var(--dsh-accent,#3b82f6);color:#fff;border-color:transparent;}
.dts-hide{display:none;}
.dts-btns{display:flex;gap:8px;margin-top:14px;}
.dts-btns button{flex:1;padding:8px 0;font-size:12px;border-radius:9px;cursor:pointer;
  background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);color:#e8ecf4;}
.dts-btns button.dts-warn{background:rgba(239,68,68,.16);border-color:rgba(239,68,68,.4);color:#fca5a5;}
.dts-clear{font-size:11px;color:#9aa4b8;background:none;border:none;cursor:pointer;text-decoration:underline;}
`

function h(tag, props = {}, ...kids) {
  const e = document.createElement(tag)
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') e.className = v
    else if (k === 'style') e.style.cssText = v
    else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v)
    else if (v !== undefined && v !== null) e.setAttribute(k, v)
  }
  for (const kid of kids.flat()) if (kid != null) e.appendChild(typeof kid === 'string' ? document.createTextNode(kid) : kid)
  return e
}

export function mountPanel(api) {
  const style = h('style', { id: PANEL_STYLE_ID })
  style.textContent = CSS
  document.head.appendChild(style)

  // ---- 主题网格 ----
  const swatches = []
  const grid = h('div', { class: 'dts-grid' })
  for (const id of THEME_ORDER) {
    const t = THEMES[id]
    const sw = h('button', {
      class: 'dts-sw', title: t.name,
      style: `background:${t.gradient || t.surface};`,
      onclick: () => { api.set({ theme: id }); paintActive() },
    }, h('span', {}, t.name))
    swatches.push([id, sw])
    grid.appendChild(sw)
  }
  function paintActive() {
    for (const [id, sw] of swatches) sw.classList.toggle('active', id === api.get().theme)
  }

  // ---- 强调色 ----
  const accentInp = h('input', { class: 'dts-color', type: 'color', oninput: (e) => api.set({ accent: e.target.value }) })
  const clearAcc = h('button', { class: 'dts-clear', onclick: () => { api.set({ accent: '' }); sync() } }, '跟随主题')
  const accentRow = h('div', { class: 'dts-row' }, h('label', {}, '强调色'), accentInp, clearAcc)

  // ---- 背景类型 ----
  const segBtns = {}
  const seg = h('div', { class: 'dts-seg' })
  for (const [v, txt] of [['none', '纯色'], ['gradient', '渐变'], ['image', '图片']]) {
    const b = h('button', { onclick: () => { api.set({ bgType: v }); paintSeg() } }, txt)
    segBtns[v] = b; seg.appendChild(b)
  }
  function paintSeg() {
    const t = api.get().bgType
    for (const [v, b] of Object.entries(segBtns)) b.classList.toggle('active', v === t)
    gradBox.classList.toggle('dts-hide', t !== 'gradient')
    imgBox.classList.toggle('dts-hide', t !== 'image')
  }

  // ---- 渐变 ----
  const gradInp = h('input', { class: 'dts-text', placeholder: 'linear-gradient(160deg,#1e1b4b,#4c1d95)', oninput: (e) => api.set({ gradient: e.target.value }) })
  const gradBox = h('div', { class: 'dts-sec dts-hide' }, h('label', { class: 'dts-lbl' }, '渐变 CSS'), gradInp)

  // ---- 图片 ----
  const imgUrl = h('input', { class: 'dts-url', placeholder: '粘贴图片 URL…', oninput: (e) => api.set({ bgImage: e.target.value }) })
  const fileInp = h('input', { type: 'file', accept: 'image/*', class: 'dts-hide', onchange: (e) => {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    const r = new FileReader()
    r.onload = () => { api.set({ bgType: 'image', bgImage: r.result }); sync() }
    r.readAsDataURL(f)
  } })
  const upBtn = h('button', { class: 'dts-text', style: 'margin-top:6px;cursor:pointer;', onclick: () => fileInp.click() }, '或从本机选择图片')
  const imgBox = h('div', { class: 'dts-sec dts-hide' }, h('label', { class: 'dts-lbl' }, '背景图片'), imgUrl, upBtn, fileInp)

  // ---- 滑块 ----
  function slider(label, key, min, max, step, fmt) {
    const val = h('span', { class: 'dts-v' })
    const inp = h('input', { type: 'range', min, max, step, oninput: (e) => {
      api.set({ [key]: parseFloat(e.target.value) }); val.textContent = fmt(api.get()[key])
    } })
    return { inp, val, row: h('div', { class: 'dts-row' }, h('label', {}, label), inp, val) }
  }
  const sScrim = slider('背景遮罩', 'scrim', 0, 0.85, 0.05, (v) => Math.round(v * 100) + '%')
  const sBlur = slider('模糊', 'blur', 0, 30, 1, (v) => v + 'px')
  const sOp = slider('面板透明', 'panelOpacity', 0.3, 1, 0.02, (v) => Math.round(v * 100) + '%')
  const sRadius = slider('圆角', 'radius', 0, 22, 1, (v) => v + 'px')

  // ---- 自定义 CSS ----
  const cssTa = h('textarea', { class: 'dts-ta', placeholder: '高级：自定义 CSS，例如\n.chat-area{ background:rgba(0,0,0,.4); }', oninput: (e) => api.set({ customCss: e.target.value }) })

  // ---- 导入 / 导出 / 重置 ----
  const importFile = h('input', { type: 'file', accept: 'application/json,.json', class: 'dts-hide', onchange: (e) => {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    const r = new FileReader()
    r.onload = () => { try { api.set(JSON.parse(r.result)); sync() } catch (err) { alert('配置文件格式不正确') } }
    r.readAsText(f)
  } })
  const btns = h('div', { class: 'dts-btns' },
    h('button', { onclick: () => {
      const blob = new Blob([JSON.stringify(api.get(), null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'dsh-theme.json'; a.click()
      URL.revokeObjectURL(url)
    } }, '导出'),
    h('button', { onclick: () => importFile.click() }, '导入'),
    h('button', { class: 'dts-warn', onclick: () => { api.reset(); sync() } }, '重置'),
    importFile)

  // ---- 组装面板 ----
  const panel = h('div', { class: 'dts-panel' },
    h('div', { class: 'dts-head' }, h('div', { class: 'dts-title' }, '主题工坊 Theme Studio'), h('button', { class: 'dts-x', onclick: () => panel.classList.remove('open') }, '×')),
    h('div', {}, h('label', { class: 'dts-lbl' }, '预设主题'), grid),
    h('div', { class: 'dts-sec' }, accentRow),
    h('div', { class: 'dts-sec' }, h('label', { class: 'dts-lbl' }, '背景类型'), seg),
    gradBox, imgBox,
    h('div', { class: 'dts-sec' }, sScrim.row, sBlur.row, sOp.row, sRadius.row),
    h('div', { class: 'dts-sec' }, h('label', { class: 'dts-lbl' }, '自定义 CSS'), cssTa),
    btns)

  const fab = h('button', { class: 'dts-fab', title: '主题工坊', onclick: () => { panel.classList.toggle('open'); if (panel.classList.contains('open')) sync() } },
    h('span', { innerHTML: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>' }))

  const root = h('div', { class: 'dts-root' }, panel, fab)
  document.body.appendChild(root)

  function sync() {
    const c = api.get()
    paintActive(); paintSeg()
    accentInp.value = c.accent || (THEMES[c.theme] && THEMES[c.theme].accent) || '#3b82f6'
    gradInp.value = c.gradient || ''
    imgUrl.value = c.bgImage && c.bgImage.startsWith('data:') ? '' : c.bgImage
    sScrim.inp.value = c.scrim; sScrim.val.textContent = Math.round(c.scrim * 100) + '%'
    sBlur.inp.value = c.blur; sBlur.val.textContent = c.blur + 'px'
    sOp.inp.value = c.panelOpacity; sOp.val.textContent = Math.round(c.panelOpacity * 100) + '%'
    sRadius.inp.value = c.radius; sRadius.val.textContent = c.radius + 'px'
    cssTa.value = c.customCss || ''
  }

  return {
    sync,
    cleanup: () => { root.remove(); style.remove() },
  }
}
