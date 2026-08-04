# Hermes 操作指令（Claude Code 下发）

> 批次: 第三十三批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 把透明 PNG logo 放入 `public/assets/logo.png`（本地静态资源，绕开 R2 上传问题），供 Header 引用。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- 徽章样式已上线且效果良好（v`67aa14f1`）。透明 PNG 转换成功，但 R2 S3 API 上传后自定义域 404（通道不一致问题）。
- 决策: **放弃 R2 上传**，改用**本地静态资源**方案——透明 PNG 放入 `public/assets/logo.png`，随静态化进 assets 由 CDN 直接服务，稳定可靠。
- 本批**不改前端代码**（Header 仍用徽章），仅放置资源文件供后续替换。

## 任务 1：确认代码已同步（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git log origin/master..HEAD --oneline
```

预期: 为空（无待推送提交）。

## 任务 2：放置透明 PNG 到 public/assets（终端）

> 你（Hermes）的环境里有已生成好的透明 PNG（批次 32 的 `/tmp/logo-transparent.png` 或你本地备好的 1024 全尺寸版本）。把它复制到项目：

```bash
cd C:\Users\xxq\axissaunas-clone
mkdir -p public/assets
# 用你已生成的透明 PNG（若 /tmp 已清空则重新按批次 32 的方法生成）
cp /tmp/logo-transparent.png public/assets/logo.png 2>/dev/null || {
  echo "重新生成...";
  curl -sL "https://media.fnec.net/1782382842444-wxg76b.jpg" -o /tmp/logo.jpg
  python3 << 'EOF'
from PIL import Image
img = Image.open('/tmp/logo.jpg').convert('RGBA')
w, h = img.size
px = img.load()
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if r > 240 and g > 240 and b > 240:
            alpha = 0
        elif r > 230 and g > 230 and b > 230:
            alpha = int(255 * (1 - (min(r,g,b) - 230) / 10))
        else:
            alpha = 255
        px[x, y] = (r, g, b, alpha)
img.save('public/assets/logo.png')
print('generated public/assets/logo.png', img.size)
EOF
}
# 验证
file public/assets/logo.png
ls -la public/assets/logo.png
```

预期: `public/assets/logo.png` 存在，是 PNG 格式，透明背景。

## 任务 3：提交资源文件（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git add public/assets/logo.png
git commit -m "Add transparent PNG logo asset (public/assets/logo.png)"
```

预期: 提交成功（logo.png 约 400KB，作为静态资源入库）。

## 任务 4：构建部署（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf:static
npm run deploy
```

预期: `build:cf:static` 成功（logo.png 进 assets）；部署成功。

## 任务 5：验证（终端）

```bash
for u in "/" "/about" "/assets/logo.png"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
```

预期: 全 200；`/assets/logo.png` 200（静态资源可从 CDN 访问）。

> 本批不改前端组件（Header 仍显示徽章），仅新增透明 logo 静态资源；**不要**运行 db:deploy。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 确认同步 | ✅ | 先推送 CC 批次33 提交（`fd4ee2c` 媒体库方案 + `c9e39fb` 本地资源修订）→ `git log origin/master..HEAD` 为空 |
| 2 放置 PNG | ✅ | `public/assets/logo.png` = 1024×1024 RGBA PNG，416,424 字节（≈406KB），透明背景（83.6% 透明 / 16.1% 保留） |
| 3 提交 | ✅ | `db830aa` "Add transparent PNG logo asset (public/assets/logo.png)" 已推送 |
| 4 构建部署 | ✅ | 清缓存 → build:cf:static 成功 → deploy 成功，v`16496bbb`；产物 `.open-next/assets/assets/logo.png`（public/ 平铺进 assets/） |
| 5 验证 | ✅ | `/` 200、`/about` 200、**`/assets/logo.png` 200 image/png**（assets 目录 = URL 根，`/assets/assets/logo.png` 404 属正常）；下载 hash 与本地原件 **MD5 一致**（934859c1…） |
