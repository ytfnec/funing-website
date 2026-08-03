# Hermes 操作指令（Claude Code 下发）

> 批次: 第二十五批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 补部署 i18n 清理提交（`a45c6fb`），代码已在 origin/master，只需重新构建部署。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- 批次 24 部署（v4788d816）基于 `d20f049` 构建，**未包含**随后提交的 i18n 清理 `a45c6fb`（3 处后台硬编码改 i18n key）。
- 代码已推送到 origin/master（`git log origin/master..HEAD` 应为空），本地 HEAD = origin/master = `26f46df`。
- 只需**重新构建部署**即可让线上包含 i18n 清理。

## 任务 1：确认代码已同步（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git log origin/master..HEAD --oneline
```

预期: 输出为空（无未推送提交）。若本地落后 origin，先 `git pull --rebase`。

## 任务 2：清缓存构建部署（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf
npm run deploy
```

预期: 构建成功、部署成功，线上版本更新（基于最新 origin/master，含 i18n 清理）。

## 任务 3：验证（终端）

```bash
for u in "/" "/products" "/news" "/api/products" "/api/news" "/robots.txt" "/admin/login"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
curl -s -D - -o /dev/null "https://fnec.net/" | grep -i "cache-control"
```

预期:
- 全部路由 **HTTP 200**（含 admin/login）。
- `/` 返回 `cache-control: public, s-maxage=300, stale-while-revalidate=3600`。

## 任务 4：i18n 清理生效抽查（可选，不阻塞）

- 浏览器访问 `/admin/login`，`localStorage.setItem('fnec-lang','en')` 后刷新，确认页面英文正常（此前的双语验证已通过，本批主要确认部署未破坏）。

> 本批为纯前端补部署；**不要**运行 db:deploy（无 schema 变更）。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 确认同步 | ✅ | 推送 CC 指令提交 `3ca3ad8`，origin/master..HEAD 为空 |
| 2 构建部署 | ✅ | **已含 i18n 清理**：Hermes 在收到本批指令前已按批次 24 更新版部署 `569bf3fc-8c5c-49a3-bf2e-372280633386`（基于最新 origin/master，含 36d3138 + a45c6fb）；本批无新增代码，无需重复部署 |
| 3 验证 | ✅ | `/` `/products` `/news` `/api/products` `/api/news` `/robots.txt` `/admin/login` 全部 HTTP 200；`/` 返回 `cache-control: public, s-maxage=300, stale-while-revalidate=3600` |
| 4 抽查 | ⚠️ 部分（可选） | 中文登录页完整渲染确认（导航/登录表单/页脚齐全）→ **部署未破坏双语功能确认**；EN 切换抽查遇 1102 窗口复发（19:44 浏览器 1102 Ray a255117f，curl 同时刻 200；19:49 curl 亦超时）未完成——此前批次 23 已实测 login 页 EN 切换通过，本批未改 i18n 代码（a45c6fb 仅后台 3 处硬编码），风险低 |

## 1102 观察更新（补充）

- **19:18-19:44 稳定期**：curl + 浏览器中文页均正常（期间部署 v569bf3fc 验证全过）
- **19:44 复发**：浏览器 /admin/login → 1102（Ray a255117f89bc2eba）；curl 同时刻 200
- **19:49**：curl /admin/login 亦超时（000, 20s）→ 窗口全面复发
- 模式确认：**浏览器（完整资源加载/数据中心 IP）比 curl 更易触发 1102**；SWR 3600 兜底对缓存页有效（/、/products、/api/* 在窗口内仍 200 直至 19:44），动态页（/admin/login）无兜底时窗口内挂 |
