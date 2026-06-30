'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { translations } from '@/lib/i18n';

const defaultNews = [
  {
    dateKey: 'news1_date' as const,
    titleKey: 'news1_title' as const,
    summaryKey: 'news1_summary' as const,
    gradient: 'from-teal-500 to-emerald-500',
  },
  {
    dateKey: 'news2_date' as const,
    titleKey: 'news2_title' as const,
    summaryKey: 'news2_summary' as const,
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    dateKey: 'news3_date' as const,
    titleKey: 'news3_title' as const,
    summaryKey: 'news3_summary' as const,
    gradient: 'from-green-500 to-teal-500',
  },
];

const gradients = ['from-teal-500 to-emerald-500', 'from-emerald-500 to-green-500', 'from-green-500 to-teal-500', 'from-cyan-500 to-teal-500'];

export default function NewsSection() {
  const { t, news, language } = useContent();

  // Use D1 news if available, otherwise fall back to static
  const displayNews = news && news.length > 0
    ? news.slice(0, 6).map((item, i) => ({
        date: item.date,
        title: language === 'zh' ? item.titleZh : item.titleEn,
        summary: language === 'zh' ? item.summaryZh : item.summaryEn,
        imageUrl: item.imageUrl,
        gradient: gradients[i % gradients.length],
      }))
    : defaultNews.map((n, i) => ({
        date: t(n.dateKey),
        title: t(n.titleKey),
        summary: t(n.summaryKey),
        imageUrl: '',
        gradient: n.gradient,
      }));

  return (
    <section id="news" className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 text-teal-600 border-teal-200 bg-teal-50 px-4 py-1">
            {t('news_tag')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('news_title')}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {t('news_subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {displayNews.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <Card className="group border-0 shadow-sm hover:shadow-lg transition-all duration-300 h-full overflow-hidden bg-white">
                {item.imageUrl ? (
                  <div className="h-48 overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className={`h-1.5 bg-gradient-to-r ${item.gradient}`} />
                )}
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.date}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-teal-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1 line-clamp-3">
                    {item.summary}
                  </p>
                  <Button
                    variant="ghost"
                    className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 p-0 h-auto font-medium w-fit"
                  >
                    {t('news_read')}
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            variant="outline"
            className="border-teal-200 text-teal-600 hover:bg-teal-50 hover:text-teal-700 px-8"
          >
            {t('news_more')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
