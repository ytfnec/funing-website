# Hermes 操作指令（Claude Code 下发）

> 批次: **第七十批（最新）** · 更新: 2026-09-08 · 来源: Claude Code
> 状态: **Finnmark logo 改官方配色 · 待执行部署**

---

## 第七十批：Finnmark logo 换成官方配色（藏青 + 橙）

用户：logo 墙里 Finnmark 用官方小 logo 的配色。

**方法说明**：原 `finnmark.svg` 实际是**内嵌 base64 位图的 SVG**（无矢量 path，fill 改色无效），真正的官方彩色内容在用户提供的 `fnec/finnmark-designs-logo-small.jpg`。因此采用「提取官方配色 + 抠白底转透明 PNG」。

CC 已改（提交 `e860748`）：
- `public/assets/client-logos/finnmark.png` = 官方小 logo（500×143）抠白底透明化，主色 **藏青 #103040 + 橙 #f07020**
- 删除原灰白 `finnmark.svg`；`src/app/page.tsx` Finnmark 卡片引用改 `.png`，h36/≤240px
- 视觉复核：透明底干净、藏青+橙、无白边残留

## 执行任务（按序执行，回报表见文末）

### 任务 1 · 推送代码
```
git push
```
预期：origin/master 同步（含 `e860748` 与 `finnmark.png`，删除 svg）。

### 任务 2 · 清缓存构建并部署
```
rm -rf .next .open-next && npm run build:cf:static && npm run deploy
```
预期：构建成功部署。

### 任务 3 · 浏览器目检
1. logo 墙 Finnmark 卡片显示**藏青 + 橙**双色字标（不再是灰白）
2. 白卡上透明底干净、无白边/黑边；清晰无破图
3. 与其它 logo 高度协调（约 36px）；单行滚动正常
4. 记录仍不理想项

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推送代码 | 待执行 | |
| 2 构建+部署 | 待执行 | |
| 3 浏览器目检 | 待执行 | |

---

## 历史备注（供参考，无需执行）

- ✅ 批次69：箭头避让 + Beem 1.2×，已部署 v`81cd4930`。
- ✅ 批次68：Beem 放大 1.5×。
- ✅ 批次67：logo 墙单行滚动 + Symmetry S 方块。
- 待办：社媒 URL 换品牌账号。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
