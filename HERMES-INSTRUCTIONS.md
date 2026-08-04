# Hermes 操作指令（Claude Code 下发）

> 批次: 第四十二批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 部署产品详情页语言修复，推代码 + `build:cf:static` + 部署 + 验证。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- 根因: 产品详情页 fetch `/api/products/[slug]` 返回 D1 英文模板数据，覆盖 i18n 中文 fallback → 中文界面下产品卡片点进详情页变英文。
- 修复（提交 `05e3cda`）: merge 时**跳过文案字段**（name/sub_title/short_description/price_range），保留 i18n 本地化；D1 仅补充结构化字段（hero_image 等）。无 fallback 的自定义产品保留 API 文案。
- **重要**: 公开页静态化保持，**必须用 `npm run build:cf:static`**。

## 任务 1：推代码（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

预期: 推送 `05e3cda` 及前面待推送提交；`git log origin/master..HEAD --oneline` 为空。

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
for u in "/" "/products" "/products/sauna-controllers" "/products/jacquard-drivers" "/admin/login" "/api/products" "/api/products/sauna-controllers"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
```

预期: 全路由 200。

## 任务 4：浏览器验证语言修复（浏览器，关键）

- 场景: 浏览器语言设为**中文**（或 localStorage 设为 zh），清空 fnec-lang 模拟中文用户。
- 访问 `https://fnec.net/products`（产品中心，中文界面）→ 点击某个产品卡片的按钮 → 进入产品详情页。
- **确认**: 产品详情页的产品名/副标题/描述应为**中文**（不再是英文）。
- 对照: 切到 EN 再进详情页 → 应为英文。
- 记录: 详情页产品名（中/英）、hero_image 是否正常显示（D1 结构化字段仍生效）、JSON-LD 是否正常。

> 本批有前端改动；**不要**运行 db:deploy。公开页静态化保持 `build:cf:static`。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建+部署 | 待执行 | |
| 3 验证 | 待执行 | |
| 4 浏览器验证 | 待执行 | 中文详情页是否保持中文、英文切英文、图片正常 |
