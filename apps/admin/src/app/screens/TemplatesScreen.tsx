import { useState } from 'react';
import {
  FileText,
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
  Clock,
  Save,
  CheckCircle,
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  channel: 'Email' | 'SMS';
  category: 'Transactional' | 'Marketing' | 'Operational';
  status: 'Draft' | 'Published' | 'Archived';
  updatedOn: string;
  updatedBy: string;
  subject?: string;
  content: string;
}

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Receipt Generation Email',
    channel: 'Email',
    category: 'Transactional',
    status: 'Published',
    updatedOn: '2026-01-15',
    updatedBy: 'Admin User',
    subject: 'Your Donation Receipt - {receipt_number}',
    content:
      'Dear {donor_name},\n\nThank you for your generous donation of ₹{amount} on {donation_date}. Your receipt number is {receipt_number}.\n\nYour support helps us make a difference.\n\nWarm regards,\nAram Foundation',
  },
  {
    id: '2',
    name: 'Payment Success SMS',
    channel: 'SMS',
    category: 'Transactional',
    status: 'Published',
    updatedOn: '2026-01-18',
    updatedBy: 'Admin User',
    content: 'Dear {name}, your donation of Rs.{amount} is successful. Receipt: {receipt_no}. Thank you! - Aram Foundation',
  },
  {
    id: '3',
    name: 'Festival Greeting Email',
    channel: 'Email',
    category: 'Marketing',
    status: 'Draft',
    updatedOn: '2026-01-20',
    updatedBy: 'Admin User',
    subject: 'Season\'s Greetings from Aram Foundation',
    content:
      'Dear {donor_name},\n\nWishing you and your family a joyous festive season!\n\nThank you for being part of our journey.\n\nWarm wishes,\nAram Foundation Team',
  },
];

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
];

