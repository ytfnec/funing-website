# funing-website 迁移交接日志（2026-08-02）

> 供 Claude Code 接手续作参考。本次迁移主体已完成，线上服务正常。

## 一、迁移完成状态 ✅

| 项 | 状态 |
|----|------|
| ① 推代码 | ✅ commit `b4f1867`（master，已推送 ytfnec/funing-website） |
| ② 删除 Pages 项目 | ✅ 已完成（163 deployments 清空→解绑→删除） |
| ③ Worker + Secrets | ✅ Worker `funing-website` 已建，JWT_SECRET 已设（64字符） |
| ④ 部署 | ✅ Version `8e135127`（Webpack 产物） |
| ⑤ 绑域名 | ✅ `fnec.net` 已绑（用户在 Dashboard 完成） |
| ⑥ 验证 | ✅ 全部通过（见下） |

## 二、线上验证结果（2026-08-02 实测）

**workers.dev 域名** `https://funing-website.fnecyt.workers.dev`:
- `/`、`/admin/login`、`/api/products`、`/products`、`/contact` → 全部 **HTTP 200**
- 首页标题: `Funing Electronics | Precision Electronic Control Systems | 烟台富宁电子`
- `/api/products` → **4 个产品**（D1 `funing-db` 读取正常）
- 联系表单 POST `/api/contact` → 入库成功（`contact_submissions` 表，测试记录已删除）
- 登录 API `/api/auth/login`（错误密码）→ `{"error":"Invalid credentials"}`（D1 `admin_users` + bcrypt 链路正常）

**生产域名** `https://fnec.net`:
- `/`、`/admin/login`、`/api/products` → 全部 **HTTP 200**，内容同 workers.dev
- `https://www.fnec.net` → **HTTP 000（未绑定/未生效）**，如需 www 需在 Dashboard 再绑

## 三、500 根因与修复（关键！）

**症状**: 部署后首页 500，响应体仅 `Internal Server Error`；`wrangler tail` 日志:
```
TypeError: components.ComponentMod.handler is not a function
```

**根因（最终结论）**: 不是"Pages 不运行 worker"（DOMAIN.md 旧记录有误）。
真实根因 = **Next.js 16 默认 Turbopack 构建 + OpenNext 在 Windows 上的补丁 bug**
（opennextjs-cloudflare issue #1305，症状完全一致，未修复；同类 issue #1286 证实 Webpack 可绕开）。
本地 `wrangler dev` 同样 500 → 确认是构建产物问题，非部署环境。

**修复**: `package.json` 的 `build` 脚本改为:
```json
"build": "next build --webpack"
```
强制 Webpack 替代 Turbopack。已提交 commit `b4f1867`。

**排障陷阱**（Windows 特有）:
1. `npm run deploy` 会复用 `.open-next`/`.next` 缓存，改完 build 脚本必须
   `rm -rf .next .open-next` 后重新 `npm run build:cf`，否则部署的还是旧 Turbopack 产物
2. 残留 `next dev`/`wrangler dev`/`wrangler tail` 进程会锁住 `.open-next` 导致
   构建 EPERM 或静默覆盖产物——构建前先 `tasklist | grep node` 清干净
3. `wrangler tail` 用默认 pretty 格式排障（JSON 格式日志被淹没），用完必须
   taskkill 子进程（kill 会话不杀子进程树）

## 四、部署命令

```bash
npm run build:cf   # Webpack 构建（必须先于 deploy）
npm run deploy     # 部署到 Worker funing-website
```

注意: OpenNext 1.20 的 `deploy` 不自动 build（报 "Could not find compiled Open Next config"），
必须显式先 build:cf。每次改代码重新部署时按此顺序。

## 五、资源配置

- **D1** `funing-db`（id `e34f35c7-46c0-4547-a366-ada19c09af48`）: 14 张表（含 `_cf_KV`），
  12 业务表: `admin_users, contact_submissions, content_blocks, media_library, news_article,
  newsletter_subscriptions, page_views, product_variants, products, site_content,
  site_settings, uploaded_images`。**独立资源，已随 Worker 绑定，无需重建**。
  - 测试数据: 本次验证共插 2 条 contact_submissions（id `id-e52bf6e4...`、`id-e77bd203...`），**均已删除**
- **R2** `funing-storage`: 独立资源，已绑定
- Worker 绑定: `env.DB`(D1), `env.R2`, `env.ASSETS`, `env.NODE_ENV=production`
- `wrangler.toml`: name=funing-website, main=.open-next/worker.js, compat `nodejs_compat`
  （非 v2，目前正常；若后续有兼容问题可试 `nodejs_compat_v2`）

## 六、注意事项 / 待办

> 更新: 2026-08-02（第 1、2 项已完成）

1. ✅ **www.fnec.net 已绑定**（用户 Dashboard 完成，实测 200）
2. ✅ **main 分支已清理**（默认分支改为 master，`git push origin --delete main` 成功，远程仅剩 master）
3. ✅ **DOMAIN.md 已更新**（500 根因 = Turbopack/Windows bug + webpack 修复）
4. `wrangler.toml` 无 `account_id` 字段，账号 `fnecyt@gmail.com`（OAuth token 存于
   `C:\Users\xxq\AppData\Roaming\xdg.config\.wrangler\config\default.toml`）
