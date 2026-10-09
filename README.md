# DSH Theme Studio · 主题工坊

DeepSeek Harness（DSH）的可视化换肤插件。**万物皆插件**，本插件只负责一件事：让你自由地改变整个界面的主题与背景。

零依赖、纯 ESM、框架无关 —— 安装后无需构建，手机和电脑浏览器都能用。

## 功能特性

- **10 套预设主题**：深海蓝、暗夜墨、暮光渐变、终端绿、琥珀暖光、紫罗兰、赛博霓虹、樱粉、极简白、护眼豆沙（明暗皆有）
- **自定义强调色**：取色器自由选择主色调，或一键跟随主题
- **三种背景**：纯色 / 渐变（可写任意渐变 CSS）/ 图片（URL 或本机上传）
- **毛玻璃观感**：背景遮罩、面板模糊、面板透明度、圆角均可调
- **自定义 CSS**：高级用户可注入任意样式，想怎么改就怎么改
- **配置持久化**：选择保存在浏览器本地（localStorage），重开不丢失
- **导入 / 导出 / 重置**：配置可保存为 JSON、随时分享或还原

## 前置条件

- 已安装 Node.js（`^22.19` 或 `>=24`）
- 能启动 DSH Web：`npx @deepseek-ai/dsh web`（默认地址 http://127.0.0.1:3080）

## 一键安装（推荐）

解压本插件后，进入 `dsh-theme-studio` 目录，执行：

```bash
bash install.sh
```

脚本会自动把插件安装到 `web` profile（没有全局 `dsh` 时会自动改用 `npx`）。

## 手动安装

在本目录的**上一级**执行：

```bash
# 全局 dsh
dsh plugin --profile web add ./dsh-theme-studio

# 或使用 npx
npx @deepseek-ai/dsh plugin --profile web add ./dsh-theme-studio
```

> 若已发布到 GitHub，也可用：`dsh plugin --profile web add github:<owner>/dsh-theme-studio`

## 启动与使用

```bash
dsh web        # 或 npx @deepseek-ai/dsh web
```

1. 浏览器打开 DSH 界面
2. 点击右下角的**调色板悬浮按钮**
3. 在弹出面板里选主题、改颜色、换背景，所有调整实时生效并自动保存

## 卸载

```bash
dsh plugin --profile web remove dsh-theme-studio
```

## 故障排查

| 现象 | 处理 |
|---|---|
| 主题没生效 | 确认插件装在 `web` profile，且用的是同一个 profile 启动（`dsh --profile web web`）；刷新页面 |
| 找不到悬浮按钮 | 页面右下角；若被其他元素遮挡，缩放或滚动后再看 |
| 改乱了想还原 | 面板里点「重置」，或在浏览器控制台执行 `localStorage.removeItem('dsh-theme-studio:config')` 后刷新 |
| 背景图片不显示 | 确认图片 URL 可公开访问、跨域与 CSP 允许；可改用「本机上传」（转 dataURL，不受跨域限制） |
| 个别元素没跟随主题 | 在「自定义 CSS」里针对该元素微调；也可把你的界面 class 反馈给作者补充适配 |

## 技术说明

- 基于 DSH 的 Cordis 插件契约：`package.json` 的 `dsh.bundle.patch` 指向 `cordis.patch.yml`，`dsh.client` 声明 Web 端，界面能力通过包导出 `./client` 提供；host 端为空操作。
- 换肤核心为「CSS 变量覆盖 + 背景层 + 可选毛玻璃」，并兼容映射多家常见设计 token（Tailwind/shadcn、Element Plus、Semi 等命名）。
- 按 `@deepseek-ai/dsh` 0.1.0-rc.x 开发者预览文档实现；DSH 仍在快速迭代，若正式版字段调整，以官方文档为准。

## 许可证

MIT，见 [LICENSE](./LICENSE)。
