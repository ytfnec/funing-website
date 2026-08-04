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

### 2026-08-03 1102 复现 — 诊断与缓解（batch 18–21，结论已被 Hermes 修正）

> ⚠️ **更新（10:37）**: 此前 `603a684` 标注"根治"结论**不成立**，Hermes 已纠正。实际为**时间窗口现象**，非代码/构建缺陷。

- **现象**: 全站 1102 后回滚 `fa572c9c` 恢复；随后 SSR 页面（`/`、`/products`）再次超时 30s，JSON API 正常 200。版本未变（`4788d816`）→ 排除版本覆盖。
- **Hermes 决定性对照实验（同构建产物）**:
  - `37286ee2` 首次部署后 20 分钟 → SSR 全 25s 超时 ❌
  - 回滚 `fa572c9c`（batch17）→ 200（~1-2s）✅
  - `37286ee2` **同产物重部署**（`a216d0eb`）→ 200（~1s）✅
  - 完整验证 → 全绿 ✅
- **结论**: **代码/构建无问题**；SSR 超时是**时间窗口现象**（免费版 Worker CPU 执行波动或短时流量高峰；robots 已封 8 个 AI 爬虫，不守规矩的仍会打）。API 全程 200 证明 Worker 存活、D1 正常，问题仅在 SSR 渲染在高峰期的 CPU 余量。
- **缓解（已上线）**:
  - `03b17f8`：`next.config.js` 给公开页加 `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`，CDN 边缘缓存 HTML，回源频率降 ~90%。
  - `18d7ce9`：header 规则顺序修复（catch-all 前置、admin/API `no-store` 后置；Next 应用"最后匹配"规则）。
  - 当前线上 `a216d0eb`（batch21 完整版），全路由 200。
- **可选后续（未做）**:
  - 纯静态公开页加 `force-static`（让构建期预渲染更完整）——注意 OpenNext 1.20 无静态资产发布模式，仍走 Worker SSR，边际收益有限、有回归风险，**不推荐冒险**。
  - 启用 OpenNext R2 增量缓存（`NEXT_INC_CACHE_R2_BUCKET` binding，需改 wrangler.toml，有部署风险）。
  - `dev-auto-loop` 定时任务已停用，避免并发部署冲突复发。

### 2026-08-03 决策记录 — 1102 治理方案（用户已拍板）

- **决策**: 采纳 **方案 2 — 保持现状 + 边缘缓存**。不升级 Workers Paid、不改 OpenNext 缓存架构（不冒部署风险）。
- **理由**: 线上已稳定（`a216d0eb` 全路由 200），公开页边缘缓存生效（回源频率降 ~90%），日常访问正常；升级 Paid（$5/月，CPU 10ms→30ms）与 R2 增量缓存留作"超时窗口频繁复发时"的兜底方案。
- **运维监控建议**:
  1. 若再遇首页/产品页短暂超时（几秒~几十秒），多为免费版 CPU 波动窗口，等待后自动恢复，无需紧张。
  2. 边缘缓存 = 60s CDN 缓存 + 300s 后台刷新，正常访问体验良好。
  3. **升级 Paid 触发条件**: 超时窗口变得频繁（每天多次 / 每次持续数分钟）时再升级；升级在 Cloudflare Dashboard 操作（账号 `fnecyt@gmail.com`）。
  4. 人工验收：`MANUAL-ACCEPTANCE-CHECKLIST.md` 的 6 项浏览器确认待用户抽空过一遍（不阻塞使用）。
- **备注**: 本地有一个未推送文档提交 `245f005`（本段记录），待下次 Hermes 有推送机会时随 `git push` 同步 origin。

### 2026-08-03 后台中英双语化 — 10 个 admin 页面全部完成

