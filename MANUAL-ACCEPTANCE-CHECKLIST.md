# Funing Electronics 网站 — 人工验收清单

> 用途: 功能队列 8 项已全部部署,以下为 cron 环境无法自动覆盖的**人工浏览器验收项**。
> 时间: 2026-08-03 · 对应批次: 14–17 遗留项 + 1102 事故后加固确认。
> 线上地址: `https://fnec.net` · 后台: `https://fnec.net/admin/login`

验收状态图例: ☐ 未验收 / ✅ 通过 / ⚠️ 有问题(在说明栏记录)

---

## 0. 前置准备

- [ ] 浏览器打开 `https://fnec.net`,首页正常加载(深黑 + 琥珀设计,无报错)
- [ ] 后台登录: `https://fnec.net/admin/login`,账号 `admin@fnec.net` + 密码
  - 若忘记密码,项目内重置:`node -e "console.log(require('bcryptjs').hashSync('<新密码>',12))"` → 用输出的 hash `UPDATE admin_users SET password_hash='...' WHERE email='admin@fnec.net';`(D1 远程)

---

## 1. 新闻详情 NewsArticle JSON-LD(第十四批)

**背景**: sitemap/robots/结构化数据已审查,新闻详情页 NewsArticle JSON-LD 已补(commit `9b79bf3`),但因线上无已发布文章,未能自动验证。

- [ ] 后台 → News → 新建一篇文章,填标题/摘要/正文,勾选 **Published**,保存
- [ ] 公开 `https://fnec.net/news` 应显示该文章(含日期/作者)
- [ ] 点入 `https://fnec.net/news/{slug}`,右键 → 查看网页源代码
- [ ] 搜索 `NewsArticle`,确认存在 `"@type":"NewsArticle"` 且含 `headline`、`datePublished`、`author`、`image`(若有封面)
- [ ] 将该文章切回 **Draft**,公开列表应不再显示;切回 Published 恢复

说明:

---

## 2. 加载骨架屏(第十五批)

**背景**: 根 + `/news` + `/news/[slug]` + `/products` + `/products/[slug]` 共 5 个 `loading.tsx`,琥珀 shimmer 骨架屏。

- [ ] DevTools → Network 面板,把网络调为 **Slow 3G**,禁用缓存
- [ ] 刷新 `https://fnec.net/products`:应先看到骨架屏(琥珀 shimmer 灰块,仿产品列表布局),再过渡到真实内容,**无闪现错位**
- [ ] 依次测 `/news`、`/products/sauna-controllers`(详情)、`/news/{slug}`(如有文章),骨架屏分别匹配列表/详情布局
- [ ] 系统开启"减弱动态效果"(macOS 辅助功能 / Windows 动画效果关)时,shimmer 动画应停止、仅显示静态灰块
- [ ] 正常加载后骨架屏消失,内容完整

说明:

---

## 3. 错误边界(第十五批)

**背景**: 根 `error.tsx`(i18n 错误界面 + 重试)+ `global-error.tsx`(顶层致命错误)。

- [ ] 打开任一公开页,DevTools → Network 改为 **Offline**,刷新
- [ ] 预期出现错误界面:「页面加载失败」/「Something Went Wrong」+「重试」按钮(视觉:琥珀三角告警图标)
- [ ] 恢复 Online,点 **重试**,页面应恢复
- [ ] 控制台无未捕获异常(除预期的离线网络错误)

> 注: 由于页面多为客户端 fetch,离线时更常见的表现是内容区显示空/降级而非整页 error.tsx——两者都属于优雅降级,均可接受。`global-error.tsx`(整页替换,双语)通常只在根布局渲染失败时触发,极难手工触发,可不强验。

说明:

---

## 4. 产品编辑 Product Image(第十六批)

**背景**: admin 产品编辑页新增 Product Image 区块(自由输入 + Browse Media 弹层 + 实时预览),公开详情页 hero_image 缺失时回退琥珀网格纹理。

