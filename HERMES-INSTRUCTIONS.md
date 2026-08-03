# Hermes 操作指令（Claude Code 下发）

> 批次: 第二十八批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 询盘删除改为自定义确认弹窗，推代码 + `build:cf:static` + 部署 + 验证。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- Hermes 批次 27 反馈: contacts 删除用原生 `confirm()`，真人使用正常但自动化/无头浏览器会卡死。
- 提交 `948c507`: 新增 `src/components/ConfirmDialog.tsx`（深黑+琥珀风格自定义确认弹窗），替换 contacts 单条+批量删除的原生 confirm。
- **重要**: 公开页静态化保持，**必须用 `npm run build:cf:static`**。

## 任务 1：推代码（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

预期: 推送 `948c507` 及前面待推送的提交；`git log origin/master..HEAD --oneline` 为空。

## 任务 2：清缓存构建 + 复制 HTML + 部署（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf:static
npm run deploy
```

预期: `build:cf:static` 出现 "Copied 24 prerendered HTML files" + "Wrote .open-next/assets/_headers"；部署成功。

## 任务 3：验证（终端）

```bash
for u in "/" "/about" "/products" "/news" "/admin/login" "/api/admin/contacts" "/api/admin/contacts/batch" "/api/products"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
```

预期: 公开页全 200（静态化保持）；admin API 未登录 401。

## 任务 4：浏览器确认（可选，不阻塞）

- 登录后台 → Contacts → 勾选 1 条 → 点「删除所选」→ 应弹出**自定义深色确认框**（非浏览器原生弹窗）→ 取消/确认均可正常操作，页面不卡死。
- 展开单条 → 点「Delete」→ 同样弹出自定义确认框。

> 本批有前端改动；**不要**运行 db:deploy。公开页静态化保持 `build:cf:static`。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建+部署 | 待执行 | |
| 3 验证 | 待执行 | |
| 4 浏览器确认 | 待执行（可选） | |
