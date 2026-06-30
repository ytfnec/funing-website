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
  setLang: (lang: 'zh' | 'en') => void;
  t: (key: string) => string;
  refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | null>(null);

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [contents, setContents] = useState<Record<string, { zh: string; en: string }>>(staticMap);
  const [news, setNews] = useState<any[]>([]);
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [fetched, setFetched] = useState(false);

  const refreshContent = useCallback(async () => {
    try {
      // Cache-bust with timestamp
      const res = await fetch(`/api/site/content?_t=${Date.now()}`);
      if (!res.ok) {
        console.warn('[ContentContext] Fetch failed with status:', res.status);
        return;
      }
      const data = await res.json();

      // IMPORTANT: Handle both response formats:
      // Format A: { contents: {...}, news: [...] }
      // Format B: { key1: {...}, key2: {...}, ... } (flat, no wrapper)
      let contentData: Record<string, { zh: string; en: string }> | null = null;
      let newsData: any[] = [];

      if (data.contents && typeof data.contents === 'object') {
        // Format A: wrapped in contents key
        contentData = data.contents;
      } else if (typeof data === 'object' && !Array.isArray(data)) {
        // Format B: flat response - check if it looks like content (has zh/en objects)
        const firstVal = Object.values(data)[0];
        if (firstVal && typeof firstVal === 'object' && ('zh' in firstVal || 'en' in firstVal)) {
          contentData = data;
        }
      }

      if (data.news && Array.isArray(data.news)) {
        newsData = data.news;
      }

      if (contentData) {
        console.log('[ContentContext] Received', Object.keys(contentData).length, 'keys from API');
        // Log image-related keys for debugging
        const imageKeys = Object.keys(contentData).filter(k => k.includes('image'));
        if (imageKeys.length > 0) {
          console.log('[ContentContext] Image keys:', imageKeys.map(k => 
            `${k}=${JSON.stringify(contentData[k])}`
          ).join(' | '));
        }
        setContents(contentData);
        setFetched(true);
      } else {
        console.warn('[ContentContext] No valid content data in response');
      }

      if (newsData.length > 0) {
        setNews(newsData);
      }
    } catch (err) {
      console.error('[ContentContext] Fetch error:', err);
      // Do NOT fall back to staticMap here - keep existing state
      // Only use staticMap if we've never successfully fetched
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
    <ContentContext.Provider value={{ contents, news, lang, setLang, t, refreshContent }}>
      {children}
    </ContentContext.Provider>
  );
}