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
| 1 推送代码 | ✅ | `b36d823..352ca9a` 推送成功(**64 批页脚社媒 `22b333f` + 65 批 logo 墙 `b325ba8` 一并上线**) |
| 2 构建+部署 | ✅ | build:cf:static 成功(无告警)→ 部署 v`1d251b6d-d5b3-4bc1-9177-5ef1f5b238c8` |
| 3 浏览器目检 | ✅ 见明细 | 中英双语确认(64+65 合并目检) |

### 任务 3 目检明细(双语,64+65 合并)
- **logo 墙(位置/结构)**:首页 hero 正下方、产品区之前 ✅;eyebrow"合作伙伴/TRUSTED PARTNERS"+ 标题"我们服务的品牌与零售渠道/Brands & retailers we work with"中英切换正确 ✅
- **6 logo 逐个实测**:AXIS(1150×330)、NEWGEN(600×260)、Health Mate(368×45)、Beem(1200×630)、Finnmark Designs(SVG 256×60)、Symmetry(SVG 50×50)——**全部 naturalWidth>0 加载成功,无破图**;卡片统一高度排列整齐,无溢出;白底上均清晰(未发现含大量白色的看不清 logo)✅
- **页脚社媒(批次 64)**:YouTube/Instagram/Facebook 三链接均带内联 SVG 图标,浅底可见 ✅(URL 暂为个人账号 maxeonshin8448/minhsuan0707/61552022292033,历史备注已记后续换品牌账号)
- **无发现仍不理想项**

---

## 历史备注（供参考，无需执行）

- ✅ 批次64：页脚社媒图标，已部署 v`？`（若未执行随本批一并上线）。
- ✅ 批次63：logo 右侧中文回“烟台富宁电子”，已部署 v`9a77f39f`。
- 待办：社媒 URL 后续换品牌账号；Symmetry 等 logo 授权已由用户确认。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
