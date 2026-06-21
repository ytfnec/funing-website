import { db } from '@/lib/db';

async function main() {
  // Clear existing data
  await db.siteContent.deleteMany();
  await db.newsArticle.deleteMany();

  // Seed site content from i18n translations
  const { translations } = await import('@/lib/i18n');

  const entries = Object.keys(translations.zh).map((key) => ({
    key,
    zh: translations.zh[key as keyof typeof translations.zh],
    en: translations.en[key as keyof typeof translations.en],
  }));

  for (const entry of entries) {
    await db.siteContent.create({ data: entry });
  }

  // Seed news articles
  const newsData = [
    {
      date: '2026-06-10',
      titleZh: '富宁电子荣获"2026年度山东省电子信息行业优秀企业"称号',
      titleEn: 'Funing Electronics Awarded "2026 Shandong Electronic Information Industry Outstanding Enterprise"',
      summaryZh: '近日，山东省电子信息行业协会公布了2026年度行业评选结果，烟台富宁电子有限公司凭借卓越的制造能力和优质的服务水平，荣获"年度优秀企业"荣誉称号。',
      summaryEn: 'The Shandong Electronic Information Industry Association announced the 2026 industry selection results. Yantai Funing Electronics Co., Ltd. was honored with the "Outstanding Enterprise" title for its excellent manufacturing capabilities and high-quality service.',
      order: 1,
    },
    {
      date: '2026-05-20',
      titleZh: '公司第三条全自动SMT产线正式投产运行',
      titleEn: 'Third Fully Automated SMT Production Line Officially Put into Operation',
      summaryZh: '为满足日益增长的市场需求，富宁电子投资建设的第三条全自动高速SMT产线已于5月正式投产运行，新增产能较原有产线提升40%。',
      summaryEn: 'To meet growing market demand, Funing Electronics\' third fully automated high-speed SMT production line began operation in May. The new capacity increases production by 40% over existing lines.',
      order: 2,
    },
    {
      date: '2026-04-15',
      titleZh: '富宁电子通过IATF 16949汽车行业质量体系认证',
      titleEn: 'Funing Electronics Achieves IATF 16949 Automotive Quality Certification',
      summaryZh: '经过近一年的体系建设与审核，富宁电子顺利通过IATF 16949:2016汽车行业质量管理体系认证，标志着公司在汽车电子制造领域迈入新阶段。',
      summaryEn: 'After nearly a year of system development and auditing, Funing Electronics successfully passed the IATF 16949:2016 automotive quality management system certification.',
      order: 3,
    },
  ];

  for (const news of newsData) {
    await db.newsArticle.create({ data: news });
  }

  console.log(`Seeded ${entries.length} content entries and ${newsData.length} news articles`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
