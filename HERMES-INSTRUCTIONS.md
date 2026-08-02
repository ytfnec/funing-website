# Hermes 操作指令（Claude Code 下发）

> 批次: 第十七批 · 更新: 2026-08-02 · 来源: Claude Code
> 说明: 请在项目目录 `C:\Users\xxq\axissaunas-clone` 执行，完成后写回报。

---

## 背景

本批为功能队列第 8 项（最后一项） **后台 Media 库批量操作**：
- 媒体库页每张图片新增复选框 + 顶部工具栏「Select all / N selected」+ **Delete Selected** 批量删除按钮
- 新 API `POST /api/admin/media/batch`：鉴权 + 校验（action=delete、ids 1-100、字符串长度上限），先解析 R2 keys 并**删除 R2 对象（best-effort，失败不阻断）**，再用单条 prepared statement 删除 D1 `media_library` 记录
- 批量删除前 confirm 确认；选中项琥珀高亮；批量操作中按钮转圈 disabled；单删后同步清理选中集

本批**无 schema 变更**。**这是功能队列 8 项全部完成后的收尾部署批次。**

## 任务 1：推代码（终端）

本地有 2 个未推送提交：`52074b9`（Media 批量删除）、以及本指令文件及 HANDOFF-LOG 更新。`git push` 会自动推送全部剩余未推送提交。

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

## 任务 2：清缓存 + 构建 + 部署

> ⚠️ 必须清缓存（`.next`/`.open-next`），构建前确认无残留 node 进程（`tasklist | grep node`）。本批无需 `db:deploy`。

```bash
cd C:\Users\xxq\axissaunas-clone
npm run clean
npm run build:cf
npm run deploy
```

## 任务 3：验证

### 3.1 公开路由 + admin 路由 200

```bash
for u in "/" "/products" "/news" "/contact" "/quote" "/admin/login" "/admin/media" "/sitemap.xml" "/robots.txt"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
```

预期: 全部 **HTTP 200**（`/admin/media` 未登录会 302 跳转 login，属正常；cron 环境主要确认不 500）。

### 3.2 批量 API 专项（本批核心）

```bash
# ① 未登录调用 → 应 401（鉴权生效）
curl -s -o /dev/null -w "batch-noauth -> HTTP %{http_code}\n" \
  -X POST https://fnec.net/api/admin/media/batch \
  -H "Content-Type: application/json" \
  -d '{"action":"delete","ids":["id-x"]}'

# ② 非法 action → 应 400
curl -s -o /dev/null -w "batch-bad-action -> HTTP %{http_code}\n" \
  -X POST https://fnec.net/api/admin/media/batch \
  -H "Content-Type: application/json" \
  -d '{"action":"nope","ids":["id-x"]}'

# ③ 超限 ids → 应 400
curl -s -o /dev/null -w "batch-too-many -> HTTP %{http_code}\n" \
  -X POST https://fnec.net/api/admin/media/batch \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"delete\",\"ids\":[$(node -e "console.log(Array.from({length:101},(_,i)=>'\"id-'+i+'\"').join(','))")]}"
```

预期: ① HTTP 401；② HTTP 400（`Action must be one of: delete`）；③ HTTP 400（ids 1-100）。

### 3.3 浏览器人工项（需人工，cron 环境跳过）

1. 登录 `https://fnec.net/admin/login` → **Media Library**。
2. 上传若干图片后，逐张勾选复选框（或点顶部 Select all），工具栏出现「N selected」。
3. 点 **Delete Selected**，确认弹窗后选中图片消失（D1 记录与 R2 对象均删除），列表刷新无残留。
4. 控制台 0 报错。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | 待执行 | |
| 2 构建部署 | 待执行 | |
| 3 验证 | 待执行 | |
