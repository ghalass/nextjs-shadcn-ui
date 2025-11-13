export type Site = {
  id: string;
  name: string;
  active: boolean;
};

export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  role?: string;
  active?: string;
  created_at?: string;
  updated_at?: string;
};

export type userCreateDto = {
  email: string;
  password: string;
  name: string;
  role?: string;
  active?: string;
};

export type userLoginDto = {
  email: string;
  password: string;
};
