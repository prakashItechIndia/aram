import { useState } from 'react';
import { Card, CardHeader } from '../ui/card';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { Download, TrendingUp, Users, IndianRupee, CreditCard } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function FundCollectionReport() {
  const [dateRange, setDateRange] = useState('this-month');
  const [activeTab, setActiveTab] = useState<'summary' | 'transactions' | 'export'>('summary');
  
  // Mock data
  const stats = [
    { title: 'Total Collected', value: '₹45.2L', change: '+18.3%', icon: IndianRupee, color: '#F36A4F' },
    { title: 'Donor Count', value: '1,234', change: '+12.5%', icon: Users, color: '#734F48' },
    { title: 'Avg Donation', value: '₹3,662', change: '+5.2%', icon: TrendingUp, color: '#F36A4F' },
    { title: 'Online vs Offline', value: '85% : 15%', change: '+3%', icon: CreditCard, color: '#734F48' },
  ];
  
  const trendData = [
    { date: '01 Jan', amount: 125000, donors: 42 },
    { date: '05 Jan', amount: 185000, donors: 58 },
    { date: '10 Jan', amount: 245000, donors: 73 },
    { date: '15 Jan', amount: 195000, donors: 61 },
    { date: '20 Jan', amount: 325000, donors: 95 },
  ];
  
  const categoryData = [
    { name: 'Education', value: 1500000, count: 345 },
    { name: 'Healthcare', value: 1200000, count: 278 },
    { name: 'General', value: 950000, count: 412 },
    { name: 'Infrastructure', value: 450000, count: 89 },
    { name: 'Other', value: 420000, count: 110 },
  ];
  
  const paymentMethodData = [
    { name: 'UPI', value: 2100000 },
    { name: 'Credit Card', value: 1350000 },
    { name: 'Debit Card', value: 780000 },
    { name: 'Net Banking', value: 560000 },
    { name: 'Cash', value: 730000 },
  ];
  
  const topDonors = [
    { name: 'Rajesh Kumar', amount: 125000, donations: 12 },
    { name: 'Sunita Devi', amount: 150000, donations: 15 },
    { name: 'Priya Sharma', amount: 85000, donations: 8 },
    { name: 'Amit Patel', amount: 45000, donations: 5 },
    { name: 'Vikram Singh', amount: 25000, donations: 3 },
  ];
  
  const COLORS = ['#F36A4F', '#FF8870', '#F9B5A7', '#FCD9D3', '#FEF1EE'];
  
  return (
    <div className="space-y-[24px]">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] leading-[36px] font-bold text-[#0D0D0D]">Fund Collection Report</h1>
          <p className="text-[16px] leading-[24px] text-[#6E6E6E] mt-1">
            Comprehensive donation analytics and insights
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>
      
      {/* Filters */}
      <Card className="!p-[16px]">
        <div className="flex flex-wrap items-end gap-[12px]">
          <div className="w-[220px]">
            <Select
              label="Date Range"
              options={[
                { value: 'today', label: 'Today' },
                { value: 'yesterday', label: 'Yesterday' },
                { value: 'last-7-days', label: 'Last 7 Days' },
                { value: 'last-30-days', label: 'Last 30 Days' },
                { value: 'this-month', label: 'This Month' },
                { value: 'last-month', label: 'Last Month' },
                { value: 'this-fy', label: 'This Financial Year' },
                { value: 'last-fy', label: 'Last Financial Year' },
                { value: 'custom', label: 'Custom Range' },
              ]}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            />
          </div>
          
          <div className="w-[220px]">
            <Select
              label="Donation Type"
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'online', label: 'Online' },
                { value: 'offline', label: 'Offline' },
              ]}
            />
          </div>
          
          <div className="w-[220px]">
            <Select
              label="Category"
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'education', label: 'Education' },
                { value: 'healthcare', label: 'Healthcare' },
                { value: 'general', label: 'General' },
                { value: 'infrastructure', label: 'Infrastructure' },
              ]}
            />
          </div>
          
          <Button variant="outline">
            Apply Filters
          </Button>
        </div>
      </Card>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith('+');
          
          return (
            <Card key={index}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <span
                  className={`text-[13px] leading-[18px] font-medium px-2 py-1 rounded-full ${
                    isPositive ? 'bg-[#F1EEED] text-[#734F48]' : 'bg-[#FEF1EE] text-[#F36A4F]'
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
      
      {/* Tabs */}
      <div className="border-b border-[#DBDBDB]">
        <div className="flex gap-[24px]">
          {[
            { key: 'summary', label: 'Summary' },
            { key: 'transactions', label: 'Transactions' },
            { key: 'export', label: 'Export' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3 text-[14px] leading-[20px] font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-[#F36A4F] text-[#F36A4F]'
                  : 'border-transparent text-[#6E6E6E] hover:text-[#3D3D3D]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'summary' && (
        <div className="space-y-[24px]">
          {/* Trend Chart */}
          <Card>
            <CardHeader title="Collection Trend" subtitle="Daily collection amounts and donor count" />
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E7E7" />
                <XAxis dataKey="date" stroke="#6E6E6E" style={{ fontSize: '13px' }} />
                <YAxis stroke="#6E6E6E" style={{ fontSize: '13px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DBDBDB',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '13px' }} />
                <Line type="monotone" dataKey="amount" stroke="#F36A4F" strokeWidth={2} name="Amount (₹)" />
                <Line type="monotone" dataKey="donors" stroke="#734F48" strokeWidth={2} name="Donors" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          
          {/* Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
            <Card>
              <CardHeader title="Category Distribution" subtitle="Donations by category" />
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #DBDBDB',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
            
            <Card>
              <CardHeader title="Payment Method" subtitle="Distribution by payment type" />
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={paymentMethodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7E7E7" />
                  <XAxis dataKey="name" stroke="#6E6E6E" style={{ fontSize: '13px' }} />
                  <YAxis stroke="#6E6E6E" style={{ fontSize: '13px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #DBDBDB',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  />
                  <Bar dataKey="value" fill="#F36A4F" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
          
          {/* Top Donors */}
          <Card>
            <CardHeader title="Top Donors" subtitle="Highest contributors this period" />
            <div className="space-y-[12px]">
              {topDonors.map((donor, index) => (
                <div key={index} className="flex items-center gap-4 p-[12px] bg-[#F3F3F3] rounded-[8px]">
                  <div className="w-10 h-10 bg-[#F36A4F] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] leading-[20px] font-medium text-[#0D0D0D]">{donor.name}</p>
                    <p className="text-[12px] leading-[16px] text-[#6E6E6E]">
                      {donor.donations} donations
                    </p>
                  </div>
                  <p className="text-[16px] leading-[24px] font-bold text-[#F36A4F]">
                    ₹{donor.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      
      {activeTab === 'transactions' && (
        <Card>
          <p className="text-[16px] leading-[24px] text-[#6E6E6E]">
            Detailed transaction list will be displayed here...
          </p>
        </Card>
      )}
      
      {activeTab === 'export' && (
        <Card>
          <CardHeader
            title="Export Report"
            subtitle="Generate and download reports in various formats"
          />
          <div className="space-y-[20px]">
            <div>
              <label className="block text-[13px] leading-[18px] font-medium text-[#6E6E6E] mb-[6px]">
                Export Format
              </label>
              <Select
                options={[
                  { value: 'excel', label: 'Excel (.xlsx)' },
                  { value: 'csv', label: 'CSV (.csv)' },
                  { value: 'pdf', label: 'PDF (.pdf)' },
                ]}
              />
            </div>
            
            <div className="p-[16px] bg-[#FEF7F6] border border-[#FCD9D3] rounded-[16px]">
              <p className="text-[14px] leading-[20px] text-[#3D3D3D] mb-2">
                <strong>Export Watermark:</strong>
              </p>
              <p className="text-[12px] leading-[16px] text-[#6E6E6E] font-mono">
                Generated by Super Admin on 20 Jan 2026, 10:30 AM from 192.168.1.100
              </p>
              <p className="text-[12px] leading-[16px] text-[#6E6E6E] mt-2">
                All exports are logged in the audit trail for compliance.
              </p>
            </div>
            
            <Button fullWidth>
              <Download className="w-4 h-4" />
              Generate & Download Report
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
