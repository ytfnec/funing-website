'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Image URL keys that should sync zh/en automatically
const IMAGE_KEYS = [
  'hero_bg_image',
  'about_image',
  'prod_pcb_image',
  'prod_pcba_image',
  'prod_odm_image',
  'news_placeholder_image',
];

// Fields to show in the admin panel (grouped)
const FIELD_GROUPS = [
  {
    label: '导航 Navigation',
    keys: ['nav_home', 'nav_about', 'nav_products', 'nav_news', 'nav_contact'],
  },
  {
    label: '横幅图片 Hero Image',
    keys: ['hero_bg_image'],
    type: 'image',
  },
  {
    label: '横幅 Hero',
    keys: ['hero_title', 'hero_subtitle', 'hero_cta'],
  },
  {
    label: '关于我们图片 About Image',
    keys: ['about_image'],
    type: 'image',
  },
  {
    label: '关于我们 About',
    keys: ['about_title', 'about_subtitle', 'about_desc', 'about_desc2'],
  },
  {
    label: '产品图片 Product Images',
    keys: ['prod_pcb_image', 'prod_pcba_image', 'prod_odm_image'],
    type: 'image',
  },
  {
    label: '产品 Products',
    keys: ['prod_pcb_title', 'prod_pcb_desc', 'prod_pcba_title', 'prod_pcba_desc', 'prod_odm_title', 'prod_odm_desc'],
  },
  {
    label: '新闻 News',
    keys: ['news_title', 'news_subtitle', 'news_readmore'],
  },
  {
    label: '联系 Contact',
    keys: ['contact_title', 'contact_subtitle', 'contact_address', 'contact_phone', 'contact_email'],
  },
  {
    label: '页脚 Footer',
    keys: ['footer_copyright'],
  },
];

