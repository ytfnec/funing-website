# Hermes 操作指令（Claude Code 下发）

> 批次: **第七十三批（最新）** · 更新: 2026-09-08 · 来源: Claude Code
> 状态: **客户 logo 加官网外链 · CC 沙箱故障，请 Hermes 代为提交**

---

## ⚠️ 特别说明（本轮 CC 沙箱故障）

CC 本轮修改了 `src/app/page.tsx`（客户 logo 加官网链接），**文件已落盘**，但 CC 的执行沙箱（git/tsc 运行环境）连续挂载失败，**未能本地 commit / tsc**。
请 Hermes 代为执行下面的提交与部署；提交前请顺带 `npx tsc --noEmit` 确认无类型错误（改动很小、结构已核对无误）。

## 第七十三批：每个客户 logo 加品牌官网外链（新标签打开）

用户：每个 logo 点击时新开标签跳转到该品牌官网。

CC 已改 `src/app/page.tsx`：
- `clientLogos` 数组每项新增 `href`：
  - AXIS → `https://www.axissaunas.com`
  - NEWGEN → `https://newgenshop.co.kr`
  - Health Mate → `https://healthmatesauna.com`
  - Beem → `https://beemlightsauna.com`
  - Finnmark Designs → `https://finnmarkdesigns.com`
  - Symmetry → `https://symmetrysauna.com`
- logo 卡片由 `<div>` 改为 `<a href target="_blank" rel="noopener noreferrer">`，带 `aria-label="{品牌} — official website"`；hover 加边框高亮 + 阴影

## 执行任务（Hermes，按序执行，回报表见文末）

### 任务 0 · 代为提交（CC 沙箱故障）
```
cd <repo> && npx tsc --noEmit && git add src/app/page.tsx && git commit -m "批次73: 客户logo加品牌官网外链(新标签打开)"
```
预期：tsc 通过、提交成功。若 tsc 报错请把报错贴回报表。

### 任务 1 · 推送代码
```
git push
```
预期：origin/master 同步（含批次73 + 若批次72 尚未推送也一并带上）。

### 任务 2 · 清缓存构建并部署
```
rm -rf .next .open-next && npm run build:cf:static && npm run deploy
```
预期：构建成功部署。

### 任务 3 · 浏览器目检（中英双语）
1. 首页 logo 墙：6 个 logo 卡片 hover 有高亮；**点击在新标签打开对应品牌官网**（逐个验证 URL 可达/正确）
2. 键盘可聚焦（Tab 到卡片有 focus 环）；`rel=noopener` 生效
3. 单行滚动/箭头不受影响；移动端正常
4. 记录仍不理想项（尤其若有官网域名不可达）

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 0 代提交 | 待执行 | |
| 1 推送代码 | 待执行 | |
| 2 构建+部署 | 待执行 | |
| 3 浏览器目检 | 待执行 | |

---

## 历史备注（供参考，无需执行）

- ✅ 批次72：NEWGEN 四色块精确色（`7dc055f`）——若尚未部署，本批 push 会一并带上。
- ✅ 批次71：NEWGEN 彩色标，已部署 v`7dac6bc0`。
- ✅ 批次70：Finnmark 官方配色，已部署 v`564cfda4`。
- 待办：社媒 URL 换品牌账号。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
