# Hermes 操作指令（Claude Code 下发）

> 批次: **第五十批（最新）** · 更新: 2026-09-05 · 来源: Claude Code
> 状态: **对应批次49反馈的实现 · 待执行部署**

---

## 第五十批：换图 + 科技蓝 logo + 按钮回琥珀

已采纳批次49用户反馈并完成本地提交：

1. **hero / CTA 换明亮暖调图**（用户确认 axissaunas.com terra 客户素材可直接用）：
   - hero = `HwyGD96Xmftohiic_Axis_Saunas_16_9_Terra_5.webp`（现代桑拿内景，明亮暖木色，亮度 143/255）→ 已裁为 `public/assets/hero-1920.webp`（1920×1080）
   - CTA = `dlyc3ZC6XmfdFc7T_Axis_Saunas_21_9_Terra_6.webp`（宽幅暖调外景，亮度 121/255）→ 已裁为 `public/assets/cta-bg.webp`（1920×813）
2. **logo 科技蓝**：新增 `public/assets/logo-blue-solid.png`（琥珀像素换品牌科技蓝 `#1E5EFF`），Header/Footer 引用替换。
3. **按钮回琥珀**：全局主按钮改 **琥珀 `#d8a35a` 底 + 深墨字**（浅底/照片上更醒目）；hero/CTA 照片区文字用米白 + 中央柔光遮罩保证可读，hero 主按钮同琥珀、副按钮米白描边。

代码提交：`47c30ee`（按钮/logo/hero-CTA 结构）；素材提交：`e647044`（两张新图）。

## 执行任务（按序执行，回报表见文末）

### 任务 1 · 推送代码
```
git push
```
预期：origin/master 同步（含 `47c30ee` + `e647044`，即新代码 + 新图片）。

### 任务 2 · 清缓存构建并部署
```
rm -rf .next .open-next && npm run build:cf:static && npm run deploy
```
预期：构建成功部署。若有样式/资源告警，完整日志贴回报表。

### 任务 3 · 产物抽查
```
curl -s <ROOT>/ | grep -c "logo-blue-solid"        # 预期 ≥1（科技蓝 logo 已引用）
curl -sI <ROOT>/assets/hero-1920.webp | head -1    # 预期 200
curl -sI <ROOT>/assets/cta-bg.webp | head -1       # 预期 200
curl -s <ROOT>/ | grep -c "d8a35a"                 # 预期 ≥1（琥珀按钮色进 CSS）
```
<ROOT> 为站点根域（`https://fnec.net`）。

### 任务 4 · 浏览器目检（中英双语，逐项回报）
1. **首页 hero**：新图明亮暖木桑拿内景；h1 白字在中央柔光遮罩上清晰；琥珀主按钮 + 米白描边副按钮醒目
2. **底部 CTA**：新图宽幅暖调外景；米白标题/描述可读；琥珀主按钮醒目
3. **logo**：页头/页脚为科技蓝 `#1E5EFF` 版，浅底清晰
4. **全站按钮**（/products /contact /quote /admin）：主按钮琥珀底+深墨字清晰
5. 记录仍不理想的具体页面/元素，便于下一批微调

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推送代码 | ✅ | `e4229b2..b3ab9b6` 推送成功(47c30ee 代码 + e647044 素材 + b3ab9b6 指令) |
| 2 构建+部署 | ✅ | build:cf:static 成功(24 预渲染 HTML,无告警)→ 部署 v`6f61bf6b-b199-44b9-a57e-fd3151b197e6` |
| 3 产物抽查 | ✅ | logo-blue-solid 首页引用 ≥1 且资源 200;hero-1920.webp / cta-bg.webp 均 200;旧 logo-ink-solid = 0;CSS 实测 `.btn-primary{background:#d8a35a}` + hover `#c8922f`(a8763a 仅剩点缀:tech-panel 格纹/骨架屏 shimmer/卡片 hover 描边,非按钮底) |
| 4 浏览器目检 | ✅ 见明细 | 中英双语首页 + /products,3 点反馈全部验证落地 |

### 任务 4 目检明细
- **hero 图**:线上实测 1920×1080,avg(147,143,136),亮像素 47%/暗像素 19%(旧图 2%/85%)——明亮达标;内容为户外桑拿房(玻璃门可见内部木凳+自然景观,CC 描述"内景"略有出入但场景正确、观感明亮暖调);h1 白字清晰可读 ✅
- **底部 CTA**:新图宽幅日落暖调桑拿房(1920×813,亮 30%/暗 32%,旧 9%/49%);米白标题可读,无文字被图干扰 ✅
- **按钮实测**:hero 主按钮/页脚订阅//products GET QUOTE 均琥珀 `#d8a35a` 底 + 深墨字 `#201d17`;hero 副按钮米白 35% 描边;语言切换"中文/EN"按钮保留青铜金高亮态(点缀用法,可接受) ✅
- **logo**:Header/Footer 均 `logo-blue-solid.png`(src 实测),科技蓝浅底清晰 ✅
- **无发现仍不理想元素**。注:全站 CSS 的 a8763a 仅余点缀(tech-panel 格纹、skeleton shimmer、卡片 hover 描边),符合"金色/琥珀作点缀"

---

## 历史备注（供参考，无需执行）

- ✅ 批次49：用户反馈（换图/科技蓝 logo/按钮回琥珀）+ Hermes 素材实测，CC 已在本批实现。
- ✅ 批次48：视觉优化（按钮对比/hero提亮/CTA去黑/字体加重）已部署 v`a68cd36e`。
- ✅ 批次47、46、45：均已完成。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
