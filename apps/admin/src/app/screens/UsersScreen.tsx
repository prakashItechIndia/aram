import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useApi } from '../context/ApiContext';

interface User {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  roleName: string;
  isActive: boolean;
  createdDate?: string;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formRoleName, setFormRoleName] = useState('');

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
      const res = await apiFetch('/admin-users');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to load users');
      }
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openAdd = () => {
    setFormName('');
    setFormEmail('');
    setFormMobile('');
    setFormRoleName(roles[0]?.name ?? '');
    setSelectedUser(null);
    setShowAddModal(true);
  };

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormMobile(user.mobileNumber || '');
    setFormRoleName(user.roleName || '');
    setShowEditModal(true);
  };

  const openDelete = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleCreate = async () => {
    if (!formName.trim() || !formEmail.trim() || !formRoleName.trim()) {
      setError('User name, email and role are required');
      return;
    }
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
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Failed to create user');
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
    if (!formName.trim() || !formEmail.trim() || !formRoleName.trim()) {
      setError('User name, email and role are required');
      return;
    }
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
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Failed to update user');
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
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[16px] w-full max-w-[500px] mx-[24px]">
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#DBDBDB]">
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#0D0D0D]">Add User</h3>
              <button onClick={() => setShowAddModal(false)} className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-[#F3F3F3]">
                <X className="w-5 h-5 text-[#6E6E6E]" />
              </button>
            </div>
            <div className="px-[24px] py-[24px] flex flex-col gap-[16px]">
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">User name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Enter user name"
                  className="w-full h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                />
              </div>
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">Email ID</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                />
              </div>
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">Mobile number</label>
                <input
                  type="tel"
                  value={formMobile}
                  onChange={(e) => setFormMobile(e.target.value)}
                  placeholder="Enter mobile number"
                  className="w-full h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                />
              </div>
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">Role</label>
                <select
                  value={formRoleName}
                  onChange={(e) => setFormRoleName(e.target.value)}
                  className="w-full h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[16px] w-full max-w-[500px] mx-[24px]">
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#DBDBDB]">
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#0D0D0D]">Edit User</h3>
              <button onClick={() => setShowEditModal(false)} className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-[#F3F3F3]">
                <X className="w-5 h-5 text-[#6E6E6E]" />
              </button>
            </div>
            <div className="px-[24px] py-[24px] flex flex-col gap-[16px]">
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">User name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Enter user name"
                  className="w-full h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                />
              </div>
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">Email ID</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                />
              </div>
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">Mobile number</label>
                <input
                  type="tel"
                  value={formMobile}
                  onChange={(e) => setFormMobile(e.target.value)}
                  placeholder="Enter mobile number"
                  className="w-full h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                />
              </div>
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">Role</label>
                <select
                  value={formRoleName}
                  onChange={(e) => setFormRoleName(e.target.value)}
                  className="w-full h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[16px] w-full max-w-[440px] mx-[24px]">
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
