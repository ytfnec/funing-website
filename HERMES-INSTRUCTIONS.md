# Hermes 操作指令（Claude Code 下发）

> 批次: **第五十七批（最新）** · 更新: 2026-09-06 · 来源: Claude Code
> 状态: **文案修订：蓝牙音响 + 全站 8051/ARM · 待执行部署**

---

## 第五十七批：文案修订

用户对第 56 批文案的两点修订：
1. 桑拿控制系统描述里“蓝牙**音箱**”应为“蓝牙**音响**”
2. 其它地方的 `1T8051/ARM` 统一改为 `8051/ARM`

CC 已改 `src/lib/i18n.tsx`（提交 `a747fca`）：
- zh desc：…9色LED调色，**蓝牙音响控制**，手机APP远程操作…（原“音箱”已改）
- EN desc 同步：Bluetooth **audio** control（与卖点 Bluetooth audio 一致）
- 全站 `1T8051/ARM` → `8051/ARM`：桑拿控制器 spec1（已是）、首页 FAQ（en/zh，含“1T 8051内核”表述同步去掉 1T）、配件 acc 兼容描述、资源 datasheet 标题
- 复查：i18n 中已无 `1T8051` / `1T 8051` / `蓝牙音箱`；tsc 通过

> 若第 56 批尚未部署，本批 push 会一并带上（提交 `1e7aa45` + `a747fca`）；如已部署则仅本批修订生效。

## 执行任务（按序执行，回报表见文末）

### 任务 1 · 推送代码
```
git push
```
预期：origin/master 同步（含 `a747fca`；若未推过也含 `1e7aa45`）。

### 任务 2 · 清缓存构建并部署
```
rm -rf .next .open-next && npm run build:cf:static && npm run deploy
```
预期：构建成功部署。

### 任务 3 · 产物抽查
```
curl -s <ROOT>/products | grep -c "蓝牙音响"          # 预期 ≥1
curl -s <ROOT>/products | grep -c "1T8051\|蓝牙音箱"   # 预期 0
curl -s <ROOT>/ | grep -c "1T8051"                    # 预期 0（FAQ 也无旧型号）
```
<ROOT> 为站点根域（`https://fnec.net`）。

### 任务 4 · 浏览器目检（中英双语）
1. 产品“桑拿控制系统”描述 = “…9色LED调色，**蓝牙音响控制**，手机APP远程操作…”
2. 首页 FAQ、配件页、资源页不再出现 `1T8051/ARM`，统一 `8051/ARM`
3. 卖点四条 = 8051/ARM MCU / 按键·触摸·LCD / 9色LED+蓝牙音响 / 手机APP远程
4. 记录仍不理想项

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推送代码 | ✅ | `b079d36..df1dd61` 推送成功(**56 批文案 `1e7aa45` + 57 批修订 `a747fca` 一并推送**,56 批此前未部署) |
| 2 构建+部署 | ✅ | build:cf:static 成功(无告警)→ 部署 v`6484d886-3757-4b8b-8f00-993313c921ef` |
| 3 产物抽查 | ✅ | 旧词 `1T8051`/`蓝牙音箱` 5 页(/products /products/sauna-controllers / /resources /accessories)全 0;`蓝牙音响` 详情页 ≥1;`8051/ARM` 首页/详情/配件/资源均出现 |
| 4 浏览器目检 | ✅ 见明细 | 中英双语实测确认 |

### 任务 4 目检明细(双语)
- **桑拿控制系统详情页(zh)**:副标题"按键面板 · 触摸面板 · LCD触屏面板"✅;描述"…9色LED调色,**蓝牙音响控制**,手机APP远程操作…"(音箱→音响已修正)✅;卖点四条:8051/ARM MCU / 按键·电容触摸·LCD触摸 / 9色LED输出·蓝牙音响 / 手机APP远程控制 ✅;无 1T8051/蓝牙音箱残留
- **详情页(EN)**:KEYPAD · TOUCH PANEL · LCD TOUCH;描述含 "**Bluetooth audio** control"(非 speaker)✅;四条卖点同步
- **首页 FAQ(EN)**:答案实测 "…spans the **8051/ARM** MCU family — **8051**-compatible cores…"(1T 已去)✅
- **配件/资源页**:curl 抽查无 1T8051,含 8051/ARM ✅
- **无发现仍不理想项**

---

## 历史备注（供参考，无需执行）

- ✅ 批次56：桑拿控制系统文案更新（提交已含）。
- ✅ 批次55：富宁电子黑体 + logo #001489，已部署 v`ba00130e`。
- ✅ 批次54、53、52、51、50 均已完成。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
