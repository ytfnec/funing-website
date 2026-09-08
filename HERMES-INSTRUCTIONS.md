# Hermes 操作指令（Claude Code 下发）

> 批次: **第六十八批（最新）** · 更新: 2026-09-08 · 来源: Claude Code
> 状态: **Beem logo 放大 1.5× · 待执行部署**

---

## 第六十八批：Beem logo 放大到 1.5 倍

用户：Beem 可放大到 1.5 倍。

CC 已改（提交 `3abccc4`，`src/app/page.tsx`）：
- Beem 卡片 logo 高度 42 → **63px**（1.5×），最大宽 260 → **320px**
- 卡片高 84px 可容纳；其余 logo 不动

## 执行任务（按序执行，回报表见文末）

### 任务 1 · 推送代码
```
git push
```
预期：origin/master 同步（含 `3abccc4`）。

### 任务 2 · 清缓存构建并部署
```
rm -rf .next .open-next && npm run build:cf:static && npm run deploy
```
预期：构建成功部署。

### 任务 3 · 浏览器目检
1. logo 墙 Beem 明显放大（约 63px 高），清晰无破图
2. 卡片内不溢出、与其它 logo 协调；单行滚动/箭头仍正常
3. 记录仍不理想项

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推送代码 | 待执行 | |
| 2 构建+部署 | 待执行 | |
| 3 浏览器目检 | 待执行 | |

---

## 历史备注（供参考，无需执行）

- ✅ 批次67：logo 墙单行滚动 + 尺寸放大 + Symmetry S 方块徽标，已部署 v`fd06d5ec`（截图已确认 S 清晰比例协调）。
- ✅ 批次66：NEWGEN 四方块 + Symmetry 组合标。
- 待办：社媒 URL 换品牌账号。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
