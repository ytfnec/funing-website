# Hermes 操作指令（Claude Code 下发）

> 批次: **第六十批（最新）** · 更新: 2026-09-07 · 来源: Hermes
> 状态: **✅ 授权品牌整机内容补充 + 详情页卖点bug修复 · 已部署上线 v9823d352**

---

## 第六十批：授权品牌整机内容补充

用户要求给"授权品牌整机"(branded-units)补充品牌与卖点。CC 已改（提交 `6e4f1d0`）：

- **副标题 sub**
  - 中：授权经销商 · NEWGENSAUNA · AXISSAUNA
  - EN：Authorized Distributor · NEWGENSAUNA · AXISSAUNA
- **卖点 spec1/spec2**（原空位，en/zh）
  - 中：日本·韩国 COSTCO 同步销售 / 富宁专属折扣优惠
  - EN：Available at Costco Japan & Korea / Funing exclusive discount offers
- **spec3/spec4 保留**：完整质保支持 / 门到门物流（Full warranty support / Door-to-door logistics）
- `schema.sql` branded-units 种子 `sub_title` 同步为英文新副标题

## 执行任务（按序执行，回报表见文末）

### 任务 1 · 推送代码
```
git push
```
预期：origin/master 同步（含提交 `6e4f1d0`）。

### 任务 2 · D1 数据同步（线上 DB 该行副标题，保持后台列表一致）
```
npx wrangler d1 execute funing-db --remote --command "UPDATE products SET sub_title = 'Authorized Distributor · NEWGENSAUNA · AXISSAUNA' WHERE id = 'prod-branded-units';"
```
预期：返回 Success（受影响行数 1）。

### 任务 3 · 清缓存构建并部署
```
rm -rf .next .open-next && npm run build:cf:static && npm run deploy
```
预期：构建成功部署。

### 任务 4 · 产物抽查 + 浏览器目检（中英双语）
```
curl -s <ROOT>/products | grep -c "NEWGENSAUNA"       # 预期 ≥1
curl -s <ROOT>/products | grep -c "COSTCO"            # 预期 ≥1
```
目检：
1. /products 与产品详情页“授权品牌整机”：副标题 = 授权经销商 · NEWGENSAUNA · AXISSAUNA
2. 卖点含：日本·韩国 COSTCO 同步销售 / 富宁专属折扣优惠 / 完整质保支持 / 门到门物流
3. EN 页面对应英文
4. 记录仍不理想项

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推送代码 | ✅ 完成 | `0fd04a0` 推送上线 |
| 2 D1 数据同步 | ✅ 完成 | UPDATE 受影响 2 行,SELECT 复核 `prod-branded-units.sub_title = 'Authorized Distributor · NEWGENSAUNA · AXISSAUNA'` |
| 3 构建+部署 | ✅ 完成(两次) | 首发 v`5fadb1e9`;发现详情页卖点 bug 修复后重发 v`9823d352`(当前线上) |
| 4 抽查+目检 | ✅ 通过(含 bug 修复) | `/products` NEWGENSAUNA/COSTCO ✓;详情页中英双语副标题+4卖点 ✓;<br>**发现并修复历史 bug**:产品详情页 Key Features fallback 写死 `p.saunaControllers.spec1-4`,导致 branded/jacquard/accessories 详情页错显示桑拿卖点——按 slug 映射各产品线自身 spec(commit `2ebac96`)。修复后 branded 显示 COSTCO/折扣/质保/门到门,jacquard 显示多通道驱动卡/RS-485,sauna 不受影响 |

---

## 历史备注（供参考，无需执行）

- ✅ 批次59：方案3「米褐·近黑高定」整站换色，已部署 v`2318fe02`（含批次58 logo/字标/控件灰）。
- ✅ 批次58、57、56 均已完成。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
