# Hermes 操作指令（Claude Code 下发）

> 批次: **第五十九批（最新）** · 更新: 2026-09-07 · 来源: Hermes
> 状态: **方案3「米褐·近黑高定」整站换色 · 待 CC 校验+补全+构建+部署**

---

## 背景：配色方案选定

用户让设计专家参考红外桑拿同行（Sunlighten / Health Mate / Symmetry Sauna）官网底色，为 fnec.net 出整套配色方案。已产出 3 份可视化对比 HTML（`D:\Work_Hermes\06_文档\` 下）：
- `fnec官网配色方案对比_2026-09.html`（4 套点缀色方案）
- `红外桑拿同行官网底色对比_2026-09.html`（3 家同行实抓）
- `fnec配色方案与同行底色综合对照_2026-09.html`（综合版）
- `fnec官网_底色可换_5套整站配色_2026-09.html`（⭐ 最终版，底色+全元素成套）

用户最终选定 **方案3「米褐·近黑高定」(Tan + Near-Black)**，参考 **Symmetry Sauna**（symmetrysauna.com，LA Rams/Dodgers 客户）——近白底 + 暖米褐背景段 + 近黑按钮/文字 + 深褐点缀。气质：高端极简、定制感，适合 OEM/ODM 与商用大客户。

**背景底色可以整体换掉**（不再锁定暖米 #f6f2ea）。

---

## 方案3 完整色值规格（照抄即可）

| 元素 | 色值 | 说明 |
|------|------|------|
| 页面底色 | `#fcfbf8` 近白 | 替换旧 `#f6f2ea` cream |
| 交替段底色 | `#e5dac9` 暖米褐 | 替换旧 `#efe9de` sand（Symmetry 同款 tan） |
| 卡片/输入框 | `#ffffff` | 替换旧 `#fdfbf7` card |
| 主按钮 | `#171717` 近黑 | 替换旧 `#2b3c3d` 深茶青 btn-bg |
| 按钮 hover | `#000000` | 替换旧 `#222e2f` btn-hover |
| 按钮文字 | `#f5efe4` ivory | 不变 |
| 眉标小字 eyebrow | `#6f5a41` 深褐 | 替换旧 `#a8763a` amber |
| 图标 | `#171717`/`#6f5a41` 近黑/深褐 | 替换旧铜色 |
| 年份/页脚次要文字 | `#4a453c` 暖灰 | 保留（对比度够） |
| 链接 hover | 深褐→近黑加深 | nav hover 用 amber 系 |
| 输入框 focus | 深褐描边 | 替换旧铜色描边 |
| 后台头像 | 底 `#171717` 字 `#f5efe4` | 替换旧铜底墨字 |
| 正文/ink | `#171717` 近黑 | 替换旧 `#201d17` |
| 分割线/边框 | `rgba(23,23,23,0.12)` | 替换旧暖黑半透明 |

**保留不变的深底区块（不在本次换色范围）**：
- hero 首屏深咖底 `#15120e`：按钮继续 ivory 实心 / 眉标亮金 `#d8b47c`（现状）
- 后台登录页深黑底 `#050505`：继续亮金点缀（已固定 `#d8a35a`，勿改回变量）
- CTA 区照片深底眉标 `#e8bb77`（现状）

---

## Hermes 已完成的初稿（commit `57b9192`，20 文件）

1. **`src/app/globals.css` 全量色板重写**：
   - `--color-black/ink` `#201d17→#171717`；`--color-cream` `#f6f2ea→#fcfbf8`；`--color-sand` `#efe9de→#e5dac9`；`--color-card` `#fdfbf7→#ffffff`
   - `--color-amber` `#a8763a→#6f5a41`（深褐点缀）；`--color-amber-light` `#c9a66b→#171717`（hover 加深）；`--color-wood/bronze-deep` → `#171717`
   - `--color-soft-white` `#2c2821→#171717`；`--color-line` → `rgba(23,23,23,0.12)`
   - `.btn-primary` `#2b3c3d→#171717`，hover `#222e2f→#000000`；`:root` 下 `--btn-bg:#171717 / --btn-hover:#000000`
   - focus-visible outline `amber→#171717`（深底按钮例外 ivory）；`.tech-panel`/`.skeleton`/卡片 hover 阴影铜色→近黑
