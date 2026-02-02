import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

export function Drawer({ isOpen, onClose, title, children, width = '420px' }: DrawerProps) {
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
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="ml-auto relative bg-white shadow-lg h-full flex flex-col" style={{ width: width }}>
        {/* Header */}
        <div className="flex items-center justify-between h-[56px] px-[24px] border-b border-[#DBDBDB]">
          <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D]">{title}</h3>
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
      </div>
    </div>
  );
}
