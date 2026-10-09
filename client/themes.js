// dsh-theme-studio · 预设主题
// 每个主题：mode(dark/light)、基础色板，可选 gradient（渐变背景）

export const THEMES = {
  abyss: {
    name: '深海蓝', mode: 'dark',
    bg: '#0b1220', surface: '#111c2e', text: '#e6edf7', muted: '#8a9bb4', accent: '#3b82f6',
  },
  midnight: {
    name: '暗夜墨', mode: 'dark',
    bg: '#0a0a0b', surface: '#16171a', text: '#ececee', muted: '#9a9aa2', accent: '#6366f1',
  },
  matrix: {
    name: '终端绿', mode: 'dark',
    bg: '#040d06', surface: '#0a1a10', text: '#c8f7d4', muted: '#5fa878', accent: '#22ee7a',
  },
  amber: {
    name: '琥珀暖光', mode: 'dark',
    bg: '#120c05', surface: '#1e150a', text: '#f6ead2', muted: '#b89a6a', accent: '#f59e0b',
  },
  violet: {
    name: '紫罗兰', mode: 'dark',
    bg: '#0f0a1a', surface: '#1a1228', text: '#ede5fb', muted: '#a48fc8', accent: '#a855f7',
  },
  neon: {
    name: '赛博霓虹', mode: 'dark',
    bg: '#0a0612', surface: '#150d24', text: '#f2e9ff', muted: '#b39dd1', accent: '#ff2d95', accent2: '#00e5ff',
    gradient: 'linear-gradient(150deg, #120826 0%, #1a0b2e 45%, #06121f 100%)',
  },
  dusk: {
    name: '暮光渐变', mode: 'dark',
    bg: '#0d0a1f', surface: '#171232', text: '#ece8fb', muted: '#9d94c4', accent: '#8b5cf6',
    gradient: 'linear-gradient(160deg, #1e1b4b 0%, #3b0764 55%, #4c1d95 100%)',
  },
  sakura: {
    name: '樱粉', mode: 'light',
    bg: '#fff5f8', surface: '#ffffff', text: '#4a2f3a', muted: '#a97e8e', accent: '#ec4899',
  },
  paper: {
    name: '极简白', mode: 'light',
    bg: '#f7f8fa', surface: '#ffffff', text: '#1f2430', muted: '#6b7280', accent: '#2563eb',
  },
  matcha: {
    name: '护眼豆沙', mode: 'light',
    bg: '#eef2ea', surface: '#fbfdf9', text: '#2f3a2c', muted: '#75826c', accent: '#65a30d',
  },
}

export const THEME_ORDER = ['abyss', 'midnight', 'dusk', 'matrix', 'amber', 'violet', 'neon', 'sakura', 'paper', 'matcha']

export const DEFAULT_CONFIG = {
  theme: 'abyss',
  accent: '',          // 覆盖强调色，空 = 跟随主题
  bgType: 'none',      // none | gradient | image
  bgImage: '',         // 图片 URL 或 dataURL
  gradient: '',        // 自定义渐变 CSS，空 = 用主题自带
  scrim: 0.35,         // 背景遮罩暗化 0~0.85
  blur: 12,            // 面板毛玻璃模糊 px
  panelOpacity: 0.72,  // 面板不透明度 0.3~1
  radius: 12,          // 圆角 px
  customCss: '',       // 自定义 CSS
}

export const STORAGE_KEY = 'dsh-theme-studio:config'
