'use client';

import { useState, useCallback, useRef, type ReactNode } from 'react';
import { type Language, translations, type TranslationKey } from '@/lib/i18n';

// Content from API
export interface SiteContentMap {
  [key: string]: { zh: string; en: string };
}

export interface NewsArticle {
  id: number;
  date: string;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  summaryEn: string;
  imageUrl: string | null;
  order: number;
}

interface ContentContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
  contents: SiteContentMap;
  news: NewsArticle[];
  refreshContent: () => Promise<void>;
}

import { createContext, useContext } from 'react';

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Build static fallback map
function buildStaticMap(): SiteContentMap {
  const map: SiteContentMap = {};
  for (const key of Object.keys(translations.zh)) {
    map[key] = {
      zh: translations.zh[key as keyof typeof translations.zh],
      en: translations.en[key as keyof typeof translations.en],
    };
  }
  return map;
}

const staticMap = buildStaticMap();

export function ContentProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');
  const [contents, setContents] = useState<SiteContentMap>(staticMap);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const initialFetchDone = useRef(false);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'zh' ? 'en' : 'zh'));
  }, []);

  const refreshContent = useCallback(async () => {
    try {
      // Use the working admin/content endpoint instead of the broken site/content
      const res = await fetch('/api/admin/content?_t=' + Date.now(), {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-store, no-cache',
        },
      });
      const data = await res.json();
      if (data.contents) setContents(data.contents);
      if (data.news) setNews(data.news);
    } catch {
      setContents(staticMap);
    }
  }, []);

  // Fetch content on first render - use ref null check pattern
  if (initialFetchDone.current == null) {
    initialFetchDone.current = true;
    refreshContent();
  }

  const t = useCallback(
    (key: TranslationKey): string => {
      return contents[key]?.[language] || translations[language][key];
    },
    [contents, language]
  );

  return (
    <ContentContext.Provider value={{ language, toggleLanguage, t, contents, news, refreshContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}

// Re-export useLanguage as an alias for backward compatibility
export { useContent as useLanguage };
