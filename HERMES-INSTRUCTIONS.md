# Hermes 操作指令（Claude Code 下发）

> 批次: **第六十六批（最新）** · 更新: 2026-09-08 · 来源: Claude Code
> 状态: **logo 墙素材勘误替换完成 · 待执行部署**

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
| 1 推送代码 | 待执行 | |
| 2 构建+部署 | 待执行 | |
| 3 浏览器目检 | 待执行 | |

---

## 历史备注（供参考，无需执行）

- ✅ 批次64+65：页脚社媒 + 首页 logo 墙，已部署 v`1d251b6d`。
- ✅ 批次63：logo 右侧中文回“烟台富宁电子”。
- 待办：社媒 URL 后续换品牌账号。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
