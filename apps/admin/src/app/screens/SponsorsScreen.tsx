import { useState } from 'react';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Upload,
  Link as LinkIcon,
  Star,
  Eye,
  EyeOff,
  Search,
  Filter,
  GripVertical,
  X,
  Image as ImageIcon,
} from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  website: string;
  contributionType: 'Financial' | 'In-kind' | 'Service' | 'Strategic partner';
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Associate';
  displayOrder: number;
  active: boolean;
  featured: boolean;
  addedOn: string;
  addedBy: string;
}

const mockSponsors: Sponsor[] = [
  {
    id: '1',
    name: 'TCS',
    logo: 'https://logo.clearbit.com/tcs.com',
    website: 'https://www.tcs.com',
    contributionType: 'Financial',
    tier: 'Platinum',
    displayOrder: 1,
    active: true,
    featured: true,
    addedOn: '2025-12-15',
    addedBy: 'Admin User',
  },
  {
    id: '2',
    name: 'Infosys Foundation',
    logo: 'https://logo.clearbit.com/infosys.com',
    website: 'https://www.infosys.com',
    contributionType: 'Financial',
    tier: 'Platinum',
    displayOrder: 2,
    active: true,
    featured: true,
    addedOn: '2025-11-20',
    addedBy: 'Admin User',
  },
  {
    id: '3',
    name: 'Wipro Cares',
    logo: 'https://logo.clearbit.com/wipro.com',
    website: 'https://www.wipro.com',
    contributionType: 'Strategic partner',
    tier: 'Gold',
    displayOrder: 3,
    active: true,
    featured: false,
    addedOn: '2025-10-08',
    addedBy: 'Content Editor',
  },
];

const CONTRIBUTION_TYPES = ['Financial', 'In-kind', 'Service', 'Strategic partner'];
const TIERS = ['Platinum', 'Gold', 'Silver', 'Bronze', 'Associate'];

