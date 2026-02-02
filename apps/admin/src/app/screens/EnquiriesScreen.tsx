import { useState } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Settings,
  Mail,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  X,
  Send,
  Paperclip,
  MoreVertical,
  Edit,
  Ban,
  ChevronRight,
} from 'lucide-react';

interface Enquiry {
  id: string;
  date: string;
  name: string;
  email: string;
  organization: string;
  subject: string;
  status: 'New' | 'Open' | 'In Progress' | 'Waiting' | 'Resolved' | 'Spam';
  assignedTo: string;
  category: string;
  slaDeadline: string;
  hasAttachment: boolean;
  message: string;
}

const mockEnquiries: Enquiry[] = [
  {
    id: '1',
    date: '2026-01-20 10:30 AM',
    name: 'Rajesh Kumar',
    email: 'rajesh.k@email.com',
    organization: 'TCS',
    subject: 'Request for donation receipt',
    status: 'New',
    assignedTo: 'Unassigned',
    category: 'Donations',
    slaDeadline: '2026-01-21 10:30 AM',
    hasAttachment: false,
    message: 'I made a donation of ₹50,000 last week but haven\'t received the receipt yet. Please help.',
  },
  {
    id: '2',
    date: '2026-01-19 02:15 PM',
    name: 'Priya Sharma',
    email: 'priya.s@email.com',
    organization: 'Infosys',
    subject: 'Volunteering opportunity inquiry',
    status: 'In Progress',
    assignedTo: 'Support Team',
    category: 'Volunteering',
    slaDeadline: '2026-01-21 02:15 PM',
    hasAttachment: true,
    message: 'I would like to volunteer for your education programs. What are the current opportunities?',
  },
  {
    id: '3',
    date: '2026-01-18 09:45 AM',
    name: 'Amit Patel',
    email: 'amit.p@email.com',
    organization: 'Wipro',
    subject: 'Partnership proposal',
    status: 'Waiting',
    assignedTo: 'Admin User',
    category: 'Partnership',
    slaDeadline: '2026-01-20 09:45 AM',
    hasAttachment: true,
    message: 'Our company is interested in partnering for CSR activities. Can we schedule a meeting?',
  },
];

const CATEGORIES = [
  'Donations',
  'Volunteering',
  'General',
  'Complaints',
  'Partnership',
  'Sponsorship',
  'Medical Assistance',
  'Education Support',
  'Other',
];

const STATUSES = ['New', 'Open', 'In Progress', 'Waiting', 'Resolved', 'Spam'];

