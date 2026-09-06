# Hermes 操作指令（Claude Code 下发）

> 批次: **第五十二批（最新）** · 更新: 2026-09-06 · 来源: Claude Code
> 状态: **字标弃书法字体改普通字体 · 待执行部署**

---

## 第五十二批：字标改普通字体（楷体回退）

背景：批次51的字标先后试过小篆/隶书（阿里妈妈刀隶体），用户均不满意，最终确认**放弃书法字体、改普通字体（楷）**。

CC 已落地（提交 `9e253cc`）：
- `globals.css` 删除 `@font-face "FuningSeal"` 与对应注释
- `.brand-zh` 字体链改为 `"Kaiti SC", "STKaiti", "KaiTi", "Noto Serif SC", serif`（页头/页脚“富宁电子”将按系统渲染为**楷体**，无楷体系统回退宋体/衬线）
- 删除 `public/fonts/funing-zhuan.woff2`（不再引用）
- **保留**：按钮火星橙 `#eb6127`、logo 深蓝 `#182876`、页头/页脚“富宁电子”字样

## 执行任务（按序执行，回报表见文末）

### 任务 1 · 推送代码
```
git push
```
预期：origin/master 同步（含提交 `9e253cc`，含 woff2 删除）。

### 任务 2 · 清缓存构建并部署
```
rm -rf .next .open-next && npm run build:cf:static && npm run deploy
```
预期：构建成功部署。

### 任务 3 · 产物抽查
```
curl -s <ROOT>/ | grep -c "FuningSeal"             # 预期 0（无该字体引用）
curl -sI <ROOT>/fonts/funing-zhuan.woff2 | head -1  # 预期 404（文件已删）
curl -s <ROOT>/ | grep -c "eb6127"                  # 预期 ≥1（火星橙仍在）
```
<ROOT> 为站点根域（`https://fnec.net`）。

### 任务 4 · 浏览器目检（中英双语）
1. 页头/页脚“富宁电子”不再渲染刀隶体/篆体，应为**楷体**（computed font-family 无 FuningSeal；无楷体系统则回落宋体/衬线属正常）
2. 火星橙按钮 `#eb6127`、深蓝 logo `#182876` 保持
3. 记录仍不理想项

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

- ✅ 批次51：火星橙按钮 + 深蓝 logo + 页头/页脚“富宁电子”字标；字标字体经历小篆→隶书(刀隶体)→最终用户确认弃书法字体改楷体（本批处理）。
- ✅ 批次50：换图（Axis Terra 明亮 hero/CTA）+ 科技蓝 logo + 按钮回琥珀，已部署 v`6f61bf6b`。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
