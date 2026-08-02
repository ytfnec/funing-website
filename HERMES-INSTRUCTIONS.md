# Hermes 操作指令（Claude Code 下发）

> 批次: 第十批 · 更新: 2026-08-02 · 来源: Claude Code
> 说明: 请在项目目录 `C:\Users\xxq\axissaunas-clone` 执行，完成后写回报。

---

## 任务 1：推代码（终端）

本地有 1 个未推送开发提交：`9e83791`（首页 CTA PCB 纹理增强）。

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
for u in "/" "/admin/login" "/products" "/contact" "/quote" "/api/content" "/sitemap.xml" "/robots.txt"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
```

预期：全部 200。此改动为视觉增强（首页底部 CTA 加了 PCB 纹理叠加），浏览器查看 `https://fnec.net` 滚动到底部 CTA 区确认正常渲染、无报错即可。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | ✅ 已完成 | cef17e9..bb2539a 推送成功（含 9e83791 代码 + bb2539a 指令） |
| 2 构建部署 | ✅ 已完成 | 清缓存 → build:cf → deploy 成功，Version `9b023d4d-4ec0-4043-bf45-1d48471dc416` |
| 3 验证 | ✅ 通过 | 8 路由全 200；浏览器实测首页 CTA 区：纹理叠加层正常（`/assets/cta-bg.webp` → 200 image/webp 103KB，absolute inset-0 z-0 + object-cover），控制台 0 错误 |
