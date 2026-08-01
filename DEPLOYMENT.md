# Funing Electronics — 部署指南

本文档说明如何将本项目部署到 Cloudflare Workers + D1 + R2，以及如何在本地运行开发环境。

## 技术栈

- **框架**: Next.js 16 (App Router, Turbopack)
- **部署**: Cloudflare Workers（通过 OpenNext Cloudflare 适配器）
- **数据库**: Cloudflare D1（SQLite）
- **存储**: Cloudflare R2（媒体文件）
- **认证**: JWT（jose）+ bcrypt，`admin_session` cookie

---

## 一、本地开发

```bash
npm install
npm run dev        # http://localhost:3000
```

本地 D1 数据库初始化（使用本地模拟 D1，不连云端）：

```bash
cp .dev.vars.example .dev.vars   # 填入 JWT_SECRET 等
npm run db:init                  # 执行 schema.sql 到本地 D1
```

> 本地开发时若未配置 SMTP，联系表单的邮件通知会自动跳过（不会报错）。

---

## 二、部署前准备（一次性）

### 1. Cloudflare 资源已创建

本项目使用以下 Cloudflare 资源（已在 `wrangler.toml` 配置）：

| 资源 | 名称 | 用途 |
|------|------|------|
| Worker / Pages | `funing-website` | 站点本身 |
| D1 数据库 | `funing-db` | 主数据库 |
| R2 存储桶 | `funing-storage` | 图片等静态媒体 |

### 2. 配置 D1 数据库 schema（生产环境）

```bash
npm run db:deploy
```

### 3. 设置生产 Secret（必做）

```bash
npx wrangler secret put JWT_SECRET      # 任意长随机字符串，>=32字符
npx wrangler secret put SMTP_HOST       # 以下四项为邮件通知，可选
npx wrangler secret put SMTP_PORT
npx wrangler secret put SMTP_USER
npx wrangler secret put SMTP_PASS
# 可选
# npx wrangler secret put CONTACT_NOTIFY_TO   # 默认 info@fnec.net
```

> **重要**：生产环境未设置 `JWT_SECRET` 时，应用会启动失败（有意为之），以避免使用不安全的默认密钥。

### 4. 创建管理员账号

D1 中需要先有一条 `admin_users` 记录才能登录后台。在项目根目录执行以下命令：

```bash
# 1) 本地生成 bcrypt hash（把 <你的密码> 换成真实密码）
node -e "console.log(require('bcryptjs').hashSync('<你的密码>', 12))"
#    复制输出到下一步

# 2) 插入管理员到线上 D1
npx wrangler d1 execute funing-db --remote --command "INSERT INTO admin_users (id, email, password_hash, name, role) VALUES ('admin-1', 'admin@fnec.net', '<上一步的hash>', 'Admin', 'admin');"
```

> 也可以在 Cloudflare Dashboard → D1 → `funing-db` → **Console** 中直接执行上面第 2 步的 SQL。

---

## 三、部署到 Cloudflare

> **注意**：本项目使用 OpenNext Cloudflare 适配器，官方推荐部署到 **Cloudflare Workers**（不是 Cloudflare Pages 的 Git 集成）。`wrangler.toml` 是 Workers 模式配置（`main` + `[assets]` + D1/R2 绑定）。

### 方式：命令行部署（推荐）

```bash
npm run build:cf        # 生成 .open-next 产物（worker.js + assets）
npm run deploy          # npx @opennextjs/cloudflare deploy
```

> 首次需要登录：`npx wrangler login`
>
> 之后重复部署只需 `npm run deploy`（会自动先 build）。

### 关于 Cloudflare Pages

不要用 **Cloudflare Pages → Connect to Git** 的方式部署本项目：
- Pages 读取 `wrangler.toml` 时要求 `pages_build_output_dir`，且 `ASSETS` 是 Pages 保留绑定名，与 Workers 模式配置冲突
- OpenNext Cloudflare 不输出 Pages 需要的 `_worker.js` 结构

如果您已经在 Dashboard 里创建了名为 `funing-website` 的 **Pages** 项目，请改在 **Workers & Pages → Workers** 下创建一个同名 Worker（或直接删除 Pages 项目），再用上面的命令部署到 Worker。

---

## 四、部署后验证

- 访问首页 → 应正常渲染，中英文切换可用
- `/admin/login` → 用创建的管理员账号登录
- 提交一个联系表单 → 在 `/admin/contacts` 应能看到记录；若 SMTP 已配置，应收到通知邮件
- 无访问权限的路由应返回 404 页

---

## 五、常见问题

**Q: 部署后打开报 `JWT_SECRET is not set`**
→ 未设置生产 Secret，执行 `npx wrangler secret put JWT_SECRET`。

**Q: 表单提交返回 500**
→ 检查 D1 是否已执行 `npm run db:deploy`（表结构缺失）。

**Q: 管理员登录失败**
→ 确认 `admin_users` 表已有账号，且密码 hash 正确（bcrypt）。

**Q: 邮件通知没收到**
→ SMTP 未配置或配置错误；不影响表单入库，只影响通知。检查 wrangler secrets。
