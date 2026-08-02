# Hermes 操作指令（Claude Code 下发）

> 批次: 第十四批 · 更新: 2026-08-02 · 来源: Claude Code
> 说明: 请在项目目录 `C:\Users\xxq\axissaunas-clone` 执行，完成后写回报。

---

## 背景

本批为功能队列第 5 项 **全量回归验证 + JSON-LD 补缺**。代码审查结论：sitemap/robots 覆盖完整；layout 已有 Organization/WebSite、产品详情已有 Product JSON-LD；**修复了新闻详情页缺 NewsArticle JSON-LD 的问题**（commit `9b79bf3`）。

本批**无 schema 变更**（`news_article` 表已在第十三批部署），只需推代码 + 清缓存构建部署 + 全量回归验证。

## 任务 1：推代码（终端）

本地有 2 个未推送提交（`9b79bf3` JSON-LD 修复已被推送到 origin/master，但尚未部署上线——本批部署将包含它）：
- `3e0309a`（HANDOFF-LOG 批次记录更新）
- `XXXXXXX`（本指令文件，Hermes 推代码前由你 `git rev-parse --short HEAD` 核对实际哈希即可，无需修改本文）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

## 任务 2：清缓存 + 构建 + 部署

> ⚠️ 必须清缓存（`.next`/`.open-next`），构建前确认无残留 node 进程（`tasklist | grep node`）。本批无需 `db:deploy`。

```bash
cd C:\Users\xxq\axissaunas-clone
npm run clean
npm run build:cf
npm run deploy
```

## 任务 3：全量回归验证

### 3.1 公开路由全部 200

```bash
for u in "/" "/about" "/accessories" "/contact" "/cookies" "/elevate" "/news" "/oem" "/privacy" "/products" "/products/sauna-controllers" "/products/jacquard-drivers" "/products/branded-units" "/products/accessories" "/quote" "/resources" "/terms" "/thank-you" "/admin/login" "/sitemap.xml" "/robots.txt"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
```

预期: 全部 **HTTP 200**（`/admin/login` 200；其余 admin 路由未登录会 302/307 重定向到 login，属正常）。

### 3.2 sitemap / robots 专项

```bash
# sitemap 应包含首页、/products、/news、产品详情、新闻文章 URL
curl -s https://fnec.net/sitemap.xml | grep -o "<loc>[^<]*</loc>" | head -30

# robots 应 disallow /admin/ 与 /api/ 并指向 sitemap
curl -s https://fnec.net/robots.txt
```

预期: sitemap 含 `https://fnec.net/`、`https://fnec.net/news`、至少一个 `/products/` 详情 URL；robots.txt 含 `Disallow: /admin/`、`Disallow: /api/`、`Sitemap: https://fnec.net/sitemap.xml`。

### 3.3 JSON-LD 结构化数据专项

```bash
# ① 首页：应含 Organization + WebSite
curl -s https://fnec.net/ | grep -o '"@type": "[^"]*"'

# ② 产品详情：应含 Product
curl -s https://fnec.net/products/sauna-controllers | grep -o '"@type": "[^"]*"'

# ③ 新闻详情：应含 NewsArticle（本批新增）
curl -s https://fnec.net/news/ | grep -o '"@type": "[^"]*"' | sort -u
```

预期: 首页含 `Organization`、`WebSite`；产品详情含 `Product`；新闻列表页无 NewsArticle（列表非文章详情）。**新闻详情验证**：若线上有已发布文章，`curl -s https://fnec.net/news/{slug} | grep -o '"@type": "[^"]*"'` 应含 `NewsArticle`。若无已发布文章，该项转人工在 admin 发布一篇后验证（见 3.5）。

### 3.4 API 回归

```bash
# 公开 API 均应 200
for u in "/api/content" "/api/products" "/api/products/sauna-controllers" "/api/news"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done

# admin API 未登录均应 401
for u in "/api/admin/news" "/api/admin/products" "/api/admin/content" "/api/admin/stats"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done

# 404 兜底：不存在的 slug 应 404
curl -s -o /dev/null -w "missing-article -> HTTP %{http_code}\n" "https://fnec.net/api/news/definitely-not-exists"
```

预期: 前一组全部 200；中间一组全部 **401**；最后一条 **404**。

### 3.5 浏览器人工项（cron 环境跳过，标注"需人工"）

1. 登录 `https://fnec.net/admin/login`，News 入口、Dashboard 统计卡、`/admin/news` CRUD 正常（第十三批功能，本批未改动，仅冒烟确认）。
2. 若线上有已发布新闻，打开其详情页，控制台确认 NewsArticle JSON-LD 存在（`view-source` 搜 `NewsArticle`）。
3. 全站控制台 0 报错。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建部署 | 待执行 | |
| 3.1 公开路由 | 待执行 | |
| 3.2 sitemap/robots | 待执行 | |
| 3.3 JSON-LD | 待执行 | |
| 3.4 API 回归 | 待执行 | |
| 3.5 浏览器人工项 | 待执行 | cron 环境无法登录，标注需人工 |
