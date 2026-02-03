import { useApi } from '@/app/context/ApiContext';
import React, { useEffect, useState } from 'react';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';
import { AramInput } from '@/app/components/aram/AramInput';
import { AramSelect } from '@/app/components/aram/AramSelect';
import { Download, FileText, Search } from 'lucide-react';
import { toast } from 'sonner';
import { generateGenericPDF, generateReceiptPDF } from '@/app/utils/pdfGenerator';

interface ReportsProps {
  user: {
    name: string;
    email: string;
    phone: string;
    pan?: string;
    address?: string;
  };
}

interface Receipt {
  id: number;
  date: string;
  receiptNo: string;
  type: string;
  amount: number;
  eligible80G: boolean;
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

export function Reports({ user }: ReportsProps) {
  const { user: apiAuth } = useApi();
  const [activeTab, setActiveTab] = useState<'receipts' | '80g' | 'tax'>('receipts');
  
  // Data States
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [taxDocs, setTaxDocs] = useState<TaxDoc[]>([]);
  
  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter States
  const [searchReceipt, setSearchReceipt] = useState('');
  const [selectedFY, setSelectedFY] = useState('fy2025-26');
  const [selectedType, setSelectedType] = useState('');

  // Fetch data based on active tab
  useEffect(() => {
    if (!apiAuth?.accessToken) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const baseUrl = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:3000/api';
        const headers = { 'Authorization': `Bearer ${apiAuth.accessToken}` };

        if (activeTab === 'receipts') {
          const res = await fetch(`${baseUrl}/donors/me/donations`, { headers });
          if (res.ok) {
            const data = await res.json();
            setReceipts(data || []);
          }
        } else {
          // Both 80G and Tax tabs use the tax-summaries endpoint
          const res = await fetch(`${baseUrl}/donors/me/tax-summaries`, { headers });
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
  }, [activeTab, apiAuth?.accessToken]);

  // Helper to map option values back to receipt type strings
  const getPaymentTypeLabel = (value: string) => {
    const option = donationTypeOptions.find((opt) => opt.value === value);
    return option ? option.label : '';
  };

  const filteredReceipts = React.useMemo(() => {
    return receipts.filter((receipt: Receipt) => {
      // 1. Text Search (Receipt No)
      const matchesSearch =
        !searchReceipt ||
        receipt.receiptNo.toLowerCase().includes(searchReceipt.toLowerCase());

      // 2. Donation Type Filter
      // Note: receipts from API use labels like 'Education Fund', options use values like 'education'
      // We need to match the label if a type is selected.
      const matchesType = !selectedType || receipt.type === getPaymentTypeLabel(selectedType);

      // 3. Financial Year Filter
      let matchesFY = true;
      if (selectedFY) {
        const receiptDate = new Date(receipt.date);
        const [startYearStr] = selectedFY.replace('fy', '').split('-');
        const startYear = parseInt(startYearStr, 10); // e.g., 2024
        // FY is from April 1st of startYear to March 31st of startYear + 1
        const fyStart = new Date(`${startYear}-04-01`);
        const fyEnd = new Date(`${startYear + 1}-03-31T23:59:59`);
        matchesFY = receiptDate >= fyStart && receiptDate <= fyEnd;
      }

      return matchesSearch && matchesType && matchesFY;
    });
  }, [receipts, searchReceipt, selectedFY, selectedType]);

  const handleDownloadReceipt = (receipt: Receipt) => {
    try {
      generateReceiptPDF(receipt, user);
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
      user,
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
      user
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
      user
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
      user
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

      {/* Tabs */}
      <div className="flex gap-[8px] border-b border-[#DBDBDB]">
        {(['receipts', '80g', 'tax'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-[24px] py-[12px] transition-colors capitalize ${
              activeTab === tab
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
        <AramCard noPadding>
          {/* Filters */}
          <div className="p-[16px] border-b border-[#DBDBDB] flex flex-col md:flex-row gap-[12px]">
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
                {filteredReceipts.map((receipt) => (
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

          {filteredReceipts.length === 0 && (
            <div className="p-[48px] text-center">
              <FileText size={48} color="#DBDBDB" className="mx-auto mb-[16px]" />
              <p style={{ fontSize: '16px', color: '#6E6E6E' }}>No receipts available yet</p>
            </div>
          )}
        </AramCard>
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
                  <AramButton variant="primary" onClick={() => handleDownload80GSummary('FY 2024-25')}>
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
                  <AramButton variant="primary" onClick={() => handleDownloadTaxSummary('FY 2024-25')}>
                    <Download size={18} className="inline mr-2" />
                    Download Tax Summary (FY 2024-25)
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
