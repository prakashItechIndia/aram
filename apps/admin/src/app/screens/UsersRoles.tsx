import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
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
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [addName, setAddName] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [showEditPermissions, setShowEditPermissions] = useState(false);
  const [editPermissions, setEditPermissions] = useState<Permission[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; description?: string }>({});

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/user-roles');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to load roles');
      }
      const data = await res.json();
      const list: Role[] = Array.isArray(data) ? data : [];
      setRoles(list);
      if (list.length > 0 && !selectedRole) setSelectedRole(String(list[0].id));
      if (list.length > 0 && selectedRole && !list.some((r) => String(r.id) === selectedRole)) {
        setSelectedRole(String(list[0].id));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load roles');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, [apiFetch, selectedRole]);

  const fetchPermissions = useCallback(
    async (roleId: string) => {
      if (!roleId) return;
      try {
        const res = await apiFetch(`/user-roles/${roleId}/permissions`);
        if (!res.ok) return setPermissions([]);
        const data = await res.json();
        setPermissions(Array.isArray(data) ? data : []);
      } catch {
        setPermissions([]);
      }
    },
    [apiFetch],
  );

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (selectedRole) fetchPermissions(selectedRole);
    else setPermissions([]);
  }, [selectedRole, fetchPermissions]);

  const selectedRoleData = roles.find((r) => String(r.id) === selectedRole);

  const handleCreateRole = async () => {
    const name = addName.trim();
    const description = addDescription.trim();
    const errors: { name?: string; description?: string } = {};

    if (!name) errors.name = 'Role name is required';
    if (!description) errors.description = 'Description is required';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true);
    setError(null);
    setFieldErrors({});
    try {
      const res = await apiFetch('/user-roles', {
        method: 'POST',
        body: JSON.stringify({ name, description: addDescription.trim() || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Failed to create role');
      closeAdd();
      fetchRoles();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create role');
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
    setSaving(true);
    setError(null);
    try {
      const res = await apiFetch(`/user-roles/${roleToDelete.id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Failed to delete role');
      setShowDeleteModal(false);
      setRoleToDelete(null);
      fetchRoles();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete role');
    } finally {
      setSaving(false);
    }
  };

  const openAdd = () => {
    setAddName('');
    setAddDescription('');
    setFieldErrors({});
    setError(null);
    setShowAddModal(true);
  };

  const closeAdd = () => {
    setShowAddModal(false);
    setAddName('');
    setAddDescription('');
    setFieldErrors({});
    setError(null);
  };

  const openEditPermissions = () => {
    setEditPermissions(JSON.parse(JSON.stringify(permissions)));
    setShowEditPermissions(true);
  };

  const savePermissions = async () => {
    if (!selectedRole) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        permissions: editPermissions.map((p) => ({
          permissionKey: p.permissionKey,
          canCreate: p.create,
          canUpdate: p.update,
          canView: p.view,
          canDelete: p.delete,
        })),
      };
      const res = await apiFetch(`/user-roles/${selectedRole}/permissions`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Failed to update permissions');
      setShowEditPermissions(false);
      fetchPermissions(selectedRole);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update permissions');
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (index: number, field: 'create' | 'update' | 'view' | 'delete') => {
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
            Manage user roles and permissions
          </p>
        </div>
        <button
          onClick={openAdd}
          className="h-[44px] px-[20px] bg-[#F36A4F] text-white rounded-[999px] flex items-center gap-2 hover:bg-[#E55A3F] transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[16px] leading-[24px] font-medium">Add New Role</span>
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

      {loading ? (
        <div className="text-[14px] text-[#6E6E6E]">Loading roles...</div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-[16px]">
            {roles.map((role: Role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(String(role.id))}
                className={`bg-white border rounded-[16px] p-[20px] text-left transition-all ${selectedRole === String(role.id)
                  ? 'border-[#F36A4F] shadow-[0_0_0_3px_rgba(243,106,79,0.1)]'
                  : 'border-[#DBDBDB] hover:border-[#F36A4F]'
                  }`}
              >
                <div className="flex items-start justify-between mb-[12px]">
                  <div className="w-[40px] h-[40px] bg-[#FEF1EE] rounded-full flex items-center justify-center">
                    <span className="text-[16px] font-semibold text-[#F36A4F]">
                      {role.name.charAt(0)}
                    </span>
                  </div>
                  {selectedRole === String(role.id) && (
                    <div className="w-[20px] h-[20px] bg-[#F36A4F] rounded-full flex items-center justify-center">
                      <Check className="w-[12px] h-[12px] text-white" />
                    </div>
                  )}
                </div>
                <h3 className="text-[16px] leading-[24px] font-semibold text-[#0D0D0D] mb-[4px]">
                  {role.name}
                </h3>
                <p className="text-[12px] leading-[16px] text-[#6E6E6E] mb-[12px]">
                  {role.description || '—'}
                </p>
                <div className="flex items-center gap-[8px]">
                  <div className="px-[12px] py-[4px] bg-[#F3F3F3] rounded-[999px]">
                    <span className="text-[12px] leading-[16px] font-medium text-[#3D3D3D]">
                      {role.userCount} {role.userCount === 1 ? 'User' : 'Users'}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {selectedRoleData && (
            <div className="bg-white border border-[#DBDBDB] rounded-[16px] overflow-hidden">
              <div className="flex items-center justify-between px-[24px] py-[16px] border-b border-[#DBDBDB]">
                <div>
                  <h2 className="text-[18px] leading-[24px] font-semibold text-[#0D0D0D] mb-[4px]">
                    {selectedRoleData.name} Permissions
                  </h2>
                  <p className="text-[14px] leading-[20px] text-[#6E6E6E]">
                    Configure access permissions for this role
                  </p>
                </div>
                <div className="flex items-center gap-[12px]">
                  {!showEditPermissions ? (
                    <button
                      onClick={openEditPermissions}
                      disabled={false}
                      className="h-[40px] px-[16px] border border-[#DBDBDB] rounded-[999px] flex items-center gap-2 hover:bg-[#F3F3F3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Edit Permissions"
                    >
                      <Edit2 className="w-4 h-4 text-[#6E6E6E]" />
                      <span className="text-[14px] leading-[20px] font-medium text-[#3D3D3D]">
                        Edit Permissions
                      </span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowEditPermissions(false)}
                        className="h-[40px] px-[16px] border border-[#DBDBDB] rounded-[999px] text-[14px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={savePermissions}
                        disabled={saving}
                        className="h-[40px] px-[16px] bg-[#F36A4F] text-white rounded-[999px] text-[14px] font-medium hover:bg-[#E55A3F] disabled:opacity-50"
                      >
                        Save
                      </button>
                    </>
                  )}
                  {selectedRoleData.name !== 'Super Admin' && (
                    <button
                      onClick={() => handleDeleteRole(selectedRoleData)}
                      // disabled={(selectedRoleData.userCount ?? 0) > 0}
                      disabled={selectedRoleData.name === 'Super Admin'}
                      className="h-[40px] px-[16px] border border-[#DBDBDB] rounded-[999px] flex items-center gap-2 hover:bg-[#FEF1EE] hover:border-[#F36A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={
                        selectedRoleData.name === 'Super Admin'
                          ? 'Super Admin role cannot be deleted'
                          : 'Delete Role'
                      }
                    >
                      <Trash2 className="w-4 h-4 text-[#6E6E6E]" />
                      <span className="text-[14px] leading-[20px] font-medium text-[#3D3D3D]">
                        Delete Role
                      </span>
                    </button>
                  )}
                </div>
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
                        <td className="px-[24px] py-[16px]">
                          <div className="flex justify-center">
                            {showEditPermissions ? (
                              <button
                                type="button"
                                onClick={() => togglePermission(index, 'create')}
                                className={`w-[20px] h-[20px] rounded-[4px] flex items-center justify-center ${permission.create ? 'bg-[#F36A4F]' : 'bg-[#F3F3F3] border border-[#DBDBDB]'
                                  }`}
                              >
                                {permission.create && <Check className="w-[12px] h-[12px] text-white" />}
                              </button>
                            ) : (
                              <div
                                className={`w-[20px] h-[20px] rounded-[4px] flex items-center justify-center ${permission.create ? 'bg-[#F36A4F]' : 'bg-[#F3F3F3] border border-[#DBDBDB]'
                                  }`}
                              >
                                {permission.create && <Check className="w-[12px] h-[12px] text-white" />}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-[24px] py-[16px]">
                          <div className="flex justify-center">
                            {showEditPermissions ? (
                              <button
                                type="button"
                                onClick={() => togglePermission(index, 'update')}
                                className={`w-[20px] h-[20px] rounded-[4px] flex items-center justify-center ${permission.update ? 'bg-[#F36A4F]' : 'bg-[#F3F3F3] border border-[#DBDBDB]'
                                  }`}
                              >
                                {permission.update && <Check className="w-[12px] h-[12px] text-white" />}
                              </button>
                            ) : (
                              <div
                                className={`w-[20px] h-[20px] rounded-[4px] flex items-center justify-center ${permission.update ? 'bg-[#F36A4F]' : 'bg-[#F3F3F3] border border-[#DBDBDB]'
                                  }`}
                              >
                                {permission.update && <Check className="w-[12px] h-[12px] text-white" />}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-[24px] py-[16px]">
                          <div className="flex justify-center">
                            {showEditPermissions ? (
                              <button
                                type="button"
                                onClick={() => togglePermission(index, 'view')}
                                className={`w-[20px] h-[20px] rounded-[4px] flex items-center justify-center ${permission.view ? 'bg-[#F36A4F]' : 'bg-[#F3F3F3] border border-[#DBDBDB]'
                                  }`}
                              >
                                {permission.view && <Check className="w-[12px] h-[12px] text-white" />}
                              </button>
                            ) : (
                              <div
                                className={`w-[20px] h-[20px] rounded-[4px] flex items-center justify-center ${permission.view ? 'bg-[#F36A4F]' : 'bg-[#F3F3F3] border border-[#DBDBDB]'
                                  }`}
                              >
                                {permission.view && <Check className="w-[12px] h-[12px] text-white" />}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-[24px] py-[16px]">
                          <div className="flex justify-center">
                            {showEditPermissions ? (
                              <button
                                type="button"
                                onClick={() => togglePermission(index, 'delete')}
                                className={`w-[20px] h-[20px] rounded-[4px] flex items-center justify-center ${permission.delete ? 'bg-[#F36A4F]' : 'bg-[#F3F3F3] border border-[#DBDBDB]'
                                  }`}
                              >
                                {permission.delete && <Check className="w-[12px] h-[12px] text-white" />}
                              </button>
                            ) : (
                              <div
                                className={`w-[20px] h-[20px] rounded-[4px] flex items-center justify-center ${permission.delete ? 'bg-[#F36A4F]' : 'bg-[#F3F3F3] border border-[#DBDBDB]'
                                  }`}
                              >
                                {permission.delete && <Check className="w-[12px] h-[12px] text-white" />}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[24px]">
          <div className="bg-white rounded-[16px] w-full max-w-[500px] shadow-lg">
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#DBDBDB]">
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#0D0D0D]">
                Add New Role
              </h3>
              <button
                onClick={closeAdd}
                className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-[#F3F3F3] transition-colors"
              >
                <X className="w-5 h-5 text-[#6E6E6E]" />
              </button>
            </div>
            <div className="px-[24px] py-[24px]">
              <div className="flex flex-col gap-[16px]">
                <div>
                  <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">
                    Role Name <span className="text-[#F36A4F]">*</span>
                  </label>
                  <input
                    type="text"
                    value={addName}
                    onChange={(e) => {
                      setAddName(e.target.value);
                      if (e.target.value) setFieldErrors((prev: { name?: string; description?: string }) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Enter role name"
                    className={`w-full h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 ${fieldErrors.name ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'
                      }`}
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
                      if (e.target.value) setFieldErrors((prev: { name?: string; description?: string }) => ({ ...prev, description: undefined }));
                    }}
                    placeholder="Enter role description"
                    rows={3}
                    className={`w-full px-[16px] py-[12px] text-[16px] leading-[24px] bg-white border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 resize-none ${fieldErrors.description ? 'border-[#F36A4F]' : 'border-[#DBDBDB]'
                      }`}
                  />
                  <div className="flex justify-between mt-1">
                    {fieldErrors.description ? (
                      <p className="text-[12px] text-[#F36A4F]">{fieldErrors.description}</p>
                    ) : (
                      <div />
                    )}
                    <p className={`text-[12px] ${addDescription.length >= 150 ? 'text-[#F36A4F]' : 'text-[#6E6E6E]'}`}>
                      {addDescription.length}/150
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-[12px] px-[24px] py-[20px] border-t border-[#DBDBDB]">
              <button
                onClick={closeAdd}
                className="h-[44px] px-[20px] border border-[#DBDBDB] rounded-[999px] text-[16px] leading-[24px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRole}
                disabled={saving}
                className="h-[44px] px-[20px] bg-[#F36A4F] text-white rounded-[999px] text-[16px] leading-[24px] font-medium hover:bg-[#E55A3F] transition-colors disabled:opacity-50"
              >
                Create Role
              </button>
            </div>
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
                Are you sure you want to delete the role &quot;{roleToDelete.name}&quot;? This action
                cannot be undone.
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
