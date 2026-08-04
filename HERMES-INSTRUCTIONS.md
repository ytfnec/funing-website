# Hermes 操作指令（Claude Code 下发）

> 批次: 第四十三批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 部署产品详情页语言双向切换修复，推代码 + `build:cf:static` + 部署 + 验证。无 schema 变更，**不需要 db:deploy**。

---

## 背景

- batch 42 修复了中文界面被英文覆盖，但暴露**反向 bug**: 切 EN 后详情页文案不随语言切换（`useState(fallback)` 物化 t() 文案）。
- 修复（提交 `4fa006d`）: 拆分 state——`apiData` 只存 API 结构化字段；`product` 用 `useMemo` 从响应式 `fallback`（t()）+ `apiData` 派生，文案始终跟随语言切换。
- **重要**: 公开页静态化保持，**必须用 `npm run build:cf:static`**。

## 任务 1：推代码（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

预期: 推送 `4fa006d` 及前面待推送提交；`git log origin/master..HEAD --oneline` 为空。

## 任务 2：清缓存构建 + 复制 HTML + 部署（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
rm -rf .next .open-next
npm run build:cf:static
npm run deploy
```

预期: `build:cf:static` 成功；部署成功。

## 任务 3：验证（终端）

```bash
for u in "/" "/products" "/products/sauna-controllers" "/products/jacquard-drivers" "/admin/login" "/api/products" "/api/products/sauna-controllers"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
```

预期: 全路由 200。

## 任务 4：浏览器验证双向语言切换（浏览器，关键）

- **场景 A**: 中文界面（localStorage fnec-lang=zh 或浏览器中文）→ 访问 `/products` → 点产品卡片进详情页 → 详情页产品名/描述应为**中文**。
- **场景 B**: 在详情页切换 EN → 详情页产品名/描述应**变为英文**（导航/页脚也英文）。
- **场景 C**: 再从 EN 切回中文 → 详情页恢复中文。
- 确认: hero_image 主图在两种语言下都正常（D1 结构化字段不丢失）、JSON-LD/标题跟随语言。
- 记录: 三个场景下详情页 h1 产品名（中/英）。

> 本批有前端改动；**不要**运行 db:deploy。公开页静态化保持 `build:cf:static`。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | ✅ | `4fa006d` + `5f61357` 推送，origin 同步 |
| 2 构建+部署 | ✅ | build:cf:static 成功 → 部署 v`bdaded8e` |
| 3 验证 | ✅ | 7 路由全 200（/ /products /products/sauna-controllers /products/jacquard-drivers /admin/login /api/products /api/products/sauna-controllers） |
| 4 浏览器验证 | ✅ 三场景全通过 | **A 中文界面**：详情页 h1=桑拿控制系统、价格=样品价 $12/台起、JSON-LD 中文；**B 切 EN**：h1 变 "Sauna Control Systems"、价格 "From $12/unit (sample)"、导航/页脚/title 全英文；**C 切回中文**：h1 恢复桑拿控制系统、JSON-LD/标题回中文。hero_image 三种语言下均正常加载（D1 结构化字段保留），双向切换修复生效 |
