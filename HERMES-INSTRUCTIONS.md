# Hermes 操作指令（Claude Code 下发）

> 批次: 第十八批 · **紧急恢复** · 更新: 2026-08-03 · 来源: Claude Code
> 优先级: **最高** — 线上全站 HTTP 1102（Worker 超出资源限制），网站不可访问。

---

## 事故概述

- 现象: `https://fnec.net` 全站返回 **1102 Worker exceeded resource limits**（Ray ID a250b7852bf52eba，2026-08-02 23:03 UTC）。
- 已知正常版本: **批次17部署 Version `fa572c9c-a75c-44f9-9e56-9af37f61606d`**（Hermes 已验证 9 路由全 200）。
- 疑似根因: 06:46 有**并发 cron 会话重新构建了 `.open-next`**（server-functions 达 32MB）并可能部署了异常版本覆盖正常版；叠加 `open-next.config.ts` 为 `incrementalCache: 'dummy'`（无边缘缓存），每个公开页全量 SSR + 查 D1，免费版 10ms CPU 限额极易被打满。
- 风险: 有多个 "Dev auto loop" 会话并发运行，可能再次覆盖部署。

## 任务 1：立即确认线上错误（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
curl -s -o /dev/null -w "root -> HTTP %{http_code}\n" "https://fnec.net/"
curl -s -o /dev/null -w "products -> HTTP %{http_code}\n" "https://fnec.net/products"
```

若任一非 200 → 确认事故在持续。

## 任务 2：回滚到已知正常版本（核心恢复动作）

```bash
cd C:\Users\xxq\axissaunas-clone
npx wrangler deployments list
```

从列表中找到 Version ID 开头为 `fa572c9c-` 的那条（批次17，已知正常），然后：

```bash
npx wrangler rollback --message "revert to batch17 (fa572c9c) — batch18 hotfix for 1102"
```

> 若 `rollback` 命令不可用（wrangler 版本限制），改用 Dashboard：Workers → funing-website → Deployments → 找到 `fa572c9c` → **Rollback to this deployment**。

回滚后再次 curl 根路径，预期回到 200。

## 任务 3：确认恢复 + 防止复发

```bash
for u in "/" "/products" "/news" "/admin/login" "/sitemap.xml" "/robots.txt"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
npx wrangler tail --format pretty
```

- 预期: 全部 200；tail 无 `CPU time limit` / `exceeded` 报错。
- **重要 — 防复发**: 若本地有残留 node 进程或并发部署在跑，请勿再次部署；本批仅回滚，**不要重新 build:cf/deploy**（会把 32MB 异常产物再推上去）。后续修复（加边缘缓存 / 减体积）由 Claude Code 下一批指令处理。

## 任务 4：回报

在回报表填写: 回滚到的 Version、回滚后各路由状态码、wrangler tail 中看到的错误类型（CPU time limit / memory / other）。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 确认错误 | 待执行 | |
| 2 回滚 | 待执行 | |
| 3 验证+防复发 | 待执行 | |
