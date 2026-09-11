# Hermes ↔ Claude Code 协作指令

> 批次: **第七十四批（最新）** · 更新: 2026-09-11 · 来源: **Hermes**（用户文案定稿）
> 状态: **待 CC 实现** —— 官网「选择富宁」两大支柱卖点重写（6 条 + 数据带），**落点与实现方式由 CC 决定**
> ⚠️ 本批为**文案类**改动：注意三条渲染路径（列表页/首页卡片 = i18n；详情页 = API/D1 + features fallback）。详见下文待办。

---

## 第七十四批：02 品质制造 / 03 全球出口能力 卖点重写（6 条）

### 背景

1. 用户逐条确认了 02「品质制造」与 03「全球出口能力」的卖点文案，**全部数字与事实已核实**（年产量、认证、老化时长、退货记录），见文末文案全文。
2. 现站 03 卡片写「RCEP 原产地认证，出口印尼及东南亚 / 海运拼箱 LCL · 门到门 / 100% T/T」，把代工通道当主卖点。**用户定稿口径：主战场 = 日本、韩国、美国、欧洲（消费市场）；东南亚 = 产能与贴牌合作通道（成本型项目）**。
3. 现站另有偏保守/偏窄的表述需一并校正：「8051/ARM 平台已量产数千台」、FAQ「印尼是我们的重点市场」。

### 文案全文（用户定稿，不得改动措辞；中英均需落地）

#### A. 02 品质制造

**卖点 1 · 台台全检，不做抽检**
不是抽检合格，是每一台都测过才出货。
- 出货前 **100% 功能测试**，含触摸灵敏度、温度采样精度、PWM / LED 输出逐项复核
- **桑拿控制器年出货约 1 万台，仍逐台全检、不做抽检**——这个量级坚持全检，靠的是体系不是人手
- **全数 24 小时老化（Burn-in）**通电跑合，把早期失效挡在厂内，不留给客户售后
- **结果说话**：客户退货与投诉记录**近乎为零**，长期复购客户持续加单
- 出厂记录随批次留档，问题可回溯到工单

EN:
> **Every unit tested — not sampled.**
> 100% functional test before shipment (touch response, temperature sensing accuracy, PWM/LED output verified unit by unit), plus a full 24-hour burn-in run to screen out early failures before they reach your warehouse. Around 10,000 sauna controllers a year leave this line — every one tested, not sampled. The result: virtually zero returns or complaints, with repeat buyers reordering year after year.

**卖点 2 · 认证齐备，到了就能上架**
合规文件随货走，客户不用替我们补认证。
- **PSE（日本）/ KC（韩国）认证已随整机客户项目完成**——这是产品进入日韩渠道（含 COSTCO 货架）的前提
- 元器件符合 **CE / RoHS** 要求，材料合规可追溯
- 桑拿类 LED 板按 **IEC 62471 光生物安全**要求验证（客户 96 / 48 灯珠板即此项）
- 提供 **EMC 预认证**测试支持与认证文件协助准备（CE / FCC / RoHS）

EN:
> **Certification-ready, shelf-ready.**
> PSE (Japan) and KC (Korea) certification completed alongside our OEM customers' finished-unit approvals — the prerequisite for selling through Japanese and Korean channels, including Costco. CE / RoHS compliant components, IEC 62471 photobiological safety verification for LED panels, and EMC pre-compliance testing with documentation support for CE / FCC / RoHS — so your team isn't chasing paperwork for us.

**卖点 3 · 制程可控，问题不出厂**
靠流程锁质量，不靠老师傅手感。
- **来料检验（IQC）→ SMT 贴装 → 光学检查（AOI）→ 波峰焊 → 三防漆 → 终检**，道道设卡
- 烟台（山东）**ISO 认证生产基地**；同一套质量体系下，**提花机驱动卡年产约 35 万片**——工业级量产一致性与成本控制已被验证
- 三防漆防护，适应桑拿房高温高湿与纺织车间 24/7 工况

EN:
> **Process-controlled quality.**
> IQC → SMT → AOI → wave soldering → conformal coating → final QC, with a gate at every stage. From our ISO-certified Yantai facility: around 350,000 jacquard driver boards a year, on proven 8051 / ARM MCU platforms — industrial-grade consistency at volume. Conformal-coated for the heat and humidity of a sauna room and the 24/7 duty of textile mills.

