import { useState } from 'react';
import { Plus, Edit, Trash2, X, Check, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

type TabType = 'basic' | 'amount' | 'receipt' | 'form' | 'gateway' | 'accounting';

interface DonationCategory {
  id: string;
  name: string;
  description: string;
  typeCode: string;
  status: 'active' | 'inactive';
  visibleOnForm: boolean;
  sortOrder: number;
  tagLabel?: string;
  highlighted: boolean;
  isDefault: boolean;
  
  // Amount rules
  presetAmounts: number[];
  minAmount?: number;
  maxAmount?: number;
  allowCustomAmount: boolean;
  recurringAllowed: boolean;
  recurringDefaultChecked: boolean;
  
  // Receipt & 80G
  receiptEnabled: boolean;
  eligible80G: boolean;
  template80G?: string;
  templateNon80G?: string;
  autoEmailReceipt: boolean;
  autoSMSReceipt: boolean;
  receiptDescription?: string;
  
  // Form field rules
  panRule: 'always' | 'threshold' | 'optional';
  panThreshold?: number;
  addressRequired: boolean;
  mobileRequired: boolean;
  showPurposeField: boolean;
  allowAnonymous: boolean;
  
  // Gateway restrictions
  allowedGateways: ('razorpay' | 'paytm')[];
  allowedPaymentMethods: string[];
  internationalAllowed: boolean;
  
  // Accounting
  accountingHead?: string;
  costCenter?: string;
  taxCategory?: string;
  reportGrouping?: string;
}

export function DonationCategories() {
  const [categories, setCategories] = useState<DonationCategory[]>([
    {
      id: '1',
      name: 'Education Support',
      description: 'Support for education programs and scholarships',
      typeCode: 'ARAM_EDU',
      status: 'active',
      visibleOnForm: true,
      sortOrder: 1,
      tagLabel: 'Most Needed',
      highlighted: true,
      isDefault: true,
      presetAmounts: [500, 1000, 2500, 5000],
      minAmount: 100,
      maxAmount: 100000,
      allowCustomAmount: true,
      recurringAllowed: true,
      recurringDefaultChecked: false,
      receiptEnabled: true,
      eligible80G: true,
      template80G: 'template_80g',
      templateNon80G: 'template_non_80g',
      autoEmailReceipt: true,
      autoSMSReceipt: true,
      receiptDescription: 'Donation towards Education Support Fund',
      panRule: 'threshold',
      panThreshold: 2000,
      addressRequired: false,
      mobileRequired: true,
      showPurposeField: true,
      allowAnonymous: false,
      allowedGateways: ['razorpay', 'paytm'],
      allowedPaymentMethods: ['upi', 'cards', 'netbanking', 'wallet'],
      internationalAllowed: false,
      accountingHead: 'Donation Income - Education',
      costCenter: 'Education Department',
      taxCategory: '80G Eligible',
      reportGrouping: 'Education',
    },
    {
      id: '2',
      name: 'Medical & Healthcare',
      description: 'Support medical treatment and healthcare facilities',
      typeCode: 'ARAM_MED',
      status: 'active',
      visibleOnForm: true,
      sortOrder: 2,
      tagLabel: 'Urgent',
      highlighted: false,
      isDefault: false,
      presetAmounts: [1000, 2500, 5000, 10000],
      minAmount: 500,
      allowCustomAmount: true,
      recurringAllowed: true,
      recurringDefaultChecked: false,
      receiptEnabled: true,
      eligible80G: true,
      template80G: 'template_80g',
      templateNon80G: 'template_non_80g',
      autoEmailReceipt: true,
      autoSMSReceipt: false,
      receiptDescription: 'Donation towards Medical & Healthcare Fund',
      panRule: 'always',
      addressRequired: true,
      mobileRequired: true,
      showPurposeField: true,
      allowAnonymous: false,
      allowedGateways: ['razorpay', 'paytm'],
      allowedPaymentMethods: ['upi', 'cards', 'netbanking', 'wallet'],
      internationalAllowed: false,
      accountingHead: 'Donation Income - Medical',
      costCenter: 'Healthcare Department',
      taxCategory: '80G Eligible',
      reportGrouping: 'Health & Medical',
    },
    {
      id: '3',
      name: 'Infrastructure Development',
      description: 'Building and facility development projects',
      typeCode: 'ARAM_BUILD',
      status: 'active',
      visibleOnForm: true,
      sortOrder: 3,
      highlighted: false,
      isDefault: false,
      presetAmounts: [5000, 10000, 25000, 50000],
      minAmount: 5000,
      allowCustomAmount: true,
      recurringAllowed: false,
      recurringDefaultChecked: false,
      receiptEnabled: true,
      eligible80G: false,
      templateNon80G: 'template_non_80g',
      autoEmailReceipt: true,
      autoSMSReceipt: false,
      receiptDescription: 'Donation towards Infrastructure Development',
      panRule: 'always',
      addressRequired: true,
      mobileRequired: true,
      showPurposeField: false,
      allowAnonymous: false,
      allowedGateways: ['razorpay', 'paytm'],
      allowedPaymentMethods: ['cards', 'netbanking'],
      internationalAllowed: false,
      accountingHead: 'Capital Receipts - Infrastructure',
      costCenter: 'Infrastructure Department',
      taxCategory: 'Non 80G',
      reportGrouping: 'Infrastructure',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DonationCategory | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<DonationCategory>>({});

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'amount', label: 'Amount Rules' },
    { id: 'receipt', label: 'Receipt & 80G' },
    { id: 'form', label: 'Form Fields' },
    { id: 'gateway', label: 'Payment Gateway' },
    { id: 'accounting', label: 'Accounting' },
  ];

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({
      status: 'active',
      visibleOnForm: true,
      sortOrder: categories.length + 1,
      highlighted: false,
      isDefault: false,
      presetAmounts: [500, 1000, 2500, 5000],
      allowCustomAmount: true,
      recurringAllowed: true,
      recurringDefaultChecked: false,
      receiptEnabled: true,
      eligible80G: true,
      autoEmailReceipt: true,
      autoSMSReceipt: false,
      panRule: 'threshold',
      panThreshold: 2000,
      addressRequired: false,
      mobileRequired: true,
      showPurposeField: true,
      allowAnonymous: false,
      allowedGateways: ['razorpay', 'paytm'],
      allowedPaymentMethods: ['upi', 'cards', 'netbanking', 'wallet'],
      internationalAllowed: false,
    });
    setActiveTab('basic');
    setShowModal(true);
  };

  const handleEdit = (category: DonationCategory) => {
    setEditingCategory(category);
    setFormData(category);
    setActiveTab('basic');
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingCategory) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? { ...formData as DonationCategory, id: editingCategory.id } : cat
      ));
    } else {
      setCategories([...categories, { ...formData as DonationCategory, id: Date.now().toString() }]);
    }
    setShowModal(false);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this donation category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] leading-[36px] font-bold text-[#0D0D0D] mb-[4px]">
            Donation Categories
          </h1>
          <p className="text-[16px] leading-[24px] text-[#6E6E6E]">
            Manage donation types, amount rules, receipt settings, and form configurations
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="h-[44px] px-[18px] bg-[#F36A4F] text-white rounded-[999px] text-[16px] leading-[24px] font-medium hover:bg-[#D7563D] transition-colors flex items-center gap-[8px]"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-[16px]">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white border border-[#DBDBDB] rounded-[16px] overflow-hidden"
          >
            {/* Category Header */}
            <div className="p-[24px]">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-[12px] mb-[8px]">
                    <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D]">
                      {category.name}
                    </h3>
                    {category.tagLabel && (
                      <span className="px-[8px] py-[2px] bg-[#FEF1EE] text-[#F36A4F] rounded-[4px] text-[13px] leading-[18px] font-medium">
                        {category.tagLabel}
                      </span>
                    )}
                    <span
                      className={`px-[8px] py-[2px] rounded-[4px] text-[13px] leading-[18px] font-medium ${
                        category.status === 'active'
                          ? 'bg-[#D4F4DD] text-[#0E6027]'
                          : 'bg-[#F3F3F3] text-[#6E6E6E]'
                      }`}
                    >
                      {category.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                    {category.highlighted && (
                      <span className="px-[8px] py-[2px] bg-[#FFF4E5] text-[#F59E0B] rounded-[4px] text-[13px] leading-[18px] font-medium">
                        Highlighted
                      </span>
                    )}
                    {category.isDefault && (
                      <span className="px-[8px] py-[2px] bg-[#EDE9FE] text-[#7C3AED] rounded-[4px] text-[13px] leading-[18px] font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] leading-[20px] text-[#6E6E6E] mb-[12px]">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-[24px]">
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[13px] leading-[18px] text-[#6E6E6E]">Code:</span>
                      <span className="text-[13px] leading-[18px] font-medium text-[#3D3D3D] font-mono">
                        {category.typeCode}
                      </span>
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[13px] leading-[18px] text-[#6E6E6E]">Sort Order:</span>
                      <span className="text-[13px] leading-[18px] font-medium text-[#3D3D3D]">
                        {category.sortOrder}
                      </span>
                    </div>
                    {category.eligible80G && (
                      <span className="px-[8px] py-[2px] bg-[#D4F4DD] text-[#0E6027] rounded-[4px] text-[13px] leading-[18px] font-medium">
                        80G Eligible
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-[8px]">
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                    className="w-[44px] h-[44px] flex items-center justify-center border border-[#DBDBDB] rounded-[999px] hover:bg-[#F3F3F3] transition-colors"
                  >
                    {expandedCategory === category.id ? (
                      <ChevronUp className="w-5 h-5 text-[#3D3D3D]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#3D3D3D]" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(category)}
                    className="w-[44px] h-[44px] flex items-center justify-center border border-[#DBDBDB] rounded-[999px] hover:bg-[#F3F3F3] transition-colors"
                  >
                    <Edit className="w-5 h-5 text-[#3D3D3D]" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="w-[44px] h-[44px] flex items-center justify-center border border-[#F36A4F] text-[#F36A4F] rounded-[999px] hover:bg-[#FEF1EE] transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedCategory === category.id && (
              <div className="border-t border-[#DBDBDB] p-[24px] bg-[#FAFAFA]">
                <div className="grid grid-cols-3 gap-[24px]">
                  {/* Amount Rules */}
                  <div>
                    <h4 className="text-[14px] leading-[20px] font-semibold text-[#0D0D0D] mb-[12px]">
                      Amount Rules
                    </h4>
                    <div className="space-y-[8px]">
                      <div className="flex justify-between">
                        <span className="text-[13px] leading-[18px] text-[#6E6E6E]">Presets:</span>
                        <span className="text-[13px] leading-[18px] text-[#3D3D3D]">
                          ₹{category.presetAmounts.join(', ₹')}
                        </span>
                      </div>
                      {category.minAmount && (
                        <div className="flex justify-between">
                          <span className="text-[13px] leading-[18px] text-[#6E6E6E]">Min Amount:</span>
                          <span className="text-[13px] leading-[18px] text-[#3D3D3D]">
                            ₹{category.minAmount}
                          </span>
                        </div>
                      )}
                      {category.maxAmount && (
                        <div className="flex justify-between">
                          <span className="text-[13px] leading-[18px] text-[#6E6E6E]">Max Amount:</span>
                          <span className="text-[13px] leading-[18px] text-[#3D3D3D]">
                            ₹{category.maxAmount}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-[13px] leading-[18px] text-[#6E6E6E]">Custom Amount:</span>
                        <span className={`text-[13px] leading-[18px] ${category.allowCustomAmount ? 'text-[#0E6027]' : 'text-[#6E6E6E]'}`}>
                          {category.allowCustomAmount ? 'Allowed' : 'Not Allowed'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[13px] leading-[18px] text-[#6E6E6E]">Recurring:</span>
                        <span className={`text-[13px] leading-[18px] ${category.recurringAllowed ? 'text-[#0E6027]' : 'text-[#6E6E6E]'}`}>
                          {category.recurringAllowed ? 'Allowed' : 'Not Allowed'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Form & Receipt */}
                  <div>
                    <h4 className="text-[14px] leading-[20px] font-semibold text-[#0D0D0D] mb-[12px]">
                      Form & Receipt
                    </h4>
                    <div className="space-y-[8px]">
                      <div className="flex justify-between">
                        <span className="text-[13px] leading-[18px] text-[#6E6E6E]">PAN Rule:</span>
                        <span className="text-[13px] leading-[18px] text-[#3D3D3D] capitalize">
                          {category.panRule}
                          {category.panRule === 'threshold' && category.panThreshold && ` (₹${category.panThreshold})`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[13px] leading-[18px] text-[#6E6E6E]">Address:</span>
                        <span className={`text-[13px] leading-[18px] ${category.addressRequired ? 'text-[#F36A4F]' : 'text-[#6E6E6E]'}`}>
                          {category.addressRequired ? 'Required' : 'Optional'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[13px] leading-[18px] text-[#6E6E6E]">Mobile:</span>
                        <span className={`text-[13px] leading-[18px] ${category.mobileRequired ? 'text-[#F36A4F]' : 'text-[#6E6E6E]'}`}>
                          {category.mobileRequired ? 'Required' : 'Optional'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[13px] leading-[18px] text-[#6E6E6E]">Auto Email:</span>
                        <span className={`text-[13px] leading-[18px] ${category.autoEmailReceipt ? 'text-[#0E6027]' : 'text-[#6E6E6E]'}`}>
                          {category.autoEmailReceipt ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[13px] leading-[18px] text-[#6E6E6E]">Auto SMS:</span>
                        <span className={`text-[13px] leading-[18px] ${category.autoSMSReceipt ? 'text-[#0E6027]' : 'text-[#6E6E6E]'}`}>
                          {category.autoSMSReceipt ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Accounting */}
                  <div>
                    <h4 className="text-[14px] leading-[20px] font-semibold text-[#0D0D0D] mb-[12px]">
                      Accounting & Reports
                    </h4>
                    <div className="space-y-[8px]">
                      {category.accountingHead && (
                        <div>
                          <span className="text-[13px] leading-[18px] text-[#6E6E6E] block mb-[2px]">
                            Accounting Head:
                          </span>
                          <span className="text-[13px] leading-[18px] text-[#3D3D3D]">
                            {category.accountingHead}
                          </span>
                        </div>
                      )}
                      {category.costCenter && (
                        <div>
                          <span className="text-[13px] leading-[18px] text-[#6E6E6E] block mb-[2px]">
                            Cost Center:
                          </span>
                          <span className="text-[13px] leading-[18px] text-[#3D3D3D]">
                            {category.costCenter}
                          </span>
                        </div>
                      )}
                      {category.reportGrouping && (
                        <div>
                          <span className="text-[13px] leading-[18px] text-[#6E6E6E] block mb-[2px]">
                            Report Group:
                          </span>
                          <span className="text-[13px] leading-[18px] text-[#3D3D3D]">
                            {category.reportGrouping}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-[24px]">
          <div className="bg-white rounded-[16px] w-full max-w-[900px] max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#DBDBDB]">
              <h3 className="text-[18px] leading-[26px] font-semibold text-[#0D0D0D]">
                {editingCategory ? 'Edit Donation Category' : 'Add Donation Category'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-[#F3F3F3] transition-colors"
              >
                <X className="w-5 h-5 text-[#6E6E6E]" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-[4px] px-[24px] py-[12px] border-b border-[#DBDBDB] overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-[16px] h-[44px] rounded-[8px] text-[14px] leading-[20px] font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#FEF1EE] text-[#F36A4F]'
                      : 'text-[#6E6E6E] hover:bg-[#F3F3F3]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-[24px]">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-[16px]">
                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Donation Type Name <span className="text-[#F36A4F]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      placeholder="e.g., Education Support"
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    />
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Short Description <span className="text-[#F36A4F]">*</span>
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      placeholder="1-2 lines shown under name"
                      rows={2}
                      className="w-full px-[14px] py-[12px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Type Code <span className="text-[#F36A4F]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.typeCode || ''}
                      onChange={(e) => updateFormData('typeCode', e.target.value.toUpperCase())}
                      placeholder="e.g., ARAM_EDU"
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 font-mono"
                    />
                    <p className="text-[13px] leading-[18px] text-[#6E6E6E] mt-[6px]">
                      Unique internal code (uppercase, no spaces)
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-[16px]">
                    <div>
                      <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                        Status
                      </label>
                      <select
                        value={formData.status || 'active'}
                        onChange={(e) => updateFormData('status', e.target.value)}
                        className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        value={formData.sortOrder || 1}
                        onChange={(e) => updateFormData('sortOrder', parseInt(e.target.value))}
                        min="1"
                        className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Tag/Badge Label (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.tagLabel || ''}
                      onChange={(e) => updateFormData('tagLabel', e.target.value)}
                      placeholder="e.g., Most Needed, Urgent"
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    />
                  </div>

                  <div className="space-y-[12px]">
                    <label className="flex items-center gap-[12px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.visibleOnForm || false}
                        onChange={(e) => updateFormData('visibleOnForm', e.target.checked)}
                        className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                      />
                      <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                        Visible on public donation form
                      </span>
                    </label>

                    <label className="flex items-center gap-[12px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.highlighted || false}
                        onChange={(e) => updateFormData('highlighted', e.target.checked)}
                        className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                      />
                      <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                        Highlight on donation page (pinned at top)
                      </span>
                    </label>

                    <label className="flex items-center gap-[12px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isDefault || false}
                        onChange={(e) => updateFormData('isDefault', e.target.checked)}
                        className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                      />
                      <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                        Default selection in dropdown
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Amount Rules Tab */}
              {activeTab === 'amount' && (
                <div className="space-y-[16px]">
                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Suggested Amount Presets
                    </label>
                    <div className="grid grid-cols-4 gap-[12px]">
                      {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="relative">
                          <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[16px] leading-[24px] text-[#6E6E6E]">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={formData.presetAmounts?.[index] || ''}
                            onChange={(e) => {
                              const newPresets = [...(formData.presetAmounts || [])];
                              newPresets[index] = parseInt(e.target.value) || 0;
                              updateFormData('presetAmounts', newPresets);
                            }}
                            className="w-full h-[44px] pl-[32px] pr-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-[16px]">
                    <div>
                      <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                        Minimum Amount (Optional)
                      </label>
                      <div className="relative">
                        <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[16px] leading-[24px] text-[#6E6E6E]">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={formData.minAmount || ''}
                          onChange={(e) => updateFormData('minAmount', parseInt(e.target.value) || undefined)}
                          className="w-full h-[44px] pl-[32px] pr-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                        Maximum Amount (Optional)
                      </label>
                      <div className="relative">
                        <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[16px] leading-[24px] text-[#6E6E6E]">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={formData.maxAmount || ''}
                          onChange={(e) => updateFormData('maxAmount', parseInt(e.target.value) || undefined)}
                          className="w-full h-[44px] pl-[32px] pr-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-[12px]">
                    <label className="flex items-center gap-[12px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.allowCustomAmount || false}
                        onChange={(e) => updateFormData('allowCustomAmount', e.target.checked)}
                        className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                      />
                      <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                        Allow custom amount
                      </span>
                    </label>

                    <label className="flex items-center gap-[12px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.recurringAllowed || false}
                        onChange={(e) => updateFormData('recurringAllowed', e.target.checked)}
                        className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                      />
                      <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                        Allow recurring donations
                      </span>
                    </label>

                    {formData.recurringAllowed && (
                      <label className="flex items-center gap-[12px] cursor-pointer ml-[32px]">
                        <input
                          type="checkbox"
                          checked={formData.recurringDefaultChecked || false}
                          onChange={(e) => updateFormData('recurringDefaultChecked', e.target.checked)}
                          className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                        />
                        <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                          Recurring checkbox default checked
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              )}

              {/* Receipt & 80G Tab */}
              {activeTab === 'receipt' && (
                <div className="space-y-[16px]">
                  <div className="space-y-[12px]">
                    <label className="flex items-center gap-[12px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.receiptEnabled || false}
                        onChange={(e) => updateFormData('receiptEnabled', e.target.checked)}
                        className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                      />
                      <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                        Receipt enabled for this donation type
                      </span>
                    </label>

                    <label className="flex items-center gap-[12px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.eligible80G || false}
                        onChange={(e) => updateFormData('eligible80G', e.target.checked)}
                        className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                      />
                      <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                        80G Eligible (Tax Exemption)
                      </span>
                    </label>
                  </div>

                  {formData.receiptEnabled && (
                    <>
                      <div className="grid grid-cols-2 gap-[16px]">
                        <div>
                          <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                            Template for 80G
                          </label>
                          <select
                            value={formData.template80G || ''}
                            onChange={(e) => updateFormData('template80G', e.target.value)}
                            disabled={!formData.eligible80G}
                            className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 disabled:bg-[#F3F3F3]"
                          >
                            <option value="">Select Template</option>
                            <option value="template_80g">80G Compliant Template</option>
                            <option value="template_1">Standard Template</option>
                            <option value="template_2">Detailed Template</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                            Template for Non-80G
                          </label>
                          <select
                            value={formData.templateNon80G || ''}
                            onChange={(e) => updateFormData('templateNon80G', e.target.value)}
                            className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                          >
                            <option value="">Select Template</option>
                            <option value="template_non_80g">Non-80G Template</option>
                            <option value="template_1">Standard Template</option>
                            <option value="template_2">Detailed Template</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                          Receipt Description Line (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.receiptDescription || ''}
                          onChange={(e) => updateFormData('receiptDescription', e.target.value)}
                          placeholder="e.g., Donation towards Education Support Fund"
                          className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                        />
                      </div>

                      <div className="space-y-[12px]">
                        <label className="flex items-center gap-[12px] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.autoEmailReceipt || false}
                            onChange={(e) => updateFormData('autoEmailReceipt', e.target.checked)}
                            className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                          />
                          <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                            Auto email receipt
                          </span>
                        </label>

                        <label className="flex items-center gap-[12px] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.autoSMSReceipt || false}
                            onChange={(e) => updateFormData('autoSMSReceipt', e.target.checked)}
                            className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                          />
                          <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                            Auto SMS receipt link
                          </span>
                        </label>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Form Fields Tab */}
              {activeTab === 'form' && (
                <div className="space-y-[16px]">
                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[12px]">
                      PAN Card Requirement
                    </label>
                    <div className="space-y-[8px]">
                      <label className="flex items-center gap-[12px] cursor-pointer">
                        <input
                          type="radio"
                          name="panRule"
                          checked={formData.panRule === 'always'}
                          onChange={() => updateFormData('panRule', 'always')}
                          className="w-[20px] h-[20px]"
                        />
                        <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                          Always required
                        </span>
                      </label>

                      <label className="flex items-center gap-[12px] cursor-pointer">
                        <input
                          type="radio"
                          name="panRule"
                          checked={formData.panRule === 'threshold'}
                          onChange={() => updateFormData('panRule', 'threshold')}
                          className="w-[20px] h-[20px]"
                        />
                        <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                          Required above threshold
                        </span>
                      </label>

                      <label className="flex items-center gap-[12px] cursor-pointer">
                        <input
                          type="radio"
                          name="panRule"
                          checked={formData.panRule === 'optional'}
                          onChange={() => updateFormData('panRule', 'optional')}
                          className="w-[20px] h-[20px]"
                        />
                        <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                          Optional
                        </span>
                      </label>
                    </div>
                  </div>

                  {formData.panRule === 'threshold' && (
                    <div>
                      <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                        PAN Threshold Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[16px] leading-[24px] text-[#6E6E6E]">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={formData.panThreshold || 2000}
                          onChange={(e) => updateFormData('panThreshold', parseInt(e.target.value))}
                          className="w-full h-[44px] pl-[32px] pr-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-[12px]">
                    <label className="flex items-center gap-[12px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.addressRequired || false}
                        onChange={(e) => updateFormData('addressRequired', e.target.checked)}
                        className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                      />
                      <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                        Address required
                      </span>
                    </label>

                    <label className="flex items-center gap-[12px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.mobileRequired || false}
                        onChange={(e) => updateFormData('mobileRequired', e.target.checked)}
                        className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                      />
                      <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                        Mobile number required
                      </span>
                    </label>

                    <label className="flex items-center gap-[12px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.showPurposeField || false}
                        onChange={(e) => updateFormData('showPurposeField', e.target.checked)}
                        className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                      />
                      <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                        Show "Purpose / Notes" field
                      </span>
                    </label>

                    <label className="flex items-center gap-[12px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.allowAnonymous || false}
                        onChange={(e) => updateFormData('allowAnonymous', e.target.checked)}
                        className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                      />
                      <span className="text-[14px] leading-[20px] text-[#3D3D3D]">
                        Allow anonymous donation
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Payment Gateway Tab */}
              {activeTab === 'gateway' && (
                <div className="space-y-[16px]">
                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[12px]">
                      Allowed Payment Gateways
                    </label>
                    <div className="space-y-[8px]">
                      <label className="flex items-center gap-[12px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.allowedGateways?.includes('razorpay') || false}
                          onChange={(e) => {
                            const current = formData.allowedGateways || [];
                            updateFormData(
                              'allowedGateways',
                              e.target.checked
                                ? [...current, 'razorpay']
                                : current.filter((g) => g !== 'razorpay')
                            );
                          }}
                          className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                        />
                        <span className="text-[14px] leading-[20px] text-[#3D3D3D]">Razorpay</span>
                      </label>

                      <label className="flex items-center gap-[12px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.allowedGateways?.includes('paytm') || false}
                          onChange={(e) => {
                            const current = formData.allowedGateways || [];
                            updateFormData(
                              'allowedGateways',
                              e.target.checked
                                ? [...current, 'paytm']
                                : current.filter((g) => g !== 'paytm')
                            );
                          }}
                          className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                        />
                        <span className="text-[14px] leading-[20px] text-[#3D3D3D]">Paytm</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[12px]">
                      Allowed Payment Methods
                    </label>
                    <div className="grid grid-cols-2 gap-[8px]">
                      {['upi', 'cards', 'netbanking', 'wallet'].map((method) => (
                        <label key={method} className="flex items-center gap-[12px] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.allowedPaymentMethods?.includes(method) || false}
                            onChange={(e) => {
                              const current = formData.allowedPaymentMethods || [];
                              updateFormData(
                                'allowedPaymentMethods',
                                e.target.checked
                                  ? [...current, method]
                                  : current.filter((m) => m !== method)
                              );
                            }}
                            className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                          />
                          <span className="text-[14px] leading-[20px] text-[#3D3D3D] capitalize">
                            {method}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-[16px] bg-[#FAFAFA] border border-[#DBDBDB] rounded-[16px]">
                    <label className="flex items-center gap-[12px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.internationalAllowed || false}
                        onChange={(e) => updateFormData('internationalAllowed', e.target.checked)}
                        className="w-[20px] h-[20px] rounded-[4px] border-2 border-[#DBDBDB] checked:bg-[#F36A4F] checked:border-[#F36A4F]"
                      />
                      <div className="flex-1">
                        <span className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D]">
                          International payments allowed (Future)
                        </span>
                        <span className="text-[13px] leading-[18px] text-[#6E6E6E]">
                          Enable international card payments
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Accounting Tab */}
              {activeTab === 'accounting' && (
                <div className="space-y-[16px]">
                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Ledger / Accounting Head
                    </label>
                    <input
                      type="text"
                      value={formData.accountingHead || ''}
                      onChange={(e) => updateFormData('accountingHead', e.target.value)}
                      placeholder="e.g., Donation Income - Education"
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    />
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Cost Center / Department
                    </label>
                    <input
                      type="text"
                      value={formData.costCenter || ''}
                      onChange={(e) => updateFormData('costCenter', e.target.value)}
                      placeholder="e.g., Education Department"
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    />
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Tax/Compliance Category
                    </label>
                    <select
                      value={formData.taxCategory || ''}
                      onChange={(e) => updateFormData('taxCategory', e.target.value)}
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    >
                      <option value="">Select Category</option>
                      <option value="80G Eligible">80G Eligible</option>
                      <option value="Non 80G">Non 80G</option>
                      <option value="CSR Eligible">CSR Eligible</option>
                      <option value="FCRA">FCRA</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[16px] leading-[24px] font-medium text-[#0D0D0D] mb-[8px]">
                      Report Grouping Label
                    </label>
                    <input
                      type="text"
                      value={formData.reportGrouping || ''}
                      onChange={(e) => updateFormData('reportGrouping', e.target.value)}
                      placeholder="e.g., Education, Health & Medical, Infrastructure"
                      className="w-full h-[44px] px-[14px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                    />
                    <p className="text-[13px] leading-[18px] text-[#6E6E6E] mt-[6px]">
                      Used for Fund Collection dashboard filters and exports
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-[12px] px-[24px] py-[16px] border-t border-[#DBDBDB]">
              <button
                onClick={() => setShowModal(false)}
                className="h-[44px] px-[18px] border border-[#DBDBDB] rounded-[999px] text-[16px] leading-[24px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name || !formData.typeCode || !formData.description}
                className="h-[44px] px-[18px] bg-[#F36A4F] text-white rounded-[999px] text-[16px] leading-[24px] font-medium hover:bg-[#D7563D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingCategory ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
