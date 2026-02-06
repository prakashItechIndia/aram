import { useState, useEffect, useCallback } from 'react';
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
import { Reorder } from 'motion/react';
import { useApi } from '../context/ApiContext';
import { toast } from '../components/ui/toast';

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

function mapApiToSponsor(row: Record<string, unknown>): Sponsor {
  const createdAt = row.createdAt as string | undefined;
  const dateStr = createdAt ? new Date(createdAt).toISOString().slice(0, 10) : '';
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    logo: String(row.logoUrl ?? ''),
    website: String(row.websiteUrl ?? ''),
    contributionType: (row.contributionType as Sponsor['contributionType']) ?? 'Financial',
    tier: (row.tier as Sponsor['tier']) ?? 'Silver',
    displayOrder: Number(row.displayOrder ?? 0),
    active: Boolean(row.isActive !== false),
    featured: Boolean(row.featured),
    addedOn: dateStr,
    addedBy: String(row.addedBy ?? ''),
  };
}

const CONTRIBUTION_TYPES = ['Financial', 'In-kind', 'Service', 'Strategic partner'];
const TIERS = ['Platinum', 'Gold', 'Silver', 'Bronze', 'Associate'];

export function SponsorsScreen() {
  const { api, apiFetch } = useApi();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedPreviewSponsor, setSelectedPreviewSponsor] = useState<Sponsor | null>(null);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [sponsorToDelete, setSponsorToDelete] = useState<Sponsor | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Filter state - must be declared before fetchSponsors
  const [filterTier, setFilterTier] = useState('');
  const [filterContributionType, setFilterContributionType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterFeaturedOnly, setFilterFeaturedOnly] = useState(false);

  // Editor state
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorLogo, setSponsorLogo] = useState('');
  const [sponsorWebsite, setSponsorWebsite] = useState('');
  const [contributionType, setContributionType] = useState<Sponsor['contributionType']>('Financial');
  const [tier, setTier] = useState<Sponsor['tier']>('Silver');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [showOnHomepage, setShowOnHomepage] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    logo?: string;
    contributionType?: string;
    tier?: string;
  }>({});

  const fetchSponsors = useCallback(async () => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setFilterLoading(true);
      }
      setError(null);

      // Build query params
      const params = new URLSearchParams();
      if (filterTier) params.append('tier', filterTier);
      if (filterContributionType) params.append('contributionType', filterContributionType);
      if (filterStatus) params.append('status', filterStatus);
      if (filterSearch) params.append('search', filterSearch);
      if (filterFeaturedOnly) params.append('featuredOnly', 'true');

      const queryString = params.toString();
      const url = `/website/sponsors${queryString ? `?${queryString}` : ''}`;

      const res = await apiFetch(url);
      if (!res.ok) throw new Error('Failed to fetch sponsors');

      const list = await res.json();
      const mapped = Array.isArray(list) ? list.map((row: Record<string, unknown>) => mapApiToSponsor(row)) : [];
      // Sort by displayOrder
      setSponsors(mapped.sort((a, b) => a.displayOrder - b.displayOrder));

      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    } catch (e: unknown) {
      const errorMsg = (e as Error)?.message ?? 'Failed to load sponsors';
      setError(errorMsg);
      toast.error(errorMsg);
      setSponsors([]);
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  }, [apiFetch, filterTier, filterContributionType, filterStatus, filterSearch, filterFeaturedOnly, isInitialLoad]);

  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors]);

  const handleEdit = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setSponsorName(sponsor.name);
    setSponsorLogo(sponsor.logo);
    setSponsorWebsite(sponsor.website);
    setContributionType(sponsor.contributionType);
    setTier(sponsor.tier);
    setIsActive(sponsor.active);
    setIsFeatured(sponsor.featured);
    setShowOnHomepage(sponsor.featured); // Using featured as showOnHomepage
    setErrors({});
    setShowEditor(true);
  };

  const handleNew = () => {
    setSelectedSponsor(null);
    setSponsorName('');
    setSponsorLogo('');
    setSponsorWebsite('');
    setContributionType('Financial');
    setTier('Silver');
    setIsActive(true);
    setIsFeatured(false);
    setShowOnHomepage(false);
    setErrors({});
    setShowEditor(true);
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, SVG, and WebP files are allowed');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await apiFetch('/website/sponsors/upload-logo', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Upload failed');
      }

      const data = await res.json();
      setSponsorLogo(data.logoUrl);
      toast.success('Logo uploaded successfully');
    } catch (e: unknown) {
      const errorMsg = (e as Error)?.message ?? 'Failed to upload logo';
      toast.error(errorMsg);
    } finally {
      setUploading(false);
      // Reset the input so the same file can be selected again
      event.target.value = '';
    }
  };



  const validateForm = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (!sponsorName.trim()) {
      newErrors.name = 'Sponsor name is required';
      isValid = false;
    }

    if (!sponsorLogo) {
      newErrors.logo = 'Logo is required';
      isValid = false;
    }

    if (!contributionType) {
      newErrors.contributionType = 'Contribution type is required';
      isValid = false;
    }

    if (!tier) {
      newErrors.tier = 'Tier is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      // Determine displayOrder: new sponsors go to the end, existing stay the same
      const finalOrder = selectedSponsor ? selectedSponsor.displayOrder : sponsors.length;

      const body = JSON.stringify({
        name: sponsorName,
        logoUrl: sponsorLogo || undefined,
        websiteUrl: sponsorWebsite || undefined,
        contributionType,
        tier,
        displayOrder: finalOrder,
        isActive,
        featured: isFeatured,
        showOnHomepage,
        addedBy: 'Admin',
      });

      if (selectedSponsor) {
        const res = await apiFetch(`/website/sponsors/${selectedSponsor.id}`, { method: 'PATCH', body });
        if (!res.ok) throw new Error(await res.text());
        toast.success('Sponsor updated successfully');
      } else {
        const res = await apiFetch('/website/sponsors', { method: 'POST', body });
        if (!res.ok) throw new Error(await res.text());
        toast.success('Sponsor added successfully');
      }
      setShowEditor(false);
      await fetchSponsors();
    } catch (e: unknown) {
      const errorMsg = (e as Error)?.message ?? 'Failed to save sponsor';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  // ... (handlePreview, handleReorder, etc. - ensure existing code matches file context if needed, but here we just focus on replacing/inserting the modal UI part or just use replace_file_content carefully)
  // Actually, I should use replace_file_content for the modal section specifically or just insert the validation logic and update the modal using multi_replace or careful replace.
  // Let's replace the handleSave and add validateForm first, then update the modal UI in a second pass or same pass if contiguous.
  // The handleSave is at line 209.
  // The modal UI starts around line 624.
  // I will use multi_replace for cleaner edits.


  const handlePreview = (sponsor: Sponsor) => {
    setSelectedPreviewSponsor(sponsor);
    setShowPreview(true);
  };

  const handleReorder = async (newOrder: Sponsor[]) => {
    // Update local state immediately with new displayOrder values
    const updatedSponsors = newOrder.map((s, idx) => ({
      ...s,
      displayOrder: idx,
    }));
    setSponsors(updatedSponsors);

    // Sync to backend
    try {
      const items = updatedSponsors.map((s) => ({
        id: parseInt(s.id),
        displayOrder: s.displayOrder,
      }));

      const res = await apiFetch('/website/sponsors/reorder', {
        method: 'PATCH',
        body: JSON.stringify({ items }),
      });

      if (!res.ok) throw new Error(await res.text());
    } catch (e: unknown) {
      console.error('Reorder sync failed:', e);
      toast.error('Failed to save new order');
      // Optionally refetch to reset order
      fetchSponsors();
    }
  };

  const handleDelete = (sponsor: Sponsor) => {
    setSponsorToDelete(sponsor);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!sponsorToDelete) return;
    try {
      setSaving(true);
      const res = await apiFetch(`/website/sponsors/${sponsorToDelete.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());

      // Recalculate and sync orders for remaining sponsors in the current view
      // Note: This works best when not filtered, but still improves consistency
      const remainingSponsors = sponsors.filter((s: Sponsor) => s.id !== sponsorToDelete.id);
      if (remainingSponsors.length > 0) {
        const updatePayload = remainingSponsors.map((s: Sponsor, idx: number) => ({
          id: parseInt(s.id),
          displayOrder: idx
        }));

        await apiFetch('/website/sponsors/reorder', {
          method: 'PATCH',
          body: JSON.stringify({ items: updatePayload })
        });
      }

      toast.success('Sponsor deleted successfully');
      setShowDeleteModal(false);
      setDeleteReason('');
      setSponsorToDelete(null);
      await fetchSponsors();
    } catch (e: unknown) {
      const errorMsg = (e as Error)?.message ?? 'Failed to delete sponsor';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const resetFilters = () => {
    setFilterTier('');
    setFilterContributionType('');
    setFilterStatus('');
    setFilterSearch('');
    setFilterFeaturedOnly(false);
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

      {error && (
        <div className="mb-4 p-4 bg-[#FFEBEE] rounded-[12px] text-[14px] text-[#C62828]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-[14px] text-[#6E6E6E]">Loading sponsors...</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-[16px] mb-[24px]">
            <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
              <p className="text-[13px] text-[#6E6E6E] mb-1">Total Sponsors</p>
              <p className="text-[24px] font-semibold text-[#0D0D0D]">{sponsors.length}</p>
            </div>

            <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
              <p className="text-[13px] text-[#6E6E6E] mb-1">Active</p>
              <p className="text-[24px] font-semibold text-[#2E7D32]">
                {sponsors.filter((s: Sponsor) => s.active).length}
              </p>
            </div>

            <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
              <p className="text-[13px] text-[#6E6E6E] mb-1">Featured</p>
              <p className="text-[24px] font-semibold text-[#F57F17]">
                {sponsors.filter((s: Sponsor) => s.featured).length}
              </p>
            </div>

            <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px]">
              <p className="text-[13px] text-[#6E6E6E] mb-1">Platinum Tier</p>
              <p className="text-[24px] font-semibold text-[#424242]">
                {sponsors.filter((s: Sponsor) => s.tier === 'Platinum').length}
              </p>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-[16px] border border-[#DBDBDB] p-[16px] mb-[24px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-semibold text-[#0D0D0D]">Filters</h3>
                <button onClick={resetFilters} className="text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium">
                  Reset All
                </button>
              </div>

              <div className="grid grid-cols-4 gap-[16px]">
                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Tier</label>
                  <select
                    value={filterTier}
                    onChange={(e) => setFilterTier(e.target.value)}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                  >
                    <option value="">All Tiers</option>
                    {TIERS.map((tier) => (
                      <option key={tier} value={tier}>{tier}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                    Contribution Type
                  </label>
                  <select
                    value={filterContributionType}
                    onChange={(e) => setFilterContributionType(e.target.value)}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                  >
                    <option value="">All Types</option>
                    {CONTRIBUTION_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full h-[44px] px-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                  >
                    <option value="">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6E6E]" />
                    <input
                      type="text"
                      value={filterSearch}
                      onChange={(e) => setFilterSearch(e.target.value)}
                      placeholder="Sponsor name..."
                      className="w-full h-[44px] pl-[36px] pr-[12px] rounded-[12px] border border-[#DBDBDB] text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filterFeaturedOnly}
                    onChange={(e) => setFilterFeaturedOnly(e.target.checked)}
                    className="w-4 h-4 accent-[#F36A4F]"
                  />
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

            <Reorder.Group
              axis="y"
              values={sponsors}
              onReorder={handleReorder}
              className="space-y-3"
            >
              {filterLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-[#F36A4F] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[14px] text-[#6E6E6E] mt-4">Loading...</p>
                </div>
              ) : sponsors.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[14px] text-[#6E6E6E]">No sponsors found matching your filters.</p>
                  {(filterTier || filterContributionType || filterStatus || filterSearch || filterFeaturedOnly) && (
                    <button
                      onClick={resetFilters}
                      className="mt-2 text-[13px] text-[#F36A4F] hover:text-[#E55A3F] font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              ) : (
                sponsors.map((sponsor: Sponsor) => (
                  <Reorder.Item
                    key={sponsor.id}
                    value={sponsor}
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
                        <button
                          onClick={() => handlePreview(sponsor)}
                          className="flex items-center gap-1 hover:bg-[#F3F3F3] p-1 rounded-lg transition-colors"
                          title="Preview"
                        >
                          {sponsor.active ? (
                            <Eye className="w-4 h-4 text-[#2E7D32]" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-[#6E6E6E]" />
                          )}
                          <span className="text-[12px] text-[#6E6E6E]">
                            {sponsor.active ? 'Active' : 'Inactive'}
                          </span>
                        </button>
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
                  </Reorder.Item>
                )))}
            </Reorder.Group>
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
                      Logo <span className="text-[#C62828]">*</span> (Recommended: 400x400px)
                    </label>
                    <div className="flex items-center gap-4">
                      <div className={`w-24 h-24 bg-[#F8F8F8] rounded-[12px] border-2 border-dashed ${errors.logo ? 'border-[#C62828]' : 'border-[#DBDBDB]'} flex items-center justify-center`}>
                        {sponsorLogo ? (
                          <img
                            src={sponsorLogo}
                            alt="Logo preview"
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <ImageIcon className={`w-8 h-8 ${errors.logo ? 'text-[#C62828]' : 'text-[#DBDBDB]'}`} />
                        )}
                      </div>
                      <input
                        type="file"
                        id="sponsor-logo-upload"
                        accept="image/jpeg,image/png,image/svg+xml,image/webp"
                        onChange={handleLogoUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="sponsor-logo-upload"
                        className={`h-[44px] px-[20px] rounded-full border ${errors.logo ? 'border-[#C62828] text-[#C62828]' : 'border-[#DBDBDB] text-[#3D3D3D]'} ${uploading ? 'bg-[#F3F3F3] cursor-not-allowed' : 'hover:bg-[#F3F3F3] cursor-pointer'
                          } text-[14px] font-medium flex items-center gap-2`}
                      >
                        <Upload className="w-4 h-4" />
                        {uploading ? 'Uploading...' : 'Upload Logo'}
                      </label>
                      <div className="flex flex-col">
                        <p className="text-[12px] text-[#6E6E6E]">
                          JPG, PNG or SVG. Max 2MB.
                          <br />
                          Auto-resized to standard dimensions
                        </p>
                        {errors.logo && (
                          <p className="text-[12px] text-[#C62828] mt-1">{errors.logo}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sponsor Details */}
                  <div className="grid grid-cols-2 gap-[16px]">
                    <div className="col-span-2">
                      <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                        Sponsor Name <span className="text-[#C62828]">*</span>
                      </label>
                      <input
                        type="text"
                        value={sponsorName}
                        onChange={(e) => {
                          setSponsorName(e.target.value);
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        className={`w-full h-[44px] px-[12px] rounded-[12px] border ${errors.name ? 'border-[#C62828]' : 'border-[#DBDBDB]'} text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]`}
                        placeholder="e.g., TCS Foundation"
                      />
                      {errors.name && (
                        <p className="text-[12px] text-[#C62828] mt-1">{errors.name}</p>
                      )}
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
                        Contribution Type <span className="text-[#C62828]">*</span>
                      </label>
                      <select
                        value={contributionType}
                        onChange={(e) => {
                          setContributionType(e.target.value as any);
                          if (errors.contributionType) setErrors({ ...errors, contributionType: undefined });
                        }}
                        className={`w-full h-[44px] px-[12px] rounded-[12px] border ${errors.contributionType ? 'border-[#C62828]' : 'border-[#DBDBDB]'} text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]`}
                      >
                        {CONTRIBUTION_TYPES.map((type) => (
                          <option key={type}>{type}</option>
                        ))}
                      </select>
                      {errors.contributionType && (
                        <p className="text-[12px] text-[#C62828] mt-1">{errors.contributionType}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-[#3D3D3D] mb-2">
                        Sponsor Tier <span className="text-[#C62828]">*</span>
                      </label>
                      <select
                        value={tier}
                        onChange={(e) => {
                          setTier(e.target.value as any);
                          if (errors.tier) setErrors({ ...errors, tier: undefined });
                        }}
                        className={`w-full h-[44px] px-[12px] rounded-[12px] border ${errors.tier ? 'border-[#C62828]' : 'border-[#DBDBDB]'} text-[14px] text-[#3D3D3D] focus:outline-none focus:border-[#F36A4F]`}
                      >
                        {TIERS.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                      {errors.tier && (
                        <p className="text-[12px] text-[#C62828] mt-1">{errors.tier}</p>
                      )}
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
                        onChange={(e) => {
                          setIsFeatured(e.target.checked);
                          setShowOnHomepage(e.target.checked);
                        }}
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
                    disabled={!sponsorName || !sponsorLogo || !contributionType || !tier}
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
          {/* Sponsor Preview Modal */}
          {showPreview && selectedPreviewSponsor && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[24px]">
              <div className="bg-white rounded-[16px] w-full max-w-[540px]">
                <div className="p-[24px] border-b border-[#DBDBDB] flex items-center justify-between">
                  <h3 className="text-[18px] font-semibold text-[#0D0D0D]">Sponsor Preview</h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F3F3]"
                  >
                    <X className="w-5 h-5 text-[#6E6E6E]" />
                  </button>
                </div>

                <div className="p-[32px] flex flex-col items-center">
                  <div className="w-32 h-32 bg-[#F8F8F8] rounded-[24px] border border-[#DBDBDB] flex items-center justify-center mb-6 overflow-hidden">
                    {selectedPreviewSponsor.logo ? (
                      <img
                        src={selectedPreviewSponsor.logo}
                        alt={selectedPreviewSponsor.name}
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-[#DBDBDB]" />
                    )}
                  </div>

                  <h2 className="text-[24px] font-bold text-[#0D0D0D] mb-2 text-center">
                    {selectedPreviewSponsor.name}
                  </h2>

                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    <span className={`px-3 py-1 text-[12px] font-semibold rounded-full ${getTierColor(selectedPreviewSponsor.tier)}`}>
                      {selectedPreviewSponsor.tier} Tier
                    </span>
                    <span className="px-3 py-1 text-[12px] font-medium bg-[#F3F3F3] text-[#6E6E6E] rounded-full">
                      {selectedPreviewSponsor.contributionType}
                    </span>
                    {selectedPreviewSponsor.active ? (
                      <span className="px-3 py-1 text-[12px] font-medium bg-[#E8F5E9] text-[#2E7D32] rounded-full flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-[12px] font-medium bg-[#FAFAFA] text-[#6E6E6E] rounded-full flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#6E6E6E]" />
                        Inactive
                      </span>
                    )}
                  </div>

                  {selectedPreviewSponsor.website && (
                    <a
                      href={selectedPreviewSponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-[48px] bg-[#F8F8F8] hover:bg-[#F3F3F3] rounded-[12px] border border-[#DBDBDB] flex items-center justify-center gap-2 text-[14px] font-medium text-[#3D3D3D] transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      Visit Website
                    </a>
                  )}
                </div>

                {/* <div className="p-[24px] border-t border-[#DBDBDB] flex justify-center">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="h-[44px] px-[32px] rounded-full bg-[#F36A4F] hover:bg-[#E55A3F] text-white text-[14px] font-medium transition-colors"
                  >
                    Close Preview
                  </button>
                </div> */}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
