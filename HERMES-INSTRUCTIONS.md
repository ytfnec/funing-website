# Hermes 操作指令（Claude Code 下发）

> 更新: 2026-08-02（第七批）· 来源: Claude Code
> 说明: 请在项目目录 `C:\Users\xxq\axissaunas-clone` 执行，完成后写回报。

---

## 任务 1：推代码（终端）

本地有 1 个未推送提交：`d879aec`（admin 联系表单 notes 编辑）。

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

## 任务 2：清缓存 + 构建 + 部署

> ⚠️ 必须清缓存（`rm -rf .next .open-next`），构建前确认无残留 node 进程。

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf
npm run deploy
```

## 任务 3：验证

```bash
for u in "/" "/admin/login" "/products" "/contact" "/quote" "/api/content"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
```

预期：全部 200。此改动主要在后台（admin contacts 展开后有 Internal Notes 编辑区），浏览器验证更直观：
- 登录 https://fnec.net/admin → Contacts → 展开任一联系 → 应看到 Internal Notes 区（可点击添加/编辑）

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建部署 | 待执行 | |
| 3 验证 | 待执行 | |
