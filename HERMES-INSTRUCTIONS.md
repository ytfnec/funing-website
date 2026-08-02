# Hermes 操作指令（Claude Code 下发）

> 批次: 第十二批 · 更新: 2026-08-02 · 来源: Claude Code
> 说明: 请在项目目录 `C:\Users\xxq\axissaunas-clone` 执行，完成后写回报。

---

## 任务 1：推代码（终端）

本地有 1 个未推送开发提交：`10a4154`（admin Content 批量操作）。

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

## 任务 2：清缓存 + 构建 + 部署

> ⚠️ 必须清缓存（`rm -rf .next .open-next`），构建前确认无残留 node 进程（`tasklist | grep node`）。

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf
npm run deploy
```

## 任务 3：验证

```bash
for u in "/" "/admin/login" "/products" "/contact" "/quote" "/api/content" "/sitemap.xml" "/robots.txt"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
```

预期：全部 200。

**批量 API 专项验证**（本批核心，端点 `/api/admin/content/batch`）：

```bash
# ① 未登录调用 → 应 401（鉴权生效）
curl -s -o /dev/null -w "batch-noauth -> HTTP %{http_code}\n" \
  -X POST https://fnec.net/api/admin/content/batch \
  -H "Content-Type: application/json" \
  -d '{"action":"delete","ids":["id-x"]}'

# ② 非法 action → 应 400（即便无登录，校验在鉴权之后，可先确认未登录 401 即可）
curl -s -X POST https://fnec.net/api/admin/content/batch \
  -H "Content-Type: application/json" \
  -d '{"action":"nope","ids":["id-x"]}'
```

预期：① HTTP 401（未授权）；② 若已带登录态则为 400 或 401 均可，重点是**不返回 500**、不出现 "Failed to run bulk action"。

**浏览器专项**（需要登录态，重点）：

1. 登录 `https://fnec.net/admin/login` 进入 Content 编辑器。
2. 每行左侧出现复选框；勾选若干行，顶部工具栏出现「Select all / N selected」与 Activate / Pause / Delete 按钮。
3. 点 Pause 使某块停用（页面文案回退默认），再点 Activate 恢复；点 Delete 有确认弹窗，删除后该块回退默认文案。
4. 切换搜索或页面过滤后，选区应自动清空（防止误删隐藏行）。
5. 控制台 0 报错。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | ✅ | 开发提交 10a4154 已在远端（git push 显示 up-to-date，无待推内容） |
| 2 构建部署 | ✅ | 已清缓存（.next/.open-next），无残留 node 进程；webpack 构建成功（Next 16.2.10）；部署 Version ID a2f8d8e6-36b1-4f3c-9991-45c2400540b9 |
| 3 验证 | ✅ | 8 条路由全 200；批量 API：未登录 POST → 401（鉴权生效），非法 action → 401（无 500 / 无 "Failed to run bulk action"）；/admin/content 200；浏览器交互（勾选/工具栏/确认弹窗）需人工登录验证 |
