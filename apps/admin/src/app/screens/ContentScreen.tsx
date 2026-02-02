import { useState } from 'react';
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
  Link,
  Image,
  Type,
  AlignLeft,
  Settings,
  ChevronRight,
  X,
  RotateCcw,
  Search,
} from 'lucide-react';

interface Page {
  id: string;
  name: string;
  slug: string;
  status: 'Published' | 'Draft';
  lastModified: string;
  modifiedBy: string;
  version: number;
}

interface Section {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
}

const mockPages: Page[] = [
  {
    id: '1',
    name: 'Home',
    slug: '/home',
    status: 'Published',
    lastModified: '2026-01-20 10:30 AM',
    modifiedBy: 'Admin User',
    version: 15,
  },
  {
    id: '2',
    name: 'About',
    slug: '/about',
    status: 'Published',
    lastModified: '2026-01-18 03:45 PM',
    modifiedBy: 'Content Editor',
    version: 8,
  },
  {
    id: '3',
    name: 'Contact',
    slug: '/contact',
    status: 'Draft',
    lastModified: '2026-01-19 11:20 AM',
    modifiedBy: 'Admin User',
    version: 3,
  },
];

const homeSections: Section[] = [
  { id: '1', name: 'Hero Section', type: 'hero', enabled: true },
  { id: '2', name: 'Mission/Vision Block', type: 'mission', enabled: true },
  { id: '3', name: 'Quick Stats', type: 'stats', enabled: true },
  { id: '4', name: 'Featured Campaigns', type: 'campaigns', enabled: true },
  { id: '5', name: 'Impact Stories', type: 'stories', enabled: true },
];

