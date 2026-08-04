# Hermes 操作指令（Claude Code 下发）

> 批次: 第三十八批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: logo 全站应用（Footer + favicon），推代码 + `build:cf:static` + 部署 + 验证。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- 用户要求"需要 logo 的地方全部修改"。
- 提交 `084a8fd`: 
  - Footer: 文字 logo → 图片 `/assets/logo-amber-solid.png`（h-11）。
  - favicon: 内联 SVG F 字母 → 品牌 logo PNG（`/assets/logo-favicon.png` 64×64 + `logo-favicon-32.png` 32×32）。
  - Header 文字仅保留为 onError 回退。
- Header 的纯琥珀 logo（batch 37）已确认与按钮完全同色、无渐变。
- **重要**: 公开页静态化保持，**必须用 `npm run build:cf:static`**。

## 任务 1：推代码（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

预期: 推送 `084a8fd` 及前面待推送提交；`git log origin/master..HEAD --oneline` 为空。

## 任务 2：清缓存构建 + 复制 HTML + 部署（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf:static
npm run deploy
```

预期: `build:cf:static` 成功（logo-favicon 等进 assets）；部署成功。

## 任务 3：验证（终端）

```bash
for u in "/" "/about" "/products" "/news" "/admin/login" "/assets/logo-amber-solid.png" "/assets/logo-favicon.png" "/assets/logo-favicon-32.png" "/api/products"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
# favicon 引用
curl -s "https://fnec.net/" | grep -c "logo-favicon"
# Footer 引用 logo
curl -s "https://fnec.net/" | grep -c "logo-amber-solid"
```

预期: 全路由 200；favicon PNG 200 image/png；首页 HTML 含 favicon 引用 + Footer logo 引用。

## 任务 4：浏览器验证（浏览器）

- 访问 `https://fnec.net`:
  - 顶部 Header 左侧: 纯琥珀 logo（与按钮同色）。
  - 页脚（Footer）品牌区: 应为图片 logo（不再是文字 "Funing Electronics"）。
  - 浏览器标签页图标（favicon）: 应为企业 logo 图案（不再是琥珀 F 字母）。
- 若任一位置未生效或有显示问题，记录描述。

> 本批有前端改动；**不要**运行 db:deploy。公开页静态化保持 `build:cf:static`。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | ✅ | `084a8fd`（Footer 图片 logo + favicon PNG）+ `3ca57e4`（指令）已推送，origin 同步 |
| 2 构建+部署 | ✅ | 清缓存 → build:cf:static 成功 → deploy 成功，v`a4ec2dad`（等传播后验证一次通过） |
| 3 验证 | ✅ | 9 路由全 200（含 /assets/logo-favicon.png + logo-favicon-32.png）；首页 HTML：favicon 引用 ×2、Footer logo 引用 ×1 |
| 4 浏览器验证 | ✅ | **三处 logo 全部生效**：① Header：`logo-amber-solid.png` 42×48 纯琥珀；② Footer：**图片 logo 38×44（h-11）替代原文字**，像素采样 **100% 琥珀色**，无文字残留；③ favicon：`logo-favicon.png`(64) + `logo-favicon-32.png`(32) 双引用，企业 logo 图案替换原 F 字母 |
