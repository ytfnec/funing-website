# Hermes 操作指令（Claude Code 下发）

> 批次: 第三十七批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 部署纯琥珀色无渐变 logo（与按钮同色），推代码 + `build:cf:static` + 部署 + 验证。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- 用户反馈: 橙色渐变不合适，要求 logo 像其他按键颜色一样（琥珀 #d8a35a）、不要渐变。
- 改动（提交 `c3aae34`）: `logo-amber-solid.png` 所有不透明像素统一设为 `#d8a35a`（= `var(--color-amber)` = `.btn-primary` 按钮色），**无渐变**，保留 alpha 形状。裁剪 686×790，h-12 48px。
- **重要**: 公开页静态化保持，**必须用 `npm run build:cf:static`**。

## 任务 1：推代码（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

预期: 推送 `c3aae34` 及前面待推送提交；`git log origin/master..HEAD --oneline` 为空。

## 任务 2：清缓存构建 + 复制 HTML + 部署（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf:static
npm run deploy
```

预期: `build:cf:static` 成功（logo-amber-solid.png 进 assets）；部署成功。

## 任务 3：验证（终端）

```bash
for u in "/" "/about" "/products" "/news" "/admin/login" "/assets/logo-amber-solid.png" "/api/products"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
# Header HTML 应引用 /assets/logo-amber-solid.png
curl -s "https://fnec.net/" | grep -c "/assets/logo-amber-solid.png"
```

预期: 全路由 200；`/assets/logo-amber-solid.png` 200 image/png；首页 HTML 引用纯色 logo。

## 任务 4：浏览器验证（浏览器）

- 访问 `https://fnec.net`，确认顶部左侧 logo 是**纯琥珀色 #d8a35a**（与网站按钮同色），**无渐变**，约 48px 高，在深黑 Header 上协调清晰。
- 检查: 颜色是否与按钮一致、无渐变、尺寸合适、与导航无重叠。

> 本批有前端改动；**不要**运行 db:deploy。公开页静态化保持 `build:cf:static`。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建+部署 | 待执行 | |
| 3 验证 | 待执行 | |
| 4 浏览器验证 | 待执行 | 描述纯色 logo 效果/与按钮同色/无渐变 |
