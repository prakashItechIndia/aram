import { useState } from 'react';
import {
  Settings,
  Play,
  Pause,
  Plus,
  Edit,
  Copy,
  Trash2,
  ChevronRight,
  Zap,
  Mail,
  MessageSquare,
  Clock,
  Filter,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Search,
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  actions: string[];
  status: 'Enabled' | 'Disabled';
  lastRun: string;
  nextRun: string;
  successRate: number;
  category: 'Transactional' | 'Operational' | 'Marketing';
  priority: 'High' | 'Medium' | 'Low';
}

const mockRules: AutomationRule[] = [
  {
    id: '1',
    name: 'Send Receipt on Payment Success',
    trigger: 'Payment Success',
    actions: ['Send Email', 'Send SMS'],
    status: 'Enabled',
    lastRun: '2026-01-20 10:30 AM',
    nextRun: 'Immediate on trigger',
    successRate: 98.5,
    category: 'Transactional',
    priority: 'High',
  },
  {
    id: '2',
    name: 'Thank You Email After Receipt',
    trigger: 'Receipt Generated',
    actions: ['Send Email'],
    status: 'Enabled',
    lastRun: '2026-01-20 09:15 AM',
    nextRun: 'Immediate on trigger',
    successRate: 95.2,
    category: 'Transactional',
    priority: 'Medium',
  },
  {
    id: '3',
    name: 'Festival Greetings - Diwali 2026',
    trigger: 'Scheduled: 2026-10-24',
    actions: ['Send Email'],
    status: 'Disabled',
    lastRun: 'Never',
    nextRun: '2026-10-24 08:00 AM',
    successRate: 0,
    category: 'Marketing',
    priority: 'Low',
  },
];

