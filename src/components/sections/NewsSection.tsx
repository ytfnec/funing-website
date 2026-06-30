'use client';

import { useContent } from '@/context/ContentContext';

export default function NewsSection() {
  const { t, news } = useContent();

  return (
    <section id="news" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t('news_title')}
          </h2>
          <p className="text-gray-600">
            {t('news_subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {news && news.length > 0 ? (
            news.slice(0, 6).map((item: any, index: number) => (
              <div
                key={item.id || index}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  {item.cover_image ? (
                    <img
                      src={item.cover_image}
                      alt={item.title_zh || item.title_en || ''}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">新闻图片</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {item.title_zh || item.title_en || ''}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('zh-CN') : ''}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {item.content_zh || item.content_en || ''}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-400 py-12">
              暂无新闻
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
