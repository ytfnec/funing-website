# Hermes 操作指令（Claude Code 下发）

> 批次: 第二十九批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 启用 R2 媒体库预览（NEXT_PUBLIC_R2_PUBLIC_URL），重新构建部署 + 验证。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- 用户已在 Cloudflare Dashboard 给 R2 桶 `funing-storage` 绑定了自定义域 `media.fnec.net`。
- 本地 `.env` 已配置 `NEXT_PUBLIC_R2_PUBLIC_URL=https://media.fnec.net`（git 忽略，不入库）。Next.js 构建时会自动读取 `.env`，把该值内联进客户端 bundle。
- 目的：让后台媒体库（Media Library）能渲染图片缩略图预览（之前因 URL 未配置，图片只显示图标+格式文字）。
- 本批**无代码改动**（代码早已支持，只差构建时注入），纯重新构建部署。

## 任务 1：确认 .env 配置（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
grep NEXT_PUBLIC_R2_PUBLIC_URL .env
```

预期: 输出 `NEXT_PUBLIC_R2_PUBLIC_URL=https://media.fnec.net`。若为空，先创建 `.env` 并写入该行。

## 任务 2：清缓存构建 + 复制 HTML + 部署（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf:static
npm run deploy
```

预期: `build:cf:static` 出现 "Copied 24 prerendered HTML files" + "Wrote .open-next/assets/_headers"；部署成功，线上版本更新。
> 注: 构建时 Next 会把 `NEXT_PUBLIC_R2_PUBLIC_URL` 内联进客户端 JS（媒体库/产品编辑页的预览逻辑读取它）。

## 任务 3：验证（终端）

```bash
for u in "/" "/about" "/products" "/news" "/admin/login" "/api/products" "/api/admin/media"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
# 确认 R2 自定义域可达（媒体预览依赖它）
curl -s -o /dev/null -w "media.fnec.net -> HTTP %{http_code}\n" "https://media.fnec.net/"
```

预期: 公开页全 200（静态化保持）；admin API 未登录 401；`media.fnec.net` 可达（200 或 404 均可，关键是不超时/能返回——证明自定义域已生效）。

## 任务 4：媒体库预览验证（可选，不阻塞）

- 登录后台 → Media → 上传一张测试图 → 确认媒体库显示**图片缩略图**（而非仅图标+格式文字）。
- 上传的测试图验证后可删除。

> 本批无代码改动，仅重新构建部署（注入 R2 URL）；**不要**运行 db:deploy。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 确认 .env | ✅ | `.env` 第 6 行 `NEXT_PUBLIC_R2_PUBLIC_URL=https://media.fnec.net`（已配置，非注释） |
| 2 构建+部署 | ✅ | 清缓存 → `build:cf:static` 成功（46/46 页 + "Copied 24 prerendered HTML" + `_headers`）；R2 URL 已内联进媒体页+产品编辑页 bundle；部署 v`c35eb2e0-9299-430a-ab9b-ff90bf16312c` |
| 3 验证 | ✅ | 公开页 5 路由全 200；`/api/products` 200；`/api/admin/media` 未登录 401；`media.fnec.net` 可达（404 但 1.9s 有响应，自定义域生效） |
| 4 预览验证 | ✅ | 上传测试图（test-preview.png，canvas 生成）→ R2 对象公网 200（`https://media.fnec.net/media/media-e6ff...png`）；媒体库 `<img>` 真实加载（naturalWidth 64×64，src 指向 media.fnec.net）→ **缩略图预览生效**；删除后 D1 记录清 + R2 对象 404（cache-buster 验证，CDN 边缘缓存已过期）。**之前"无预览"= 配置缺失（R2 URL 未注入），现已修复** |
