import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/app/context/ApiContext';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { Table, Column } from '../ui/table';
import { Badge } from '../ui/badge';
import { Drawer } from '../ui/drawer';
import { Search, Download, Eye, Users, Mail, Phone, MapPin, Calendar, IndianRupee, FileText } from 'lucide-react';
import { toast } from '../ui/toast';
import { generateReceiptPDF, generateDonationHistoryPDF } from '../../utils/pdfGenerator';
import { useDebounce } from '../../hooks/useDebounce';

interface Donor {
  id: string;
  name: string;
  email: string;
  mobile: string;
  totalDonated: number;
  lastDonation: string;
  donationCount: number;
  tags: string[];
  status: 'active' | 'inactive';
  pan?: string;
  address?: string;
}

function parseTags(tags: string | null | undefined): string[] {
  if (!tags) return [];
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [tags];
  } catch {
    return typeof tags === 'string' ? tags.split(',').map((s) => s.trim()).filter(Boolean) : [];
  }
}

function formatDate(d: string | Date | null | undefined): string {
  if (!d) return '-';
  const date = typeof d === 'string' ? new Date(d) : d;
  return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function Donors() {
  const { apiFetch } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'communication' | 'notes'>('overview');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, statusFilter]);

  const { data: donorsResponse, isLoading, error } = useQuery({
    queryKey: ['donors', page, limit, debouncedSearchQuery, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearchQuery) params.append('search', debouncedSearchQuery);
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
      
      const res = await apiFetch(`/donors?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch donors');
      return res.json();
    },
  });

  const displayDonors = useMemo(() => {
    const list = Array.isArray(donorsResponse?.data) ? donorsResponse.data : [];
    return list.map((row: Record<string, unknown>) => ({
      id: String(row.id ?? ''),
      name: String(row.name ?? ''),
      email: String(row.email ?? ''),
      mobile: String(row.mobileNumber ?? ''),
      totalDonated: Number(row.totalDonated ?? 0),
      lastDonation: formatDate(row.lastDonationAt as string | Date),
      donationCount: Number(row.donationCount ?? 0),
      tags: parseTags(row.tags as string),
      status: (row.status === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive',
      pan: String(row.pan || ''),
      address: String(row.address || row.location || ''),
    }));
  }, [donorsResponse]);

  const meta = donorsResponse?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['donorHistory', selectedDonor?.id],
    enabled: !!selectedDonor && activeTab === 'history',
    queryFn: async () => {
      // Use apiFetch helper from context which handles auth tokens automatically
      const res = await apiFetch(`/donors/${selectedDonor?.id}/donations?limit=1000`);
      if (!res.ok) throw new Error('Failed to fetch history');
      return res.json();
    }
  });

  const donationHistory = historyData?.data?.map((d: any) => ({
    date: formatDate(d.date),
    amount: Number(d.amount),
    category: d.type || 'General',
    receipt: d.receiptNo,
    eligible80G: d.eligible80G,
  })) || [];

  const handleDownloadReceipt = (donation: any) => {
    if (!selectedDonor) return;
    
    generateReceiptPDF(
      {
        receiptNo: donation.receipt,
        date: donation.date,
        eligible80G: donation.eligible80G,
        type: donation.category,
        amount: donation.amount,
      },
      {
        name: selectedDonor.name,
        email: selectedDonor.email,
        phone: selectedDonor.mobile,
        pan: selectedDonor.pan,
        address: selectedDonor.address
      }
    );
  };

  const handleGenerateReport = async () => {
    if (!selectedDonor) return;
    try {
      setIsGeneratingReport(true);
      const res = await apiFetch(`/donors/${selectedDonor.id}/donations?limit=1000`);
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      const allDonations = data.data || [];

      // Create Receipt objects
      const receipts = allDonations.map((d: any) => ({
        date: formatDate(d.date),
        receiptNo: d.receiptNo,
        type: d.type || 'General',
        amount: Number(d.amount),
        eligible80G: d.eligible80G,
      }));

      generateDonationHistoryPDF(receipts, [], {
        name: selectedDonor.name,
        email: selectedDonor.email,
        phone: selectedDonor.mobile,
        pan: selectedDonor.pan,
        address: selectedDonor.address
      });
      
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedDonor) return;
    try {
      setIsSendingEmail(true);
      toast.info('Sending email...');
      const res = await apiFetch(`/donors/${selectedDonor.id}/donations?limit=1000`);
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      const allDonations = data.data || [];

      // Create Receipt objects
      const receipts = allDonations.map((d: any) => ({
        date: formatDate(d.date),
        receiptNo: d.receiptNo,
        type: d.type || 'General',
        amount: Number(d.amount),
        eligible80G: d.eligible80G,
      }));

      const blob = await generateDonationHistoryPDF(receipts, [], {
        name: selectedDonor.name,
        email: selectedDonor.email,
        phone: selectedDonor.mobile,
        pan: selectedDonor.pan,
        address: selectedDonor.address
      }, { returnBlob: true }) as Blob;

      const formData = new FormData();
      formData.append('file', blob, 'Donation_History.pdf');

      const sendRes = await apiFetch(`/donors/${selectedDonor.id}/send-report`, {
        method: 'POST',
        body: formData,
      });

      if (!sendRes.ok) throw new Error('Failed to send email');
      
      toast.success('Report emailed successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to send email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      toast.info('Exporting donors...');
      
      const params = new URLSearchParams({
        page: '1',
        limit: '1000000', // Fetch all matching current filters
      });
      if (debouncedSearchQuery) params.append('search', debouncedSearchQuery);
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);

      const res = await apiFetch(`/donors?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch donors for export');
      
      const responseData = await res.json();
      const allDonors = Array.isArray(responseData.data) ? responseData.data : [];

      if (!allDonors.length) {
        toast.error('No donors to export');
        return;
      }

      const headers = ['Name', 'Email', 'Mobile', 'PAN', 'Address', 'Total Donated', 'Donation Count', 'Last Donation', 'Status'];
      const rows = allDonors.map((row: any) => [
        `"${row.name || ''}"`,
        `"${row.email || ''}"`,
        `"${row.mobileNumber || ''}"`,
        `"${row.pan || ''}"`,
        `"${(row.address || row.location || '').replace(/"/g, '""')}"`,
        Number(row.totalDonated || 0),
        Number(row.donationCount || 0),
        `"${formatDate(row.lastDonationAt)}"`,
        row.status
      ].join(','));

      const csvContent = [headers.join(','), ...rows].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Donors_Export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success('Donors list exported successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to export donors');
    } finally {
      setIsExporting(false);
    }
  };
   
  
  const columns: Column<Donor>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'mobile', header: 'Mobile' },
    {
      key: 'totalDonated',
      header: 'Total Donated',
      render: (item) => `₹${item.totalDonated.toLocaleString()}`,
    },
    { key: 'lastDonation', header: 'Last Donation' },
    { key: 'donationCount', header: 'Donation Count' },
    {
      key: 'tags',
      header: 'Tags',
      render: (item) => (
        <div className="flex gap-1 flex-wrap">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-[11px] leading-[14px] bg-[#FEF1EE] text-[#F36A4F] rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <Badge variant={item.status === 'active' ? 'success' : 'failed'}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedDonor(item);
          }}
          className="w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-[#F3F3F3]"
        >
          <Eye className="w-4 h-4 text-[#6E6E6E]" />
        </button>
      ),
    },
  ];
  
  if (error) {
    return (
      <div className="space-y-[24px]">
        <p className="text-red-600">Failed to load donors. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-[24px]">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] leading-[36px] font-bold text-[#0D0D0D]">All Donors</h1>
          <p className="text-[16px] leading-[24px] text-[#6E6E6E] mt-1">
            Manage donor information and history
          </p>
        </div>
        <div className="flex gap-[12px]">
          <Button variant="outline">
            <Users className="w-4 h-4" />
            Merge Duplicates
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>
      
      {/* Filter Bar */}
      <Card className="!p-[16px]">
        <div className="flex flex-wrap items-end gap-[12px]">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E6E6E]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, mobile..."
                className="w-full h-[44px] pl-[44px] pr-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
              />
            </div>
          </div>
          
          <div className="w-[220px]">
            <Select
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
          
          <div className="w-[220px]">
            <Select
              options={[
                { value: 'all-tags', label: 'All Tags' },
                { value: 'regular', label: 'Regular' },
                { value: '80g', label: '80G' },
                { value: 'vip', label: 'VIP' },
              ]}
            />
          </div>
        </div>
      </Card>
      
      {/* Donors Table */}
      {isLoading ? (
        <Card className="!p-[24px]">
          <p className="text-[#6E6E6E]">Loading donors...</p>
        </Card>
      ) : (
      <Table
        columns={columns}
        data={displayDonors}
        loading={false}
        emptyMessage="No donors found"
        onRowClick={(donor) => setSelectedDonor(donor)}
      />
      )}

      {/* Pagination */}
      {!isLoading && displayDonors.length > 0 && (
        <div className="px-[24px] py-[16px] border-t border-[#DBDBDB] flex items-center justify-between flex-wrap gap-4">
          <div className="text-[14px] text-[#6E6E6E]">
            Showing {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} donors
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p: number) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
              className="h-[40px] px-[16px] border border-[#DBDBDB] rounded-[8px] text-[14px] font-medium text-[#3D3D3D] bg-white hover:bg-[#F3F3F3] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 text-[14px] text-[#3D3D3D]">
              Page {page} of {meta.totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p: number) => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages || isLoading}
              className="h-[40px] px-[16px] border border-[#DBDBDB] rounded-[8px] text-[14px] font-medium text-[#3D3D3D] bg-white hover:bg-[#F3F3F3] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      {/* Donor Profile Drawer */}
      <Drawer
        isOpen={!!selectedDonor}
        onClose={() => setSelectedDonor(null)}
        title="Donor Profile"
        width="600px"
      >
        {selectedDonor && (
          <div className="space-y-[24px]">
            {/* Donor Info Card */}
            <Card>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-[#F36A4F] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {selectedDonor.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D]">
                    {selectedDonor.name}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    {selectedDonor.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-[11px] leading-[14px] bg-[#FEF1EE] text-[#F36A4F] rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    <Badge variant={selectedDonor.status === 'active' ? 'success' : 'failed'}>
                      {selectedDonor.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[14px] leading-[20px]">
                  <Mail className="w-4 h-4 text-[#6E6E6E]" />
                  <span className="text-[#3D3D3D]">{selectedDonor.email}</span>
                </div>
                <div className="flex items-center gap-3 text-[14px] leading-[20px]">
                  <Phone className="w-4 h-4 text-[#6E6E6E]" />
                  <span className="text-[#3D3D3D]">{selectedDonor.mobile}</span>
                </div>
              </div>
            </Card>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-[16px]">
              <Card className="text-center">
                <div className="w-10 h-10 bg-[#FEF1EE] rounded-full flex items-center justify-center mx-auto mb-2">
                  <IndianRupee className="w-5 h-5 text-[#F36A4F]" />
                </div>
                <p className="text-[20px] leading-[28px] font-bold text-[#0D0D0D]">
                  ₹{selectedDonor.totalDonated.toLocaleString()}
                </p>
                <p className="text-[12px] leading-[16px] text-[#6E6E6E]">Total Donated</p>
              </Card>
              
              <Card className="text-center">
                <div className="w-10 h-10 bg-[#F1EEED] rounded-full flex items-center justify-center mx-auto mb-2">
                  <FileText className="w-5 h-5 text-[#734F48]" />
                </div>
                <p className="text-[20px] leading-[28px] font-bold text-[#0D0D0D]">
                  {selectedDonor.donationCount}
                </p>
                <p className="text-[12px] leading-[16px] text-[#6E6E6E]">Donations</p>
              </Card>
              
              <Card className="text-center">
                <div className="w-10 h-10 bg-[#FEF1EE] rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-5 h-5 text-[#F36A4F]" />
                </div>
                <p className="text-[14px] leading-[20px] font-semibold text-[#0D0D0D]">
                  {selectedDonor.lastDonation}
                </p>
                <p className="text-[12px] leading-[16px] text-[#6E6E6E]">Last Donation</p>
              </Card>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-[#DBDBDB]">
              <div className="flex gap-[24px]">
                {[
                  { key: 'overview', label: 'Overview' },
                  { key: 'history', label: 'Donation History' },
                  { key: 'communication', label: 'Communication' },
                  { key: 'notes', label: 'Notes' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`pb-3 text-[14px] leading-[20px] font-medium border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? 'border-[#F36A4F] text-[#F36A4F]'
                        : 'border-transparent text-[#6E6E6E] hover:text-[#3D3D3D]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Tab Content */}
            {activeTab === 'history' && (
              <div className="space-y-[12px] max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                {isHistoryLoading ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F36A4F]"></div>
                  </div>
                ) : donationHistory.length > 0 ? (
                  donationHistory.map((donation: any, index: number) => (
                    <Card key={index} className="!p-[16px]">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[16px] leading-[24px] font-semibold text-[#0D0D0D]">
                              ₹{donation.amount.toLocaleString()}
                            </p>
                            <span className="text-[12px] leading-[16px] text-[#6E6E6E]">•</span>
                            <span className="text-[12px] leading-[16px] text-[#6E6E6E]">
                              {donation.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[12px] leading-[16px] text-[#6E6E6E]">
                            <span>{donation.date}</span>
                            <span>•</span>
                            <span>{donation.receipt}</span>
                          </div>
                        </div>
                        <Button variant="ghost" onClick={() => handleDownloadReceipt(donation)}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-[#6E6E6E]">
                    No donation history found
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'overview' && selectedDonor && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                   <Card className="p-4 bg-[#FFF5F3] border-[#FFDCCF]">
                      <div className="text-[12px] text-[#6E6E6E] mb-1">Total Donated</div>
                      <div className="text-[24px] font-bold text-[#F36A4F]">₹ {selectedDonor.totalDonated.toLocaleString('en-IN')}</div>
                   </Card>
                   <Card className="p-4">
                      <div className="text-[12px] text-[#6E6E6E] mb-1">Total Donations</div>
                      <div className="text-[24px] font-bold text-[#3D3D3D]">{selectedDonor.donationCount}</div>
                   </Card>
                </div>

                <Card className="p-0 overflow-hidden">
                  <div className="p-4 border-b border-[#DBDBDB] bg-[#F9FAFB]">
                    <h3 className="text-[16px] font-semibold text-[#3D3D3D]">Personal Details</h3>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[12px] text-[#6E6E6E]">Mobile</label>
                      <div className="text-[14px] text-[#3D3D3D] font-medium">{selectedDonor.mobile}</div>
                    </div>
                    <div>
                      <label className="text-[12px] text-[#6E6E6E]">Email</label>
                      <div className="text-[14px] text-[#3D3D3D] font-medium break-all">{selectedDonor.email}</div>
                    </div>
                    <div>
                      <label className="text-[12px] text-[#6E6E6E]">PAN Number</label>
                      <div className="text-[14px] text-[#3D3D3D] font-medium">{selectedDonor.pan || '-'}</div>
                    </div>
                    <div>
                      <label className="text-[12px] text-[#6E6E6E]">Address</label>
                      <div className="text-[14px] text-[#3D3D3D] font-medium">{selectedDonor.address || '-'}</div>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="text-[16px] font-semibold text-[#3D3D3D]">Account Status</h3>
                     <span className={`px-2 py-1 rounded-full text-[12px] font-medium ${
                       selectedDonor.status === 'active' ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#FEF2F2] text-[#DC2626]'
                     }`}>
                       {selectedDonor.status.charAt(0).toUpperCase() + selectedDonor.status.slice(1)}
                     </span>
                   </div>
                   {selectedDonor.tags && selectedDonor.tags.length > 0 && (
                     <div>
                       <label className="text-[12px] text-[#6E6E6E] mb-2 block">Tags</label>
                       <div className="flex flex-wrap gap-2">
                         {selectedDonor.tags.map((tag, i) => (
                           <span key={i} className="px-2 py-1 bg-[#F3F4F6] text-[#4B5563] text-[12px] rounded-[4px]">
                             {tag}
                           </span>
                         ))}
                       </div>
                     </div>
                   )}
                </Card>
              </div>
            )}
            
            {activeTab === 'communication' && (
              <Card>
                <p className="text-[14px] leading-[20px] text-[#6E6E6E]">
                  Email and SMS communication history coming soon...
                </p>
              </Card>
            )}
            
            {activeTab === 'notes' && (
              <Card>
                <p className="text-[14px] leading-[20px] text-[#6E6E6E]">
                  Internal notes and tags coming soon...
                </p>
              </Card>
            )}
            
            {/* Actions */}
            <div className="flex gap-[12px] pt-4 border-t border-[#DBDBDB] sticky bottom-0 bg-white z-10 pb-1">
              <Button fullWidth variant="outline" onClick={handleSendEmail} disabled={isSendingEmail}>
                {isSendingEmail ? 'Sending...' : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </>
                )}
              </Button>
              <Button fullWidth onClick={handleGenerateReport} disabled={isGeneratingReport}>
                {isGeneratingReport ? 'Generating...' : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