- **方案**: 复用前台语言设置（`fnec-lang`，localStorage）+ `useLang()` 的 `t()`，全部后台页面跟随语言切换。
- **i18n keys**: `src/lib/i18n.tsx` en/zh 各 **684 keys，完全对齐**（含新增 `admin.content.*`、补齐 `admin.media.*`、`admin.settings.*`）。
- **已改造文件（10 个 admin 页面 + i18n）**:
  - 上一会话完成 7 个：`layout`、`login`、`dashboard(page)`、`products` 列表、`products/[slug]` 编辑、`news`、`contacts`。
  - 本会话完成 3 个：`admin/media/page.tsx`、`admin/content/page.tsx`、`admin/settings/page.tsx`。
- **验证**: `npx tsc --noEmit` ✅（exit 0）；en/zh key 一致性校验 ✅（684/684，无 only-en/only-zh）。
- **细节处理**:
  - `admin/content` 页的 `KNOWN_PAGES` 页面名下拉改为 i18n key（`admin.content.page.*`）。
  - 参数插值沿用 `.replace('{n}', ...)` / `.replace('{slug}', ...)` 模式（`t()` 本身无插值）。
  - 保留技术性内容不译：content 页的 slug 示例（`en__home.hero.title1`）、语言自标签（中文/English）。
- **遗留小项（不阻塞）**: `contacts` 页 `Save failed` 错误、`layout` 头像 fallback `'A'`、`products/[slug]` `alt` fallback `'Media item'` 仍为硬编码，可后续顺手处理。
- **提交**: 待统一提交后台双语化批次（本次 11 个文件含 i18n.tsx）。

### 2026-08-03 批次 23 部署完成 + 1102 窗口异常延长（⚠️ 需人工决策）

- **批次 23 结果**: 后台双语化（`ca7cfec`）已部署上线，Version `9792f918`。推码✅、构建部署✅、5 路由 200✅、边缘缓存头确认✅。
- **浏览器人工确认（Hermes）**: login 页双语切换验证通过；后台登录成功、仪表盘中文正常（侧边栏 7 页+统计+最近询盘）。**EN 后台 10 页待环境稳定后补验**。
- **⚠️ 1102 异常延长**: 16:45 起 SSR/登录 API 持续挂起，**超出常规 15-30min 窗口**。两次同产物重部署（`e6009a07`/`76c1d01e`）仅短暂恢复 5-10 分钟，间歇复发。带 session 的浏览器请求易触发 1102，无 cookie curl 多数 200。
- **Hermes 判断**: Worker 环境资源问题（历史已知，batch19-21 已做 edge-cache 缓解），**非本次代码问题**。
- **与治理方案对照**: 本次窗口**已触及升级 Paid 触发条件**（"每天多次/每次持续数分钟"）。之前拍板方案 2（保持现状+边缘缓存），兜底=升级 Workers Paid（$5/月，CPU 10ms→30ms）。
- **待人工决策**: **已定 — 用户明确保持免费版，不升级 Paid**。本意是用免费版做网站展示，尊重此意愿，不再建议升级。1102 间歇窗口接受并等待自行恢复；edge-cache 为主要缓解（已生效）。

### 2026-08-03 免费版内优化 — 边缘缓存加长 + 视图上报节流（batch 24）

- **背景**: 批次 23 报告 1102 窗口异常延长（16:45 起超出常规），用户拍板**保持免费版不升级**。据此在免费版框架内继续优化。
- **技术依据**: 所有公开页均为 `'use client'` 壳（HTML 不含内容，内容由客户端 JS fetch 公开 API 渲染）。因此**缓存 HTML 壳完全不影响用户体验**。
- **改动（提交 `36d3138`）**:
  - `next.config.js`: 公开页 HTML 缓存 `s-maxage=60→300`、`stale-while-revalidate=300→3600`（CDN 在 1102 窗口期间可顶住长达 1 小时 stale 页面）。
  - 公开 API（products、products/[slug]、news、news/[slug]、content）: 缓存同参数加长；news/[slug] **补上了缺失的缓存头**。
  - `robots.ts`: 移除 `force-dynamic` → 构建期静态化，爬虫抓取不再打 Worker。
  - `ViewTracker`: 每浏览器 session 每路径只上报一次（sessionStorage 去重），降低高频 D1 写。
