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
| 0 代提交 | ✅ | `npx tsc --noEmit` 通过(无类型错误)→ 代提交 `b8194d0`(page.tsx + 本指令文件) |
| 1 推送代码 | ✅ | `e86d726..b8194d0` 推送成功 |
| 2 构建+部署 | ✅ | build:cf:static 成功 → 部署 v`478731cd-c7f4-4198-9bc7-eab51a448900` |
| 3 浏览器目检 | ✅ 见明细 | 中英双语全部实测通过,6 外链全部可达 |

### 任务 3 目检明细(双语)
- **6 外链逐个实测**(`<a>` 标签 + `target="_blank"` + `rel="noopener noreferrer"` + `aria-label="{品牌} — official website"` 全部正确):
  - AXIS → https://www.axissaunas.com ✅ 200
  - NEWGEN → https://newgenshop.co.kr ✅ 200
  - Health Mate → https://healthmatesauna.com ✅ 200
  - Beem → https://beemlightsauna.com ✅ 200(跳转 www 正常)
  - Finnmark Designs → https://finnmarkdesigns.com ✅ 200
  - Symmetry → https://symmetrysauna.com ✅ 200(跳转 www 正常)
  - **6/6 全部 200 可达,无不可达域名**
- **hover 高亮**:`hover:border-var(--amber)` + hover 阴影规则已进产物 CSS(`--tw-shadow:0 8px 24px`、`border-color:var(--amber)`);`transition-all duration-200` 生效 ✅
- **键盘聚焦**:Tab 可聚焦,聚焦态实测 outline `rgb(23,23,23) solid 3px` focus 环 ✅;`rel=noopener noreferrer` 生效 ✅
- **单行滚动/箭头**:Previous/Next logos 按钮存在可用,6 卡片同高 84px,无溢出/错位/破图 ✅
- **双语**:zh 标题"合作伙伴/我们服务的品牌与零售渠道" ↔ en "TRUSTED PARTNERS/Brands & retailers we work with" 切换正确;6 aria-label 两语一致 ✅
- **截图回报**:`D:\Work_Hermes\04Hermes\批次73_回报\logo墙外链_EN版.png`
- **无发现仍不理想项**

---

## 执行回报（批次72,补记 — 回报表被 CC 批次73指令覆盖前已完成）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推送 | ✅ | `dbe4214..e86d726`(含 `7dc055f` newgen.png) |
| 2 构建+部署 | ✅ | 部署 v`5a3a829c-6717-42ec-8ce0-abbfc015513f` |
| 3 目检 | ✅ | **四色像素级实测精确命中**:绿 `(142,196,63)`=#8EC43F / 黄橙 `(255,194,14)`=#FFC20E / 红橙 `(244,130,33)`=#F48221 / 紫 `(140,91,168)`=#8C5BA8;黑字完整、透明底干净、无溢出;截图存 `D:\Work_Hermes\04Hermes\批次72_回报\` |

---

## 历史备注（供参考，无需执行）

- ✅ 批次72：NEWGEN 四色块精确色（`7dc055f`）——若尚未部署，本批 push 会一并带上。
- ✅ 批次71：NEWGEN 彩色标，已部署 v`7dac6bc0`。
- ✅ 批次70：Finnmark 官方配色，已部署 v`564cfda4`。
- 待办：社媒 URL 换品牌账号。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
