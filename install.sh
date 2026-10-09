#!/usr/bin/env bash
# dsh-theme-studio · 一键安装到 DeepSeek Harness 的 web profile
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if command -v dsh >/dev/null 2>&1; then
  DSH="dsh"
else
  DSH="npx @deepseek-ai/dsh"
  echo "未检测到全局 dsh，将使用 npx 方式（首次会自动下载）。"
fi

echo ">>> 正在安装 dsh-theme-studio 到 web profile ..."
$DSH plugin --profile web add "$DIR"

echo ""
echo ">>> 安装完成。"
echo ">>> 启动 Web 界面：  $DSH web"
echo ">>> 打开后点击右下角「调色板」悬浮按钮即可自由换肤。"
