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
export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  roles?: UserRole[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  role?: Role;
  createdAt: Date;
}

export interface userCreateDto {
  email: string;
  name: string;
  password: string;
  role: string[];
}

export interface userUpdateDto {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: string[];
}

// Ajouter ces types à votre fichier lib/types.ts existant

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  permission?: Permission;
  createdAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: RolePermission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface roleCreateDto {
  name: string;
  description?: string;
  permissions: string[];
}

export interface roleUpdateDto {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
}
