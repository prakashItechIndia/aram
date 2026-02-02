import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/app/context/ApiContext';
import { Card, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import {
  TrendingUp,
  Users,
  IndianRupee,
  FileText,
  AlertTriangle,
  FileCheck,
  Mail,
  UserX,
  Receipt,
  MessageSquare,
  Plus,
  Printer,
  RefreshCw,
  BarChart3,
} from 'lucide-react';

interface DashboardProps {
  onNavigate?: (path: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps = {}) {
  const { api } = useApi();
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null);

  const { data: donorsRaw } = useQuery({
    queryKey: ['donors'],
    queryFn: async () => {
      const res = await api.donorsApi.donorsControllerFindAll();
      return (res as { data?: unknown[] })?.data ?? [];
    },
  });
  const { data: transactionsRaw } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await api.transactionsApi.transactionsControllerFindAll();
      return (res as { data?: unknown[] })?.data ?? [];
    },
  });

  const donorCount = Array.isArray(donorsRaw) ? donorsRaw.length : 0;
  const transactions = Array.isArray(transactionsRaw) ? transactionsRaw : [];
  const totalToday = useMemo(() => {
    const today = new Date().toDateString();
    return transactions
      .filter((t: Record<string, unknown>) => new Date(String(t.createdAt ?? '')).toDateString() === today)
      .reduce((sum: number, t: Record<string, unknown>) => sum + Number(t.amount ?? 0), 0);
  }, [transactions]);
  const totalMonth = useMemo(
    () => transactions.reduce((sum: number, t: Record<string, unknown>) => sum + Number(t.amount ?? 0), 0),
    [transactions],
  );

  const stats = [
    {
      title: "Today's Collections",
      value: `₹${totalToday.toLocaleString('en-IN')}`,
      change: '+12.5%',
      icon: IndianRupee,
      color: '#F36A4F',
    },
    {
      title: 'Active Donors',
      value: donorCount.toLocaleString('en-IN'),
      change: '+8.2%',
      icon: Users,
      color: '#734F48',
    },
    {
      title: 'Pending Receipts',
      value: '23',
      change: '-15%',
      icon: Receipt,
      color: '#F36A4F',
    },
    {
      title: 'This Month',
      value: `₹${(totalMonth / 1_00_000).toFixed(1)}L`,
      change: '+18.3%',
      icon: TrendingUp,
      color: '#734F48',
    },
  ];
  
  const quickActions = [
    { id: 'create-echallan', label: 'Create E-Challan', icon: Plus, color: '#F36A4F' },
    { id: 'print-receipt', label: 'Print Receipt', icon: Printer, color: '#734F48' },
    { id: 'add-category', label: 'Add Donation Category', icon: FileText, color: '#F36A4F' },
    { id: 'view-collections', label: 'View Today\'s Collections', icon: BarChart3, color: '#734F48' },
    { id: 'process-refund', label: 'Process Refund', icon: RefreshCw, color: '#F36A4F' },
    { id: 'pending-approvals', label: 'Pending Approvals', icon: FileCheck, color: '#734F48' },
  ];
  
  const alerts = [
    {
      id: '1',
      type: 'error',
      title: 'Reconciliation Mismatch',
      message: '3 transactions from 14 Jan 2026 need attention',
      time: '10 mins ago',
    },
    {
      id: '2',
      type: 'warning',
      title: 'Failed Email Delivery',
      message: '5 receipt emails failed to send',
      time: '1 hour ago',
    },
    {
      id: '3',
      type: 'info',
      title: 'Duplicate Donors Detected',
      message: '2 potential duplicate donor records found',
      time: '2 hours ago',
    },
    {
      id: '4',
      type: 'warning',
      title: 'Receipts Pending Generation',
      message: '12 donations awaiting receipt generation',
      time: '3 hours ago',
    },
    {
      id: '5',
      type: 'info',
      title: 'Enquiries Pending >48hrs',
      message: '4 enquiries need response',
      time: '1 day ago',
    },
  ];
  
  return (
    <div className="space-y-[24px]">
      {/* Page Header */}
      <div>
        <h1 className="text-[28px] leading-[36px] font-bold text-[#0D0D0D]">Dashboard</h1>
        <p className="text-[16px] leading-[24px] text-[#6E6E6E] mt-1">
          Operational overview
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith('+');
          
          return (
            <Card key={index} className="min-h-[110px]">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <span
                  className={`text-[13px] leading-[18px] font-medium px-2 py-1 rounded-full ${
                    isPositive
                      ? 'bg-[#F1EEED] text-[#734F48]'
                      : 'bg-[#FEF1EE] text-[#F36A4F]'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-[13px] leading-[18px] text-[#6E6E6E] mb-1">{stat.title}</p>
              <p className="text-[24px] leading-[32px] font-bold text-[#0D0D0D]">{stat.value}</p>
            </Card>
          );
        })}
      </div>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader title="Quick Actions" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
          {quickActions.map((action) => {
            const Icon = action.icon;
            
            return (
              <button
                key={action.id}
                onClick={() => {
                  setSelectedQuickAction(action.id);
                  if (action.id === 'create-echallan' && onNavigate) {
                    onNavigate('/payments/e-challan-entry');
                  }
                }}
                className="h-[96px] p-[16px] flex flex-col items-start gap-3 bg-white border border-[#DBDBDB] rounded-[16px] hover:border-[#F36A4F] hover:bg-[#FEF7F6] transition-all"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${action.color}15` }}>
                  <Icon className="w-5 h-5" style={{ color: action.color }} />
                </div>
                <span className="text-[14px] leading-[20px] font-medium text-[#0D0D0D] text-left">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </Card>
      
      {/* Alerts Panel */}
      <Card>
        <CardHeader
          title="Alerts & Notifications"
          subtitle="Issues requiring attention"
        />
        <div className="space-y-[12px]">
          {alerts.map((alert) => {
            const alertColors = {
              error: { bg: '#FEF1EE', border: '#F36A4F', icon: AlertTriangle, iconColor: '#F36A4F' },
              warning: { bg: '#FEF7F6', border: '#FF8870', icon: AlertTriangle, iconColor: '#FF8870' },
              info: { bg: '#F1EEED', border: '#734F48', icon: FileCheck, iconColor: '#734F48' },
            };
            
            const config = alertColors[alert.type as keyof typeof alertColors];
            const Icon = config.icon;
            
            return (
              <div
                key={alert.id}
                className="h-[48px] flex items-center gap-3 p-[12px] rounded-[8px] border"
                style={{ backgroundColor: config.bg, borderColor: config.border }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" style={{ color: config.iconColor }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] leading-[20px] font-medium text-[#0D0D0D] truncate">
                    {alert.title}
                  </p>
                  <p className="text-[12px] leading-[16px] text-[#6E6E6E] truncate">
                    {alert.message}
                  </p>
                </div>
                <span className="text-[12px] leading-[16px] text-[#6E6E6E] whitespace-nowrap">
                  {alert.time}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="outline">View All Alerts</Button>
        </div>
      </Card>
    </div>
  );
}