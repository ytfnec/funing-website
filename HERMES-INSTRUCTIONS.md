# Hermes 操作指令（Claude Code 下发）

> 批次: 第十六批 · 更新: 2026-08-02 · 来源: Claude Code
> 说明: 请在项目目录 `C:\Users\xxq\axissaunas-clone` 执行，完成后写回报。

---

## 背景

本批为功能队列第 7 项 **产品详情页 hero_image 真实展示**。新增：
- `src/lib/image.ts`：`resolveImageSrc()` 统一解析 hero_image（支持完整 URL / 本地路径 / 裸 R2 key，按 `NEXT_PUBLIC_R2_PUBLIC_URL` 拼接，构建时内联）
- 公开产品详情页：hero_image 存在则用 `<img>` 真实展示（eager + fetchPriority high），加载失败 `onError` 回退到原有的琥珀网格占位纹理；Product JSON-LD 的 image 改用解析后的 URL
- admin 产品编辑页：新增 **Product Image** 区块（自由输入 hero_image URL/路径/R2 key + **Browse Media** 弹层从 `/api/admin/media` 选择图片一键设置 + 实时预览，图片缺失时预览变暗）
- R2 公共域名未配置时优雅降级（选择器显示图标占位、预览不裂图）

**说明**：`NEXT_PUBLIC_R2_PUBLIC_URL` 当前仅在 `.env.example` 里示例，未实际配置，因此线上媒体库图片选择器的 R2 预览会显示占位图标（属预期降级）；公开页 hero 图若线上产品已有 `hero_image` 值且可访问则真实展示，否则回退纹理。本批**无 schema 变更**（products.hero_image 列早已存在）。

## 任务 1：推代码（终端）

本地有 2 个未推送提交：`c011184`（hero_image 展示 + 回退）、以及本指令文件及 HANDOFF-LOG 更新。`git push` 会自动推送全部剩余未推送提交。

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
for u in "/" "/products" "/products/sauna-controllers" "/products/jacquard-drivers" "/products/branded-units" "/products/accessories" "/admin/login" "/sitemap.xml" "/robots.txt"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
```

预期: 全部 **HTTP 200**。

### 3.2 hero_image 专项（本批核心）

```bash
# ① 产品详情 HTML 应含 <img>（hero 图）或回退纹理占位，且 JSON-LD image 字段解析正确
curl -s https://fnec.net/products/sauna-controllers | grep -o 'src="[^"]*"' | head -5
curl -s https://fnec.net/products/sauna-controllers | grep -o '"image":"[^"]*"'
```

预期: ① `<img src>` 存在（若该产品在 D1 配了 hero_image 则为该 URL；若未配置则回退纹理渲染，无裂图）；② JSON-LD 出现 `"image"` 字段（值为 hero 图 URL，或无则字段为 undefined 不输出——两者均可）。

### 3.3 admin 浏览器人工项（需人工，cron 环境跳过）

1. 登录 `https://fnec.net/admin/login` → 任意产品编辑页。
2. 出现 **Product Image** 区块：输入框可粘贴 URL/路径；点 **Browse Media** 弹出媒体库网格（若 `NEXT_PUBLIC_R2_PUBLIC_URL` 未配置，缩略图为占位图标，属预期）；点选某图填充到 hero_image。
3. 输入一个 hero_image 后下方出现 4:3 预览；填一个坏地址时预览变暗但不裂图、控制台 0 报错。
4. 保存后到公开详情页确认 hero 图真实展示（或回退纹理）。
5. 备注：若要启用媒体库 R2 真实预览，需在构建时设置 `NEXT_PUBLIC_R2_PUBLIC_URL`（见 `.env.example`），可后续人工配置。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | ✅ | git push 686c287..d721921 master → origin（c011184 hero_image 展示 + d721921 指令文件）推送成功 |
| 2 构建部署 | ✅ | 已清 .next/.open-next 缓存，无残留 node.exe 进程；npm run build:cf（webpack/OpenNext）成功；npm run deploy 成功 → Version ID: 3ee54507-05ec-4861-abb0-a83c0e5396ac（当前线上 100%）。注：22:27 曾有并发 cron 会话部署 7136dad5 并先行填表，22:28 本会话 3ee54507 覆盖为最新；两版本同批代码、内容等价 |
| 3 验证 | ✅ | 3.1 九条公开路由（/、/products、4 产品页、/admin/login、/sitemap.xml、/robots.txt）全部 HTTP 200；3.2 sauna-controllers 的 hero_image 在 D1 为 null → 页面回退琥珀网格纹理（CSS 渐变占位，无裂图），JSON-LD image 字段按预期省略（heroImage undefined）；3.3 admin 浏览器人工项（Product Image 区块/Browse Media 弹层/预览变暗）属人工验证，cron 环境跳过 |
