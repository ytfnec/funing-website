'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/ContentContext';

const newsItems = [
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

export default function NewsSection() {
  const { t } = useLanguage();

  return (
    <section id="news" className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
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

        {/* News Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {newsItems.map((news, i) => (
            <motion.div
              key={news.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <Card className="group border-0 shadow-sm hover:shadow-lg transition-all duration-300 h-full overflow-hidden bg-white">
                {/* Top accent bar */}
                <div className={`h-1.5 bg-gradient-to-r ${news.gradient}`} />
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    {t(news.dateKey)}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-teal-600 transition-colors line-clamp-2">
                    {t(news.titleKey)}
                  </h3>

                  {/* Summary */}
                  <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1 line-clamp-3">
                    {t(news.summaryKey)}
                  </p>

                  {/* Read more */}
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

        {/* View More */}
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
