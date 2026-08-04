# Hermes 操作指令（Claude Code 下发）

> 批次: 第四十批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: **诊断** 产品中心中文界面点获取报价进入英文界面的问题。本批**不改代码**，仅浏览器复现并报告。无 schema 变更。

---

## 背景

- 用户反馈: 产品中心（/products）中文界面下，点"获取报价"进入 /quote 变成英文界面。
- 已排查: quote 页静态 HTML 是中文；LanguageProvider 用 `useState('zh')` + `useEffect` 挂载后读 `localStorage.fnec-lang`，无则用 `navigator.language` 检测。
- 需要浏览器复现确认触发条件。

## 任务 1：复现并收集诊断信息（浏览器）

> 用浏览器自动化（如 Playwright/Puppeteer）执行以下步骤，**每一步记录结果**：

```javascript
// 诊断脚本伪代码，请在浏览器环境执行并记录输出
// 1. 打开产品中心
// 记录 navigator.language, localStorage.getItem('fnec-lang')
const navLang = navigator.language;
const saved = localStorage.getItem('fnec-lang');
console.log('navigator.language =', navLang);
console.log('localStorage fnec-lang =', saved);

// 2. 访问 https://fnec.net/products，等待加载完成（hydration）
// 记录页面 h1 文本（判断语言）：zh => '产品中心...'，en => 'Products...'
// 记录 document.documentElement.lang
console.log('products page html lang =', document.documentElement.lang);
console.log('products h1 =', document.querySelector('h1')?.textContent?.slice(0, 30));

// 3. 点击"获取报价"按钮（btn-primary 链接到 /quote）
// 记录点击后 URL、是否整页刷新（performance.getEntriesByType('navigation')[0].type）
// 记录 quote 页 h1/step 标题文本和 html lang
// 等 2 秒让 hydration 完成后再记录一次
```

**需要记录的关键信息**:
- `navigator.language`（浏览器语言）
- `localStorage.getItem('fnec-lang')` 初始值
- 产品中心 h1 文本（中文还是英文）
- 产品中心 `document.documentElement.lang`
- 点击"获取报价"后: URL 是否变为 `/quote`？是否整页刷新（navigation type）？
- quote 页初始 h1 文本 + 2 秒后 h1 文本（是否 hydration 后变化）
- quote 页 `document.documentElement.lang`

## 任务 2：对照测试（浏览器）

- **场景 A**: 先把 `localStorage.setItem('fnec-lang','zh')` 再访问 /products → 点获取报价 → quote 页语言？
- **场景 B**: 清空 localStorage（`localStorage.removeItem('fnec-lang')`）再访问 /products → 点获取报价 → quote 页语言？
- 报告两个场景的 quote 页语言是否不同。

## 任务 3：报告（回报表）

- 完整报告两个场景的行为差异，明确指出:
  1. 是**客户端导航**还是**整页刷新**触发？
  2. quote 页显示英文的**确切触发条件**（localStorage 为空？navigator 英文？）
  3. 产品中心当时是否真的是中文（还是静态 HTML 残留）？

> 本批纯诊断，**不改代码、不部署**；**不要**运行 db:deploy。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 复现诊断 | ✅ | 基线(zh-CN浏览器+无localStorage)：/products 中文(h1=电子控制解决方案, html lang=zh-CN)；点「获取报价」→ URL=/quote、**整页导航**(navType=navigate，链接为普通 `<a href="/quote">` 非 Next Link)；quote 初始及 2s 后均中文(h1=您对什么感兴趣？)——**当前环境无法复现用户场景**；quote/products 静态 HTML 均中文 SSR |
| 2 对照测试 | ✅ | **场景A**(localStorage='zh')：products 中文→quote 中文 ✅；**场景B**(清空)：products 中文→quote 中文 ✅；**场景C**(localStorage='en' 模拟 en 检测结果)：products **全英文**(ELECTRONIC CONTROL SOLUTIONS)→quote **英文**("What Are You Interested In?") ✅——三场景下两页语言**永远一致**（同一 LanguageProvider 全局状态） |
| 3 报告 | ✅ | **根因确认（用户补充复现信息后重查）**：5 个「获取报价」中 ① 页首按钮→`/quote`(t() 表单页，中文正常)；②③④⑤ 产品卡片→**`/products/<slug>` 产品详情页**（非报价页！）。详情页='use client'：初始渲染 t() 中文 fallback→useEffect fetch `/api/products/<slug>`→**D1 数据库内容全英文**（name="Sauna Control Systems" 等）→setProduct 覆盖→页面变英文。**「先中文后转英文」= fallback→API 覆盖时序**（浏览器实测：h1 中文→2.5s 后英文）；**「直接英文」= API 缓存命中/响应快**，中文瞬间不可感知。与浏览器语言/localStorage/Provider 无关。修复方向：① D1 加 zh 字段按语言返回（推荐）；② 文案全走 t() 仅 API 供结构化数据；③ 最小改动=API merge 保留 fallback 文案字段 |
