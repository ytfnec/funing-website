# Hermes 操作指令（Claude Code 下发）

> 批次: 第二十批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 开发循环正式收尾。功能队列 8 项全部完成并部署；第十九批性能加固已部署验证通过。本批无开发任务，仅做最终状态确认。

---

## 背景

- **功能队列已完成**: HANDOFF-LOG.md 第八节进度表显示队列 8 项全部 ✅ 已部署（批次 11–17）。
- **性能加固已上线**: 第十九批已部署 Version `4788d816-eaf9-4da3-b710-380d418eddbd`，公开只读 API 均返回 `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`，wrangler tail 无 CPU 超限。
- **代码状态**: 本地无未推送提交（`git log origin/master..HEAD` 为空），工作区干净，无待执行指令。
- **结论**: 自动开发循环无更多功能待实现，本批不做任何代码变更。**建议人工审查**下列浏览器人工项后收尾。

## 任务 1：确认无未推送提交

```bash
cd C:\Users\xxq\axissaunas-clone
git log origin/master..HEAD --oneline
```

预期: 输出为空。

## 任务 2：线上最终状态确认（只读，不构建不部署）

```bash
for u in "/" "/products" "/news" "/contact" "/quote" "/admin/login" "/sitemap.xml" "/robots.txt"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
curl -s -D - -o /dev/null "https://fnec.net/api/products" | grep -i "cache-control"
```

预期: 全部 **HTTP 200**；`/api/products` 返回 `cache-control: public, s-maxage=60, stale-while-revalidate=300`。

> 注: 本批**无需**清缓存/构建/部署，也不修改任何代码或 schema。

## 任务 3：验收清单 — 可自动化项（只读 curl，无人工参与）

> 对应 `MANUAL-ACCEPTANCE-CHECKLIST.md`。以下条目 cron 可用 curl 自动验证，请逐项跑并回报结果。**浏览器人工项见下文清单，不在此执行。**

```bash
# ① 全部公开路由 200（覆盖清单 0/7）
for u in "/" "/about" "/accessories" "/contact" "/cookies" "/elevate" "/news" "/oem" "/privacy" "/products" "/quote" "/resources" "/terms" "/thank-you" "/admin/login" "/sitemap.xml" "/robots.txt"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done

# ② 缓存头专项（清单第 7 项）
for u in "/api/products" "/api/news" "/api/products/sauna-controllers"; do
  echo "--- $u ---"
  curl -s -D - -o /dev/null "https://fnec.net$u" | grep -i "cache-control"
done

# ③ 结构化数据存在性（清单第 1 项，若线上有已发布文章可验证 NewsArticle）
echo "--- 首页 JSON-LD 类型 ---"
curl -s https://fnec.net/ | grep -o '"@type":"[^"]*"' | sort -u
echo "--- 产品详情 JSON-LD 类型 ---"
curl -s https://fnec.net/products/sauna-controllers | grep -o '"@type":"[^"]*"' | sort -u
echo "--- 新闻列表 API（有文章时后续可验证详情 NewsArticle）---"
curl -s https://fnec.net/api/news

# ④ sitemap / robots
curl -s https://fnec.net/sitemap.xml | grep -o "<loc>[^<]*</loc>" | head -20
curl -s https://fnec.net/robots.txt
```

预期:
- ① 全部 **HTTP 200**
- ② 三条均返回 `cache-control: public, s-maxage=60, stale-while-revalidate=300`
- ③ 首页含 `Organization`、`WebSite`；产品详情含 `Product`；`/api/news` 返回 `{"articles":[...]}` 或空数组
- ④ sitemap 含首页/`/news`/产品详情 URL；robots.txt 含 `Disallow: /admin/`、`Disallow: /api/`、`Sitemap: https://fnec.net/sitemap.xml`

> 若 ③ 中 `/api/news` 返回空数组（线上暂无已发布文章），则新闻详情 NewsArticle 属人工项，转清单第 1 项，由人工发布文章后验证。

## 建议人工审查项（cron 环境无法覆盖）

1. 新闻详情页 NewsArticle JSON-LD：发布一篇已发布文章后 view-source 确认（第十四批）。
2. 骨架屏：Slow 3G 下 /products、/news、详情页观察琥珀 shimmer（第十五批）。
3. 错误边界：手动触发渲染错误确认 error.tsx 重试可恢复（第十五批）。
4. 产品编辑 Product Image：admin 设置 hero_image + Browse Media 弹层（第十六批）。
5. Media 批量删除：勾选/全选/Delete Selected 实测 D1+R2 同步清理（第十七批）。
6. 可选增强：构建时设 `NEXT_PUBLIC_R2_PUBLIC_URL` 启用媒体库 R2 真实预览。

## 定时任务管理（1102 事故复发预防）

- **结论**: `dev-auto-loop` 定时任务（每 15 分钟一次，带 290s 抖动）在循环期间多轮运行重叠触发，导致并发部署互相覆盖——这是 2026-08-02 全站 1102 事故的直接诱因（异常版本 `0fb4db4f` 覆盖正常版 `fa572c9c`）。
- **建议**: 开发循环已收尾，**停用该定时任务**（Claude 桌面侧边栏 → Scheduled → `dev-auto-loop` → 停用，或由 Claude Code 直接 `update_scheduled_task enabled=false`）。停用后不再有并发部署风险，也不会干扰未来的人工部署。
- 如需恢复自动开发，可在功能队列新增项目后重新启用。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 确认无未推送 | ✅ | 初始有 2 条未推送（Batch20 指令 ad80988 + 9ec9687），已 git push e758bdc..3c17581 同步 origin；推送后 `git log origin/master..HEAD` 为空，本地未推 0 条 |
| 2 线上状态确认 | ✅ | 8 条公开/admin 路由（/、/products、/news、/contact、/quote、/admin/login、/sitemap.xml、/robots.txt）全部 HTTP 200；`/api/products` 返回 `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`（batch 19 perf 硬化生效）；部署列表确认当前线上 Version = **4788d816-eaf9-4da3-b710-380d418eddbd**（batch 19，100% 流量）；本批未构建未部署 |
