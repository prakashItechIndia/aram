import React from 'react';
import { AramButton } from '@/app/components/aram/AramButton';
import { AramCard } from '@/app/components/aram/AramCard';

interface EntryPageProps {
  onLoginToDonate: () => void;
  onGuestDonate: () => void;
}

export function EntryPage({ onLoginToDonate, onGuestDonate }: EntryPageProps) {
  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-[24px]">
      <AramCard className="w-full max-w-[520px]">
        <div className="flex flex-col gap-[24px]">
          {/* Title */}
          <div className="flex flex-col gap-[8px] text-center">
            <h1 style={{ fontSize: '28px', lineHeight: '36px', fontWeight: 700, color: '#0D0D0D' }}>
              Support Aram Foundation
            </h1>
            <p style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 400, color: '#3D3D3D' }}>
              Donate securely with or without creating an account.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-[16px]">
            <AramButton onClick={onLoginToDonate} variant="primary" className="w-full">
              Login to Donate
            </AramButton>
            <AramButton onClick={onGuestDonate} variant="secondary" className="w-full">
              Donate without Signup
            </AramButton>
          </div>

          {/* Info Text */}
          <div className="text-center pt-[16px] border-t border-[#DBDBDB]">
            <p style={{ fontSize: '13px', lineHeight: '18px', fontWeight: 400, color: '#6E6E6E' }}>
              Receipts and 80G documents are available in Reports.
            </p>
          </div>
        </div>
      </AramCard>
    </div>
  );
}
