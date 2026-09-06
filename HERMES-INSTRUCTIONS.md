# Hermes 操作指令（Claude Code 下发）

> 批次: **第五十批（最新）** · 更新: 2026-09-05 · 来源: Claude Code
> 状态: **对应批次49反馈的实现 · 待执行部署**

---

## 第五十批：换图 + 科技蓝 logo + 按钮回琥珀

已采纳批次49用户反馈并完成本地提交：

1. **hero / CTA 换明亮暖调图**（用户确认 axissaunas.com terra 客户素材可直接用）：
   - hero = `HwyGD96Xmftohiic_Axis_Saunas_16_9_Terra_5.webp`（现代桑拿内景，明亮暖木色，亮度 143/255）→ 已裁为 `public/assets/hero-1920.webp`（1920×1080）
   - CTA = `dlyc3ZC6XmfdFc7T_Axis_Saunas_21_9_Terra_6.webp`（宽幅暖调外景，亮度 121/255）→ 已裁为 `public/assets/cta-bg.webp`（1920×813）
2. **logo 科技蓝**：新增 `public/assets/logo-blue-solid.png`（琥珀像素换品牌科技蓝 `#1E5EFF`），Header/Footer 引用替换。
3. **按钮回琥珀**：全局主按钮改 **琥珀 `#d8a35a` 底 + 深墨字**（浅底/照片上更醒目）；hero/CTA 照片区文字用米白 + 中央柔光遮罩保证可读，hero 主按钮同琥珀、副按钮米白描边。

代码提交：`47c30ee`（按钮/logo/hero-CTA 结构）；素材提交：`e647044`（两张新图）。

## 执行任务（按序执行，回报表见文末）

### 任务 1 · 推送代码
```
git push
```
预期：origin/master 同步（含 `47c30ee` + `e647044`，即新代码 + 新图片）。

### 任务 2 · 清缓存构建并部署
```
rm -rf .next .open-next && npm run build:cf:static && npm run deploy
```
预期：构建成功部署。若有样式/资源告警，完整日志贴回报表。

### 任务 3 · 产物抽查
```
curl -s <ROOT>/ | grep -c "logo-blue-solid"        # 预期 ≥1（科技蓝 logo 已引用）
curl -sI <ROOT>/assets/hero-1920.webp | head -1    # 预期 200
curl -sI <ROOT>/assets/cta-bg.webp | head -1       # 预期 200
curl -s <ROOT>/ | grep -c "d8a35a"                 # 预期 ≥1（琥珀按钮色进 CSS）
```
<ROOT> 为站点根域（`https://fnec.net`）。

### 任务 4 · 浏览器目检（中英双语，逐项回报）
1. **首页 hero**：新图明亮暖木桑拿内景；h1 白字在中央柔光遮罩上清晰；琥珀主按钮 + 米白描边副按钮醒目
2. **底部 CTA**：新图宽幅暖调外景；米白标题/描述可读；琥珀主按钮醒目
3. **logo**：页头/页脚为科技蓝 `#1E5EFF` 版，浅底清晰
4. **全站按钮**（/products /contact /quote /admin）：主按钮琥珀底+深墨字清晰
5. 记录仍不理想的具体页面/元素，便于下一批微调

---

## 执行回报（Hermes 填写）

| 任务 | 结果 | 说明 |
|------|------|------|
| 1 推送代码 | 待执行 | |
| 2 构建+部署 | 待执行 | |
| 3 产物抽查 | 待执行 | |
| 4 浏览器目检 | 待执行 | |

---

## 历史备注（供参考，无需执行）

- ✅ 批次49：用户反馈（换图/科技蓝 logo/按钮回琥珀）+ Hermes 素材实测，CC 已在本批实现。
- ✅ 批次48：视觉优化（按钮对比/hero提亮/CTA去黑/字体加重）已部署 v`a68cd36e`。
- ✅ 批次47、46、45：均已完成。
- 保持既有约定：不改 `wrangler.toml`、不动 DNS、不整库 `db:deploy`。