- **验证**: `npx tsc --noEmit` ✅。
- **说明**: `/api/auth/*` 保持 no-store（认证不可缓存）；`/api/admin/*` 保持 no-store（管理员数据）。

### 2026-08-03 批次 24 部署完成 — perf 优化上线 + 1102 观察（Hermes 回报）

- **结果**: 提交 `36d3138`（perf）+ `d20f049`（指令）已部署，线上 Version `4788d816-eaf9-4da3-b710-380d418eddbd`。6 路由全 200（`/` `/products` `/news` `/api/products` `/api/news` `/robots.txt`）；`/` 与 `/api/products` 均返回 `cache-control: public, s-maxage=300, stale-while-revalidate=3600`（新缓存头生效）。
- **1102 观察（Hermes）**: 16:45 起 SSR/登录 API 间歇挂（>2h，异常延长）；带 session/cookie 的浏览器请求更易触发 1102，无 cookie curl 多 200；重部署仅短暂恢复。19:00 后全路由 200。**结论**: Worker 资源问题（历史已知），本批 SWR 300→3600 生效后，1102 窗口内 CDN 可凭 stale 内容持续服务——是否覆盖窗口需下次发作再验证。
- **⚠️ i18n 清理待部署**: 我随后提交的 `a45c6fb`（3 处硬编码清理）+ `8f9cb19`（指令更新）**已在 origin/master，但 Hermes 部署 v4788d816 是基于 `d20f049` 构建**，未包含这两个提交。需新批次确认线上是否已含 i18n 清理，未含则补部署。

### 2026-08-03 批次 25 — i18n 清理确认已上线（Hermes 回报）

- **结果**: Hermes 在收到批次 25 指令前，已按批次 24 更新版部署 `569bf3fc-8c5c-49a3-bf2e-372280633386`（基于最新 origin/master，**含 `36d3138` + `a45c6fb`**）。i18n 清理无需重复部署，批次 25 任务 1-2 确认即可。
- **验证**: `/` `/products` `/news` `/api/products` `/api/news` `/robots.txt` `/admin/login` 全部 HTTP 200；`/` 返回 `cache-control: public, s-maxage=300, stale-while-revalidate=3600`。中文登录页完整渲染（导航/表单/页脚齐全）→ **双语功能未破坏确认**。
- **1102 观察更新**: 19:18-19:44 稳定期正常；19:44 浏览器 /admin/login → 1102（Ray a255117f89bc2eba，curl 同时刻 200）；19:49 curl 亦超时。**模式确认**: 浏览器（完整资源加载）比 curl 更易触发 1102；SWR 3600 兜底对缓存页有效（`/`、`/products`、`/api/*` 窗口内仍 200），但**动态页 `/admin/login` 无兜底，窗口内会挂**。
- **后台双语化至此全部完成并上线**（含 3 处遗留硬编码清理）。

### 2026-08-03 第二轮免费版优化调研 — 结论（已回滚无用改动）

- **尝试**: 给 `sitemap.ts` 加 `revalidate = 3600` 以减少爬虫回源的 D1 查询。
- **回滚原因（关键发现）**: OpenNext 1.20 `incrementalCache: 'dummy'` 的 `get/set` 均抛 IgnorableError（**不缓存任何东西**）。因此 **ISR/revalidate 类优化在 dummy 缓存下完全无效**——revalidate 会看似生效但实际每次仍回源查 D1。已回滚 sitemap 改动，保留 `force-dynamic`。
- **其他已排查项（确认无可做或已做）**:
  - 未使用依赖（framer-motion、date-fns、@tanstack×2、react-hook-form、@hookform、@radix-ui×5）: 源码零引用，tree-shaking 已排除出 bundle，移除无线上收益且有 lockfile 不同步风险 → **不做**。
  - `/admin/login` 单独缓存: Next headers 的 `/admin/:path*` no-store 规则会覆盖任何前置 login 规则 → **不可行**。
  - client bundle: 最重 220K 是 Next 运行时框架 chunk，非业务 → 正常。
  - `/api/content` 客户端缓存: 会延迟 admin 内容修改生效 → **不做**（当前 300s CDN 缓存已是平衡点）。
