# Hermes 操作指令（Claude Code 下发）

> 更新: 2026-08-02（第三批）· 来源: Claude Code
> 说明: 请在项目目录 `C:\Users\xxq\axissaunas-clone` 执行，完成后写回报。

---

## 任务 1：推代码（终端）

本地有 1 个未推送提交：`d8f4fb8`（运营功能：newsletter + 防spam + 登录限流）。

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
# 基础路由 200
for u in "/" "/admin/login" "/products" "/contact" "/api/content" "/sitemap.xml" "/robots.txt"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done

# 页脚 Newsletter 入口存在
curl -s "https://fnec.net" | grep -o "newsletter" | head -1

# 联系表单 honeypot 字段存在
curl -s "https://fnec.net/contact" | grep -o 'name="website"' | head -1
```

预期：
- 全部路由 200
- 首页 HTML 含 "newsletter"
- 联系页含 `name="website"`（honeypot）

## 任务 4（测试，可选）：验证 API

```bash
# Newsletter 订阅 API（会真实写入 D1！测试后请删除）
curl -s -X POST "https://fnec.net/api/newsletter" -H "Content-Type: application/json" -d '{"email":"test-verify@example.com"}'
# 预期: {"success":true}

# 删除测试记录（如成功写入）
npx wrangler d1 execute funing-db --remote --command "DELETE FROM newsletter_subscriptions WHERE email='test-verify@example.com';"
```

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建部署 | 待执行 | |
| 3 验证 | 待执行 | |
| 4 API 测试 | 待执行 | |
