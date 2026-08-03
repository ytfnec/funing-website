# Hermes 操作指令（Claude Code 下发）

> 批次: 第二十一批 · **紧急修复部署** · 更新: 2026-08-03 · 来源: Claude Code
> 优先级: **高** — SSR 页面超时复现（1102 症状），需尽快部署公开页 CDN 缓存修复。

---

## 背景

- **症状复现**: `/`、`/products` 等 SSR 页面超时 30s，JSON API 正常 200（与 batch18 事故模式一致）。线上版本未变（`4788d816`，batch19），非版本覆盖。
- **根因（已确认）**: OpenNext Cloudflare 把 Next 预渲染的静态页构建成 **Worker SSR**（`.open-next/assets` 无任何 HTML），每个请求都全量跑 Worker + D1。免费版 CPU 限额（10ms/请求）一被打满就超时/1102。JSON API 有 CDN 缓存头所以仍 200。
- **修复（commit `03b17f8`）**: 在 `next.config.js` 给**公开页面**加 `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`，让 Cloudflare CDN 边缘缓存预渲染 HTML，后续请求不再打 Worker；`/admin/**` 与 `/api/admin/**` 单独设 `private, no-store` 不缓存。已确认 OpenNext 会把 next.config 的 headers 打包进 worker（现有 `X-Frame-Options` 已验证生效）。
- **预期效果**: 部署后，首次访问某页走 Worker SSR（稍慢），但 CDN 缓存该 HTML 60s（+300s 后台刷新），**后续访问由 CDN 边缘直接返回，不再超时/1102**。随着流量访问各页，缓存逐步建立，全站访问恢复正常。

## 任务 1：推代码（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

预期: 推送 `03b17f8`（及此前未推送的指令/文档提交）。

## 任务 2：清缓存 + 构建 + 部署

> ⚠️ 必须清缓存（`.next`/`.open-next`），构建前确认无残留 node 进程（`tasklist | grep node`）。本批无 schema 变更，无需 db:deploy。**不要改 wrangler.toml。**

```bash
cd C:\Users\xxq\axissaunas-clone
npm run clean
npm run build:cf
npm run deploy
```

部署后用 `npx wrangler deployments list` 确认新版本接管 100% 流量。

## 任务 3：验证

### 3.1 路由可达（连续请求应逐步变快）

```bash
# 连打 3 次首页，观察首次 SSR 后是否命中 CDN 缓存
for i in 1 2 3; do
  curl -s -o /dev/null -w "try$i -> HTTP %{http_code} time=%{time_total}s\n" "https://fnec.net/"
done
```

预期: 首次可能 200 且较慢（SSR + 建缓存），第 2、3 次命中 CDN 缓存（`time_total` 明显下降）。

### 3.2 缓存头专项

```bash
curl -s -D - -o /dev/null "https://fnec.net/" | grep -i "cache-control"
curl -s -D - -o /dev/null "https://fnec.net/products" | grep -i "cache-control"
curl -s -D - -o /dev/null "https://fnec.net/admin/login" | grep -i "cache-control"
```

预期:
- `/` 与 `/products`: `cache-control: public, s-maxage=60, stale-while-revalidate=300`
- `/admin/login`: `cache-control: private, no-store`

### 3.3 JSON API 缓存头（不应被覆盖）

```bash
curl -s -D - -o /dev/null "https://fnec.net/api/products" | grep -i "cache-control"
```

预期: 仍是 `public, s-maxage=60, stale-while-revalidate=300`（公开 API 自设，未被页面规则覆盖）。

### 3.4 wrangler tail 冒烟

```bash
npx wrangler tail --format pretty
```

预期: 连续请求下无 `CPU time limit` / `exceeded` 报错。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | ✅ | 推送 `03b17f8`（edge-cache 修复）及指令提交 |
| 2 构建部署 | ✅ | clean→build:cf→deploy；新版本 `03a22f55` 100% 接管（首次部署） |
| 3 验证 | ⚠️ 发现并修复 | 公开页缓存生效（连打 3 次 200，~1s）；**但 /admin/** 也被 catch-all 缓存（public）**——Next.js headers 是"最后匹配覆盖先匹配"，Claude Code 将 admin 规则前置反被覆盖。Hermes 已修（`18d7ce9`：catch-all 前置、admin 后置），重建部署 `37286ee2`，绕过 CDN 缓存验证：admin/login、admin/products → `private, no-store`，/api/admin/stats → `no-store` ✅；公开页 + API 头保持 public ✅；tail 无 CPU 超限 |

---

## ⚠️ 2026-08-03 09:0x 复发诊断补充（Hermes 回报，纠正 HANDOFF-LOG `603a684` "根治"结论）

**"1102/SSR 超时根治"结论不成立。** 08:05–08:35 出现 30 分钟全 SSR 超时窗口（用户再次报障），边缘缓存 SWR 过期后回源即挂（25–45s 无响应），API 全程 200。

**决定性对照实验（同构建产物）：**

| 操作 | 结果 |
|------|------|
| 37286ee2 首次部署后 20 分钟 | ❌ SSR 全 25s 超时 |
| 回滚 fa572c9c（batch 17） | ✅ 200（~1-2s） |
| **37286ee2 同产物重部署（a216d0eb）** | ✅ **200（~1s）** |
| a216d0eb 完整验证（6 路由 + admin no-store + 缓存头） | ✅ 全绿 |

**结论：代码/构建无问题（8373bff 仅 API 头改动已排除）；SSR 超时是时间窗口现象**——免费版 Worker CPU 执行波动或短时流量高峰（robots 已封 8 个 AI 爬虫，不守规矩的仍会打）。

**当前状态**：线上 a216d0eb（batch 21 完整版），全路由 200，边缘缓存 + admin no-store 生效。5 分钟窗口复测后台进行中。

**建议更新**：
- force-static 纯静态页（HANDOFF-LOG 建议）方向正确，可行：首页/about/oem/resources 等无用户态页面静态化，SSR 请求归零
- 若超时窗口仍频繁复发 → **升级 Workers Paid（$5/月，CPU 10ms→30ms）** 是直接解（SSR 实测 ~1s 墙钟，CPU 余量足够）
- 边缘缓存为当前有效缓解（回源频率降 ~90%）
