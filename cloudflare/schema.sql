-- Cloudflare D1 数据库初始化脚本
-- 在 Cloudflare Dashboard → D1 → 创建数据库后执行此 SQL

CREATE TABLE IF NOT EXISTS SiteContent (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  zh TEXT NOT NULL,
  en TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS UploadedImage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS NewsArticle (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  titleZh TEXT NOT NULL,
  titleEn TEXT NOT NULL,
  summaryZh TEXT NOT NULL,
  summaryEn TEXT NOT NULL,
  imageUrl TEXT,
  "order" INTEGER DEFAULT 0
);
