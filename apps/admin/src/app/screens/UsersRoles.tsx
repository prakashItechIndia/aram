import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Check, Filter } from 'lucide-react';
import { toast } from '../components/ui/toast';
import { useApi } from '../context/ApiContext';

interface Permission {
  menu: string;
  permissionKey: string;
  create: boolean;
  update: boolean;
  view: boolean;
  delete: boolean;
}

interface Role {
  id: number;
  name: string;
  description: string;
  userCount: number;
  permissions?: Permission[];
}

export function UsersRoles() {
  const { apiFetch } = useApi();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [addName, setAddName] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [showEditPermissions, setShowEditPermissions] = useState(false);
  const [editPermissions, setEditPermissions] = useState<Permission[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; description?: string }>({});
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Pagination & Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);
  const [filterSearch, setFilterSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const fetchRoles = useCallback(async (page: number = 1, search: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search.trim() ? { search: search.trim() } : {}),
      });
      const res = await apiFetch(`/user-roles?${query.toString()}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to load roles');
      }
      const data = await res.json();
      setRoles(data.items || []);
      setTotalItems(data.total || 0);
      setCurrentPage(data.page || 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load roles');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, [apiFetch, limit]);

  const fetchPermissions = useCallback(
    async (roleId: string) => {
      if (!roleId) return [];
      try {
        const res = await apiFetch(`/user-roles/${roleId}/permissions`);
        if (!res.ok) {
          setPermissions([]);
          return [];
        }
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setPermissions(list);
        return list;
      } catch {
        setPermissions([]);
        return [];
      }
    },
    [apiFetch],
  );

  useEffect(() => {
    fetchRoles(currentPage, appliedSearch);
  }, [fetchRoles, currentPage, appliedSearch]);


  const handleSaveRole = async () => {
    const name = addName.trim();
    const description = addDescription.trim();
    const errors: { name?: string; description?: string } = {};

    if (!name) errors.name = 'Role name is required';
    if (!description) errors.description = 'Description is required';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const hasAnyPermission = displayPermissions.some(
      (p: Permission) => p.create || p.update || p.view || p.delete,
    );

    if (!hasAnyPermission) {
      setError('Please select at least one permission');
      // Scroll to permissions section or error message if needed
      return;
    }

    setSaving(true);
    setError(null);
    setFieldErrors({});
    try {
      const isEditing = !!editingRole;
      const url = isEditing ? `/user-roles/${editingRole!.id}` : '/user-roles';
      const method = isEditing ? 'PUT' : 'POST';

      // Save role details
      const res = await apiFetch(url, {
        method,
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed to ${isEditing ? 'update' : 'create'} role`);

      const roleId = isEditing ? editingRole!.id : data.id;

      // Save permissions
      const permissionsPayload = {
        permissions: displayPermissions.map((p: Permission) => ({
          permissionKey: p.permissionKey,
          canCreate: p.create,
          canUpdate: p.update,
          canView: p.view,
          canDelete: p.delete,
        })),
      };

      const permRes = await apiFetch(`/user-roles/${roleId}/permissions`, {
        method: 'PUT',
        body: JSON.stringify(permissionsPayload),
      });

      if (!permRes.ok) {
        const permData = await permRes.json().catch(() => ({}));
        throw new Error(permData?.message || 'Failed to update permissions');
      }

      toast.success(`Role ${isEditing ? 'updated' : 'created'} successfully`);
      setView('list');
      fetchRoles(currentPage, appliedSearch);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save role');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRole = (role: Role) => {
    setRoleToDelete(role);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;

    // Check if role has users assigned
    if ((roleToDelete.userCount || 0) > 0) {
      const isPlural = roleToDelete.userCount !== 1;
      toast.error(`${roleToDelete.userCount} user${isPlural ? 's are' : ' is'} mapped to this role so you can't delete it`);
      setShowDeleteModal(false);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await apiFetch(`/user-roles/${roleToDelete.id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Failed to delete role');
      toast.success('Role deleted successfully');
      setShowDeleteModal(false);
      setRoleToDelete(null);
      fetchRoles(currentPage, appliedSearch);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete role');
    } finally {
      setSaving(false);
    }
  };

  const openAdd = async () => {
    setEditingRole(null);
    setAddName('');
    setAddDescription('');
    setFieldErrors({});
    setError(null);

    let basePerms: Permission[] = [];
    try {
      if (roles.length > 0) {
        basePerms = await fetchPermissions(String(roles[0].id));
      } else {
        const res = await apiFetch('/user-roles/menu-keys');
        if (res.ok) {
          const keys = await res.json();
          basePerms = (Array.isArray(keys) ? keys : []).map((k: any) => ({
            menu: k.label,
            permissionKey: k.key,
            create: false,
            update: false,
            view: false,
            delete: false
          }));
        }
      }
    } catch (e) {
      console.error('Failed to fetch initial permissions:', e);
    }

    // For a new role, we want all permissions to be false initially
    const newPerms = basePerms.map(p => ({
      ...p,
      create: false,
      update: false,
      view: false,
      delete: false
    }));

    setEditPermissions(newPerms);
    setShowEditPermissions(true);
    setView('editor');
  };

  const handleEditRole = async (role: Role) => {
    setEditingRole(role);
    setAddName(role.name);
    setAddDescription(role.description);
    setFieldErrors({});
    setError(null);
    let perms = await fetchPermissions(String(role.id));

    // Fallback if no permissions are returned for an existing role
    if (perms.length === 0) {
      try {
        const res = await apiFetch('/user-roles/menu-keys');
        if (res.ok) {
          const keys = await res.json();
          perms = (Array.isArray(keys) ? keys : []).map((k: any) => ({
            menu: k.label,
            permissionKey: k.key,
            create: false,
            update: false,
            view: false,
            delete: false
          }));
        }
      } catch (e) {
        console.error('Failed to fetch menu keys fallback:', e);
      }
    }

    setEditPermissions(JSON.parse(JSON.stringify(perms)));
    setShowEditPermissions(true);
    setView('editor');
  };

  const applyFilters = () => {
    setAppliedSearch(filterSearch);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilterSearch('');
    setAppliedSearch('');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / limit);

  const closeEditor = () => {
    setView('list');
    setEditingRole(null);
    setAddName('');
    setAddDescription('');
    setFieldErrors({});
    setError(null);
    setShowEditPermissions(false);
  };


  const togglePermission = (index: number, field: 'create' | 'update' | 'view' | 'delete') => {
    setError(null); // Clear permissions error when user starts toggling
    setEditPermissions((prev: Permission[]) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: !next[index][field] };
      return next;
    });
  };

  const displayPermissions = showEditPermissions ? editPermissions : permissions;

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold text-[#0D0D0D] mb-[4px]">
            Roles
          </h1>
          <p className="text-[14px] leading-[20px] text-[#6E6E6E]">
            {view === 'list'
              ? 'Manage user roles and permissions'
              : editingRole
                ? `Editing ${editingRole.name}`
                : 'Add New Role'}
          </p>
        </div>
        {view === 'list' && (
          <button
            onClick={openAdd}
            className="h-[44px] px-[20px] bg-[#F36A4F] text-white rounded-[999px] flex items-center gap-2 hover:bg-[#E55A3F] transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="text-[16px] leading-[24px] font-medium">Add New Role</span>
          </button>
        )}
      </div>

      {view === 'list' && (
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
            <div className="flex-1 min-w-[300px]">
              <label className="block text-[12px] font-medium text-[#6E6E6E] mb-1">Search Role</label>
              <input
                type="text"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                placeholder="Search by role name..."
                className="w-full h-[40px] px-[12px] border border-[#DBDBDB] rounded-[8px] text-[14px] text-[#0D0D0D] bg-white focus:outline-none focus:border-[#F36A4F]"
              />
            </div>
            <button
              type="button"
              onClick={applyFilters}
              className="h-[40px] px-[20px] bg-[#F36A4F] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#E55A3F] transition-colors"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-[12px] bg-[#FEF1EE] border border-[#F36A4F] text-[#734F48] text-[14px] flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="underline">
            Dismiss
          </button>
        </div>
      )}

      {loading && view === 'list' ? (
        <div className="text-[14px] text-[#6E6E6E]">Loading roles...</div>
      ) : view === 'list' ? (
        <div className="bg-white border border-[#DBDBDB] rounded-[16px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#DBDBDB]">
                  <th className="text-left px-[24px] py-[16px] text-[12px] leading-[16px] font-semibold text-[#6E6E6E] uppercase tracking-wide">
                    User Role
                  </th>
                  <th className="text-left px-[24px] py-[16px] text-[12px] leading-[16px] font-semibold text-[#6E6E6E] uppercase tracking-wide">
                    Description
                  </th>
                  <th className="text-left px-[24px] py-[16px] text-[12px] leading-[16px] font-semibold text-[#6E6E6E] uppercase tracking-wide">
                    Users
                  </th>
                  <th className="text-right px-[24px] py-[16px] text-[12px] leading-[16px] font-semibold text-[#6E6E6E] uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role: Role) => (
                  <tr
                    key={role.id}
                    className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA] transition-colors"
                  >
                    <td className="px-[24px] py-[16px]">
                      <span className="text-[14px] leading-[20px] font-medium text-[#0D0D0D]">
                        {role.name}
                      </span>
                    </td>
                    <td className="px-[24px] py-[16px]">
                      <span className="text-[14px] leading-[20px] text-[#6E6E6E]">
                        {role.description || '—'}
                      </span>
                    </td>
                    <td className="px-[24px] py-[16px]">
                      <div className="px-[12px] py-[4px] bg-[#F3F3F3] rounded-[999px] inline-block">
                        <span className="text-[12px] leading-[16px] font-medium text-[#3D3D3D]">
                          {role.userCount} {role.userCount === 1 ? 'User' : 'Users'}
                        </span>
                      </div>
                    </td>
                    <td className="px-[24px] py-[16px]">
                      <div className="flex items-center justify-end gap-[12px]">
                        <button
                          onClick={() => handleEditRole(role)}
                          className="p-1 hover:bg-[#F3F3F3] rounded-full transition-colors"
                          title="Edit Role"
                        >
                          <Edit2 className="w-5 h-5 text-[#6E6E6E]" />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role)}
                          className="p-1 hover:bg-[#FEF1EE] rounded-full transition-colors"
                          title="Delete Role"
                        >
                          <Trash2 className="w-5 h-5 text-[#6E6E6E] hover:text-[#F36A4F]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="px-[24px] py-[16px] border-t border-[#DBDBDB] bg-[#FAFAFA] flex items-center justify-between flex-wrap gap-4">
              <div className="text-[14px] text-[#6E6E6E]">
                Showing {Math.min((currentPage - 1) * limit + 1, totalItems)} to{' '}
                {Math.min(currentPage * limit, totalItems)} of {totalItems} roles
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1 || loading}
                  className="h-[40px] px-[16px] border border-[#DBDBDB] rounded-[8px] text-[14px] font-medium text-[#3D3D3D] bg-white hover:bg-[#F3F3F3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 text-[14px] text-[#3D3D3D]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages || loading}
                  className="h-[40px] px-[16px] border border-[#DBDBDB] rounded-[8px] text-[14px] font-medium text-[#3D3D3D] bg-white hover:bg-[#F3F3F3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-[24px]">
          <div className="bg-white border border-[#DBDBDB] rounded-[16px] p-[24px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">
                  Role Name <span className="text-[#F36A4F]">*</span>
                </label>
                <input
                  type="text"
                  value={addName}
                  onChange={(e) => {
                    setAddName(e.target.value);
                    if (e.target.value) setFieldErrors((prev: typeof fieldErrors) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Enter role name"
                  className={`w-full h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 ${fieldErrors.name ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'}`}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-[12px] text-[#F36A4F]">{fieldErrors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">
                  Description <span className="text-[#F36A4F]">*</span>
                </label>
                <textarea
                  value={addDescription}
                  maxLength={150}
                  onChange={(e) => {
                    setAddDescription(e.target.value);
                    if (e.target.value)
                      setFieldErrors((prev: typeof fieldErrors) => ({ ...prev, description: undefined }));
                  }}
                  placeholder="Enter role description"
                  rows={1}
                  className={`w-full h-[44px] px-[16px] py-[10px] text-[16px] leading-[24px] bg-white border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 resize-none ${fieldErrors.description ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'}`}
                />
                <div className="flex justify-between mt-1">
                  {fieldErrors.description ? (
                    <p className="text-[12px] text-[#F36A4F]">{fieldErrors.description}</p>
                  ) : (
                    <div />
                  )}
                  <p
                    className={`text-[12px] ${addDescription.length >= 150 ? 'text-[#F36A4F]' : 'text-[#6E6E6E]'}`}
                  >
                    {addDescription.length}/150
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#DBDBDB] rounded-[16px] overflow-hidden">
            <div className="px-[24px] py-[16px] border-b border-[#DBDBDB]">
              <h2 className="text-[18px] leading-[24px] font-semibold text-[#0D0D0D]">
                Permissions
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#FAFAFA] border-b border-[#DBDBDB]">
                    <th className="text-left px-[24px] py-[12px] text-[12px] leading-[16px] font-semibold text-[#6E6E6E] uppercase tracking-wide w-[40%]">
                      Menu
                    </th>
                    <th className="text-center px-[24px] py-[12px] text-[12px] leading-[16px] font-semibold text-[#6E6E6E] uppercase tracking-wide w-[15%]">
                      Create
                    </th>
                    <th className="text-center px-[24px] py-[12px] text-[12px] leading-[16px] font-semibold text-[#6E6E6E] uppercase tracking-wide w-[15%]">
                      Update
                    </th>
                    <th className="text-center px-[24px] py-[12px] text-[12px] leading-[16px] font-semibold text-[#6E6E6E] uppercase tracking-wide w-[15%]">
                      View
                    </th>
                    <th className="text-center px-[24px] py-[12px] text-[12px] leading-[16px] font-semibold text-[#6E6E6E] uppercase tracking-wide w-[15%]">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayPermissions.map((permission: Permission, index: number) => (
                    <tr
                      key={permission.permissionKey || index}
                      className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA] transition-colors"
                    >
                      <td className="px-[24px] py-[16px]">
                        <span className="text-[14px] leading-[20px] text-[#0D0D0D]">
                          {permission.menu}
                        </span>
                      </td>
                      {(['create', 'update', 'view', 'delete'] as const).map((field) => (
                        <td key={field} className="px-[24px] py-[16px]">
                          <div className="flex justify-center">
                            <button
                              type="button"
                              onClick={() => togglePermission(index, field)}
                              className={`w-[20px] h-[20px] rounded-[4px] flex items-center justify-center ${permission[field] ? 'bg-[#F36A4F]' : 'bg-[#F3F3F3] border border-[#DBDBDB]'}`}
                            >
                              {permission[field] && (
                                <Check className="w-[12px] h-[12px] text-white" />
                              )}
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-end gap-[12px]">
            <button
              onClick={closeEditor}
              className="h-[44px] px-[24px] border border-[#DBDBDB] rounded-[999px] text-[16px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3]"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveRole}
              disabled={saving}
              className="h-[44px] px-[32px] bg-[#F36A4F] text-white rounded-[999px] text-[16px] font-medium hover:bg-[#E55A3F] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && roleToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[24px]">
          <div className="bg-white rounded-[16px] w-full max-w-[440px] shadow-lg">
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#DBDBDB]">
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#0D0D0D]">
                Delete Role
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-[#F3F3F3] transition-colors"
              >
                <X className="w-5 h-5 text-[#6E6E6E]" />
              </button>
            </div>
            <div className="px-[24px] py-[24px]">
              <p className="text-[14px] leading-[20px] text-[#3D3D3D] mb-[16px]">
                Are you sure you want to delete the role{" "}
                <span className="font-semibold">{roleToDelete.name}</span>? This action cannot be
                undone.
              </p>

              {((roleToDelete.userCount ?? 0) > 0 ||
                ['Admin', 'Finance Manager', 'Operator'].includes(roleToDelete.name)) && (
                  <div className="bg-[#FEF1EE] border border-[#F36A4F] rounded-[8px] px-[16px] py-[12px]">
                    <p className="text-[12px] leading-[16px] text-[#734F48]">
                      <strong>{roleToDelete.userCount}</strong> user
                      {roleToDelete.userCount !== 1 ? 's are' : ' is'} currently assigned to this
                      role. They will need to be reassigned before deletion.
                    </p>
                  </div>
                )}
            </div>
            <div className="flex items-center justify-end gap-[12px] px-[24px] py-[20px] border-t border-[#DBDBDB]">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="h-[44px] px-[20px] border border-[#DBDBDB] rounded-[999px] text-[16px] leading-[24px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={saving}
                className="h-[44px] px-[20px] bg-[#F36A4F] text-white rounded-[999px] text-[16px] leading-[24px] font-medium hover:bg-[#E55A3F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
