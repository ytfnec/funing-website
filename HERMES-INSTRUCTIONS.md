# Hermes 操作指令（Claude Code 下发）

> 批次: 第十五批 · 更新: 2026-08-02 · 来源: Claude Code
> 说明: 请在项目目录 `C:\Users\xxq\axissaunas-clone` 执行，完成后写回报。

---

## 背景

本批为功能队列第 6 项 **加载骨架屏 + 错误边界**。新增：
- `src/components/Skeleton.tsx`：骨架屏原语（`Skeleton` / `SkeletonText`）+ 各路由骨架屏（Page / NewsList / NewsArticle / ProductsList / ProductDetail），琥珀 shimmer 动画（`.skeleton` 定义在 globals.css，`prefers-reduced-motion` 自动禁用动画）
- `src/components/ErrorFallback.tsx`：i18n 感知错误界面（重试 + 返回首页），新增 `error.*` 5 个双语 key
- `loading.tsx`：根 + `/news` + `/news/[slug]` + `/products` + `/products/[slug]` 共 5 个路由级 Suspense 边界
- `error.tsx`（根路由错误边界）+ `global-error.tsx`（顶层致命错误，自含双语，替换整页布局）
- news / products 各页原内联 spinner 加载态替换为对应骨架屏

本批**无 schema 变更**，只需推代码 + 清缓存构建部署 + 验证。

## 任务 1：推代码（终端）

本地有 2 个未推送提交：`d8f1a8f`（骨架屏 + 错误边界）、以及本指令文件及 HANDOFF-LOG 更新。Hermes 推代码前可用 `git log origin/master..HEAD --oneline` 核对，`git push` 会自动推送全部剩余未推送提交。

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

## 任务 3：验证

### 3.1 公开路由全部 200

```bash
for u in "/" "/about" "/news" "/news/sample-slug" "/products" "/products/sauna-controllers" "/contact" "/quote" "/sitemap.xml" "/robots.txt"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
```

预期: 全部 **HTTP 200**。`/news/sample-slug` 会 200（页面渲染，文章不存在走 notFound 呈现），不报错即可。

### 3.2 骨架屏 / 错误边界专项（本批核心）

```bash
# ① 根路由 loading 边界: 首次请求响应应为流式 HTML，含 <div class="skeleton"> 或页面最终内容（加载中骨架屏在慢速/断开时出现）
curl -s https://fnec.net/ | head -c 500
```

预期: 返回 HTML 片段（`<html` 开头或流式 chunk）。此项无法在纯 curl 下稳定看到骨架屏，**以浏览器实测为主**（见 3.4）。

### 3.3 错误边界静态检查

```bash
# 部署产物应包含错误边界组件与骨架屏样式
curl -s https://fnec.net/ | grep -c "skeleton"   # 预期 ≥ 0（骨架屏为动态渲染，CSS 在独立文件）
# 确认 CSS 中含 .skeleton 与 shimmer 关键帧
curl -s https://fnec.net/_next/static/css/$(curl -s https://fnec.net/ | grep -o '/_next/static/css/[^"]*\.css' | head -1) | grep -o "skeleton-shimmer" | head -1
```

预期: 命中 `skeleton-shimmer` 关键帧（说明骨架屏样式已打包发布）。

### 3.4 浏览器人工项（cron 环境跳过，标注"需人工"）

1. 打开 `https://fnec.net/products`、`/news`、`/products/sauna-controllers`，在 DevTools Network 里把网络调为 Slow 3G，观察**骨架屏**（琥珀 shimmer 灰块）先于内容出现，无闪现错位。
2. 手动触发一个渲染错误验证 `error.tsx`：DevTools → Network 断开后刷新某页，或临时在页面抛错（仅本地验证，勿改线上），确认出现「页面加载失败 / 重试」界面，点重试可恢复。
3. 全站控制台 0 报错；页面正常加载后骨架屏消失。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建部署 | 待执行 | |
| 3 验证 | 待执行 | |
