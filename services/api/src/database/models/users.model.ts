/**
 * DEPRECATED: 'users' table is NOT created. Auth and user identity use T_USER.
 * See t-user.model.ts. This file is kept only for reference; use tUser / T_USER for all user operations.
 * Tables that need a "user" FK (audit_log, refund_requests, etc.) reference T_USER(Id).
 */
export { tUser as users, type TUser as User, type NewTUser as NewUser } from './t-user.model';
