# Hermes 操作指令（Claude Code 下发）

> 批次: 第三十三批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 通过媒体库 API 上传透明 PNG logo（绕过 R2 S3 API 404 问题），验证可访问后报告 URL。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- 批次 32: 透明 PNG 转换成功（1024×1024，83.6% 透明，无白色误删），但 `wrangler r2 object put` 上传的对象 `media.fnec.net` 访问 404；同一 bucket 经**媒体库 API** 上传的对象正常 200。
- 结论: 用**媒体库上传通道**（后台 /api/admin/media）上传透明 PNG，拿到可访问 URL。
- 徽章样式当前已上线（效果良好），本批**不改前端代码**，仅准备透明 PNG 供后续替换。

## 任务 1：确认代码已同步（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git log origin/master..HEAD --oneline
```

预期: 为空（无待推送提交）。若本地落后 origin 先 pull。

## 任务 2：重新生成透明 PNG（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
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
img.save('/tmp/logo-transparent.png')
print('saved', img.size)
EOF
ls -la /tmp/logo-transparent.png
```

预期: 生成透明 PNG（约 400KB）。

## 任务 3：通过媒体库 API 上传（终端）

> 媒体库 API 需要登录 session。若 curl 不便，可改用后台 Media 页面上传（更简单）：浏览器登录后台 → Media → Upload → 选择 `/tmp/logo-transparent.png`。

```bash
# 方案 A（若已有 admin cookie）：用浏览器上传即可，跳过此命令。
# 方案 B（curl + cookie）：
cd C:\Users\xxq\axissaunas-clone
# 1) 登录拿 cookie
curl -s -c /tmp/cookies.txt -X POST "https://fnec.net/api/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"<ADMIN_EMAIL>","password":"<ADMIN_PASSWORD>"}'
# 2) 上传（需要正确的管理员账号密码，如不知则用方案 A）
curl -s -b /tmp/cookies.txt -X POST "https://fnec.net/api/admin/media" \
  -F "file=@/tmp/logo-transparent.png;type=image/png" -F "alt=logo"
```

**推荐**: 直接浏览器登录后台 → Media → 上传 `/tmp/logo-transparent.png`，最简单可靠。

## 任务 4：验证上传后可访问（终端）

```bash
# 从媒体库 API 拿 r2_key（浏览器上传后，GET /api/admin/media 查最新一条）
# 假设 r2_key = media/xxx.png，验证公网访问：
curl -s -o /dev/null -w "media URL -> HTTP %{http_code}\n" "https://media.fnec.net/media/xxx.png"
```

预期: **HTTP 200**（媒体库通道上传的对象经自定义域可访问）。记录完整 URL（形如 `https://media.fnec.net/media/xxx.png`）。

## 任务 5：报告（回报表填写）

- 透明 PNG 是否上传成功、最终可访问 URL。
- 该 URL 的图片是否就是透明背景 logo（可 `curl -s <url> -o /tmp/x.png && file /tmp/x.png` 确认是 PNG）。

> 本批不改前端代码，仅准备资源；**不要**运行 db:deploy。若浏览器上传不便，可报告受阻原因。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 确认同步 | 待执行 | |
| 2 生成 PNG | 待执行 | |
| 3 上传 | 待执行 | 说明用哪种方式 |
| 4 验证访问 | 待执行 | 报最终 URL |
| 5 报告 | 待执行 | |
