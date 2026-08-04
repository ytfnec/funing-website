# Hermes 操作指令（Claude Code 下发）

> 批次: 第三十二批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 优化 logo 展示（白色圆角徽章样式），推代码 + `build:cf:static` + 部署 + 验证。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- 批次 31 反馈: logo 为 1024×1024 白底方形图，直接显示在深黑 Header 上是 36×36 突兀白块，内容看不清。
- 改动（提交 `89925c9`）: 把 logo 包在**白色圆角徽章容器**里（`bg-white rounded-lg p-1.5 h-10 w-10` + 阴影），白底变成有意的设计元素，内容放大到约 40px。
- **重要**: 公开页静态化保持，**必须用 `npm run build:cf:static`**。

## 任务 1：推代码（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

预期: 推送 `89925c9` 及前面待推送提交；`git log origin/master..HEAD --oneline` 为空。

## 任务 2：清缓存构建 + 复制 HTML + 部署（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf:static
npm run deploy
```

预期: `build:cf:static` 成功；部署成功。

## 任务 3：验证（终端）

```bash
for u in "/" "/about" "/products" "/news" "/admin/login" "/api/products"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
# Header HTML 应含徽章样式 + logo 引用
curl -s "https://fnec.net/" | grep -c "1782382842444-wxg76b.jpg"
```

预期: 全路由 200；首页 HTML 含 logo 引用（计数 1）。

## 任务 4：浏览器验证 logo 徽章样式（浏览器）

- 访问 `https://fnec.net`，确认顶部左侧 logo 现在是一个**白色圆角徽章**（约 40×40，圆角，带阴影），内含 logo 图案，在深黑 Header 上协调不突兀。
- 检查: 徽章是否有圆角（rounded）、白底内边距、logo 内容是否清晰可辨。
- 若仍有问题（如徽章太小/太大、圆角不明显、与导航间距不当），记录描述供后续调整。

> 本批有前端改动；**不要**运行 db:deploy。公开页静态化保持 `build:cf:static`。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建+部署 | 待执行 | |
| 3 验证 | 待执行 | |
| 4 浏览器验证 | 待执行 | 描述徽章样式效果 |
