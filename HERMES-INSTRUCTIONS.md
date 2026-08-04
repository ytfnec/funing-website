# Hermes 操作指令（Claude Code 下发）

> 批次: 第三十五批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 部署琥珀色放大版 logo，推代码 + `build:cf:static` + 部署 + 验证。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- 用户反馈: 原透明 logo 深蓝色在黑色背景上不明显、尺寸太小，要求改琥珀色/橘红色并放大。
- 改动（提交 `ec65402`）:
  - `public/assets/logo-amber.png`: 蓝色系 → 品牌琥珀色（#d8a35a），HSL 色相替换保留渐变立体感；裁剪内容边界（686×790）去掉多余透明边距。
  - Header: 引用 `/assets/logo-amber.png`，尺寸 h-10(40px) → **h-12(48px)**。
- **重要**: 公开页静态化保持，**必须用 `npm run build:cf:static`**。

## 任务 1：推代码（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

预期: 推送 `ec65402` 及前面待推送提交；`git log origin/master..HEAD --oneline` 为空。

## 任务 2：清缓存构建 + 复制 HTML + 部署（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf:static
npm run deploy
```

预期: `build:cf:static` 成功（logo-amber.png 进 assets）；部署成功。

## 任务 3：验证（终端）

```bash
for u in "/" "/about" "/products" "/news" "/admin/login" "/assets/logo-amber.png" "/assets/logo.png" "/api/products"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
# Header HTML 应引用 /assets/logo-amber.png
curl -s "https://fnec.net/" | grep -c "/assets/logo-amber.png"
```

预期: 全路由 200；`/assets/logo-amber.png` 200 image/png；首页 HTML 引用 amber logo。

## 任务 4：浏览器验证（浏览器）

- 访问 `https://fnec.net`，确认顶部左侧 logo 现在是**琥珀/金色**，尺寸约 48px 高，在深黑 Header 上**清晰醒目**（对比度良好，不再是深蓝）。
- 检查: 琥珀色是否鲜明、渐变是否保留（立体感）、尺寸是否合适（放大后是否协调/是否与导航重叠）。
- 若琥珀色偏淡/偏粉，或尺寸仍需调整，记录描述供进一步微调。

> 本批有前端改动；**不要**运行 db:deploy。公开页静态化保持 `build:cf:static`。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | ✅ | `ec65402`（琥珀色重着色+裁剪 686×790+48px）+ `84da8e4`（指令）已推送，origin 同步 |
| 2 构建+部署 | ✅ | 清缓存 → build:cf:static 成功 → deploy 成功，v`1bc1d3c2` |
| 3 验证 | ✅ | 8 路由全 200（/ /about /products /news /admin/login /assets/logo-amber.png /assets/logo.png /api/products）；首页 HTML 引用 `/assets/logo-amber.png` ×1 |
| 4 浏览器验证 | ✅ | Header 左侧**琥珀色 logo**：`/assets/logo-amber.png` 加载正常（natural 686×790 裁剪版 → 渲染 42×48，h-12 生效）；canvas 像素采样：主体 627px 中 **625px（99.7%）为琥珀色相**（20°-60°），深蓝已完全替换、渐变立体感保留；与导航间距 **120px，无重叠**。深黑 Header 上清晰醒目，对比度良好 |
