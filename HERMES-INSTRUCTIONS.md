# Hermes 操作指令（Claude Code 下发）

> 批次: 第三十六批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 部署鲜艳橙色 logo（替换淡琥珀），推代码 + `build:cf:static` + 部署 + 验证。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- 用户反馈: 琥珀色太淡（主色 `(212,194,166)` 淡米黄），要求更鲜艳。
- 改动（提交 `da9f589`）: `logo-orange.png` 用 HSL 色相替换蓝色→**鲜艳橙**（色相 0.07，饱和度 0.85），主色 `(243,163,105)` 明显更浓更醒目；保留裁剪（686×790）和 h-12(48px) 尺寸。
- **重要**: 公开页静态化保持，**必须用 `npm run build:cf:static`**。

## 任务 1：推代码（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

预期: 推送 `da9f589` 及前面待推送提交；`git log origin/master..HEAD --oneline` 为空。

## 任务 2：清缓存构建 + 复制 HTML + 部署（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf:static
npm run deploy
```

预期: `build:cf:static` 成功（logo-orange.png 进 assets）；部署成功。

## 任务 3：验证（终端）

```bash
for u in "/" "/about" "/products" "/news" "/admin/login" "/assets/logo-orange.png" "/api/products"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
# Header HTML 应引用 /assets/logo-orange.png
curl -s "https://fnec.net/" | grep -c "/assets/logo-orange.png"
```

预期: 全路由 200；`/assets/logo-orange.png` 200 image/png；首页 HTML 引用 orange logo。

## 任务 4：浏览器验证（浏览器）

- 访问 `https://fnec.net`，确认顶部左侧 logo 现在是**鲜艳橙色**，约 48px 高，在深黑 Header 上**鲜明醒目**（对比度高）。
- 检查: 橙色是否足够鲜艳（不再偏淡）、渐变立体感是否保留、尺寸是否合适、与导航无重叠。
- 若橙色仍偏淡或太刺眼，记录描述供进一步微调。

> 本批有前端改动；**不要**运行 db:deploy。公开页静态化保持 `build:cf:static`。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建+部署 | 待执行 | |
| 3 验证 | 待执行 | |
| 4 浏览器验证 | 待执行 | 描述橙色 logo 效果/对比度/尺寸 |
