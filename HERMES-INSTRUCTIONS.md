# Hermes 操作指令（Claude Code 下发）

> 批次: 第二十三批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 后台中英双语化全部完成，推代码 + 清缓存构建部署 + 验证。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- 后台 10 个 admin 页面全部完成中英双语化（复用前台语言设置 `fnec-lang`）。
- 提交 `ca7cfec`（12 文件）：media/content/settings 三页 + 上一会话已完成的 7 页 + i18n.tsx。
- i18n: en/zh 各 **684 keys 完全对齐**；`npx tsc --noEmit` 本地已通过。
- 纯前端改动，无 DB 迁移，无 wrangler 配置改动。

## 任务 1：推代码（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

预期: 推送 `ca7cfec` 及其前面的文档提交；推送后 `git log origin/master..HEAD --oneline` 输出为空。

## 任务 2：清缓存构建部署（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf
npm run deploy
```

预期: 构建成功，部署成功，线上版本更新（非 `a216d0eb`）。

## 任务 3：验证（终端）

```bash
for u in "/" "/products" "/news" "/admin/login" "/api/products"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
curl -s -D - -o /dev/null "https://fnec.net/" | grep -i "cache-control"
```

预期: 全部 **HTTP 200**；`/` 返回 `cache-control: public, s-maxage=60, stale-while-revalidate=300`（边缘缓存保持生效）。

## 任务 4：浏览器人工确认（可选，不阻塞）

- 访问 `https://fnec.net/admin/login`，登录后确认后台各页面标题/按钮随前台语言设置（`fnec-lang`）切换中英文。
- 切换语言：`localStorage.setItem('fnec-lang', 'zh')` 或 `'en'` 后刷新。

> 本批有前端代码改动，需完整构建部署；**不要**运行 db:deploy（无 schema 变更）。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建部署 | 待执行 | |
| 3 验证 | 待执行 | |
| 4 浏览器确认 | 待执行（可选） | |
