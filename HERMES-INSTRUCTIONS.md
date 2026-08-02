# Hermes 操作指令（Claude Code 下发）

> 状态: 全部功能已完成 · 更新: 2026-08-03 · 来源: Claude Code
> 说明: 功能队列 8 项已全部实现并部署（批次 10–17），开发循环收尾，仅剩最后一个收尾提交 `8df8a3c`（本指令文件更新）待推送同步 origin/master。

---

## 总结

功能队列 8 项已全部完成并部署（最新 Version `fa572c9c`，第十七批）：

| # | 功能 | 提交 |
|---|------|------|
| 1 | 首页 CTA 真实图片（PCB 纹理叠加） | `9e83791` |
| 2 | 性能优化（字体自托管/favicon 内联/图片加载） | `24dbba9` |
| 3 | admin Content 批量操作 | `10a4154` |
| 4 | 新闻 /news + admin 管理（D1 `news_article`） | `529a752` |
| 5 | 全量回归 + JSON-LD 补缺 | `9b79bf3` |
| 6 | 加载骨架屏 + 错误边界 | `d8f1a8f` |
| 7 | 产品详情 hero_image 真实展示 | `c011184` |
| 8 | 后台 Media 批量删除 | `52074b9` |

本地 master 相对 origin/master 有 **1 个未推送提交**：`8df8a3c`（"Mark dev auto-loop complete"，仅文档更新，非功能改动）。需要推送到同步远程。

## 待人工确认项（cron 无法覆盖，建议人工浏览器验证）

1. 新闻详情页 **NewsArticle JSON-LD**：发布一篇已发布文章后 view-source 确认（第十四批遗留）
2. 骨架屏：Slow 3G 下 /products、/news、详情页观察琥珀 shimmer（第十五批）
3. 错误边界：手动触发渲染错误确认 error.tsx 重试可恢复（第十五批）
4. 产品编辑 Product Image：admin 设置 hero_image + Browse Media 弹层（第十六批）
5. Media 批量删除：勾选/全选/Delete Selected 实测 D1+R2 同步清理（第十七批）
6. 可选增强：构建时设 `NEXT_PUBLIC_R2_PUBLIC_URL` 以启用媒体库 R2 真实预览

## 本轮任务清单

> 本批仅同步收尾提交，**无需重新构建部署**（线上 Version `fa572c9c` 已是最新功能产物）。

| # | 任务 | 命令 | 预期结果 |
|---|------|------|----------|
| 1 | 推送收尾提交 | `cd /sessions/serene-adoring-dirac/mnt/axissaunas-clone && git push origin master` | `git log origin/master..HEAD` 为空；远程包含 `8df8a3c` |
| 2 | 验证线上状态 | `for u in "/" "/admin/login" "/api/products" "/products" "/contact"; do curl -s -o /dev/null -w "$u -> HTTP %{http_code}\n" "https://fnec.net$u"; done` | 全部 HTTP 200（确认部署未受影响） |
| 3 | 确认无待推送提交 | `git log origin/master..HEAD --oneline` | 输出为空 |

**自动开发循环到此停止。** 如需继续开发新功能，请在功能队列中新增项目后由 Claude Code 重新下发批次指令。

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推送收尾提交 | 待执行 | `git push origin master` |
| 2 验证线上状态 | 待执行 | 各路由 200 预期 |
| 3 确认无待推送提交 | 待执行 | `git log origin/master..HEAD` 为空预期 |
