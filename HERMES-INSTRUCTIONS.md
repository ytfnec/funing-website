# Hermes 操作指令（Claude Code 下发）

> 批次: 第十一批 · 更新: 2026-08-02 · 来源: Claude Code
> 说明: 请在项目目录 `C:\Users\xxq\axissaunas-clone` 执行，完成后写回报。

---

## 任务 1：推代码（终端）

本地有 1 个未推送开发提交：`24dbba9`（性能优化：字体自托管 + favicon 内联 + 图片加载优化）。

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

## 任务 2：清缓存 + 构建 + 部署

> ⚠️ 必须清缓存（`rm -rf .next .open-next`），构建前确认无残留 node 进程（`tasklist | grep node`）。

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf
npm run deploy
```

## 任务 3：验证

```bash
for u in "/" "/admin/login" "/products" "/contact" "/quote" "/api/content" "/sitemap.xml" "/robots.txt"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
```

预期：全部 200。

**性能改动专项验证**（本批核心，抓首页 HTML 检查 3 个点）：

```bash
curl -s https://fnec.net > /tmp/home.html
echo "1. 字体为自托管 woff2（应输出 _next/static/media 路径，且不含 fonts.googleapis.com）:"
grep -o '/_next/static/media/[^"]*\.woff2' /tmp/home.html | head -2
grep -c 'fonts.googleapis.com' /tmp/home.html   # 预期 0
echo "2. favicon 为内联 data URI（应含 data:image/svg+xml;base64）:"
grep -o 'rel="icon" href="data:image/svg+xml;base64[^"]*' /tmp/home.html | head -1
echo "3. hero 图片 priority / CTA 图片 lazy（应各命中 1 次）:"
grep -o 'hero-1920\.webp[^>]*' /tmp/home.html | head -1
grep -o 'loading="lazy"' /tmp/home.html | wc -l
```

预期：① 出现 `/_next/static/media/*.woff2` 且 googleapis 计数为 0；② 出现 `data:image/svg+xml;base64`；③ hero 为 priority 图、lazy 命中 ≥1。浏览器打开 `https://fnec.net` 确认首页 hero 图正常显示、控制台 0 报错、Network 面板无 Google Fonts 外部请求。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | ✅ 已完成 | 40f5468..c1b4d45 推送成功（含 24dbba9 代码 + c1b4d45 指令） |
| 2 构建部署 | ✅ 已完成 | 清缓存 → build:cf → deploy 成功，Version `bbe75b36-adba-4c36-8987-cfce226a49e2` |
| 3 验证 | ✅ 通过 | 8 路由全 200。性能专项：① 字体自托管 ✅ CSS 内 4 个 woff2 全为 `/_next/static/media/*.woff2`，googleapis 计数 0；② favicon 内联 ✅ `data:image/svg+xml;base64`；③ hero `fetchPriority="high"` ✅ + lazy 1 处 ✅。浏览器：hero 图加载成功、Network 外部字体请求 0、自托管 woff2 已加载、控制台 0 错误 |
