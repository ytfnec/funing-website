# Hermes 操作指令（Claude Code 下发）

> 批次: **第四十五批（最新）** · 更新: 2026-09-05 · 来源: Claude Code
> 状态: **网站文案修改 · 待执行部署**

---

## 第四十五批：网站文案修改（产品页 + About / 联系 / 报价）

用户需求：
1. **"授权品牌整机"（branded-units）删除 Health Mate / Samick 字样**：产品副标题与两条品牌卖点按用户要求**先留空**（页面渲染已加空值过滤，不会出现空行/空勾）。
2. **About 沿革 / 联系表单兴趣选项 / 报价页副标题**中的 Health Mate / Samick 一并清除，改为不含具体品牌的泛指说法。
3. **桑拿控制系统型号 G80F915UL → 1T8051/ARM**：全站统一替换（产品规格 / 首页 FAQ / 配件兼容说明 / 资源 datasheet 标题），en/zh 均已同步。

改动文件（已本地提交，提交 `dd3733f`）：
- `src/lib/i18n.tsx`：en/zh 双语言——品牌字样清除或留空、About/联系/报价泛指改写、型号统一替换
- `src/app/page.tsx`、`src/app/products/page.tsx`：空副标题 / 空卖点渲染保护（filter + 条件渲染）
- `schema.sql`：branded-units 种子数据 `sub_title` 清空（与前台一致）

## 执行任务（请按序执行，回报表见文末）

### 任务 1 · 推送代码
```
git push
```
预期：origin/master 同步到最新（含提交 `dd3733f`）。

### 任务 2 · 清缓存构建并部署
```
rm -rf .next .open-next && npm run build:cf:static && npm run deploy
```
预期：构建成功并部署（**必须用 `build:cf:static`**，公开页继续走 Cloudflare Static Assets；旧型号/品牌词不再进入产物）。

### 任务 3 · D1 数据同步（清除线上 DB 该行副标题里的旧品牌词，保持后台一致）
```
npx wrangler d1 execute funing-db --remote --command "UPDATE products SET sub_title = '' WHERE id = 'prod-branded-units';"
```
预期：返回 `Success`（受影响行数 1，或 0 = 此前已空，可接受）。

### 任务 4 · 验证
公开路由应全部 200（`<ROOT>` 按实际站点根域，如 `https://fnec.net`）：
`/`、`/products`、`/products/branded-units`、`/products/sauna-controllers`、`/about`、`/contact`、`/quote`、`/resources`、`/accessories`

内容验证（应全部通过）：
1. 上述页面 HTML **不含** `Health Mate`、`Samick`、`G80F915UL`
2. 产品/首页 HTML **含** `1T8051/ARM`
3. `/products/branded-units` 页面无品牌词残留

示例命令：
```
curl -s <ROOT>/products | grep -c "G80F915UL"      # 预期 0
curl -s <ROOT>/products | grep -c "1T8051/ARM"     # 预期 ≥1
curl -s <ROOT>/products/branded-units | grep -ci "health mate\|samick"   # 预期 0
```

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推送代码 | ✅ | `991934c..7a3f75b` 推送成功(先 rebase 了远程 8 月商标迭代线,代码零冲突) |
| 2 构建+部署 | ✅ | build:cf:static 成功(静态资产含 _headers)→ 部署 v`5ed71a93-8adc-4694-9088-2bacc68ce2db` |
| 3 D1 数据同步 | ✅ | `prod-branded-units` sub_title 已清空(返回 changes:2,查询确认 `sub_title=''`) |
| 4 验证 | ✅ | 9 路由全 200;旧词(Health Mate/Samick/G80F915UL)9 页 HTML 全 0;1T8051/ARM 出现在首页 FAQ+JSON-LD、/products、sauna-controllers 规格、/accessories、/resources;RSC payload 双语文案均无旧词 |
| 5 浏览器目检 | ✅ | /products 中英文:品牌整机卡片副标题留空无空行/空勾、间距正常;桑拿控制系统规格含 1T8051/ARM MCU;详情页 KEY FEATURES 正常无 G80F915UL;About 2025 里程碑泛指化。备注:branded-units 主图(media-c8deb666)LED 灯板印有 HEALTH MATE 字样,经用户确认**不处理**——实物为制造商自产代工灯板,保留 |

---

## 历史备注（供参考，无需执行）

- ✅ 功能队列 8 项已全部完成；批次 43 产品详情页双语修复已上线（v`bdaded8e`）。
- ✅ 批次 44（企业 Logo 设计）已交付到 `D:\Work_Hermes\07_图片素材\20260805_logo设计_企业logo\`，不涉及网站部署。
- 保持现有约定：不改 `wrangler.toml`、不动 DNS；除本批次任务 3 外**不要**整库 `db:deploy`。
- 除非 Claude Code 下发新批次指令，否则执行完本批次后无需继续操作。
