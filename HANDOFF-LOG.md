# funing-website 迁移交接日志（2026-08-02）

> 供 Claude Code 接手续作参考。本次迁移主体已完成，线上服务正常。

## 一、迁移完成状态 ✅

| 项 | 状态 |
|----|------|
| ① 推代码 | ✅ commit `b4f1867`（master，已推送 ytfnec/funing-website） |
| ② 删除 Pages 项目 | ✅ 已完成（163 deployments 清空→解绑→删除） |
| ③ Worker + Secrets | ✅ Worker `funing-website` 已建，JWT_SECRET 已设（64字符） |
| ④ 部署 | ✅ Version `8e135127`（Webpack 产物） |
| ⑤ 绑域名 | ✅ `fnec.net` 已绑（用户在 Dashboard 完成） |
| ⑥ 验证 | ✅ 全部通过（见下） |

## 二、线上验证结果（2026-08-02 实测）

**workers.dev 域名** `https://funing-website.fnecyt.workers.dev`:
- `/`、`/admin/login`、`/api/products`、`/products`、`/contact` → 全部 **HTTP 200**
- 首页标题: `Funing Electronics | Precision Electronic Control Systems | 烟台富宁电子`
- `/api/products` → **4 个产品**（D1 `funing-db` 读取正常）
- 联系表单 POST `/api/contact` → 入库成功（`contact_submissions` 表，测试记录已删除）
- 登录 API `/api/auth/login`（错误密码）→ `{"error":"Invalid credentials"}`（D1 `admin_users` + bcrypt 链路正常）

**生产域名** `https://fnec.net`:
- `/`、`/admin/login`、`/api/products` → 全部 **HTTP 200**，内容同 workers.dev
- `https://www.fnec.net` → **HTTP 000（未绑定/未生效）**，如需 www 需在 Dashboard 再绑

## 三、500 根因与修复（关键！）

**症状**: 部署后首页 500，响应体仅 `Internal Server Error`；`wrangler tail` 日志:
```
TypeError: components.ComponentMod.handler is not a function
```

**根因（最终结论）**: 不是"Pages 不运行 worker"（DOMAIN.md 旧记录有误）。
真实根因 = **Next.js 16 默认 Turbopack 构建 + OpenNext 在 Windows 上的补丁 bug**
（opennextjs-cloudflare issue #1305，症状完全一致，未修复；同类 issue #1286 证实 Webpack 可绕开）。
本地 `wrangler dev` 同样 500 → 确认是构建产物问题，非部署环境。

**修复**: `package.json` 的 `build` 脚本改为:
```json
"build": "next build --webpack"
```
强制 Webpack 替代 Turbopack。已提交 commit `b4f1867`。

**排障陷阱**（Windows 特有）:
1. `npm run deploy` 会复用 `.open-next`/`.next` 缓存，改完 build 脚本必须
   `rm -rf .next .open-next` 后重新 `npm run build:cf`，否则部署的还是旧 Turbopack 产物
2. 残留 `next dev`/`wrangler dev`/`wrangler tail` 进程会锁住 `.open-next` 导致
   构建 EPERM 或静默覆盖产物——构建前先 `tasklist | grep node` 清干净
3. `wrangler tail` 用默认 pretty 格式排障（JSON 格式日志被淹没），用完必须
   taskkill 子进程（kill 会话不杀子进程树）

## 四、部署命令

```bash
npm run build:cf   # Webpack 构建（必须先于 deploy）
npm run deploy     # 部署到 Worker funing-website
```

注意: OpenNext 1.20 的 `deploy` 不自动 build（报 "Could not find compiled Open Next config"），
必须显式先 build:cf。每次改代码重新部署时按此顺序。

## 五、资源配置

- **D1** `funing-db`（id `e34f35c7-46c0-4547-a366-ada19c09af48`）: 14 张表（含 `_cf_KV`），
  12 业务表: `admin_users, contact_submissions, content_blocks, media_library, news_article,
  newsletter_subscriptions, page_views, product_variants, products, site_content,
  site_settings, uploaded_images`。**独立资源，已随 Worker 绑定，无需重建**。
  - 测试数据: 本次验证共插 2 条 contact_submissions（id `id-e52bf6e4...`、`id-e77bd203...`），**均已删除**
- **R2** `funing-storage`: 独立资源，已绑定
- Worker 绑定: `env.DB`(D1), `env.R2`, `env.ASSETS`, `env.NODE_ENV=production`
- `wrangler.toml`: name=funing-website, main=.open-next/worker.js, compat `nodejs_compat`
  （非 v2，目前正常；若后续有兼容问题可试 `nodejs_compat_v2`）

## 六、注意事项 / 待办

> 更新: 2026-08-02（第 1、2 项已完成）

1. ✅ **www.fnec.net 已绑定**（用户 Dashboard 完成，实测 200）
2. ✅ **main 分支已清理**（默认分支改为 master，`git push origin --delete main` 成功，远程仅剩 master）
3. ✅ **DOMAIN.md 已更新**（500 根因 = Turbopack/Windows bug + webpack 修复）
4. `wrangler.toml` 无 `account_id` 字段，账号 `fnecyt@gmail.com`（OAuth token 存于
   `C:\Users\xxq\AppData\Roaming\xdg.config\.wrangler\config\default.toml`）
5. OAuth token scope 仅 `zone:read`——**DNS 记录删除/zone 编辑需 Dashboard 手动操作**，
   API 调用 zones 接口会 `Authentication error`；但 `workers/domains` 接口可用
6. OpenNext 在 Windows 上有 WARN（官方推荐 WSL 构建），当前 Webpack 方案可用但
   若遇莫名运行时不稳定，备选方案是在 WSL 里构建

> 最新部署: Version `a1e99af1`（2026-08-02，Webpack，含 Content 编辑器）

## 七、验证清单（后续每次部署可复用）

```bash
for u in "/" "/admin/login" "/api/products" "/products" "/contact"; do
  curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"
done
curl -s https://fnec.net/api/products | python -c "import json,sys;d=json.load(sys.stdin);print('products:',len(d))"
```
