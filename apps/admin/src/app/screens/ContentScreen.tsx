import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Plus,
  Edit,
  Eye,
  Globe,
  Save,
  CheckCircle,
  Clock,
  Upload,
  Settings,
  ChevronRight,
  X,
  RotateCcw,
} from 'lucide-react';
import { useApi } from '../context/ApiContext';
import { toast } from '../components/ui/toast';

interface Page {
  id: string;
  name: string;
  slug: string;
  status: 'Published' | 'Draft';
  lastModified: string;
  modifiedBy: string;
  version: number;
  updatedAtRaw: string;
  isDefault: boolean;
}

interface Section {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
}

function mapApiToPage(row: Record<string, unknown>): Page {
  // Handle both camelCase (ORM) and snake_case (Raw SQL)
  let updatedAt = (row.updatedAt || row.updated_at || row.createdAt || row.created_at) as string | undefined;

  // If date string doesn't include 'Z' or specific timezone, append 'Z' to treat as UTC
  if (updatedAt && !updatedAt.includes('Z') && !updatedAt.includes('+')) {
    updatedAt = updatedAt + 'Z';
  }

  const dateStr = updatedAt ? new Date(updatedAt).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }) : '-';

  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? row.sectionKey ?? ''),
    slug: String(row.slug ?? ''),
    status: (row.status as Page['status']) ?? 'Draft',
    lastModified: dateStr,
    modifiedBy: String(row.modifiedBy ?? row.modified_by ?? '-'),
    version: Number(row.version ?? 1),
    updatedAtRaw: updatedAt || '',
    isDefault: !!(row.isDefault ?? row.is_default),
  };
}

const homeSections: Section[] = [
  { id: '1', name: 'Hero Section', type: 'hero', enabled: true },
  { id: '2', name: 'Mission/Vision Block', type: 'mission', enabled: true },
  { id: '3', name: 'About Block', type: 'about', enabled: true },
  { id: '4', name: 'Quick Stats Block', type: 'stats', enabled: true },
];