export function EnquiriesScreen() {
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-[#E3F2FD] text-[#1976D2]';
      case 'Open':
        return 'bg-[#FFF3E0] text-[#E65100]';
      case 'In Progress':
        return 'bg-[#FFF9C4] text-[#F57F17]';
      case 'Waiting':
        return 'bg-[#F3E5F5] text-[#7B1FA2]';
      case 'Resolved':
        return 'bg-[#E8F5E9] text-[#2E7D32]';
      case 'Spam':
        return 'bg-[#FFEBEE] text-[#C62828]';
      default:
        return 'bg-[#F3F3F3] text-[#6E6E6E]';
    }
  };

  const handleReply = () => {
    setShowReplyComposer(true);
  };

  const handleSendReply = () => {
    console.log('Sending reply:', replyContent);
    setShowReplyComposer(false);
    setReplyContent('');
  };

  const handleSendAndClose = () => {
    console.log('Sending reply and closing:', replyContent);
    setShowReplyComposer(false);
    setReplyContent('');
    if (selectedEnquiry) {
      selectedEnquiry.status = 'Resolved';
    }
  };

  return (
    <div className="flex flex-col bg-[#F8F8F8]">
      {/* Header */}
      <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[24px] mb-[24px]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] leading-[28px] font-semibold text-[#0D0D0D]">
              Enquiries Inbox
            </h1>
            <p className="text-[13px] leading-[18px] text-[#6E6E6E] mt-1">
              Manage and respond to donor enquiries with SLA tracking
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] bg-white hover:bg-[#F3F3F3] transition-colors flex items-center gap-2 text-[14px] font-medium text-[#3D3D3D]"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            <button
              onClick={() => setShowConfig(!showConfig)}
              className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] transition-colors flex items-center gap-2 text-[14px] font-medium text-white"
            >
              <Settings className="w-4 h-4" />
              Configure
            </button>
          </div>
        </div>
      </div>

      {/* SLA Alert Cards */}
      <div className="grid grid-cols-4 gap-[16px] mb-[24px]">
        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Total Enquiries</p>
          <p className="text-[24px] font-semibold text-[#0D0D0D]">{mockEnquiries.length}</p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">New (Unread)</p>
          <p className="text-[24px] font-semibold text-[#1976D2]">
            {mockEnquiries.filter((e) => e.status === 'New').length}
          </p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">In Progress</p>
          <p className="text-[24px] font-semibold text-[#F57F17]">
            {mockEnquiries.filter((e) => e.status === 'In Progress').length}
          </p>
        </div>

        <div className="bg-white rounded-[16px] border-2 border-[#F36A4F] p-[16px]">
          <div className="flex items-start justify-between mb-1">
            <p className="text-[13px] text-[#6E6E6E]">Pending &gt; 48hrs</p>
            <AlertCircle className="w-4 h-4 text-[#F36A4F]" />
          </div>
          <p className="text-[24px] font-semibold text-[#F36A4F]">2</p>
          <p className="text-[12px] text-[#6E6E6E] mt-1">Requires attention</p>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px] mb-[24px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-[#0D0D0D]">Filters</h3>
            <button className="text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium">
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-4 gap-[16px]">
            <div>
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                Date Range
              </label>
              <select
                defaultValue="Last 7 Days"
                className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
              >
                <option>Today</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Custom Range</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Status</label>
              <select className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                <option>All Statuses</option>
                {STATUSES.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Category</label>
              <select className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                <option>All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                Assigned To
              </label>
              <select className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                <option>All Users</option>
                <option>Unassigned</option>
                <option>Me</option>
                <option>Support Team</option>
                <option>Admin User</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 accent-[#F36A4F]" />
              <span className="text-[13px] text-[#3D3D3D]">Due today</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 accent-[#F36A4F]" />
              <span className="text-[13px] text-[#3D3D3D]">Overdue</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 accent-[#F36A4F]" />
              <span className="text-[13px] text-[#3D3D3D]">Has attachment</span>
            </label>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px] mb-[16px]">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-[#6E6E6E]" />
          <input
            type="text"
            placeholder="Search by name, email, subject..."
            className="flex-1 text-[14px] text-[#3D3D3D] focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[16px]">
        {/* Enquiries List */}
        <div className="bg-white rounded-[16px] border border-[#DBDBDB] overflow-hidden">
          <div className="p-[16px] border-b border-[#DBDBDB]">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[#0D0D0D]">
                All Enquiries ({mockEnquiries.length})
              </h3>
              <button className="text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium">
                Bulk Actions
              </button>
            </div>
          </div>

          <div className="divide-y divide-[#DBDBDB] max-h-[600px] overflow-y-auto">
            {mockEnquiries.map((enquiry) => (
              <button
                key={enquiry.id}
                onClick={() => setSelectedEnquiry(enquiry)}
                className={`w-full p-[16px] text-left hover:bg-[#F8F8F8] transition-colors ${
                  selectedEnquiry?.id === enquiry.id ? 'bg-[#FEF1EE]' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[14px] font-semibold text-[#0D0D0D]">
                        {enquiry.name}
                      </h4>
                      {enquiry.status === 'New' && (
                        <span className="w-2 h-2 bg-[#1976D2] rounded-full"></span>
                      )}
                    </div>
                    <p className="text-[13px] text-[#6E6E6E]">{enquiry.email}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-[11px] font-medium ${getStatusColor(
                      enquiry.status
                    )}`}
                  >
                    {enquiry.status}
                  </span>
                </div>

                <p className="text-[13px] font-medium text-[#0D0D0D] mb-1">{enquiry.subject}</p>
                <p className="text-[12px] text-[#6E6E6E] line-clamp-1 mb-2">{enquiry.message}</p>

                <div className="flex items-center justify-between text-[12px] text-[#6E6E6E]">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {enquiry.date}
                    </span>
                    <span className="px-2 py-0.5 bg-[#F3F3F3] rounded text-[11px]">
                      {enquiry.category}
                    </span>
                  </div>
                  {enquiry.hasAttachment && <Paperclip className="w-3 h-3" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Enquiry Detail View */}
        <div className="bg-white rounded-[16px] border border-[#DBDBDB] overflow-hidden">
          {selectedEnquiry ? (
            <div className="flex flex-col h-[700px]">
              {/* Detail Header */}
              <div className="p-[16px] border-b border-[#DBDBDB]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-[16px] font-semibold text-[#0D0D0D] mb-1">
                      {selectedEnquiry.subject}
                    </h3>
                    <p className="text-[13px] text-[#6E6E6E]">
                      {selectedEnquiry.name} • {selectedEnquiry.email}
                    </p>
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]">
                    <MoreVertical className="w-4 h-4 text-[#3D3D3D]" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-[12px]">
                  <div>
                    <p className="text-[11px] text-[#6E6E6E] mb-1">Status</p>
                    <select
                      value={selectedEnquiry.status}
                      onChange={(e) => {
                        selectedEnquiry.status = e.target.value as any;
                      }}
                      className="w-full h-[36px] px-[10px] rounded-[8px] border border-[#DBDBDB] text-[13px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    >
                      {STATUSES.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <p className="text-[11px] text-[#6E6E6E] mb-1">Category</p>
                    <p className="text-[13px] font-medium text-[#0D0D0D]">
                      {selectedEnquiry.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-[#6E6E6E] mb-1">Assigned To</p>
                    <select className="w-full h-[36px] px-[10px] rounded-[8px] border border-[#DBDBDB] text-[13px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                      <option>Unassigned</option>
                      <option>Me</option>
                      <option>Support Team</option>
                      <option>Admin User</option>
                    </select>
                  </div>
                </div>

                {/* SLA Warning */}
                <div className="mt-3 p-[12px] bg-[#FFF3E0] rounded-[8px] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#E65100]" />
                  <p className="text-[12px] text-[#E65100]">
                    SLA Deadline: {selectedEnquiry.slaDeadline} (18 hours remaining)
                  </p>
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 overflow-y-auto p-[16px]">
                <div className="bg-[#F8F8F8] rounded-[12px] p-[16px]">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-[#F36A4F] rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[13px] font-semibold text-[#0D0D0D]">
                          {selectedEnquiry.name}
                        </p>
                        <p className="text-[12px] text-[#6E6E6E]">{selectedEnquiry.date}</p>
                      </div>
                      <p className="text-[13px] text-[#3D3D3D]">{selectedEnquiry.message}</p>
                    </div>
                  </div>
                </div>

                {/* Activity Log */}
                <div className="mt-4">
                  <h4 className="text-[12px] font-semibold text-[#6E6E6E] mb-3">
                    Activity Timeline
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[12px] text-[#6E6E6E]">
                      <div className="w-1 h-1 bg-[#6E6E6E] rounded-full"></div>
                      <span>Enquiry received - {selectedEnquiry.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-[#6E6E6E]">
                      <div className="w-1 h-1 bg-[#6E6E6E] rounded-full"></div>
                      <span>Auto-assigned to {selectedEnquiry.assignedTo}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-[16px] border-t border-[#DBDBDB]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReply}
                    className="flex-1 h-[44px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[14px] font-medium flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Reply
                  </button>
                  <button className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]">
                    Reassign
                  </button>
                  <button className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]">
                    Mark Spam
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[700px] flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-[#DBDBDB] mx-auto mb-3" />
                <p className="text-[14px] text-[#6E6E6E]">Select an enquiry to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reply Composer Modal */}
      {showReplyComposer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[16px] w-[720px] max-h-[80vh] overflow-auto">
            <div className="p-[24px] border-b border-[#DBDBDB] flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-[#0D0D0D]">Reply to Enquiry</h3>
              <button
                onClick={() => setShowReplyComposer(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
              >
                <X className="w-5 h-5 text-[#3D3D3D]" />
              </button>
            </div>

            <div className="p-[24px]">
              {/* Template Selector */}
              <div className="mb-4">
                <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                  Use Template (Optional)
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                >
                  <option value="">No Template</option>
                  <option>Receipt Request Response</option>
                  <option>Volunteering Information</option>
                  <option>Partnership Enquiry</option>
                  <option>General Thank You</option>
                </select>
              </div>

              {/* Variables Helper */}
              <div className="mb-4 p-[12px] bg-[#F8F8F8] rounded-[8px]">
                <p className="text-[12px] text-[#6E6E6E] mb-2">Available Variables:</p>
                <div className="flex flex-wrap gap-2">
                  {['{name}', '{org}', '{subject}', '{date}'].map((variable) => (
                    <button
                      key={variable}
                      className="px-2 py-1 bg-white rounded text-[11px] text-[#3D3D3D] border border-[#DBDBDB] hover:bg-[#F3F3F3]"
                      onClick={() => setReplyContent(replyContent + variable)}
                    >
                      {variable}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reply Content */}
              <div className="mb-4">
                <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                  Message *
                </label>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full h-[200px] px-[12px] py-[10px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] resize-none"
                  placeholder="Type your reply here..."
                />
              </div>

              {/* CC/BCC */}
              <div className="grid grid-cols-2 gap-[16px] mb-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">CC</label>
                  <input
                    type="email"
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">BCC</label>
                  <input
                    type="email"
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              {/* Attachment */}
              <div className="mb-6">
                <button className="flex items-center gap-2 text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium">
                  <Paperclip className="w-4 h-4" />
                  Attach File
                </button>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowReplyComposer(false)}
                  className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  className="h-[44px] px-[20px] rounded-full border border-[#F36A4F] text-[#F36A4F] hover:bg-[#FEF1EE] text-[14px] font-medium"
                >
                  Send Reply
                </button>
                <button
                  onClick={handleSendAndClose}
                  className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[14px] font-medium flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Send & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Panel */}
      {showConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-end z-50">
          <div className="bg-white w-[480px] h-full overflow-auto">
            <div className="sticky top-0 bg-white border-b border-[#DBDBDB] p-[24px] flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-[#0D0D0D]">
                Enquiry Configuration
              </h3>
              <button
                onClick={() => setShowConfig(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
              >
                <X className="w-5 h-5 text-[#3D3D3D]" />
              </button>
            </div>

            <div className="p-[24px] space-y-6">
              {/* Categories Management */}
              <div>
                <h4 className="text-[14px] font-semibold text-[#0D0D0D] mb-3">
                  Enquiry Categories
                </h4>
                <div className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <div
                      key={category}
                      className="flex items-center justify-between p-[12px] bg-[#F8F8F8] rounded-[8px]"
                    >
                      <span className="text-[13px] text-[#0D0D0D]">{category}</span>
                      <button className="text-[#F36A4F] hover:text-[#E55A3F]">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="mt-3 text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium">
                  + Add Category
                </button>
              </div>

              {/* SLA Configuration */}
              <div>
                <h4 className="text-[14px] font-semibold text-[#0D0D0D] mb-3">
                  SLA Settings
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Default SLA (hours)
                    </label>
                    <input
                      type="number"
                      defaultValue="48"
                      className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Warning before breach (hours)
                    </label>
                    <input
                      type="number"
                      defaultValue="2"
                      className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    />
                  </div>
                </div>
              </div>

              {/* Auto-Assignment */}
              <div>
                <h4 className="text-[14px] font-semibold text-[#0D0D0D] mb-3">
                  Auto-Assignment
                </h4>
                <label className="flex items-center gap-2 mb-3">
                  <input type="checkbox" className="w-4 h-4 accent-[#F36A4F]" />
                  <span className="text-[13px] text-[#3D3D3D]">Enable auto-assignment</span>
                </label>
                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Assignment Method
                  </label>
                  <select className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                    <option>Round-robin</option>
                    <option>By category</option>
                    <option>By keyword</option>
                  </select>
                </div>
              </div>

              {/* Spam & Blocklist */}
              <div>
                <h4 className="text-[14px] font-semibold text-[#0D0D0D] mb-3">
                  Spam & Blocklist
                </h4>
                <div className="space-y-2">
                  <button className="w-full h-[44px] px-[16px] rounded-[12px] border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D] flex items-center justify-between">
                    <span>Manage Blocklist</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 accent-[#F36A4F]" />
                    <span className="text-[13px] text-[#3D3D3D]">Auto-detect spam</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}