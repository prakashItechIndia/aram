import { useState, useMemo } from 'react';
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
  const { api } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'communication' | 'notes'>('overview');

  const { data: donorsRaw, isLoading, error } = useQuery({
    queryKey: ['donors'],
    queryFn: async () => {
      const res = await api.donorsApi.donorsControllerFindAll();
      return (res as { data?: unknown })?.data;
    },
  });

  const donors: Donor[] = useMemo(() => {
    const list = Array.isArray(donorsRaw) ? donorsRaw : [];
    return list.map((row: Record<string, unknown>) => ({
      id: String(row.id ?? ''),
      name: String(row.name ?? ''),
      email: String(row.email ?? ''),
      mobile: String(row.mobile ?? ''),
      totalDonated: Number(row.totalDonated ?? 0),
      lastDonation: formatDate(row.lastDonationAt as string | Date),
      donationCount: Number(row.donationCount ?? 0),
      tags: parseTags(row.tags as string),
      status: (row.status === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive',
    }));
  }, [donorsRaw]);

  const donorsFallback: Donor[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      mobile: '+91 98765 43210',
      totalDonated: 125000,
      lastDonation: '20 Jan 2026',
      donationCount: 12,
      tags: ['Regular', '80G'],
      status: 'active',
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      mobile: '+91 98765 43211',
      totalDonated: 85000,
      lastDonation: '18 Jan 2026',
      donationCount: 8,
      tags: ['80G'],
      status: 'active',
    },
    {
      id: '3',
      name: 'Amit Patel',
      email: 'amit.patel@example.com',
      mobile: '+91 98765 43212',
      totalDonated: 45000,
      lastDonation: '15 Jan 2026',
      donationCount: 5,
      tags: ['Regular'],
      status: 'active',
    },
    {
      id: '4',
      name: 'Sunita Devi',
      email: 'sunita.devi@example.com',
      mobile: '+91 98765 43213',
      totalDonated: 150000,
      lastDonation: '10 Jan 2026',
      donationCount: 15,
      tags: ['VIP', 'Regular', '80G'],
      status: 'active',
    },
    {
      id: '5',
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      mobile: '+91 98765 43214',
      totalDonated: 25000,
      lastDonation: '05 Dec 2025',
      donationCount: 3,
      tags: [],
      status: 'inactive',
    },
  ];

  const displayDonors = (donors.length > 0 ? donors : donorsFallback).filter((d) => {
    const matchSearch =
      !searchQuery ||
      [d.name, d.email, d.mobile].some((v) => v.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const donationHistory = [
    { date: '20 Jan 2026', amount: 15000, category: 'Education', receipt: 'ARAM/2025-26/00123' },
    { date: '15 Dec 2025', amount: 10000, category: 'Healthcare', receipt: 'ARAM/2025-26/00089' },
    { date: '10 Nov 2025', amount: 25000, category: 'General', receipt: 'ARAM/2025-26/00045' },
    { date: '05 Oct 2025', amount: 5000, category: 'Education', receipt: 'ARAM/2025-26/00023' },
  ];
  
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
          <Button>
            <Download className="w-4 h-4" />
            Export
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
              <div className="space-y-[12px]">
                {donationHistory.map((donation, index) => (
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
                      <Button variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {activeTab === 'overview' && (
              <Card>
                <p className="text-[14px] leading-[20px] text-[#6E6E6E]">
                  Detailed donor profile and analytics coming soon...
                </p>
              </Card>
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
            <div className="flex gap-[12px] pt-4 border-t border-[#DBDBDB]">
              <Button fullWidth variant="outline">
                <Mail className="w-4 h-4" />
                Send Email
              </Button>
              <Button fullWidth>
                <FileText className="w-4 h-4" />
                Generate Report
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
