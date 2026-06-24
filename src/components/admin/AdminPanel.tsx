'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Save, Image as ImageIcon, FileText, Newspaper, LogOut,
  Loader2, Check, Upload, Trash2, Plus, Languages, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import type { SiteContentMap, NewsArticle } from '@/context/ContentContext';

// Content section groups
const contentSections: Record<string, string[]> = {
  'hero': ['hero_title', 'hero_subtitle', 'hero_description', 'hero_cta', 'hero_cta2'],
  'about': ['about_tag', 'about_title', 'about_p1', 'about_p2', 'about_p3', 'stat_years', 'stat_area', 'stat_pcb', 'stat_smt', 'stat_clients', 'stat_countries'],
  'products': ['products_tag', 'products_title', 'products_subtitle', 'prod_pcb_title', 'prod_pcb_desc', 'prod_smt_title', 'prod_smt_desc', 'prod_pca_title', 'prod_pca_desc', 'prod_oem_title', 'prod_oem_desc', 'prod_box_title', 'prod_box_desc', 'prod_test_title', 'prod_test_desc', 'prod_view'],
  'capabilities': ['cap_tag', 'cap_title', 'cap_subtitle', 'cap_equip_title', 'cap_equip_1', 'cap_equip_2', 'cap_equip_3', 'cap_equip_4', 'cap_equip_5', 'cap_equip_6', 'cap_equip_7', 'cap_equip_8', 'cap_line_title', 'cap_line_1', 'cap_line_2', 'cap_line_3', 'cap_line_4', 'cap_line_5', 'cap_adv_title', 'cap_adv_1', 'cap_adv_2', 'cap_adv_3', 'cap_adv_4', 'cap_adv_5'],
  'quality': ['quality_tag', 'quality_title', 'quality_subtitle', 'q_iso', 'q_iso_desc', 'q_iso14001', 'q_iso14001_desc', 'q_iatf', 'q_iatf_desc', 'q_ul', 'q_ul_desc', 'quality_p1', 'quality_p2', 'quality_process', 'quality_step1', 'quality_step2', 'quality_step3', 'quality_step4', 'quality_step5', 'quality_step6', 'quality_step7'],
  'news_section': ['news_tag', 'news_title', 'news_subtitle', 'news_read', 'news_more'],
  'contact': ['contact_tag', 'contact_title', 'contact_subtitle', 'contact_address_label', 'contact_address', 'contact_phone_label', 'contact_phone', 'contact_email_label', 'contact_email', 'contact_hours_label', 'contact_hours', 'contact_form_name', 'contact_form_email', 'contact_form_phone', 'contact_form_msg', 'contact_form_submit', 'contact_form_success'],
  'nav': ['nav_home', 'nav_about', 'nav_products', 'nav_capabilities', 'nav_quality', 'nav_news', 'nav_contact', 'nav_lang'],
  'footer': ['footer_desc', 'footer_links', 'footer_contact', 'footer_copyright', 'footer_icp'],
};

const sectionLabels: Record<string, string> = {
  hero: 'Hero 横幅',
  about: '关于我们',
  products: '产品中心',
  capabilities: '制造能力',
  quality: '质量认证',
  news_section: '新闻板块',
  contact: '联系我们',
  nav: '导航栏',
  footer: '页脚',
};

interface AdminPanelProps {
  contents: SiteContentMap;
  news: NewsArticle[];
  onRefresh: () => Promise<void>;
}