export function SponsorsScreen() {
  const [showEditor, setShowEditor] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [sponsorToDelete, setSponsorToDelete] = useState<Sponsor | null>(null);

  // Editor state
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorWebsite, setSponsorWebsite] = useState('');
  const [contributionType, setContributionType] = useState<Sponsor['contributionType']>('Financial');
  const [tier, setTier] = useState<Sponsor['tier']>('Silver');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const handleEdit = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setSponsorName(sponsor.name);
    setSponsorWebsite(sponsor.website);
    setContributionType(sponsor.contributionType);
    setTier(sponsor.tier);
    setIsActive(sponsor.active);
    setIsFeatured(sponsor.featured);
    setShowEditor(true);
  };

  const handleNew = () => {
    setSelectedSponsor(null);
    setSponsorName('');
    setSponsorWebsite('');
    setContributionType('Financial');
    setTier('Silver');
    setIsActive(true);
    setIsFeatured(false);
    setShowEditor(true);
  };

  const handleSave = () => {
    console.log('Saving sponsor:', {
      name: sponsorName,
      website: sponsorWebsite,
      contributionType,
      tier,
      active: isActive,
      featured: isFeatured,
    });
    setShowEditor(false);
  };

  const handleDelete = (sponsor: Sponsor) => {
    setSponsorToDelete(sponsor);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log('Deleting sponsor:', sponsorToDelete?.id, 'Reason:', deleteReason);
    setShowDeleteModal(false);
    setDeleteReason('');
    setSponsorToDelete(null);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return 'bg-[#E8E8E8] text-[#424242]';
      case 'Gold':
        return 'bg-[#FFF9C4] text-[#F57F17]';
      case 'Silver':
        return 'bg-[#F3F3F3] text-[#6E6E6E]';
      case 'Bronze':
        return 'bg-[#FFCCBC] text-[#BF360C]';
      case 'Associate':
        return 'bg-[#E3F2FD] text-[#1976D2]';
      default:
        return 'bg-[#F3F3F3] text-[#6E6E6E]';
    }
  };

  return (
    <div className="flex flex-col bg-[#F8F8F8]">
      {/* Header */}
      <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[24px] mb-[24px]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] leading-[28px] font-semibold text-[#0D0D0D]">
              Sponsors Management
            </h1>
            <p className="text-[13px] leading-[18px] text-[#6E6E6E] mt-1">
              Manage sponsors and partners displayed on the website
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
              onClick={handleNew}
              className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] transition-colors flex items-center gap-2 text-[14px] font-medium text-white"
            >
              <Plus className="w-4 h-4" />
              Add Sponsor
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-[16px] mb-[24px]">
        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Total Sponsors</p>
          <p className="text-[24px] font-semibold text-[#0D0D0D]">{mockSponsors.length}</p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Active</p>
          <p className="text-[24px] font-semibold text-[#2E7D32]">
            {mockSponsors.filter((s) => s.active).length}
          </p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Featured</p>
          <p className="text-[24px] font-semibold text-[#F57F17]">
            {mockSponsors.filter((s) => s.featured).length}
          </p>
        </div>

        <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
          <p className="text-[13px] text-[#6E6E6E] mb-1">Platinum Tier</p>
          <p className="text-[24px] font-semibold text-[#424242]">
            {mockSponsors.filter((s) => s.tier === 'Platinum').length}
          </p>
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
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Tier</label>
              <select className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                <option>All Tiers</option>
                {TIERS.map((tier) => (
                  <option key={tier}>{tier}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                Contribution Type
              </label>
              <select className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                <option>All Types</option>
                {CONTRIBUTION_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Status</label>
              <select className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]">
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6E6E]" />
                <input
                  type="text"
                  placeholder="Sponsor name..."
                  className="w-full h-[44px] pl-[36px] pr-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 accent-[#F36A4F]" />
              <span className="text-[13px] text-[#3D3D3D]">Featured only</span>
            </label>
          </div>
        </div>
      )}

      {/* Sponsors Grid */}
      <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[24px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-semibold text-[#0D0D0D]">All Sponsors</h3>
          <p className="text-[13px] text-[#6E6E6E]">Drag to reorder</p>
        </div>

        <div className="space-y-3">
          {mockSponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="flex items-center gap-4 p-[16px] bg-[#F8F8F8] rounded-[12px] border border-[#DBDBDB] hover:bg-white transition-colors"
            >
              <button className="cursor-grab active:cursor-grabbing">
                <GripVertical className="w-5 h-5 text-[#6E6E6E]" />
              </button>

              <div className="w-16 h-16 bg-white rounded-[8px] border border-[#DBDBDB] flex items-center justify-center overflow-hidden flex-shrink-0">
                {sponsor.logo ? (
                  <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain p-2" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-[#DBDBDB]" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-[14px] font-semibold text-[#0D0D0D]">{sponsor.name}</h4>
                  {sponsor.featured && (
                    <Star className="w-4 h-4 text-[#F57F17] fill-[#F57F17]" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[11px] font-medium rounded ${getTierColor(sponsor.tier)}`}>
                    {sponsor.tier}
                  </span>
                  <span className="text-[12px] text-[#6E6E6E]">{sponsor.contributionType}</span>
                  {sponsor.website && (
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] text-[#F36A4F] hover:text-[#E55A3F] flex items-center gap-1"
                    >
                      <LinkIcon className="w-3 h-3" />
                      Website
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {sponsor.active ? (
                    <Eye className="w-4 h-4 text-[#2E7D32]" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-[#6E6E6E]" />
                  )}
                  <span className="text-[12px] text-[#6E6E6E]">
                    {sponsor.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <button
                  onClick={() => handleEdit(sponsor)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                  title="Edit"
                >
                  <Edit className="w-4 h-4 text-[#3D3D3D]" />
                </button>
                <button
                  onClick={() => handleDelete(sponsor)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#FFEBEE]"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-[#C62828]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsor Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[24px]">
          <div className="bg-white rounded-[16px] w-full max-w-[720px]">
            <div className="p-[24px] border-b border-[#DBDBDB] flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-[#0D0D0D]">
                {selectedSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}
              </h3>
              <button
                onClick={() => setShowEditor(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
              >
                <X className="w-5 h-5 text-[#3D3D3D]" />
              </button>
            </div>

            <div className="p-[24px] space-y-4">
              {/* Logo Upload */}
              <div>
                <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                  Logo * (Recommended: 400x400px)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-[#F8F8F8] rounded-[12px] border-2 border-dashed border-[#DBDBDB] flex items-center justify-center">
                    {selectedSponsor?.logo ? (
                      <img
                        src={selectedSponsor.logo}
                        alt="Logo preview"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-[#DBDBDB]" />
                    )}
                  </div>
                  <button className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D] flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </button>
                  <p className="text-[12px] text-[#6E6E6E]">
                    JPG, PNG or SVG. Max 2MB.
                    <br />
                    Auto-resized to standard dimensions
                  </p>
                </div>
              </div>

              {/* Sponsor Details */}
              <div className="grid grid-cols-2 gap-[16px]">
                <div className="col-span-2">
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Sponsor Name *
                  </label>
                  <input
                    type="text"
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    placeholder="e.g., TCS Foundation"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Website URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={sponsorWebsite}
                    onChange={(e) => setSponsorWebsite(e.target.value)}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    placeholder="https://www.sponsor.com"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Contribution Type *
                  </label>
                  <select
                    value={contributionType}
                    onChange={(e) => setContributionType(e.target.value as any)}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                  >
                    {CONTRIBUTION_TYPES.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Sponsor Tier *
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as any)}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                  >
                    {TIERS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-4 border-t border-[#DBDBDB]">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 accent-[#F36A4F]"
                  />
                  <span className="text-[13px] text-[#3D3D3D]">Active (visible on website)</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#F36A4F]"
                  />
                  <span className="text-[13px] text-[#3D3D3D]">
                    Featured sponsor (show on homepage)
                  </span>
                </label>
              </div>
            </div>

            <div className="p-[24px] border-t border-[#DBDBDB] flex justify-end gap-3">
              <button
                onClick={() => setShowEditor(false)}
                className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!sponsorName}
                className="h-[44px] px-[20px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[14px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedSponsor ? 'Update Sponsor' : 'Add Sponsor'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && sponsorToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[16px] w-[480px]">
            <div className="p-[24px] border-b border-[#DBDBDB]">
              <h3 className="text-[18px] font-semibold text-[#0D0D0D]">Delete Sponsor</h3>
              <p className="text-[13px] text-[#6E6E6E] mt-1">
                Please provide a reason for deleting this sponsor
              </p>
            </div>

            <div className="p-[24px]">
              <div className="mb-4 p-[12px] bg-[#FFEBEE] rounded-[8px]">
                <p className="text-[13px] text-[#C62828]">
                  You are about to delete: <strong>{sponsorToDelete.name}</strong>
                </p>
              </div>

              <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                Reason for Deletion *
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full h-[100px] px-[12px] py-[10px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F] resize-none"
                placeholder="e.g., Partnership ended, requested by sponsor"
              />
            </div>

            <div className="p-[24px] border-t border-[#DBDBDB] flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteReason('');
                  setSponsorToDelete(null);
                }}
                className="h-[44px] px-[20px] rounded-full border border-[#DBDBDB] hover:bg-[#F3F3F3] text-[14px] font-medium text-[#3D3D3D]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={!deleteReason.trim()}
                className="h-[44px] px-[20px] rounded-full bg-[#C62828] hover:bg-[#B71C1C] text-white text-[14px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
