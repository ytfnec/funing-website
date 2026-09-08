# Hermes 操作指令（Claude Code 下发）

> 批次: **第六十四批（最新）** · 更新: 2026-09-07 · 来源: Claude Code
> 状态: **页脚社媒图标链接 · 待执行部署**

---

## 第六十四批：页脚加 YouTube / Instagram / Facebook

用户要求网站底部可点官方社媒链接；URL 已提供（**后续会换成品牌账号**，本批先用提供的链接）。

CC 已改（提交 `22b333f`，`src/components/Footer.tsx`）：
- 页脚中部（newsletter 下方、版权条上方）新增 3 个圆形社媒图标：YouTube / Instagram / Facebook
- 品牌图标用内联 SVG（当前 lucide-react 已移除品牌图标，tsc 已验证）
- 样式：描边圆钮、浅底近黑/灰，hover 加深；`target="_blank" rel="noopener noreferrer"` + aria-label

链接（临时）：
- YouTube：`https://www.youtube.com/@maxeonshin8448`
- Instagram：`https://www.instagram.com/minhsuan0707/`
- Facebook：`https://www.facebook.com/profile.php?id=61552022292033`

## 执行任务（按序执行，回报表见文末）

### 任务 1 · 推送代码
```
git push
```
预期：origin/master 同步（含提交 `22b333f`）。

### 任务 2 · 清缓存构建并部署
```
rm -rf .next .open-next && npm run build:cf:static && npm run deploy
```
预期：构建成功部署。

### 任务 3 · 浏览器目检
1. 页脚 newsletter 下方出现 YouTube/Instagram/Facebook 三个圆形图标
2. 点击新开标签且地址正确；图标 hover 可见
3. 桌面/移动布局无溢出
4. 记录仍不理想项

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推送代码 | 待执行 | |
| 2 构建+部署 | 待执行 | |
| 3 浏览器目检 | 待执行 | |

---

## 历史备注（供参考，无需执行）

- ✅ 批次63：logo 右侧中文回“烟台富宁电子”，已部署 v`9a77f39f`。
- ✅ 批次62：hero 黑屏修复，已部署 v`17dbcf86`。
- 待办：首页合作客户 logo 墙（AXIS/NEWGEN/SYMMETRY logo 素材待补）；社媒 URL 后续换品牌账号。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
