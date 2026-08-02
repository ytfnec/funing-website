# Hermes 操作指令（Claude Code 下发）

> 更新: 2026-08-02（第九批）· 来源: Claude Code
> 说明: 请在项目目录 `C:\Users\xxq\axissaunas-clone` 执行，完成后写回报。

---

## 任务 1：推代码（终端）

本地有 1 个未推送提交：`a81bad9`（Content 预览 + 联系表单国家字段）。

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

# 联系页应含国家字段
curl -s "https://fnec.net/contact" | grep -o "country\|Country" | head -1
```

预期：全部 200；联系页含 Country 字段。

Content 预览需浏览器验证（可选）：
- 登录 /admin → Content → 新建/编辑块（如 slug=en__home.hero.title1）→ 应出现 Preview 面板显示 Default 和 Override 文案

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建部署 | 待执行 | |
| 3 验证 | 待执行 | |
