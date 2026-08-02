# Hermes 操作指令（Claude Code 下发）

> 更新: 2026-08-02（第四批）· 来源: Claude Code
> 说明: 请在项目目录 `C:\Users\xxq\axissaunas-clone` 执行，完成后写回报。

---

## 任务 1：推代码（终端）

本地有 1 个未推送提交：`f054d07`（体验优化：登录页视觉 + 联系跳转 + 面包屑）。

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
for u in "/" "/admin/login" "/products" "/contact" "/thank-you" "/api/content"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done

# 登录页含品牌 logo 块（ShieldCheck 图标类）
curl -s "https://fnec.net/admin/login" | grep -o "shield-check\|ShieldCheck\|Funing" | head -2

# 产品详情页含面包屑
curl -s "https://fnec.net/products/sauna-controllers" | grep -o 'aria-label="Breadcrumb"' | head -1
```

预期：
- 全部路由 200（含 /thank-you）
- 登录页含 "Funing" 品牌标记
- 产品详情页含 `aria-label="Breadcrumb"`

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建部署 | 待执行 | |
| 3 验证 | 待执行 | |
