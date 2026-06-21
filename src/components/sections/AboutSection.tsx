'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/ContentContext';

const stats = [
  { zh: '18', en: '18', key: 'stat_years' as const, icon: '📅' },
  { zh: '20,000', en: '20,000', key: 'stat_area' as const, icon: '🏭' },
  { zh: '50', en: '50', key: 'stat_pcb' as const, icon: '🔲' },
  { zh: '10', en: '10', key: 'stat_smt' as const, icon: '⚡' },
  { zh: '500', en: '500', key: 'stat_clients' as const, icon: '🤝' },
  { zh: '30', en: '30', key: 'stat_countries' as const, icon: '🌍' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
};

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16 md:mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.key}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl font-bold text-teal-600">
                    {stat.zh}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 mt-1">
                    {t(stat.key)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Badge variant="outline" className="mb-4 text-teal-600 border-teal-200 bg-teal-50 px-4 py-1">
              {t('about_tag')}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('about_title')}
            </h2>
          </motion.div>

          <div className="space-y-6 text-left">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-base md:text-lg text-gray-600 leading-relaxed"
            >
              {t('about_p1')}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-base md:text-lg text-gray-600 leading-relaxed"
            >
              {t('about_p2')}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-base md:text-lg text-gray-600 leading-relaxed"
            >
              {t('about_p3')}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
