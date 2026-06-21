'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Leaf, Car, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/ContentContext';

const certifications = [
  {
    icon: Shield,
    titleKey: 'q_iso' as const,
    descKey: 'q_iso_desc' as const,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  {
    icon: Leaf,
    titleKey: 'q_iso14001' as const,
    descKey: 'q_iso14001_desc' as const,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Car,
    titleKey: 'q_iatf' as const,
    descKey: 'q_iatf_desc' as const,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: ShieldCheck,
    titleKey: 'q_ul' as const,
    descKey: 'q_ul_desc' as const,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
  },
];

const processSteps = [
  'quality_step1', 'quality_step2', 'quality_step3', 'quality_step4',
  'quality_step5', 'quality_step6', 'quality_step7',
] as const;

export default function QualitySection() {
  const { t } = useLanguage();

  return (
    <section id="quality" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 text-teal-600 border-teal-200 bg-teal-50 px-4 py-1">
            {t('quality_tag')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('quality_title')}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {t('quality_subtitle')}
          </p>
        </motion.div>

        {/* Certifications Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {certifications.map((cert, i) => {
            const Icon = cert.icon;
            return (
              <motion.div
                key={cert.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow h-full text-center">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-2xl ${cert.bg} flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-8 h-8 ${cert.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {t(cert.titleKey)}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {t(cert.descKey)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quality Description */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <p className="text-base text-gray-600 leading-relaxed">{t('quality_p1')}</p>
            <p className="text-base text-gray-600 leading-relaxed">{t('quality_p2')}</p>
          </motion.div>

          {/* Process Flow */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">{t('quality_process')}</h3>
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-400 to-emerald-400" />

              <div className="space-y-4">
                {processSteps.map((key, i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-4 relative"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shrink-0 relative z-10">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <span className="text-sm font-medium text-gray-700 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-100">
                      {t(key)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