5. OAuth token scope 仅 `zone:read`——**DNS 记录删除/zone 编辑需 Dashboard 手动操作**，
   API 调用 zones 接口会 `Authentication error`；但 `workers/domains` 接口可用
6. OpenNext 在 Windows 上有 WARN（官方推荐 WSL 构建），当前 Webpack 方案可用但
   若遇莫名运行时不稳定，备选方案是在 WSL 里构建

> 最新部署: Version `a1e99af1`（2026-08-02，Webpack，含 Content 编辑器）

## 七、验证清单（后续每次部署可复用）

```bash
for u in "/" "/admin/login" "/api/products" "/products" "/contact"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
curl -s https://fnec.net/api/products | python -c "import json,sys;d=json.load(sys.stdin);print('products:',len(d))"
```

## 八、功能队列进度（Claude Code 自动开发循环，2026-08-02 起）

> 每次完成一批在此更新，供后续轮次对照。

| 批 | 功能 | 状态 | 提交/说明 |
|----|------|------|-----------|
| 1 | 首页 CTA 区块真实图片（PCB 纹理 `cta-bg.webp` 叠加） | ✅ 已部署 | `9e83791` |
| 2 | 性能优化：next/image sizes/lazy、字体自托管(preload)、关键资源内联 | ✅ 已部署 | `24dbba9`，详见第十一批指令 |
| 3 | admin Content 编辑器批量操作（多选删除/激活/暂停） | ✅ 已部署 | `10a4154`，详见第十二批指令 |
| 4 | 新闻 /news 列表页 + admin 管理（D1 `news_article` 表，公开 /news + /news/[slug]，admin 增删改/发布切换） | ✅ 已部署 | `529a752`（第十三批），Hermes 已执行 db:deploy + 部署 Version `8e338b54`，全部路由 200、API 专项通过 |
| 5 | 全量回归验证 + JSON-LD 补缺（sitemap/robots/结构化数据审查） | ✅ 已部署 | `9b79bf3`（第十四批），21/21 路由 200、API 回归 4×200 + 4×401 + 404、JSON-LD 专项通过（新闻详情 NewsArticle 待人工发布文章后验证） |
| 6 | 加载骨架屏 + 错误边界（React error boundary + loading.tsx） | ✅ 已部署 | `d8f1a8f`（第十五批），Version `dbaa554a`，路由 200 + skeleton 样式打包验证通过（浏览器人工项待确认） |
| 7 | 产品详情页 hero_image 真实展示（缺失/损坏时优雅回退占位纹理，admin 可浏览 Media 库设置） | ✅ 已部署 | `c011184`（第十六批），Version `3ee54507`，路由 200 + hero/JSON-LD 专项通过（admin 浏览器人工项待确认） |
| 8 | 后台 Media 库批量操作（多选 + 批量删除，同步清理 R2 对象与 D1 记录） | ✅ 已部署 | `52074b9`（第十七批），Version `fa572c9c`，路由 200 + 批量 API 专项通过（401/400/400，浏览器人工项待确认） |

> **✅ 功能队列 8 项全部完成并部署（2026-08-02）。**
> 开发循环已收尾。以下为**待人工确认项**（cron 环境无法覆盖，见各批指令的"浏览器人工项"）：
> 1. 新闻详情页 NewsArticle JSON-LD：发布一篇已发布文章后 view-source 确认（第十四批）
> 2. 骨架屏：Slow 3G 下 /products、/news、详情页观察琥珀 shimmer（第十五批）
> 3. 错误边界：手动触发渲染错误确认 error.tsx 重试可恢复（第十五批）
> 4. 产品编辑 Product Image：admin 设置 hero_image + Browse Media 弹层（第十六批）
> 5. Media 批量删除：勾选/全选/Delete Selected 实测 D1+R2 同步清理（第十七批）
> 6. 可选增强：构建时设 `NEXT_PUBLIC_R2_PUBLIC_URL` 以启用媒体库 R2 真实预览

## 九、生产事故记录

### 2026-08-02 全站 1102（Worker 超出资源限制）

- **现象**: `https://fnec.net` 全站 HTTP 1102（Ray ID a250b7852bf52eba）。
- **已知正常版本**: 批次17 Version `fa572c9c-a75c-44f9-9e56-9af37f61606d`（9 路由全 200）。
- **疑似根因**:
  1. 多个 "Dev auto loop" 定时任务会话**并发运行**，06:46 有会话重建 `.open-next`（server-functions 达 32MB）并可能部署异常版本覆盖正常版（Hermes 多次标记"并发 cron 部署冲突"）。
  2. `open-next.config.ts` 用 `incrementalCache: 'dummy'`（无边缘缓存），公开页全量 SSR + 查 D1，免费版 10ms CPU 限额易被打满。
  3. 公开只读 API（products/news）无 `Cache-Control`，每请求都打 Worker + D1。
- **处理**:
  - 下发第十八批（紧急）：Hermes `wrangler rollback` 到 `fa572c9c`（待执行确认）。
  - 性能加固提交 `8373bff`：给 `/api/products`、`/api/products/[slug]`、`/api/news` 加 `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`（CDN 缓存，零配置）。待 Hermes 部署。
- **建议**:
  - 停用多余的 `dev-auto-loop` 定时任务，只保留一个，避免并发部署冲突。
  - 后续可考虑 `open-next.config.ts` 启用 R2 增量缓存 / 缓存拦截（需新增 binding，规范要求谨慎）。
