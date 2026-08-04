# Hermes 操作指令（Claude Code 下发）

> 批次: 第三十批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: SEO 结构化数据增强 + 询盘导出 CSV，推代码 + `build:cf:static` + 部署 + 验证。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- 提交 `bcdced9`（5 文件）:
  - 首页 FAQPage JSON-LD（富摘要机会）。
  - 产品详情/新闻详情 BreadcrumbList JSON-LD。
  - 后台 Contacts「导出 CSV」按钮（BOM UTF-8，Excel 打开不乱码）。
- **重要**: 公开页静态化保持，**必须用 `npm run build:cf:static`**。

## 任务 1：推代码（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

预期: 推送 `bcdced9` 及前面待推送的提交；`git log origin/master..HEAD --oneline` 为空。

## 任务 2：清缓存构建 + 复制 HTML + 部署（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf:static
npm run deploy
```

预期: `build:cf:static` 出现 "Copied 24 prerendered HTML files" + "Wrote .open-next/assets/_headers"；部署成功。

## 任务 3：验证（终端）

```bash
for u in "/" "/about" "/products" "/news" "/admin/login" "/api/products" "/api/news"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
# 首页应含 FAQPage JSON-LD
curl -s "https://fnec.net/" | grep -c "FAQPage"
```

预期: 全路由 200；首页 HTML 含 `FAQPage`（静态化后 JSON-LD 内联在 HTML 中）。

## 任务 4：浏览器确认（可选，不阻塞）

- 后台 Contacts → 工具栏「Export CSV」按钮存在 → 点击下载 CSV，Excel 打开中文不乱码。
- 产品详情页 view-source 确认含 `BreadcrumbList`。

> 本批有前端改动；**不要**运行 db:deploy。公开页静态化保持 `build:cf:static`。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | ✅ | 推送 `0d038b2`（含 bcdced9，5 文件）；`git log origin/master..HEAD` 为空 |
| 2 构建+部署 | ✅ | 清缓存 → `build:cf:static` 成功（46/46 页 + "Copied 24 prerendered HTML files" + `Wrote .open-next\assets\_headers`）；部署 v`be4f2e89-c77e-4388-bb11-34da272f3d9b` |
| 3 验证 | ✅ | 7 路由全 200；首页 HTML `FAQPage` JSON-LD 计数 1（静态化内联生效） |
| 4 浏览器确认 | ✅ | ① 造测试询盘 → Contacts 工具栏「导出 CSV」按钮出现（e39）→ 点击触发下载：Blob `text/csv;charset=utf-8;` 206B（代码 `new Blob(['\uFEFF'+csv])` BOM 确认，Excel 不乱码）；测试询盘已删。② 产品详情页 `/products/sauna-controllers` HTML 含 `BreadcrumbList`（计数 1） |
