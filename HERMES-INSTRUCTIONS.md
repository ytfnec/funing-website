# Hermes 操作指令（Claude Code 下发）

> 生成时间: 2026-08-02 · 来源: Claude Code
> 说明: 以下操作请在项目目录 `C:\Users\xxq\axissaunas-clone` 执行。
> 完成后请把每条的执行结果/日志写回本文件末尾"执行回报"区。

---

## 任务 1：推代码到远程（终端操作）

本地有 1 个未推送提交 `3e26fe7`（交接文档）。

```bash
cd C:\Users\xxq\axissaunas-clone
git push
```

预期输出: `3e26fe7..<新提交> master -> master` 或类似。

## 任务 2：重新构建并部署（让 Content 编辑器上线）

> ⚠️ **关键警告**（来自 HANDOFF-LOG.md 排障陷阱）：
> 因为构建器从 Turbopack 改成了 Webpack，**必须先清空缓存**再构建，
> 否则会复用旧的 Turbopack 产物（导致 500 复现）。
> 构建前确认没有残留的 `next dev`/`wrangler dev`/`wrangler tail` 进程。

```bash
cd C:\Users\xxq\axissaunas-clone

# 1) 清理残留进程（Windows）
tasklist | findstr node

# 2) 清空旧构建缓存（必做！）
rm -rf .next .open-next

# 3) 构建（Webpack）
npm run build:cf

# 4) 部署到 Worker funing-website
npm run deploy
```

预期: 构建成功（含 TypeScript 通过），部署输出新的 Worker version。

## 任务 3：部署后验证（终端操作）

验证线上 Content 编辑器和新代码是否生效：

```bash
# 基础页面 200
for u in "/" "/admin/login" "/api/products" "/products" "/contact" "/api/content"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done

# Content blocks API 应返回 overrides（可为空 {}）
curl -s "https://fnec.net/api/content"

# 产品数应为 4
curl -s "https://fnec.net/api/products" | head -c 200
```

预期: 所有路由 200；`/api/content` 返回 `{"overrides":{}}`；products 4 个。

## 任务 4（可选，需用户操作）：绑定 www.fnec.net

> ⚠️ 标注"需用户操作"：OAuth token 只有 `zone:read`，DNS 编辑需 Dashboard 手动。
> 请转告用户在 Cloudflare Dashboard → Worker `funing-website` → Settings → Domains
> 添加 `www.fnec.net`。

## 任务 5（可选）：清理 GitHub main 分支

> 需用户确认。仓库 `main` 分支是 Pages 时代遗留。若确认可删:
> ```bash
> git push origin --delete main
> ```

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | ✅ 完成 | `b4f1867..5540c15 master -> master` |
| 2 构建部署 | ✅ 完成 | 清理 3 个残留 tail 进程 → rm -rf 缓存 → build:cf（35页+8 API，TS 通过）→ deploy 成功，Version `a1e99af1` |
| 3 验证 | ✅ 通过 | 全部路由最终 200（含 /admin/content、/api/content）；/api/content 返回 `{"overrides":{}}`；products 4 个 |
| 4 www 绑定 | ⏸ 需用户 | OAuth 仅 zone:read，需 Dashboard → Worker → Domains 添加 www.fnec.net |
| 5 main 清理 | ⏸ 待确认 | 需用户确认后执行 `git push origin --delete main` |

> 回报时间: 2026-08-02 · Hermes Agent
> 备注: 部署后首次 curl 旧版本缓存 500 → 版本全球传播后恢复 200；308 为 trailing-slash 重定向（正常）。
