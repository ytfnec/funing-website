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

> ⚠️ **部署模式已从 Pages 迁移到 Workers**（OpenNext 官方唯一支持的部署方式）。
> 本项目用 `wrangler.toml`（Workers 模式），部署命令：`npm run deploy`
> （内部执行 `wrangler deploy`）。**不要再使用** `wrangler pages ...` 命令。

## 六、从 Pages 迁移到 Workers（2026-08-02）

之前线上是 Pages 项目，但 OpenNext 输出的是 Workers 产物，Pages 不运行 worker，
导致动态功能（admin/联系表单/SSR）500。已决定切到 Workers：

1. **删除 Pages 项目** `funing-website`（Workers & Pages → Pages → Delete）
2. **重设 Worker Secrets**（Workers 与 Pages 的 secret 独立）：
   ```bash
   npx wrangler secret put JWT_SECRET
   ```
3. **构建并部署**：`npm run deploy`（自动 build + wrangler deploy）
4. **重绑域名** `fnec.net`：Worker → Settings → Domains → Add 域名，DNS 配 CNAME
5. **验证**：访问 `fnec.net` 首页、admin 登录、提交联系表单
