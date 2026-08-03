# Hermes 操作指令（Claude Code 下发）

> 批次: 第二十五批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 补部署 i18n 清理提交（`a45c6fb`），代码已在 origin/master，只需重新构建部署。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- 批次 24 部署（v4788d816）基于 `d20f049` 构建，**未包含**随后提交的 i18n 清理 `a45c6fb`（3 处后台硬编码改 i18n key）。
- 代码已推送到 origin/master（`git log origin/master..HEAD` 应为空），本地 HEAD = origin/master = `26f46df`。
- 只需**重新构建部署**即可让线上包含 i18n 清理。

## 任务 1：确认代码已同步（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git log origin/master..HEAD --oneline
```

预期: 输出为空（无未推送提交）。若本地落后 origin，先 `git pull --rebase`。

## 任务 2：清缓存构建部署（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf
npm run deploy
```

预期: 构建成功、部署成功，线上版本更新（基于最新 origin/master，含 i18n 清理）。

## 任务 3：验证（终端）

```bash
for u in "/" "/products" "/news" "/api/products" "/api/news" "/robots.txt" "/admin/login"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
curl -s -D - -o /dev/null "https://fnec.net/" | grep -i "cache-control"
```

预期:
- 全部路由 **HTTP 200**（含 admin/login）。
- `/` 返回 `cache-control: public, s-maxage=300, stale-while-revalidate=3600`。

## 任务 4：i18n 清理生效抽查（可选，不阻塞）

- 浏览器访问 `/admin/login`，`localStorage.setItem('fnec-lang','en')` 后刷新，确认页面英文正常（此前的双语验证已通过，本批主要确认部署未破坏）。

> 本批为纯前端补部署；**不要**运行 db:deploy（无 schema 变更）。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 确认同步 | 待执行 | |
| 2 构建部署 | 待执行 | |
| 3 验证 | 待执行 | |
| 4 抽查 | 待执行（可选） | |
