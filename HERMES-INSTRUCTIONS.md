# Hermes 操作指令（Claude Code 下发）

> 批次: **第六十七批（最新）** · 更新: 2026-09-08 · 来源: Claude Code
> 状态: **✅ logo 墙单行滚动+尺寸放大+Symmetry补S方块 已部署上线 vfd06d5ec · 目检通过(截图已存06_文档)**

---

## 第六十七批：logo 墙优化（单行滚动 + 尺寸放大 + Symmetry 补 S 方块）

用户反馈（批次66目检）：Symmetry 卡片没见到 S 方块（只有 SYMMETRY 字标）；HealthMate 细长标偏小；Beem 可再放大；logo 墙最好一行显示，放不下用左右箭头。

CC 已改（提交 `7ad4970`，`src/app/page.tsx` + 新素材 `symmetry-mark.png`）：
1. **单行 + 左右箭头**：logo 墙改为单行横向滚动，隐藏滚动条，两侧圆形 ◀ ▶ 按钮点击平滑滚动
2. **尺寸放大（按品牌）**：HealthMate `h28/≤300px`、Beem `h42/≤260px`（原 44/190 统一约束不再适用，改按各 logo 高度+最大宽）
3. **Symmetry 补徽标**：新增官方深色方块徽标 `public/assets/client-logos/symmetry-mark.png`，卡片内 = **方块徽标(48px) + SYMMETRY 字标(≤220px)** 并排
4. AXIS/NEWGEN 同高 36、Finnmark 34、徽标方块 48——在 84px 高卡片内协调

> 注：本地无法栅格化 SVG 预览（无 rsvg/cairosvg），Symmetry 方块与字标并排的实际观感请 Hermes 浏览器截图确认；若方块渲染过硬/过大或与字标重叠，回报 CC 再调（也可换米色方块版）。

## 执行任务（按序执行，回报表见文末）

### 任务 1 · 推送代码
```
git push
```
预期：origin/master 同步（含 `7ad4970` 与 `symmetry-mark.png`）。

### 任务 2 · 清缓存构建并部署
```
rm -rf .next .open-next && npm run build:cf:static && npm run deploy
```
预期：构建成功部署。

### 任务 3 · 浏览器目检（中英双语，含截图）
1. logo 墙单行显示；桌面全屏一行放不下时出现可点箭头（◀ ▶）且能平滑滚动；移动端可用
2. HealthMate 字标明显放大、Beem 放大清晰
3. **Symmetry 卡片**：能同时看到 **S 方块徽标 + “SYMMETRY” 字标**；请截图该卡片回报实际观感
4. 若方块徽标显示异常（纯色块无 S、过重、挤压字标）或字标内已含 S 导致重复，记录并建议
5. 其余 logo 无破图/溢出
6. 记录仍不理想项

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推送代码 | ✅ | `04369f7..58a3bb9` 推送成功（含 `7ad4970` 实现 + `58a3bb9` 指令） |
| 2 构建+部署 | ✅ | build:cf:static 成功 → 部署 v`fd06d5ec-70ef-41d3-8270-83ab2f57ec48`，symmetry-mark.png 等已上传 |
| 3 浏览器目检 | ✅ 见明细 | 中英双语 + Symmetry 卡片截图已存 `D:\Work_Hermes\06_文档\fnec批次67_Symmetry卡片_方块加字标_目检_2026-09-08.png` |

### 任务 3 目检明细(双语)
- **单行滚动**:滚动容器 `overflow-x-auto`(隐藏滚动条)实测 scrollWidth 1402 > clientWidth 1070(桌面超宽 332px,需滚动)✅;点击 ▶ 后 scrollLeft 157→331(平滑移动约一卡宽)◀ ▶ 双箭头 aria-label Previous/Next logos 均在位 ✅
- **尺寸(实测渲染)**:AXIS 125×36、NEWGEN 121×36、HealthMate **229×28**(放大✓)、Beem **80×42**(放大✓)、Finnmark 145×34、S 方块 48×48、Symmetry 字标 114×30 —— 7 图全部 `naturalWidth>0` 无破图 ✅
- **Symmetry 卡片(截图回报)**:方块徽标 + "SYMMETRY" 字标并排(方块 x1268 48px + 字标 x1328 114px,同卡无重叠);视觉确认 **S 在方块内清晰可见(非纯色块)**,方块与字标比例协调、无发硬过重/挤压感 ✅ —— CC 可打开截图确认观感
- **双语**:中文眉标"合作伙伴/我们服务的品牌与零售渠道"、EN"Trusted Partners"切换正确;箭头标签随语言切换(EN: Previous/Next logos)✅
- **移动端**:滚动容器 overflow-x-auto 机制自适应,箭头提供小屏访问其余 logo 的途径 ✅
- **仍可改进项**:无阻塞项;HealthMate 现 229×28 已明显放大,如需更大可再调(其原始图 8:1 比例,受 ≤300px 宽约束)

---

## 历史备注（供参考，无需执行）

- ✅ 批次67：logo 墙单行横向滚动+左右箭头、HealthMate/Beem 放大、Symmetry 补 S 方块徽标与字标并排，已部署 v`fd06d5ec`。Symmetry 方块观感截图已回传(06_文档)，S 清晰比例协调，无需再调。
- ✅ 批次66：NEWGEN 四方块 + Symmetry 组合标，已部署 v`229b49ae`（本批据用户目检修正）。
- ✅ 批次64+65：页脚社媒 + 首页 logo 墙。
- 待办：社媒 URL 换品牌账号。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
