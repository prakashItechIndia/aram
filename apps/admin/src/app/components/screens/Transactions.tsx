import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/app/context/ApiContext';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { Table, Column } from '../ui/table';
import { Badge, BadgeVariant } from '../ui/badge';
import { Modal, ConfirmModal } from '../ui/modal';
import { Drawer } from '../ui/drawer';
import { Search, Download, Eye, RefreshCw, User, Filter } from 'lucide-react';
import { toast } from '../ui/toast';

interface Transaction {
  paymentId: string;
  orderId: string;
  receiptNo: string;
  donorName: string;
  amount: number;
  gatewayFee: number;
  netAmount: number;
  status: BadgeVariant;
  dateTime: string;
}

function formatDateTime(d: string | Date | null | undefined): string {
  if (!d) return '-';
  const date = typeof d === 'string' ? new Date(d) : d;
  return isNaN(date.getTime()) ? '-' : date.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function Transactions() {
  const { api } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('last-7-days');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
  const [loading, setLoading] = useState(false);

  const { data: transactionsRaw, isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await api.transactionsApi.transactionsControllerFindAll();
      return (res as { data?: unknown })?.data;
    },
  });

  const transactions: Transaction[] = useMemo(() => {
    const list = Array.isArray(transactionsRaw) ? transactionsRaw : [];
    return list.map((row: Record<string, unknown>) => ({
      paymentId: String(row.paymentId ?? '-'),
      orderId: String(row.orderId ?? '-'),
      receiptNo: String(row.receiptId ?? '-'),
      donorName: String(row.donorId ?? 'Donor'),
      amount: Number(row.amount ?? 0),
      gatewayFee: Number(row.gatewayFee ?? 0),
      netAmount: Number(row.netAmount ?? row.amount ?? 0),
      status: (row.status === 'failed' ? 'failed' : row.status === 'refunded' ? 'refunded' : row.status === 'processing' ? 'warning' : 'success') as BadgeVariant,
      dateTime: formatDateTime(row.createdAt as string | Date),
    }));
  }, [transactionsRaw]);

  const transactionsFallback: Transaction[] = [
    {
      paymentId: 'PAY_001234',
      orderId: 'ORD_567890',
      receiptNo: 'ARAM/2025-26/00123',
      donorName: 'Rajesh Kumar',
      amount: 15000,
      gatewayFee: 300,
      netAmount: 14700,
      status: 'success',
      dateTime: '20 Jan 2026, 10:30 AM',
    },
    {
      paymentId: 'PAY_001235',
      orderId: 'ORD_567891',
      receiptNo: 'ARAM/2025-26/00124',
      donorName: 'Priya Sharma',
      amount: 5000,
      gatewayFee: 100,
      netAmount: 4900,
      status: 'success',
      dateTime: '20 Jan 2026, 09:15 AM',
    },
    {
      paymentId: 'PAY_001236',
      orderId: 'ORD_567892',
      receiptNo: '-',
      donorName: 'Amit Patel',
      amount: 2500,
      gatewayFee: 50,
      netAmount: 2450,
      status: 'failed',
      dateTime: '19 Jan 2026, 11:45 PM',
    },
    {
      paymentId: 'PAY_001237',
      orderId: 'ORD_567893',
      receiptNo: 'ARAM/2025-26/00125',
      donorName: 'Sunita Devi',
      amount: 25000,
      gatewayFee: 500,
      netAmount: 24500,
      status: 'refunded',
      dateTime: '19 Jan 2026, 03:20 PM',
    },
    {
      paymentId: 'PAY_001238',
      orderId: 'ORD_567894',
      receiptNo: '-',
      donorName: 'Vikram Singh',
      amount: 7500,
      gatewayFee: 150,
      netAmount: 7350,
      status: 'processing',
      dateTime: '19 Jan 2026, 02:10 PM',
    },
  ];

  const displayTransactions = (transactions.length > 0 ? transactions : transactionsFallback).filter((t) => {
    const matchSearch = !searchQuery || [t.paymentId, t.orderId, t.donorName, t.receiptNo].some((v) => v.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleRefund = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setRefundAmount(transaction.amount.toString());
    setRefundType('full');
    setShowRefundModal(true);
  };
  
  const processRefund = async (reason: string) => {
    if (!selectedTransaction) return;
    
    setLoading(true);
    
    // Check if requires approval
    const amount = refundType === 'full' ? selectedTransaction.amount : parseFloat(refundAmount);
    
    setTimeout(() => {
      setLoading(false);
      setShowRefundModal(false);
      
      if (amount > 10000) {
        toast.success('Refund request submitted for Super Admin approval');
      } else {
        toast.success('Refund processed successfully');
      }
    }, 1500);
  };
  
  const columns: Column<Transaction>[] = [
    { key: 'paymentId', header: 'Payment ID', width: '120px' },
    { key: 'orderId', header: 'Order ID', width: '120px' },
    {
      key: 'receiptNo',
      header: 'Receipt No',
      render: (item) => (
        <span className={item.receiptNo === '-' ? 'text-[#9E9E9E]' : ''}>
          {item.receiptNo}
        </span>
      ),
    },
    { key: 'donorName', header: 'Donor Name' },
    {
      key: 'amount',
      header: 'Amount',
      render: (item) => `₹${item.amount.toLocaleString()}`,
    },
    {
      key: 'gatewayFee',
      header: 'Gateway Fee',
      render: (item) => `₹${item.gatewayFee}`,
    },
    {
      key: 'netAmount',
      header: 'Net Amount',
      render: (item) => `₹${item.netAmount.toLocaleString()}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <Badge variant={item.status}>{item.status}</Badge>,
    },
    { key: 'dateTime', header: 'Date/Time' },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTransaction(item);
            }}
            className="w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-[#F3F3F3]"
            title="View Details"
          >
            <Eye className="w-4 h-4 text-[#6E6E6E]" />
          </button>
          {item.status === 'success' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRefund(item);
              }}
              className="w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-[#F3F3F3]"
              title="Refund"
            >
              <RefreshCw className="w-4 h-4 text-[#6E6E6E]" />
            </button>
          )}
          {item.receiptNo !== '-' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.success('Receipt downloaded');
              }}
              className="w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-[#F3F3F3]"
              title="Download Receipt"
            >
              <Download className="w-4 h-4 text-[#6E6E6E]" />
            </button>
          )}
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="space-y-[24px]">
        <p className="text-red-600">Failed to load transactions. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-[24px]">
      {/* Page Header */}
      <div>
        <h1 className="text-[28px] leading-[36px] font-bold text-[#0D0D0D]">Transactions</h1>
        <p className="text-[16px] leading-[24px] text-[#6E6E6E] mt-1">
          View and manage all payment transactions
        </p>
      </div>
      
      {/* Filter Bar */}
      <Card className="!p-[16px]">
        <div className="flex flex-wrap items-end gap-[12px]">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E6E6E]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Payment ID, Receipt, Donor..."
                className="w-full h-[44px] pl-[44px] pr-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
              />
            </div>
          </div>
          
          <div className="w-[220px]">
            <Select
              options={[
                { value: 'last-7-days', label: 'Last 7 Days' },
                { value: 'last-30-days', label: 'Last 30 Days' },
                { value: 'this-month', label: 'This Month' },
                { value: 'last-month', label: 'Last Month' },
                { value: 'custom', label: 'Custom Range' },
              ]}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            />
          </div>
          
          <div className="w-[220px]">
            <Select
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'success', label: 'Success' },
                { value: 'failed', label: 'Failed' },
                { value: 'processing', label: 'Processing' },
                { value: 'refunded', label: 'Refunded' },
                { value: 'disputed', label: 'Disputed' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
          
          <Button variant="outline">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
          
          <Button variant="outline">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </Card>
      
      {/* Transactions Table */}
      {isLoading ? (
        <Card className="!p-[24px]">
          <p className="text-[#6E6E6E]">Loading transactions...</p>
        </Card>
      ) : (
      <Table
        columns={columns}
        data={displayTransactions}
        loading={false}
        emptyMessage="No transactions found"
      />
      )}
      
      {/* Transaction Details Drawer */}
      <Drawer
        isOpen={!!selectedTransaction && !showRefundModal}
        onClose={() => setSelectedTransaction(null)}
        title="Transaction Details"
      >
        {selectedTransaction && (
          <div className="space-y-[24px]">
            <div>
              <h4 className="text-[14px] leading-[20px] font-semibold text-[#0D0D0D] mb-3">
                Payment Information
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-[#DBDBDB]">
                  <span className="text-[14px] text-[#6E6E6E]">Payment ID</span>
                  <span className="text-[14px] font-medium text-[#0D0D0D]">{selectedTransaction.paymentId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#DBDBDB]">
                  <span className="text-[14px] text-[#6E6E6E]">Order ID</span>
                  <span className="text-[14px] font-medium text-[#0D0D0D]">{selectedTransaction.orderId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#DBDBDB]">
                  <span className="text-[14px] text-[#6E6E6E]">Receipt No</span>
                  <span className="text-[14px] font-medium text-[#0D0D0D]">{selectedTransaction.receiptNo}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#DBDBDB]">
                  <span className="text-[14px] text-[#6E6E6E]">Status</span>
                  <Badge variant={selectedTransaction.status}>{selectedTransaction.status}</Badge>
                </div>
                <div className="flex justify-between py-2 border-b border-[#DBDBDB]">
                  <span className="text-[14px] text-[#6E6E6E]">Date/Time</span>
                  <span className="text-[14px] font-medium text-[#0D0D0D]">{selectedTransaction.dateTime}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-[14px] leading-[20px] font-semibold text-[#0D0D0D] mb-3">
                Amount Breakdown
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-[#DBDBDB]">
                  <span className="text-[14px] text-[#6E6E6E]">Amount</span>
                  <span className="text-[14px] font-medium text-[#0D0D0D]">₹{selectedTransaction.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#DBDBDB]">
                  <span className="text-[14px] text-[#6E6E6E]">Gateway Fee</span>
                  <span className="text-[14px] font-medium text-[#F36A4F]">- ₹{selectedTransaction.gatewayFee}</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-[#0D0D0D]">
                  <span className="text-[16px] font-semibold text-[#0D0D0D]">Net Amount</span>
                  <span className="text-[16px] font-bold text-[#0D0D0D]">₹{selectedTransaction.netAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-[12px] pt-4">
              {selectedTransaction.status === 'success' && (
                <Button fullWidth onClick={() => handleRefund(selectedTransaction)}>
                  Process Refund
                </Button>
              )}
              {selectedTransaction.receiptNo !== '-' && (
                <Button variant="outline" fullWidth>
                  <Download className="w-4 h-4" />
                  Download Receipt
                </Button>
              )}
            </div>
          </div>
        )}
      </Drawer>
      
      {/* Refund Modal */}
      {showRefundModal && selectedTransaction && (
        <Modal
          isOpen={showRefundModal}
          onClose={() => setShowRefundModal(false)}
          title="Process Refund"
          footer={
            <>
              <Button variant="outline" onClick={() => setShowRefundModal(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  // Convert to ConfirmModal
                  const modal = document.createElement('div');
                  document.body.appendChild(modal);
                }}
              >
                Process Refund
              </Button>
            </>
          }
        >
          <div className="space-y-[20px]">
            <div>
              <p className="text-[16px] leading-[24px] text-[#3D3D3D] mb-4">
                Transaction: <strong>{selectedTransaction.paymentId}</strong>
                <br />
                Donor: <strong>{selectedTransaction.donorName}</strong>
                <br />
                Original Amount: <strong>₹{selectedTransaction.amount.toLocaleString()}</strong>
              </p>
            </div>
            
            <div>
              <label className="block text-[13px] leading-[18px] font-medium text-[#6E6E6E] mb-[6px]">
                Refund Type <span className="text-[#F36A4F]">*</span>
              </label>
              <div className="flex gap-[12px]">
                <button
                  onClick={() => {
                    setRefundType('full');
                    setRefundAmount(selectedTransaction.amount.toString());
                  }}
                  className={`flex-1 h-[44px] px-[18px] rounded-[999px] border transition-colors ${
                    refundType === 'full'
                      ? 'bg-[#FEF1EE] border-[#F36A4F] text-[#F36A4F]'
                      : 'bg-white border-[#DBDBDB] text-[#3D3D3D]'
                  }`}
                >
                  Full Refund
                </button>
                <button
                  onClick={() => setRefundType('partial')}
                  className={`flex-1 h-[44px] px-[18px] rounded-[999px] border transition-colors ${
                    refundType === 'partial'
                      ? 'bg-[#FEF1EE] border-[#F36A4F] text-[#F36A4F]'
                      : 'bg-white border-[#DBDBDB] text-[#3D3D3D]'
                  }`}
                >
                  Partial Refund
                </button>
              </div>
            </div>
            
            {refundType === 'partial' && (
              <Input
                label="Refund Amount"
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                required
                helperText={`Maximum: ₹${selectedTransaction.amount.toLocaleString()}`}
              />
            )}
            
            <div className="p-[16px] bg-[#FEF7F6] border border-[#FCD9D3] rounded-[16px]">
              <p className="text-[14px] leading-[20px] text-[#3D3D3D]">
                {parseFloat(refundAmount) > 10000 ? (
                  <>
                    <strong>⚠️ Approval Required:</strong> Refunds over ₹10,000 require Super Admin approval.
                    This will be sent to the Pending Approvals queue.
                  </>
                ) : (
                  <>
                    This refund will be processed immediately. A reason is required for audit logs.
                  </>
                )}
              </p>
            </div>
            
            <div>
              <label className="block text-[13px] leading-[18px] font-medium text-[#6E6E6E] mb-[6px]">
                Reason <span className="text-[#F36A4F]">*</span>
              </label>
              <textarea
                className="w-full min-h-[100px] px-[14px] py-[12px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 resize-none"
                placeholder="Enter reason for refund..."
              />
              <p className="mt-1 text-[13px] leading-[18px] text-[#6E6E6E]">
                Reason is stored in audit logs.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
