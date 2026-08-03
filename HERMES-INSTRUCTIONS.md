# Hermes 操作指令（Claude Code 下发）

> 批次: 第二十四批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 免费版优化（边缘缓存加长 + 视图上报节流）+ 后台 i18n 遗留清理，推代码 + 清缓存构建部署 + 验证。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- 用户拍板**保持免费版、不升级 Workers Paid**。据此在免费版框架内继续缓解 1102。
- 提交 `36d3138`（8 文件）: 公开页/API 边缘缓存加长（60s→300s，SWR 300→3600）、robots 静态化、ViewTracker 节流。
- **追加提交 `a45c6fb`（i18n 清理）**: contacts `Save failed`、layout 头像 fallback `'A'`、products alt fallback `'Media item'` 三处硬编码改为 i18n key。**需一并部署**。
- 纯前端/配置改动，无 DB 迁移，无 wrangler 改动。

## 任务 1：推代码（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

预期: 推送 `a45c6fb`（批次 24 其余提交 `36d3138`/`d20f049` 等若已在 origin 则跳过）；推送后 `git log origin/master..HEAD --oneline` 输出为空。

## 任务 2：清缓存构建部署（终端）

> 若你之前已完成 `36d3138` 的部署（线上已是新缓存参数），本任务仍需执行一次以包含 `a45c6fb` 的 i18n 清理改动；若尚未部署过，则本次统一部署。

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf
npm run deploy
```

预期: 构建成功、部署成功，线上版本更新（包含 `36d3138` + `a45c6fb` 全部改动）。

## 任务 3：验证（终端）

```bash
for u in "/" "/products" "/news" "/api/products" "/api/news" "/robots.txt"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
curl -s -D - -o /dev/null "https://fnec.net/" | grep -i "cache-control"
curl -s -D - -o /dev/null "https://fnec.net/api/products" | grep -i "cache-control"
```

预期:
- 全部路由 **HTTP 200**（含 robots.txt）。
- `/` 与 `/api/products` 均返回 `cache-control: public, s-maxage=300, stale-while-revalidate=3600`。

## 任务 4：1102 专项观察（报告即可，不操作）

- 若部署后遇 1102 超时窗口，记录: 起始时间、持续时长、哪些请求受影响（带 cookie 浏览器 vs 无 cookie curl）、是否在 1 小时内自行恢复。
- 目的: 验证新缓存参数（SWR 3600）是否能覆盖常见 1102 窗口，让 CDN 持续服务。

> 本批有前端代码改动，需完整构建部署；**不要**运行 db:deploy（无 schema 变更）。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建部署 | 待执行 | |
| 3 验证 | 待执行 | |
| 4 1102 观察 | 待执行 | |
