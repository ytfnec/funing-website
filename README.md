# funing-website
fnec网站源代码Cloudflare
*******funing-website-source *******

编辑所需软件：
用途	               推荐软件
代码编辑器	VS Code（免费，首选）
运行环境	              Node.js 18+ + Bun
包管理	              npm / yarn / bun
* 核心文件说明：
- src/lib/i18n.ts — 中英文翻译文件，修改文字内容在这里
- src/components/sections/ — 7个页面板块组件（Header、Hero、About、Products、Capabilities、Quality、News、Contact、Footer）
- src/context/LanguageContext.tsx — 语言切换逻辑
- src/app/page.tsx — 页面主入口
- src/app/globals.css — 全局样式和主题色

* 最简单的修改方式：只需打开 i18n.ts，修改中文/英文文本即可更新网站内容，无需改动任何组件代码。
* 本地运行命令：

npm install
npm run dev

然后浏览器打开 http://localhost:3000 即可预览。



*********funing-website-source v2*********

相比上一版新增内容：
- src/components/admin/AdminPanel.tsx — 管理后台组件
- src/context/ContentContext.tsx — 动态内容上下文
- src/app/api/admin/ — 管理后台API（登录、内容、图片、新闻）
- src/app/api/site/content/ — 前端内容读取API
- prisma/schema.prisma — 数据库Schema（新增SiteContent、UploadedImage、NewsArticle表）
- db/custom.db — SQLite数据库（含已导入的所有内容）
- scripts/seed-db.ts — 数据库初始化脚本
本地运行步骤：

npm install
npx prisma db push
bun run scripts/seed-db.ts
npm run dev

******Cloudflare 版本已准备好！代码已全部改造完成。********

** 新增文件说明：
- wrangler.toml — Cloudflare 配置
- open-next.config.ts — Next.js 适配 Cloudflare
- cloudflare/schema.sql — D1 数据库建表
- cloudflare/seed.sql — 数据库初始内容（121条中文+129条英文+3条新闻）
- src/lib/cloudflare.ts — Cloudflare D1 数据库工具
API 路由已全部改造为双模式运行（本地用 SQLite/Prisma，线上用 Cloudflare D1），无需手动切换。

**完整部署教程（请收藏，一步步来）：

**第一步：创建 D1 数据库
1. 打开 https://dash.cloudflare.com → 登录
2. 左侧菜单 → Workers & Pages → D1 SQL Database
3. 点击 Create database
4. 数据库名填：funing-db → 点 Create

**第二步：初始化数据库
1. 点击刚创建的数据库
2. 点 Console标签
3. 把 cloudflare/schema.sql 的内容复制粘贴进去 → 点 Execute
4. 再把 cloudflare/seed.sql 的内容复制粘贴进去 → 点 Execute

**第三步：记录 Database ID
1. 在数据库详情页复制 Database ID（类似 xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx）
2. 稍后要用

**第四步：上传代码到 GitHub
1. 解压 zip → 把所有文件上传到 GitHub 仓库

**第五步：在 Cloudflare Pages 创建项目
1. 左侧 → Workers & Pages → Create → Pages → Connect to Git
2. 连接 GitHub → 选择仓库
3. 构建设置：
  - Build command: npx @opennextjs/cloudflare build
  - Build output directory: .open-next
4.  先不要点部署，需要先绑定 D1

**第六步：绑定 D1 数据库（关键！）
1. 项目创建后，进入 Settings → Functions → D1 database bindings
2. 点 Add binding
3. Variable name 填：DB
4. 选择刚才创建的 funing-db 数据库
5. 点 Save

**第七步：重新部署
1. 回到 Deployments 页面
2. 点 Retry deployment 或推送新的 commit 触发部署


以下是快速提醒，按顺序操作即可：
**第一步：上传代码到 GitHub
1. 打开 [github.com](https://github.com)，登录或注册
2. 点击 "New repository"，仓库名填 funing-website，选 Private
3. 点击 "Create repository"**
4. 然后在电脑上打开命令行（Windows 按 Win+R 输入 cmd），执行：

git init
git add .
git commit -m init
git remote add origin https://github.com/你的用户名/funing-website.git
git push -u origin main

**第二步：Cloudflare Pages 连接 GitHub
1. 打开 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 左侧菜单 → Workers & Pages → Create
3. 选 Pages → Connect to Git
4. 选 GitHub → 选 funing-website 仓库
5. 构建设置：
  - Build command: npm run build:cf
  - Build output directory: .open-next/worker
6. 点 Save and Deploy
**第三步：创建 D1 数据库
1. Cloudflare Dashboard → Workers & Pages → D1
2. 创建数据库，名称填 funing-db
3. 回到 Pages 项目 → Settings → Functions → D1 database bindings
4. 变量名填 DB，选刚创建的数据库
5. 保存后需要重新部署
**第四步：导入数据 部署成功后，用 Wrangler CLI 执行 schema.sql 和 seed.sql 来初始化数据库内容。
