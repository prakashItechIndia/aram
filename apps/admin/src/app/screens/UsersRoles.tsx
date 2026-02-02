import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Check } from 'lucide-react';

interface Permission {
  menu: string;
  create: boolean;
  update: boolean;
  view: boolean;
  delete: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: Permission[];
}

export function UsersRoles() {
  const [selectedRole, setSelectedRole] = useState<string>('super-admin');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock roles data
  const roles: Role[] = [
    {
      id: 'super-admin',
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      userCount: 2,
      permissions: [
        { menu: 'Dashboard', create: true, update: true, view: true, delete: true },
        { menu: 'Donations', create: true, update: true, view: true, delete: true },
        { menu: 'Transactions', create: true, update: true, view: true, delete: true },
        { menu: 'Donors', create: true, update: true, view: true, delete: true },
        { menu: 'Reports', create: true, update: true, view: true, delete: true },
        { menu: 'User Management', create: true, update: true, view: true, delete: true },
        { menu: 'Settings', create: true, update: true, view: true, delete: true },
      ],
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'Administrative access with limited restrictions',
      userCount: 5,
      permissions: [
        { menu: 'Dashboard', create: false, update: false, view: true, delete: false },
        { menu: 'Donations', create: true, update: true, view: true, delete: false },
        { menu: 'Transactions', create: true, update: true, view: true, delete: false },
        { menu: 'Donors', create: true, update: true, view: true, delete: false },
        { menu: 'Reports', create: false, update: false, view: true, delete: false },
        { menu: 'User Management', create: true, update: true, view: true, delete: false },
        { menu: 'Settings', create: false, update: true, view: true, delete: false },
      ],
    },
    {
      id: 'finance-manager',
      name: 'Finance Manager',
      description: 'Financial operations and reporting access',
      userCount: 3,
      permissions: [
        { menu: 'Dashboard', create: false, update: false, view: true, delete: false },
        { menu: 'Donations', create: true, update: true, view: true, delete: false },
        { menu: 'Transactions', create: true, update: true, view: true, delete: false },
        { menu: 'Donors', create: false, update: false, view: true, delete: false },
        { menu: 'Reports', create: true, update: false, view: true, delete: false },
        { menu: 'User Management', create: false, update: false, view: false, delete: false },
        { menu: 'Settings', create: false, update: false, view: true, delete: false },
      ],
    },
    {
      id: 'operator',
      name: 'Operator',
      description: 'Basic operational access for daily tasks',
      userCount: 8,
      permissions: [
        { menu: 'Dashboard', create: false, update: false, view: true, delete: false },
        { menu: 'Donations', create: true, update: false, view: true, delete: false },
        { menu: 'Transactions', create: false, update: false, view: true, delete: false },
        { menu: 'Donors', create: true, update: false, view: true, delete: false },
        { menu: 'Reports', create: false, update: false, view: true, delete: false },
        { menu: 'User Management', create: false, update: false, view: false, delete: false },
        { menu: 'Settings', create: false, update: false, view: false, delete: false },
      ],
    },
  ];

  const selectedRoleData = roles.find((r) => r.id === selectedRole);

  const handleDeleteRole = (role: Role) => {
    setRoleToDelete(role);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Handle delete logic here
    setShowDeleteModal(false);
    setRoleToDelete(null);
  };

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold text-[#0D0D0D] mb-[4px]">
            Users & Roles
          </h1>
          <p className="text-[14px] leading-[20px] text-[#6E6E6E]">
            Manage user roles and permissions
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="h-[44px] px-[20px] bg-[#F36A4F] text-white rounded-[999px] flex items-center gap-2 hover:bg-[#E55A3F] transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[16px] leading-[24px] font-medium">Add New Role</span>
        </button>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-4 gap-[16px]">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className={`bg-white border rounded-[16px] p-[20px] text-left transition-all ${
              selectedRole === role.id
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
              {selectedRole === role.id && (
                <div className="w-[20px] h-[20px] bg-[#F36A4F] rounded-full flex items-center justify-center">
                  <Check className="w-[12px] h-[12px] text-white" />
                </div>
              )}
            </div>
            <h3 className="text-[16px] leading-[24px] font-semibold text-[#0D0D0D] mb-[4px]">
              {role.name}
            </h3>
            <p className="text-[12px] leading-[16px] text-[#6E6E6E] mb-[12px]">
              {role.description}
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

      {/* Permissions Table */}
      {selectedRoleData && (
        <div className="bg-white border border-[#DBDBDB] rounded-[16px] overflow-hidden">
          {/* Table Header */}
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
              <button
                className="h-[40px] px-[16px] border border-[#DBDBDB] rounded-[999px] flex items-center gap-2 hover:bg-[#F3F3F3] transition-colors"
              >
                <Edit2 className="w-4 h-4 text-[#6E6E6E]" />
                <span className="text-[14px] leading-[20px] font-medium text-[#3D3D3D]">
                  Edit Permissions
                </span>
              </button>
              {selectedRoleData.id !== 'super-admin' && (
                <button
                  onClick={() => handleDeleteRole(selectedRoleData)}
                  className="h-[40px] px-[16px] border border-[#DBDBDB] rounded-[999px] flex items-center gap-2 hover:bg-[#FEF1EE] hover:border-[#F36A4F] transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-[#6E6E6E]" />
                  <span className="text-[14px] leading-[20px] font-medium text-[#3D3D3D]">
                    Delete Role
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Table Content */}
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
                {selectedRoleData.permissions.map((permission, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA] transition-colors"
                  >
                    <td className="px-[24px] py-[16px]">
                      <span className="text-[14px] leading-[20px] text-[#0D0D0D]">
                        {permission.menu}
                      </span>
                    </td>
                    <td className="px-[24px] py-[16px]">
                      <div className="flex justify-center">
                        <div
                          className={`w-[20px] h-[20px] rounded-[4px] flex items-center justify-center ${
                            permission.create
                              ? 'bg-[#F36A4F]'
                              : 'bg-[#F3F3F3] border border-[#DBDBDB]'
                          }`}
                        >
                          {permission.create && (
                            <Check className="w-[12px] h-[12px] text-white" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-[24px] py-[16px]">
                      <div className="flex justify-center">
                        <div
                          className={`w-[20px] h-[20px] rounded-[4px] flex items-center justify-center ${
                            permission.update
                              ? 'bg-[#F36A4F]'
                              : 'bg-[#F3F3F3] border border-[#DBDBDB]'
                          }`}
                        >
                          {permission.update && (
                            <Check className="w-[12px] h-[12px] text-white" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-[24px] py-[16px]">
                      <div className="flex justify-center">
                        <div
                          className={`w-[20px] h-[20px] rounded-[4px] flex items-center justify-center ${
                            permission.view
                              ? 'bg-[#F36A4F]'
                              : 'bg-[#F3F3F3] border border-[#DBDBDB]'
                          }`}
                        >
                          {permission.view && (
                            <Check className="w-[12px] h-[12px] text-white" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-[24px] py-[16px]">
                      <div className="flex justify-center">
                        <div
                          className={`w-[20px] h-[20px] rounded-[4px] flex items-center justify-center ${
                            permission.delete
                              ? 'bg-[#F36A4F]'
                              : 'bg-[#F3F3F3] border border-[#DBDBDB]'
                          }`}
                        >
                          {permission.delete && (
                            <Check className="w-[12px] h-[12px] text-white" />
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[16px] w-full max-w-[500px] mx-[24px]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#DBDBDB]">
              <h3 className="text-[18px] leading-[24px] font-semibold text-[#0D0D0D]">
                Add New Role
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-[#F3F3F3] transition-colors"
              >
                <X className="w-5 h-5 text-[#6E6E6E]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-[24px] py-[24px]">
              <div className="flex flex-col gap-[16px]">
                <div>
                  <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">
                    Role Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter role name"
                    className="w-full h-[44px] px-[16px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20"
                  />
                </div>
                <div>
                  <label className="block text-[14px] leading-[20px] font-medium text-[#3D3D3D] mb-[8px]">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter role description"
                    rows={3}
                    className="w-full px-[16px] py-[12px] text-[16px] leading-[24px] bg-white border border-[#DBDBDB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#F36A4F] focus:ring-opacity-20 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-[12px] px-[24px] py-[20px] border-t border-[#DBDBDB]">
              <button
                onClick={() => setShowAddModal(false)}
                className="h-[44px] px-[20px] border border-[#DBDBDB] rounded-[999px] text-[16px] leading-[24px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="h-[44px] px-[20px] bg-[#F36A4F] text-white rounded-[999px] text-[16px] leading-[24px] font-medium hover:bg-[#E55A3F] transition-colors"
              >
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && roleToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[16px] w-full max-w-[440px] mx-[24px]">
            {/* Modal Header */}
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

            {/* Modal Body */}
            <div className="px-[24px] py-[24px]">
              <p className="text-[14px] leading-[20px] text-[#3D3D3D] mb-[16px]">
                Are you sure you want to delete the role "{roleToDelete.name}"? This action
                cannot be undone.
              </p>
              <div className="bg-[#FEF1EE] border border-[#F36A4F] rounded-[8px] px-[16px] py-[12px]">
                <p className="text-[12px] leading-[16px] text-[#734F48]">
                  <strong>{roleToDelete.userCount}</strong> user
                  {roleToDelete.userCount !== 1 ? 's are' : ' is'} currently assigned to this
                  role. They will need to be reassigned before deletion.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-[12px] px-[24px] py-[20px] border-t border-[#DBDBDB]">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="h-[44px] px-[20px] border border-[#DBDBDB] rounded-[999px] text-[16px] leading-[24px] font-medium text-[#3D3D3D] hover:bg-[#F3F3F3] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="h-[44px] px-[20px] bg-[#F36A4F] text-white rounded-[999px] text-[16px] leading-[24px] font-medium hover:bg-[#E55A3F] transition-colors"
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
