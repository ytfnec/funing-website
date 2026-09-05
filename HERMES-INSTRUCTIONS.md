# Hermes 操作指令（Claude Code 下发）

> 批次: **第四十六批（最新）** · 更新: 2026-09-05 · 来源: Claude Code
> 状态: **整站配色改浅（Axis 暖白高级风）· 待执行部署**

---

## 第四十六批：整站配色改浅 — Axis 暖白高级风

用户需求：网站"太暗黑"，希望换成类似 axissaunas.com（Axis by Jacuzzi）的暖白高级风。

本批次为**整站视觉改版**，已本地提交（提交 `e40f645`，36 个文件）：

### 新色板
- 页面底 `cream #f6f2ea`（暖象牙）
- 交替区 `sand #efe9de`（浅沙）；卡片/输入框 `card #fdfbf7`
- 标题文字 `ink #201d17`（深棕）；正文 muted `#6f6a5e`
- 强调色（按钮/眉标/链接）青铜金 `#a8763a`，hover `#8b5f28`
- 深色照片区文字 `ivory #f5efe4`
- 组件 CSS 变量 `--amber/--gray/--soft-white/--wood/--line` 已补全定义到 `:root`（此前未定义会退化为继承色），并统一指向浅色体系

### 关键改动
- `src/app/globals.css`：主题 token 全部重定义 + 新增 `cream/sand/card/ink/ivory/bronze-deep`；按钮/眉标/骨架屏/tech-panel 跟随浅色
- 全站公开页 + 后台（admin 一并变为浅色 dashboard）：深黑底→暖白系、白字→深棕、白边→暖黑透明边、琥珀辉光→青铜辉光
- 首页 hero 与 CTA 两个**图片带保留深色遮罩 + 米白文字**（视觉对比），其余区域全部浅色
- `var(--soft-white)` 语义从"浅色文字"改为"浅底正文深色"，与浅色底匹配

## 执行任务（按序执行，回报表见文末）

### 任务 1 · 推送代码
```
git push
```
预期：origin/master 同步（含提交 `e40f645`）。

### 任务 2 · 清缓存构建并部署
```
rm -rf .next .open-next && npm run build:cf:static && npm run deploy
```
预期：构建成功部署（公开页继续走 Static Assets）。**若构建告警未知类名，请把完整日志贴回报表**（怀疑某个新 token 类未生成时用）。

### 任务 3 · 构建产物色值抽查
```
curl -s <ROOT>/ | grep -c "f6f2ea\|a8763a"      # 预期 ≥1（新主题 CSS 已加载）
curl -s <ROOT>/products | grep -ic "050505"       # 预期 0（旧深色底不再出现）
```
<ROOT> 按实际站点根域（`https://fnec.net`）。若旧色仍出现说明有缓存，需强刷/CDN 清缓存后重试。

### 任务 4 · 浏览器目检（中英双语，重点）
逐项检查并在回报表记录：
1. 首页：hero 白字在照片上可读、CTA 区 ivory 文字清晰；产品四卡浅色卡片、副标题留空无空行
2. 公共页：/products /products/sauna-controllers /about /news /contact /quote /accessories /resources /oem 均为浅底深字，无残留大面积黑
3. 表单：/contact /quote 输入框为白色卡片底、边框清晰、placeholder 可见
4. 页脚：浅色、文字深色可读；语言切换 EN/ZH 正常
5. 后台：/admin/login 与登录后各页为浅色且可用（按钮/表格/输入框可读）
6. **记录任何对比度不足/颜色跳变的具体页面与元素**，便于下一批微调（新主题首次上线，允许按反馈迭代）

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推送代码 | ✅ | `bdbfd93..c693b02` 推送成功(本地已含 e40f645+c693b02,无冲突,直接推送) |
| 2 构建+部署 | ✅ | build:cf:static 成功(24 个预渲染 HTML + _headers,**无类名告警**)→ 部署 v`be99ee97-ee2f-4574-bc3f-0857f2e3ca6b` |
| 3 色值抽查 | ✅ | 首页与 /products HTML 均含新色 `f6f2ea`/`a8763a`(≥1);旧深黑 `050505` 两页均 0;CDN 已传播新版 |
| 4 浏览器目检 | ✅ 见详细清单 | 中英双语 10+ 页面目检,全部浅色主题正常;后台登录页浅色,产物 CSS 确认新 token 齐备旧黑清零(登录后页面需用户凭据,未逐页登录目检) |

### 任务 4 目检明细(供下一批微调参考)
- **首页(中/EN)**:hero 照片区深色遮罩+白字可读 ✅;CTA 照片带 ivory 文字清晰 ✅;产品四卡浅色卡片+深棕字、副标题留空无空行 ✅;背景暖白/交替浅沙正常;按钮青铜金;页脚浅色深字 ✅。**无对比度问题、无残留黑块**
- **公共页** /products /about /quote /oem /news /accessories(均 EN)+ /products 中文:全浅底深字,卡片/时间线/流程块正常,无大面积黑 ✅
- **表单** /contact /quote:输入框白色卡片底、边框清晰、placeholder 可见、label 深色可读 ✅
- **语言切换**:中/EN 切换正常 ✅
- **后台** /admin/login:登录卡片浅色、输入框白底、SIGN IN 青铜金按钮 ✅;登录后各页未逐页目检(无凭据),但产物 CSS(admin 页同款 `/ _next/static/css/ff1beaa34a97d012.css`)含全部新 token(f6f2ea/efe9de/fdfbf7/a8763a/201d17 各 1 处)、旧深黑 hex(050505/0a0a0a/111111/1a1a1a)全 0 —— 后台浅色在样式层成立
- **发现 0 处对比度不足/颜色跳变**。CC 注:配色是按高端桑拿站惯例拟的近似,用户看实际效果后如需微调(底色/按钮色/深浅),可在下一批反馈

---

## 历史备注（供参考，无需执行）

- ✅ 批次45（删除 Health Mate/Samick 品牌字样 + G80F915UL→1T8051/ARM）已完成部署（v`5ed71a93`）。
- ✅ 批次44（企业 Logo 设计）已交付，不涉及网站部署。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
- 本批次为新浅色主题首次上线，如浏览器目检发现局部问题，请记录具体页面/元素，Claude Code 会按反馈出下一批微调。
