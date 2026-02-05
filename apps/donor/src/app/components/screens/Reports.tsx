import React, { useEffect, useState } from 'react';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';
import { AramInput } from '@/app/components/aram/AramInput';
import { AramSelect } from '@/app/components/aram/AramSelect';
import { Download, FileText, Search } from 'lucide-react';
import { useApi } from '@/app/context/ApiContext';
import { generateReceiptPDF } from '@/app/utils/pdfGenerator';

interface Donation {
  id: number;
  receiptNo: string;
  amount: number;
  date: string;
  type: string;
  status: string;
  eligible80G: boolean;
}

interface TaxSummary {
  id: number;
  year: string;
  generatedDate: string;
  totalAmount: number;
  type: string;
  fileName: string;
}

const donationTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'aram-sei', label: 'Aram Sei Fund' },
  { value: 'building', label: 'Building Fund' },
  { value: 'education', label: 'Education Fund' },
  { value: 'general', label: 'General Fund' },
  { value: 'medical', label: 'Medical Fund' },
  { value: 'sairam-sap', label: 'Sairam SAP' },
];

export function Reports() {
  const { user: apiAuth } = useApi();
  const [activeTab, setActiveTab] = useState<'receipts' | '80g' | 'tax'>('receipts');
  const [searchReceipt, setSearchReceipt] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedFY, setSelectedFY] = useState('all');
  const [selectedType, setSelectedType] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchReceipt);
    }, 1500); // 1.5 seconds debounce
    return () => clearTimeout(timer);
  }, [searchReceipt]);

  const [donations, setDonations] = useState<Donation[]>([]);
  const [summaries, setSummaries] = useState<TaxSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      if (!apiAuth?.accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const baseUrl = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:3000/api';

        // Fetch Donations for Receipts Tab
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        if (debouncedSearch) params.set('searchReceipt', debouncedSearch);
        if (selectedFY && selectedFY !== 'all') params.set('financialYear', selectedFY);
        if (selectedType) params.set('donationType', selectedType);

        const donationUrl = `${baseUrl}/donors/me/donations?${params.toString()}`;

        const donationRes = await fetch(donationUrl, {
          headers: { 'Authorization': `Bearer ${apiAuth.accessToken}` },
        });

        if (donationRes.ok) {
          const data = await donationRes.json();
          setDonations(Array.isArray(data?.data) ? data.data : []);
          setTotal(typeof data?.total === 'number' ? data.total : 0);
        }

        // Fetch Tax Summaries for 80G and Tax Tabs
        const summaryUrl = `${baseUrl}/donors/me/tax-summaries`;
        const summaryRes = await fetch(summaryUrl, {
          headers: { 'Authorization': `Bearer ${apiAuth.accessToken}` },
        });

        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          setSummaries(Array.isArray(summaryData) ? summaryData : []);
        }

      } catch (err) {
        console.error('Error fetching reports data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiAuth?.accessToken, page, limit, debouncedSearch, selectedFY, selectedType]);

  const totalPages = Math.ceil(total / limit);
  const startItem = total > 0 ? (page - 1) * limit + 1 : 0;
  const endItem = Math.min(page * limit, total);

  const handleDownloadReceipt = (donation: Donation) => {
    generateReceiptPDF(
      {
        receiptNo: donation.receiptNo,
        date: donation.date,
        eligible80G: donation.eligible80G,
        type: donation.type,
        amount: donation.amount,
      },
      {
        name: apiAuth?.name || '',
        email: apiAuth?.email || '',
        phone: apiAuth?.phone || '',
        pan: apiAuth?.pan,
        address: apiAuth?.address,
      }
    );
  };

  const displayFYOptions = [
    { value: 'all', label: 'All Financial Years' },
    ...summaries.map(s => ({
      value: `fy${s.year.replace('FY ', '')}`,
      label: s.year
    }))
  ];

  return (
    <div className="flex flex-col gap-[24px]">
      <AramCard>
        <div className="flex flex-col gap-[16px]">
          <h2>Reports & Documents</h2>
          <p style={{ fontSize: '16px', lineHeight: '24px', color: '#3D3D3D' }}>
            Download receipts and tax documents
          </p>
        </div>
      </AramCard>

      {/* Tabs */}
      <div className="flex gap-[8px] border-b border-[#DBDBDB]">
        <button
          onClick={() => setActiveTab('receipts')}
          className={`px-[24px] py-[12px] transition-colors ${activeTab === 'receipts'
            ? 'border-b-2 border-[#F36A4F] text-[#F36A4F]'
            : 'text-[#6E6E6E] hover:text-[#3D3D3D]'
            }`}
          style={{ fontSize: '14px', fontWeight: 600 }}
        >
          Receipts
        </button>
        <button
          onClick={() => setActiveTab('80g')}
          className={`px-[24px] py-[12px] transition-colors ${activeTab === '80g'
            ? 'border-b-2 border-[#F36A4F] text-[#F36A4F]'
            : 'text-[#6E6E6E] hover:text-[#3D3D3D]'
            }`}
          style={{ fontSize: '14px', fontWeight: 600 }}
        >
          80G Reports
        </button>
        <button
          onClick={() => setActiveTab('tax')}
          disabled
          className={`px-[24px] py-[12px] transition-colors ${activeTab === 'tax'
            ? 'border-b-2 border-[#F36A4F] text-[#F36A4F]'
            : 'text-[#6E6E6E] opacity-50 cursor-not-allowed'
            }`}
          style={{ fontSize: '14px', fontWeight: 600 }}
        >
          Tax Documents
        </button>
      </div>

      {/* Receipts Tab */}
      {activeTab === 'receipts' && (
        <AramCard noPadding>
          {/* Filters */}
          <div className="p-[16px] border-b border-[#DBDBDB] flex flex-col md:flex-row gap-[12px]">
            <div className="flex-1 relative">
              <AramInput
                placeholder="Search by receipt number"
                value={searchReceipt}
                onChange={(val) => {
                  setSearchReceipt(val);
                  setPage(1);
                }}
              />
              <Search className="absolute right-[14px] top-[12px] pointer-events-none" size={18} color="#6E6E6E" />
            </div>
            <AramSelect
              value={selectedFY}
              onChange={(val) => {
                setSelectedFY(val);
                setPage(1);
              }}
              options={displayFYOptions}
              className="w-full md:w-[220px]"
            />
            <AramSelect
              value={selectedType}
              onChange={(val) => {
                setSelectedType(val);
                setPage(1);
              }}
              options={donationTypeOptions}
              className="w-full md:w-[220px]"
            />
          </div>

          {/* Receipts Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ height: '48px', backgroundColor: '#F3F3F3' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Receipt No</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Type</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Amount</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>80G</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Download</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-[48px] text-center text-[#6E6E6E]">Loading receipts...</td>
                  </tr>
                ) : donations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-[48px] text-center">
                      <FileText size={48} color="#DBDBDB" className="mx-auto mb-[16px]" />
                      <p style={{ fontSize: '16px', color: '#6E6E6E' }}>No receipts available yet</p>
                    </td>
                  </tr>
                ) : (
                  donations.map((receipt) => (
                    <tr key={receipt.id} style={{ height: '52px', borderBottom: '1px solid #DBDBDB' }}>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D3D3D' }}>{receipt.date}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D3D3D', fontWeight: 600 }}>{receipt.receiptNo}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D3D3D' }}>{receipt.type}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D3D3D', fontWeight: 600 }}>₹{receipt.amount.toLocaleString()}</td>
                      <td style={{ padding: '12px 16px' }}>
                        {receipt.eligible80G ? (
                          <span style={{ color: '#734F48', fontSize: '14px', fontWeight: 600 }}>Yes</span>
                        ) : (
                          <span style={{ color: '#6E6E6E', fontSize: '14px' }}>No</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          className="flex items-center gap-[8px]"
                          style={{ color: '#F36A4F' }}
                          onClick={() => handleDownloadReceipt(receipt)}
                        >
                          <Download size={16} />
                          <span style={{ fontSize: '14px' }}>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && total > limit && (
            <div className="px-[24px] py-[16px] border-t border-[#DBDBDB] flex items-center justify-between flex-wrap gap-4">
              <div className="text-[14px] text-[#6E6E6E]">
                Showing {startItem}–{endItem} of {total} receipts
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || isLoading}
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
                  disabled={page >= totalPages || isLoading}
                  className="h-[40px] px-[16px] border border-[#DBDBDB] rounded-[8px] text-[14px] font-medium text-[#3D3D3D] bg-white hover:bg-[#F3F3F3] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </AramCard>
      )}

      {/* 80G Reports Tab */}
      {activeTab === '80g' && (
        <div className="flex flex-col gap-[24px]">
          <AramCard>
            <div className="flex flex-col gap-[16px]">
              <div className="flex items-center justify-between">
                <div>
                  <h3>Annual 80G Summary</h3>
                  <p style={{ fontSize: '14px', color: '#6E6E6E', marginTop: '4px' }}>
                    These documents are generated based on successful donations.
                  </p>
                </div>
                <AramButton variant="primary">
                  <Download size={18} className="inline mr-2" />
                  Download 80G Summary (FY 2024-25)
                </AramButton>
              </div>
            </div>
          </AramCard>

          <AramCard noPadding>
            <div className="p-[24px] border-b border-[#DBDBDB]">
              <h3>Generated 80G Documents</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ height: '48px', backgroundColor: '#F3F3F3' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Financial Year</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Generated Date</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Total Amount</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="p-[48px] text-center text-[#6E6E6E]">Loading 80G documents...</td>
                    </tr>
                  ) : summaries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-[48px] text-center text-[#6E6E6E]">No 80G documents found</td>
                    </tr>
                  ) : (
                    summaries.map((doc) => (
                      <tr key={doc.id} style={{ height: '52px', borderBottom: '1px solid #DBDBDB' }}>
                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D3D3D', fontWeight: 600 }}>{doc.year}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D3D3D' }}>{doc.generatedDate}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D3D3D', fontWeight: 600 }}>₹{doc.totalAmount.toLocaleString()}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <button className="flex items-center gap-[8px]" style={{ color: '#F36A4F' }}>
                            <Download size={16} />
                            <span style={{ fontSize: '14px' }}>Download PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </AramCard>
        </div>
      )}

      {/* Tax Documents Tab */}
      {activeTab === 'tax' && (
        <AramCard noPadding>
          <div className="p-[24px] border-b border-[#DBDBDB]">
            <h3>Tax Documents</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ height: '48px', backgroundColor: '#F3F3F3' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Document Type</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Financial Year</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Generated Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Download</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-[48px] text-center text-[#6E6E6E]">Loading tax documents...</td>
                  </tr>
                ) : summaries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-[48px] text-center text-[#6E6E6E]">No tax documents found</td>
                  </tr>
                ) : (
                  summaries.map((doc) => (
                    <tr key={doc.id} style={{ height: '52px', borderBottom: '1px solid #DBDBDB' }}>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D3D3D', fontWeight: 600 }}>{doc.type}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D3D3D' }}>{doc.year}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D3D3D' }}>{doc.generatedDate}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <button className="flex items-center gap-[8px]" style={{ color: '#F36A4F' }}>
                          <Download size={16} />
                          <span style={{ fontSize: '14px' }}>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </AramCard>
      )}
    </div>
  );
}