export function ContentScreen() {
  const { api, apiFetch, user } = useApi();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/website/content?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error('Failed to load content');

      const responseData = await res.json();
      const list = Array.isArray(responseData.data) ? responseData.data : [];
      const mappedPages = list.map((row: Record<string, unknown>) => mapApiToPage(row));

      setPages(mappedPages);
      setTotal(responseData.total || 0);
      setTotalPages(responseData.totalPages || 0);
    } catch (e: unknown) {
      const errorMsg = (e as Error)?.message ?? 'Failed to load content';
      toast.error(errorMsg);
      setPages([]);
    } finally {
      setLoading(false);
    }
  }, [apiFetch, page, limit]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [publishReason, setPublishReason] = useState('');

  // Version history state
  const [versions, setVersions] = useState<any[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [restoringVersion, setRestoringVersion] = useState(false);

  // Page form state
  const [pageName, setPageName] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [sectionKey, setSectionKey] = useState('');
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [isSectionKeyEdited, setIsSectionKeyEdited] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const [showDefaultConfirm, setShowDefaultConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePageForm = () => {
    const newErrors: Record<string, string> = {};
    const missingFields: string[] = [];

    // Information Section
    if (!(pageName || '').trim()) {
      newErrors.pageName = 'Page Name is required';
      missingFields.push('Page Name');
    }
    if (!(pageSlug || '').trim()) {
      newErrors.pageSlug = 'URL Slug is required';
      missingFields.push('URL Slug');
    }
    if (!(sectionKey || '').trim()) {
      newErrors.sectionKey = 'Section Key is required';
      missingFields.push('Section Key');
    }

    // SEO Section
    if (!(metaTitle || '').trim()) {
      newErrors.metaTitle = 'Meta Title is required';
      missingFields.push('Meta Title (SEO)');
    }
    if (!(metaDescription || '').trim()) {
      newErrors.metaDescription = 'Meta Description is required';
      missingFields.push('Meta Description (SEO)');
    }
    if (!(canonicalUrl || '').trim()) {
      newErrors.canonicalUrl = 'Canonical URL is required';
      missingFields.push('Canonical URL (SEO)');
    }
    if (!(ogImageUrl || '').trim()) {
      newErrors.ogImageUrl = 'OG Image is required';
      missingFields.push('OG Image (SEO)');
    }

    // Hero Section
    if (!(heroHeadline || '').trim()) {
      newErrors.heroHeadline = 'Headline is required';
      missingFields.push('Hero Headline');
    }
    if (!(heroSubheadline || '').trim()) {
      newErrors.heroSubheadline = 'Subheadline is required';
      missingFields.push('Hero Subheadline');
    }
    if (!(heroCTAText || '').trim()) {
      newErrors.heroCTAText = 'CTA Text is required';
      missingFields.push('Hero CTA Text');
    }
    if (!(heroCTALink || '').trim()) {
      newErrors.heroCTALink = 'CTA Link is required';
      missingFields.push('Hero CTA Link');
    }
    if (!(heroBackgroundUrl || '').trim()) {
      newErrors.heroBackgroundUrl = 'Background Image is required';
      missingFields.push('Hero Background');
    }

    // Mission Block
    if (!(missionTitle || '').trim()) {
      newErrors.missionTitle = 'Mission Title is required';
      missingFields.push('Mission Title');
    }
    if (!(missionDescription || '').trim()) {
      newErrors.missionDescription = 'Mission Description is required';
      missingFields.push('Mission Description');
    }

    // Vision Block
    if (!(visionTitle || '').trim()) {
      newErrors.visionTitle = 'Vision Title is required';
      missingFields.push('Vision Title');
    }
    if (!(visionDescription || '').trim()) {
      newErrors.visionDescription = 'Vision Description is required';
      missingFields.push('Vision Description');
    }

    // About Block
    if (!(aboutTitle || '').trim()) {
      newErrors.aboutTitle = 'About Title is required';
      missingFields.push('About Title');
    }
    if (!(aboutDescription || '').trim()) {
      newErrors.aboutDescription = 'About Description is required';
      missingFields.push('About Description');
    }

    // Quick Stats
    stats.forEach((stat, index) => {
      if (!(stat.label || '').trim()) {
        newErrors[`statLabel${index}`] = 'Label is required';
        missingFields.push(`Stat ${index + 1} Label`);
      }
      if (!(stat.value || '').trim()) {
        newErrors[`statValue${index}`] = 'Value is required';
        missingFields.push(`Stat ${index + 1} Value`);
      }
    });

    setErrors(newErrors);

    if (missingFields.length > 0) {
      // If there's a lot of missing fields, summarize
      if (missingFields.length > 3) {
        toast.error(`Please fill all required fields. Missing ${missingFields.length} items.`);
      } else {
        toast.error(`Please fill: ${missingFields.join(', ')}`);
      }
      return false;
    }

    return true;
  };

  // SEO state
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  // Hero section state
  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroSubheadline, setHeroSubheadline] = useState('');
  const [heroCTAText, setHeroCTAText] = useState('');
  const [heroCTALink, setHeroCTALink] = useState('');
  const [showDonationStats, setShowDonationStats] = useState(false);
  const [heroBackgroundUrl, setHeroBackgroundUrl] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');

  // Mission/Vision state
  const [missionTitle, setMissionTitle] = useState('');
  const [missionDescription, setMissionDescription] = useState('');
  const [visionTitle, setVisionTitle] = useState('');
  const [visionDescription, setVisionDescription] = useState('');
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutDescription, setAboutDescription] = useState('');
  const [stats, setStats] = useState([
    { label: '', value: '' },
    { label: '', value: '' },
    { label: '', value: '' },
    { label: '', value: '' },
  ]);

  // Upload state
  const [uploadingHeroBackground, setUploadingHeroBackground] = useState(false);
  const [uploadingOgImage, setUploadingOgImage] = useState(false);

  const handleEditPage = async (page: Page) => {
    setSelectedPage(page);
    setPageName(page.name);
    setPageSlug(page.slug);
    setIsDefault(page.isDefault);
    setIsSlugEdited(true); // Don't auto-sync when editing existing page
    setIsSectionKeyEdited(true);
    setErrors({});

    try {
      // Fetch full page data to load content
      const res = await api.websiteContentApi.websiteContentControllerFindOne(parseInt(page.id));
      const data = (res as { data?: any }).data;

      if (data) {
        setSectionKey(data.sectionKey || page.name.toLowerCase().replace(/\s+/g, '_'));

        // Parse contentJson and load into state
        if (data.contentJson) {
          try {
            const content = JSON.parse(data.contentJson);

            // Load SEO data
            if (content.meta) {
              setMetaTitle(content.meta.title || '');
              setMetaDescription(content.meta.description || '');
              setCanonicalUrl(content.meta.canonicalUrl || '');
            }

            // Load hero section data
            if (content.sections?.hero) {
              setHeroHeadline(content.sections.hero.headline || '');
              setHeroSubheadline(content.sections.hero.subheadline || '');
              setHeroCTAText(content.sections.hero.ctaText || '');
              setHeroCTALink(content.sections.hero.ctaLink || '');
              setShowDonationStats(content.sections.hero.showStats ?? false);
              setHeroBackgroundUrl(content.sections.hero.backgroundUrl || '');
            } else {
              // Reset to empty if no hero section exists
              setHeroHeadline('');
              setHeroSubheadline('');
              setHeroCTAText('');
              setHeroCTALink('');
              setShowDonationStats(false);
              setHeroBackgroundUrl('');
            }

            // Load mission section data
            if (content.sections?.mission) {
              setMissionTitle(content.sections.mission.title || '');
              setMissionDescription(content.sections.mission.description || '');
            } else {
              setMissionTitle('');
              setMissionDescription('');
            }

            // Load vision section data
            if (content.sections?.vision) {
              setVisionTitle(content.sections.vision.title || '');
              setVisionDescription(content.sections.vision.description || '');
            } else {
              setVisionTitle('');
              setVisionDescription('');
            }

            // Load about section data
            if (content.sections?.about) {
              setAboutTitle(content.sections.about.title || '');
              setAboutDescription(content.sections.about.description || '');
            } else {
              setAboutTitle('');
              setAboutDescription('');
            }

            // Load stats section data
            if (content.sections?.stats && Array.isArray(content.sections.stats)) {
              const loadedStats = [...content.sections.stats];
              // Ensure we have exactly 4 items
              while (loadedStats.length < 4) {
                loadedStats.push({ label: '', value: '' });
              }
              setStats(loadedStats.slice(0, 4));
            } else {
              setStats([
                { label: '', value: '' },
                { label: '', value: '' },
                { label: '', value: '' },
                { label: '', value: '' },
              ]);
            }

            // Load OG Image
            if (content.meta) {
              setOgImageUrl(content.meta.ogImage || '');
            } else {
              setOgImageUrl('');
            }
          } catch (parseError) {
            console.error('Failed to parse contentJson:', parseError);
            toast.error('Failed to load page content');
          }
        }
        setPublishReason(data.publishReason || '');
      }
    } catch (e) {
      console.error('Failed to fetch page details:', e);
      toast.error('Failed to load page details');
    }

    setShowEditor(true);
  };

  const handleNewPage = () => {
    setSelectedPage(null);
    setPageName('');
    setPageSlug('');
    setSectionKey('');
    setIsDefault(false);
    setIsSlugEdited(false);
    setIsSectionKeyEdited(false);
    setErrors({});
    setMetaTitle('');
    setMetaDescription('');
    setCanonicalUrl('');
    setHeroHeadline('');
    setHeroSubheadline('');
    setHeroCTAText('');
    setHeroCTALink('');
    setShowDonationStats(false);
    setHeroBackgroundUrl('');
    setPublishReason('');
    setOgImageUrl('');
    setMissionTitle('');
    setMissionDescription('');
    setVisionTitle('');
    setVisionDescription('');
    setAboutTitle('');
    setAboutDescription('');
    setStats([
      { label: '', value: '' },
      { label: '', value: '' },
      { label: '', value: '' },
      { label: '', value: '' },
    ]);
    setShowEditor(true);
  };

  const handleSaveDraft = async () => {
    if (!validatePageForm()) {
      return;
    }
    try {
      setSaving(true);

      // Build content JSON
      const contentData = {
        meta: {
          title: metaTitle,
          description: metaDescription,
          canonicalUrl: canonicalUrl,
          ogImage: ogImageUrl,
        },
        sections: {
          hero: {
            headline: heroHeadline,
            subheadline: heroSubheadline,
            ctaText: heroCTAText,
            ctaLink: heroCTALink,
            showStats: showDonationStats,
            backgroundUrl: heroBackgroundUrl,
          },
          mission: {
            title: missionTitle,
            description: missionDescription,
          },
          vision: {
            title: visionTitle,
            description: visionDescription,
          },
          about: {
            title: aboutTitle,
            description: aboutDescription,
          },
          stats: stats,
        },
      };

      const payload = {
        name: pageName.trim(),
        slug: pageSlug.trim() || pageName.trim().toLowerCase().replace(/\s+/g, '-'),
        sectionKey: sectionKey.trim() || pageName.trim().toLowerCase().replace(/\s+/g, '_'),
        contentJson: JSON.stringify(contentData),
        status: 'Draft',
        modifiedBy: user?.email || 'Admin',
        version: selectedPage ? (selectedPage.version + 1) : 1,
        isDefault,
        publishReason: publishReason,
      };

      if (selectedPage) {
        // Update existing
        const res = await apiFetch(`/website/content/${selectedPage.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
        toast.success('Draft saved successfully');
      } else {
        // Create new
        const res = await apiFetch('/website/content', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
        toast.success('Draft created successfully');
      }

      await fetchContent();
      setShowEditor(false);
    } catch (e: unknown) {
      const errorMsg = (e as Error)?.message ?? 'Failed to save draft';
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = () => {
    if (!validatePageForm()) {
      return;
    }
    // Only show confirmation if we are changing which page is default
    // i.e., marking a new page as default or marking an existing non-default page as default
    if (isDefault && (!selectedPage || !selectedPage.isDefault)) {
      setShowDefaultConfirm(true);
    } else {
      setShowReasonModal(true);
    }
  };

  const confirmPublish = async () => {
    if (!validatePageForm()) {
      return;
    }
    try {
      setSaving(true);

      // Build content JSON
      const contentData = {
        meta: {
          title: metaTitle,
          description: metaDescription,
          canonicalUrl: canonicalUrl,
          ogImage: ogImageUrl,
        },
        sections: {
          hero: {
            headline: heroHeadline,
            subheadline: heroSubheadline,
            ctaText: heroCTAText,
            ctaLink: heroCTALink,
            showStats: showDonationStats,
            backgroundUrl: heroBackgroundUrl,
          },
          mission: {
            title: missionTitle,
            description: missionDescription,
          },
          vision: {
            title: visionTitle,
            description: visionDescription,
          },
          about: {
            title: aboutTitle,
            description: aboutDescription,
          },
          stats: stats,
        },
      };

      const payload = {
        name: pageName.trim(),
        slug: pageSlug.trim() || pageName.trim().toLowerCase().replace(/\s+/g, '-'),
        sectionKey: sectionKey.trim() || pageName.trim().toLowerCase().replace(/\s+/g, '_'),
        contentJson: JSON.stringify(contentData),
        status: 'Published',
        modifiedBy: user?.email || 'Admin',
        version: selectedPage ? (selectedPage.version + 1) : 1,
        isDefault,
        publishReason: publishReason,
      };

      if (selectedPage) {
        const res = await apiFetch(`/website/content/${selectedPage.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
        toast.success('Page published successfully');
      } else {
        const res = await apiFetch('/website/content', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
        toast.success('Page created and published successfully');
      }

      await fetchContent();
      setShowReasonModal(false);
      setPublishReason('');
      setShowEditor(false);
    } catch (e: unknown) {
      const errorMsg = (e as Error)?.message ?? 'Failed to publish';
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Published'
      ? 'bg-[#E8F5E9] text-[#2E7D32]'
      : 'bg-[#FFF3E0] text-[#E65100]';
  };

  // Version history handlers
  const fetchVersionHistory = useCallback(async (pageId: string) => {
    try {
      setLoadingVersions(true);
      // Fetch all versions of this page sorted by version DESC
      const res = await apiFetch(`/website/content?sectionKey=${pages.find((p: any) => p.id === pageId)?.slug || ''}`);
      if (!res.ok) throw new Error('Failed to load versions');

      const data = await res.json();
      const allVersions = Array.isArray(data) ? data : [];

      // Sort by version descending
      const sortedVersions = allVersions.sort((a: any, b: any) => (b.version || 0) - (a.version || 0));
      setVersions(sortedVersions);
    } catch (e) {
      console.error('Failed to fetch version history:', e);
      toast.error('Failed to load version history');
      setVersions([]);
    } finally {
      setLoadingVersions(false);
    }
  }, [apiFetch, pages]);

  const handleRestoreVersion = async (versionData: any) => {
    if (!selectedPage) return;

    try {
      setRestoringVersion(true);

      // Create new version with restored content
      const payload = {
        name: versionData.name || selectedPage.name,
        slug: versionData.slug || selectedPage.slug,
        sectionKey: versionData.sectionKey,
        contentJson: versionData.contentJson,
        status: 'Draft', // Restore as draft
        modifiedBy: user?.email || 'Admin',
        version: selectedPage.version + 1, // Increment version
      };

      const res = await apiFetch(`/website/content/${selectedPage.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      toast.success(`Restored to version ${versionData.version}`);

      // Reload page data
      await fetchContent();
      await handleEditPage(selectedPage);
      setShowVersionHistory(false);
    } catch (e) {
      console.error('Restore error:', e);
      toast.error((e as Error)?.message || 'Failed to restore version');
    } finally {
      setRestoringVersion(false);
    }
  };

  const handleViewLive = (page: Page) => {
    // Open the live page in a new tab
    const baseUrl = import.meta.env.VITE_PUBLIC_SITE_URL || 'http://localhost:3001';
    const url = `${baseUrl}/${page.slug}`;
    window.open(url, '_blank');
  };

  // File upload handlers
  const handleHeroBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPG, PNG, GIF, WebP) or video (MP4, WebM) file');
      return;
    }

    // Validate file size (50MB max for videos, 10MB for images)
    const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${file.type.startsWith('video/') ? '50MB' : '10MB'}`);
      return;
    }

    try {
      setUploadingHeroBackground(true);

      // Get token from sessionStorage
      const authData = sessionStorage.getItem('aram_admin_auth');
      const token = authData ? JSON.parse(authData).accessToken : null;

      if (!token) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

      const response = await fetch(`${baseUrl}/api/website/gallery/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Upload failed');
      }

      const data = await response.json();
      setHeroBackgroundUrl(data.imagePath || data.imageUrl || data.url || '');
      setErrors((prev: Record<string, string>) => ({ ...prev, heroBackgroundUrl: '' }));
      toast.success('Background uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error((error as Error)?.message || 'Failed to upload file');
    } finally {
      setUploadingHeroBackground(false);
      e.target.value = '';
    }
  };

  const handleOgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setUploadingOgImage(true);

      // Get token from sessionStorage
      const authData = sessionStorage.getItem('aram_admin_auth');
      const token = authData ? JSON.parse(authData).accessToken : null;

      if (!token) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

      const response = await fetch(`${baseUrl}/api/website/gallery/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Upload failed');
      }

      const data = await response.json();
      setOgImageUrl(data.imagePath || data.imageUrl || data.url || '');
      setErrors((prev: Record<string, string>) => ({ ...prev, ogImageUrl: '' }));
      toast.success('OG Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error((error as Error)?.message || 'Failed to upload image');
    } finally {
      setUploadingOgImage(false);
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col bg-[#F8F8F8]">
      {/* Header */}
      <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[24px] mb-[24px]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] leading-[28px] font-semibold text-[#0D0D0D]">
              Website Content Management
            </h1>
            <p className="text-[13px] leading-[18px] text-[#6E6E6E] mt-1">
              Manage public website pages with versioning and publish workflow
            </p>
          </div>

          <button
            onClick={handleNewPage}
            className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] transition-colors flex items-center gap-2 text-[14px] font-medium text-white"
          >
            <Plus className="w-4 h-4" />
            New Page
          </button>
        </div>
      </div>


      {loading ? (
        <div className="py-12 text-center text-[14px] text-[#6E6E6E]">Loading content...</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-[16px] mb-[24px]">
            <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
              <p className="text-[13px] text-[#6E6E6E] mb-1">Total Pages</p>
              <p className="text-[24px] font-semibold text-[#0D0D0D]">{pages.length}</p>
            </div>

            <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
              <p className="text-[13px] text-[#6E6E6E] mb-1">Published</p>
              <p className="text-[24px] font-semibold text-[#2E7D32]">
                {pages.filter((p: Page) => p.status === 'Published').length}
              </p>
            </div>

            <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
              <p className="text-[13px] text-[#6E6E6E] mb-1">Drafts</p>
              <p className="text-[24px] font-semibold text-[#E65100]">
                {pages.filter((p: Page) => p.status === 'Draft').length}
              </p>
            </div>

            <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
              <p className="text-[13px] text-[#6E6E6E] mb-1">Last Updated</p>
              <p className="text-[13px] font-semibold text-[#0D0D0D]">
                {pages.length > 0 ? pages[0].lastModified : '—'}
              </p>
            </div>
          </div>

          {/* Pages Table */}
          <div className="bg-white rounded-[16px] border border-[#DBDBDB] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8F8F8] border-b border-[#DBDBDB]">
                    <th className="h-[48px] px-[16px] text-left text-[13px] font-semibold text-[#3D3D3D]">
                      Page Name
                    </th>
                    <th className="h-[48px] px-[16px] text-left text-[13px] font-semibold text-[#3D3D3D]">
                      URL Slug
                    </th>
                    <th className="h-[48px] px-[16px] text-center text-[13px] font-semibold text-[#3D3D3D]">
                      Status
                    </th>
                    <th className="h-[48px] px-[16px] text-center text-[13px] font-semibold text-[#3D3D3D]">
                      Default
                    </th>

                    <th className="h-[48px] px-[16px] text-left text-[13px] font-semibold text-[#3D3D3D]">
                      Last Modified
                    </th>

                    <th className="h-[48px] px-[16px] text-left text-[13px] font-semibold text-[#3D3D3D]">
                      Modified By
                    </th>
                    <th className="h-[48px] px-[16px] text-center text-[13px] font-semibold text-[#3D3D3D]">
                      Version
                    </th>
                    <th className="h-[48px] px-[16px] text-right text-[13px] font-semibold text-[#3D3D3D]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page: Page) => (
                    <tr key={page.id} className="border-b border-[#DBDBDB] hover:bg-[#F8F8F8]">
                      <td className="h-[56px] px-[16px] text-[14px] text-[#0D0D0D] font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#6E6E6E]" />
                          {page.name}
                        </div>
                      </td>
                      <td className="h-[56px] px-[16px] text-[13px] text-[#6E6E6E] font-mono">
                        {page.slug}
                      </td>
                      <td className="h-[56px] px-[16px] text-center">
                        <span
                          className={`inline-block px-2 py-1 text-[12px] font-medium rounded-full ${getStatusColor(
                            page.status
                          )}`}
                        >
                          {page.status}
                        </span>
                      </td>
                      <td className="h-[56px] px-[16px] text-center">
                        {page.isDefault && (
                          <span className="px-2 py-0.5 text-[10px] bg-[#E3F2FD] text-[#0288D1] font-bold rounded-full border border-[#B3E5FC] uppercase tracking-wider">
                            Default
                          </span>
                        )}
                      </td>
                      <td className="h-[56px] px-[16px] text-[13px] text-[#3D3D3D]">
                        {page.lastModified}
                      </td>
                      <td className="h-[56px] px-[16px] text-[13px] text-[#3D3D3D]">
                        {page.modifiedBy}
                      </td>
                      <td className="h-[56px] px-[16px] text-center text-[13px] text-[#3D3D3D]">
                        v{page.version}
                      </td>
                      <td className="h-[56px] px-[16px]">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditPage(page)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-[#3D3D3D]" />
                          </button>
                          <button
                            onClick={async () => {
                              setSelectedPage(page);
                              // Load the page content first
                              try {
                                const res = await api.websiteContentApi.websiteContentControllerFindOne(parseInt(page.id));
                                const data = (res as { data?: any }).data;
                                if (data) {
                                  // Load all content into state
                                  if (data.contentJson) {
                                    const content = JSON.parse(data.contentJson);
                                    if (content.meta) {
                                      setMetaTitle(content.meta.title || '');
                                      setMetaDescription(content.meta.description || '');
                                      setCanonicalUrl(content.meta.canonicalUrl || '');
                                      setOgImageUrl(content.meta.ogImage || '');
                                    }
                                    if (content.sections?.hero) {
                                      setHeroHeadline(content.sections.hero.headline || '');
                                      setHeroSubheadline(content.sections.hero.subheadline || '');
                                      setHeroCTAText(content.sections.hero.ctaText || '');
                                      setHeroCTALink(content.sections.hero.ctaLink || '');
                                      setShowDonationStats(content.sections.hero.showStats ?? false);
                                      setHeroBackgroundUrl(content.sections.hero.backgroundUrl || '');
                                    }
                                    if (content.sections?.mission) {
                                      setMissionTitle(content.sections.mission.title || '');
                                      setMissionDescription(content.sections.mission.description || '');
                                    }
                                    if (content.sections?.vision) {
                                      setVisionTitle(content.sections.vision.title || '');
                                      setVisionDescription(content.sections.vision.description || '');
                                    }
                                    if (content.sections?.about) {
                                      setAboutTitle(content.sections.about.title || '');
                                      setAboutDescription(content.sections.about.description || '');
                                    }
                                    if (content.sections?.stats && Array.isArray(content.sections.stats)) {
                                      const loadedStats = [...content.sections.stats];
                                      while (loadedStats.length < 4) {
                                        loadedStats.push({ label: '', value: '' });
                                      }
                                      setStats(loadedStats.slice(0, 4));
                                    }
                                  }
                                  setPageName(data.name || '');
                                  setPageSlug(data.slug || '');
                                  setSectionKey(data.sectionKey || '');
                                  setPublishReason(data.publishReason || '');
                                }
                              } catch (e) {
                                console.error('Failed to load page for preview:', e);
                              }
                              setShowPreview(true);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4 text-[#3D3D3D]" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPage(page);
                              fetchVersionHistory(page.id);
                              setShowVersionHistory(true);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                            title="Version History"
                          >
                            <Clock className="w-4 h-4 text-[#3D3D3D]" />
                          </button>
                          <button
                            onClick={() => handleViewLive(page)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                            title="View Live"
                          >
                            <Globe className="w-4 h-4 text-[#3D3D3D]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            {total > limit && (
              <div className="p-[16px] border-t border-[#DBDBDB] flex items-center justify-between flex-wrap gap-4 bg-white">
                <div className="text-[14px] text-[#6E6E6E]">
                  Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of {total} items
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1 || loading}
                    className="h-[40px] px-[16px] border border-[#DBDBDB] rounded-[8px] text-[14px] font-medium text-[#3D3D3D] bg-white hover:bg-[#F3F3F3] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 text-[14px] text-[#3D3D3D]">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages || loading}
                    className="h-[40px] px-[16px] border border-[#DBDBDB] rounded-[8px] text-[14px] font-medium text-[#3D3D3D] bg-white hover:bg-[#F3F3F3] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )
      }

      {/* Page Editor Modal */}
      {
        showEditor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[24px] overflow-auto">
            <div className="bg-white rounded-[16px] w-full max-w-[1200px] my-auto max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b border-[#DBDBDB] p-[24px] flex items-center justify-between rounded-t-[16px]">
                <div>
                  <h3 className="text-[18px] font-semibold text-[#0D0D0D]">
                    {selectedPage ? `Edit ${selectedPage.name}` : 'New Page'}
                  </h3>
                  <p className="text-[13px] text-[#6E6E6E] mt-1">
                    {selectedPage && `v${selectedPage.version} • ${selectedPage.status}`}
                  </p>
                </div>
                <button
                  onClick={() => setShowEditor(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                >
                  <X className="w-5 h-5 text-[#3D3D3D]" />
                </button>
              </div>

              <div className="p-[24px]">
                {/* Page Basic Info */}
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Page Name <span className="text-[#F36A4F]">*</span>
                    </label>
                    <input
                      type="text"
                      value={pageName}
                      onChange={(e) => {
                        const newName = e.target.value;
                        setPageName(newName);
                        if (newName.trim()) {
                          setErrors((prev: Record<string, string>) => ({ ...prev, pageName: '' }));
                        }
                        // Auto-generate slug and section key ONLY if they haven't been manually edited in this specific page context
                        if (!selectedPage) {
                          if (!isSlugEdited && !pageSlug) {
                            setPageSlug(newName.toLowerCase().replace(/\s+/g, '-'));
                          }
                          if (!isSectionKeyEdited && !sectionKey) {
                            setSectionKey(newName.toLowerCase().replace(/\s+/g, '_'));
                          }
                        }
                      }}
                      className={`w-full h-[44px] px-[12px] rounded-[12px] border text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] ${errors.pageName ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'
                        }`}
                      placeholder="e.g., Home, About Us, Contact"
                    />
                    {errors.pageName && (
                      <p className="text-[#F36A4F] text-[12px] mt-1">{errors.pageName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-[16px]">
                    <div>
                      <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                        URL Slug <span className="text-[#F36A4F]">*</span>
                      </label>
                      <input
                        type="text"
                        value={pageSlug}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPageSlug(val);
                          if (val.trim()) {
                            setErrors((prev: Record<string, string>) => ({ ...prev, pageSlug: '' }));
                          }
                          if (!selectedPage) setIsSlugEdited(true);
                        }}
                        className={`w-full h-[44px] px-[12px] rounded-[12px] border text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] font-mono ${errors.pageSlug ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'
                          }`}
                        placeholder="e.g., home, about-us"
                      />
                      {errors.pageSlug && (
                        <p className="text-[#F36A4F] text-[12px] mt-1">{errors.pageSlug}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                        Section Key <span className="text-[#F36A4F]">*</span>
                      </label>
                      <input
                        type="text"
                        value={sectionKey}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSectionKey(val);
                          if (val.trim()) {
                            setErrors((prev: Record<string, string>) => ({ ...prev, sectionKey: '' }));
                          }
                          if (!selectedPage) setIsSectionKeyEdited(true);
                        }}
                        className={`w-full h-[44px] px-[12px] rounded-[12px] border text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] font-mono ${errors.sectionKey ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'
                          }`}
                        placeholder="e.g., home, about_us"
                      />
                      {errors.sectionKey && (
                        <p className="text-[#F36A4F] text-[12px] mt-1">{errors.sectionKey}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="w-4 h-4 accent-[#F36A4F]"
                    />
                    <span className="text-[14px] font-medium text-[#3D3D3D]">
                      Make as default
                    </span>
                  </label>
                </div>

                {/* SEO Settings */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowSEO(!showSEO)}
                    className="w-full flex items-center justify-between p-[16px] bg-[#F8F8F8] rounded-[12px] hover:bg-[#F3F3F3] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-[#3D3D3D]" />
                      <span className="text-[14px] font-semibold text-[#0D0D0D]">
                        SEO Settings
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-[#3D3D3D] transition-transform ${showSEO ? 'rotate-90' : ''
                        }`}
                    />
                  </button>

                  {showSEO && (
                    <div className="mt-4 p-[16px] bg-[#F8F8F8] rounded-[12px] space-y-4">
                      <div>
                        <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                          Meta Title <span className="text-[#F36A4F]">*</span>
                        </label>
                        <input
                          type="text"
                          value={metaTitle}
                          onChange={(e) => {
                            setMetaTitle(e.target.value);
                            if (e.target.value.trim()) {
                              setErrors((prev: Record<string, string>) => ({ ...prev, metaTitle: '' }));
                            }
                          }}
                          className={`w-full h-[44px] px-[12px] rounded-[12px] border text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] ${errors.metaTitle ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'
                            }`}
                          placeholder="Max 60 characters"
                          maxLength={60}
                        />
                        {errors.metaTitle && (
                          <p className="text-[#F36A4F] text-[12px] mt-1">{errors.metaTitle}</p>
                        )}
                        <p className="text-[11px] text-[#6E6E6E] mt-1">{metaTitle.length}/60</p>
                      </div>

                      <div>
                        <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                          Meta Description <span className="text-[#F36A4F]">*</span>
                        </label>
                        <textarea
                          value={metaDescription}
                          onChange={(e) => {
                            setMetaDescription(e.target.value);
                            if (e.target.value.trim()) {
                              setErrors((prev: Record<string, string>) => ({ ...prev, metaDescription: '' }));
                            }
                          }}
                          className={`w-full h-[80px] px-[12px] py-[10px] rounded-[12px] border text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] resize-none ${errors.metaDescription ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'
                            }`}
                          placeholder="Max 160 characters"
                          maxLength={160}
                        />
                        {errors.metaDescription && (
                          <p className="text-[#F36A4F] text-[12px] mt-1">{errors.metaDescription}</p>
                        )}
                        <p className="text-[11px] text-[#6E6E6E] mt-1">{metaDescription.length}/160</p>
                      </div>

                      <div className="grid grid-cols-2 gap-[16px]">
                        <div>
                          <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                            OG Image <span className="text-[#F36A4F]">*</span>
                          </label>
                          <input
                            type="file"
                            id="ogImageUpload"
                            accept="image/*"
                            onChange={handleOgImageUpload}
                            className="hidden"
                          />
                          {!ogImageUrl ? (
                            <button
                              onClick={() => document.getElementById('ogImageUpload')?.click()}
                              disabled={uploadingOgImage}
                              className={`w-full h-[44px] px-[12px] rounded-[12px] border hover:bg-white text-[14px] text-[#3D3D3D] flex items-center justify-center gap-2 disabled:opacity-50 ${errors.ogImageUrl ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'
                                }`}
                            >
                              <Upload className="w-4 h-4" />
                              {uploadingOgImage ? 'Uploading...' : 'Upload Image'}
                            </button>
                          ) : (
                            <div className={`w-full p-2 rounded-[12px] border flex flex-col gap-2 ${errors.ogImageUrl ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'}`}>
                              <div className="flex items-center justify-between gap-2 overflow-hidden bg-white p-2 rounded-[8px] border border-[#DBDBDB]">
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <div className="w-8 h-8 rounded border border-[#DBDBDB] overflow-hidden flex-shrink-0 bg-[#F8F8F8] flex items-center justify-center">
                                    <img src={ogImageUrl} alt="OG Preview" className="w-full h-full object-cover" />
                                  </div>
                                  <span className="text-[12px] text-[#3D3D3D] truncate" title={ogImageUrl}>
                                    {ogImageUrl}
                                  </span>
                                </div>
                                <button
                                  onClick={() => document.getElementById('ogImageUpload')?.click()}
                                  className="text-[12px] text-[#F36A4F] hover:underline font-medium flex-shrink-0"
                                >
                                  Change
                                </button>
                              </div>
                            </div>
                          )}
                          {errors.ogImageUrl && (
                            <p className="text-[#F36A4F] text-[12px] mt-1">{errors.ogImageUrl}</p>
                          )}
                          {ogImageUrl && (
                            <p className="text-[11px] text-[#2E7D32] mt-1 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Image uploaded
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                            Canonical URL <span className="text-[#F36A4F]">*</span>
                          </label>
                          <input
                            type="url"
                            value={canonicalUrl}
                            onChange={(e) => {
                              setCanonicalUrl(e.target.value);
                              if (e.target.value.trim()) {
                                setErrors((prev: Record<string, string>) => ({ ...prev, canonicalUrl: '' }));
                              }
                            }}
                            className={`w-full h-[44px] px-[12px] rounded-[12px] border text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] ${errors.canonicalUrl ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'
                              }`}
                            placeholder="https://aramfoundation.org/home"
                          />
                          {errors.canonicalUrl && (
                            <p className="text-[#F36A4F] text-[12px] mt-1">{errors.canonicalUrl}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Page Sections - Always show for editing */}
                <div className="space-y-4">
                  <h4 className="text-[14px] font-semibold text-[#0D0D0D]">Page Sections</h4>

                  {homeSections.map((section) => (
                    <div
                      key={section.id}
                      className="border-2 border-[#DBDBDB] rounded-[12px] overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setEditingSection(editingSection === section.id ? null : section.id)
                        }
                        className="w-full flex items-center justify-between p-[16px] hover:bg-[#F8F8F8] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={section.enabled}
                              onChange={(e) => e.stopPropagation()}
                              className="w-4 h-4 accent-[#F36A4F]"
                            />
                          </label>
                          <span className="text-[14px] font-semibold text-[#0D0D0D]">
                            {section.name}
                          </span>
                          {!section.enabled && (
                            <span className="px-2 py-0.5 bg-[#F3F3F3] text-[11px] text-[#6E6E6E] rounded">
                              Disabled
                            </span>
                          )}
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 text-[#3D3D3D] transition-transform ${editingSection === section.id ? 'rotate-90' : ''
                            }`}
                        />
                      </button>

                      {editingSection === section.id && section.type === 'hero' && (
                        <div className="p-[16px] bg-[#F8F8F8] border-t border-[#DBDBDB] space-y-4">
                          <div>
                            <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                              Headline <span className="text-[#F36A4F]">*</span> (Max 80 chars)
                            </label>
                            <input
                              type="text"
                              value={heroHeadline}
                              onChange={(e) => {
                                setHeroHeadline(e.target.value);
                                if (e.target.value.trim()) {
                                  setErrors((prev: Record<string, string>) => ({ ...prev, heroHeadline: '' }));
                                }
                              }}
                              className={`w-full h-[44px] px-[12px] rounded-[12px] border text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] ${errors.heroHeadline ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'
                                }`}
                              maxLength={80}
                            />
                            {errors.heroHeadline && (
                              <p className="text-[#F36A4F] text-[12px] mt-1">{errors.heroHeadline}</p>
                            )}
                            <p className="text-[11px] text-[#6E6E6E] mt-1">
                              {heroHeadline.length}/80
                            </p>
                          </div>

                          <div>
                            <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                              Subheadline <span className="text-[#F36A4F]">*</span> (Max 140 chars)
                            </label>
                            <textarea
                              value={heroSubheadline}
                              onChange={(e) => {
                                setHeroSubheadline(e.target.value);
                                if (e.target.value.trim()) {
                                  setErrors((prev: Record<string, string>) => ({ ...prev, heroSubheadline: '' }));
                                }
                              }}
                              className={`w-full h-[80px] px-[12px] py-[10px] rounded-[12px] border text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] resize-none ${errors.heroSubheadline ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'
                                }`}
                              maxLength={140}
                            />
                            {errors.heroSubheadline && (
                              <p className="text-[#F36A4F] text-[12px] mt-1">{errors.heroSubheadline}</p>
                            )}
                            <p className="text-[11px] text-[#6E6E6E] mt-1">
                              {heroSubheadline.length}/140
                            </p>
                          </div>

                          <div>
                            <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                              Background Image/Video <span className="text-[#F36A4F]">*</span>
                            </label>
                            <input
                              type="file"
                              id="heroBackgroundUpload"
                              accept="image/*,video/*"
                              onChange={(e) => {
                                handleHeroBackgroundUpload(e);
                                setErrors((prev: Record<string, string>) => ({ ...prev, heroBackgroundUrl: '' }));
                              }}
                              className="hidden"
                            />
                            {!heroBackgroundUrl ? (
                              <button
                                onClick={() => document.getElementById('heroBackgroundUpload')?.click()}
                                disabled={uploadingHeroBackground}
                                className={`w-full h-[100px] border-2 border-dashed rounded-[12px] hover:border-[#F36A4F] hover:bg-[#FEF1EE] transition-colors flex flex-col items-center justify-center gap-2 disabled:opacity-50 ${errors.heroBackgroundUrl ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'
                                  }`}
                              >
                                <Upload className="w-6 h-6 text-[#6E6E6E]" />
                                <span className="text-[13px] text-[#6E6E6E]">
                                  {uploadingHeroBackground ? 'Uploading...' : 'Upload Image or Video'}
                                </span>
                              </button>
                            ) : (
                              <div className={`w-full p-3 rounded-[12px] border flex flex-col gap-2 ${errors.heroBackgroundUrl ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'} bg-white`}>
                                <div className="flex items-center justify-between gap-3 overflow-hidden">
                                  <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-12 h-12 rounded border border-[#DBDBDB] overflow-hidden flex-shrink-0 bg-[#F8F8F8] flex items-center justify-center">
                                      {heroBackgroundUrl.match(/\.(mp4|webm)$/i) ? (
                                        <div className="bg-[#F36A4F] w-full h-full flex items-center justify-center text-white text-[10px] font-bold">
                                          MP4
                                        </div>
                                      ) : (
                                        <img src={heroBackgroundUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                                      )}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                      <span className="text-[12px] font-medium text-[#0D0D0D]">Current Media</span>
                                      <span className="text-[11px] text-[#6E6E6E] truncate max-w-[200px]" title={heroBackgroundUrl}>
                                        {heroBackgroundUrl}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => document.getElementById('heroBackgroundUpload')?.click()}
                                    className="h-[32px] px-3 rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[12px] font-medium text-[#3D3D3D] transition-colors flex-shrink-0"
                                  >
                                    Change
                                  </button>
                                </div>
                              </div>
                            )}
                            {errors.heroBackgroundUrl && (
                              <p className="text-[#F36A4F] text-[12px] mt-1">{errors.heroBackgroundUrl}</p>
                            )}
                            {heroBackgroundUrl && (
                              <p className="text-[11px] text-[#2E7D32] mt-1 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> {heroBackgroundUrl.match(/\.(mp4|webm)$/i) ? 'Video' : 'Image'} uploaded successfully
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-[16px]">
                            <div>
                              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                                CTA Button Text <span className="text-[#F36A4F]">*</span>
                              </label>
                              <input
                                type="text"
                                value={heroCTAText}
                                onChange={(e) => {
                                  setHeroCTAText(e.target.value);
                                  if (e.target.value.trim()) {
                                    setErrors((prev: Record<string, string>) => ({ ...prev, heroCTAText: '' }));
                                  }
                                }}
                                className={`w-full h-[44px] px-[12px] rounded-[12px] border text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] ${errors.heroCTAText ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'
                                  }`}
                              />
                              {errors.heroCTAText && (
                                <p className="text-[#F36A4F] text-[12px] mt-1">{errors.heroCTAText}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                                CTA Link <span className="text-[#F36A4F]">*</span>
                              </label>
                              <input
                                type="text"
                                value={heroCTALink}
                                onChange={(e) => {
                                  setHeroCTALink(e.target.value);
                                  if (e.target.value.trim()) {
                                    setErrors((prev: Record<string, string>) => ({ ...prev, heroCTALink: '' }));
                                  }
                                }}
                                className={`w-full h-[44px] px-[12px] rounded-[12px] border text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] ${errors.heroCTALink ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'
                                  }`}
                              />
                              {errors.heroCTALink && (
                                <p className="text-[#F36A4F] text-[12px] mt-1">{errors.heroCTALink}</p>
                              )}
                            </div>
                          </div>

                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={showDonationStats}
                              onChange={(e) => setShowDonationStats(e.target.checked)}
                              className="w-4 h-4 accent-[#F36A4F]"
                            />
                            <span className="text-[13px] text-[#3D3D3D]">
                              Show donation stats overlay
                            </span>
                          </label>
                        </div>
                      )}

                      {editingSection === section.id && section.type === 'mission' && (
                        <div className="p-[16px] bg-[#F8F8F8] border-t border-[#DBDBDB] space-y-4">
                          <div>
                            <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                              Mission Title <span className="text-[#F36A4F]">*</span> (Max 100 chars)
                            </label>
                            <input
                              type="text"
                              value={missionTitle}
                              onChange={(e) => {
                                setMissionTitle(e.target.value);
                                if (e.target.value.trim() && errors.missionTitle) {
                                  setErrors((prev: Record<string, string>) => ({ ...prev, missionTitle: '' }));
                                }
                              }}
                              className={`w-full h-[44px] px-[12px] rounded-[12px] border ${errors.missionTitle ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'} text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]`}
                              maxLength={100}
                              placeholder="Enter mission title"
                            />
                            {errors.missionTitle && (
                              <p className="text-[11px] text-[#F36A4F] mt-1">{errors.missionTitle}</p>
                            )}
                            <p className="text-[11px] text-[#6E6E6E] mt-1">
                              {missionTitle.length}/100
                            </p>
                          </div>

                          <div>
                            <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                              Mission Description <span className="text-[#F36A4F]">*</span> (Max 1000 chars)
                            </label>
                            <textarea
                              value={missionDescription}
                              onChange={(e) => {
                                setMissionDescription(e.target.value);
                                if (e.target.value.trim() && errors.missionDescription) {
                                  setErrors((prev: Record<string, string>) => ({ ...prev, missionDescription: '' }));
                                }
                              }}
                              className={`w-full h-[150px] px-[12px] py-[10px] rounded-[12px] border ${errors.missionDescription ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'} text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] resize-none`}
                              maxLength={1000}
                              placeholder="Enter mission description"
                            />
                            {errors.missionDescription && (
                              <p className="text-[11px] text-[#F36A4F] mt-1">{errors.missionDescription}</p>
                            )}
                            <p className="text-[11px] text-[#6E6E6E] mt-1">
                              {missionDescription.length}/1000
                            </p>
                          </div>

                          <div className="pt-4 border-t border-[#DBDBDB] space-y-4">
                            <div>
                              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                                Vision Title <span className="text-[#F36A4F]">*</span> (Max 100 chars)
                              </label>
                              <input
                                type="text"
                                value={visionTitle}
                                onChange={(e) => {
                                  setVisionTitle(e.target.value);
                                  if (e.target.value.trim() && errors.visionTitle) {
                                    setErrors((prev: Record<string, string>) => ({ ...prev, visionTitle: '' }));
                                  }
                                }}
                                className={`w-full h-[44px] px-[12px] rounded-[12px] border ${errors.visionTitle ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'} text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]`}
                                maxLength={100}
                                placeholder="Enter vision title"
                              />
                              {errors.visionTitle && (
                                <p className="text-[11px] text-[#F36A4F] mt-1">{errors.visionTitle}</p>
                              )}
                              <p className="text-[11px] text-[#6E6E6E] mt-1">
                                {visionTitle.length}/100
                              </p>
                            </div>

                            <div>
                              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                                Vision Description <span className="text-[#F36A4F]">*</span> (Max 1000 chars)
                              </label>
                              <textarea
                                value={visionDescription}
                                onChange={(e) => {
                                  setVisionDescription(e.target.value);
                                  if (e.target.value.trim() && errors.visionDescription) {
                                    setErrors((prev: Record<string, string>) => ({ ...prev, visionDescription: '' }));
                                  }
                                }}
                                className={`w-full h-[150px] px-[12px] py-[10px] rounded-[12px] border ${errors.visionDescription ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'} text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] resize-none`}
                                maxLength={1000}
                                placeholder="Enter vision description"
                              />
                              {errors.visionDescription && (
                                <p className="text-[11px] text-[#F36A4F] mt-1">{errors.visionDescription}</p>
                              )}
                              <p className="text-[11px] text-[#6E6E6E] mt-1">
                                {visionDescription.length}/1000
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {editingSection === section.id && section.type === 'about' && (
                        <div className="p-[16px] bg-[#F8F8F8] border-t border-[#DBDBDB] space-y-4">
                          <div>
                            <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                              About Title <span className="text-[#F36A4F]">*</span> (Max 100 chars)
                            </label>
                            <input
                              type="text"
                              value={aboutTitle}
                              onChange={(e) => {
                                setAboutTitle(e.target.value);
                                if (e.target.value.trim() && errors.aboutTitle) {
                                  setErrors((prev: Record<string, string>) => ({ ...prev, aboutTitle: '' }));
                                }
                              }}
                              className={`w-full h-[44px] px-[12px] rounded-[12px] border ${errors.aboutTitle ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'} text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]`}
                              maxLength={100}
                              placeholder="Enter about title"
                            />
                            {errors.aboutTitle && (
                              <p className="text-[11px] text-[#F36A4F] mt-1">{errors.aboutTitle}</p>
                            )}
                            <p className="text-[11px] text-[#6E6E6E] mt-1">
                              {aboutTitle.length}/100
                            </p>
                          </div>

                          <div>
                            <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                              About Description <span className="text-[#F36A4F]">*</span> (Max 1000 chars)
                            </label>
                            <textarea
                              value={aboutDescription}
                              onChange={(e) => {
                                setAboutDescription(e.target.value);
                                if (e.target.value.trim() && errors.aboutDescription) {
                                  setErrors((prev: Record<string, string>) => ({ ...prev, aboutDescription: '' }));
                                }
                              }}
                              className={`w-full h-[150px] px-[12px] py-[10px] rounded-[12px] border ${errors.aboutDescription ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'} text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] resize-none`}
                              maxLength={1000}
                              placeholder="Enter about description"
                            />
                            {errors.aboutDescription && (
                              <p className="text-[11px] text-[#F36A4F] mt-1">{errors.aboutDescription}</p>
                            )}
                            <p className="text-[11px] text-[#6E6E6E] mt-1">
                              {aboutDescription.length}/1000
                            </p>
                          </div>
                        </div>
                      )}

                      {editingSection === section.id && section.type === 'stats' && (
                        <div className="p-[16px] bg-[#F8F8F8] border-t border-[#DBDBDB] space-y-4">
                          <p className="text-[13px] text-[#6E6E6E]">
                            Configure 4 stat cards displayed on the homepage
                          </p>

                          {stats.map((stat: { label: string, value: string }, index: number) => (
                            <div
                              key={index}
                              className="p-[12px] bg-white rounded-[12px] border border-[#DBDBDB]"
                            >
                              <p className="text-[12px] font-semibold text-[#3D3D3D] mb-3">
                                Stat Card {index + 1}
                              </p>
                              <div className="grid grid-cols-2 gap-[12px]">
                                <div>
                                  <label className="block text-[11px] font-medium text-[#3D3D3D] mb-2">
                                    Label <span className="text-[#F36A4F]">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={stat.label}
                                    onChange={(e) => {
                                      const newStats = [...stats];
                                      newStats[index].label = e.target.value;
                                      setStats(newStats);
                                      if (e.target.value.trim()) {
                                        setErrors((prev: Record<string, string>) => ({ ...prev, [`statLabel${index}`]: '' }));
                                      }
                                    }}
                                    placeholder="e.g., Total Donations"
                                    className={`w-full h-[36px] px-[10px] rounded-[8px] border text-[13px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] ${errors[`statLabel${index}`] ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'}`}
                                  />
                                  {errors[`statLabel${index}`] && (
                                    <p className="text-[#F36A4F] text-[10px] mt-1">{errors[`statLabel${index}`]}</p>
                                  )}
                                </div>
                                <div>
                                  <label className="block text-[11px] font-medium text-[#3D3D3D] mb-2">
                                    Value <span className="text-[#F36A4F]">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={stat.value}
                                    onChange={(e) => {
                                      const val = e.target.value.replace(/[^0-9]/g, '');
                                      const newStats = [...stats];
                                      newStats[index].value = val;
                                      setStats(newStats);
                                      if (val.trim()) {
                                        setErrors((prev: Record<string, string>) => ({ ...prev, [`statValue${index}`]: '' }));
                                      }
                                    }}
                                    placeholder="e.g., 25000"
                                    className={`w-full h-[36px] px-[10px] rounded-[8px] border text-[13px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] ${errors[`statValue${index}`] ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'}`}
                                  />
                                  {errors[`statValue${index}`] && (
                                    <p className="text-[#F36A4F] text-[10px] mt-1">{errors[`statValue${index}`]}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="sticky bottom-0 bg-white border-t border-[#DBDBDB] p-[24px] flex items-center justify-between rounded-b-[16px]">
                <button
                  onClick={() => setShowEditor(false)}
                  className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedPage(selectedPage || (pages[0] ?? null));
                      setShowPreview(true);
                    }}
                    className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D] flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={handleSaveDraft}
                    disabled={saving || !pageName.trim()}
                    className="h-[44px] px-[20px] rounded-full border border-[#F36A4F] text-[#F36A4F] hover:bg-[#FEF1EE] text-[14px] font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Draft'}
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={saving || !pageName.trim()}
                    className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[14px] font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {saving ? 'Publishing...' : 'Publish'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Preview Modal */}
      {
        showPreview && selectedPage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[24px]">
            <div className="bg-white rounded-[16px] w-full max-w-[1000px] max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-[#FFF3E0] border-b border-[#E65100] p-[16px] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-[#E65100]" />
                  <div>
                    <p className="text-[14px] font-semibold text-[#E65100]">Preview Mode</p>
                    <p className="text-[12px] text-[#E65100]">
                      This is how the page will look when published
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#FFE0B2]"
                >
                  <X className="w-5 h-5 text-[#E65100]" />
                </button>
              </div>

              <div className="p-[24px] min-h-[400px] bg-[#FAFAFA]">
                <div className="max-w-[800px] mx-auto space-y-6">
                  {/* Page Information */}
                  <div className="p-4 bg-white rounded-lg border border-[#DBDBDB]">
                    <p className="text-[12px] font-semibold text-[#0D0D0D] mb-3">Page Information</p>
                    <div className="grid grid-cols-2 gap-3 text-[12px]">
                      <div>
                        <p className="text-[#6E6E6E]">Page Name:</p>
                        <p className="font-medium text-[#0D0D0D]">{pageName || '(Not set)'}</p>
                      </div>
                      <div>
                        <p className="text-[#6E6E6E]">URL Slug:</p>
                        <p className="font-medium text-[#0D0D0D] font-mono">/{pageSlug || '(Not set)'}</p>
                      </div>
                      <div>
                        <p className="text-[#6E6E6E]">Section Key:</p>
                        <p className="font-medium text-[#0D0D0D] font-mono">{sectionKey || '(Not set)'}</p>
                      </div>
                      <div>
                        <p className="text-[#6E6E6E]">Status:</p>
                        <p className="font-medium text-[#0D0D0D]">{selectedPage?.status || 'Draft'}</p>
                      </div>

                    </div>
                  </div>

                  {/* SEO Meta Preview */}
                  {(metaTitle || metaDescription || canonicalUrl || ogImageUrl) && (
                    <div className="p-4 bg-white rounded-lg border border-[#DBDBDB]">
                      <p className="text-[12px] font-semibold text-[#0D0D0D] mb-3">SEO Preview</p>
                      {metaTitle && (
                        <h2 className="text-[18px] text-[#1A0DAB] mb-1">{metaTitle}</h2>
                      )}
                      {metaDescription && (
                        <p className="text-[13px] text-[#545454] mb-3">{metaDescription}</p>
                      )}
                      {canonicalUrl && (
                        <p className="text-[11px] text-[#006621] mb-2">
                          Canonical: <span className="font-mono">{canonicalUrl}</span>
                        </p>
                      )}
                      {ogImageUrl && (
                        <div className="mt-3">
                          <p className="text-[11px] text-[#6E6E6E] mb-2">OG Image:</p>
                          <div className="bg-[#F8F8F8] rounded-lg border border-[#DBDBDB] p-2 flex justify-center">
                            <img src={ogImageUrl} alt="OG" className="max-w-full h-auto max-h-[200px] object-contain rounded-lg" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hero Section Preview */}
                  {(heroBackgroundUrl || heroHeadline || heroSubheadline || heroCTAText) && (
                    <div className="p-4 bg-white rounded-lg border border-[#DBDBDB]">
                      <p className="text-[12px] font-semibold text-[#0D0D0D] mb-3">Hero Section</p>

                      {heroBackgroundUrl && (
                        <div className="mb-4">
                          <p className="text-[11px] text-[#6E6E6E] mb-2">Background:</p>
                          <div className="bg-[#000] rounded-lg overflow-hidden flex justify-center h-[300px]">
                            {heroBackgroundUrl.match(/\.(mp4|webm)$/i) ? (
                              <video src={heroBackgroundUrl} className="max-w-full h-full object-contain" controls />
                            ) : (
                              <img src={heroBackgroundUrl} alt="Hero" className="max-w-full h-full object-contain" />
                            )}
                          </div>
                        </div>
                      )}

                      {heroHeadline && (
                        <div className="mb-3">
                          <p className="text-[11px] text-[#6E6E6E] mb-1">Headline:</p>
                          <h1 className="text-[28px] font-bold text-[#0D0D0D]">{heroHeadline}</h1>
                        </div>
                      )}

                      {heroSubheadline && (
                        <div className="mb-3">
                          <p className="text-[11px] text-[#6E6E6E] mb-1">Subheadline:</p>
                          <p className="text-[16px] text-[#3D3D3D]">{heroSubheadline}</p>
                        </div>
                      )}

                      {heroCTAText && (
                        <div className="mb-3">
                          <p className="text-[11px] text-[#6E6E6E] mb-2">Call to Action:</p>
                          <button className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] text-white text-[15px] font-medium">
                            {heroCTAText}
                          </button>
                          {heroCTALink && (
                            <p className="text-[11px] text-[#6E6E6E] mt-2">
                              Links to: <span className="font-mono text-[#1A0DAB]">{heroCTALink}</span>
                            </p>
                          )}
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-[#DBDBDB]">
                        <p className="text-[11px] text-[#6E6E6E]">
                          Donation Stats Overlay: <span className="font-medium text-[#0D0D0D]">{showDonationStats ? 'Enabled ✓' : 'Disabled'}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Mission/Vision Section Preview */}
                  {(missionTitle || missionDescription || visionTitle || visionDescription) && (
                    <div className="p-4 bg-white rounded-lg border border-[#DBDBDB] space-y-4">
                      <p className="text-[12px] font-semibold text-[#0D0D0D] mb-1">Mission/Vision Block</p>

                      {/* Mission */}
                      {(missionTitle || missionDescription) && (
                        <div className="p-3 bg-[#F8F8F8] rounded-lg border border-[#DBDBDB]">
                          <p className="text-[11px] font-bold text-[#F36A4F] uppercase tracking-wider mb-2">Our Mission</p>
                          {missionTitle && (
                            <div className="mb-2">
                              <p className="text-[10px] text-[#6E6E6E] mb-0.5">Title:</p>
                              <h3 className="text-[16px] font-bold text-[#0D0D0D]">{missionTitle}</h3>
                            </div>
                          )}
                          {missionDescription && (
                            <div>
                              <p className="text-[10px] text-[#6E6E6E] mb-0.5">Description:</p>
                              <p className="text-[13px] text-[#3D3D3D] leading-relaxed whitespace-pre-wrap">
                                {missionDescription}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Vision */}
                      {(visionTitle || visionDescription) && (
                        <div className="p-3 bg-[#F8F8F8] rounded-lg border border-[#DBDBDB]">
                          <p className="text-[11px] font-bold text-[#F36A4F] uppercase tracking-wider mb-2">Our Vision</p>
                          {visionTitle && (
                            <div className="mb-2">
                              <p className="text-[10px] text-[#6E6E6E] mb-0.5">Title:</p>
                              <h3 className="text-[16px] font-bold text-[#0D0D0D]">{visionTitle}</h3>
                            </div>
                          )}
                          {visionDescription && (
                            <div>
                              <p className="text-[10px] text-[#6E6E6E] mb-0.5">Description:</p>
                              <p className="text-[13px] text-[#3D3D3D] leading-relaxed whitespace-pre-wrap">
                                {visionDescription}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* About Section Preview */}
                  {(aboutTitle || aboutDescription) && (
                    <div className="p-4 bg-white rounded-lg border border-[#DBDBDB] space-y-4">
                      <p className="text-[12px] font-semibold text-[#0D0D0D] mb-1">About Block</p>
                      <div className="p-3 bg-[#F8F8F8] rounded-lg border border-[#DBDBDB]">
                        {aboutTitle && (
                          <div className="mb-2">
                            <p className="text-[10px] text-[#6E6E6E] mb-0.5">Title:</p>
                            <h3 className="text-[16px] font-bold text-[#0D0D0D]">{aboutTitle}</h3>
                          </div>
                        )}
                        {aboutDescription && (
                          <div>
                            <p className="text-[10px] text-[#6E6E6E] mb-0.5">Description:</p>
                            <p className="text-[13px] text-[#3D3D3D] leading-relaxed whitespace-pre-wrap">
                              {aboutDescription}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Donation Stats Preview */}
                  {(showDonationStats || stats.some((s: { label: string; value: string }) => s.label || s.value)) && (
                    <div className="p-4 bg-white rounded-lg border border-[#DBDBDB]">
                      <p className="text-[12px] font-semibold text-[#0D0D0D] mb-3">Quick Stats Block</p>
                      <div className="grid grid-cols-4 gap-4">
                        {stats.map((stat: { label: string, value: string }, i: number) => (
                          <div key={i} className="text-center p-3 bg-[#F8F8F8] rounded-lg">
                            <p className="text-[20px] font-bold text-[#F36A4F] truncate">
                              {stat.value || '--'}
                            </p>
                            <p className="text-[11px] text-[#6E6E6E] mt-1 truncate">
                              {stat.label || `Stat Card ${i + 1}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reason for Publish Preview */}
                  {publishReason && (
                    <div className="p-4 bg-white rounded-lg border border-[#DBDBDB]">
                      <p className="text-[12px] font-semibold text-[#0D0D0D] mb-3">
                        Reason for {selectedPage?.status === 'Published' ? 'Update' : 'Publish'}
                      </p>
                      <div className="p-3 bg-white border border-[#F36A4F]/20 rounded-lg">
                        <p className="text-[13px] text-[#3D3D3D] leading-relaxed italic whitespace-pre-wrap">
                          "{publishReason}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Enabled Sections */}
                  <div className="p-4 bg-white rounded-lg border border-[#DBDBDB]">
                    <p className="text-[12px] font-semibold text-[#0D0D0D] mb-3">Enabled Page Sections</p>
                    <div className="grid grid-cols-2 gap-2">
                      {homeSections.map((section) => (
                        <div key={section.id} className="flex items-center gap-2 text-[12px]">
                          <div className={`w-3 h-3 rounded ${section.enabled ? 'bg-[#4CAF50]' : 'bg-[#DBDBDB]'}`}></div>
                          <span className={section.enabled ? 'text-[#0D0D0D]' : 'text-[#6E6E6E]'}>{section.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Empty State */}
                  {!pageName && !heroHeadline && !heroSubheadline && !heroCTAText && !metaTitle && (
                    <div className="text-center py-12 bg-white rounded-lg border border-[#DBDBDB]">
                      <Eye className="w-12 h-12 text-[#DBDBDB] mx-auto mb-3" />
                      <p className="text-[14px] text-[#6E6E6E]">No content to preview yet</p>
                      <p className="text-[12px] text-[#6E6E6E] mt-1">Start filling in the form to see your content here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div >
        )
      }

      {/* Version History Modal */}
      {
        showVersionHistory && selectedPage && (
          <div className="fixed inset-0 bg-black/50 flex items-end justify-end z-50">
            <div className="bg-white w-[480px] h-full overflow-auto">
              <div className="sticky top-0 bg-white border-b border-[#DBDBDB] p-[24px] flex items-center justify-between">
                <h3 className="text-[18px] font-semibold text-[#0D0D0D]">Version History</h3>
                <button
                  onClick={() => setShowVersionHistory(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                >
                  <X className="w-5 h-5 text-[#3D3D3D]" />
                </button>
              </div>

              <div className="p-[24px] space-y-3">
                {loadingVersions ? (
                  <div className="text-center py-8">
                    <div className="inline-block w-8 h-8 border-4 border-[#F36A4F] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[13px] text-[#6E6E6E] mt-3">Loading versions...</p>
                  </div>
                ) : versions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[13px] text-[#6E6E6E]">No version history available</p>
                  </div>
                ) : (
                  versions.map((version: {
                    id: string;
                    version: number;
                    status?: string;
                    updatedAt?: string;
                    createdAt?: string;
                    modifiedBy?: string;
                    contentJson?: string;
                  }, index: number) => {
                    const isCurrentVersion = index === 0;
                    const versionDate = version.updatedAt || version.createdAt;

                    return (
                      <div
                        key={version.id}
                        className="p-[16px] bg-[#F8F8F8] rounded-[12px] border border-[#DBDBDB]"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-[14px] font-semibold text-[#0D0D0D]">
                              Version {version.version}
                            </p>
                            <p className="text-[12px] text-[#6E6E6E]">
                              {isCurrentVersion ? 'Current version' : version.status || 'Draft'}
                            </p>
                          </div>
                          {!isCurrentVersion && (
                            <button
                              onClick={() => handleRestoreVersion(version)}
                              disabled={restoringVersion}
                              className="text-[12px] text-[#F36A4F] hover:text-[#E55A3F] font-medium flex items-center gap-1 disabled:opacity-50"
                            >
                              <RotateCcw className="w-3 h-3" />
                              {restoringVersion ? 'Restoring...' : 'Restore'}
                            </button>
                          )}
                        </div>
                        <p className="text-[12px] text-[#6E6E6E]">
                          Modified by {version.modifiedBy || 'Unknown'}
                          {versionDate && ` on ${new Date(versionDate).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}`}
                        </p>
                        {version.contentJson && (() => {
                          try {
                            const content = JSON.parse(version.contentJson);
                            return (
                              <div className="mt-2 pt-2 border-t border-[#DBDBDB]">
                                {content.sections?.hero?.headline && (
                                  <p className="text-[11px] text-[#6E6E6E]">
                                    Hero: {content.sections.hero.headline.substring(0, 50)}...
                                  </p>
                                )}
                                {content.publishReason && (
                                  <p className="text-[11px] text-[#6E6E6E] italic mt-1">
                                    Reason: {content.publishReason}
                                  </p>
                                )}
                              </div>
                            );
                          } catch (e) {
                            return null;
                          }
                        })()}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )
      }

      {/* Default Page Confirmation Modal */}
      {
        showDefaultConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]">
            <div className="bg-white rounded-[16px] w-[400px] p-[24px]">
              <h3 className="text-[18px] font-semibold text-[#0D0D0D] mb-2">Default Page Confirmation</h3>
              <p className="text-[14px] text-[#6E6E6E] mb-6">
                If you want to set this as the default page, please click <strong>"Okay"</strong>. Clicking <strong>"Okay"</strong> will make this page the default, while clicking <strong>"Cancel"</strong> will publish the page without setting it as the default.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsDefault(false);
                    setShowDefaultConfirm(false);
                    setShowReasonModal(true);
                    toast.info('Page will not be set as default');
                  }}
                  className="h-[40px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDefaultConfirm(false);
                    setShowReasonModal(true);
                    toast.success('Page set to be default upon publishing');
                  }}
                  className="h-[40px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-[14px] font-medium text-white shadow-lg"
                >
                  Okay
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Publish Reason Modal */}
      {
        showReasonModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-[16px] w-[480px]">
              <div className="p-[24px] border-b border-[#DBDBDB]">
                <h3 className="text-[18px] font-semibold text-[#0D0D0D]">Publish Page</h3>
                <p className="text-[13px] text-[#6E6E6E] mt-1">
                  Please provide a reason for publishing this page
                </p>
              </div>

              <div className="p-[24px]">
                <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                  Reason for Publishing <span className="text-[#F36A4F]">*</span>
                </label>
                <textarea
                  value={publishReason}
                  onChange={(e) => setPublishReason(e.target.value)}
                  className="w-full h-[100px] px-[12px] py-[10px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] resize-none"
                  placeholder="e.g., Updated hero section with new campaign details"
                />
              </div>

              <div className="p-[24px] border-t border-[#DBDBDB] flex justify-end gap-3">
                <button
                  onClick={() => setShowReasonModal(false)}
                  className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPublish}
                  disabled={saving || !publishReason.trim()}
                  className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[14px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Publishing...' : 'Confirm & Publish'}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
