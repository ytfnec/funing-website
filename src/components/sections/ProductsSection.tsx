'use client';

import { useContent } from '@/context/ContentContext';

export default function ProductsSection() {
  const { t, contents, lang } = useContent();

  const products = [
    {
      image: contents.prod_pcb_image?.[lang] || contents.prod_pcb_image?.zh || '',
      title: t('prod_pcb_title'),
      desc: t('prod_pcb_desc'),
    },
    {
      image: contents.prod_pcba_image?.[lang] || contents.prod_pcba_image?.zh || '',
      title: t('prod_pcba_title'),
      desc: t('prod_pcba_desc'),
    },
    {
      image: contents.prod_odm_image?.[lang] || contents.prod_odm_image?.zh || '',
      title: t('prod_odm_title'),
      desc: t('prod_odm_desc'),
    },
  ];

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t('nav_products')}
          </h2>
          <p className="text-gray-600">
            专业电子制造服务
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, index) => {
            const hasImage = product.image && product.image.trim() !== '';
            return (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  {hasImage ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">产品图片</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{product.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