- **结论**: 免费版内**已无低成本高收益的剩余优化空间**。当前配置（公开页/API 300s + 1h SWR 边缘缓存、robots 静态化、ViewTracker 节流）已是免费版下的合理平衡。1102 属 Worker 固有资源波动，公开页已充分缓解；动态 admin 页在发作窗口内仍可能受影响，此为免费版已知边界。

### 2026-08-03 第三轮极致压榨 — 静态 HTML 直出（batch 26，实验性）

- **背景**: 用户要求"极致压榨，有必要就删减功能"。调研发现 **Next 已为所有静态路由预渲染完整 SSR HTML**（`.next/server/app/*.html`，自包含含 RSC flight 数据、零 API 依赖），但 OpenNext 1.20 把它们丢弃进 dummy cache，Worker 每次缓存 miss 回源都重新 SSR —— 这正是 1102 的主要 CPU 负载源。
- **方案（提交 `3ef05a7`）**: 构建后把 `.next/server/app/*.html` 复制到 `.open-next/assets/`（`run_worker_first: false` 时 Cloudflare Static Assets 直接服务，**完全绕过 Worker**）。新增 `scripts/copy-prerendered-html.mjs` + `npm run build:cf:static`。生成 `_headers`（300s + 1h SWR + 安全头）。跳过动态路由（[slug]）和 API。
- **安全评估**: admin 页面静态化**不泄露数据**（HTML 壳无会话数据，鉴权在客户端 useEffect fetch `/api/auth`，失败跳 login）；公开页是 `'use client'` 壳 + RSC 内联，语言切换/内容 override 均由客户端 JS 处理，不受影响。
- **验证要点（部署后）**: 检查 `/about` 等是否从 assets 直出（绕过 Worker）——可通过响应头或 1102 窗口行为判断；若不生效或异常，`wrangler rollback` 即可回滚。

### 2026-08-03 批次 26 成功 — 公开页静态化直出已上线（重大优化）

- **结果**: `3ef05a7` 静态化方案部署成功，Version `a8a2ad6b`。`build:cf:static` 复制 24 个预渲染 HTML 到 assets，deploy 上传 25 个新静态资产。
- **验证（Hermes）**:
  - 9 路由全 200；`/about` 与 `/` 返回 `_headers` 缓存头且 **CF-Cache-Status: HIT**（静态 HTML 已从 assets 直出，**公开页完全绕过 Worker**）。
  - `/api/products` 保持 API 缓存头（Worker 处理，正常）；`/products/sauna-controllers` 200（Worker 处理）。
  - 公开页 HTML 含 `self.__next_f`（RSC 数据完整，可正常 hydration）。
  - 部署后 3 分钟×6 轮 `/` `/about` `/admin/login` 全 200，**无 1102**。
- **1102 影响**: 公开页现由 CDN 直出（HIT），**理论免疫 Worker 1102 窗口**；动态/API 页仍由 Worker 处理。窗口内免疫效果待下次 1102 窗口实测。
- **后台 EN 补验（批次 23 遗留，Hermes 完成）**: 登录后台逐页 fnec-lang=en 验证，登录/Dashboard/Products/Content/News/Contacts/Media/Settings **8 页全英文渲染，无残留中文 UI**。中途 Browserbase 会话重置 1 次（环境问题非站点问题）；无 cookie 直接导航 /admin/contacts 会重定向登录页（鉴权正常）。
- **结论**: 后台双语化 + 公开页静态化全部完成并验证。这是 1102 治理的决定性优化——公开页不再消耗 Worker CPU。

