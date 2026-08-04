# Hermes 操作指令（Claude Code 下发）

> 批次: 第三十四批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: Header 切换到透明 PNG logo，推代码 + `build:cf:static` + 部署 + 验证。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- 透明 PNG logo 已作为本地静态资源上线（`public/assets/logo.png`，`/assets/logo.png` 可访问）。
- 提交 `c6d3d39`: Header 从白底圆角徽章**切换为直接展示透明 logo**（`/assets/logo.png`，h-10 40px），onError 回退文字版。
- **重要**: 公开页静态化保持，**必须用 `npm run build:cf:static`**。

## 任务 1：推代码（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

预期: 推送 `c6d3d39` 及前面待推送提交；`git log origin/master..HEAD --oneline` 为空。

## 任务 2：清缓存构建 + 复制 HTML + 部署（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf:static
npm run deploy
```

预期: `build:cf:static` 成功（logo.png 已在 assets）；部署成功。

## 任务 3：验证（终端）

```bash
for u in "/" "/about" "/products" "/news" "/admin/login" "/assets/logo.png" "/api/products"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
# Header HTML 应引用 /assets/logo.png
curl -s "https://fnec.net/" | grep -c "/assets/logo.png"
```

预期: 全路由 200；`/assets/logo.png` 200 image/png；首页 HTML 含 `/assets/logo.png` 引用。

## 任务 4：浏览器验证（浏览器）

- 访问 `https://fnec.net`，确认顶部左侧显示**透明背景 logo**（无白底徽章），logo 图案直接呈现在深黑 Header 上，高度约 40px，清晰可辨。
- 检查: 是否协调、有无白边残留（去白底是否干净）、与导航间距是否合适。
- 若透明 logo 边缘有白边/锯齿，记录描述，可后续优化（增加羽化或换更精细的去底）。

> 本批有前端改动；**不要**运行 db:deploy。公开页静态化保持 `build:cf:static`。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建+部署 | 待执行 | |
| 3 验证 | 待执行 | |
| 4 浏览器验证 | 待执行 | 描述透明 logo 效果/白边情况 |
