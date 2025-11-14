export type Site = {
  id: string;
  name: string;
  active: boolean;
};

export type userLoginDto = {
  email: string;
  password: string;
};

// lib/types.ts
export type User = {
  id: string;
  email: string;
  name: string;
  password?: string;
  roles?: UserRole[];
  createdAt: Date;
  updatedAt: Date;
};

export type Role = {
  id: string;
  name: string;
  description?: string;
  permissions?: RolePermission[];
  createdAt: Date;
  updatedAt: Date;
};

export type UserRole = {
  id: string;
  userId: string;
  roleId: string;
  role?: Role;
  createdAt: Date;
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

// Ajouter ces types à votre fichier lib/types.ts existant

export type Permission = {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type RolePermission = {
  id: string;
  roleId: string;
  permissionId: string;
  permission?: Permission;
  createdAt: Date;
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
