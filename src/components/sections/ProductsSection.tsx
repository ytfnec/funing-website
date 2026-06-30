'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CircuitBoard, Layers, Cpu, Settings, Package, SearchCheck, ArrowRight } from 'lucide-react';
import { useContent } from '@/context/ContentContext';

const products = [
  {
    icon: CircuitBoard,
    titleKey: 'prod_pcb_title' as const,
    descKey: 'prod_pcb_desc' as const,
    imageKey: 'prod_pcb_image' as const,
    gradient: 'from-teal-500 to-cyan-500',
    bgLight: 'bg-teal-50',
  },
  {
    icon: Layers,
    titleKey: 'prod_smt_title' as const,
    descKey: 'prod_smt_desc' as const,
    imageKey: 'prod_smt_image' as const,
    gradient: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50',
  },
  {
    icon: Cpu,
    titleKey: 'prod_pca_title' as const,
    descKey: 'prod_pca_desc' as const,
    imageKey: 'prod_pca_image' as const,
    gradient: 'from-green-500 to-emerald-500',
    bgLight: 'bg-green-50',
  },
  {
    icon: Settings,
    titleKey: 'prod_oem_title' as const,
    descKey: 'prod_oem_desc' as const,
    imageKey: 'prod_oem_image' as const,
    gradient: 'from-cyan-500 to-blue-500',
    bgLight: 'bg-cyan-50',
  },
  {
    icon: Package,
    titleKey: 'prod_box_title' as const,
    descKey: 'prod_box_desc' as const,
    imageKey: 'prod_box_image' as const,
    gradient: 'from-teal-600 to-green-600',
    bgLight: 'bg-teal-50',
  },
  {
    icon: SearchCheck,
    titleKey: 'prod_test_title' as const,
    descKey: 'prod_test_desc' as const,
    imageKey: 'prod_test_image' as const,
    gradient: 'from-emerald-600 to-teal-600',
    bgLight: 'bg-emerald-50',
  },
];

export default function ProductsSection() {
  const { t, contents, language } = useContent();

  return (
    <section id="products" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 text-teal-600 border-teal-200 bg-teal-50 px-4 py-1">
            {t('products_tag')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('products_title')}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {t('products_subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => {
            const Icon = product.icon;
            const imageUrl = contents[product.imageKey]?.[language] || '';
            return (
              <motion.div
                key={product.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="group border-0 shadow-sm hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
                  <CardContent className="p-0">
                    {/* Image or icon header */}
                    {imageUrl ? (
                      <div className="h-48 overflow-hidden">
                        <img src={imageUrl} alt={t(product.titleKey)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ) : (
                      <>
                        <div className={`h-2 bg-gradient-to-r ${product.gradient}`} />
                        <div className="p-6 md:p-8">
                          <div className={`w-14 h-14 rounded-xl ${product.bgLight} flex items-center justify-center mb-5`}>
                            <Icon className="w-7 h-7" style={{ color: '#0d9488' }} />
                          </div>
                        </div>
                      </>
                    )}
                    <div className="p-6 md:p-8">
                      {!imageUrl && (
                        <div className={`w-14 h-14 rounded-xl ${product.bgLight} flex items-center justify-center mb-5 -mt-20 relative z-10 bg-white shadow-sm`}>
                          <Icon className="w-7 h-7" style={{ color: '#0d9488' }} />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {t(product.titleKey)}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        {t(product.descKey)}
                      </p>
                      <Button
                        variant="ghost"
                        className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 p-0 h-auto font-medium"
                      >
                        {t('prod_view')}
                        <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
