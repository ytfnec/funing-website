# Hermes 操作指令（Claude Code 下发）

> 批次: **第四十九批（最新）** · 更新: 2026-09-05 · 来源: 用户经 Hermes 提交（第 48 批视觉微调反馈 + 素材实测,**供 CC 参考,由 CC 统筹决策**）
> 状态: **待 CC 查看第 48 批反馈**

---

## 第四十九批（给 Claude Code · 参考建议）：第 48 批上线后用户反馈（换图 + logo 科技蓝 + 按钮回琥珀）

> **性质**：用户看第 48 批（深墨按钮/提亮 hero/浅色 CTA）后的新反馈。Hermes 已实测确认素材可用性与色值出处。**供 CC 参考,是否调整、如何调整由 CC 统筹决定**。

### 用户原话反馈（3 点）

1. **hero、CTA 图片色调不对,换新图** —— 经 Hermes 确认:现有 hero-1920.webp(1920×1317,健身房+桑拿房场景)**85% 像素为深暗色**,与新暖白主题冲突;cta-bg.webp 亦偏暗(49% 暗)。**用户明确:axissaunas.com / symmetrysauna.com 素材可直接使用(系客户,非竞品)** → 建议从本地图库挑明亮暖调桑拿房图替换。
2. **logo 用科技蓝** —— 品牌主色科技蓝 `#1E5EFF`(见设计简报 20260810:科技蓝主色 #1E5EFF/橘红 #FF5A1F/琥珀 #FFB000)。当前 logo-ink-solid.png(深墨 #201d17)需生成科技蓝版。
3. **按钮统一成原先琥珀色** —— 46 批前深色主题时代按钮为琥珀 `#d8a35a`(旧 globals.css `--color-amber: #d8a35a`);46 批改青铜金 `#a8763a`、48 批改深墨 `#201d17`。用户要求回到琥珀系。候选:`#d8a35a`(旧琥珀,偏金)或品牌琥珀 `#FFB000`(更亮),CC 可视浅底对比度取舍(浅底上琥珀按钮建议配深墨字)。

### Hermes 实测素材（本地图库,已确认可用）

**hero 候选(明亮暖调桑拿房,均 ≥5770px 原图)**:
- `D:\Work_Hermes\07_图片素材\axissaunas_com\legacy\Fla23IRorD2dndqh_Axis_Traditional.webp`(传统桑拿,明亮暖木色,对称构图适合叠字,亮度 90%)
- `D:\Work_Hermes\07_图片素材\axissaunas_com\ignite\jg5gGdgIUVyDiZn3_Axis_Infrared.webp`(单人红外,玻璃门+木座,亮度 87%)
- `D:\Work_Hermes\07_图片素材\axissaunas_com\fusion\dBt_T_JKxv57xAqT_Axis_Hybrid.webp`(红外内部,暖木色,亮度 86%)

**CTA 候选**:
- `D:\Work_Hermes\07_图片素材\symmetrysaunastudio_com\pages\aQE4vrpReVYa3xoX_Symmetry_Infrared-2.png`(1866×1082)
- `D:\Work_Hermes\07_图片素材\symmetrysaunastudio_com\pages\aRJk6LpReVYa4Ucr_IMG_90162.png`(1887×1089,桑拿房内人物,暖黄调)
- `D:\Work_Hermes\07_图片素材\symmetrysauna_com\products\aYKZFN0YXLCxVVav_Saunas-2.png`(3750×2297)

> Hermes 已视检:cand_1(cand_1.jpg 存于 axissaunas-clone 工作目录)等图明亮暖调、内容=桑拿房、适合叠白字/深字。若 CC 需要 Hermes 把选定素材裁成 hero-1920 规格(1920 宽、裁切目标 ~2.3:1)或转 webp,可让 Hermes 预加工。

### 落地范围参考(CC 取舍)
- 图片:替换 `public/assets/hero-1920.webp`(与/或新增文件名+改 page.tsx 引用);CTA 若恢复照片背景需加回图片引用(当前 48 批为浅沙底无图,是否改回照片由 CC 判断)
- logo:`public/assets/logo-ink-solid.png` → 生成 `logo-blue-solid.png`(琥珀像素换 #1E5EFF,参照 ink 版生成方式),Header/Footer 引用替换
- 按钮:globals.css 按钮 token(`--amber`/`--color-amber` 等)统一回琥珀系;hero 上 .btn-ivory 是否需要保留由 CC 判断(若按钮回琥珀,hero 照片上可能琥珀更醒目,ivory 可退场)

---

## 第四十八批：视觉优化落地（对应批次47用户反馈 4 点）

CC 已采纳 Hermes 在批次47给出的实测建议并实现，本地提交 `8d7da56`（5 文件 + 新增深墨 logo）。

### 落地内容
1. **按钮改为高对比两极色**：全局主按钮由金底改 **深墨底 `#201d17` + 米白字 `#f5efe4`**；金色降级为点缀（眉标/链接/hover）。首页深色 hero 上的主按钮改用 **米白底 `.btn-ivory`**（深字），在照片上更醒目。副按钮保持深墨描边。
2. **首页 hero 提亮**：去掉纯深棕底 + 55% 黑遮罩，改为照片 `brightness-1.15` + 顶部渐变遮罩（`rgba(16,13,10,0.50→0.26→0.40)`），不再是双重压暗。
3. **底部 CTA 区去黑**：移除近全黑照片遮罩，改为 **浅沙底 `#efe9de` + 青铜格纹** 的号召区，标题深墨、主按钮深墨、副按钮描边，与全页浅色节奏一致。
4. **字体更清晰**：正文 `font-weight 300→400`（可变 Manrope 200–800 已支持），正文/弱化文字颜色加深 `#4a453c`。
5. **logo 换深墨版**：浅底金色对比不足 → 新增 `public/assets/logo-ink-solid.png`（琥珀 logo 非透明像素换 `#201d17`），Header/Footer 引用替换。

## 执行任务（按序执行，回报表见文末）

### 任务 1 · 推送代码
```
git push
```
预期：origin/master 同步（含提交 `8d7da56` 与新文件 `logo-ink-solid.png`）。

### 任务 2 · 清缓存构建并部署
```
rm -rf .next .open-next && npm run build:cf:static && npm run deploy
```
预期：构建成功部署。**若有类名/样式告警，完整日志贴回报表**。

### 任务 3 · 产物抽查
```
curl -s <ROOT>/ | grep -c "logo-ink-solid"        # 预期 ≥1（新 logo 已引用）
curl -s <ROOT>/ | grep -ic "btn-ivory"             # 预期 ≥1（hero 米白按钮类已进产物）
```
<ROOT> 为站点根域（`https://fnec.net`）。若旧 `cta-bg.webp` 仍出现在首页 HTML/资源引用，说明缓存旧版。

### 任务 4 · 浏览器目检（中英双语，逐项回报）
1. 首页 hero：画面明显比上一版亮；白/米白 h1 与描述可读；**米白主按钮 + 描边副按钮**在照片上都醒目
2. 首页底部 CTA：浅沙底、深墨标题与**深墨主按钮**，不再是黑色大块
3. 全站按钮（/products、/contact、/quote、/admin）：主按钮深墨底+米白字清晰可辨
4. 正文/说明文字清晰度：不再发虚（400 字重 + 加深）
5. 页头/页脚 logo 为深墨版，浅底上清晰
6. 记录任何仍不理想的具体元素，便于下一批微调

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推送代码 | ✅ | `b5d3110..853ff3e` 推送成功 |
| 2 构建+部署 | ✅ | build:cf:static 成功(24 预渲染 HTML,**无样式告警**)→ 部署 v`a68cd36e-0e54-4ac1-9e52-5f28fa73130f` |
| 3 产物抽查 | ✅ | logo-ink-solid 首页引用 ≥1 且资源 200;btn-ivory ≥1;旧 cta-bg.webp = 0;旧 logo-amber-solid = 0 |
| 4 浏览器目检 | ✅ 见明细 | 中英双语首页 + 公共页 + 后台登录页,4 项反馈全部验证落地,无残余不理想项 |

### 任务 4 目检明细
- **首页 hero(中/EN)**:画面明显变亮(照片 brightness 提升,非纯黑底);白字 h1 可读 ✅;hero 主按钮实测 `bg:#f5efe4(米白)+ 字:#201d17`,副按钮米白描边 35%,照片上均醒目 ✅
- **底部 CTA(中文)**:已改浅沙底 `#efe9de`,深墨标题+深墨主按钮+描边副按钮,无黑色大块 ✅
- **全站按钮实测**:/products GET QUOTE、/contact SEND INQUIRY(圆角 pill)、/admin/login SIGN IN 均为深墨底 `#201d17` + 米白字 `#f5efe4` ✅;/products 分类筛选选中态保留金色(点缀用法,选中/未选中区分清晰,观感协调)
- **字体**:body 及正文实测 400 字重(原 300),正文色 `#4a453c`(rgb 74,69,60),不再发虚 ✅;眉标 11px 金色 700 保留为点缀
- **logo**:Header/Footer 均引用 `logo-ink-solid.png`(实测 src 确认),深墨色浅底清晰 ✅
- **未发现仍不理想的具体元素**。金色仅出现在眉标小字/链接/筛选选中态,符合"降级为点缀"设计

---

## 历史备注（供参考，无需执行）

- ✅ 批次47：用户对第46批浅色主题的 4 点反馈 + Hermes 实测对比建议（已采纳并在此批实现）。
- ✅ 批次46：整站配色改浅（Axis 暖白风）已部署 v`be99ee97`。
- ✅ 批次45：删除 Health Mate/Samick 品牌字样 + G80F915UL→1T8051/ARM 已部署 v`5ed71a93`。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
