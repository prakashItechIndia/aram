import React, { useState } from 'react';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';
import { AramInput } from '@/app/components/aram/AramInput';
import { AramSelect } from '@/app/components/aram/AramSelect';
import { Download, FileText, Search } from 'lucide-react';

const mockReceipts = [
  { id: 1, date: '2025-01-15', receiptNo: 'AR2501150001', type: 'Education Fund', amount: 5000, eligible80G: true },
  { id: 2, date: '2025-01-10', receiptNo: 'AR2501100002', type: 'Medical Fund', amount: 2500, eligible80G: true },
  { id: 3, date: '2024-12-25', receiptNo: 'AR2412250003', type: 'General Fund', amount: 1000, eligible80G: true },
  { id: 4, date: '2024-11-10', receiptNo: 'AR2411100004', type: 'Building Fund', amount: 3000, eligible80G: true },
];

const mock80GDocs = [
  { id: 1, year: 'FY 2024-25', generatedDate: '2025-01-20', totalAmount: 8500, fileName: '80G_FY2024-25.pdf' },
  { id: 2, year: 'FY 2023-24', generatedDate: '2024-04-10', totalAmount: 15000, fileName: '80G_FY2023-24.pdf' },
];

const fyOptions = [
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

export function Reports() {
  const [activeTab, setActiveTab] = useState<'receipts' | '80g' | 'tax'>('receipts');
  const [searchReceipt, setSearchReceipt] = useState('');
  const [selectedFY, setSelectedFY] = useState('fy2024-25');
  const [selectedType, setSelectedType] = useState('');

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
          className={`px-[24px] py-[12px] transition-colors ${
            activeTab === 'receipts'
              ? 'border-b-2 border-[#F36A4F] text-[#F36A4F]'
              : 'text-[#6E6E6E] hover:text-[#3D3D3D]'
          }`}
          style={{ fontSize: '14px', fontWeight: 600 }}
        >
          Receipts
        </button>
        <button
          onClick={() => setActiveTab('80g')}
          className={`px-[24px] py-[12px] transition-colors ${
            activeTab === '80g'
              ? 'border-b-2 border-[#F36A4F] text-[#F36A4F]'
              : 'text-[#6E6E6E] hover:text-[#3D3D3D]'
          }`}
          style={{ fontSize: '14px', fontWeight: 600 }}
        >
          80G Reports
        </button>
        <button
          onClick={() => setActiveTab('tax')}
          className={`px-[24px] py-[12px] transition-colors ${
            activeTab === 'tax'
              ? 'border-b-2 border-[#F36A4F] text-[#F36A4F]'
              : 'text-[#6E6E6E] hover:text-[#3D3D3D]'
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
                {mockReceipts.map((receipt) => (
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
                      <button className="flex items-center gap-[8px]" style={{ color: '#F36A4F' }}>
                        <Download size={16} />
                        <span style={{ fontSize: '14px' }}>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {mockReceipts.length === 0 && (
            <div className="p-[48px] text-center">
              <FileText size={48} color="#DBDBDB" className="mx-auto mb-[16px]" />
              <p style={{ fontSize: '16px', color: '#6E6E6E' }}>No receipts available yet</p>
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
                  {mock80GDocs.map((doc) => (
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
                  ))}
                </tbody>
              </table>
            </div>
          </AramCard>
        </div>
      )}

      {/* Tax Documents Tab */}
      {activeTab === 'tax' && (
        <AramCard>
          <div className="flex flex-col items-center gap-[16px] py-[48px] text-center">
            <FileText size={64} color="#DBDBDB" />
            <div>
              <h3>No Tax Documents Available</h3>
              <p style={{ fontSize: '14px', color: '#6E6E6E', marginTop: '8px' }}>
                Tax documents will appear here once generated
              </p>
            </div>
          </div>
        </AramCard>
      )}
    </div>
  );
}
