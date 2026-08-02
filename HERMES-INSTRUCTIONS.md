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

## 建议人工审查项（cron 环境无法覆盖）

1. 新闻详情页 NewsArticle JSON-LD：发布一篇已发布文章后 view-source 确认（第十四批）。
2. 骨架屏：Slow 3G 下 /products、/news、详情页观察琥珀 shimmer（第十五批）。
3. 错误边界：手动触发渲染错误确认 error.tsx 重试可恢复（第十五批）。
4. 产品编辑 Product Image：admin 设置 hero_image + Browse Media 弹层（第十六批）。
5. Media 批量删除：勾选/全选/Delete Selected 实测 D1+R2 同步清理（第十七批）。
6. 可选增强：构建时设 `NEXT_PUBLIC_R2_PUBLIC_URL` 启用媒体库 R2 真实预览。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 确认无未推送 | 待执行 | |
| 2 线上状态确认 | 待执行 | |
