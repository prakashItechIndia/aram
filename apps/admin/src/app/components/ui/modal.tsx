import { ReactNode, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}

export function Modal({ isOpen, onClose, title, children, footer, width = '560px' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div
        className="relative bg-white rounded-[16px] shadow-lg max-h-[90vh] flex flex-col"
        style={{ width: width, maxWidth: '90vw' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-[24px] border-b border-[#DBDBDB]">
          <h2 className="text-[22px] leading-[30px] font-bold text-[#0D0D0D]">{title}</h2>
          <button
            onClick={onClose}
            className="w-[40px] h-[40px] flex items-center justify-center rounded-full hover:bg-[#F3F3F3] transition-colors"
          >
            <X className="w-5 h-5 text-[#6E6E6E]" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-[24px] overflow-y-auto flex-1">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-[12px] p-[16px_24px] border-t border-[#DBDBDB] h-[72px]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title: string;
  message: string;
  requireReason?: boolean;
  confirmText?: string;
  confirmVariant?: 'primary' | 'danger';
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  requireReason = false,
  confirmText = 'Confirm',
  confirmVariant = 'primary',
  loading = false,
}: ConfirmModalProps) {
  const [reason, setReason] = useState('');
  
  const handleConfirm = () => {
    onConfirm(reason);
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={requireReason && !reason.trim()}
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-[16px] leading-[24px] text-[#3D3D3D] mb-4">{message}</p>
      
      {requireReason && (
        <div>
          <label className="block text-[13px] leading-[18px] font-medium text-[#6E6E6E] mb-[6px]">
            Reason <span className="text-[#F36A4F]">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full min-h-[100px] px-[14px] py-[12px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 resize-none"
            placeholder="Enter reason..."
          />
          <p className="mt-1 text-[13px] leading-[18px] text-[#6E6E6E]">
            Reason is stored in audit logs.
          </p>
        </div>
      )}
    </Modal>
  );
}