# Hermes 操作指令（Claude Code 下发）

> 批次: 第十三批 · 更新: 2026-08-02 · 来源: Claude Code
> 说明: 请在项目目录 `C:\Users\xxq\axissaunas-clone` 执行，完成后写回报。

---

## 任务 1：推代码（终端）

本地有 2 个未推送开发提交：
- `529a752`（新闻 /news 功能：D1 `news_article` 表 + 公开列表/详情页 + admin 管理 + sitemap + i18n）
- `229dd9b`（HANDOFF-LOG 批次记录更新）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

## 任务 2：远程 D1 应用新表结构（重要！必须先于构建部署）

本批新增 `news_article` 表（schema.sql 已更新，使用 `CREATE TABLE IF NOT EXISTS`，幂等可重复执行）。未执行本步前，线上新闻接口会因缺表返回空/异常。

```bash
cd C:\Users\xxq\axissaunas-clone
npm run db:deploy
```

预期输出: 包含 `Executing on 1 table(s) (funing-db)` 与 `CREATE TABLE IF NOT EXISTS news_article` 相关语句成功，无报错。可用 `npx wrangler d1 execute funing-db --remote --command "SELECT name FROM sqlite_master WHERE type='table' AND name='news_article'"` 确认表已存在。

## 任务 3：清缓存 + 构建 + 部署

> ⚠️ 必须清缓存（`.next`/`.open-next`），构建前确认无残留 node 进程（`tasklist | grep node`）。可用新加的 `npm run clean`。

```bash
cd C:\Users\xxq\axissaunas-clone
npm run clean
npm run build:cf
npm run deploy
```

## 任务 4：验证

```bash
for u in "/" "/news" "/admin/login" "/admin/news" "/products" "/contact" "/quote" "/api/content" "/sitemap.xml" "/robots.txt"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
```

预期: 全部 200（`/news`、`/admin/news` 为本批新路由，均应为 200）。

**新闻 API 专项验证**（本批核心）:

```bash
# ① 公开列表（未登录）→ 应 200 且返回 { articles: [...] }
curl -s -w "\n-> HTTP %{http_code}\n" https://fnec.net/api/news

# ② 未发布/不存在的 slug → 应 404
curl -s -o /dev/null -w "missing-article -> HTTP %{http_code}\n" https://fnec.net/api/news/definitely-not-exists

# ③ admin 未登录 → 应 401
curl -s -o /dev/null -w "admin-news-noauth -> HTTP %{http_code}\n" https://fnec.net/api/admin/news
```

预期: ① HTTP 200，body 为 `{"articles":[]}` 或含已发布文章；② HTTP 404；③ HTTP 401。

**浏览器专项**（需要登录态，重点）:

1. 登录 `https://fnec.net/admin/login`，左侧边栏出现 **News** 入口。
2. Dashboard 出现 News Articles 统计卡；点「Manage News」进入 `/admin/news`。
3. 新建文章: 标题自动生成 slug；填 excerpt/content/作者，勾选 Published，保存后列表出现该文章。
4. 公开页 `https://fnec.net/news` 应显示该已发布文章（含日期/作者），点入详情 `https://fnec.net/news/{slug}` 内容正常。
5. 在 admin 把该文章切为 Draft，公开列表应不再显示；切回 Published 恢复。
6. 控制台 0 报错；sitemap `https://fnec.net/sitemap.xml` 应包含该文章 URL。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 db:deploy | 待执行 | |
| 3 构建部署 | 待执行 | |
| 4 验证 | 待执行 | |
