import { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  MessageSquare,
  Search,
  Filter,
  Plus,
  Edit,
  Copy,
  Archive,
  Eye,
  Send,
  X,
  Save,
  CheckCircle,
} from 'lucide-react';
import { useApi } from '../context/ApiContext';

interface Template {
  id: number;
  name: string;
  channel: 'Email' | 'SMS';
  category: string;
  status: string;
  updatedOn: string;
  updatedBy?: string;
  subject?: string;
  content: string;
  bodyContent?: string;
  dltTemplateId?: string;
}

const MERGE_VARIABLES = [
  { var: '{donor_name}', desc: 'Donor full name' },
  { var: '{amount}', desc: 'Donation amount' },
  { var: '{receipt_number}', desc: 'Receipt number' },
  { var: '{donation_date}', desc: 'Donation date' },
  { var: '{category}', desc: 'Donation category' },
  { var: '{campaign_name}', desc: 'Campaign name' },
  { var: '{transaction_id}', desc: 'Transaction ID' },
  { var: '{payment_method}', desc: 'Payment method' },
  { var: '{support_email}', desc: 'Support email' },
  { var: '{name}', desc: 'Donor name' },
  { var: '{receipt_no}', desc: 'Receipt number (short)' },
];

function buildQuery(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== 'All') sp.set(k, String(v));
  });
  const q = sp.toString();
  return q ? `?${q}` : '';
}

