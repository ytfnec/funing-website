'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useContent } from '@/context/ContentContext';

// Stats now use content from D1/i18n for BOTH value and label
interface StatDef {
  key: string;
  valKey: string;
  icon: string;
}

const stats: StatDef[] = [
  { key: 'stat_years',    valKey: 'stat_years_val',    icon: '📅' },
  { key: 'stat_smt',      valKey: 'stat_smt_val',      icon: '⚡' },
  { key: 'stat_clients',  valKey: 'stat_clients_val',  icon: '🤝' },
  { key: 'stat_countries', valKey: 'stat_countries_val', icon: '🌍' },
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
  const { t, contents, language } = useContent();
  const aboutImage = contents['about_image']?.[language] || '';

  // Helper to get stat value from content
  const getStatVal = (valKey: string): string => {
    return contents[valKey]?.[language] || '';
  };

  return (
    <section id="about" className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Bar — fully content-driven */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 md:mb-20">
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
                    {getStatVal(stat.valKey)}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 mt-1">
                    {t(stat.key)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Content with optional image */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <Badge variant="outline" className="mb-4 text-teal-600 border-teal-200 bg-teal-50 px-4 py-1">
              {t('about_tag')}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('about_title')}
            </h2>
          </motion.div>

          <div className={`flex flex-col ${aboutImage ? 'lg:flex-row gap-10 items-start' : ''}`}>
            {/* Image */}
            {aboutImage && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:w-5/12 shrink-0"
              >
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img src={aboutImage} alt="About Funing Electronics" className="w-full h-auto object-cover" />
                </div>
              </motion.div>
            )}

            {/* Text */}
            <div className={`space-y-6 text-left ${aboutImage ? 'lg:w-7/12' : 'max-w-4xl mx-auto'}`}>
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

              {/* Company Philosophy Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Card className="border-teal-100 bg-teal-50/50 mt-8">
                  <CardContent className="p-6 space-y-4">
                    {/* Business Philosophy */}
                    <div>
                      <h4 className="text-sm font-bold text-teal-700 mb-2">{t('philosophy_label')}</h4>
                      <p className="text-teal-600">{t('philosophy')}</p>
                    </div>
                    {/* Company Motto */}
                    <div>
                      <h4 className="text-sm font-bold text-teal-700 mb-2">{t('motto_label')}</h4>
                      <p className="text-teal-600">{t('motto')}</p>
                    </div>
                    {/* Business Goal */}
                    <div>
                      <h4 className="text-sm font-bold text-teal-700 mb-2">{t('goal_label')}</h4>
                      <p className="text-teal-600">{t('goal')}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