export default function AdminPanel() {
  const [contents, setContents] = useState<Record<string, { zh: string; en: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('content');
  const [uploading, setUploading] = useState(false);
  const [imageList, setImageList] = useState<any[]>([]);

  // Fetch content from the SAME API as the frontend uses
  const fetchContent = useCallback(async () => {
    try {
      console.log('[AdminPanel] Fetching content...');
      const res = await fetch(`/api/site/content?_t=${Date.now()}`);
      if (!res.ok) {
        console.error('[AdminPanel] Fetch failed:', res.status);
        return;
      }
      const data = await res.json();
      console.log('[AdminPanel] Received keys:', Object.keys(data.contents || data).length);
      
      // Handle both response formats (same logic as ContentContext)
      let contentData = data.contents;
      if (!contentData && typeof data === 'object' && !Array.isArray(data)) {
        const firstVal = Object.values(data)[0];
        if (firstVal && typeof firstVal === 'object' && ('zh' in firstVal || 'en' in firstVal)) {
          contentData = data;
        }
      }
      
      if (contentData) {
        setContents(contentData);
        console.log('[AdminPanel] Content loaded, image keys:',
          Object.keys(contentData).filter(k => k.includes('image'))
            .map(k => `${k}=${JSON.stringify(contentData[k])}`).join(' | ')
        );
      }
    } catch (err) {
      console.error('[AdminPanel] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch uploaded image list
  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/upload?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setImageList(data.images || []);
      }
    } catch (err) {
      console.error('[AdminPanel] Fetch images error:', err);
    }
  }, []);

  useEffect(() => {
    fetchContent();
    fetchImages();
  }, [fetchContent, fetchImages]);

  const updateField = (key: string, lang: 'zh' | 'en', value: string) => {
    setContents(prev => {
      const updated = { ...prev };
      if (!updated[key]) updated[key] = { zh: '', en: '' };
      updated[key] = { ...updated[key], [lang]: value };

      // For image keys, auto-sync zh/en
      if (IMAGE_KEYS.includes(key)) {
        updated[key] = { zh: value, en: value };
      }

      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('保存成功！Saved successfully!');
      } else {
        setMessage('保存失败: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      setMessage('保存失败: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'general');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('上传成功！Uploaded! URL: ' + data.url);
        fetchImages();
      } else {
        setMessage('上传失败: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      setMessage('上传失败: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setMessage('链接已复制！Link copied!');
  };

  const useImage = (url: string) => {
    // Find the first empty image field and fill it
    for (const key of IMAGE_KEYS) {
      const current = contents[key]?.zh || '';
      if (!current || current.trim() === '') {
        updateField(key, 'zh', url);
        setMessage(`图片URL已填入 ${key}`);
        return;
      }
    }
    setMessage('所有图片字段已有值，请手动粘贴');
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <p>加载中 Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">管理面板 Admin Panel</h1>
        <p className="text-sm text-gray-500 mt-1">fnec.net 内容管理</p>
      </div>

      <div className="flex">
        {/* Sidebar Tabs */}
        <div className="w-48 bg-white border-r min-h-screen p-4">
          <button
            onClick={() => setActiveTab('content')}
            className={`w-full text-left px-3 py-2 rounded mb-2 ${activeTab === 'content' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            内容编辑
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`w-full text-left px-3 py-2 rounded mb-2 ${activeTab === 'images' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            图片上传
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'content' && (
            <>
              {/* Save Button */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium"
                >
                  {saving ? '保存中...' : '保存所有内容 Save All'}
                </button>
                <button
                  onClick={() => { fetchContent(); setMessage('已刷新 Refreshed'); }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                >
                  刷新 Reload
                </button>
                {message && (
                  <span className="text-sm text-green-600">{message}</span>
                )}
              </div>

              {/* Debug Info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 text-sm">
                <p className="font-medium text-yellow-800">调试信息 Debug Info:</p>
                <p className="text-yellow-700">
                  已加载 {Object.keys(contents).length} 个字段。
                  图片字段: {IMAGE_KEYS.map(k => `${k}=[${contents[k]?.zh || '(空)'}]`).join(', ')}
                </p>
              </div>

              {/* Field Groups */}
              {FIELD_GROUPS.map((group, gi) => (
                <div key={gi} className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b font-medium text-gray-700">
                    {group.label}
                  </div>
                  <div className="p-4 space-y-4">
                    {group.keys.map(key => {
                      const isImage = group.type === 'image' || IMAGE_KEYS.includes(key);
                      const zhVal = contents[key]?.zh || '';
                      const enVal = contents[key]?.en || '';
                      return (
                        <div key={key} className={isImage ? 'border border-blue-200 rounded-lg p-3 bg-blue-50/30' : ''}>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            {key} {isImage && '🖼️'}
                          </label>
                          {isImage && zhVal && (
                            <div className="mb-2">
                              <img
                                src={zhVal}
                                alt={key}
                                className="h-24 w-auto rounded border"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-xs text-gray-400">中文</span>
                              <input
                                type={isImage ? 'url' : 'text'}
                                value={zhVal}
                                onChange={e => updateField(key, 'zh', e.target.value)}
                                className="w-full border rounded px-2 py-1 text-sm"
                                placeholder={isImage ? '粘贴图片URL或上传图片' : ''}
                              />
                            </div>
                            <div>
                              <span className="text-xs text-gray-400">English</span>
                              <input
                                type={isImage ? 'url' : 'text'}
                                value={enVal}
                                onChange={e => updateField(key, 'en', e.target.value)}
                                className="w-full border rounded px-2 py-1 text-sm"
                                placeholder={isImage ? 'Paste image URL or upload' : ''}
                              />
                            </div>
                          </div>
                          {isImage && (
                            <p className="text-xs text-gray-400 mt-1">
                              提示：图片URL会自动同步中英文。可在&quot;图片上传&quot;标签页上传图片后复制链接。
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'images' && (
            <>
              {/* Upload Area */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="font-medium text-gray-700 mb-4">上传图片 Upload Image</h3>
                <div className="flex items-center gap-4">
                  <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer">
                    {uploading ? '上传中...' : '选择文件 Select File'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {message && <span className="text-sm text-green-600">{message}</span>}
                </div>
              </div>

              {/* Image List */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-medium text-gray-700 mb-4">
                  已上传图片 ({imageList.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imageList.map((img: any) => (
                    <div key={img.id} className="border rounded-lg overflow-hidden">
                      <img
                        src={img.url}
                        alt={img.filename}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-2">
                        <p className="text-xs text-gray-500 truncate">{img.filename}</p>
                        <div className="flex gap-1 mt-1">
                          <button
                            onClick={() => copyToClipboard(img.url)}
                            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                          >
                            复制链接
                          </button>
                          <button
                            onClick={() => useImage(img.url)}
                            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded"
                          >
                            使用
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {imageList.length === 0 && (
                    <p className="text-gray-400 text-sm col-span-4">暂无已上传图片</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}