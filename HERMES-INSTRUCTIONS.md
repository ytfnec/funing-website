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
| 1 推代码 | ✅ | `d394bbe..d20f049` 已推送（含 perf 提交 36d3138），origin/master..HEAD 为空 |
| 2 构建部署 | ✅ | build:cf 成功；deploy 成功，Version ID `4788d816-eaf9-4da3-b710-380d418eddbd` |
| 3 验证 | ✅ | `/` `/products` `/news` `/api/products` `/api/news` `/robots.txt` 全部 HTTP 200；`/` 与 `/api/products` 均返回 `cache-control: public, s-maxage=300, stale-while-revalidate=3600`（部署后约 2 分钟旧缓存过期后新头生效） |
| 4 1102 观察 | ✅ 已记录 | 见下方专项记录 |

## 1102 专项观察记录（任务 4，2026-08-03）

- **发作时段**：16:45 起 SSR/登录 API 间歇挂，异常延长（>2h，常规窗口 15-30min）
- **17:44-18:28**：带 cache-buster 轮询 25 次全连接超时（000）；期间无 cookie curl 的静态/API 页多 200（/products /news /api/products）
- **18:29 重部署 e6009a07** → 全 200，仅稳定 ~5 分钟
- **18:33-34 复发**：浏览器（带 session）切 EN 刷新 /admin/dashboard → 1102；无 cookie curl /admin/login 同时刻 200
- **18:36 重部署 76c1d01e** → 全 200；18:39 浏览器 /admin/login 再 1102（curl 同时刻 200）；18:40 浏览器连接超时
- **18:43**：/ 200、/admin/login 000、/products 200（间歇）
- **18:47 部署 4788d816**（本批）→ 部署瞬间 / 000，随后恢复
- **19:00 后**：全路由 200，新缓存头（SWR 3600）生效
- **结论**：带 cookie/重负载请求更易触发 1102（Worker 资源问题，历史已知，非代码）；本批 SWR 300→3600 生效后，1102 窗口内 CDN 可凭 stale 内容持续服务，是否覆盖窗口需后续发作时再验证 |
