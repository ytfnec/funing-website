# Hermes 操作指令（Claude Code 下发）

> 批次: **第六十六批（最新）** · 更新: 2026-09-08 · 来源: Claude Code
> 状态: **✅ logo 墙素材勘误替换已部署上线 v229b49ae · 目检通过**

---

## 第六十六批：NEWGEN / Symmetry logo 勘误替换

对应 Hermes 批次66通报。CC 已替换并微调（提交 `da651f9`）：

1. **NEWGEN**：`public/assets/client-logos/newgen.png` → 官方完整标（**四方块图形 + newgen 字标**，黑色透明底），已裁到透明内容边界（587×175）
2. **Symmetry**：`public/assets/client-logos/symmetry.svg` → 官方 **legacy 组合标（S 方块 + “SYMMETRY” 字标）** 矢量（435.71×114.96）；页面以 `<img>` 静态引用，SVG 内部 defs/style 自含可用
3. **视觉协调**：logo 卡片 min-width 150→170px、图片 max-width 150→190px，给细长字标（HealthMate 等）更多显示宽度
4. 页面代码无需其它改动

> 说明：Symmetry legacy SVG 含 `<defs><style>` 类（fill #40464d 等）——因走 `<img src>` 静态加载可原样渲染，无需转内联。

## 执行任务（按序执行，回报表见文末）

### 任务 1 · 推送代码
```
git push
```
预期：origin/master 同步（含 `da651f9` 与替换后的 newgen.png / symmetry.svg）。

### 任务 2 · 清缓存构建并部署
```
rm -rf .next .open-next && npm run build:cf:static && npm run deploy
```
预期：构建成功部署。

### 任务 3 · 浏览器目检（中英双语）
1. 首页 logo 墙 NEWGEN 卡片 = **四方块 + newgen**（不再是纯字标）
2. Symmetry 卡片 = **S 方块 + “SYMMETRY”**（不再是单独方块）；SVG 渲染正常（若空白/未显示请回报，可能需要转内联或栅格化）
3. 6 卡整体协调：横版字标/方块标高度、间距；移动端换行整齐
4. 若某 logo 在白底上不清或过小（尤其 HealthMate 细长标），记录，CC 再按品牌单独调宽
5. 记录仍不理想项

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推送代码 | ✅ | `5f11949..fe7d7ae` 推送成功（含 `da651f9` 素材替换 + `fe7d7ae` 指令） |
| 2 构建+部署 | ✅ | build:cf:static 成功(24 个 prerendered HTML)→ 部署 v`229b49ae-4db4-4816-a25d-778e14370e60`，newgen.png 等 29 资产已上传 |
| 3 浏览器目检 | ✅ 见明细 | 中英双语确认(下方明细) |

### 任务 3 目检明细(双语)
- **产物级预检**:线上 `newgen.png` = 587×175 RGBA(四方块版)✅;线上 `symmetry.svg` = 7933B / 27 path / viewBox 435.71×114.96(legacy 组合标,defs/style 完整)✅
- **NEWGEN 卡片**:视觉确认 = **四个方块图形 + newgen 字标**(不再是纯字标)✅
- **Symmetry 卡片**:视觉确认 = **S 方块 + "SYMMETRY" 字标**(不再是单独方块),SVG 经 `<img>` 静态加载渲染正常,无空白 ✅
- **6 卡加载**:AXIS 1150×330、NEWGEN 587×175、HealthMate 368×45、Beem 1200×630、Finnmark 256×60、Symmetry 436×115 —— 全部 `naturalWidth>0` 无破图
- **桌面渲染**:卡片统一高度 44px(HealthMate 细长标按宽约束 190×23),行排列整齐居中,无溢出 ✅
- **双语**:中文眉标"合作伙伴/我们服务的品牌与零售渠道"、EN"Trusted Partners"切换正确,h1 随语言切换 ✅
- **移动端**:卡片容器 `flex flex-wrap justify-center`(flex-wrap:wrap),窄屏自动换行机制正常 ✅
- **仍可改进项(记录)**:HealthMate 原始图 8:1 超细长,卡片内显示 190×23 字偏小——CC 如需可单独为它放宽或换更高清同标素材;不阻塞本次上线

---

## 历史备注（供参考，无需执行）

- ✅ 批次66：NEWGEN 换官方四方块完整标 + Symmetry 换 legacy 组合标(S+SYMMETRY)，卡片加宽 150→170/190px，已部署 v`229b49ae`。
- ✅ 批次64+65：页脚社媒 + 首页 logo 墙，已部署 v`1d251b6d`。
- ✅ 批次63：logo 右侧中文回“烟台富宁电子”。
- 待办：社媒 URL 后续换品牌账号；HealthMate 细长标可选放宽(见本批目检记录)。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
