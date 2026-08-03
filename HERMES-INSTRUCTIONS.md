# Hermes 操作指令（Claude Code 下发）

> 批次: 第二十六批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 极致压榨 — 静态 HTML 直出（公开页绕过 Worker），推代码 + `build:cf:static` + 部署 + 专项验证。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- 用户要求"极致压榨"。调研发现 Next 已为所有静态路由预渲染完整 HTML（`.next/server/app/*.html`），但 OpenNext 1.20 将其丢进 dummy cache，Worker 每次缓存 miss 回源仍重跑 SSR（1102 主要 CPU 源）。
- 提交 `3ef05a7`：新增 `scripts/copy-prerendered-html.mjs`（构建后把 HTML 复制进 `.open-next/assets/` + 生成 `_headers`）+ `npm run build:cf:static`。
- **原理**: wrangler `[assets]` 默认 `run_worker_first: false`，Cloudflare Static Assets 会优先服务 assets 里的静态文件。复制后的 `about.html`、`index.html`、`admin/login.html` 等会从 CDN 直接返回，**完全绕过 Worker**。
- **跳过**: 动态路由（`products/[slug]`、`news/[slug]`）和 `/api/*` 不进 assets，仍由 Worker 处理。

## 任务 1：推代码（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

预期: 推送 `3ef05a7` 及前面待推送的提交；`git log origin/master..HEAD --oneline` 为空。

## 任务 2：清缓存构建 + 复制 HTML + 部署（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf:static
npm run deploy
```

预期:
- `build:cf:static` = `build:cf` + `copy:html`，日志出现 "Copied 24 prerendered HTML files" 和 "Wrote .open-next/assets/_headers"。
- 部署成功，线上版本更新。

## 任务 3：验证静态化生效（终端，关键）

```bash
# 全路由回归
for u in "/" "/about" "/products" "/news" "/contact" "/admin/login" "/api/products" "/api/news" "/robots.txt"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
# 确认公开页响应头（静态化后应从 CDN 返回缓存头）
curl -s -D - -o /dev/null "https://fnec.net/about"
curl -s -D - -o /dev/null "https://fnec.net/"
```

预期:
- 全部路由 **HTTP 200**。
- `/about` 与 `/` 返回 `cache-control: public, max-age=0, s-maxage=300, stale-while-revalidate=3600`（来自 `_headers`）—— 说明静态 HTML 已从 assets 直出。
- `/api/products` 仍返回 API 的 `cache-control: public, s-maxage=300, stale-while-revalidate=3600`（Worker 处理，正常）。

## 任务 4：静态化行为抽查（终端）

```bash
# 检查公开页 HTML 是否完整（含 RSC flight 数据）
curl -s "https://fnec.net/about" | grep -c "self.__next_f"
curl -s "https://fnec.net/" | grep -c "self.__next_f"
# 检查动态路由仍由 Worker 处理（产品详情）
curl -s -o /dev/null -w "/products/sauna-controllers -> HTTP %{http_code}\n" "https://fnec.net/products/sauna-controllers"
```

预期:
- 公开页 HTML 含 `self.__next_f`（RSC 数据内联，页面可 hydration）。
- 产品详情 200（Worker 处理）。

## 任务 5：1102 观察（报告即可）

- 部署后记录是否有 1102；公开页（/、/products、/news、/about）是否全程 200（静态化后应完全不受 Worker 窗口影响）；动态/API 在窗口内是否仍受影响。

> ⚠️ **回滚预案**: 若验证发现静态化未生效或有异常（如页面 500/空白/404），执行 `wrangler rollback` 回到部署前版本即可（assets 改动随版本回滚）。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建+部署 | 待执行 | |
| 3 验证 | 待执行 | |
| 4 行为抽查 | 待执行 | |
| 5 1102 观察 | 待执行 | |