**公开详情页回退验证**:
- [ ] `https://fnec.net/products/sauna-controllers`:若该产品未设置 hero_image,应显示**琥珀网格占位纹理**(中央产品名),无裂图、无 404
- [ ] 该产品 JSON-LD 的 `image` 字段:未设置时省略,设置时输出解析后的 URL

**admin 设置验证**:
- [ ] 后台 → Products → 编辑任一产品,滚动到 **Product Image** 区块
- [ ] 在输入框粘贴一个图片 URL(如 `/assets/hero.webp`),下方应出现 4:3 **预览图**
- [ ] 填一个**坏地址**(如 `https://example.com/nonexist.jpg`),预览应变暗但不裂图
- [ ] 点 **Browse Media**:若 `NEXT_PUBLIC_R2_PUBLIC_URL` 未配置,弹层显示占位图标(属预期降级);若已配置,显示媒体库缩略图,点选一键填入
- [ ] 保存后到公开详情页确认 hero 图真实展示(或按产品状态回退纹理)
- [ ] 控制台 0 报错

说明:

---

## 5. Media 批量删除(第十七批)

**背景**: 媒体库每张图片新增复选框 + 全选 + Delete Selected,批量删除同步清理 R2 对象与 D1 记录。

- [ ] 后台 → Media Library,上传 2–3 张测试图片
- [ ] 逐张勾选复选框:选中卡片呈**琥珀高亮边框**,顶部工具栏显示「N selected」
- [ ] 点 **Select all**:全部选中
- [ ] 点 **Delete Selected**,弹出确认框,确认后:
  - 选中的图片从列表消失
  - D1 `media_library` 记录已删
  - R2 `funing-storage` 对应对象已删(可在 Cloudflare Dashboard → R2 → funing-storage 确认)
- [ ] 单张 Delete 后,若该行曾被勾选,选中集应同步移除该 id(不残留幽灵计数)
- [ ] 批量操作中按钮转圈 disabled;控制台 0 报错

说明:

---

## 6. 可选增强: 媒体库 R2 真实预览

**背景**: 公开/后台媒体缩略图依赖 `NEXT_PUBLIC_R2_PUBLIC_URL`(构建时内联)。未设置时媒体选择器/列表显示占位图标。

- [ ] 决定是否启用:在 Cloudflare 给 `funing-storage` 绑一个**自定义公共域名**(或使用 R2 公开 bucket),得到 `https://media.xxx.com`
- [ ] 若启用:在 `.env` 加 `NEXT_PUBLIC_R2_PUBLIC_URL=https://media.xxx.com`,重新 `npm run build:cf` + `npm run deploy`
- [ ] 启用后:Media Library 显示真实缩略图,产品编辑 Browse Media 弹层显示图片,预览正常
- [ ] 不启用也可正常使用(仅看不到缩略图预览),不阻塞其他功能

说明:

---

## 7. 1102 事故后加固确认(第十九批)

**背景**: 已给 `/api/products`、`/api/products/[slug]`、`/api/news` 加 `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`。

- [ ] 浏览器打开页面,正常访问不受影响
- [ ] 或命令行:
  ```bash
  curl -s -D - -o /dev/null https://fnec.net/api/products | grep -i cache-control
  ```
  预期返回 `cache-control: public, s-maxage=60, stale-while-revalidate=300`

说明:

---

## 汇总

| # | 项 | 状态 | 备注 |
|---|----|------|------|
| 1 | 新闻 NewsArticle JSON-LD | ☐ | |
| 2 | 加载骨架屏 | ☐ | |
| 3 | 错误边界 | ☐ | |
| 4 | 产品 Product Image | ☐ | |
| 5 | Media 批量删除 | ☐ | |
| 6 | (可选) R2 真实预览 | ☐ | |
| 7 | 1102 加固确认 | ☐ | |

> 验收完成后,可将本文件状态栏更新为 ✅,或把问题记录在"说明"栏反馈给开发继续跟进。
