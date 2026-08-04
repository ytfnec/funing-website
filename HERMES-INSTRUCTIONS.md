# Hermes 操作指令（Claude Code 下发）

> 批次: 第三十九批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 部署新 favicon（深蓝图案、无 FNEC 文字），推代码 + `build:cf:static` + 部署 + 验证。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- 用户反馈: 浏览器标签页 favicon 应裁掉 "FNEC" 文字，只保留上方图案，用初始深蓝色。
- 改动（提交 `8969419`）:
  - `logo-pattern-blue.png`: 从原始深蓝透明 logo 裁剪图案区（y110-728），内容 bbox 635×597，深蓝主色 `(19,66,134)`，**无 FNEC 文字**。
  - favicon（64×64 + 32×32）从图案重新生成（中心方形 LANCZOS）。
  - layout: favicon 链接加 `?v=2` 强制刷新浏览器缓存。
- **重要**: 公开页静态化保持，**必须用 `npm run build:cf:static`**。Header/Footer 仍用纯琥珀 logo（不变）。

## 任务 1：推代码（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

预期: 推送 `8969419` 及前面待推送提交；`git log origin/master..HEAD --oneline` 为空。

## 任务 2：清缓存构建 + 复制 HTML + 部署（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf:static
npm run deploy
```

预期: `build:cf:static` 成功（新 favicon 进 assets）；部署成功。

## 任务 3：验证（终端）

```bash
for u in "/" "/about" "/assets/logo-favicon.png" "/assets/logo-favicon-32.png" "/assets/logo-pattern-blue.png" "/api/products"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
# favicon 引用含 v=2
curl -s "https://fnec.net/" | grep -c "logo-favicon.png?v=2"
```

预期: 全路由 200；favicon PNG 200；首页 HTML 含 `logo-favicon.png?v=2`。

## 任务 4：浏览器验证（浏览器）

- 访问 `https://fnec.net`，检查浏览器标签页图标（favicon）:
  - 应为**深蓝色图案**（无 "FNEC" 文字），即 logo 上方图案。
  - 用 `?v=2` 确保不是旧缓存的 favicon（可能需要强制刷新 Ctrl+Shift+R 一次）。
- Header/Footer 应保持纯琥珀 logo 不变（确认未受影响）。

> 本批有前端改动；**不要**运行 db:deploy。公开页静态化保持 `build:cf:static`。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | ✅ | `8969419`（深蓝图案 favicon 重生成 + ?v=2）+ `42d3f89`（指令）已推送，origin 同步 |
| 2 构建+部署 | ✅ | 清缓存 → build:cf:static 成功 → deploy 成功，v`b97863cd`（等传播后验证一次通过） |
| 3 验证 | ✅ | 6 路由全 200（含 logo-pattern-blue.png）；首页 HTML 引用 `logo-favicon.png?v=2` ×2 |
| 4 浏览器验证 | ✅ | **favicon 已更新为深蓝图案**：链接 `logo-favicon.png?v=2` + `logo-favicon-32.png?v=2`（?v=2 强制刷新生效）；像素采样主色 **(16,64,128)** ≈ 目标 (19,66,134) **深蓝**，图案区含原青色渐变细节，**无 FNEC 文字**（裁切 y110-728 生效）；**Header 42×48 / Footer 38×44 纯琥珀 logo 未受影响** |
