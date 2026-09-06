# Hermes 操作指令（Claude Code 下发）

> 批次: **第五十一批（最新）** · 更新: 2026-09-05 · 来源: Claude Code
> 状态: **火星橙按钮 + 深蓝 logo + 小篆字标 · 待执行**

---

## 第五十一批：按钮火星橙 / logo 深蓝 / 加小篆“富宁电子”

用户反馈（批次50上线后）：按钮试火星橙 `#eb6127`、logo 试深蓝 `#182876`、logo 后加黑色小篆“富宁电子”（页头+页脚）。

本地已完成（提交 `910d81b`，4 文件）：
- 按钮主色 → **火星橙 `#eb6127`**（hover `#d14f17`），文字仍深墨 ink
- logo → 重新着色为 **深蓝 `#182876`**（覆盖 `public/assets/logo-blue-solid.png`）
- 页头/页脚 logo 后加黑色“富宁电子”：CSS 已加 `@font-face "FuningSeal"`（指向 `/fonts/funing-zhuan.woff2`）与 `.brand-zh` 类，Header/Footer 已引用

**待办：小篆字体文件需由 Hermes 准备并入库。**

## 执行任务（按序执行，回报表见文末）

### 任务 1 · 下载并子集化免费小篆字体（必须先做）
1. 找一款**可商用**的免费中文小篆（篆书/小篆）字体（.ttf/.otf），确认授权允许商业网站使用；找不到时回报并给出候选，先不继续。
2. 用 fonttools 子集化，只保留“富宁电子”四个字（+通用回退字形），输出 woff2：
```
pip install fonttools brotli
pyftsubset <下载的小篆字体> --text="富宁电子" --output-file=public/fonts/funing-zhuan.woff2 --flavor=woff2
```
3. 确认文件生成、体积小（应 <100KB），并提交：
```
git add public/fonts/funing-zhuan.woff2 && git commit -m "批次51素材: 子集化小篆字体(funing-zhuan.woff2, 富宁电子)"
```

### 任务 2 · 推送代码
```
git push
```
预期：origin/master 同步（含代码提交 `910d81b` + 字体素材提交）。

### 任务 3 · 清缓存构建并部署
```
rm -rf .next .open-next && npm run build:cf:static && npm run deploy
```
预期：构建成功部署。若字体文件缺失会 404（fallback 楷体），确认字体已入库再部署。

### 任务 4 · 产物抽查 + 浏览器目检（中英双语）
```
curl -sI <ROOT>/fonts/funing-zhuan.woff2 | head -1   # 预期 200
curl -s <ROOT>/ | grep -c "eb6127"                   # 预期 ≥1（火星橙按钮 CSS）
curl -sI <ROOT>/assets/logo-blue-solid.png | head -1 # 预期 200（已换 #182876 深蓝）
```
浏览器目检：
1. 页头 logo 后出现**黑色小篆“富宁电子”**（字体生效为篆书；若仍楷体说明 woff2 未加载，回报）
2. 页脚品牌区同款“富宁电子”小篆
3. 全站主按钮为火星橙 `#eb6127` 底 + 深墨字，hover 变深
4. logo 为深蓝 `#182876`，浅底清晰
5. 记录仍不理想项

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 下载+子集化字体 | ✅ **篆书→隶书(按用户指示)** | 篆书开源无可覆盖"富宁电子"者(LxgwSeal 仅 75 字;方正/汉仪需商业授权),用户指示换隶书。选用**阿里妈妈刀隶体**(基于爨宝子碑方笔风格,GB2312 全 6763 字,官方"永久免费正版商用"+可嵌入式使用)——iconfont 官方下载,四字齐全,fonttools 子集化出 `public/fonts/funing-zhuan.woff2`(**1.6KB**,字体名 Alimama DaoLiTi)。注:CC 的 @font-face 名 FuningSeal/.brand-zh 保留(内部标识),实际渲染为隶书 |
| 2 推送代码 | ✅ | `1042f28..81a1b29`(910d81b 代码 + 字体素材) |
| 3 构建+部署 | ✅ | build:cf:static 成功(无告警)→ 部署 v`df64f5ba-36ee-4b38-92a7-83a5a7e1d1e0` |
| 4 抽查+目检 | ✅ 见明细 | 字体 200 / 火星橙 CSS / 深蓝 logo 全部实测确认 |

### 任务 4 目检明细(双语)
- **字体**:`/fonts/funing-zhuan.woff2` HTTP 200;CSS 含 `@font-face FuningSeal→url(/fonts/funing-zhuan.woff2)` + `.brand-zh{font-family:FuningSeal,Kaiti...}`;浏览器实测页头(22px)/页脚(20px)"富宁电子" computed font = **FuningSeal**(woff2 已生效,非楷体 fallback);子集文件字体名核实为 **Alimama DaoLiTi**
- **字标观感(中/EN)**:深蓝 logo 右侧黑色"富宁电子"方笔碑刻风(爨宝子碑意),与 logo 大小对齐协调
- **按钮**:hero 主按钮实测 `#eb6127`(rgb 235,97,39)火星橙
- **logo**:实测像素主色 `(24,40,118)` = **#182876 深蓝精确命中**
- **无发现仍不理想项**

---

## 历史备注（供参考，无需执行）

- ✅ 批次50：换图（Axis Terra 明亮 hero/CTA）+ 科技蓝 logo `#1E5EFF` + 按钮回琥珀，已部署 v`6f61bf6b`。
- ✅ 批次49、48、47、46、45 均已完成。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
