import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Users,
  CreditCard,
  FileText,
  Database,
  UserCircle,
  BarChart3,
  MessageSquare,
  Globe,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  priority: 'P0' | 'P1' | 'P2';
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', priority: 'P0' },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    priority: 'P0',
    children: [
      { id: 'donation-form', label: 'Donation Form', icon: FileText, path: '/settings/donation-form', priority: 'P0' },
      { id: 'users-roles', label: 'Roles', icon: Users, path: '/settings/users-roles', priority: 'P0' },
      { id: 'users', label: 'Users', icon: Users, path: '/settings/users', priority: 'P0' },
    ],
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: CreditCard,
    path: '/payments',
    priority: 'P0',
    children: [
      { id: 'gateway-settings', label: 'Gateway Settings', icon: Settings, path: '/payments/gateway-settings', priority: 'P0' },
      { id: 'transactions', label: 'Transactions', icon: FileText, path: '/payments/transactions', priority: 'P0' },
      { id: 'reconciliation', label: 'Reconciliation', icon: FileText, path: '/payments/reconciliation', priority: 'P0' },
    ],
  },
  {
    id: 'receipts',
    label: 'Receipts',
    icon: FileText,
    path: '/receipts',
    priority: 'P0',
    children: [
      { id: 'management', label: 'Management', icon: Settings, path: '/receipts/management', priority: 'P0' },
    ],
  },
  {
    id: 'master-data',
    label: 'Master Data',
    icon: Database,
    path: '/master-data',
    priority: 'P0',
    children: [
      { id: 'donation-categories', label: 'Donation Categories', icon: Database, path: '/master-data/donation-categories', priority: 'P0' },
    ],
  },
  {
    id: 'donors',
    label: 'Donors',
    icon: UserCircle,
    path: '/donors',
    priority: 'P0',
    children: [
      { id: 'all-donors', label: 'All Donors', icon: UserCircle, path: '/donors/all', priority: 'P0' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    path: '/reports',
    priority: 'P0',
    children: [
      { id: 'fund-collection', label: 'Fund Collection', icon: BarChart3, path: '/reports/fund-collection', priority: 'P0' },
      { id: 'receipt-register', label: 'Receipt Register', icon: FileText, path: '/reports/receipt-register', priority: 'P2' },
    ],
  },
  {
    id: 'communications',
    label: 'Communications',
    icon: MessageSquare,
    path: '/communications',
    priority: 'P1',
    children: [
      { id: 'enquiries', label: 'Enquiries', icon: MessageSquare, path: '/communications/enquiries', priority: 'P1' },
      { id: 'templates', label: 'Templates', icon: FileText, path: '/communications/templates', priority: 'P1' },
      { id: 'automation', label: 'Automation', icon: Settings, path: '/communications/automation', priority: 'P1' },
    ],
  },
  {
    id: 'website',
    label: 'Website',
    icon: Globe,
    path: '/website',
    priority: 'P2',
    children: [
      { id: 'content', label: 'Content', icon: FileText, path: '/website/content', priority: 'P2' },
      { id: 'sponsors', label: 'Sponsors', icon: Users, path: '/website/sponsors', priority: 'P2' },
      { id: 'gallery', label: 'Gallery', icon: Globe, path: '/website/gallery', priority: 'P2' },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  
  const renderNavItem = (item: NavItem, depth = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
    const hasChildren = item.children && item.children.length > 0;
    
    const Icon = item.icon;
    
    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            } else {
              navigate(item.path);
            }
          }}
          className={`w-full h-[44px] flex items-center gap-[10px] px-[12px] rounded-[16px] transition-colors ${
            isActive
              ? 'bg-[#FEF1EE] text-[#F36A4F] relative'
              : 'text-[#3D3D3D] hover:bg-[#F3F3F3]'
          } ${depth > 0 ? 'ml-[24px]' : ''}`}
        >
          {isActive && depth === 0 && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[24px] bg-[#F36A4F] rounded-r" />
          )}
          <Icon className="w-5 h-5" />
          <span className="flex-1 text-left text-[14px] leading-[20px] font-medium">
            {item.label}
          </span>
          {item.priority !== 'P0' && (
            <span className="text-[11px] leading-[16px] text-[#6E6E6E]">{item.priority}</span>
          )}
          {hasChildren && (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          )}
        </button>
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="w-[280px] h-screen bg-white border-r border-[#DBDBDB] flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="h-[56px] px-[16px] flex items-center border-b border-[#DBDBDB]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#F36A4F] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div>
            <h1 className="text-[16px] leading-[20px] font-bold text-[#0D0D0D]">Aram Foundation</h1>
            <p className="text-[11px] leading-[14px] text-[#6E6E6E]">Admin Portal</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-[16px] space-y-1">
        {navigation.map((item) => renderNavItem(item))}
      </div>
      
      {/* User Profile */}
      <div className="p-[16px] border-t border-[#DBDBDB]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F36A4F] rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">SA</span>
          </div>
          <div className="flex-1">
            <p className="text-[14px] leading-[20px] font-medium text-[#0D0D0D]">Super Admin</p>
            <p className="text-[12px] leading-[16px] text-[#6E6E6E]">admin@aram.org</p>
          </div>
        </div>
      </div>
    </div>
  );
}