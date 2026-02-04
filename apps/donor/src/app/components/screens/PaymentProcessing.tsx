import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';
import { Loader2, CheckCircle, XCircle, Download } from 'lucide-react';
import { useApi } from '@/app/context/ApiContext';
import { generateReceiptPDF } from '@/app/utils/pdfGenerator';

interface DonationData {
  amount: number;
  type: string;
  receiptNo: string;
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
  const { processDonation, refreshNotifications, user, isAuthenticated } = useApi();

  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');

  const state = location.state as {
    status: 'processing' | 'success' | 'failed';
    donationData: DonationData
  } | undefined;

  const donationData = state?.donationData;
  const isInternalProcessing = React.useRef(false);

  useEffect(() => {
    if (!donationData) {
      navigate('/donate');
      return;
    }

    if (state?.status === 'processing' && !isInternalProcessing.current) {
      isInternalProcessing.current = true;
      setStatus('processing');

      // Simulate payment processing
      setTimeout(() => {
        // 90% success rate for demo
        const success = Math.random() > 0.1;

        if (success) {
          setStatus('success');
          if (isAuthenticated) {
            toast.success('Payment successful!');
          } else {
            toast.success('Temporary password sent via mail successfully');
          }

          // Trigger real persistence
          // Guest donations are already handled in the guest-donate API call usually, 
          // but here checking if we need to call processDonation.
          // If the user is logged in, we call processDonation.
          // For guests, usually the API call happens before this or handles it.
          // Assuming processDonation handles both or we only call it for logged in for now based on App.tsx logic.
          if (isAuthenticated) {
            processDonation({
              amount: donationData.amount,
              address: donationData.address,
              donationType: donationData.donationType || donationData.type,
              name: donationData.name,
              pan: donationData.panNumber,
              country: donationData.country,
            }).then((res: { success: boolean }) => {
              if (res.success) {
                refreshNotifications();
              }
            });
          }
        } else {
          setStatus('failed');
          toast.error('Payment failed. Please try again.');
        }
      }, 2000);
    } else if (state?.status) {
      setStatus(state.status);
    }
  }, [donationData, navigate, state, isAuthenticated, processDonation, refreshNotifications]);

  const handleDownloadReceipt = () => {
    if (donationData) {
      generateReceiptPDF(
        {
          receiptNo: donationData.receiptNo,
          date: new Date().toISOString().split('T')[0],
          eligible80G: true,
          type: donationData.donationType || donationData.type,
          amount: donationData.amount,
        },
        {
          name: donationData.name || user?.name || '',
          email: donationData.email || user?.email || '',
          phone: donationData.phone || user?.mobileNumber || '',
          pan: donationData.panNumber || user?.pan,
          address: donationData.address || user?.address,
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-[24px]">
      <AramCard className="w-full max-w-[520px]">
        <div className="flex flex-col items-center gap-[24px] text-center">
          {status === 'processing' && (
            <>
              <Loader2 className="animate-spin" size={64} color="#F36A4F" />
              <div>
                <h2>Processing Payment</h2>
                <p style={{ fontSize: '16px', lineHeight: '24px', color: '#3D3D3D', marginTop: '8px' }}>
                  Redirecting to payment gateway...
                </p>
                <p style={{ fontSize: '14px', lineHeight: '20px', color: '#6E6E6E', marginTop: '8px' }}>
                  Please do not close this window
                </p>
              </div>
            </>
          )}

          {status === 'success' && (
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

              {donationData && (
                <div className="w-full p-[24px] bg-[#F3F3F3] rounded-[16px]">
                  <div className="flex flex-col gap-[12px]">
                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: '14px', color: '#6E6E6E' }}>Amount</span>
                      <span style={{ fontSize: '18px', fontWeight: 700, color: '#F36A4F' }}>
                        ₹{donationData.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: '14px', color: '#6E6E6E' }}>Donation Type</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>
                        {donationData.donationType || donationData.type}
                      </span>
                    </div>
                    {donationData.receiptNo && (
                      <div className="flex justify-between items-center">
                        <span style={{ fontSize: '14px', color: '#6E6E6E' }}>Receipt No</span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#0D0D0D' }}>
                          {donationData.receiptNo}
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
                <AramButton onClick={() => navigate('/dashboard')} variant="primary" className="flex-1">
                  Go to Dashboard
                </AramButton>
              </div>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="w-[80px] h-[80px] rounded-full bg-[#FEF1EE] flex items-center justify-center">
                <XCircle size={48} color="#F36A4F" />
              </div>
              <div>
                <h2>Payment Failed</h2>
                <p style={{ fontSize: '16px', lineHeight: '24px', color: '#3D3D3D', marginTop: '8px' }}>
                  We couldn't process your payment
                </p>
                <p style={{ fontSize: '14px', lineHeight: '20px', color: '#6E6E6E', marginTop: '8px' }}>
                  Please check your payment details and try again
                </p>
              </div>

              <div className="flex flex-col gap-[12px] w-full">
                <AramButton onClick={() => navigate('/donate')} variant="primary" className="w-full">
                  Try Again
                </AramButton>
                <button style={{ fontSize: '14px', lineHeight: '20px', color: '#F36A4F' }}>
                  Contact Support
                </button>
              </div>
            </>
          )}
        </div>
      </AramCard>
    </div>
  );
}
