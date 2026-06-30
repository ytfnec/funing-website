'use client';

import { useContent } from '@/context/ContentContext';

export default function AboutSection() {
  const { t, contents, lang } = useContent();

  const aboutImage = contents.about_image?.[lang] || contents.about_image?.zh || '';
  const hasAboutImage = aboutImage && aboutImage.trim() !== '';

  const features = [
    { title: t('about_feature1_title'), desc: t('about_feature1_desc') },
    { title: t('about_feature2_title'), desc: t('about_feature2_desc') },
    { title: t('about_feature3_title'), desc: t('about_feature3_desc') },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t('about_title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('about_subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Image */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            {hasAboutImage ? (
              <img
                src={aboutImage}
                alt={t('about_title')}
                className="w-full h-auto object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">关于我们图片</span>
              </div>
            )}
          </div>

          {/* Text */}
          <div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              {t('about_desc')}
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {t('about_desc2')}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
