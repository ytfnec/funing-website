'use client';

import { useContent } from '@/context/ContentContext';

export default function HeroSection() {
  const { t, contents, lang } = useContent();

  // Get hero background image from contents - check both sources
  const heroBgImage = contents.hero_bg_image?.[lang] || contents.hero_bg_image?.zh || '';

  // Debug: log the image value
  if (typeof window !== 'undefined') {
    console.log('[HeroSection] hero_bg_image for lang', lang, ':', heroBgImage);
  }

  const hasBgImage = heroBgImage && heroBgImage.trim() !== '';

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image Layer */}
      {hasBgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBgImage})`,
          }}
        />
      )}

      {/* Overlay - transparent when image is set, dark when no image */}
      <div
        className={`absolute inset-0 ${hasBgImage ? 'bg-gray-900/40' : 'bg-gray-900/95'}`}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          {t('hero_title')}
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8">
          {t('hero_subtitle')}
        </p>
        <a
          href="#about"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300"
        >
          {t('hero_cta')}
        </a>
      </div>
    </section>
  );
}
