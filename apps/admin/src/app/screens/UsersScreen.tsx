import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Edit2, Trash2, X, Upload, User as UserIcon, Filter } from 'lucide-react';
import { useApi } from '../context/ApiContext';

const DATE_RANGES = [
  { value: 'all', label: 'All Time' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'thisMonth', label: 'This Month' },
] as const;

function getDateRangeBounds(value: string): { dateFrom?: string; dateTo?: string } {
  const now = new Date();
  if (value === 'thisWeek') {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return { dateFrom: d.toISOString().slice(0, 10), dateTo: now.toISOString().slice(0, 10) };
  }
  if (value === 'thisMonth') {
    const d = new Date(now.getFullYear(), now.getMonth(), 1);
    return { dateFrom: d.toISOString().slice(0, 10), dateTo: now.toISOString().slice(0, 10) };
  }
  return {};
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^\+?[\d\s-]{10,15}$/;

interface User {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  roleName: string;
  isActive: boolean;
  createdDate?: string;
  profileImageUrl?: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  userCount: number;
}

export function UsersScreen() {
  const { apiFetch } = useApi();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterDateRange, setFilterDateRange] = useState<string>('all');
  const [appliedRole, setAppliedRole] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedDateRange, setAppliedDateRange] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formRoleName, setFormRoleName] = useState('');
  const [formProfileImageUrl, setFormProfileImageUrl] = useState<string>('');
  const [formProfilePreview, setFormProfilePreview] = useState<string | null>(null); // local file preview
  const [uploadingImage, setUploadingImage] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; mobile?: string; role?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await apiFetch('/user-roles');
      if (!res.ok) throw new Error('Failed to load roles');
      const data = await res.json();
      setRoles(Array.isArray(data) ? data : []);
    } catch {
      setRoles([]);
    }
  }, [apiFetch]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (appliedRole.trim()) params.set('role', appliedRole.trim());
      if (appliedSearch.trim()) params.set('search', appliedSearch.trim());
      const { dateFrom, dateTo } = getDateRangeBounds(appliedDateRange);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      const query = params.toString();
      const res = await apiFetch(`/admin-users${query ? `?${query}` : ''}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to load users');
      }
      const data = await res.json();
      const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
      const totalCount = typeof data?.total === 'number' ? data.total : items.length;
      setUsers(items);
      setTotal(totalCount);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [apiFetch, page, limit, appliedRole, appliedSearch, appliedDateRange]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const validateForm = (): boolean => {
    const err: typeof fieldErrors = {};
    if (!formName.trim()) err.name = 'User name is required';
    if (!formEmail.trim()) err.email = 'Email is required';
    else if (!EMAIL_REGEX.test(formEmail.trim())) err.email = 'Please enter a valid email address';
    if (formMobile.trim() && !MOBILE_REGEX.test(formMobile.trim())) err.mobile = 'Please enter a valid mobile number (10–15 digits, optional +)';
    if (!formRoleName.trim()) err.role = 'Role is required';
    setFieldErrors(err);
    return Object.keys(err).length === 0;
  };

  const openAdd = () => {
    setFormName('');
    setFormEmail('');
    setFormMobile('');
    setFormRoleName(roles[0]?.name ?? '');
    setFormProfileImageUrl('');
    setFormProfilePreview(null);
    setFieldErrors({});
    setSelectedUser(null);
    setShowAddModal(true);
  };

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormMobile(user.mobileNumber || '');
    setFormRoleName(user.roleName || '');
    setFormProfileImageUrl(user.profileImageUrl || '');
    setFormProfilePreview(null);
    setFieldErrors({});
    setShowEditModal(true);
  };

  const handleProfileFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setError('Only JPG, PNG, and WebP images are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be 5MB or smaller');
      return;
    }
    setUploadingImage(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiFetch('/admin-users/upload-profile-image', { method: 'POST', body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Upload failed');
      const url = data?.url;
      if (url) {
        setFormProfileImageUrl(url);
        setFormProfilePreview(URL.createObjectURL(file));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearProfileImage = () => {
    setFormProfileImageUrl('');
    if (formProfilePreview) URL.revokeObjectURL(formProfilePreview);
    setFormProfilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openDelete = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await apiFetch('/admin-users', {
        method: 'POST',
        body: JSON.stringify({
          name: formName.trim(),
          email: formEmail.trim().toLowerCase(),
          mobileNumber: formMobile.trim() || undefined,
          roleName: formRoleName.trim(),
          profileImageUrl: formProfileImageUrl || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(Array.isArray(data?.message) ? data.message.join(' ') : data?.message || 'Failed to create user');
      setShowAddModal(false);
      fetchUsers();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    if (!validateForm()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await apiFetch(`/admin-users/${selectedUser.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: formName.trim(),
          email: formEmail.trim().toLowerCase(),
          mobileNumber: formMobile.trim() || undefined,
          roleName: formRoleName.trim(),
          profileImageUrl: formProfileImageUrl || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(Array.isArray(data?.message) ? data.message.join(' ') : data?.message || 'Failed to update user');
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setSaving(true);
    setError(null);
    try {
      const res = await apiFetch(`/admin-users/${selectedUser.id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Failed to delete user');
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete user');
    } finally {
      setSaving(false);
    }
  };

  const applyFilters = () => {
    setAppliedRole(filterRole);
    setAppliedSearch(filterSearch);
    setAppliedDateRange(filterDateRange);
    setPage(1);
  };

  const resetFilters = () => {
    setFilterRole('');
    setFilterSearch('');
    setFilterDateRange('all');
    setAppliedRole('');
    setAppliedSearch('');
    setAppliedDateRange('all');
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold text-[#0D0D0D] mb-[4px]">
            Users
          </h1>
          <p className="text-[14px] leading-[20px] text-[#6E6E6E]">
            Manage admin users and their roles
          </p>
        </div>
        <button
          onClick={openAdd}
          className="h-[44px] px-[20px] bg-[#F36A4F] text-white rounded-[999px] flex items-center gap-2 hover:bg-[#E55A3F] transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[16px] leading-[24px] font-medium">Add</span>
        </button>
      </div>

      {/* Filter section */}
      <div className="bg-white border border-[#DBDBDB] rounded-[16px] p-[24px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[14px] font-semibold text-[#0D0D0D]">
            <Filter className="w-4 h-4 text-[#6E6E6E]" />
            Filters
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="text-[13px] font-medium text-[#F36A4F] hover:text-[#E55A3F]"
          >
            Reset All
          </button>
        </div>
        <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-[12px] font-medium text-[#6E6E6E] mb-1">Role</label>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="h-[44px] px-[12px] min-w-[140px] border border-[#DBDBDB] rounded-[12px] text-[14px] text-[#0D0D0D] bg-white focus:outline-none focus:border-[#F36A4F]"
          >
            <option value="">All Roles</option>
            {roles.map((r) => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-medium text-[#6E6E6E] mb-1">Date Range</label>
          <select
            value={filterDateRange}
            onChange={(e) => setFilterDateRange(e.target.value)}
            className="h-[44px] px-[12px] min-w-[140px] border border-[#DBDBDB] rounded-[12px] text-[14px] text-[#0D0D0D] bg-white focus:outline-none focus:border-[#F36A4F]"
          >
            {DATE_RANGES.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-medium text-[#6E6E6E] mb-1">Search</label>
          <input
            type="text"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            placeholder="Name or email..."
            className="h-[44px] px-[12px] min-w-[200px] border border-[#DBDBDB] rounded-[12px] text-[14px] text-[#0D0D0D] bg-white focus:outline-none focus:border-[#F36A4F]"
          />
        </div>
        <button
          type="button"
          onClick={applyFilters}
          className="h-[44px] px-[20px] bg-[#F36A4F] text-white rounded-[12px] text-[14px] font-medium hover:bg-[#E55A3F] transition-colors"
        >
          Apply Filters
        </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-[12px] bg-[#FEF1EE] border border-[#F36A4F] text-[#734F48] text-[14px] flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-white border border-[#DBDBDB] rounded-[16px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#DBDBDB]">
                <th className="text-left px-[24px] py-[12px] text-[12px] leading-[16px] font-semibold text-[#6E6E6E] uppercase tracking-wide">
                  User name
                </th>
                <th className="text-left px-[24px] py-[12px] text-[12px] leading-[16px] font-semibold text-[#6E6E6E] uppercase tracking-wide">
                  Email ID
                </th>
                <th className="text-left px-[24px] py-[12px] text-[12px] leading-[16px] font-semibold text-[#6E6E6E] uppercase tracking-wide">
                  Mobile number
                </th>
                <th className="text-left px-[24px] py-[12px] text-[12px] leading-[16px] font-semibold text-[#6E6E6E] uppercase tracking-wide">
                  Role
                </th>
                <th className="text-right px-[24px] py-[12px] text-[12px] leading-[16px] font-semibold text-[#6E6E6E] uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-[24px] py-[24px] text-center text-[14px] text-[#6E6E6E]">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-[24px] py-[24px] text-center text-[14px] text-[#6E6E6E]">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-[24px] py-[16px] text-[14px] leading-[20px] text-[#0D0D0D]">
                      {user.name}
                    </td>
                    <td className="px-[24px] py-[16px] text-[14px] leading-[20px] text-[#0D0D0D]">
                      {user.email}
                    </td>
                    <td className="px-[24px] py-[16px] text-[14px] leading-[20px] text-[#3D3D3D]">
                      {user.mobileNumber || '—'}
                    </td>
                    <td className="px-[24px] py-[16px] text-[14px] leading-[20px] text-[#3D3D3D]">
                      {user.roleName}
                    </td>
                    <td className="px-[24px] py-[16px] text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(user)}
                          className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-[#F3F3F3] transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-[#6E6E6E]" />
                        </button>
                        <button
                          onClick={() => openDelete(user)}
                          className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-[#FEF1EE] hover:border-[#F36A4F] transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-[#6E6E6E]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-[24px] py-[16px] border-t border-[#DBDBDB] flex items-center justify-between flex-wrap gap-4">
          <div className="text-[14px] text-[#6E6E6E]">
            Showing {startItem}–{endItem} of {total} users
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="h-[40px] px-[16px] border border-[#DBDBDB] rounded-[8px] text-[14px] font-medium text-[#3D3D3D] bg-white hover:bg-[#F3F3F3] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 text-[14px] text-[#3D3D3D]">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="h-[40px] px-[16px] border border-[#DBDBDB] rounded-[8px] text-[14px] font-medium text-[#3D3D3D] bg-white hover:bg-[#F3F3F3] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[24px]">
          <div className="bg-white rounded-[16px] w-full max-w-[500px] shadow-lg">
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#DBDBDB]">
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#0D0D0D]">Add User</h3>
              <button onClick={() => setShowAddModal(false)} className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-[#F3F3F3]">
                <X className="w-5 h-5 text-[#6E6E6E]" />
              </button>
            </div>
            <div className="px-[24px] py-[24px] flex flex-col gap-[16px]">
              {/* Profile image upload */}
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">Profile image</label>
                <div className="flex items-center gap-[16px]">
                  <div className="w-[80px] h-[80px] rounded-full bg-[#F3F3F3] border border-[#DBDBDB] overflow-hidden flex items-center justify-center shrink-0">
                    {formProfilePreview || formProfileImageUrl ? (
                      <img src={formProfilePreview || formProfileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-10 h-10 text-[#6E6E6E]" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleProfileFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="h-[36px] px-[16px] border border-[#DBDBDB] rounded-[8px] text-[14px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      {uploadingImage ? 'Uploading...' : 'Upload'}
                    </button>
                    {(formProfileImageUrl || formProfilePreview) && (
                      <button type="button" onClick={clearProfileImage} className="text-[14px] text-[#6E6E6E] hover:text-[#F36A4F]">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">User name <span className="text-[#F36A4F]">*</span></label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => { setFormName(e.target.value); setFieldErrors((prev) => ({ ...prev, name: undefined })); }}
                  placeholder="Enter user name"
                  className={`w-full h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 ${fieldErrors.name ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'}`}
                />
                {fieldErrors.name && <p className="mt-[6px] text-[12px] leading-[16px] text-[#F36A4F]">{fieldErrors.name}</p>}
              </div>
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">Email ID <span className="text-[#F36A4F]">*</span></label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => { setFormEmail(e.target.value); setFieldErrors((prev) => ({ ...prev, email: undefined })); }}
                  placeholder="Enter email"
                  className={`w-full h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 ${fieldErrors.email ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'}`}
                />
                {fieldErrors.email && <p className="mt-[6px] text-[12px] leading-[16px] text-[#F36A4F]">{fieldErrors.email}</p>}
              </div>
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">Mobile number</label>
                <input
                  type="tel"
                  value={formMobile}
                  onChange={(e) => { setFormMobile(e.target.value); setFieldErrors((prev) => ({ ...prev, mobile: undefined })); }}
                  placeholder="Enter mobile number (optional)"
                  className={`w-full h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 ${fieldErrors.mobile ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'}`}
                />
                {fieldErrors.mobile && <p className="mt-[6px] text-[12px] leading-[16px] text-[#F36A4F]">{fieldErrors.mobile}</p>}
              </div>
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">Role <span className="text-[#F36A4F]">*</span></label>
                <select
                  value={formRoleName}
                  onChange={(e) => { setFormRoleName(e.target.value); setFieldErrors((prev) => ({ ...prev, role: undefined })); }}
                  className={`w-full h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 ${fieldErrors.role ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'}`}
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
                {fieldErrors.role && <p className="mt-[6px] text-[12px] leading-[16px] text-[#F36A4F]">{fieldErrors.role}</p>}
              </div>
            </div>
            <div className="flex items-center justify-end gap-[12px] px-[24px] py-[20px] border-t border-[#DBDBDB]">
              <button onClick={() => setShowAddModal(false)} className="h-[44px] px-[20px] border border-[#DBDBDB] rounded-[999px] text-[16px] leading-[24px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors">
                Cancel
              </button>
              <button onClick={handleCreate} disabled={saving} className="h-[44px] px-[20px] bg-[#F36A4F] text-white rounded-[999px] text-[16px] leading-[24px] font-medium hover:bg-[#E55A3F] transition-colors disabled:opacity-50">
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[24px]">
          <div className="bg-white rounded-[16px] w-full max-w-[500px] shadow-lg">
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#DBDBDB]">
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#0D0D0D]">Edit User</h3>
              <button onClick={() => setShowEditModal(false)} className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-[#F3F3F3]">
                <X className="w-5 h-5 text-[#6E6E6E]" />
              </button>
            </div>
            <div className="px-[24px] py-[24px] flex flex-col gap-[16px]">
              {/* Profile image upload */}
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">Profile image</label>
                <div className="flex items-center gap-[16px]">
                  <div className="w-[80px] h-[80px] rounded-full bg-[#F3F3F3] border border-[#DBDBDB] overflow-hidden flex items-center justify-center shrink-0">
                    {formProfilePreview || formProfileImageUrl ? (
                      <img src={formProfilePreview || formProfileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-10 h-10 text-[#6E6E6E]" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleProfileFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="h-[36px] px-[16px] border border-[#DBDBDB] rounded-[8px] text-[14px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      {uploadingImage ? 'Uploading...' : 'Upload'}
                    </button>
                    {(formProfileImageUrl || formProfilePreview) && (
                      <button type="button" onClick={clearProfileImage} className="text-[14px] text-[#6E6E6E] hover:text-[#F36A4F]">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">User name <span className="text-[#F36A4F]">*</span></label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => { setFormName(e.target.value); setFieldErrors((prev) => ({ ...prev, name: undefined })); }}
                  placeholder="Enter user name"
                  className={`w-full h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 ${fieldErrors.name ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'}`}
                />
                {fieldErrors.name && <p className="mt-[6px] text-[12px] leading-[16px] text-[#F36A4F]">{fieldErrors.name}</p>}
              </div>
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">Email ID <span className="text-[#F36A4F]">*</span></label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => { setFormEmail(e.target.value); setFieldErrors((prev) => ({ ...prev, email: undefined })); }}
                  placeholder="Enter email"
                  className={`w-full h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 ${fieldErrors.email ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'}`}
                />
                {fieldErrors.email && <p className="mt-[6px] text-[12px] leading-[16px] text-[#F36A4F]">{fieldErrors.email}</p>}
              </div>
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">Mobile number</label>
                <input
                  type="tel"
                  value={formMobile}
                  onChange={(e) => { setFormMobile(e.target.value); setFieldErrors((prev) => ({ ...prev, mobile: undefined })); }}
                  placeholder="Enter mobile number (optional)"
                  className={`w-full h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 ${fieldErrors.mobile ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'}`}
                />
                {fieldErrors.mobile && <p className="mt-[6px] text-[12px] leading-[16px] text-[#F36A4F]">{fieldErrors.mobile}</p>}
              </div>
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">Role <span className="text-[#F36A4F]">*</span></label>
                <select
                  value={formRoleName}
                  onChange={(e) => { setFormRoleName(e.target.value); setFieldErrors((prev) => ({ ...prev, role: undefined })); }}
                  className={`w-full h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 ${fieldErrors.role ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'}`}
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
                {fieldErrors.role && <p className="mt-[6px] text-[12px] leading-[16px] text-[#F36A4F]">{fieldErrors.role}</p>}
              </div>
            </div>
            <div className="flex items-center justify-end gap-[12px] px-[24px] py-[20px] border-t border-[#DBDBDB]">
              <button onClick={() => setShowEditModal(false)} className="h-[44px] px-[20px] border border-[#DBDBDB] rounded-[999px] text-[16px] leading-[24px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors">
                Cancel
              </button>
              <button onClick={handleUpdate} disabled={saving} className="h-[44px] px-[20px] bg-[#F36A4F] text-white rounded-[999px] text-[16px] leading-[24px] font-medium hover:bg-[#E55A3F] transition-colors disabled:opacity-50">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[24px]">
          <div className="bg-white rounded-[16px] w-full max-w-[440px] shadow-lg">
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#DBDBDB]">
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#0D0D0D]">Delete User</h3>
              <button onClick={() => setShowDeleteModal(false)} className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-[#F3F3F3]">
                <X className="w-5 h-5 text-[#6E6E6E]" />
              </button>
            </div>
            <div className="px-[24px] py-[24px]">
              <p className="text-[14px] leading-[20px] text-[#3D3D3D] mb-[16px]">
                Are you sure you want to delete the user &quot;{selectedUser.name}&quot;? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-[12px] px-[24px] py-[20px] border-t border-[#DBDBDB]">
              <button onClick={() => setShowDeleteModal(false)} className="h-[44px] px-[20px] border border-[#DBDBDB] rounded-[999px] text-[16px] leading-[24px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={saving} className="h-[44px] px-[20px] bg-[#F36A4F] text-white rounded-[999px] text-[16px] leading-[24px] font-medium hover:bg-[#E55A3F] transition-colors disabled:opacity-50">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
