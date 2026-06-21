import { db } from '@/lib/db';

async function main() {
  const contents = await db.siteContent.findMany();
  const news = await db.newsArticle.findMany({ orderBy: { order: 'asc' } });

  const lines: string[] = [];

  lines.push('-- SiteContent inserts');
  for (const c of contents) {
    const zh = c.zh.replace(/'/g, "''");
    const en = c.en.replace(/'/g, "''");
    lines.push(`INSERT OR REPLACE INTO SiteContent (key, zh, en) VALUES ('${c.key}', '${zh}', '${en}');`);
  }

  lines.push('');
  lines.push('-- NewsArticle inserts');
  for (const n of news) {
    const titleZh = n.titleZh.replace(/'/g, "''");
    const titleEn = n.titleEn.replace(/'/g, "''");
    const sumZh = n.summaryZh.replace(/'/g, "''");
    const sumEn = n.summaryEn.replace(/'/g, "''");
    const img = n.imageUrl ? `'${n.imageUrl.replace(/'/g, "''")}'` : 'NULL';
    lines.push(`INSERT INTO NewsArticle (date, titleZh, titleEn, summaryZh, summaryEn, imageUrl, "order") VALUES ('${n.date}', '${titleZh}', '${titleEn}', '${sumZh}', '${sumEn}', ${img}, ${n.order});`);
  }

  console.log(lines.join('\n'));
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