export function TemplatesScreen() {
  const { apiFetch } = useApi();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [total, setTotal] = useState(0);
  const [totalEmail, setTotalEmail] = useState(0);
  const [totalSms, setTotalSms] = useState(0);
  const [totalPublished, setTotalPublished] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showEditor, setShowEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState<{ subject?: string; body: string } | null>(null);
  const [showTestSend, setShowTestSend] = useState(false);
  const [testSendEmail, setTestSendEmail] = useState('');
  const [testSendMobile, setTestSendMobile] = useState('');
  const [testSending, setTestSending] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterChannel, setFilterChannel] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSearch, setFilterSearch] = useState('');

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = buildQuery({
        page,
        limit,
        channel: filterChannel !== 'All' ? filterChannel : undefined,
        category: filterCategory !== 'All' ? filterCategory : undefined,
        status: filterStatus !== 'All' ? filterStatus : undefined,
        search: filterSearch.trim() || undefined,
      });
      const res = await apiFetch(`/communication-templates${query}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Failed to load templates (${res.status})`);
      }
      const data = await res.json();
      const items = (data.items || []).map((t: Record<string, unknown>) => ({
        id: t.id as number,
        name: (t.name as string) ?? '',
        channel: (t.channel as 'Email' | 'SMS') ?? 'Email',
        category: (t.category as string) ?? 'Transactional',
        status: (t.status as string) ?? 'Draft',
        updatedOn: (t.updatedOn as string) ?? '',
        updatedBy: t.updatedBy as string | undefined,
        subject: t.subject as string | undefined,
        content: (t.content as string) ?? (t.bodyContent as string) ?? '',
        bodyContent: t.bodyContent as string | undefined,
        dltTemplateId: t.dltTemplateId as string | undefined,
      }));
      setTemplates(items);
      setTotal(Number(data.total ?? 0));
      setTotalEmail(Number(data.totalEmail ?? 0));
      setTotalSms(Number(data.totalSms ?? 0));
      setTotalPublished(Number(data.totalPublished ?? 0));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load templates');
      setTemplates([]);
      setTotal(0);
      setTotalEmail(0);
      setTotalSms(0);
      setTotalPublished(0);
    } finally {
      setLoading(false);
    }
  }, [apiFetch, page, limit, filterChannel, filterCategory, filterStatus, filterSearch]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-[#E8F5E9] text-[#2E7D32]';
      case 'Draft':
        return 'bg-[#FFF3E0] text-[#E65100]';
      case 'Archived':
        return 'bg-[#F3F3F3] text-[#6E6E6E]';
      default:
        return 'bg-[#F3F3F3] text-[#6E6E6E]';
    }
  };

  const handleEdit = (template: Template) => {
    setSelectedTemplate({ ...template, content: template.content || template.bodyContent || '' });
    setShowEditor(true);
  };

  const handleNew = () => {
    setSelectedTemplate({
      id: 0,
      name: '',
      channel: 'Email',
      category: 'Transactional',
      status: 'Draft',
      updatedOn: new Date().toISOString().split('T')[0],
      updatedBy: '',
      subject: '',
      content: '',
    });
    setShowEditor(true);
  };

  const handleSaveDraft = async () => {
    if (!selectedTemplate) return;
    setSaving(true);
    try {
      const payload = {
        name: selectedTemplate.name,
        type: selectedTemplate.channel,
        category: selectedTemplate.category,
        status: 'Draft',
        subject: selectedTemplate.channel === 'Email' ? selectedTemplate.subject : undefined,
        bodyContent: selectedTemplate.content,
        dltTemplateId: selectedTemplate.channel === 'SMS' ? selectedTemplate.dltTemplateId : undefined,
      };
      const body = JSON.stringify(payload);
      if (selectedTemplate.id) {
        const res = await apiFetch(`/communication-templates/${selectedTemplate.id}`, {
          method: 'PUT',
          body,
        });
        if (!res.ok) throw new Error(await res.text());
      } else {
        const res = await apiFetch('/communication-templates', { method: 'POST', body });
        if (!res.ok) throw new Error(await res.text());
      }
      setShowEditor(false);
      setSelectedTemplate(null);
      fetchList();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedTemplate) return;
    setSaving(true);
    try {
      const body = {
        name: selectedTemplate.name,
        type: selectedTemplate.channel,
        category: selectedTemplate.category,
        status: 'Published',
        subject: selectedTemplate.channel === 'Email' ? selectedTemplate.subject : undefined,
        bodyContent: selectedTemplate.content,
        dltTemplateId: selectedTemplate.channel === 'SMS' ? selectedTemplate.dltTemplateId : undefined,
      };
      if (selectedTemplate.id) {
        const res = await apiFetch(`/communication-templates/${selectedTemplate.id}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(await res.text());
      } else {
        const res = await apiFetch('/communication-templates', { method: 'POST', body: JSON.stringify(body) });
        if (!res.ok) throw new Error(await res.text());
      }
      setShowEditor(false);
      setSelectedTemplate(null);
      fetchList();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Publish failed');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setShowEditor(false);
    setSelectedTemplate(null);
  };

  const handleArchive = async (id: number) => {
    try {
      const res = await apiFetch(`/communication-templates/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      fetchList();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Archive failed');
    }
  };

  const handleDuplicate = async (template: Template) => {
    try {
      const res = await apiFetch(`/communication-templates/${template.id}/duplicate`, {
        method: 'POST',
        body: '{}',
      });
      if (!res.ok) throw new Error(await res.text());
      fetchList();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Duplicate failed');
    }
  };

  const handlePreview = async () => {
    if (!selectedTemplate) return;
    if (!selectedTemplate.id) {
      setPreviewContent({
        subject: selectedTemplate.subject,
        body: selectedTemplate.content,
      });
      setShowPreview(true);
      return;
    }
    try {
      const res = await apiFetch(`/communication-templates/${selectedTemplate.id}/preview`, {
        method: 'POST',
        body: JSON.stringify({ sampleVariables: {} }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPreviewContent({ subject: data.subject, body: data.body ?? '' });
      setShowPreview(true);
    } catch (e) {
      setPreviewContent({ subject: selectedTemplate.subject, body: selectedTemplate.content });
      setShowPreview(true);
    }
  };

  const handleTestSend = async () => {
    if (!selectedTemplate) return;
    const isEmail = selectedTemplate.channel === 'Email';
    const to = isEmail ? testSendEmail.trim() : testSendMobile.trim();
    if (!to) return;
    setTestSending(true);
    try {
      const body: Record<string, unknown> = isEmail ? { email: to } : { mobile: to };
      const res = await apiFetch(`/communication-templates/${selectedTemplate.id}/test-send`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || await res.text());
      }
      setShowTestSend(false);
      setTestSendEmail('');
      setTestSendMobile('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Test send failed');
    } finally {
      setTestSending(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex flex-col bg-[#F8F8F8]">
      {/* Header */}
      <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[24px] mb-[24px]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] leading-[28px] font-semibold text-[#0D0D0D]">
              Communication Templates
            </h1>
            <p className="text-[13px] leading-[18px] text-[#6E6E6E] mt-1">
              Manage email and SMS templates with merge variables
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] bg-white hover:bg-[#F3F3F3] transition-colors flex items-center gap-2 text-[14px] font-medium text-[#3D3D3D]"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={handleNew}
              className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] transition-colors flex items-center gap-2 text-[14px] font-medium text-white"
            >
              <Plus className="w-4 h-4" />
              New Template
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-[12px] bg-red-50 border border-red-200 text-red-800 text-[14px]">
          {error}
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-[16px] mb-[24px]">
        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Total Templates</p>
          <p className="text-[24px] font-semibold text-[#0D0D0D]">{total}</p>
        </div>
        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Email Templates</p>
          <p className="text-[24px] font-semibold text-[#0D0D0D]">{totalEmail}</p>
        </div>
        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">SMS Templates</p>
          <p className="text-[24px] font-semibold text-[#0D0D0D]">{totalSms}</p>
        </div>
        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Published</p>
          <p className="text-[24px] font-semibold text-[#2E7D32]">{totalPublished}</p>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px] mb-[24px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-[#0D0D0D]">Filters</h3>
            <button
              onClick={() => {
                setFilterChannel('All');
                setFilterCategory('All');
                setFilterStatus('All');
                setFilterSearch('');
              }}
              className="text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium"
            >
              Reset All
            </button>
          </div>
          <div className="grid grid-cols-4 gap-[16px]">
            <div>
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Channel</label>
              <select
                value={filterChannel}
                onChange={(e) => { setFilterChannel(e.target.value); setPage(1); }}
                className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
              >
                <option>All</option>
                <option>Email</option>
                <option>SMS</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
                className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
              >
                <option>All</option>
                <option>Transactional</option>
                <option>Marketing</option>
                <option>Operational</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
              >
                <option>All</option>
                <option>Draft</option>
                <option>Published</option>
                <option>Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6E6E]" />
                <input
                  type="text"
                  placeholder="Template name..."
                  value={filterSearch}
                  onChange={(e) => { setFilterSearch(e.target.value); setPage(1); }}
                  className="w-full h-[44px] pl-[36px] pr-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Table */}
      <div className="bg-white rounded-[16px] border border-[#DBDBDB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8F8F8] border-b border-[#DBDBDB]">
                <th className="h-[48px] px-[16px] text-left text-[13px] font-semibold text-[#3D3D3D]">Template Name</th>
                <th className="h-[48px] px-[16px] text-center text-[13px] font-semibold text-[#3D3D3D]">Channel</th>
                <th className="h-[48px] px-[16px] text-left text-[13px] font-semibold text-[#3D3D3D]">Category</th>
                <th className="h-[48px] px-[16px] text-center text-[13px] font-semibold text-[#3D3D3D]">Status</th>
                <th className="h-[48px] px-[16px] text-left text-[13px] font-semibold text-[#3D3D3D]">Updated On</th>
                <th className="h-[48px] px-[16px] text-left text-[13px] font-semibold text-[#3D3D3D]">Updated By</th>
                <th className="h-[48px] px-[16px] text-right text-[13px] font-semibold text-[#3D3D3D]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="h-[120px] px-[16px] text-center text-[14px] text-[#6E6E6E]">
                    Loading...
                  </td>
                </tr>
              ) : templates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="h-[120px] px-[16px] text-center text-[14px] text-[#6E6E6E]">
                    No templates found.
                  </td>
                </tr>
              ) : (
                templates.map((template: Template) => (
                  <tr key={template.id} className="border-b border-[#DBDBDB] hover:bg-[#F8F8F8]">
                    <td className="h-[56px] px-[16px] text-[14px] text-[#0D0D0D] font-medium">{template.name}</td>
                    <td className="h-[56px] px-[16px] text-center">
                      <div className="inline-flex items-center gap-1">
                        {template.channel === 'Email' ? (
                          <Mail className="w-4 h-4 text-[#1976D2]" />
                        ) : (
                          <MessageSquare className="w-4 h-4 text-[#2E7D32]" />
                        )}
                        <span className="text-[13px] text-[#3D3D3D]">{template.channel}</span>
                      </div>
                    </td>
                    <td className="h-[56px] px-[16px] text-[14px] text-[#3D3D3D]">{template.category}</td>
                    <td className="h-[56px] px-[16px] text-center">
                      <span className={`inline-block px-2 py-1 text-[12px] font-medium rounded-full ${getStatusColor(template.status)}`}>
                        {template.status}
                      </span>
                    </td>
                    <td className="h-[56px] px-[16px] text-[14px] text-[#3D3D3D]">
                      {template.updatedOn
                        ? new Date(template.updatedOn).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="h-[56px] px-[16px] text-[14px] text-[#3D3D3D]">{template.updatedBy ?? '—'}</td>
                    <td className="h-[56px] px-[16px]">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(template)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-[#3D3D3D]" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(template)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4 text-[#3D3D3D]" />
                        </button>
                        <button
                          onClick={() => handleArchive(template.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                          title="Archive"
                        >
                          <Archive className="w-4 h-4 text-[#3D3D3D]" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTemplate(template);
                            setPreviewContent({ subject: template.subject, body: template.content || template.bodyContent || '' });
                            setShowPreview(true);
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4 text-[#3D3D3D]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="h-[64px] px-[16px] flex items-center justify-between border-t border-[#DBDBDB]">
          <p className="text-[13px] text-[#6E6E6E]">
            Showing {templates.length} of {total} templates
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={!canPrev}
              onClick={() => setPage((p: number) => p - 1)}
              className="h-[36px] px-[16px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] disabled:opacity-50 text-[13px] font-medium text-[#3D3D3D]"
            >
              Previous
            </button>
            <span className="h-[36px] px-2 flex items-center text-[13px] text-[#3D3D3D]">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={!canNext}
              onClick={() => setPage((p: number) => p + 1)}
              className="h-[36px] px-[16px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] disabled:opacity-50 text-[13px] font-medium text-[#3D3D3D]"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Template Editor Modal */}
      {showEditor && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[24px]">
          <div className="bg-white rounded-[16px] w-full max-w-[900px] max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-[#DBDBDB] p-[24px] flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-[#0D0D0D]">
                {selectedTemplate.id ? 'Edit Template' : 'New Template'}
              </h3>
              <button onClick={handleCancel} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]">
                <X className="w-5 h-5 text-[#3D3D3D]" />
              </button>
            </div>
            <div className="p-[24px]">
              <div className="grid grid-cols-2 gap-[16px] mb-6">
                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Template Name *</label>
                  <input
                    type="text"
                    value={selectedTemplate.name}
                    onChange={(e) => setSelectedTemplate({ ...selectedTemplate, name: e.target.value })}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    placeholder="e.g., Receipt Email Template"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Channel *</label>
                  <select
                    value={selectedTemplate.channel}
                    onChange={(e) =>
                      setSelectedTemplate({ ...selectedTemplate, channel: e.target.value as 'Email' | 'SMS' })
                    }
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                  >
                    <option>Email</option>
                    <option>SMS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Category *</label>
                  <select
                    value={selectedTemplate.category}
                    onChange={(e) => setSelectedTemplate({ ...selectedTemplate, category: e.target.value })}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                  >
                    <option>Transactional</option>
                    <option>Marketing</option>
                    <option>Operational</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Status</label>
                  <select
                    value={selectedTemplate.status}
                    onChange={(e) => setSelectedTemplate({ ...selectedTemplate, status: e.target.value })}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                  >
                    <option>Draft</option>
                    <option>Published</option>
                    <option>Archived</option>
                  </select>
                </div>
              </div>

              {selectedTemplate.channel === 'Email' && (
                <div className="mb-6">
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Subject Line *</label>
                  <input
                    type="text"
                    value={selectedTemplate.subject ?? ''}
                    onChange={(e) => setSelectedTemplate({ ...selectedTemplate, subject: e.target.value })}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    placeholder="e.g., Your Donation Receipt - {receipt_number}"
                  />
                </div>
              )}

              <div className="mb-4 p-[16px] bg-[#F8F8F8] rounded-[12px]">
                <h4 className="text-[13px] font-semibold text-[#0D0D0D] mb-3">Available Merge Variables</h4>
                <div className="grid grid-cols-3 gap-2">
                  {MERGE_VARIABLES.map((mv) => (
                    <button
                      key={mv.var}
                      type="button"
                      onClick={() =>
                        setSelectedTemplate({
                          ...selectedTemplate,
                          content: selectedTemplate.content + mv.var,
                        })
                      }
                      className="px-3 py-2 bg-white rounded-[8px] border border-[#DBDBDB] hover:bg-[#FEF1EE] hover:border-[#F36A4F] text-left transition-colors"
                    >
                      <p className="text-[12px] font-mono text-[#F36A4F]">{mv.var}</p>
                      <p className="text-[11px] text-[#6E6E6E]">{mv.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[13px] font-medium text-[#3D3D3D]">
                    {selectedTemplate.channel === 'SMS' ? 'SMS Content *' : 'Email Body *'}
                  </label>
                  {selectedTemplate.channel === 'SMS' && (
                    <span className="text-[12px] text-[#6E6E6E]">
                      {selectedTemplate.content.length} / 160 characters
                    </span>
                  )}
                </div>
                <textarea
                  value={selectedTemplate.content}
                  onChange={(e) => setSelectedTemplate({ ...selectedTemplate, content: e.target.value })}
                  className="w-full h-[200px] px-[12px] py-[10px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] resize-none font-mono"
                  placeholder="Enter your template content here..."
                  maxLength={selectedTemplate.channel === 'SMS' ? 160 : undefined}
                />
              </div>

              {selectedTemplate.channel === 'SMS' && (
                <div className="mb-6">
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">DLT Template ID (India Compliance)</label>
                  <input
                    type="text"
                    value={selectedTemplate.dltTemplateId ?? ''}
                    onChange={(e) => setSelectedTemplate({ ...selectedTemplate, dltTemplateId: e.target.value })}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    placeholder="Enter DLT Template ID"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-[#DBDBDB]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D] flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  {selectedTemplate.id ? (
                    <button
                      type="button"
                      onClick={() => {
                        setShowTestSend(true);
                      }}
                      className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D] flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Test Send
                    </button>
                  ) : null}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleSaveDraft}
                    className="h-[44px] px-[20px] rounded-full border border-[#F36A4F] text-[#F36A4F] hover:bg-[#FEF1EE] text-[14px] font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    Save Draft
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handlePublish}
                    className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[14px] font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Publish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-[16px] w-[600px] max-h-[80vh] overflow-auto">
            <div className="p-[24px] border-b border-[#DBDBDB] flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-[#0D0D0D]">Template Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
              >
                <X className="w-5 h-5 text-[#3D3D3D]" />
              </button>
            </div>
            <div className="p-[24px]">
              {previewContent.subject !== undefined && (
                <div className="mb-4">
                  <p className="text-[12px] text-[#6E6E6E] mb-1">Subject:</p>
                  <p className="text-[14px] font-medium text-[#0D0D0D]">{previewContent.subject}</p>
                </div>
              )}
              <div className="p-[16px] bg-[#F8F8F8] rounded-[12px] border border-[#DBDBDB]">
                <pre className="text-[14px] text-[#0D0D0D] whitespace-pre-wrap font-sans">
                  {previewContent.body}
                </pre>
              </div>
              <p className="text-[12px] text-[#6E6E6E] mt-3">
                Note: Merge variables will be replaced with actual values when sent.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Test Send Modal */}
      {showTestSend && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-[16px] w-[480px]">
            <div className="p-[24px] border-b border-[#DBDBDB] flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-[#0D0D0D]">Test Send</h3>
              <button
                onClick={() => setShowTestSend(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
              >
                <X className="w-5 h-5 text-[#3D3D3D]" />
              </button>
            </div>
            <div className="p-[24px]">
              <div className="mb-6">
                <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                  {selectedTemplate.channel === 'Email'
                    ? 'Test Email Address'
                    : 'Test Mobile Number'}
                </label>
                {selectedTemplate.channel === 'Email' ? (
                  <input
                    type="email"
                    value={testSendEmail}
                    onChange={(e) => setTestSendEmail(e.target.value)}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    placeholder="admin@aram.org"
                  />
                ) : (
                  <input
                    type="tel"
                    value={testSendMobile}
                    onChange={(e) => setTestSendMobile(e.target.value)}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    placeholder="+91 98765 43210"
                  />
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTestSend(false)}
                  className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={testSending || (selectedTemplate.channel === 'Email' ? !testSendEmail.trim() : !testSendMobile.trim())}
                  onClick={handleTestSend}
                  className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[14px] font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Send Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
