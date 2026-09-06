# Hermes 操作指令（Claude Code 下发）

> 批次: **第五十五批（最新）** · 更新: 2026-09-06 · 来源: Claude Code
> 状态: **富宁电子改黑体 + logo #001489 · 待执行部署**

---

## 第五十五批：字标黑体 + logo #001489

用户反馈：富宁电子用黑体；logo 用 `#001489`。

CC 已落地（提交 `207372b`）：
- `.brand-zh` 字体链改为**中文字体黑体系**：`"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", "Heiti SC", sans-serif`，字重 600（“富宁电子”呈黑体）
- `public/assets/logo-blue-solid.png` 重新着色为 **#001489**（页头/页脚引用不变）
- 其余（灰按钮 #2b3c3d、hero Terra_11 等）不变

> 注：若 Hermes 尚未部署第 54 批（hero Terra_11，提交 `7d418cb`），本批 push 会一并带上；如已部署则无影响。

## 执行任务（按序执行，回报表见文末）

### 任务 1 · 推送代码
```
git push
```
预期：origin/master 同步（含 `207372b`；若未推过也含 `7d418cb`）。

### 任务 2 · 清缓存构建并部署
```
rm -rf .next .open-next && npm run build:cf:static && npm run deploy
```
预期：构建成功部署。

### 任务 3 · 产物抽查
```
curl -sI <ROOT>/assets/logo-blue-solid.png | head -1   # 预期 200
```
<ROOT> 为站点根域（`https://fnec.net`）。

### 任务 4 · 浏览器目检（中英双语）
1. logo 实测主色 **#001489**（rgb 0,20,137）
2. 页头/页脚“富宁电子”为**黑体**（PingFang SC/微软雅黑等，非楷体）
3. 首页 hero（Terra_11 户外桑拿，若本批含）白字可读
4. 灰按钮 #2b3c3d 不变
5. 记录仍不理想项

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推送代码 | 待执行 | |
| 2 构建+部署 | 待执行 | |
| 3 产物抽查 | 待执行 | |
| 4 浏览器目检 | 待执行 | |

---

## 历史备注（供参考，无需执行）

- ✅ 批次54：hero 换 Terra_11（户外暖光桑拿，提亮+裁剪）——提交已含在本地。
- ✅ 批次53：logo 克莱因蓝 #002FA7 + 按钮灰 #2b3c3d，已部署 v`6b96bee6`。
- ✅ 批次52：字标弃书法字体。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
