# Hermes 操作指令（Claude Code 下发）

> 批次: 第四十一批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 查询 D1 产品数据内容（供修复产品详情页语言跳变），**不改代码**。无 schema 变更。

---

## 背景

- 诊断确认: 产品详情页 `/products/<slug>` 中文界面下，`useEffect` fetch `/api/products/[slug]` 返回 **D1 数据库的英文内容**（name="Sauna Control Systems" 等），覆盖了 i18n 中文本地化 fallback → 页面变英文。
- 需要确认 D1 里 4 个产品的**实际字段值**，判断是否与 i18n fallback 重复，以决定修复方向。

## 任务 1：查询 D1 产品数据（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
npx wrangler d1 execute funing-db --remote --command "SELECT slug, name, sub_title, short_description, long_description, price_range FROM products ORDER BY sort_order ASC"
```

预期: 输出 4 个产品的字段值。记录每行内容（特别是 name/sub_title/short_description 是否为英文、long_description 是否为空）。

## 任务 2：补充查询（终端）

```bash
npx wrangler d1 execute funing-db --remote --command "SELECT slug, specifications, features, hero_image FROM products ORDER BY sort_order ASC"
```

预期: 输出规格/特性/图片字段，判断哪些字段有值、哪些为空。

## 任务 3：报告（回报表）

- 完整列出 4 个产品的关键字段值。
- 明确: name/sub_title/short_description 是否**全部是英文**？long_description/specifications/features 是否有非空值？
- 结论: 当前 D1 数据是否就是**默认英文模板**（与 i18n fallback 重复）？

> 本批纯查询，**不改代码、不部署**；**不要**运行 db:deploy。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 查询产品字段 | ✅ | 4 产品全部英文：sauna-controllers=Sauna Control Systems / Infrared · Touch Panel · LED / Embedded MCU controllers... / Sample pricing；jacquard-drivers=Jacquard Machine Drivers / Textile · Electronic Control · Driver Cards / High-speed driver cards... / Volume pricing；branded-units=Branded Sauna Units / Authorized Distributor · Health Mate · Samick / Authorized distributor of premium infrared sauna brands... / Wholesale pricing；accessories=Components & Accessories / LED Boards · Sensors · Cables · Heaters / OEM replacement parts... / Bulk pricing |
| 2 补充查询 | ✅ | long_description/specifications/features **全部 null**；hero_image 仅 sauna-controllers + branded-units 有值（media/media-*.jpg），jacquard-drivers + accessories 为 null |
| 3 报告 | ✅ | **结论：D1 数据=默认英文模板，与 i18n fallback 文案重复**。① name/sub_title/short_description/price_range **全部英文**且与 fallback 的 t() 字段一一对应（重复）；② long_description/specifications/features **无非空值**（全 null）；③ D1 唯一独有数据=hero_image（2/4 有值）。**修复方向**：详情页 API merge 时**跳过文案字段**（name/sub_title/short_description/price_range），仅用 D1 结构化字段（hero_image 等），文案统一走 t() fallback→中文界面即不再被英文覆盖 |
