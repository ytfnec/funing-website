'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/ContentContext';

export default function ContactSection() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const contactInfo = [
    { icon: MapPin, labelKey: 'contact_address_label' as const, valueKey: 'contact_address' as const },
    { icon: Phone, labelKey: 'contact_phone_label' as const, valueKey: 'contact_phone' as const },
    { icon: Mail, labelKey: 'contact_email_label' as const, valueKey: 'contact_email' as const },
    { icon: Clock, labelKey: 'contact_hours_label' as const, valueKey: 'contact_hours' as const },
  ];

  return (
    <section id="contact" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 text-teal-600 border-teal-200 bg-teal-50 px-4 py-1">
            {t('contact_tag')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('contact_title')}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {t('contact_subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Map placeholder */}
            <div className="rounded-xl overflow-hidden border border-gray-200 h-48 bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <span className="text-sm">Yantai, Shandong, China</span>
              </div>
            </div>

            {/* Info Cards */}
            <div className="space-y-3">
              {contactInfo.map((info, i) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={info.labelKey}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="border-0 shadow-sm bg-gray-50">
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-400 mb-0.5">{t(info.labelKey)}</p>
                          <p className="text-sm font-medium text-gray-700">{t(info.valueKey)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500" />
              <CardContent className="p-6 md:p-8">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <CheckCircle2 className="w-16 h-16 text-teal-500 mb-4" />
                    <p className="text-lg font-medium text-gray-700">{t('contact_form_success')}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                          {t('contact_form_name')}
                        </label>
                        <Input
                          required
                          placeholder={t('contact_form_name')}
                          className="h-11 bg-gray-50 border-gray-200 focus:border-teal-400 focus:ring-teal-400"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                          {t('contact_form_email')}
                        </label>
                        <Input
                          required
                          type="email"
                          placeholder={t('contact_form_email')}
                          className="h-11 bg-gray-50 border-gray-200 focus:border-teal-400 focus:ring-teal-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        {t('contact_form_phone')}
                      </label>
                      <Input
                        type="tel"
                        placeholder={t('contact_form_phone')}
                        className="h-11 bg-gray-50 border-gray-200 focus:border-teal-400 focus:ring-teal-400"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        {t('contact_form_msg')}
                      </label>
                      <Textarea
                        required
                        rows={5}
                        placeholder={t('contact_form_msg')}
                        className="bg-gray-50 border-gray-200 focus:border-teal-400 focus:ring-teal-400 resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 text-base font-medium"
                    >
                      <Send className="mr-2 w-4 h-4" />
                      {t('contact_form_submit')}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