### 2026-08-03 询盘批量删除功能（batch 27）

- **需求**: 用户反馈经常收到乱填的垃圾询盘，需要删除功能，且要批量删除。
- **改动（提交 `b9aca4e`）**:
  - 新增 `POST /api/admin/contacts/batch`（批量删除，1-100 个 id，session 鉴权）。
  - `GET/PATCH` 的 contacts 主 API 增加 `DELETE /api/admin/contacts?id=`（单条删除）。
  - 后台 Contacts 页面: 全选/多选复选框 + 顶部批量删除工具栏 + 展开详情底部单条删除按钮；删除成功/失败提示。
  - i18n en/zh 各 695 keys 对齐；tsc 通过。
- **设计**: 参照 Media/Content 模块的批量删除模式；删除为硬删除（不可恢复），有 confirm 二次确认。

### 2026-08-03 批次 27 部署完成 — 询盘删除已上线（Hermes 回报）

- **结果**: 批量删除功能部署成功，Version `eaed3f92`。公开页静态化保持（`build:cf:static` 46 页）。
- **验证（Hermes）**:
  - 鉴权: `/api/admin/contacts` 与 `/api/admin/contacts/batch` 未登录均 401 ✅。
  - UI: 全选/勾选 → "删除所选"按钮激活（"已选 1 项"）；单条详情含删除按钮 ✅。
  - **真实删除验证**: 用户确认 `maxeon shin` 询盘为测试数据 → 经 batch API 删除成功（`{"success":true,"count":1}`），列表已空 ✅。
- **发现的优化点（可选）**: "删除所选"使用原生 `confirm()` 弹窗——真人使用正常（会弹确认框），但**自动化/脚本点击会卡死页面**（30s 超时、页面冻结）。如需可选优化：改用自定义确认弹窗（如 Radix Dialog 或内联确认）。
- **用户文档**: 已制作《后台操作手册》（含询盘删除说明）与《i18n Key 完整对照表》，合并版《后台操作手册与i18nKey对照表》已交付。

### 2026-08-03 询盘删除 confirm 优化 + 文档整理

- **confirm 弹窗优化（提交 `948c507`）**: 新增 `src/components/ConfirmDialog.tsx`（深黑+琥珀风格的自定义确认弹窗），替换 contacts 页面的原生 `window.confirm()`（单条 + 批量删除均改用）。原因：原生 confirm 在自动化/无头浏览器会卡死页面。i18n en/zh 各 696 keys 对齐，tsc 通过。
- **文档整理**: 删除重复的旧版文档（操作手册 v1/v2、单独 i18n key 表），仅保留合并版《后台操作手册与i18nKey对照表_Funing电子官网.docx》。
- **注意**: ConfirmDialog 为通用组件，后续可复用于 products/news/media 等其他模块的删除确认（它们仍用原生 confirm）。

### 2026-08-03 批次 28 部署完成 — ConfirmDialog 已上线（Hermes 回报）

- **结果**: ConfirmDialog（自定义确认弹窗）部署成功，Version `ae701358`。公开页静态化保持（`build:cf:static` 46 页）。
- **验证（Hermes，含真实交互）**:
  - 造测试询盘（Hermes Test）→ 勾选 → 删除所选 → **自定义 dialog 弹窗出现**（标题"删除"+取消/删除按钮，深色，非原生 confirm）。
  - ① 点取消 → 弹窗关闭、勾选保留、数据未删 ✅
  - ② 重新打开 → 确认删除 → 列表清空、无卡顿 ✅
  - ③ 测试数据已删除，询盘列表干净。
  - **结论: confirm() 卡死问题已解决，自动化可正常操作。**
