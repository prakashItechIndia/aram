import React from 'react';
import { X } from 'lucide-react';

interface AramModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export function AramModal({ isOpen, onClose, title, children, footer }: AramModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[500px] overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#F3F3F3]">
                    <h3 className="text-[20px] font-bold text-[#0D0D0D]">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[#F3F3F3] rounded-full transition-colors text-[#6E6E6E]"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="text-[#3D3D3D] leading-relaxed">
                        {children}
                    </div>
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-6 border-t border-[#F3F3F3] flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
