# Hermes 操作指令（Claude Code 下发）

> 批次: 第三十一批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 企业 logo 加入网站 Header，推代码 + `build:cf:static` + 部署 + 验证。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- 用户提供企业 logo 图片 URL（R2 自定义域）: `https://media.fnec.net/1782382842444-wxg76b.jpg`
- 改动: Header 顶部 logo 由文字版改为**图片 logo**（引用上述 URL），带 `onError` 回退到文字版。
- **重要**: 公开页静态化保持，**必须用 `npm run build:cf:static`**。

## 任务 1：推代码（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

预期: 推送 Header logo 改动提交及前面待推送提交；`git log origin/master..HEAD --oneline` 为空。

## 任务 2：清缓存构建 + 复制 HTML + 部署（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf:static
npm run deploy
```

预期: `build:cf:static` 成功；部署成功。

## 任务 3：下载图片并分析（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
curl -sL "https://media.fnec.net/1782382842444-wxg76b.jpg" -o /tmp/logo.jpg
file /tmp/logo.jpg
# 用 python 分析尺寸与背景色（判断四角是否为白色/透明）
python3 -c "
from PIL import Image
img = Image.open('/tmp/logo.jpg').convert('RGBA')
print('size:', img.size)
w, h = img.size
# 采样四角与中心
corners = {'top-left': img.getpixel((3,3)), 'top-right': img.getpixel((w-4,3)), 'bottom-left': img.getpixel((3,h-4)), 'center': img.getpixel((w//2,h//2))}
print('corners:', corners)
"
```

预期: 输出图片尺寸和四角像素颜色，用于判断 logo 是否有白底（若四角是接近纯白 (255,255,255,255)，则图片为白底矩形；若透明 alpha=0 则透明背景）。

## 任务 4：浏览器验证 logo 显示（终端/浏览器）

- 访问 `https://fnec.net`，确认顶部左侧显示**图片 logo**（而非文字），尺寸合适（高度约 36px），与深黑背景协调。
- 若图片为**白底矩形**导致深黑 Header 上出现突兀白块，记录描述（白底大小、是否圆角、文字颜色），我后续调整样式（如加圆角/内边距容器）。
- 若图片加载失败，应回退到文字 logo（onError 生效），页面不崩溃。

> 本批有前端改动；**不要**运行 db:deploy。公开页静态化保持 `build:cf:static`。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建+部署 | 待执行 | |
| 3 图片分析 | 待执行 | 输出尺寸 + 四角颜色 |
| 4 浏览器验证 | 待执行 | 描述 logo 在 Header 上的显示效果 |
