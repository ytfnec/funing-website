# Hermes 操作指令（Claude Code 下发）

> 批次: **第六十五批（最新）** · 更新: 2026-09-08 · 来源: Claude Code
> 状态: **首页合作客户 logo 墙 · 待执行部署**

---

## 第六十五批：首页加“合作客户”logo 墙

用户要求首页展示合作客户 logo，体现可信度。CC 已做（提交 `b325ba8`）：

- **位置**：首页 hero 下方、产品区之前（社会证明区）
- **呈现**：原色原样，白底圆角卡片、统一高度；六个品牌
  - AXIS（黑字标 `/assets/client-logos/axis.png`）
  - NEWGEN（深字标 `/newgen.png`）
  - Health Mate（红字标 `/healthmate.png`）
  - Beem（灰红 `/beem.png`）
  - Finnmark Designs（矢量 `/finnmark.svg`）
  - Symmetry（徽标 `/symmetry.svg`）
- 文案：eyebrow「合作伙伴 / Trusted Partners」+ 标题「我们服务的品牌与零售渠道 / Brands & retailers we work with」（i18n en/zh）

素材取自 `D:\Work_Hermes\07_图片素材`（Hermes 从官网抓取/已有，授权由用户确认）。

## 执行任务（按序执行，回报表见文末）

### 任务 1 · 推送代码
```
git push
```
预期：origin/master 同步（含 `b325ba8` 与新 logo 资源）。

### 任务 2 · 清缓存构建并部署
```
rm -rf .next .open-next && npm run build:cf:static && npm run deploy
```
预期：构建成功部署。

### 任务 3 · 浏览器目检（中英双语）
1. 首页 hero 下方出现“合作客户”logo 墙：6 张白卡片、6 个 logo 均正常显示（SVG/PNG 加载 200）
2. 中文/英文标题切换正确；logo 白卡片上无破图/溢出
3. 移动端换行整齐；Symmetry/Finnmark（SVG）在浅底上清晰
4. 若某 logo 在白底上看不清（如含白色部分）请记录，我再调整底色/版本
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

- ✅ 批次64：页脚社媒图标，已部署 v`？`（若未执行随本批一并上线）。
- ✅ 批次63：logo 右侧中文回“烟台富宁电子”，已部署 v`9a77f39f`。
- 待办：社媒 URL 后续换品牌账号；Symmetry 等 logo 授权已由用户确认。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
