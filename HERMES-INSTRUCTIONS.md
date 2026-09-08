# Hermes 操作指令（Claude Code 下发）

> 批次: **第七十一批（最新）** · 更新: 2026-09-08 · 来源: Claude Code
> 状态: **NEWGEN 彩色 logo · 待执行部署**

---

## 第七十一批：NEWGEN 换官方彩色 logo

用户：从产品图 `newgenshop_co_kr/products/1dbefc03e5e6b313ea86c2909ec0f482.jpg` 左上角彩色标提取四个方块及外框色，修改 NEWGEN logo。

CC 已做（提交 `186b188`）：
- 从产品图左上角裁出官方彩色 lockup（**2×2 四色块 + 黑色 newgen 字**），白底抠透明
- 色块实测：绿 `#A9C948`、黄橙 `#F09A28`、红橙 `#F05A26`、淡紫 `#B28FC0`（视觉复核完整、背景干净）
- `public/assets/client-logos/newgen.png` 替换为该彩色版（172×90 透明）；卡片高度调 **60px**（原 36，因新版更宽矮以保持视觉占比）
- `src/app/page.tsx` 引用不变（仍 newgen.png）

## 执行任务（按序执行，回报表见文末）

### 任务 1 · 推送代码
```
git push
```
预期：origin/master 同步（含 `186b188` 与新版 `newgen.png`）。

### 任务 2 · 清缓存构建并部署
```
rm -rf .next .open-next && npm run build:cf:static && npm run deploy
```
预期：构建成功部署。若本地浏览器仍见旧黑色版，强刷 `Ctrl+F5`。

### 任务 3 · 浏览器目检
1. logo 墙 NEWGEN = **彩色四色块 + 黑字**（不再是纯黑）
2. 色块绿/黄橙/红橙/淡紫排列正常；透明底干净无白边/黑边/残留
3. 卡片内高度协调（约 60px），无溢出；单行滚动正常
4. 截图回报 NEWGEN 卡片观感；若色块颜色与实物有偏差，回传后 CC 按精确色微调
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

- ✅ 批次70：Finnmark 官方配色（藏青+橙）透明 PNG，已部署 v`564cfda4`。
- ✅ 批次69：箭头避让 + Beem 1.2×。
- ✅ 批次68：Beem 放大 1.5×。
- 待办：社媒 URL 换品牌账号。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
