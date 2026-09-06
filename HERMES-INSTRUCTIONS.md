# Hermes 操作指令（Claude Code 下发）

> 批次: **第五十六批（最新）** · 更新: 2026-09-06 · 来源: Claude Code
> 状态: **桑拿控制系统文案更新 · 待执行部署**

---

## 第五十六批：桑拿控制系统产品文案更新（en/zh）

用户提供“桑拿控制系统”新版文案。CC 已改 `src/lib/i18n.tsx`（提交 `1e7aa45`）：

- **副标题 sub**
  - 中：按键面板 · 触摸面板 · LCD触屏面板
  - EN：Keypad · Touch Panel · LCD Touch
- **描述 desc**
  - 中：嵌入式MCU控制器，按键/触摸操作界面，9色LED调色，蓝牙音箱控制，手机APP远程操作，全球桑拿制造商信赖的核心产品线。
  - EN：Embedded MCU controllers with keypad/touch operation, 9-color LED lighting, Bluetooth speaker control, and mobile APP remote operation. The core product line trusted by sauna manufacturers worldwide.
- **卖点 specs（4条）**
  1. 8051/ARM MCU（中英同）
  2. 中：按键/电容触摸/LCD触摸 · EN：Keypad / Capacitive Touch / LCD Touch
  3. 中：9色LED输出，蓝牙音响 · EN：9-color LED output, Bluetooth audio
  4. 中：手机APP远程控制 · EN：Mobile APP remote control

> 说明：spec1 由原“1T8051/ARM MCU”改为用户给的“8051/ARM MCU”。首页 FAQ/配件/资源里的“1T8051/ARM”字样本次不动。

## 执行任务（按序执行，回报表见文末）

### 任务 1 · 推送代码
```
git push
```
预期：origin/master 同步（含提交 `1e7aa45`）。

### 任务 2 · 清缓存构建并部署
```
rm -rf .next .open-next && npm run build:cf:static && npm run deploy
```
预期：构建成功部署。

### 任务 3 · 产物抽查
```
curl -s <ROOT>/products | grep -c "8051/ARM MCU"      # 预期 ≥1
curl -s <ROOT>/products | grep -c "6-touch\|6键\|G80F915UL\|1T8051"  # 预期 0
```
<ROOT> 为站点根域（`https://fnec.net`）。中文页默认语言为中文，可用站内语言切换验证。

### 任务 4 · 浏览器目检（中英双语）
1. /products 与产品详情页“桑拿控制系统”：
   - 副标题 = 按键面板 · 触摸面板 · LCD触屏面板（EN 对应）
   - 描述含“蓝牙音箱控制、手机APP远程操作”
   - 四条卖点 = 8051/ARM MCU / 按键·触摸·LCD / 9色LED+蓝牙音响 / 手机APP远程
2. 首页产品卡同样生效
3. 无旧文案残留（6键、1T8051）
4. 记录仍不理想项

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

- ✅ 批次55：富宁电子黑体 + logo #001489，已部署 v`ba00130e`（连同 54 批 hero Terra_11）。
- ✅ 批次54、53、52、51、50 均已完成。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
