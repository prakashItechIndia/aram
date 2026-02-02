import { useState } from 'react';
import { AlertCircle, ArrowRight, X } from 'lucide-react';

export function Reconciliation() {
  const [autoFetchSettlements, setAutoFetchSettlements] = useState(true);
  const [autoMatchSettlements, setAutoMatchSettlements] = useState(true);
  const [matchStrategy, setMatchStrategy] = useState<'payment_id' | 'order_id' | 'both'>('both');
  const [mismatchTolerance, setMismatchTolerance] = useState('0');
  const [receiptMissingThreshold, setReceiptMissingThreshold] = useState('10');
  const [webhookMissingThreshold, setWebhookMissingThreshold] = useState('10');
  const [manualApprovalRequired, setManualApprovalRequired] = useState(true);
  
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [saveReason, setSaveReason] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    setShowReasonModal(true);
  };

  const confirmSave = () => {
    if (!saveReason.trim()) {
      return;
    }
    // Handle save logic here
    console.log('Saving reconciliation settings with reason:', saveReason);
    setShowReasonModal(false);
    setSaveReason('');
    setHasChanges(false);
  };

  const handleViewMismatches = () => {
    // Navigate to mismatches view
    console.log('Navigating to mismatches view');
  };

  const markChange = () => {
    setHasChanges(true);
  };

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold text-[#0D0D0D] mb-[4px]">
            Reconciliation Settings
          </h1>
          <p className="text-[14px] leading-[20px] text-[#6E6E6E]">
            Configure automated settlement reconciliation and matching rules
          </p>
        </div>
        <button
          onClick={handleViewMismatches}
          className="h-[44px] px-[20px] bg-white border border-[#F36A4F] text-[#F36A4F] rounded-[999px] flex items-center gap-2 hover:bg-[#FEF1EE] transition-colors"
        >
          <span className="text-[16px] leading-[24px] font-medium">View Mismatches</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white border border-[#DBDBDB] rounded-[16px] overflow-hidden">
        {/* Automation Settings Section */}
        <div className="px-[24px] py-[20px] border-b border-[#DBDBDB]">
          <h2 className="text-[18px] leading-[24px] font-semibold text-[#0D0D0D] mb-[4px]">
            Automation Settings
          </h2>
          <p className="text-[14px] leading-[20px] text-[#6E6E6E]">
            Configure automatic settlement fetching and matching
          </p>
        </div>

        <div className="p-[24px] space-y-[24px]">
          {/* Auto-fetch Settlements */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[4px]">
                Auto-fetch settlements daily
              </label>
              <p className="text-[14px] leading-[20px] text-[#6E6E6E]">
                Automatically fetch settlement data from payment gateway every day
              </p>
            </div>
            <button
              onClick={() => {
                setAutoFetchSettlements(!autoFetchSettlements);
                markChange();
              }}
              className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                autoFetchSettlements ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
              }`}
            >
              <div
                className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                  autoFetchSettlements ? 'translate-x-[22px]' : 'translate-x-[2px]'
                }`}
              />
            </button>
          </div>

          {/* Auto-match Settlements */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[4px]">
                Auto-match settlements
              </label>
              <p className="text-[14px] leading-[20px] text-[#6E6E6E]">
                Automatically match settlements with transactions using configured strategy
              </p>
            </div>
            <button
              onClick={() => {
                setAutoMatchSettlements(!autoMatchSettlements);
                markChange();
              }}
              className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                autoMatchSettlements ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
              }`}
            >
              <div
                className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                  autoMatchSettlements ? 'translate-x-[22px]' : 'translate-x-[2px]'
                }`}
              />
            </button>
          </div>

          {/* Match Strategy */}
          <div>
            <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
              Match strategy
            </label>
            <p className="text-[14px] leading-[20px] text-[#6E6E6E] mb-[12px]">
              Choose how settlements should be matched with transactions
            </p>
            <select
              value={matchStrategy}
              onChange={(e) => {
                setMatchStrategy(e.target.value as 'payment_id' | 'order_id' | 'both');
                markChange();
              }}
              className="w-full h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
            >
              <option value="payment_id">Payment ID</option>
              <option value="order_id">Order ID</option>
              <option value="both">Both (Payment ID & Order ID)</option>
            </select>
          </div>

          {/* Mismatch Tolerance */}
          <div>
            <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
              Allowed mismatch tolerance
            </label>
            <p className="text-[14px] leading-[20px] text-[#6E6E6E] mb-[12px]">
              Maximum amount difference allowed for auto-matching (default: ₹0)
            </p>
            <div className="relative">
              <span className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[16px] leading-[24px] text-[#6E6E6E]">
                ₹
              </span>
              <input
                type="number"
                value={mismatchTolerance}
                onChange={(e) => {
                  setMismatchTolerance(e.target.value);
                  markChange();
                }}
                min="0"
                step="1"
                className="w-full h-[44px] pl-[32px] pr-[16px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Alert Threshold Settings */}
      <div className="bg-white border border-[#DBDBDB] rounded-[16px] overflow-hidden">
        <div className="px-[24px] py-[20px] border-b border-[#DBDBDB]">
          <h2 className="text-[18px] leading-[24px] font-semibold text-[#0D0D0D] mb-[4px]">
            Alert Threshold Settings
          </h2>
          <p className="text-[14px] leading-[20px] text-[#6E6E6E]">
            Configure when to trigger alerts for missing data
          </p>
        </div>

        <div className="p-[24px] space-y-[24px]">
          {/* Receipt Missing Threshold */}
          <div>
            <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
              Success but receipt missing after
            </label>
            <p className="text-[14px] leading-[20px] text-[#6E6E6E] mb-[12px]">
              Alert if payment succeeded but receipt is not generated within specified time
            </p>
            <div className="flex items-center gap-[12px]">
              <input
                type="number"
                value={receiptMissingThreshold}
                onChange={(e) => {
                  setReceiptMissingThreshold(e.target.value);
                  markChange();
                }}
                min="1"
                step="1"
                className="w-[120px] h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
              />
              <span className="text-[16px] leading-[24px] text-[#3D3D3D]">minutes</span>
            </div>
          </div>

          {/* Webhook Missing Threshold */}
          <div>
            <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
              Webhook missing after
            </label>
            <p className="text-[14px] leading-[20px] text-[#6E6E6E] mb-[12px]">
              Alert if webhook notification is not received within specified time
            </p>
            <div className="flex items-center gap-[12px]">
              <input
                type="number"
                value={webhookMissingThreshold}
                onChange={(e) => {
                  setWebhookMissingThreshold(e.target.value);
                  markChange();
                }}
                min="1"
                step="1"
                className="w-[120px] h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
              />
              <span className="text-[16px] leading-[24px] text-[#3D3D3D]">minutes</span>
            </div>
          </div>

          {/* Info Alert */}
          <div className="flex items-start gap-[12px] p-[16px] bg-[#FEF1EE] border border-[#F36A4F] rounded-[8px]">
            <AlertCircle className="w-5 h-5 text-[#F36A4F] flex-shrink-0 mt-[2px]" />
            <div>
              <p className="text-[14px] leading-[20px] text-[#734F48]">
                Alerts will be sent to designated users via email and shown in the dashboard when thresholds are exceeded.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Settings */}
      <div className="bg-white border border-[#DBDBDB] rounded-[16px] overflow-hidden">
        <div className="px-[24px] py-[20px] border-b border-[#DBDBDB]">
          <h2 className="text-[18px] leading-[24px] font-semibold text-[#0D0D0D] mb-[4px]">
            Approval Settings
          </h2>
          <p className="text-[14px] leading-[20px] text-[#6E6E6E]">
            Configure approval requirements for reconciliation actions
          </p>
        </div>

        <div className="p-[24px]">
          {/* Manual Adjustment Approval */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[4px]">
                Manual adjustment requires approval
              </label>
              <p className="text-[14px] leading-[20px] text-[#6E6E6E]">
                All manual reconciliation adjustments must be approved by authorized users
              </p>
            </div>
            <button
              onClick={() => {
                setManualApprovalRequired(!manualApprovalRequired);
                markChange();
              }}
              className={`relative w-[52px] h-[32px] rounded-[999px] transition-colors ${
                manualApprovalRequired ? 'bg-[#F36A4F]' : 'bg-[#DBDBDB]'
              }`}
            >
              <div
                className={`absolute top-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-sm transition-transform ${
                  manualApprovalRequired ? 'translate-x-[22px]' : 'translate-x-[2px]'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex items-center justify-end gap-[12px] bg-white border border-[#DBDBDB] rounded-[16px] px-[24px] py-[16px]">
          <button
            onClick={() => {
              // Reset all changes
              setHasChanges(false);
            }}
            className="h-[44px] px-[20px] border border-[#DBDBDB] rounded-[999px] text-[16px] leading-[24px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors"
          >
            Discard Changes
          </button>
          <button
            onClick={handleSave}
            className="h-[44px] px-[20px] bg-[#F36A4F] text-white rounded-[999px] text-[16px] leading-[24px] font-medium hover:bg-[#E55A3F] transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[16px] w-full max-w-[500px] mx-[24px]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#DBDBDB]">
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#0D0D0D]">
                Confirm Changes
              </h3>
              <button
                onClick={() => {
                  setShowReasonModal(false);
                  setSaveReason('');
                }}
                className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-[#F3F3F3] transition-colors"
              >
                <X className="w-5 h-5 text-[#6E6E6E]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-[24px] py-[24px]">
              <p className="text-[14px] leading-[20px] text-[#3D3D3D] mb-[16px]">
                Please provide a reason for updating reconciliation settings. This will be logged in the audit trail.
              </p>
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">
                  Reason for change <span className="text-[#F36A4F]">*</span>
                </label>
                <textarea
                  value={saveReason}
                  onChange={(e) => setSaveReason(e.target.value)}
                  placeholder="Enter reason for updating settings..."
                  rows={4}
                  className="w-full px-[16px] py-[12px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 resize-none"
                />
              </div>

              {/* Alert */}
              <div className="flex items-start gap-[12px] p-[12px] bg-[#FEF1EE] border border-[#F36A4F] rounded-[8px] mt-[16px]">
                <AlertCircle className="w-4 h-4 text-[#F36A4F] flex-shrink-0 mt-[2px]" />
                <p className="text-[12px] leading-[16px] text-[#734F48]">
                  Changes to reconciliation settings may affect automated matching and alert notifications.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-[12px] px-[24px] py-[20px] border-t border-[#DBDBDB]">
              <button
                onClick={() => {
                  setShowReasonModal(false);
                  setSaveReason('');
                }}
                className="h-[44px] px-[20px] border border-[#DBDBDB] rounded-[999px] text-[16px] leading-[24px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                disabled={!saveReason.trim()}
                className="h-[44px] px-[20px] bg-[#F36A4F] text-white rounded-[999px] text-[16px] leading-[24px] font-medium hover:bg-[#E55A3F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