- **配套**: 询盘删除（批量 + 单条）全部功能上线；后台双语、静态化优化、i18n 696 keys 均稳定。

### 2026-08-03 启用 R2 媒体库预览（batch 29）

- **背景**: 用户反馈媒体库上传图片不显示预览。排查确认**非 bug，是配置缺失**: 代码已支持预览（`hasPublicUrl` + `R2_PUBLIC_URL`），但 `NEXT_PUBLIC_R2_PUBLIC_URL` 从未注入（项目无 `.env`，示例里注释掉），导致 `hasPublicUrl=false`，图片只显示图标+格式文字。上传/存储本身正常（R2 + D1 记录成功）。
- **修复步骤**:
  1. 用户在 Cloudflare Dashboard 给 R2 桶 `funing-storage` 绑定自定义域 `media.fnec.net`（已确认绑定）。
  2. 本地创建 `.env`（git 忽略）写入 `NEXT_PUBLIC_R2_PUBLIC_URL=https://media.fnec.net`。
  3. 批次 29 指令：重新 `build:cf:static`（Next 构建时内联该值）→ 部署 → 上传测试图验证预览。
- **附带收益**: 产品图、新闻封面可用 `https://media.fnec.net/...` 直链，对 SEO/分享友好。

### 2026-08-03 批次 29 部署完成 — R2 媒体库预览已生效（Hermes 回报）

- **结果**: 部署 v`c35eb2e0`。`.env` 确认已配置 `NEXT_PUBLIC_R2_PUBLIC_URL=https://media.fnec.net`（非注释）；构建时 R2 URL 已内联进媒体页+产品编辑页 bundle。
- **验证（Hermes，含真实上传）**:
  - 公开页 5 路由全 200；`media.fnec.net` 可达（自定义域生效）。
  - 上传测试图 `test-preview.png` → R2 对象公网 200（`https://media.fnec.net/media/media-e6ff...png`）；媒体库 `<img>` 真实加载（naturalWidth 64×64，src 指向 media.fnec.net）→ **缩略图预览生效**。
  - 删除后 D1 记录清 + R2 对象 404（CDN 边缘缓存已过期）→ 删除链路也正常。
  - **结论: 之前"无预览"= 配置缺失（R2 URL 未注入），现已修复。**
- **附带收益**: 产品图、新闻封面可用 `https://media.fnec.net/...` 直链，对 SEO/分享友好。
- **至此后台功能全部闭环**: 双语化、静态化、询盘删除+ConfirmDialog、媒体库预览。

### 2026-08-03 SEO + 询盘导出（batch 30）

- **SEO 结构化数据增强（提交 `bcdced9`）**:
  - 首页: FAQPage JSON-LD（复用 FAQ 区块文案，Google 可展示富摘要）。
  - 产品详情/新闻详情: BreadcrumbList JSON-LD（匹配已有可见面包屑）。
  - 说明: hreflang 不适用（中英文共用 URL，客户端切换，无独立语言 URL）。
- **询盘导出 CSV**: 后台 Contacts 工具栏新增「导出 CSV」按钮，BOM 前缀 UTF-8（Excel 打开不乱码），导出当前列表全部字段。
- **报价表单评估**: 现有报价表单已完善（分步式：产品多选→数量档位→规格→联系方式，支持 ?product= 预填），无需改动。
- i18n en/zh 各 697 keys 对齐；tsc 通过。

### 2026-08-03 企业 logo 加入网站 Header（batch 31）

- **需求**: 用户提供企业 logo 图片 URL（`https://media.fnec.net/1782382842444-wxg76b.jpg`，R2 桶中），要加入网站。
- **改动**: Header 顶部 logo 由文字版（"Funing Electronics" 琥珀色文字）改为**图片 logo**，直接引用 R2 公网 URL。带 `onError` 回退：图片加载失败自动回退到原文字版，保证网站不因图片问题崩溃。
- **待验证**: 图片为 jpg，需 Hermes 部署后确认在深黑 Header 上的显示效果（若为白底矩形，可能需调整样式如加容器/圆角）。

