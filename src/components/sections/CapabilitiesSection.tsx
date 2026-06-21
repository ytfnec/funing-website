'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Monitor, Zap } from 'lucide-react';
import { useLanguage } from '@/context/ContentContext';

const equipmentList = [
  'cap_equip_1', 'cap_equip_2', 'cap_equip_3', 'cap_equip_4',
  'cap_equip_5', 'cap_equip_6', 'cap_equip_7', 'cap_equip_8',
] as const;

const lineList = [
  'cap_line_1', 'cap_line_2', 'cap_line_3', 'cap_line_4', 'cap_line_5',
] as const;

const advantageList = [
  'cap_adv_1', 'cap_adv_2', 'cap_adv_3', 'cap_adv_4', 'cap_adv_5',
] as const;

export default function CapabilitiesSection() {
  const { t } = useLanguage();

  return (
    <section id="capabilities" className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 text-teal-600 border-teal-200 bg-teal-50 px-4 py-1">
            {t('cap_tag')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('cap_title')}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {t('cap_subtitle')}
          </p>
        </motion.div>

        {/* Three Column Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Core Equipment */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 shadow-sm h-full bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-teal-600" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {t('cap_equip_title')}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {equipmentList.map((key, i) => (
                    <motion.li
                      key={key}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-600">{t(key)}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Production Lines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border-0 shadow-md h-full bg-gradient-to-br from-teal-600 to-emerald-700 text-white">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold">
                    {t('cap_line_title')}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {lineList.map((key, i) => (
                    <motion.li
                      key={key}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 + 0.1 }}
                      className="flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-200 mt-0.5 shrink-0" />
                      <span className="text-sm text-white/90">{t(key)}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Technical Advantages */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-0 shadow-sm h-full bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {t('cap_adv_title')}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {advantageList.map((key, i) => (
                    <motion.li
                      key={key}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 + 0.2 }}
                      className="flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-600">{t(key)}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
