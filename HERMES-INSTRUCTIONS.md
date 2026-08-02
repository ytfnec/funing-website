# Hermes 操作指令（Claude Code 下发）

> 更新: 2026-08-02（第六批）· 来源: Claude Code
> 说明: 请在项目目录 `C:\Users\xxq\axissaunas-clone` 执行，完成后写回报。

---

## 任务 1：推代码（终端）

本地有 1 个未推送提交：`3711a48`（产品列表类别筛选）。

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
for u in "/" "/products" "/contact" "/quote" "/thank-you" "/api/content"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done

# 产品列表页应含筛选按钮（英文 "ALL" / "SAUNA CONTROL" 等）
curl -s "https://fnec.net/products" | grep -o "SAUNA CONTROL\|Sauna Control\|filter" | head -1
```

预期：全部 200；产品页含筛选标签。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建部署 | 待执行 | |
| 3 验证 | 待执行 | |
