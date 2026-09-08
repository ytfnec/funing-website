# HERMES ↔ CC 指令通道

> 批次: **第六十六批（最新）** · 更新: 2026-09-08 · 来源: Hermes（用户指示"通报 CC，你来安排"）
> 状态: **logo 墙素材勘误通报 + 正确素材已备好 · 待 CC 安排替换**

---

## 任务来源

用户验收批次65 logo 墙后指出：**NEWGEN 与 Symmetry 两个 logo 素材不完整**。
Hermes 已查明根因并找到官方正确素材（详见下），请 CC 安排替换与后续部署。

## 问题详情（Hermes 勘误结论）

### 1. NEWGEN —— 现素材缺"四方块"图形标
- 现用 `public/assets/client-logos/newgen.png`（= 官网 newgenshop.co.kr 页头 600×260）经像素连通域分析证实：**纯 "newgen" 字标**，无图形。
- 官方完整标 = **四个黑色实心方块（2×2 十字排列）+ "newgen" 字标 + 下方小字 "Newgen Home Sauna"**。
- 权威出处：日本 Costco Halo 系列《取扱説明書》PDF 首页（已 300dpi 渲染 + 像素级裁剪 + 白底抠除透明化处理）。

### 2. Symmetry —— 现素材只有 S 方块徽标，缺 "SYMMETRY" 文字
- 现用 `public/assets/client-logos/symmetry.svg`（官网现行版）**只有 S 方形徽标（50×50），无文字**。
- 官方完整组合标 = **S 方块徽标 + "SYMMETRY" 大写字标**（深灰 #40464d 系配色），已从 **Web Archive 2024 旧版官网** 找到矢量原件。

## 正确素材位置（已备好，可直接取用）

### NEWGEN（D:\Work_Hermes\07_图片素材\newgenshop_co_kr\logos\）
| 文件 | 说明 |
|---|---|
| `Newgen_logo_官方完整_四方块_透明底.png` | ⭐ 黑色透明底（700×175，白底抠除），网页浅色卡片用 |
| `Newgen_logo_官方完整_四方块_白版透明底.png` | 白色反色透明底（深底用） |
| `Newgen_logo_官方完整_四方块_说明书.png` | 白底实物原版（未抠除） |

### Symmetry（D:\Work_Hermes\07_图片素材\symmetrysauna_com\logos\）
| 文件 | 说明 |
|---|---|
| `Symmetry_logo_legacy_2024.svg` | ⭐ 官方组合标矢量（435.71×114.96，27 path：[S方块 x<97]+"SYMMETRY" 字 x97-435，fill #40464d） |
| `Symmetry_logo_footer_legacy_2024.png` | 同款页脚印刷级 PNG（8010×5757） |

**SVG 使用注意**：`Symmetry_logo_legacy_2024.svg` 为官网原件未改动，样式在 `<defs><style>` 内用类（`.cls-1` 描边 #545864 / `.cls-1,.cls-2` 填充 #40464d）——若直接内嵌进组件请保留 defs，或转 fill 内联；若放到 `/public` 静态引用则原样可用。

## CC 待办（建议顺序）

1. 替换 `public/assets/client-logos/newgen.png` → Newgen 四方块透明底版
   - 提示：完整标含下方 "Newgen Home Sauna" 小字行，卡片高度统一约束下若显字小，可裁主标区（方块+newgen）或整体等比缩小，由 CC 视视觉决定
2. 替换 `public/assets/client-logos/symmetry.svg` → Symmetry legacy 组合标（需处理 defs/style）
3. 无需改页面代码（仅换素材）；**本地目检 6 卡视觉协调性**（Newgen 横版比例、Symmetry 由方块变宽版组合标后与 Axis/HealthMate 的视觉平衡；白底清晰度）
4. 自测 OK 后提交，并写部署指令（推送 / build:cf:static / 双语目检 logo 墙）→ 交 Hermes 执行
5. 若 6 卡高度/间距需配合新比例微调（如 Symmetry 组合标较宽），一并调整

## 历史备注

- ✅ 批次64+65：页脚社媒 + 合作客户 logo 墙，已部署 v`1d251b6d`；本批为 logo 墙素材勘误。
- 其余 logo 已核对：Axis（图标+AXIS™）、Health Mate（火焰+字标）、Beem、Finnmark 均完整，无需动。
- 社媒 URL 待换品牌账号；不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
