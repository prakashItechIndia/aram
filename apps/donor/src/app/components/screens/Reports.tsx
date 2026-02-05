import { useApi } from '@/app/context/ApiContext';
import { useEffect, useState } from 'react';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';
import { AramInput } from '@/app/components/aram/AramInput';
import { AramSelect } from '@/app/components/aram/AramSelect';
import { Download, FileText, Search } from 'lucide-react';
import { toast } from 'sonner';
import { generateGenericPDF, generateReceiptPDF } from '@/app/utils/pdfGenerator';

export function Reports() {
  const { user: apiAuth, user } = useApi();
  interface Receipt {
    id: number;
    date: string;
    receiptNo: string;
    type: string;
    amount: number;
    eligible80G: boolean;
    donorName?: string;
    donorEmail?: string;
    donorMobile?: string;
    donorPan?: string;
    donorAddress?: string;
  }

  interface TaxDoc {
    id: number;
    year: string;
    generatedDate: string;
    totalAmount: number;
    fileName: string;
    type?: string;
  }

  const fyOptions = [
    { value: '', label: 'All Years' },
    { value: 'fy2025-26', label: 'FY 2025-26' },
    { value: 'fy2024-25', label: 'FY 2024-25' },
    { value: 'fy2023-24', label: 'FY 2023-24' },
    { value: 'fy2022-23', label: 'FY 2022-23' },
  ];

  const donationTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'aram-sei', label: 'Aram Sei Fund' },
    { value: 'building', label: 'Building Fund' },
    { value: 'education', label: 'Education Fund' },
    { value: 'general', label: 'General Fund' },
    { value: 'medical', label: 'Medical Fund' },
    { value: 'sairam-sap', label: 'Sairam SAP' },
  ];

  const [activeTab, setActiveTab] = useState<'receipts' | '80g' | 'tax'>('receipts');

  // Data States
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [taxDocs, setTaxDocs] = useState<TaxDoc[]>([]);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);

  // Filter States
  const [searchReceipt, setSearchReceipt] = useState('');
  const [selectedFY, setSelectedFY] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Pagination States
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Fetch data based on active tab and filters
  useEffect(() => {
    if (!apiAuth?.accessToken) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const baseUrl = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:3000/api';
        const headers = { 'Authorization': `Bearer ${apiAuth.accessToken}` };

        if (activeTab === 'receipts') {
          // Build query parameters for filtering and pagination
          const params = new URLSearchParams();
          params.set('page', String(page));
          params.set('limit', String(limit));
          if (searchReceipt) params.append('searchReceipt', searchReceipt);
          if (selectedFY) params.append('financialYear', selectedFY);
          if (selectedType) params.append('donationType', selectedType);

          const queryString = params.toString();
          const url = `${baseUrl}/donors/me/donations${queryString ? `?${queryString}` : ''}`;

          const res = await fetch(url, { headers });
          if (res.ok) {
            const response = await res.json();
            const sortedData = (response.data || []).sort((a: Receipt, b: Receipt) => b.id - a.id);
            setReceipts(sortedData);
            setTotal(response.total || 0);
          }
        } else {
          // Both 80G and Tax tabs use the tax-summaries endpoint
          const params = new URLSearchParams();
          if (selectedFY) params.append('financialYear', selectedFY);
          if (selectedType) params.append('donationType', selectedType);

          const res = await fetch(`${baseUrl}/donors/me/tax-summaries?${params.toString()}`, { headers });
          if (res.ok) {
            const data = await res.json();
            setTaxDocs(data || []);
          }
        }
      } catch (err) {
        console.error('Failed to fetch report data:', err);
        toast.error('Failed to load report data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, apiAuth?.accessToken, searchReceipt, selectedFY, selectedType, page, limit]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchReceipt, selectedFY, selectedType]);

  const handleDownloadReceipt = (receipt: Receipt) => {
    try {
      // Use donor information from the receipt/donation record
      const userInfo = {
        name: receipt.donorName || user?.name || '',
        email: receipt.donorEmail || user?.email || '',
        phone: receipt.donorMobile || (user as any)?.mobileNumber || user?.phone || '',
        pan: receipt.donorPan || user?.pan || '',
        address: receipt.donorAddress || user?.address || (user as any)?.location || ''
      };
      generateReceiptPDF(receipt, userInfo);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleDownload80GSummary = (fy: string) => {
    generateGenericPDF(
      `80G Summary - ${fy}`,
      [
        `Financial Year: ${fy}`,
        `Generated Date: ${new Date().toLocaleDateString()}`,
        'This summary contains details of all donations eligible for 80G exemption.',
      ],
      `80G_Summary_${fy}.pdf`,
      user ? {
        name: user.name || '',
        pan: user.pan || ''
      } : { name: '', pan: '' },
      {
        head: [['Date', 'Receipt No', 'Amount']],
        body: receipts
          // Filter only for the requested FY for the PDF
          .filter((r: Receipt) => {
            const d = new Date(r.date);
            const m = d.getMonth();
            const y = d.getFullYear();
            const startY = m < 3 ? y - 1 : y;
            return `FY ${startY}-${(startY + 1).toString().slice(-2)}` === fy;
          })
          .map((r: Receipt) => [r.date, r.receiptNo, `INR ${r.amount.toLocaleString()}`]),
      }
    );
  };

  const handleDownload80GDoc = (doc: TaxDoc) => {
    generateGenericPDF(
      `80G Certificate - ${doc.year}`,
      [
        `Certificate ID: 80G-${doc.id}-${doc.year}`,
        `Total Eligible Amount: INR ${doc.totalAmount.toLocaleString()}`,
        `Generated Date: ${doc.generatedDate}`,
        'Thank you for your generous contribution.',
      ],
      doc.fileName,
      user ? {
        name: user.name || '',
        pan: user.pan || ''
      } : { name: '', pan: '' }
    );
  };

  const handleDownloadTaxSummary = (fy: string) => {
    generateGenericPDF(
      `Tax Summary - ${fy}`,
      [
        `Financial Year: ${fy}`,
        `Generated Date: ${new Date().toLocaleDateString()}`,
        'Consolidated statement for tax filing purposes.',
      ],
      `Tax_Summary_${fy}.pdf`,
      user ? {
        name: user.name || '',
        pan: user.pan || ''
      } : { name: '', pan: '' }
    );
  };

  const handleDownloadTaxDoc = (doc: TaxDoc) => {
    generateGenericPDF(
      `Tax Document - ${doc.type || 'Consolidated'}`,
      [
        `Document Type: ${doc.type || 'Consolidated'}`,
        `Financial Year: ${doc.year}`,
        `Generated Date: ${doc.generatedDate}`,
        'Please consult your tax advisor for filing details.',
      ],
      doc.fileName,
      user ? {
        name: user.name || '',
        pan: user.pan || ''
      } : { name: '', pan: '' }
    );
  };

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

      {/* Common Filters */}
      <AramCard noPadding>
        <div className="p-[16px] border-[#DBDBDB] flex flex-col md:flex-row gap-[12px]">
          <div className="flex-1 relative">
            <AramInput
              placeholder="Search by receipt number"
              value={searchReceipt}
              onChange={setSearchReceipt}
            />
            <Search className="absolute right-[14px] top-[12px] pointer-events-none" size={18} color="#6E6E6E" />
          </div>
          <AramSelect
            value={selectedFY}
            onChange={setSelectedFY}
            options={fyOptions}
            className="w-full md:w-[220px]"
          />
          <AramSelect
            value={selectedType}
            onChange={setSelectedType}
            options={donationTypeOptions}
            className="w-full md:w-[220px]"
          />
        </div>
      </AramCard>

      {/* Tabs */}
      <div className="flex gap-[8px] border-b border-[#DBDBDB]">
        {(['receipts', '80g', 'tax'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-[24px] py-[12px] transition-colors capitalize ${activeTab === tab
              ? 'border-b-2 border-[#F36A4F] text-[#F36A4F]'
              : 'text-[#6E6E6E] hover:text-[#3D3D3D]'
              }`}
            style={{ fontSize: '14px', fontWeight: 600 }}
          >
            {tab === '80g' ? '80G Reports' : tab === 'tax' ? 'Tax Documents' : 'Receipts'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <AramCard>
          <div className="p-[48px] text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="w-8 h-8 border-4 border-[#F36A4F] border-t-transparent rounded-full animate-spin"></div>
              <p style={{ fontSize: '16px', color: '#6E6E6E' }}>Loading reports...</p>
            </div>
          </div>
        </AramCard>
      ) : activeTab === 'receipts' ? (
        <div className="flex flex-col gap-[24px]">
          <AramCard noPadding>
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
                  {receipts.map((receipt) => (
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
                          onClick={() => handleDownloadReceipt(receipt)}
                          className="flex items-center gap-[8px] hover:opacity-80 transition-opacity"
                          style={{ color: '#F36A4F' }}
                        >
                          <Download size={16} />
                          <span style={{ fontSize: '14px' }}>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {total > limit && (
              <div className="p-[16px] border-t border-[#DBDBDB] flex items-center justify-between flex-wrap gap-4">
                <div className="text-[14px] text-[#6E6E6E]">
                  Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of {total} receipts
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

            {receipts.length === 0 && (
              <div className="p-[48px] text-center">
                <FileText size={48} color="#DBDBDB" className="mx-auto mb-[16px]" />
                <p style={{ fontSize: '16px', color: '#6E6E6E' }}>No receipts available yet</p>
              </div>
            )}
          </AramCard>
        </div>
      ) : activeTab === '80g' ? (
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
                <AramButton
                  variant="primary"
                  disabled={!selectedFY}
                  onClick={() => {
                    const label = fyOptions.find(o => o.value === selectedFY)?.label || 'Summary';
                    handleDownload80GSummary(label);
                  }}
                >
                  <Download size={18} className="inline mr-2" />
                  Download 80G Summary ({fyOptions.find(o => o.value === selectedFY)?.label || 'Select FY'})
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
                  {taxDocs.map((doc) => (
                    <tr key={doc.id} style={{ height: '52px', borderBottom: '1px solid #DBDBDB' }}>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D3D3D', fontWeight: 600 }}>{doc.year}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D3D3D' }}>{doc.generatedDate}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D3D3D', fontWeight: 600 }}>₹{doc.totalAmount.toLocaleString()}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          className="flex items-center gap-[8px] hover:opacity-80 transition-opacity"
                          style={{ color: '#F36A4F' }}
                          onClick={() => handleDownload80GDoc(doc)}
                        >
                          <Download size={16} />
                          <span style={{ fontSize: '14px' }}>Download PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {taxDocs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-[48px] text-center">
                        <FileText size={48} color="#DBDBDB" className="mx-auto mb-[16px]" />
                        <p style={{ fontSize: '16px', color: '#6E6E6E' }}>No 80G documents available yet</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </AramCard>
        </div>
      ) : (
        <div className="flex flex-col gap-[24px]">
          <AramCard>
            <div className="flex flex-col gap-[16px]">
              <div className="flex items-center justify-between">
                <div>
                  <h3>Annual Tax Summary</h3>
                  <p style={{ fontSize: '14px', color: '#6E6E6E', marginTop: '4px' }}>
                    Consolidated tax certificates for your financial records.
                  </p>
                </div>
                <AramButton
                  variant="primary"
                  disabled={!selectedFY}
                  onClick={() => {
                    const label = fyOptions.find(o => o.value === selectedFY)?.label || 'Summary';
                    handleDownloadTaxSummary(label);
                  }}
                >
                  <Download size={18} className="inline mr-2" />
                  Download Tax Summary ({fyOptions.find(o => o.value === selectedFY)?.label || 'Select FY'})
                </AramButton>
              </div>
            </div>
          </AramCard>

          <AramCard noPadding>
            <div className="p-[24px] border-b border-[#DBDBDB]">
              <h3>Generated Tax Documents</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ height: '48px', backgroundColor: '#F3F3F3' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Financial Year</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Generated Date</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Certificate Type</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {taxDocs.map((doc) => (
                    <tr key={doc.id} style={{ height: '52px', borderBottom: '1px solid #DBDBDB' }}>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D3D3D', fontWeight: 600 }}>{doc.year}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D3D3D' }}>{doc.generatedDate}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D3D3D', fontWeight: 600 }}>{doc.type}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          className="flex items-center gap-[8px] hover:opacity-80 transition-opacity"
                          style={{ color: '#F36A4F' }}
                          onClick={() => handleDownloadTaxDoc(doc)}
                        >
                          <Download size={16} />
                          <span style={{ fontSize: '14px' }}>Download PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {taxDocs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-[48px] text-center">
                        <FileText size={48} color="#DBDBDB" className="mx-auto mb-[16px]" />
                        <p style={{ fontSize: '16px', color: '#6E6E6E' }}>No tax documents available yet</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </AramCard>
        </div>
      )}
    </div>
  );
}