#### B. 03 全球出口能力

**卖点 4 · 主战场是日韩美欧的消费市场**
不是"能出口"，是长期供货给发达市场的品牌与零售渠道。
- **韩国**：AXIS、NEWGEN（韩国本土桑拿品牌，官网在售）
- **美国 / 北美**：Health Mate、Finnmark Designs、Beem、Symmetry
- 日韩市场**与 COSTCO 渠道同步在售**，产品经终端消费者验证

EN:
> **Our main markets are the developed consumer markets — Japan, Korea, the US and Europe.**
> Our control electronics ship inside products sold by AXIS and NEWGEN in Korea, and by Health Mate, Finnmark Designs, Beem and Symmetry across North America — including lines carried in Japan/Korea through COSTCO.

**卖点 5 · 过得了最严的合规门槛**
发达市场认证最严、退货代价最高——我们按那个标准做。
- **PSE（日本）/ KC（韩国）/ CE · RoHS（欧洲）/ FCC（美国）** 全覆盖；日韩认证随整机项目完成，并已有实际在售实绩（COSTCO 渠道验证）
- 提供 **EMC 预认证**测试与认证文件协助
- 桑拿 LED 板按 **IEC 62471 光生物安全**要求验证（客户 96 / 48 灯珠板即走此项）
- 元器件合规可追溯，来料有据可查（不是"我们保证没问题"）

EN:
> **Built to clear the strictest gates.**
> PSE (Japan), KC (Korea), CE / RoHS (Europe) and FCC (US) — the Japan/Korea approvals obtained through our OEM customers' finished-unit certification, already proven in market through Costco channels. EMC pre-compliance testing and documentation support included. Our sauna LED panels are verified against IEC 62471 photobiological safety — the 96- and 48-LED boards our customers rely on for that requirement.

**卖点 6 · 高端项目接得住，交得稳**
品牌客户要的不只是便宜，是外观、一致性、能长期复购。
- **量产交付实绩（年）**：桑拿控制器约 1 万台、LED 板 3,000–5,000 台、蓝牙功放约 3,000 套；一致性经多市场品牌客户长期复购验证
- 按目的地适配：**多电压、多语言界面、品牌外观与包装、白牌成品直接可售**
- **门到门交付**：海运 + 清关衔接 + 末端派送一并安排
- 日韩近洋航线补货快、周期短；美欧**整柜 / 拼箱常态班轮**，长线交付有节奏

EN:
> **We can carry high-end projects — and keep carrying them.**
> Destination-appropriate voltage and language, your branding on the housing, packaging and manuals — white-label goods you can shelve on arrival. Annual volumes: around 10,000 sauna controllers, 3,000–5,000 LED boards and around 3,000 Bluetooth amplifier sets, with consistency proven across repeat orders. Door-to-door delivery including freight, customs handoff and last-mile, with short-haul lanes for Japan/Korea replenishment and scheduled FCL/LCL service for the US and Europe.

#### C. 短句版（画册 / 展板 / 卡片）

| 支柱 | 中文 | English |
|---|---|---|
| 02 品质 | 台台全检，不做抽检 | Every unit tested. Not sampled. |
| 02 品质 | 认证齐备，随货同行 | Certified to ship, not to chase. |
| 02 品质 | 制程设卡，问题不出厂 | Quality built in, not sorted out. |
| 03 出口 | 主战场：日韩美欧 | Japan, Korea, US & Europe — our home markets |
| 03 出口 | 门槛：过最严认证 | Cleared for the strictest markets |
| 03 出口 | 交付：门到门 | Delivered door to door |

卡片腰文（现 02/03 卡片三行可径行替换）：
- 02 品质制造 → 台台全检 · 认证随货 · 制程设卡
- 03 全球出口能力 → 日韩美欧直供 · 合规过门槛 · 门到门交付
- 02 数字版（可选）→ 35 万片量产 · 24 小时老化 · 逐台全检
- 03 数字版（可选）→ 桑拿控制器年产 1 万台 · 日韩美欧直供 · 门到门

