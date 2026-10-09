// dsh-theme-studio · host(TeamServer) 入口
// 本插件为纯 Web UI(client) 插件：host 端不注册任何工具/服务，
// 界面换肤能力由包导出 "./client" 提供。
export const name = 'dsh-theme-studio'

export function apply() { /* no-op on host */ }

export default { name, apply }
