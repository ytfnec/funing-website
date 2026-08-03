# Hermes 操作指令（Claude Code 下发）

> 批次: 第二十二批 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 仅推送本地待同步的文档提交，**无需构建部署**。线上状态保持 `a216d0eb`（batch 21）不变。

---

## 背景

- 1102 诊断已澄清为时间窗口现象（代码/构建无问题），线上 `a216d0eb` 稳定、全路由 200。
- 治理方案已定：**保持现状 + 边缘缓存**（不升级 Paid、不改 OpenNext 架构）。
- 本地有 **2 个未推送提交**，均为 HANDOFF-LOG 文档更新，需要同步到 origin/master：
  - `bbc97cc` — HANDOFF-LOG: record 1102 mitigation decision (option 2)
  - `245f005` — HANDOFF-LOG: correct 1102 diagnosis per Hermes

## 任务 1：推代码（终端）

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

预期: 推送 `245f005` + `bbc97cc` 两个提交；推送后 `git log origin/master..HEAD --oneline` 输出为空。

## 任务 2：线上状态确认（只读，不构建不部署）

```bash
for u in "/" "/products" "/news" "/admin/login" "/api/products"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
curl -s -D - -o /dev/null "https://fnec.net/" | grep -i "cache-control"
```

预期: 全部 **HTTP 200**；`/` 返回 `cache-control: public, s-maxage=60, stale-while-revalidate=300`。

> 本批**仅同步文档提交**，不改代码、不清缓存、不部署、不跑 db:deploy。线上版本保持 `a216d0eb`。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | 推送 `245f005` + `bbc97cc` |
| 2 线上状态 | 待执行 | 路由 200 + 缓存头确认 |