2. **全仓 tsx 硬编码铜色半透明替换**：`rgba(168,118,58,*)→rgba(111,90,65,*)`（≈#6f5a41，所有 admin/前台浅底提示框、激活态、选中边框）
3. **`admin/login/page.tsx`**（深黑底特例）：固定亮金 `#d8a35a` + `rgba(216,163,90,*)`，不随全局变量变暗
4. **fallback 色**：`var(--amber,#a8763a)` → `var(--amber,#6f5a41)`（Header / admin layout / page 圆点）
5. **`global-error.tsx`**：`text-amber`(Tailwind 默认橙) → `text-[var(--amber)]`
6. **`layout.tsx`** `themeColor` `#f6f2ea→#fcfbf8`；**`page.tsx`** products 区渐变起点 `#f6f2ea→#fcfbf8`

---

## CC 待办（按序执行，回报表见文末）

### 任务 1 · 代码复查与补全
```bash
git log --oneline -3   # 应见 57b9192 初稿
```
逐项检查初稿是否有遗漏/误伤：
1. **全站搜索确认无旧色残留**：`rgba(168,118,58` / `#a8763a` / `#c9a66b` / `#2b3c3d` / `#f6f2ea`（深底 hero/登录/CTA 的 `#15120e`/`#050505`/`#d8b47c`/`#e8bb77`/`#d8a35a` 应保留，勿删）
2. **i18n / 后台各页**（admin/contacts、content、media、news、products 编辑页等）——初稿已批量替换提示框/激活态，检查选中卡片、徽标角标、图表等是否仍残留铜色或与近白底不协调
3. **产品图占位面板**：`.tech-panel` PCB 网格、产品卡 radial 渐变现为近黑——目检浅底上是否过淡/过重
4. **按钮体系一致性**：确认所有 CTA（Header 获取报价、hero、footer 订阅、quote 页提交等）都吃 `--btn-bg:#171717`；OEM 流程圆/报价步骤圆/筛选激活态（批次58 用的 `--btn-bg` 变量）自动变近黑——确认 OK
5. **对比度抽查**：眉标 11px `#6f5a41` 在 `#fcfbf8`/`#e5dac9` 上、年份 12px `#4a453c` 上达标（≥4.5:1）

### 任务 2 · 推送 + 清缓存构建部署
```bash
git push
rm -rf .next .open-next && npm run build:cf:static && npm run deploy
```
预期：构建成功部署。

### 任务 3 · 浏览器目检（中英双语首页 + 关键页）
1. 页面底 = 近白 `#fcfbf8`（rgb 252,251,248）；交替段 = 米褐 `#e5dac9`（rgb 229,218,201）
2. 主按钮 = 近黑 `#171717`（rgb 23,23,23），hover 纯黑；按钮字 ivory
3. 眉标小字 = 深褐 `#6f5a41`；图标/圆点 = 深褐/近黑
4. 输入框 focus = 深褐描边；链接 hover 变深
5. hero 深咖首屏：按钮 ivory、眉标亮金 `#d8b47c`（未受影响）
6. 后台 `/admin` 登录页：深黑底 + 亮金 `#d8a35a`（未受影响）
7. 后台管理界面：侧栏激活态/提示框 = 深褐系，头像 = 近黑底 ivory 字
8. footer 年份/法律链接 = 暖灰 `#4a453c`
9. 记录仍不理想项（例如某处残留琥珀/金、对比度不足、某按钮没吃到新变量）

### 任务 4 · 收尾
如目检发现问题：修复 → commit（信息含"批次59"）→ push → 重新构建部署。完成后更新本文档回报表。

---

## 执行回报（CC 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 代码复查与补全 | 待执行 | |
| 2 推送+构建部署 | 待执行 | |
| 3 浏览器目检 | 待执行 | |
| 4 收尾修复 | 待执行 | |

---

## 历史备注（供参考，无需执行）

- ✅ 批次58：logo #2257c9 + 字标烟台富宁电子 + 控件统一按钮灰，CC 已落地（提交 `004258d`，8 文件），**部署待本批一并执行**（当时留了 4 个待执行任务，若线上仍是旧版需确认 58+59 一起上线）
- ✅ 批次57：蓝牙音响 + 全站 8051/ARM，已部署 v`6484d886`。
- ✅ 批次56：桑拿控制系统文案更新。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
