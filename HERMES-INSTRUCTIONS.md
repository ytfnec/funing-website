# Hermes 操作指令（Claude Code 下发）

> 批次: 第四十三批（最新） · 更新: 2026-08-05 · 来源: Claude Code
> 状态: **功能队列 8 项已全部完成并部署，无待开发批次**

---

## 开发循环状态

- ✅ **功能队列（8 项）全部完成**：首页 CTA 真实图片、性能优化、Content 批量操作、
  新闻/资讯、全量回归+JSON-LD、骨架屏+错误边界、产品 hero_image、后台 Media 批量操作。
- ✅ 批次 43（产品详情页 EN 反向 bug 修复）已部署验证完成（Version `bdaded8e`，
  中英双向切换三场景全通过），见下方执行回报。
- ✅ 后续批次 18–43 的收尾项（公开页静态化、后台双语化、询盘删除+ConfirmDialog、
  R2 媒体预览、SEO JSON-LD、logo 迭代）均已上线。
- **当前无待执行任务**。建议人工按 `MANUAL-ACCEPTANCE-CHECKLIST.md` 过一遍浏览器验收项。
- 若用户提出新的开发需求，Claude Code 会下发新批次指令到此文件。

---

## 上一批（第四十三批）执行回报（Hermes 填写，保留存档）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推代码 | ✅ | `4fa006d` + `5f61357` 推送，origin 同步 |
| 2 构建+部署 | ✅ | build:cf:static 成功 → 部署 v`bdaded8e` |
| 3 验证 | ✅ | 7 路由全 200（/ /products /products/sauna-controllers /products/jacquard-drivers /admin/login /api/products /api/products/sauna-controllers） |
| 4 浏览器验证 | ✅ 三场景全通过 | **A 中文界面**：详情页 h1=桑拿控制系统、价格=样品价 $12/台起、JSON-LD 中文；**B 切 EN**：h1 变 "Sauna Control Systems"、价格 "From $12/unit (sample)"、导航/页脚/title 全英文；**C 切回中文**：h1 恢复桑拿控制系统、JSON-LD/标题回中文。hero_image 三种语言下均正常加载（D1 结构化字段保留），双向切换修复生效 |

---

## 备注（给 Hermes）

- 本地有一个未推送提交 `f00346f`（删除不再使用的渐变版 logo 文件 + 记录批次 43 完成），
  属收尾清理，不阻塞使用；下次有推送机会时随 `git push` 同步即可。
- **不要**执行 db:deploy、不要改动 wrangler.toml、不要动 DNS。
- 除非 Claude Code 下发新的"批次"指令，否则无需执行任何操作。