export function AutomationScreen() {
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Rule builder state
  const [ruleName, setRuleName] = useState('');
  const [ruleCategory, setRuleCategory] = useState<'Transactional' | 'Operational' | 'Marketing'>(
    'Transactional'
  );
  const [rulePriority, setRulePriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [triggerFilters, setTriggerFilters] = useState({
    categories: [] as string[],
    minAmount: '',
    tags: [] as string[],
  });
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [scheduleType, setScheduleType] = useState<'immediate' | 'delay' | 'scheduled'>(
    'immediate'
  );

  const handleNewRule = () => {
    setSelectedRule(null);
    setRuleName('');
    setRuleCategory('Transactional');
    setRulePriority('Medium');
    setSelectedTrigger('');
    setSelectedActions([]);
    setScheduleType('immediate');
    setShowRuleBuilder(true);
  };

  const handleEditRule = (rule: AutomationRule) => {
    setSelectedRule(rule);
    setRuleName(rule.name);
    setShowRuleBuilder(true);
  };

  const handleSaveRule = () => {
    console.log('Saving automation rule:', {
      name: ruleName,
      category: ruleCategory,
      priority: rulePriority,
      trigger: selectedTrigger,
      actions: selectedActions,
      schedule: scheduleType,
    });
    setShowRuleBuilder(false);
  };

  const getStatusColor = (status: string) => {
    return status === 'Enabled'
      ? 'bg-[#E8F5E9] text-[#2E7D32]'
      : 'bg-[#F3F3F3] text-[#6E6E6E]';
  };

  return (
    <div className="flex flex-col bg-[#F8F8F8]">
      {/* Header */}
      <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[24px] mb-[24px]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] leading-[28px] font-semibold text-[#0D0D0D]">
              Communication Automation
            </h1>
            <p className="text-[13px] leading-[18px] text-[#6E6E6E] mt-1">
              Configure automated notifications with triggers and workflows
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] bg-white hover:bg-[#F3F3F3] transition-colors flex items-center gap-2 text-[14px] font-medium text-[#3D3D3D]"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            <button
              onClick={() => setShowLogs(true)}
              className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] bg-white hover:bg-[#F3F3F3] transition-colors flex items-center gap-2 text-[14px] font-medium text-[#3D3D3D]"
            >
              <BarChart3 className="w-4 h-4" />
              View Logs
            </button>

            <button
              onClick={handleNewRule}
              className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] transition-colors flex items-center gap-2 text-[14px] font-medium text-white"
            >
              <Plus className="w-4 h-4" />
              New Automation Rule
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-[16px] mb-[24px]">
        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Total Rules</p>
          <p className="text-[24px] font-semibold text-[#0D0D0D]">{mockRules.length}</p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Active Rules</p>
          <p className="text-[24px] font-semibold text-[#2E7D32]">
            {mockRules.filter((r) => r.status === 'Enabled').length}
          </p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Avg Success Rate</p>
          <p className="text-[24px] font-semibold text-[#0D0D0D]">96.8%</p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Emails Sent (Today)</p>
          <p className="text-[24px] font-semibold text-[#0D0D0D]">1,247</p>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px] mb-[24px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-[#0D0D0D]">Filters</h3>
            <button className="text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium">
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-4 gap-[16px]">
            <div>
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Status</label>
              <select className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                <option>All</option>
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                Trigger Type
              </label>
              <select className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                <option>All Triggers</option>
                <option>Payment Success</option>
                <option>Receipt Generated</option>
                <option>Donor Created</option>
                <option>Scheduled</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Channel</label>
              <select className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                <option>All Channels</option>
                <option>Email</option>
                <option>SMS</option>
                <option>Both</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Category</label>
              <select className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                <option>All Categories</option>
                <option>Transactional</option>
                <option>Operational</option>
                <option>Marketing</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Rules Table */}
      <div className="bg-white rounded-[16px] border border-[#DBDBDB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8F8F8] border-b border-[#DBDBDB]">
                <th className="h-[48px] px-[16px] text-left text-[13px] font-semibold text-[#3D3D3D]">
                  Rule Name
                </th>
                <th className="h-[48px] px-[16px] text-left text-[13px] font-semibold text-[#3D3D3D]">
                  Trigger
                </th>
                <th className="h-[48px] px-[16px] text-left text-[13px] font-semibold text-[#3D3D3D]">
                  Actions
                </th>
                <th className="h-[48px] px-[16px] text-center text-[13px] font-semibold text-[#3D3D3D]">
                  Status
                </th>
                <th className="h-[48px] px-[16px] text-left text-[13px] font-semibold text-[#3D3D3D]">
                  Last Run
                </th>
                <th className="h-[48px] px-[16px] text-left text-[13px] font-semibold text-[#3D3D3D]">
                  Next Run
                </th>
                <th className="h-[48px] px-[16px] text-center text-[13px] font-semibold text-[#3D3D3D]">
                  Success Rate
                </th>
                <th className="h-[48px] px-[16px] text-right text-[13px] font-semibold text-[#3D3D3D]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockRules.map((rule) => (
                <tr key={rule.id} className="border-b border-[#DBDBDB] hover:bg-[#F8F8F8]">
                  <td className="h-[56px] px-[16px]">
                    <div>
                      <p className="text-[14px] text-[#0D0D0D] font-medium">{rule.name}</p>
                      <p className="text-[12px] text-[#6E6E6E]">{rule.category}</p>
                    </div>
                  </td>
                  <td className="h-[56px] px-[16px] text-[14px] text-[#3D3D3D]">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#F57F17]" />
                      {rule.trigger}
                    </div>
                  </td>
                  <td className="h-[56px] px-[16px]">
                    <div className="flex items-center gap-1">
                      {rule.actions.map((action, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 px-2 py-1 bg-[#F3F3F3] rounded text-[12px] text-[#3D3D3D]"
                        >
                          {action.includes('Email') ? (
                            <Mail className="w-3 h-3" />
                          ) : (
                            <MessageSquare className="w-3 h-3" />
                          )}
                          {action}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="h-[56px] px-[16px] text-center">
                    <span
                      className={`inline-block px-2 py-1 text-[12px] font-medium rounded-full ${getStatusColor(
                        rule.status
                      )}`}
                    >
                      {rule.status}
                    </span>
                  </td>
                  <td className="h-[56px] px-[16px] text-[13px] text-[#3D3D3D]">{rule.lastRun}</td>
                  <td className="h-[56px] px-[16px] text-[13px] text-[#3D3D3D]">{rule.nextRun}</td>
                  <td className="h-[56px] px-[16px] text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-12 h-1.5 bg-[#F3F3F3] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#2E7D32]"
                          style={{ width: `${rule.successRate}%` }}
                        />
                      </div>
                      <span className="text-[13px] font-medium text-[#0D0D0D]">
                        {rule.successRate}%
                      </span>
                    </div>
                  </td>
                  <td className="h-[56px] px-[16px]">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                        title={rule.status === 'Enabled' ? 'Disable' : 'Enable'}
                      >
                        {rule.status === 'Enabled' ? (
                          <Pause className="w-4 h-4 text-[#3D3D3D]" />
                        ) : (
                          <Play className="w-4 h-4 text-[#2E7D32]" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEditRule(rule)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-[#3D3D3D]" />
                      </button>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4 text-[#3D3D3D]" />
                      </button>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                        title="View Logs"
                        onClick={() => setShowLogs(true)}
                      >
                        <BarChart3 className="w-4 h-4 text-[#3D3D3D]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rule Builder Modal */}
      {showRuleBuilder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[24px] overflow-auto">
          <div className="bg-white rounded-[16px] w-full max-w-[900px] my-auto">
            <div className="sticky top-0 bg-white border-b border-[#DBDBDB] p-[24px] flex items-center justify-between rounded-t-[16px]">
              <h3 className="text-[18px] font-semibold text-[#0D0D0D]">
                {selectedRule ? 'Edit Automation Rule' : 'New Automation Rule'}
              </h3>
              <button
                onClick={() => setShowRuleBuilder(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
              >
                <X className="w-5 h-5 text-[#3D3D3D]" />
              </button>
            </div>

            <div className="p-[24px] max-h-[70vh] overflow-y-auto">
              {/* Step 0: Rule Basics */}
              <div className="mb-6 pb-6 border-b border-[#DBDBDB]">
                <h4 className="text-[14px] font-semibold text-[#0D0D0D] mb-4">Rule Basics</h4>
                <div className="grid grid-cols-3 gap-[16px]">
                  <div className="col-span-2">
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Rule Name *
                    </label>
                    <input
                      type="text"
                      value={ruleName}
                      onChange={(e) => setRuleName(e.target.value)}
                      className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                      placeholder="e.g., Send Receipt on Payment Success"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Category *
                    </label>
                    <select
                      value={ruleCategory}
                      onChange={(e) => setRuleCategory(e.target.value as any)}
                      className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    >
                      <option>Transactional</option>
                      <option>Operational</option>
                      <option>Marketing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Priority
                    </label>
                    <select
                      value={rulePriority}
                      onChange={(e) => setRulePriority(e.target.value as any)}
                      className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                      Status
                    </label>
                    <select className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                      <option>Enabled</option>
                      <option>Disabled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 1: IF (Trigger) */}
              <div className="mb-6 pb-6 border-b border-[#DBDBDB]">
                <h4 className="text-[14px] font-semibold text-[#0D0D0D] mb-4">
                  Step 1: IF (Trigger Event)
                </h4>
                <div className="mb-4">
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Select Trigger *
                  </label>
                  <select
                    value={selectedTrigger}
                    onChange={(e) => setSelectedTrigger(e.target.value)}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                  >
                    <option value="">Select a trigger...</option>
                    <option>Payment Success</option>
                    <option>Receipt Generated</option>
                    <option>E-Challan Saved</option>
                    <option>Enquiry Received</option>
                    <option>Donor Profile Created</option>
                    <option>Scheduled Date/Time</option>
                  </select>
                </div>

                {selectedTrigger && (
                  <div className="p-[16px] bg-[#F8F8F8] rounded-[12px]">
                    <p className="text-[13px] font-medium text-[#0D0D0D] mb-3">
                      Trigger Filters (Optional)
                    </p>
                    <div className="grid grid-cols-2 gap-[12px]">
                      <div>
                        <label className="block text-[12px] font-medium text-[#3D3D3D] mb-2">
                          Donation Categories
                        </label>
                        <select className="w-full h-[40px] px-[10px] rounded-[8px] border border-[#DBDBDB] text-[13px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                          <option>All Categories</option>
                          <option>General Donation</option>
                          <option>Education Fund</option>
                          <option>Health & Medical</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[12px] font-medium text-[#3D3D3D] mb-2">
                          Minimum Amount
                        </label>
                        <input
                          type="number"
                          placeholder="₹ 0"
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val !== '') {
                              const parsed = parseFloat(val);
                              if (!isNaN(parsed)) e.target.value = Math.max(0, parsed).toString();
                            }
                          }}
                          min="0"
                          className="w-full h-[40px] px-[10px] rounded-[8px] border border-[#DBDBDB] text-[13px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: THEN (Actions) */}
              <div className="mb-6 pb-6 border-b border-[#DBDBDB]">
                <h4 className="text-[14px] font-semibold text-[#0D0D0D] mb-4">
                  Step 2: THEN (Actions)
                </h4>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-[12px] border-2 border-[#DBDBDB] rounded-[12px] hover:border-[#F36A4F] cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedActions.includes('Send Email')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedActions([...selectedActions, 'Send Email']);
                        } else {
                          setSelectedActions(selectedActions.filter((a) => a !== 'Send Email'));
                        }
                      }}
                      className="w-4 h-4 mt-0.5 accent-[#F36A4F]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-4 h-4 text-[#F36A4F]" />
                        <span className="text-[14px] font-medium text-[#0D0D0D]">Send Email</span>
                      </div>
                      <p className="text-[12px] text-[#6E6E6E]">
                        Send an email notification using a template
                      </p>
                      {selectedActions.includes('Send Email') && (
                        <div className="mt-3">
                          <select className="w-full h-[40px] px-[10px] rounded-[8px] border border-[#DBDBDB] text-[13px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                            <option>Select email template...</option>
                            <option>Receipt Generation Email</option>
                            <option>Thank You Email</option>
                            <option>Festival Greeting Email</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-[12px] border-2 border-[#DBDBDB] rounded-[12px] hover:border-[#F36A4F] cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedActions.includes('Send SMS')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedActions([...selectedActions, 'Send SMS']);
                        } else {
                          setSelectedActions(selectedActions.filter((a) => a !== 'Send SMS'));
                        }
                      }}
                      className="w-4 h-4 mt-0.5 accent-[#F36A4F]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-4 h-4 text-[#F36A4F]" />
                        <span className="text-[14px] font-medium text-[#0D0D0D]">Send SMS</span>
                      </div>
                      <p className="text-[12px] text-[#6E6E6E]">
                        Send an SMS notification using a template
                      </p>
                      {selectedActions.includes('Send SMS') && (
                        <div className="mt-3">
                          <select className="w-full h-[40px] px-[10px] rounded-[8px] border border-[#DBDBDB] text-[13px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                            <option>Select SMS template...</option>
                            <option>Payment Success SMS</option>
                            <option>Receipt Generated SMS</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Step 3: SCHEDULE */}
              <div className="mb-6 pb-6 border-b border-[#DBDBDB]">
                <h4 className="text-[14px] font-semibold text-[#0D0D0D] mb-4">
                  Step 3: SCHEDULE (When to Send)
                </h4>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-[12px] border-2 border-[#DBDBDB] rounded-[12px] hover:border-[#F36A4F] cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="schedule"
                      checked={scheduleType === 'immediate'}
                      onChange={() => setScheduleType('immediate')}
                      className="w-4 h-4 mt-0.5 accent-[#F36A4F]"
                    />
                    <div>
                      <p className="text-[14px] font-medium text-[#0D0D0D]">Immediate</p>
                      <p className="text-[12px] text-[#6E6E6E]">
                        Send immediately when trigger occurs
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-[12px] border-2 border-[#DBDBDB] rounded-[12px] hover:border-[#F36A4F] cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="schedule"
                      checked={scheduleType === 'delay'}
                      onChange={() => setScheduleType('delay')}
                      className="w-4 h-4 mt-0.5 accent-[#F36A4F]"
                    />
                    <div className="flex-1">
                      <p className="text-[14px] font-medium text-[#0D0D0D]">Delay</p>
                      <p className="text-[12px] text-[#6E6E6E] mb-3">
                        Send after a delay from trigger
                      </p>
                      {scheduleType === 'delay' && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            defaultValue="1"
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val !== '') {
                                const parsed = parseInt(val);
                                if (!isNaN(parsed)) e.target.value = Math.max(0, parsed).toString();
                              }
                            }}
                            min="0"
                            className="w-20 h-[40px] px-[10px] rounded-[8px] border border-[#DBDBDB] text-[13px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                          />
                          <select className="flex-1 h-[40px] px-[10px] rounded-[8px] border border-[#DBDBDB] text-[13px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                            <option>Hours</option>
                            <option>Days</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-[12px] border-2 border-[#DBDBDB] rounded-[12px] hover:border-[#F36A4F] cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="schedule"
                      checked={scheduleType === 'scheduled'}
                      onChange={() => setScheduleType('scheduled')}
                      className="w-4 h-4 mt-0.5 accent-[#F36A4F]"
                    />
                    <div className="flex-1">
                      <p className="text-[14px] font-medium text-[#0D0D0D]">Specific Date/Time</p>
                      <p className="text-[12px] text-[#6E6E6E] mb-3">
                        Send on a specific date and time
                      </p>
                      {scheduleType === 'scheduled' && (
                        <div className="grid grid-cols-2 gap-[12px]">
                          <input
                            type="date"
                            className="w-full h-[40px] px-[10px] rounded-[8px] border border-[#DBDBDB] text-[13px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                          />
                          <input
                            type="time"
                            className="w-full h-[40px] px-[10px] rounded-[8px] border border-[#DBDBDB] text-[13px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                          />
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Step 4: FILTERS (Who receives) */}
              <div className="mb-6">
                <h4 className="text-[14px] font-semibold text-[#0D0D0D] mb-4">
                  Step 4: FILTERS (Audience)
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="radio" name="audience" defaultChecked className="w-4 h-4 accent-[#F36A4F]" />
                    <span className="text-[14px] text-[#0D0D0D]">All eligible recipients</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="audience" className="w-4 h-4 accent-[#F36A4F]" />
                    <span className="text-[14px] text-[#0D0D0D]">Tag-based filter</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="audience" className="w-4 h-4 accent-[#F36A4F]" />
                    <span className="text-[14px] text-[#0D0D0D]">Custom segment</span>
                  </label>
                </div>

                <div className="mt-4 p-[12px] bg-[#FFF3E0] rounded-[8px]">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#E65100] mt-0.5" />
                    <div>
                      <p className="text-[12px] font-medium text-[#E65100]">Consent Filters</p>
                      <p className="text-[11px] text-[#E65100] mt-1">
                        Marketing emails will only be sent to opted-in donors. Blocked donors are
                        automatically excluded.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-white border-t border-[#DBDBDB] p-[24px] flex justify-end gap-3 rounded-b-[16px]">
              <button
                onClick={() => setShowRuleBuilder(false)}
                className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRule}
                className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[14px] font-medium"
              >
                Save Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Run Logs Modal */}
      {showLogs && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-end z-50">
          <div className="bg-white w-[600px] h-full overflow-auto">
            <div className="sticky top-0 bg-white border-b border-[#DBDBDB] p-[24px] flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-[#0D0D0D]">Automation Run Logs</h3>
              <button
                onClick={() => setShowLogs(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
              >
                <X className="w-5 h-5 text-[#3D3D3D]" />
              </button>
            </div>

            <div className="p-[24px]">
              {/* Search/Filter */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6E6E]" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    className="w-full h-[44px] pl-[36px] pr-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                  />
                </div>
              </div>

              {/* Log Entries */}
              <div className="space-y-3">
                {[
                  {
                    rule: 'Send Receipt on Payment Success',
                    event: 'Payment #pay_123456',
                    recipient: 'rajesh.k@email.com',
                    channel: 'Email',
                    status: 'Sent',
                    time: '2026-01-20 10:30 AM',
                  },
                  {
                    rule: 'Send Receipt on Payment Success',
                    event: 'Payment #pay_123456',
                    recipient: '+91 98765 43210',
                    channel: 'SMS',
                    status: 'Sent',
                    time: '2026-01-20 10:30 AM',
                  },
                  {
                    rule: 'Thank You Email After Receipt',
                    event: 'Receipt #ARAM/2025-26/00123',
                    recipient: 'priya.s@email.com',
                    channel: 'Email',
                    status: 'Failed',
                    time: '2026-01-20 09:15 AM',
                    error: 'Invalid email address',
                  },
                ].map((log, idx) => (
                  <div
                    key={idx}
                    className="p-[16px] bg-[#F8F8F8] rounded-[12px] border border-[#DBDBDB]"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-[13px] font-medium text-[#0D0D0D]">{log.rule}</p>
                        <p className="text-[12px] text-[#6E6E6E]">Event: {log.event}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {log.status === 'Sent' ? (
                          <CheckCircle className="w-4 h-4 text-[#2E7D32]" />
                        ) : (
                          <XCircle className="w-4 h-4 text-[#C62828]" />
                        )}
                        <span
                          className={`text-[12px] font-medium ${log.status === 'Sent' ? 'text-[#2E7D32]' : 'text-[#C62828]'
                            }`}
                        >
                          {log.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-[12px] text-[12px]">
                      <div>
                        <p className="text-[#6E6E6E]">Recipient:</p>
                        <p className="text-[#0D0D0D] font-medium">{log.recipient}</p>
                      </div>
                      <div>
                        <p className="text-[#6E6E6E]">Channel:</p>
                        <p className="text-[#0D0D0D] font-medium">{log.channel}</p>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#DBDBDB]">
                      <p className="text-[11px] text-[#6E6E6E]">{log.time}</p>
                      {log.error && (
                        <p className="text-[11px] text-[#C62828] mt-1">Error: {log.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
