'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getTranslations } from '@/lib/i18n';

// Build static defaults from i18n
const translations = getTranslations();
const staticMap: Record<string, { zh: string; en: string }> = {};
for (const [key, val] of Object.entries(translations.zh)) {
  staticMap[key] = {
    zh: typeof val === 'string' ? val : String(val),
    en: (translations.en as any)[key] || '',
  };
}

interface ContentContextType {
  contents: Record<string, { zh: string; en: string }>;
  news: any[];
  lang: 'zh' | 'en';
  language: 'zh' | 'en';
  setLang: (lang: 'zh' | 'en') => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | null>(null);

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}

// For components that import useLanguage from this file (Header, Footer, etc.)
export function useLanguage() {
  return useContent();
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [contents, setContents] = useState<Record<string, { zh: string; en: string }>>(staticMap);
  const [news, setNews] = useState<any[]>([]);
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [fetched, setFetched] = useState(false);

  const toggleLanguage = useCallback(() => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  }, []);

  const refreshContent = useCallback(async () => {
    try {
      const res = await fetch(`/api/site/content?_t=${Date.now()}`);
      if (!res.ok) {
        console.warn('[ContentContext] Fetch failed with status:', res.status);
        return;
      }
      const data = await res.json();

      let contentData: Record<string, { zh: string; en: string }> | null = null;
      let newsData: any[] = [];

      if (data.contents && typeof data.contents === 'object') {
        contentData = data.contents;
      } else if (typeof data === 'object' && !Array.isArray(data)) {
        const firstVal = Object.values(data)[0];
        if (firstVal && typeof firstVal === 'object' && ('zh' in firstVal || 'en' in firstVal)) {
          contentData = data;
        }
      }

      if (data.news && Array.isArray(data.news)) {
        newsData = data.news;
      }

      if (contentData) {
        setContents(contentData);
        setFetched(true);
      }

      if (newsData.length > 0) {
        setNews(newsData);
      }
    } catch (err) {
      console.error('[ContentContext] Fetch error:', err);
      if (!fetched) {
        setContents(staticMap);
      }
    }
  }, [fetched]);

  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  const t = useCallback(
    (key: string): string => {
      const entry = contents[key];
      if (!entry) return key;
      return (entry as any)[lang] || entry.zh || entry.en || '';
    },
    [contents, lang]
  );

  return (
    <ContentContext.Provider value={{
      contents,
      news,
      lang,
      language: lang,           // alias for components that use 'language'
      setLang,
      toggleLanguage,           // toggle function for Header
      t,
      refreshContent,
    }}>
      {children}
    </ContentContext.Provider>
  );
}
