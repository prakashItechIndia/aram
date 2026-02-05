import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';
import { CheckCircle, Download } from 'lucide-react';
import { useApi } from '@/app/context/ApiContext';
import { generateReceiptPDF } from '@/app/utils/pdfGenerator';
interface DonationData {
  amount: number;
  type?: string;
  receiptNo?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  panNumber?: string;
  country?: string;
  donationType?: string;
}

export function PaymentProcessing() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useApi();

  const state = location.state as {
    status: 'processing' | 'success' | 'failed';
    donationData: DonationData
  } | undefined;

  const donationData = state?.donationData;
  const displayData = donationData;

  useEffect(() => {
    if (!displayData) {
      navigate('/donate');
      return;
    }
  }, [displayData, navigate]);

  const handleDownloadReceipt = () => {
    if (displayData) {
      generateReceiptPDF(
        {
          receiptNo: displayData.receiptNo || '',
          date: new Date().toISOString().split('T')[0],
          eligible80G: true,
          type: displayData.type || displayData.donationType || 'General Fund', // Use display name if available
          amount: displayData.amount,
        },
        {
          name: displayData.name || user?.name || '',
          email: displayData.email || user?.email || '',
          phone: displayData.phone || user?.phone || '',
          pan: displayData.panNumber || user?.pan,
          address: displayData.address || user?.address,
        }
      );
    }
  };

  if (!displayData) return null;

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-[24px]">
      <AramCard className="w-full max-w-[520px]">
        <div className="flex flex-col items-center gap-[24px] text-center">
          <>
            <div className="w-[80px] h-[80px] rounded-full bg-[#FEF1EE] flex items-center justify-center">
              <CheckCircle size={48} color="#F36A4F" />
            </div>
            <div>
              <h2>Payment Successful!</h2>
              <p style={{ fontSize: '16px', lineHeight: '24px', color: '#3D3D3D', marginTop: '8px' }}>
                Thank you for your generous donation
              </p>
            </div>

            {displayData && (
              <div className="w-full p-[24px] bg-[#F3F3F3] rounded-[16px]">
                <div className="flex flex-col gap-[12px]">
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: '14px', color: '#6E6E6E' }}>Amount</span>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#F36A4F' }}>
                      ₹{displayData.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: '14px', color: '#6E6E6E' }}>Donation Type</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>
                      {displayData.type || displayData.donationType}
                    </span>
                  </div>
                  {displayData.receiptNo && (
                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: '14px', color: '#6E6E6E' }}>Receipt No</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>
                        {displayData.receiptNo}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-[12px] w-full">
              <AramButton onClick={handleDownloadReceipt} variant="secondary" className="flex-1">
                <Download size={18} className="inline mr-2" />
                Download Receipt
              </AramButton>
              <AramButton onClick={() => navigate('/')} variant="primary" className="flex-1">
                Go to Home
              </AramButton>
            </div>
          </>
        </div>
      </AramCard>
    </div>
  );
}
