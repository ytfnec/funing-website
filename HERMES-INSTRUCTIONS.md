# Hermes 操作指令（Claude Code 下发）

> 批次: 第十九批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 1102 事故已回滚恢复（第十八批）。本批将性能加固代码（公开 API CDN 缓存头）构建部署上线。

---

## 背景

- **线上已恢复**: 第十八批已 `wrangler rollback` 到批次17 版本 `fa572c9c`，全路由 200、tail 无报错。
- **本批内容**: 部署性能加固提交 `8373bff`——给公开只读 API `/api/products`、`/api/products/[slug]`、`/api/news` 加 `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`，让 Cloudflare CDN 缓存这些 JSON 响应，减少 Worker 调用 + D1 查询（缓解 1102 CPU 限额）。
- **代码状态**: 加固提交 `8373bff` 及后续 HANDOFF-LOG `c64a736`、第十八批指令 `99d7034` 已被上一轮 Hermes 推送同步至 origin/master（本地 `git log origin/master..HEAD` 为空）。本批**仅构建部署，无需再 push**（如需，`git push` 会自动推剩余）。

## 任务 1（可选）：确认无未推送提交

```bash
cd C:\Users\xxq\axissaunas-clone
git log origin/master..HEAD --oneline
```

预期: 输出为空（加固代码已推送）。

## 任务 2：清缓存 + 构建 + 部署

> ⚠️ 必须清缓存（`.next`/`.open-next`），构建前确认无残留 node 进程（`tasklist | grep node`）。本批无 schema 变更，无需 db:deploy。

```bash
cd C:\Users\xxq\axissaunas-clone
npm run clean
npm run build:cf
npm run deploy
```

> 注: 本次构建产物应显著小于 06:46 那个异常版本（server-functions 32MB）。部署成功后用 `npx wrangler deployments list` 确认新版本接管 100% 流量。

## 任务 3：验证

### 3.1 公开路由全部 200

```bash
for u in "/" "/products" "/news" "/contact" "/quote" "/admin/login" "/sitemap.xml" "/robots.txt"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
```

预期: 全部 **HTTP 200**。

### 3.2 缓存头专项（本批核心）

```bash
# 公开只读 API 应返回 Cache-Control: public, s-maxage=60, stale-while-revalidate=300
for u in "/api/products" "/api/news" "/api/products/sauna-controllers"; do
  echo "--- $u ---"
  curl -s -D - -o /dev/null "https://fnec.net$u" | grep -i "cache-control"
done
```

预期: 三条均返回 `cache-control: public, s-maxage=60, stale-while-revalidate=300`。

### 3.3 wrangler tail 冒烟

```bash
npx wrangler tail --format pretty
```

预期: 连续请求下无 `CPU time limit` / `exceeded` 报错，全部 `Ok`。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 确认无未推送 | 待执行 | |
| 2 构建部署 | 待执行 | |
| 3 验证 | 待执行 | |
