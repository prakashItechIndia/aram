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
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({
    totalDonated: 0,
    donationCount: 0,
    lastDonationDate: null as string | null,
    eligible80GCurrentFY: 0,
  });

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
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        const queryString = params.toString();
        const response = await fetch(`${baseUrl}/donors/me/donations${queryString ? `?${queryString}` : ''}`, {
          headers: {
            'Authorization': `Bearer ${apiAuth.accessToken}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch donations');
        const data = await response.json();
        const items = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        const totalCount = typeof data?.total === 'number' ? data.total : items.length;
        
        // Extract overall statistics from API response
        if (data?.stats) {
          setStats({
            totalDonated: data.stats.totalDonated || 0,
            donationCount: data.stats.donationCount || 0,
            lastDonationDate: data.stats.lastDonationDate || null,
            eligible80GCurrentFY: data.stats.eligible80GCurrentFY || 0,
          });
        }
        
        setDonations(items);
        setTotal(totalCount);
      } catch (err) {
        console.error('Failed to fetch donations:', err);
        setDonations([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, [apiAuth?.accessToken, page, limit]);

  // Calculate Financial Year
  const getFYDates = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-11

    // If month is Jan(0), Feb(1), Mar(2), then FY started in previous year
    const startYear = currentMonth < 3 ? currentYear - 1 : currentYear;
    const endYear = startYear + 1;

    const startDate = new Date(`${startYear}-04-01`);
    const endDate = new Date(`${endYear}-03-31`);

    return { startDate, endDate, label: `${startYear}-${endYear.toString().slice(-2)}` };
  };

  const { label: fyLabel } = getFYDates();

  // Use statistics from API response instead of calculating from paginated data
  const totalDonated = stats.totalDonated;
  const donationCount = stats.donationCount;
  const lastDonationDate = stats.lastDonationDate || 'N/A';
  const eligible80G = stats.eligible80GCurrentFY;

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
        phone: apiAuth?.mobileNumber || apiAuth?.phone || '',
        pan: apiAuth?.pan,
        address: apiAuth?.address || apiAuth?.location,
      }
    );
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
              {lastDonationDate !== 'N/A' ? lastDonationDate : 'No donations yet'}
            </span>
          </div>
        </AramCard>

        <AramCard>
          <div className="flex flex-col gap-[8px]">
            <span style={{ fontSize: '13px', lineHeight: '18px', color: '#6E6E6E', fontWeight: 500 }}>
              80G Eligible (FY {fyLabel})
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
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10 shadow-sm">
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
                  {donations.map((donation: Donation) => (
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
                          {donation.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          className="flex items-center gap-[8px]"
                          style={{ color: '#F36A4F' }}
                          onClick={() => handleDownloadReceipt(donation)}
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

            {/* Pagination */}
            {total > limit && (
              <div className="px-[24px] py-[16px] border-t border-[#DBDBDB] flex items-center justify-between flex-wrap gap-4">
                <div className="text-[14px] text-[#6E6E6E]">
                  Showing {startItem}–{endItem} of {total} donations
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
          </>
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
    </div >
  );
}
