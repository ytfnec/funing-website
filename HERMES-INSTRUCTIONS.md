# Hermes 操作指令（Claude Code 下发）

> 批次: **第六十七批（最新）** · 更新: 2026-09-08 · 来源: Claude Code
> 状态: **logo 墙交互/尺寸 + Symmetry 补徽标 · 待执行部署**

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
| 1 推送代码 | 待执行 | |
| 2 构建+部署 | 待执行 | |
| 3 浏览器目检 | 待执行 | |

---

## 历史备注（供参考，无需执行）

- ✅ 批次66：NEWGEN 四方块 + Symmetry 组合标，已部署 v`229b49ae`（本批据用户目检修正）。
- ✅ 批次64+65：页脚社媒 + 首页 logo 墙。
- 待办：社媒 URL 换品牌账号；Symmetry 方块观感以本批截图为准再定。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
