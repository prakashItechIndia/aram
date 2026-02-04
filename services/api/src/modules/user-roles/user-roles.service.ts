import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { userRoles } from '../../database/models/user-roles.model';
import { rolePermissions } from '../../database/models/role-permissions.model';
import { tUser } from '../../database/models/t-user.model';
import type { NodeMsSqlDatabase } from 'drizzle-orm/node-mssql';
import * as schema from '../../database/schema';
import { MENU_KEYS, DEFAULT_ROLES } from './constants/menu-keys';
import type { CreateRoleDto } from './dto/create-role.dto';
import type { UpdateRoleDto } from './dto/update-role.dto';
import type { UpdatePermissionsDto } from './dto/update-permissions.dto';

@Injectable()
export class UserRolesService {
  constructor(@Inject(DRIZZLE) private db: NodeMsSqlDatabase<typeof schema>) { }

  /** Count admin users (T_USER) assigned to this role (by User_Type = role name). */
  async getUserCountByRoleId(roleId: number): Promise<number> {
    const rows = await this.db.select().top(1).from(userRoles).where(eq(userRoles.id, roleId));
    const role = rows[0];
    if (!role) return 0;
    const userRows = await this.db
      .select()
      .from(tUser)
      .where(eq(tUser.userType, role.name));
    return userRows.length;
  }

  /** Count admin users with User_Type = roleName. */
  async getUserCountByRoleName(roleName: string): Promise<number> {
    const userRows = await this.db.select().from(tUser).where(eq(tUser.userType, roleName));
    return userRows.length;
  }

  async findAll() {
    let roles = await this.db.select().from(userRoles).orderBy(userRoles.id);
    if (roles.length === 0) {
      await this.ensureDefaultRoles();
      roles = await this.db.select().from(userRoles).orderBy(userRoles.id);
    }
    const result = await Promise.all(
      roles.map(async (r) => {
        const userCount = await this.getUserCountByRoleId(r.id);
        return {
          id: r.id,
          name: r.name,
          description: r.description ?? '',
          userCount,
        };
      }),
    );
    return result;
  }

  async ensureDefaultRoles() {
    const existing = await this.db.select().from(userRoles);
    if (existing.length > 0) return;
    for (const r of DEFAULT_ROLES) {
      await this.db.insert(userRoles).values({ name: r.name, description: r.description });
    }
    const inserted = await this.db.select().from(userRoles).orderBy(userRoles.id);
    for (const role of inserted) {
      await this.ensureDefaultPermissionsForRole(role.id, role.name);
    }
  }

  private async ensureDefaultPermissionsForRole(roleId: number, roleName: string) {
    const defaults: Record<string, { create: boolean; update: boolean; view: boolean; delete: boolean }> = {
      'Super Admin': { create: true, update: true, view: true, delete: true },
      Admin: { create: false, update: true, view: true, delete: false },
      'Finance Manager': { create: true, update: true, view: true, delete: false },
      Operator: { create: true, update: false, view: true, delete: false },
    };
    const perms = defaults[roleName] ?? { create: false, update: false, view: true, delete: false };
    for (const { key } of MENU_KEYS) {
      const existing = await this.db
        .select()
        .top(1)
        .from(rolePermissions)
        .where(and(eq(rolePermissions.roleId, roleId), eq(rolePermissions.permissionKey, key)));
      if (existing.length === 0) {
        await this.db.insert(rolePermissions).values({
          roleId,
          permissionKey: key,
          canCreate: perms.create,
          canUpdate: perms.update,
          canView: perms.view,
          canDelete: perms.delete,
        });
      }
    }
  }

  async findById(id: number) {
    const rows = await this.db.select().top(1).from(userRoles).where(eq(userRoles.id, id));
    const role = rows[0];
    if (!role) throw new NotFoundException(`Role #${id} not found`);
    const userCount = await this.getUserCountByRoleId(id);
    return { ...role, userCount };
  }

