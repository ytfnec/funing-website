# fnec.net — 域名 & Cloudflare 配置记录

> 记录时间: 2026-08-01 · 数据来源: Cloudflare API + 公共 DNS 实测

## 一、Zone 信息

| 项 | 值 |
|----|----|
| 域名 | `fnec.net` |
| Zone ID | `4c35e72db86d1e66f99817d0bb9f426a` |
| 状态 | active |
| 账户 ID | `0a05de0ca62b2cc44fb0f7a4b758ec78` |
| NameServer | `eva.ns.cloudflare.com` / `ganz.ns.cloudflare.com` |

## 二、DNS 记录（Cloudflare 托管）

| 类型 | 名称 | 内容 | 代理 | TTL |
|------|------|------|------|-----|
| A | fnec.net | 104.21.44.167 | ✅ proxied | 300 |
| A | fnec.net | 172.67.201.95 | ✅ proxied | 300 |
| AAAA | fnec.net | 2606:4700:3033::6815:2ca7 | ✅ proxied | 300 |
| AAAA | fnec.net | 2606:4700:3030::ac43:c95f | ✅ proxied | 300 |
| MX | fnec.net | route1.mx.cloudflare.net (pref 58) | - | 300 |
| MX | fnec.net | route2.mx.cloudflare.net (pref 13) | - | 300 |
| MX | fnec.net | route3.mx.cloudflare.net (pref 99) | - | 300 |
| TXT | fnec.net | v=spf1 include:_spf.mx.cloudflare.net ~all | - | 300 |
| SOA | fnec.net | serial 2411059121 | - | 1800 |

- A/AAAA 指向 Cloudflare 任播 IP，域名走 CF 代理（橙色云）
- MX 走 **Cloudflare Email Routing**（route*.mx.cloudflare.net），邮件由 CF 接管
- `www.fnec.net` 实测同样解析到 CF 代理 IP（无独立 CNAME 记录，由 zone 通配/页面规则覆盖）

## 三、Pages 项目绑定

| 项 | 值 |
|----|----|
| Pages 项目名 | `funing-website` |
| 默认域名 | `funing-website.pages.dev` |
| 自定义域名 | `fnec.net`（status=active） |
| Git 源 | GitHub `ytfnec/funing-website`（repo_id 1275701851） |
| production_branch | **main** ⚠️ |
| Preview 设置 | 所有分支（preview_branch_includes=["*"]） |

> ⚠️ **注意**：Pages 的 production_branch 配置为 `main`，但本地仓库推的是 `master` 分支。
> 因此 GitHub push 只触发 **preview** 部署（a0e98863.xxx.pages.dev 等），**生产分支从未自动更新**。
> 若要 CI 自动部署到 `fnec.net`，需要：把 Pages 的 production_branch 改为 `master`，
> 或把本地默认分支改名为 `main`。

## 四、生产环境配置（Pages production）

- **Secrets**: `ADMIN_PASSWORD`、`JWT_SECRET`（已上传，Value Encrypted）
- **compatibility_date**: 2025-04-01，flags: `nodejs_compat`
- D1: `funing-db`（id `e34f35c7-46c0-4547-a366-ada19c09af48`），已建 12 张表
- R2: `funing-storage`

## 五、常用命令

```bash
# 登录
npx wrangler login

# Worker secret（项目已部署到 Workers，不是 Pages！）
npx wrangler secret put JWT_SECRET

# 线上 D1 执行 SQL
npx wrangler d1 execute funing-db --file=./schema.sql --remote
npx wrangler d1 execute funing-db --remote --command "SELECT * FROM admin_users;"
```

> ✅ **部署模式：Workers**（2026-08-02 已从 Pages 迁移）。本项目用 `wrangler.toml`
> （Workers 模式），部署命令见下节。**不要再使用** `wrangler pages ...` 命令。

## 六、从 Pages 迁移到 Workers（2026-08-02）

之前线上是 Pages 项目，首页 500。**最初误判**为"Pages 不运行 worker"，实际根因是
**Next.js 16 Turbopack 构建 + OpenNext 在 Windows 上的补丁 bug**（opennextjs-cloudflare
issue #1305，症状 `ComponentMod.handler is not a function`；issue #1286 证实 Webpack 可绕开）。

**真正的修复**：`build` 脚本用 Webpack 替代 Turbopack：
```json
"build": "next build --webpack"
```

已完成的迁移步骤：
1. **删除 Pages 项目** `funing-website`（已删）
2. **Worker `funing-website`** 已创建，`JWT_SECRET` 已设（64字符）
3. **部署**：`npm run build:cf && npm run deploy`（Webpack 产物，Version `8e135127`）
4. **绑域名** `fnec.net`：已完成（HTTP 200）
5. **验证**：首页/admin/API/联系表单全部通过

**后续部署命令**（每次改代码）：
```bash
npm run build:cf   # 必须先 build（OpenNext 1.20 的 deploy 不自动 build）
npm run deploy
```
> Windows 排障陷阱：改 build 脚本后必须 `rm -rf .next .open-next` 再重建，
> 否则复用旧 Turbopack 产物；构建前清理残留 `next dev`/`wrangler dev` 进程避免锁文件。
