// lib/types.ts

// Types d'authentification
export type userLoginDto = {
  email: string;
  password: string;
};

// Types Utilisateur
export type User = {
  id: string;
  email: string;
  name: string;
  password?: string;
  roles?: UserRole[];
  createdAt: Date;
  updatedAt?: Date;
};

export type userCreateDto = {
  email: string;
  name: string;
  password: string;
  role: string[];
};

export type userUpdateDto = {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: string[];
};

// Types Rôle
export type Role = {
  id: string;
  name: string;
  description?: string;
  permissions?: RolePermission[];
  createdAt: Date;
  updatedAt: Date;
};

export type roleCreateDto = {
  name: string;
  description?: string;
  permissions: string[];
};

export type roleUpdateDto = {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
};

// Types Resource
export type Resource = {
  id: string;
  name: string;
  label: string;
  permissions?: Permission[];
  createdAt: Date;
  updatedAt: Date;
};

export type ResourceCreateDto = {
  name: string;
  label: string;
};

export type ResourceUpdateDto = {
  id: string;
  name: string;
  label: string;
};

// Types Permission
export type Permission = {
  id: string;
  name: string;
  description?: string;
  action: string;
  resourceId: string;
  resource?: Resource;
  createdAt: Date;
  updatedAt: Date;
};

export type PermissionCreateDto = {
  name: string;
  resource: string; // resourceId
  action: string;
  description?: string;
};

export type PermissionUpdateDto = {
  id: string;
  name: string;
  resource: string; // resourceId
  action: string;
  description?: string;
};

// Types de relations
export type UserRole = {
  id: string;
  userId: string;
  roleId: string;
  role?: Role;
  createdAt: Date;
};

export type RolePermission = {
  id: string;
  roleId: string;
  permissionId: string;
  permission?: Permission;
  createdAt: Date;
};

// Types divers
export type Site = {
  id: string;
  name: string;
  active: boolean;
};
