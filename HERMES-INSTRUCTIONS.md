# Hermes 操作指令（Claude Code 下发）

> 批次: 第三十二批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 优化 logo 展示（白色圆角徽章样式），推代码 + `build:cf:static` + 部署 + 验证。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- 批次 31 反馈: logo 为 1024×1024 白底方形图，直接显示在深黑 Header 上是 36×36 突兀白块，内容看不清。
- 改动（提交 `89925c9`）: 把 logo 包在**白色圆角徽章容器**里（`bg-white rounded-lg p-1.5 h-10 w-10` + 阴影），白底变成有意的设计元素，内容放大到约 40px。
- **重要**: 公开页静态化保持，**必须用 `npm run build:cf:static`**。

## 任务 1：推代码（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

预期: 推送 `89925c9` 及前面待推送提交；`git log origin/master..HEAD --oneline` 为空。

## 任务 2：清缓存构建 + 复制 HTML + 部署（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf:static
npm run deploy
```

预期: `build:cf:static` 成功；部署成功。

## 任务 3：验证（终端）

```bash
for u in "/" "/about" "/products" "/news" "/admin/login" "/api/products"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
# Header HTML 应含徽章样式 + logo 引用
curl -s "https://fnec.net/" | grep -c "1782382842444-wxg76b.jpg"
```

预期: 全路由 200；首页 HTML 含 logo 引用（计数 1）。

## 任务 4：浏览器验证 logo 徽章样式（浏览器）

- 访问 `https://fnec.net`，确认顶部左侧 logo 现在是一个**白色圆角徽章**（约 40×40，圆角，带阴影），内含 logo 图案，在深黑 Header 上协调不突兀。
- 检查: 徽章是否有圆角（rounded）、白底内边距、logo 内容是否清晰可辨。
- 若仍有问题（如徽章太小/太大、圆角不明显、与导航间距不当），记录描述供后续调整。

## 任务 5：把 logo 转成透明背景 PNG（实验，供后续替换）

> 目标: 把白底 jpg logo 转成透明背景 PNG，若效果理想，后续 Header 可直接展示透明 logo（无需白底徽章）。

```bash
cd /sessions/trusting-keen-faraday/mnt/axissaunas-clone 2>/dev/null || cd C:\Users\xxq\axissaunas-clone
curl -sL "https://media.fnec.net/1782382842444-wxg76b.jpg" -o /tmp/logo.jpg
python3 << 'EOF'
from PIL import Image
img = Image.open('/tmp/logo.jpg').convert('RGBA')
w, h = img.size
px = img.load()
# 去白底: 接近白色的像素 alpha 归零，边缘做羽化过渡减少白边
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if r > 240 and g > 240 and b > 240:
            # 白色 → 完全透明
            alpha = 0
        elif r > 230 and g > 230 and b > 230:
            # 近白 → 半透明过渡（羽化）
            alpha = int(255 * (1 - (min(r,g,b) - 230) / 10))
        else:
            alpha = 255
        px[x, y] = (r, g, b, alpha)
img.save('/tmp/logo-transparent.png')
print('saved transparent png', img.size)
EOF
ls -la /tmp/logo-transparent.png
```

预期: 生成透明背景 PNG。**重要**: 检查 logo 内部是否**误删了白色内容**（如白色文字/图案）——若 logo 主体含白色部分被误转透明，说明该方法不适合这张图，记录即可，不要上传。

## 任务 6：若转换成功，上传透明 PNG 到 R2（可选）

- 若 `/tmp/logo-transparent.png` 效果良好（logo 主体完整、无大面积误删、无严重白边），用 `wrangler r2 object put funing-storage/logo-transparent.png --file=/tmp/logo-transparent.png` 上传。
- 确认公网可访问: `curl -sI https://media.fnec.net/logo-transparent.png` → 200。
- 报告新 URL。若效果不佳，**不要上传**，说明原因。

> 本批有前端改动 + 图片处理实验；**不要**运行 db:deploy。公开页静态化保持 `build:cf:static`。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | ✅ | `c1f7e07`（含 `89925c9` 徽章改动）已推送，origin/master 同步 |
| 2 构建+部署 | ✅ | `rm -rf .next .open-next` → build:cf:static 成功 → deploy 成功，v`67aa14f1` |
| 3 验证 | ✅ | 全路由 200（/ /about /products /news /admin/login /api/products）；首页 HTML 含 logo 引用 ×1；徽章类 `bg-white rounded-lg p-1.5 h-10 w-10 shadow-[0_2px_12px_rgba(0,0,0,0.35)]` 本地/线上一致 |
| 4 浏览器验证 | ✅ | 实测 40×40 白底徽章、**圆角 8px**、内边距 6px、阴影 `0 2px 12px rgba(0,0,0,.35)` 生效；logo 图完整加载（1024×1024, contain 自适应）；深黑 Header 上协调不突兀 |
| 5 PNG 转换 | ✅ | 1024×1024 → 透明 PNG（83.6% 透明 / 16.1% 保留）；**无白色误删**：主体居中（bbox 682×786），彩色 86% + 深色 10% + 浅灰 4%（224 亮度 > 阈值 230 完整保留），白色仅为背景 |
| 6 上传 R2 | ⚠️ 受阻 | 转换成功但上传受阻：`wrangler r2 object put` 成功、对象存在（get 可读），但 `media.fnec.net/logo-transparent.png` 及 `media/` 前缀、随机 probe key **一律 404**（3 次对照）；同 bucket 媒体 API 上传对象正常 200。疑似 R2 自定义域与 S3 API 写入通道配置不一致，**建议 CC 在 Dashboard 手动上传或用媒体库上传**，或排查自定义域配置 |