export function ContentScreen() {
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [publishReason, setPublishReason] = useState('');

  // Hero section state
  const [heroHeadline, setHeroHeadline] = useState('Transforming Lives Through Education');
  const [heroSubheadline, setHeroSubheadline] = useState(
    'Join us in our mission to provide quality education and healthcare to underprivileged communities across India'
  );
  const [heroCTAText, setHeroCTAText] = useState('Donate Now');
  const [heroCTALink, setHeroCTALink] = useState('/donate');
  const [showDonationStats, setShowDonationStats] = useState(true);

  const handleEditPage = (page: Page) => {
    setSelectedPage(page);
    setShowEditor(true);
  };

  const handlePublish = () => {
    setShowReasonModal(true);
  };

  const confirmPublish = () => {
    console.log('Publishing with reason:', publishReason);
    if (selectedPage) {
      selectedPage.status = 'Published';
    }
    setShowReasonModal(false);
    setPublishReason('');
    setShowEditor(false);
  };

  const getStatusColor = (status: string) => {
    return status === 'Published'
      ? 'bg-[#E8F5E9] text-[#2E7D32]'
      : 'bg-[#FFF3E0] text-[#E65100]';
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
            onClick={() => {
              setSelectedPage(null);
              setShowEditor(true);
            }}
            className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] transition-colors flex items-center gap-2 text-[14px] font-medium text-white"
          >
            <Plus className="w-4 h-4" />
            New Page
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-[16px] mb-[24px]">
        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Total Pages</p>
          <p className="text-[24px] font-semibold text-[#0D0D0D]">{mockPages.length}</p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Published</p>
          <p className="text-[24px] font-semibold text-[#2E7D32]">
            {mockPages.filter((p) => p.status === 'Published').length}
          </p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Drafts</p>
          <p className="text-[24px] font-semibold text-[#E65100]">
            {mockPages.filter((p) => p.status === 'Draft').length}
          </p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Last Updated</p>
          <p className="text-[13px] font-semibold text-[#0D0D0D]">Today, 10:30 AM</p>
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
              {mockPages.map((page) => (
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
                        onClick={() => {
                          setSelectedPage(page);
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
                          setShowVersionHistory(true);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                        title="Version History"
                      >
                        <Clock className="w-4 h-4 text-[#3D3D3D]" />
                      </button>
                      <button
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
      </div>

      {/* Page Editor Modal */}
      {showEditor && (
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
                    className={`w-4 h-4 text-[#3D3D3D] transition-transform ${
                      showSEO ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {showSEO && (
                  <div className="mt-4 p-[16px] bg-[#F8F8F8] rounded-[12px] space-y-4">
                    <div>
                      <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        defaultValue="Aram Foundation - Transform Lives Through Education"
                        className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                        placeholder="Max 60 characters"
                        maxLength={60}
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                        Meta Description
                      </label>
                      <textarea
                        defaultValue="Join Aram Foundation in our mission to provide quality education and healthcare to underprivileged communities."
                        className="w-full h-[80px] px-[12px] py-[10px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] resize-none"
                        placeholder="Max 160 characters"
                        maxLength={160}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-[16px]">
                      <div>
                        <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                          OG Image
                        </label>
                        <button className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] hover:bg-white text-[14px] text-[#3D3D3D] flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Upload Image
                        </button>
                      </div>

                      <div>
                        <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                          Canonical URL
                        </label>
                        <input
                          type="url"
                          className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                          placeholder="https://aramfoundation.org/home"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Page Sections */}
              {selectedPage?.name === 'Home' && (
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
                          className={`w-4 h-4 text-[#3D3D3D] transition-transform ${
                            editingSection === section.id ? 'rotate-90' : ''
                          }`}
                        />
                      </button>

                      {editingSection === section.id && section.type === 'hero' && (
                        <div className="p-[16px] bg-[#F8F8F8] border-t border-[#DBDBDB] space-y-4">
                          <div>
                            <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                              Headline * (Max 80 chars)
                            </label>
                            <input
                              type="text"
                              value={heroHeadline}
                              onChange={(e) => setHeroHeadline(e.target.value)}
                              className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                              maxLength={80}
                            />
                            <p className="text-[11px] text-[#6E6E6E] mt-1">
                              {heroHeadline.length}/80
                            </p>
                          </div>

                          <div>
                            <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                              Subheadline (Max 140 chars)
                            </label>
                            <textarea
                              value={heroSubheadline}
                              onChange={(e) => setHeroSubheadline(e.target.value)}
                              className="w-full h-[80px] px-[12px] py-[10px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] resize-none"
                              maxLength={140}
                            />
                            <p className="text-[11px] text-[#6E6E6E] mt-1">
                              {heroSubheadline.length}/140
                            </p>
                          </div>

                          <div>
                            <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                              Background Image/Video
                            </label>
                            <button className="w-full h-[100px] border-2 border-dashed border-[#DBDBDB] rounded-[12px] hover:border-[#F36A4F] hover:bg-[#FEF1EE] transition-colors flex flex-col items-center justify-center gap-2">
                              <Upload className="w-6 h-6 text-[#6E6E6E]" />
                              <span className="text-[13px] text-[#6E6E6E]">
                                Upload Image or Video
                              </span>
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-[16px]">
                            <div>
                              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                                CTA Button Text
                              </label>
                              <input
                                type="text"
                                value={heroCTAText}
                                onChange={(e) => setHeroCTAText(e.target.value)}
                                className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                              />
                            </div>

                            <div>
                              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                                CTA Link
                              </label>
                              <input
                                type="text"
                                value={heroCTALink}
                                onChange={(e) => setHeroCTALink(e.target.value)}
                                className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                              />
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

                      {editingSection === section.id && section.type === 'stats' && (
                        <div className="p-[16px] bg-[#F8F8F8] border-t border-[#DBDBDB] space-y-4">
                          <p className="text-[13px] text-[#6E6E6E]">
                            Configure 4 stat cards displayed on the homepage
                          </p>

                          {[1, 2, 3, 4].map((num) => (
                            <div
                              key={num}
                              className="p-[12px] bg-white rounded-[12px] border border-[#DBDBDB]"
                            >
                              <p className="text-[12px] font-semibold text-[#3D3D3D] mb-3">
                                Stat Card {num}
                              </p>
                              <div className="grid grid-cols-3 gap-[12px]">
                                <div>
                                  <label className="block text-[11px] font-medium text-[#3D3D3D] mb-2">
                                    Label
                                  </label>
                                  <input
                                    type="text"
                                    defaultValue={
                                      num === 1
                                        ? 'Total Donations'
                                        : num === 2
                                        ? 'Active Donors'
                                        : num === 3
                                        ? 'Lives Impacted'
                                        : 'Projects'
                                    }
                                    className="w-full h-[36px] px-[10px] rounded-[8px] border border-[#DBDBDB] text-[13px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-medium text-[#3D3D3D] mb-2">
                                    Value Source
                                  </label>
                                  <select className="w-full h-[36px] px-[10px] rounded-[8px] border border-[#DBDBDB] text-[13px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                                    <option>Auto from DB</option>
                                    <option>Manual Entry</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[11px] font-medium text-[#3D3D3D] mb-2">
                                    Value
                                  </label>
                                  <input
                                    type="text"
                                    defaultValue={
                                      num === 1
                                        ? '₹2.5 Cr'
                                        : num === 2
                                        ? '1,247'
                                        : num === 3
                                        ? '15,000+'
                                        : '28'
                                    }
                                    className="w-full h-[36px] px-[10px] rounded-[8px] border border-[#DBDBDB] text-[13px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
                    setSelectedPage(selectedPage || mockPages[0]);
                    setShowPreview(true);
                  }}
                  className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D] flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button className="h-[44px] px-[20px] rounded-full border border-[#F36A4F] text-[#F36A4F] hover:bg-[#FEF1EE] text-[14px] font-medium flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Draft
                </button>
                <button
                  onClick={handlePublish}
                  className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[14px] font-medium flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedPage && (
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
              <div className="max-w-[800px] mx-auto">
                <h1 className="text-[32px] font-bold text-[#0D0D0D] mb-4">{heroHeadline}</h1>
                <p className="text-[18px] text-[#3D3D3D] mb-6">{heroSubheadline}</p>
                <button className="h-[48px] px-[24px] rounded-full bg-[#F36A4F] text-white text-[16px] font-medium">
                  {heroCTAText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersionHistory && selectedPage && (
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
              {[15, 14, 13, 12, 11].map((version) => (
                <div
                  key={version}
                  className="p-[16px] bg-[#F8F8F8] rounded-[12px] border border-[#DBDBDB]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-[14px] font-semibold text-[#0D0D0D]">
                        Version {version}
                      </p>
                      <p className="text-[12px] text-[#6E6E6E]">
                        {version === 15 ? 'Current version' : 'Published'}
                      </p>
                    </div>
                    {version !== 15 && (
                      <button className="text-[12px] text-[#F36A4F] hover:text-[#E55A3F] font-medium flex items-center gap-1">
                        <RotateCcw className="w-3 h-3" />
                        Restore
                      </button>
                    )}
                  </div>
                  <p className="text-[12px] text-[#6E6E6E]">
                    Modified by Admin User on{' '}
                    {new Date(Date.now() - (15 - version) * 86400000).toLocaleDateString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Publish Reason Modal */}
      {showReasonModal && (
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
                Reason for Publishing *
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
                disabled={!publishReason.trim()}
                className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[14px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