#### D. 首页数据带（建议新增，CC 定是否做/位置/样式）

> **35 万** 片 / 年工业驱动卡 · **24h** 全数老化 · **100%** 逐台全检 · **PSE / KC / CE / FCC** 认证

### CC 待办（落点与实现由 CC 决定）

1. **定落点**：6 条如何上页——① 直接替换现 02/03 卡片三行；② 每支柱展开为 3 条子卖点（卡片内列表或独立 section）；③ 其他你认为更合适的结构。给出理由即可，Hermes 按你的方案部署目检。
2. **走全三条渲染路径**：首页/列表页卡片 = `src/lib/i18n.tsx`；详情页 = `/api/products/{slug}`（D1）+ features fallback。⚠️ 已知历史 bug：fallback 曾写死 `p.saunaControllers.spec1-4`，导致 branded-units / jacquard-drivers / accessories 详情页错显桑拿控制器卖点（已修，按 slug 映射 `SPEC_PREFIX`）——本批改动勿再引入同类写死。
3. 若需动 DB 字段，**请给出可直接执行的 D1 UPDATE 语句**（Hermes 执行并 SELECT 复核），不要只改 schema.sql 种子。
4. **英文侧**同步落地；术语统一：MCU 一律 **8051 / ARM**、LED 板安全标准 **IEC 62471**、品牌名 **Funing / funine**（不写 FUNING 全大写）。
5. **顺手校正两处现状表述**：
   - FAQ「印尼是我们的重点市场」→ 改为中性表述，如「东南亚为产能与贴牌合作通道，可稳定拼箱发运」；RCEP / Form E 的 0% 关税只针对**印尼线路**，勿写成全球免税。
   - 产品页「8051 / ARM 平台已量产数千台」→ 按真实数据表述（驱动卡年产约 35 万片 / 桑拿控制器约 1 万台）。
6. **验收**：`npx tsc --noEmit` 通过；中英双语自查；commit「批次74: …」；填写文末回报表（改动文件 / 渲染路径 / 落点决策 / 遗留问题）。

### 备注

- 对外文案相关的**内部口径与禁用表述**（如"退货率近乎为零"不得写成"0% 退货率"、70 万 vs 35 万口径、品牌名不得读成出口代理）另存 `D:\Work_Hermes\06_文档`（**勿提交进本仓库**）。CC 如需查阅可直接读该目录下 `fnec卖点文案_6条纯净版_2026-09-11.md`。

---

## 执行回报（CC 填写）

| 项 | 结果 | 说明 |
|----|------|------|
| 落点决策 | | 6 条最终落在哪些页面/组件、结构（替换 / 展开 / 新 section） |
| i18n 改动 | | zh / en 各自的 key 与文件 |
| 详情页/DB | | 是否涉及 API/D1；给出的 D1 语句 |
| 数据带 | | 做 / 不做；位置与样式 |
| FAQ 与产品页校正 | | 改动位置与前后文 |
| tsc | | 结果 |
| 遗留 | | 未做/待议项 |

## 历史备注

- 批次73（v478731cd）：每个客户 logo 加品牌官网外链（新标签 + noopener/noreferrer + hover 高亮），Hermes 代提交并部署，双语目检 6 外链全 200 可达。全站 logo 墙现状 = 单行横向滚动 + 内侧 ◀▶ 箭头 + 按品牌定高。
- 批次71-72：NEWGEN logo 换产品图彩色锁定标（四色块精确值 绿 #8EC43F / 黄橙 #FFC20E / 红橙 #F48221 / 紫 #8C5BA8），卡片高 60。
- 批次60（v9823d352）：授权品牌整机副标题 + NEWGENSAUNA / AXISSAUNA + COSTCO 卖点；含修复详情页 features fallback 写死桑拿 spec 的历史 bug。
- 批次65-70：首页 hero 下方「合作客户」logo 墙建成并打磨（6 品牌官方完整锁标、单行滚动、按品牌定高）。
- 当前配色（方案3 + 批次53/55）：页底近白 `#fcfbf8`、交替段米褐 `#e5dac9`、主按钮灰 `#2b3c3d`、logo 深蓝 `#001489`、页头字标黑体链 + font-weight 600。
