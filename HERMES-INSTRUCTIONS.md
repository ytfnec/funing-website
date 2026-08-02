# Hermes 操作指令（Claude Code 下发）

> 更新: 2026-08-02（第二批）· 来源: Claude Code
> 说明: 请在项目目录 `C:\Users\xxq\axissaunas-clone` 执行，完成后写回报。

---

## 任务 1：推代码（终端）

本地有 2 个未推送提交：`d182d8f`（交接日志状态）、`bfe8482`（SEO 优化）。

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

## 任务 2：清缓存 + 构建 + 部署

> ⚠️ 必须清缓存（`rm -rf .next .open-next`），否则复用旧产物。
> 构建前确认无残留 `next dev`/`wrangler dev`/`wrangler tail` 进程。

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf
npm run deploy
```

## 任务 3：验证 SEO 功能上线

```bash
# 基础路由 200
for u in "/" "/admin/login" "/products" "/contact" "/api/content" "/sitemap.xml" "/robots.txt"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done

# sitemap.xml 应包含产品详情页
curl -s "https://fnec.net/sitemap.xml" | head -c 600
echo ""

# robots.txt
curl -s "https://fnec.net/robots.txt"

# opengraph 图
curl -s -o /dev/null -w "opengraph.png -> HTTP %{http_code}\n" "https://fnec.net/opengraph.png"

# 产品详情页应含 Product JSON-LD
curl -s "https://fnec.net/products/sauna-controllers" | grep -o "application/ld+json" | head -1
```

预期：
- 全部路由 200（含 sitemap.xml、robots.txt、opengraph.png）
- sitemap.xml 含 `/products/sauna-controllers` 等产品 URL
- robots.txt 含 `Disallow: /admin/` 和 `Sitemap: https://fnec.net/sitemap.xml`
- 产品详情页 HTML 含 `application/ld+json`

## 任务 4（无，可选）：其他

无新 Dashboard 操作。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建部署 | 待执行 | |
| 3 验证 | 待执行 | |