export default function AdminPanel({ contents, news, onRefresh }: AdminPanelProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('content');
  const [activeSection, setActiveSection] = useState('hero');
  const [editContents, setEditContents] = useState<SiteContentMap>(contents);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newsList, setNewsList] = useState<NewsArticle[]>(news);
  const [editingNews, setEditingNews] = useState<Partial<NewsArticle> | null>(null);
  const [images, setImages] = useState<{ id: number; filename: string; url: string; category: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/upload');
      const data = await res.json();
      setImages(data.images || []);
    } catch { /* ignore */ }
  }, []);

  // Fetch images when authenticated changes
  useEffect(() => {
    if (authenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchImages();
    }
  }, [authenticated, fetchImages]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setAuthenticated(true);
        setShowLogin(false);
        setPassword('');
        setEditContents({ ...contents });
        setNewsList([...news]);
      } else {
        setLoginError('密码错误，请重试');
      }
    } catch {
      setLoginError('登录失败，请重试');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setEditContents({ ...contents });
  };

  const handleSaveContent = async () => {
    setSaving(true);
    try {
      const items = Object.entries(editContents).map(([key, val]) => ({ key, zh: val.zh, en: val.en }));
      await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      await onRefresh();
    } catch {
      alert('保存失败');
    }
    setSaving(false);
  };

  const handleUpdateField = (key: string, lang: 'zh' | 'en', value: string) => {
    setEditContents((prev) => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value },
    }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'general');
    try {
      await fetch('/api/admin/upload', { method: 'POST', body: formData });
      await fetchImages();
    } catch {
      alert('上传失败');
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleDeleteImage = async (id: number) => {
    await fetch('/api/admin/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchImages();
  };

  const handleSaveNews = async () => {
    if (!editingNews) return;
    setSaving(true);
    try {
      if (editingNews.id) {
        await fetch('/api/admin/news', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingNews),
        });
      } else {
        await fetch('/api/admin/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...editingNews, order: newsList.length + 1 }),
        });
      }
      const res = await fetch('/api/admin/news');
      const data = await res.json();
      setNewsList(data.news || []);
      setEditingNews(null);
      await onRefresh();
    } catch {
      alert('保存失败');
    }
    setSaving(false);
  };

  const handleDeleteNews = async (id: number) => {
    await fetch('/api/admin/news', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const res = await fetch('/api/admin/news');
    const data = await res.json();
    setNewsList(data.news || []);
    await onRefresh();
  };

  return (
    <>
      {/* Floating admin button */}
      <button
        onClick={() => authenticated ? handleLogout() : setShowLogin(true)}
        className="fixed bottom-6 right-6 z-[100] w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl"
        style={{ background: authenticated ? '#374151' : '#0d9488' }}
        title={authenticated ? '退出管理' : '管理后台'}
      >
        {authenticated ? <LogOut className="w-5 h-5 text-white" /> : <span className="text-lg">⚙️</span>}
      </button>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && !authenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[101] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowLogin(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">管理后台登录</h3>
                <p className="text-sm text-gray-500 mt-1">请输入管理密码</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-center text-lg"
                  autoFocus
                />
                {loginError && <p className="text-sm text-red-500 text-center">{loginError}</p>}
                <Button type="submit" className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white text-base">
                  登录
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Panel Slide-in */}
      <AnimatePresence>
        {authenticated && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-[98]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-[99] w-full max-w-2xl bg-white shadow-2xl border-l flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 shrink-0">
                <h2 className="text-lg font-bold text-gray-900">网站管理后台</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200">
                    <Languages className="w-3 h-3 mr-1" />中英双语
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500 hover:text-red-600">
                    <LogOut className="w-4 h-4 mr-1" />退出
                  </Button>
                </div>
              </div>

              {/* Main content */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
                <TabsList className="w-full justify-start px-4 pt-3 bg-gray-50 border-b rounded-none shrink-0">
                  <TabsTrigger value="content" className="gap-1.5">
                    <FileText className="w-4 h-4" />文字内容
                  </TabsTrigger>
                  <TabsTrigger value="images" className="gap-1.5">
                    <ImageIcon className="w-4 h-4" />图片管理
                  </TabsTrigger>
                  <TabsTrigger value="news" className="gap-1.5">
                    <Newspaper className="w-4 h-4" />新闻管理
                  </TabsTrigger>
                </TabsList>

                {/* Content Editor */}
                <TabsContent value="content" className="flex-1 min-h-0 m-0">
                  <div className="flex h-full">
                    <div className="w-36 shrink-0 border-r bg-gray-50 overflow-y-auto p-2 space-y-0.5">
                      {Object.entries(sectionLabels).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => setActiveSection(key)}
                          className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                            activeSection === key
                              ? 'bg-teal-100 text-teal-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      <div className="flex items-center justify-between mb-1 sticky top-0 bg-white py-2 z-10">
                        <h3 className="font-bold text-gray-900 text-sm">{sectionLabels[activeSection]}</h3>
                        <Button size="sm" onClick={handleSaveContent} disabled={saving} className="bg-teal-600 hover:bg-teal-700 text-white h-8 text-xs">
                          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                          {saving ? '保存中...' : saved ? '已保存' : '保存全部'}
                        </Button>
                      </div>

                      <div className="rounded-lg border bg-teal-50/50 border-teal-100 p-3 mb-3">
                        <p className="text-xs text-teal-700">
                          每个字段包含中文和英文两个输入框，修改后点击「保存全部」即可实时生效。
                        </p>
                      </div>

                      {contentSections[activeSection]?.map((key) => (
                        <Card key={key} className="border shadow-none">
                          <CardHeader className="pb-1 pt-3 px-4">
                            <CardTitle className="text-[10px] font-mono text-gray-400">{key}</CardTitle>
                          </CardHeader>
                          <CardContent className="px-4 pb-4 space-y-2">
                            <div>
                              <label className="text-[10px] font-medium text-gray-400 mb-0.5 block">中文</label>
                              <Textarea
                                value={editContents[key]?.zh || ''}
                                onChange={(e) => handleUpdateField(key, 'zh', e.target.value)}
                                rows={key.includes('_p') || key.includes('desc') || key.includes('summary') ? 3 : 1}
                                className="text-xs bg-white border-gray-200 focus:border-teal-400 resize-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-medium text-gray-400 mb-0.5 block">English</label>
                              <Textarea
                                value={editContents[key]?.en || ''}
                                onChange={(e) => handleUpdateField(key, 'en', e.target.value)}
                                rows={key.includes('_p') || key.includes('desc') || key.includes('summary') ? 3 : 1}
                                className="text-xs bg-white border-gray-200 focus:border-teal-400 resize-none"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Image Manager */}
                <TabsContent value="images" className="flex-1 overflow-y-auto p-6 m-0">
                  <div className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-bold text-gray-900 mb-3 text-sm">上传图片</h3>
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-teal-400 hover:bg-teal-50/50 transition-colors">
                          {uploading ? <Loader2 className="w-8 h-8 text-teal-500 animate-spin" /> : <Upload className="w-8 h-8 text-gray-400 mb-2" />}
                          <span className="text-sm text-gray-500">{uploading ? '上传中...' : '点击选择图片上传'}</span>
                          <span className="text-xs text-gray-400 mt-1">支持 JPG, PNG, SVG, WebP</span>
                          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                        </label>
                      </CardContent>
                    </Card>

                    <div>
                      <h3 className="font-bold text-gray-900 mb-3 text-sm">已上传图片 ({images.length})</h3>
                      {images.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">暂无图片</p>
                      ) : (
                        <div className="grid grid-cols-3 gap-3">
                          {images.map((img) => (
                            <Card key={img.id} className="overflow-hidden group relative">
                              <div className="aspect-square bg-gray-100">
                                <img src={img.url} alt={img.filename} className="w-full h-full object-cover" />
                              </div>
                              <div className="p-2">
                                <p className="text-[10px] text-teal-600 font-mono truncate">{img.url}</p>
                              </div>
                              <button
                                onClick={() => handleDeleteImage(img.id)}
                                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* News Manager */}
                <TabsContent value="news" className="flex-1 overflow-y-auto p-6 m-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 text-sm">新闻列表 ({newsList.length})</h3>
                      <Button size="sm" onClick={() => setEditingNews({ date: new Date().toISOString().slice(0, 10), titleZh: '', titleEn: '', summaryZh: '', summaryEn: '' })} className="bg-teal-600 hover:bg-teal-700 text-white h-8 text-xs">
                        <Plus className="w-3.5 h-3.5 mr-1" />新增
                      </Button>
                    </div>

                    {newsList.map((item) => (
                      <Card key={item.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] text-gray-400">{item.date}</span>
                              </div>
                              <p className="text-sm font-medium text-gray-900 truncate">{item.titleZh}</p>
                              <p className="text-xs text-gray-500 truncate mt-0.5">{item.titleEn}</p>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <Button size="sm" variant="outline" onClick={() => setEditingNews(item)} className="h-7 text-xs px-2">编辑</Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteNews(item.id)} className="h-7 text-xs px-2 text-red-600 hover:bg-red-50">删除</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {editingNews && (
                      <Card className="border-2 border-teal-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">{editingNews.id ? '编辑新闻' : '新增新闻'}</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setEditingNews(null)}><X className="w-4 h-4" /></Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <label className="text-xs text-gray-500">日期</label>
                            <Input value={editingNews.date || ''} onChange={(e) => setEditingNews({ ...editingNews, date: e.target.value })} className="h-9 text-sm" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-gray-500">中文标题</label>
                              <Input value={editingNews.titleZh || ''} onChange={(e) => setEditingNews({ ...editingNews, titleZh: e.target.value })} className="h-9 text-sm" />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">English Title</label>
                              <Input value={editingNews.titleEn || ''} onChange={(e) => setEditingNews({ ...editingNews, titleEn: e.target.value })} className="h-9 text-sm" />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">中文摘要</label>
                            <Textarea value={editingNews.summaryZh || ''} onChange={(e) => setEditingNews({ ...editingNews, summaryZh: e.target.value })} rows={3} className="text-sm resize-none" />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">English Summary</label>
                            <Textarea value={editingNews.summaryEn || ''} onChange={(e) => setEditingNews({ ...editingNews, summaryEn: e.target.value })} rows={3} className="text-sm resize-none" />
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" size="sm" onClick={() => setEditingNews(null)}>取消</Button>
                            <Button size="sm" onClick={handleSaveNews} disabled={saving} className="bg-teal-600 hover:bg-teal-700 text-white">
                              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              保存
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
