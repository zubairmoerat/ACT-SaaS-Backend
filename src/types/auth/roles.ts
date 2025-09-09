export enum RoleName {
    Admin = "Admin",
    Manager = "Manager",
    Viewer = "Viewer"
}

export type PermissionKey = 
| "company:manage"
| "user:manage"
| "compliance:create"
| "compliance:read"
| "compliance:update"
| "compliance:delete"
| "document:create"
| "document:read"
| "document:update"
| "document:delete"
| "reminder:manage";

export type PermissionsMap = Record<PermissionKey, boolean>;

export const DEFAULT_ROLE_PERMISSIONS: Record<RoleName, PermissionsMap> = {
    [RoleName.Admin]: {
        "company:manage": true,
        "user:manage": true,
        "compliance:create": true,
        "compliance:read": true,
        "compliance:update": true,
        "compliance:delete": true,
        "document:create": true,
        "document:read": true,
        "document:update": true,
        "document:delete": true,
        "reminder:manage": true
    },
    [RoleName.Manager]: {
        "company:manage": false,
        "user:manage": false,
        "compliance:create": true,
        "compliance:read": true,
        "compliance:update": true,
        "compliance:delete": true,
        "document:create": true,
        "document:read": true,
        "document:update": true,
        "document:delete": true,
        "reminder:manage": true
    },
    [RoleName.Viewer]: {
        "company:manage": false,
        "user:manage": false,
        "compliance:create": false,
        "compliance:read": true,
        "compliance:update": false,
        "compliance:delete": false,
        "document:create": false,
        "document:read": true,
        "document:update": false,
        "document:delete": false,
        "reminder:manage": false
    }
}