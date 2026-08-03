# Hermes 操作指令（Claude Code 下发）

> 批次: 第二十七批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 询盘批量删除功能，推代码 + `build:cf:static` + 部署 + 验证。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- 用户反馈经常收到乱填的垃圾询盘，需要删除功能（含批量删除）。
- 提交 `b9aca4e`（4 文件）: 新增批量删除 API + 单条删除 API + 后台 Contacts 多选/批量删除 UI + i18n keys。
- **重要**: 公开页已启用静态化直出，**必须用 `npm run build:cf:static`**（含复制 HTML 步骤），否则公开页退回 Worker SSR。

## 任务 1：推代码（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

预期: 推送 `b9aca4e` 及前面待推送的提交（含 HANDOFF-LOG `14ea364` 等）；`git log origin/master..HEAD --oneline` 为空。

## 任务 2：清缓存构建 + 复制 HTML + 部署（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf:static
npm run deploy
```

预期: `build:cf:static` 出现 "Copied 24 prerendered HTML files" + "Wrote .open-next/assets/_headers"；部署成功，线上版本更新。

## 任务 3：验证（终端）

```bash
# 公开页回归（确认静态化未破坏）
for u in "/" "/about" "/products" "/news" "/admin/login" "/api/admin/contacts" "/api/products"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
# 批量删除 API 鉴权验证（未登录应 401）
curl -s -o /dev/null -w "batch unauthorized -> HTTP %{http_code}\n" -X POST "https://fnec.net/api/admin/contacts/batch" -H "Content-Type: application/json" -d '{"ids":["test"]}'
```

预期:
- 公开页全 200（静态化保持）。
- `/api/admin/contacts` 未登录返回 **401**。
- `/api/admin/contacts/batch` 未登录返回 **401**（无 session 不可调用）。

## 任务 4：浏览器人工确认（可选，不阻塞）

- 登录后台 → Contacts：勾选多条询盘 → Delete Selected；展开单条询盘底部 Delete 按钮；确认删除后列表消失。
- 注意：此操作**硬删除**数据，验证时勿删真实询盘（可先用测试数据或仅验证 UI 显示）。

> 本批有前端 + API 改动；**不要**运行 db:deploy（无 schema 变更）。公开页静态化保持 `build:cf:static`。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建+部署 | 待执行 | |
| 3 验证 | 待执行 | |
| 4 浏览器确认 | 待执行（可选） | |