  async create(dto: CreateRoleDto) {
    const name = (dto.name || '').trim();
    if (!name) throw new BadRequestException('Role name is required');
    const existing = await this.db.select().top(1).from(userRoles).where(eq(userRoles.name, name));
    if (existing.length > 0) throw new BadRequestException(`Role "${name}" already exists`);
    await this.db.insert(userRoles).values({ name, description: dto.description?.trim() ?? null });
    const rows = await this.db.select().from(userRoles).where(eq(userRoles.name, name));
    const role = rows[0];
    if (!role) throw new NotFoundException('Role not found after create');
    await this.ensureDefaultPermissionsForRole(role.id, role.name);
    return this.findById(role.id);
  }

  async update(id: number, dto: UpdateRoleDto) {
    const role = await this.findById(id);
    const userCount = role.userCount as number;
    // const allowedRoles = ['Super Admin', 'Admin', 'Finance Manager', 'Operator'];
    // if (userCount > 0 && !allowedRoles.includes(role.name)) {
    //   throw new BadRequestException(
    //     `This role is assigned to ${userCount} user(s). Reassign or remove those users before editing the role.`,
    //   );
    // }
    const name = dto.name?.trim();
    if (name) {
      const existing = await this.db.select().top(1).from(userRoles).where(eq(userRoles.name, name));
      if (existing.length > 0 && existing[0].id !== id) {
        throw new BadRequestException(`Role "${name}" already exists`);
      }
      await this.db.update(userRoles).set({ name, description: dto.description?.trim() ?? undefined }).where(eq(userRoles.id, id));
    } else if (dto.description !== undefined) {
      await this.db.update(userRoles).set({ description: dto.description?.trim() ?? null }).where(eq(userRoles.id, id));
    }
    return this.findById(id);
  }

  async delete(id: number) {
    const role = await this.findById(id);
    const userCount = role.userCount as number;
    // const allowedRoles = ['Admin', 'Finance Manager', 'Operator'];
    // if (userCount > 0 && !allowedRoles.includes(role.name)) {
    //   throw new BadRequestException(
    //     `This role is assigned to ${userCount} user(s). Reassign or remove those users before deleting the role.`,
    //   );
    // }
    await this.db.delete(rolePermissions).where(eq(rolePermissions.roleId, id));
    await this.db.delete(userRoles).where(eq(userRoles.id, id));
    return { success: true };
  }

  async getPermissions(roleId: number) {
    await this.findById(roleId);
    const perms = await this.db.select().from(rolePermissions).where(eq(rolePermissions.roleId, roleId));
    const byKey = Object.fromEntries(perms.map((p) => [p.permissionKey, p]));
    const result = MENU_KEYS.map(({ key, label }) => ({
      menu: label,
      permissionKey: key,
      create: byKey[key]?.canCreate ?? false,
      update: byKey[key]?.canUpdate ?? false,
      view: byKey[key]?.canView ?? true,
      delete: byKey[key]?.canDelete ?? false,
    }));
    return result;
  }

  async updatePermissions(roleId: number, dto: UpdatePermissionsDto) {
    const role = await this.findById(roleId);
    const userCount = role.userCount as number;
    // const allowedRoles = ['Super Admin', 'Admin', 'Finance Manager', 'Operator'];
    // if (userCount > 0 && !allowedRoles.includes(role.name)) {
    //   throw new BadRequestException(
    //     `This role is assigned to ${userCount} user(s). Reassign or remove those users before editing permissions.`,
    //   );
    // }
    for (const item of dto.permissions) {
      const existing = await this.db
        .select()
        .top(1)
        .from(rolePermissions)
        .where(and(eq(rolePermissions.roleId, roleId), eq(rolePermissions.permissionKey, item.permissionKey)));
      if (existing.length > 0) {
        await this.db
          .update(rolePermissions)
          .set({
            canCreate: item.canCreate,
            canUpdate: item.canUpdate,
            canView: item.canView,
            canDelete: item.canDelete,
            updatedAt: new Date(),
          })
          .where(eq(rolePermissions.id, existing[0].id));
      } else {
        await this.db.insert(rolePermissions).values({
          roleId,
          permissionKey: item.permissionKey,
          canCreate: item.canCreate,
          canUpdate: item.canUpdate,
          canView: item.canView,
          canDelete: item.canDelete,
        });
      }
    }
    return this.getPermissions(roleId);
  }

  getMenuKeys() {
    return MENU_KEYS;
  }
}