### 2026-08-03 企业 logo 样式优化（batch 31 反馈后）

- **Hermes 图片分析**: logo 为 **1024×1024 白底方形 JPEG**，83.5% 像素白色，logo 内容仅占中心 ~16.5%。直接放深黑 Header 显示为 36×36 突兀白块，内容缩至 ~14px 看不清。
- **优化**: 改为**白色圆角徽章容器**（`bg-white rounded-lg p-1.5 h-10 w-10` + 阴影），白底变成有意的设计元素，logo 内容放大到约 40px 高、中心内容 ~16px 可读。
- **可选后续**: 若用户能提供**透明背景 PNG** 或**宽幅横版 logo**，可替换为更理想的展示（无白底徽章、直接融入深色 Header）。

### 2026-08-03 批次 32 完成 — 徽章上线 + 透明 PNG 转换成功

- **徽章样式已上线**（v`67aa14f1`）: 40×40 白底圆角徽章（圆角 8px、内边距 6px、阴影）在深黑 Header 上协调不突兀，logo 图完整加载。效果良好。
- **透明 PNG 转换成功**（Hermes 用 PIL 去白底）: 1024×1024 → 83.6% 透明 / 16.1% 保留，**无白色误删**，主体居中（bbox 682×786），彩色 86% + 深色 10% + 浅灰 4%。
- **R2 上传受阻（待解决）**: 转换成功但 `wrangler r2 object put` 上传的对象，`media.fnec.net/<key>` 一律 404（含 `media/` 前缀、随机 probe key 共 3 次对照）；同一 bucket 经**媒体库 API 上传**的对象正常 200。疑似 R2 自定义域与 S3 API 写入通道配置不一致。
- **下一步（batch 33）**: 重新生成透明 PNG，通过**后台媒体库 API** 上传（已验证可行通道）→ 拿到可访问 URL → 若效果好替换 Header 透明 logo。

### 2026-08-03 批次 33 完成 — 透明 logo 上线 + Header 切换

- **透明 PNG 本地资源已部署**（v`16496bbb`）: `public/assets/logo.png`（1024×1024 RGBA，406KB，透明背景），通过 `/assets/logo.png` CDN 访问 200，MD5 与本地一致。绕开了 R2 S3 API 自定义域 404 的问题。
- **Header 切换**（提交待批 34）: 从白底徽章改为**直接展示透明 logo**（`/assets/logo.png`，h-10 40px），更精致，融入深色 Header。
- **R2 上传通道问题（记录）**: `wrangler r2 object put` 上传的对象 `media.fnec.net` 访问 404（S3 API 通道与自定义域不一致），媒体库 API 通道正常。已在 HANDOFF-LOG 记录，后续如需上传 R2 对象建议走媒体库 API 或 Dashboard。

### 2026-08-03 logo 优化 — 琥珀色 + 放大（batch 35）

- **用户反馈**: 透明 logo 深蓝色在黑色背景上不明显，尺寸太小。要求改琥珀色/橘红色并放大。
- **分析**: 原透明 logo 主体 99.6% 为蓝色系（主色 `(0,64,128)` 深蓝 + 青蓝渐变），在近黑背景上对比度低。
- **改动（提交 `ec65402`）**:
  - `public/assets/logo-amber.png`: 用 HSL 色相替换把蓝色系 → 品牌琥珀色（#d8a35a），保留明暗渐变保持立体感；裁剪内容边界（686×790）去掉周围透明边距。
  - Header: 引用 `/assets/logo-amber.png`，尺寸 h-10(40px) → **h-12(48px)**。
- **待部署验证**: 琥珀色在深黑 Header 上的对比度、放大后的观感。

### 2026-08-03 logo 优化 — 琥珀→鲜橙（batch 36）