export function TemplatesScreen() {
  const [showEditor, setShowEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showTestSend, setShowTestSend] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterChannel, setFilterChannel] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

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
    setSelectedTemplate(template);
    setShowEditor(true);
  };

  const handleNew = () => {
    setSelectedTemplate({
      id: '',
      name: '',
      channel: 'Email',
      category: 'Transactional',
      status: 'Draft',
      updatedOn: new Date().toISOString().split('T')[0],
      updatedBy: 'Current User',
      subject: '',
      content: '',
    });
    setShowEditor(true);
  };

  const handleSave = () => {
    console.log('Saving template:', selectedTemplate);
    setShowEditor(false);
  };

  const handlePublish = () => {
    console.log('Publishing template:', selectedTemplate);
    if (selectedTemplate) {
      selectedTemplate.status = 'Published';
    }
    setShowEditor(false);
  };

  const filteredTemplates = mockTemplates.filter((template) => {
    if (filterChannel !== 'All' && template.channel !== filterChannel) return false;
    if (filterCategory !== 'All' && template.category !== filterCategory) return false;
    if (filterStatus !== 'All' && template.status !== filterStatus) return false;
    return true;
  });

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

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-[16px] mb-[24px]">
        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Total Templates</p>
          <p className="text-[24px] font-semibold text-[#0D0D0D]">{mockTemplates.length}</p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Email Templates</p>
          <p className="text-[24px] font-semibold text-[#0D0D0D]">
            {mockTemplates.filter((t) => t.channel === 'Email').length}
          </p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">SMS Templates</p>
          <p className="text-[24px] font-semibold text-[#0D0D0D]">
            {mockTemplates.filter((t) => t.channel === 'SMS').length}
          </p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Published</p>
          <p className="text-[24px] font-semibold text-[#2E7D32]">
            {mockTemplates.filter((t) => t.status === 'Published').length}
          </p>
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
                onChange={(e) => setFilterChannel(e.target.value)}
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
                onChange={(e) => setFilterCategory(e.target.value)}
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
                onChange={(e) => setFilterStatus(e.target.value)}
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
                <th className="h-[48px] px-[16px] text-left text-[13px] font-semibold text-[#3D3D3D]">
                  Template Name
                </th>
                <th className="h-[48px] px-[16px] text-center text-[13px] font-semibold text-[#3D3D3D]">
                  Channel
                </th>
                <th className="h-[48px] px-[16px] text-left text-[13px] font-semibold text-[#3D3D3D]">
                  Category
                </th>
                <th className="h-[48px] px-[16px] text-center text-[13px] font-semibold text-[#3D3D3D]">
                  Status
                </th>
                <th className="h-[48px] px-[16px] text-left text-[13px] font-semibold text-[#3D3D3D]">
                  Updated On
                </th>
                <th className="h-[48px] px-[16px] text-left text-[13px] font-semibold text-[#3D3D3D]">
                  Updated By
                </th>
                <th className="h-[48px] px-[16px] text-right text-[13px] font-semibold text-[#3D3D3D]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="border-b border-[#DBDBDB] hover:bg-[#F8F8F8]">
                  <td className="h-[56px] px-[16px] text-[14px] text-[#0D0D0D] font-medium">
                    {template.name}
                  </td>
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
                  <td className="h-[56px] px-[16px] text-[14px] text-[#3D3D3D]">
                    {template.category}
                  </td>
                  <td className="h-[56px] px-[16px] text-center">
                    <span
                      className={`inline-block px-2 py-1 text-[12px] font-medium rounded-full ${getStatusColor(
                        template.status
                      )}`}
                    >
                      {template.status}
                    </span>
                  </td>
                  <td className="h-[56px] px-[16px] text-[14px] text-[#3D3D3D]">
                    {new Date(template.updatedOn).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="h-[56px] px-[16px] text-[14px] text-[#3D3D3D]">
                    {template.updatedBy}
                  </td>
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
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4 text-[#3D3D3D]" />
                      </button>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                        title="Archive"
                      >
                        <Archive className="w-4 h-4 text-[#3D3D3D]" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTemplate(template);
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="h-[64px] px-[16px] flex items-center justify-between border-t border-[#DBDBDB]">
          <p className="text-[13px] text-[#6E6E6E]">
            Showing {filteredTemplates.length} of {mockTemplates.length} templates
          </p>
          <div className="flex items-center gap-2">
            <button className="h-[36px] px-[16px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[13px] font-medium text-[#3D3D3D]">
              Previous
            </button>
            <button className="h-[36px] w-[36px] rounded-full bg-[#F36A4F] text-white text-[13px] font-medium">
              1
            </button>
            <button className="h-[36px] px-[16px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[13px] font-medium text-[#3D3D3D]">
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
              <button
                onClick={() => setShowEditor(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
              >
                <X className="w-5 h-5 text-[#3D3D3D]" />
              </button>
            </div>

            <div className="p-[24px]">
              <div className="grid grid-cols-2 gap-[16px] mb-6">
                {/* Template Info */}
                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={selectedTemplate.name}
                    onChange={(e) =>
                      setSelectedTemplate({ ...selectedTemplate, name: e.target.value })
                    }
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    placeholder="e.g., Receipt Email Template"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Channel *
                  </label>
                  <select
                    value={selectedTemplate.channel}
                    onChange={(e) =>
                      setSelectedTemplate({
                        ...selectedTemplate,
                        channel: e.target.value as 'Email' | 'SMS',
                      })
                    }
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                  >
                    <option>Email</option>
                    <option>SMS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Category *
                  </label>
                  <select
                    value={selectedTemplate.category}
                    onChange={(e) =>
                      setSelectedTemplate({
                        ...selectedTemplate,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                  >
                    <option>Transactional</option>
                    <option>Marketing</option>
                    <option>Operational</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Status
                  </label>
                  <select
                    value={selectedTemplate.status}
                    onChange={(e) =>
                      setSelectedTemplate({ ...selectedTemplate, status: e.target.value as any })
                    }
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                  >
                    <option>Draft</option>
                    <option>Published</option>
                    <option>Archived</option>
                  </select>
                </div>
              </div>

              {/* Email Subject (Email only) */}
              {selectedTemplate.channel === 'Email' && (
                <div className="mb-6">
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Subject Line *
                  </label>
                  <input
                    type="text"
                    value={selectedTemplate.subject}
                    onChange={(e) =>
                      setSelectedTemplate({ ...selectedTemplate, subject: e.target.value })
                    }
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    placeholder="e.g., Your Donation Receipt - {receipt_number}"
                  />
                </div>
              )}

              {/* Merge Variables Helper */}
              <div className="mb-4 p-[16px] bg-[#F8F8F8] rounded-[12px]">
                <h4 className="text-[13px] font-semibold text-[#0D0D0D] mb-3">
                  Available Merge Variables
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {MERGE_VARIABLES.map((mv) => (
                    <button
                      key={mv.var}
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

              {/* Content Editor */}
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
                  onChange={(e) =>
                    setSelectedTemplate({ ...selectedTemplate, content: e.target.value })
                  }
                  className="w-full h-[200px] px-[12px] py-[10px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] resize-none font-mono"
                  placeholder="Enter your template content here..."
                  maxLength={selectedTemplate.channel === 'SMS' ? 160 : undefined}
                />
              </div>

              {/* SMS DLT Template ID (SMS only) */}
              {selectedTemplate.channel === 'SMS' && (
                <div className="mb-6">
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    DLT Template ID (India Compliance)
                  </label>
                  <input
                    type="text"
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    placeholder="Enter DLT Template ID"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-[#DBDBDB]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowPreview(true);
                    }}
                    className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D] flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={() => setShowTestSend(true)}
                    className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D] flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Test Send
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowEditor(false)}
                    className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="h-[44px] px-[20px] rounded-full border border-[#F36A4F] text-[#F36A4F] hover:bg-[#FEF1EE] text-[14px] font-medium flex items-center gap-2"
                  >
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
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
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
              {selectedTemplate.channel === 'Email' && (
                <div className="mb-4">
                  <p className="text-[12px] text-[#6E6E6E] mb-1">Subject:</p>
                  <p className="text-[14px] font-medium text-[#0D0D0D]">
                    {selectedTemplate.subject}
                  </p>
                </div>
              )}

              <div className="p-[16px] bg-[#F8F8F8] rounded-[12px] border border-[#DBDBDB]">
                <pre className="text-[14px] text-[#0D0D0D] whitespace-pre-wrap font-sans">
                  {selectedTemplate.content}
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
                <input
                  type={selectedTemplate.channel === 'Email' ? 'email' : 'tel'}
                  className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                  placeholder={
                    selectedTemplate.channel === 'Email'
                      ? 'admin@aram.org'
                      : '+91 98765 43210'
                  }
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowTestSend(false)}
                  className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Sending test...');
                    setShowTestSend(false);
                  }}
                  className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[14px] font-medium flex items-center gap-2"
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
