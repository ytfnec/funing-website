# Hermes 操作指令（Claude Code 下发）

> 更新: 2026-08-02（第五批）· 来源: Claude Code
> 说明: 请在项目目录 `C:\Users\xxq\axissaunas-clone` 执行，完成后写回报。

---

## 任务 1：推代码（终端）

本地有 1 个未推送提交：`580d40d`（浏览统计 + media alt 编辑 + quote 跳转统一）。

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
for u in "/" "/admin/login" "/products" "/contact" "/quote" "/thank-you" "/api/content" "/api/views"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
```

预期：全部 200（含新 /api/views）。

## 任务 4（测试，可选）：验证浏览统计

```bash
# 触发一个浏览上报（会真实写入 D1 page_views）
curl -s -X POST "https://fnec.net/api/views" -H "Content-Type: application/json" -d '{"path":"/verify-test"}'
# 预期: {"ok":true}

# 确认写入（可选）
npx wrangler d1 execute funing-db --remote --command "SELECT COUNT(*) as n FROM page_views WHERE path='/verify-test';"

# 清理测试记录
npx wrangler d1 execute funing-db --remote --command "DELETE FROM page_views WHERE path='/verify-test';"
```

## 任务 5（验证，可选）：admin stats API

```bash
# 需要登录态，浏览器验证更方便：
# 访问 https://fnec.net/admin → Dashboard 应显示 Page Views 卡片（总数 + 24h）
```

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建部署 | 待执行 | |
| 3 验证 | 待执行 | |
| 4 统计测试 | 待执行 | |
