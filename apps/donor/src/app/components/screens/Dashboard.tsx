import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';
import { Heart, Download, Calendar } from 'lucide-react';
import { useApi } from '@/app/context/ApiContext';
import { generateReceiptPDF } from '@/app/utils/pdfGenerator';
import { useDonationFormStatus } from '@/app/hooks/useDonationFormStatus';

interface Donation {
  id: number;
  receiptNo: string;
  amount: number;
  date: string;
  type: string;
  status: string;
  eligible80G: boolean;
}

const mockEvents = [
  { id: 1, title: 'Annual Medical Camp 2025', date: '2025-02-15', description: 'Support our community health initiative' },
  { id: 2, title: 'Education Scholarship Drive', date: '2025-03-01', description: 'Help students achieve their dreams' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { user: apiAuth } = useApi();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = {
    name: apiAuth?.name || 'Donor',
  };

  useEffect(() => {
    const fetchDonations = async () => {
      if (!apiAuth?.accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const baseUrl = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:3000/api';
        const response = await fetch(`${baseUrl}/donors/me/donations`, {
          headers: {
            'Authorization': `Bearer ${apiAuth.accessToken}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch donations');
        const data = await response.json();
        const sortedData = (data || []).sort((a: Donation, b: Donation) => b.id - a.id);
        setDonations(sortedData);
      } catch (err) {
        console.error('Failed to fetch donations:', err);
        setDonations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, [apiAuth?.accessToken]);

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
  const donationCount = donations.length;
  const lastDonationDate = donations.length > 0 ? donations[0].date : 'N/A';
  const eligible80G = donations.filter(d => d.eligible80G).reduce((sum, d) => sum + d.amount, 0);

  const handleDownloadReceipt = (donation: Donation) => {
    if (!checkAndNotify()) return;
    
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
        phone: apiAuth?.mobileNumber || apiAuth?.phone || '',
        pan: apiAuth?.pan,
        address: apiAuth?.address || apiAuth?.location,
      }
    );
  };

  const handleDonateClick = () => {
    if (!checkAndNotify()) return;
    onDonateNow();
  };

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Welcome Hero */}
      <AramCard>
        <div className="flex flex-col md:flex-row items-center justify-between gap-[24px]">
          <div>
            <h2 className="text-[22px] font-bold text-[#0D0D0D]">Welcome back, {user.name}!</h2>
            <p style={{ fontSize: '16px', lineHeight: '24px', color: '#3D3D3D', marginTop: '8px' }}>
              Your contributions are making a real difference in our community
            </p>
          </div>
          <AramButton onClick={() => navigate('/donate')} variant="primary" className="whitespace-nowrap">
            <Heart size={18} className="inline mr-2" />
            Donate Now
          </AramButton>
        </div>
      </AramCard>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
        <AramCard>
          <div className="flex flex-col gap-[8px]">
            <span style={{ fontSize: '13px', lineHeight: '18px', color: '#6E6E6E', fontWeight: 500 }}>
              Total Donated
            </span>
            <span style={{ fontSize: '28px', lineHeight: '36px', fontWeight: 700, color: '#F36A4F' }}>
              ₹{totalDonated.toLocaleString()}
            </span>
          </div>
        </AramCard>

        <AramCard>
          <div className="flex flex-col gap-[8px]">
            <span style={{ fontSize: '13px', lineHeight: '18px', color: '#6E6E6E', fontWeight: 500 }}>
              Donations Count
            </span>
            <span style={{ fontSize: '28px', lineHeight: '36px', fontWeight: 700, color: '#0D0D0D' }}>
              {donationCount}
            </span>
          </div>
        </AramCard>

        <AramCard>
          <div className="flex flex-col gap-[8px]">
            <span style={{ fontSize: '13px', lineHeight: '18px', color: '#6E6E6E', fontWeight: 500 }}>
              Last Donation Date
            </span>
            <span style={{ fontSize: '18px', lineHeight: '26px', fontWeight: 600, color: '#0D0D0D' }}>
              {lastDonationDate}
            </span>
          </div>
        </AramCard>

        <AramCard>
          <div className="flex flex-col gap-[8px]">
            <span style={{ fontSize: '13px', lineHeight: '18px', color: '#6E6E6E', fontWeight: 500 }}>
              80G Eligible (FY 2024-25)
            </span>
            <span style={{ fontSize: '28px', lineHeight: '36px', fontWeight: 700, color: '#734F48' }}>
              ₹{eligible80G.toLocaleString()}
            </span>
          </div>
        </AramCard>
      </div>

      {/* My Donations Table */}
      <AramCard noPadding>
        <div className="p-[24px] border-b border-[#DBDBDB]">
          <h3 className="text-[18px] font-semibold text-[#0D0D0D]">My Donations</h3>
        </div>

        {isLoading ? (
          <div className="p-[48px] text-center text-[#6E6E6E]">Loading donations...</div>
        ) : donations.length === 0 ? (
          <div className="p-[48px] text-center text-[#6E6E6E]">No donations found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ height: '48px', backgroundColor: '#F3F3F3' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Receipt No</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Donation Type</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Amount</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>Download</th>
                </tr>
              </thead>
              <tbody>
                {donations.slice(0, 5).map((donation) => (
                  <tr key={donation.id} style={{ height: '52px', borderBottom: '1px solid #DBDBDB' }}>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D3D3D' }}>{donation.date}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D3D3D' }}>{donation.receiptNo}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D3D3D' }}>{donation.type}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3D3D3D', fontWeight: 600 }}>₹{donation.amount.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        backgroundColor: '#FEF1EE',
                        color: '#F36A4F',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '13px',
                        fontWeight: 500
                      }}>
                        Success
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => handleDownloadReceipt(donation)}
                        className="flex items-center gap-[8px]" style={{ color: '#F36A4F' }}
                      >
                        <Download size={16} />
                        <span style={{ fontSize: '14px' }}>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AramCard>

      {/* Upcoming Events */}
      <AramCard>
        <div className="flex flex-col gap-[16px]">
          <h3 className="text-[18px] font-semibold text-[#0D0D0D]">Upcoming Special Events / Donation Requests</h3>
          <div className="flex flex-col gap-[16px]">
            {mockEvents.map((event) => (
              <div key={event.id} className="flex items-start justify-between gap-[16px] p-[16px] bg-[#FEF7F6] rounded-[16px] border border-[#FCD9D3]">
                <div className="flex-1">
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#0D0D0D' }}>{event.title}</h4>
                  <div className="flex items-center gap-[8px] mt-[4px]">
                    <Calendar size={14} color="#6E6E6E" />
                    <span style={{ fontSize: '14px', color: '#6E6E6E' }}>{event.date}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#3D3D3D', marginTop: '8px' }}>{event.description}</p>
                </div>
                <AramButton onClick={() => navigate('/donate')} variant="primary">
                  Donate
                </AramButton>
              </div>
            ))}
          </div>
        </div>
      </AramCard>

      {/* Impact Section */}
      {/* <AramCard>
        <div className="flex flex-col gap-[16px]">
          <h3 className="text-[18px] font-semibold text-[#0D0D0D]">Impact / Funds Utilized</h3>
          <p style={{ fontSize: '16px', color: '#3D3D3D' }}>
            Your contributions have helped us serve the community across multiple programs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mt-[8px]">
            <div className="p-[16px] bg-[#F3F3F3] rounded-[16px]">
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#F36A4F' }}>45%</div>
              <div style={{ fontSize: '14px', color: '#6E6E6E', marginTop: '4px' }}>Education Programs</div>
            </div>
            <div className="p-[16px] bg-[#F3F3F3] rounded-[16px]">
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#F36A4F' }}>30%</div>
              <div style={{ fontSize: '14px', color: '#6E6E6E', marginTop: '4px' }}>Medical Assistance</div>
            </div>
            <div className="p-[16px] bg-[#F3F3F3] rounded-[16px]">
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#F36A4F' }}>25%</div>
              <div style={{ fontSize: '14px', color: '#6E6E6E', marginTop: '4px' }}>Community Building</div>
            </div>
          </div>
        </div>
      </AramCard> */}
    </div>
  );
}
