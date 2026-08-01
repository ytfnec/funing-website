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

# Pages secret（注意：本项目实际部署在 Pages，不是 Workers！）
npx wrangler pages secret put JWT_SECRET --project-name funing-website

# 线上 D1 执行 SQL
npx wrangler d1 execute funing-db --file=./schema.sql --remote
npx wrangler d1 execute funing-db --remote --command "SELECT * FROM admin_users;"

# 查看 Pages 项目
npx wrangler pages project list
npx wrangler pages secret list --project-name funing-website
```

> ⚠️ 本仓库 `wrangler.toml` 是 **Workers 模式**（`main=.open-next/worker.js`），
> 与线上实际的 **Pages 部署**不一致。`wrangler secret put`（无 pages 前缀）会去找同名
> Worker 并提示创建——**不要选 Y**，用 `wrangler pages secret put` 才是正确的。