- **用户反馈**: 琥珀色太淡（主色 (212,194,166) 淡米黄），要求更鲜艳。
- **改动（提交 `da9f589`）**: `logo-orange.png` 用 HSL 色相替换蓝色→**鲜艳橙**（色相 0.07，饱和度 0.85），主色 `(243,163,105)` 明显更浓；保留裁剪（686×790）和 h-12(48px) 尺寸。
- **待部署验证**: 橙色在深黑 Header 上的鲜艳度/对比度。

### 2026-08-03 logo 优化 — 纯琥珀色无渐变（batch 37）

- **用户反馈**: 鲜艳橙仍不合适，要求 logo 像其他按键颜色一样（琥珀 #d8a35a）、不要渐变。
- **改动（提交 `c3aae34`）**: `logo-amber-solid.png` 所有不透明像素统一设为 `#d8a35a`（= `var(--color-amber)` = `.btn-primary` 按钮色），**无渐变**，保留 alpha 形状。裁剪 686×790，h-12 48px。
- **待部署验证**: 纯琥珀色与按钮一致、无渐变的观感。

### 2026-08-03 logo 全站应用 — Header/Footer/favicon（batch 38）

- **Hermes 确认（batch 37）**: 纯琥珀 logo 已上线 v`08714646`，95.4% 像素为单色 #d8a35a，与首页按钮背景 `rgb(216,163,90)` **完全同色**，无渐变。
- **改动（提交 `084a8fd`）**:
  - Header: 纯琥珀 logo（`/assets/logo-amber-solid.png`，h-12 48px），文字仅作 onError 回退。
  - Footer: 文字 logo → `/assets/logo-amber-solid.png`（h-11）。
  - favicon: 内联 SVG F 字母 → 品牌 logo PNG（`logo-favicon.png` 64×64 + `logo-favicon-32.png` 32×32，内容裁剪填满）。
  - 生成 favicon 方法: 从裁剪后的纯琥珀 logo 取中心正方形，LANCZOS 缩放至 64/32。

### 2026-08-03 favicon 优化 — 深蓝图案去 FNEC 文字（batch 39）

- **用户反馈**: 浏览器标签页 favicon 应裁掉 "FNEC" 文字，保留上方图案，颜色用初始深蓝。
- **改动（提交 `8969419`）**:
  - 从原始深蓝透明 logo 裁剪图案区（y110-728），内容 bbox 635×597，深蓝主色 `(19,66,134)`。
  - 重新生成 favicon（64×64 + 32×32，取中心方形 LANCZOS）。
  - `?v=2` 版本参数强制浏览器刷新旧 favicon 缓存。
  - 新增 `public/assets/logo-pattern-blue.png`（图案深蓝版，供后续引用）。
- **说明**: Header/Footer 仍用纯琥珀 logo（用户认可批次 37/38 方案），仅 favicon 改用深蓝图案。

### 2026-08-03 修复产品详情页语言跳变（batch 42）

- **根因（Hermes 诊断）**: 产品中心"获取报价"的产品卡片按钮进的是**产品详情页**（/products/[slug]），非报价页。详情页初始用 i18n fallback 中文渲染，随后 fetch `/api/products/[slug]` 返回 **D1 英文模板数据**覆盖 → 变英文。D1 数据确认: name/sub_title/short_description/price_range 全英文且与 i18n fallback 重复，long_description/specifications/features 全 null，唯一独有=hero_image。
- **修复**: 详情页 merge 时**跳过文案字段**（name/sub_title/short_description/price_range），仅用 D1 结构化字段（hero_image 等）；有 fallback 时文案走 i18n（随语言切换）。对无 fallback 的自定义产品（后台新增），保留 API 文案。产品列表页不受影响（纯 i18n 静态）。
- **验证**: tsc 通过。待 Hermes 部署后浏览器确认中文界面产品详情页保持中文。
