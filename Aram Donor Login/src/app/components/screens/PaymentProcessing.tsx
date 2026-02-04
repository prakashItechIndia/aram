import React from 'react';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';
import { Loader2, CheckCircle, XCircle, Download } from 'lucide-react';

interface PaymentProcessingProps {
  status: 'processing' | 'success' | 'failed';
  onDownloadReceipt?: () => void;
  onGoToDashboard?: () => void;
  onTryAgain?: () => void;
  donationData?: {
    amount: number;
    type: string;
    receiptNo?: string;
  };
}

export function PaymentProcessing({ 
  status, 
  onDownloadReceipt, 
  onGoToDashboard, 
  onTryAgain,
  donationData 
}: PaymentProcessingProps) {
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
                        {donationData.type}
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
                {onDownloadReceipt && (
                  <AramButton onClick={onDownloadReceipt} variant="secondary" className="flex-1">
                    <Download size={18} className="inline mr-2" />
                    Download Receipt
                  </AramButton>
                )}
                {onGoToDashboard && (
                  <AramButton onClick={onGoToDashboard} variant="primary" className="flex-1">
                    Go to Dashboard
                  </AramButton>
                )}
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
                {onTryAgain && (
                  <AramButton onClick={onTryAgain} variant="primary" className="w-full">
                    Try Again
                  </AramButton>
                )}
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
