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

// Types Site
export type Site = {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

// Types Parc et Engins
export interface Typeparc {
  id: string;
  name: string;
  parcs?: Parc[];
  createdAt: string;
  updatedAt: string;
}

export interface Parc {
  id: string;
  name: string;
  typeparcId: string;
  typeparc: Typeparc;
  engins: Engin[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    engins: number;
  };
}

export interface Engin {
  id: string;
  name: string;
  active: boolean;
  parcId: string;
  siteId: string;
  initialHeureChassis?: number;
  parc: Parc;
  site: Site;
  createdAt: string;
  updatedAt: string;
  _count?: {
    pannes: number;
    saisiehrms: number;
    saisiehim: number;
  };
}

// TYPES POUR LA GESTION DES PANNES

export interface TypePanne {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OriginePanne {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NiveauUrgence {
  id: string;
  name: string;
  description?: string;
  level: number;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatutIntervention {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Panne {
  id: string;
  code?: string;
  description: string;
  dateApparition: string;
  dateExecution?: string;
  dateCloture?: string;
  observations?: string;
  tempsArret?: number;
  coutEstime?: number;
  typepanneId: string;
  originePanneId: string;
  niveauUrgenceId: string;
  enginId: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  typepanne?: TypePanne;
  originePanne?: OriginePanne;
  niveauUrgence?: NiveauUrgence;
  engin?: Engin;
  interventions?: Intervention[];
  piecesDemandees?: PieceDemandee[];
  saisiehim?: Saisiehim[];
}

export interface PanneCreateDto {
  description: string;
  dateApparition: string;
  dateExecution?: string;
  dateCloture?: string;
  observations?: string;
  tempsArret?: number;
  coutEstime?: number;
  typepanneId: string;
  originePanneId: string;
  niveauUrgenceId: string;
  enginId: string;
}

export interface PanneUpdateDto {
  id: string;
  description?: string;
  dateApparition?: string;
  dateExecution?: string;
  dateCloture?: string;
  observations?: string;
  tempsArret?: number;
  coutEstime?: number;
  typepanneId?: string;
  originePanneId?: string;
  niveauUrgenceId?: string;
  enginId?: string;
}

// TYPES POUR LES INTERVENTIONS

export interface Intervention {
  id: string;
  dateDebut: string;
  dateFin?: string;
  descriptionTravaux: string;
  tempsPasse?: number;
  observations?: string;
  panneId: string;
  technicienId: string;
  siteId: string;
  statutInterventionId: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  panne?: Panne;
  technicien?: User;
  site?: Site;
  statutIntervention?: StatutIntervention;
  piecesUtilisees?: PieceUtilisee[];
}

export interface InterventionCreateDto {
  dateDebut: string;
  dateFin?: string;
  descriptionTravaux: string;
  tempsPasse?: number;
  observations?: string;
  panneId: string;
  technicienId: string;
  siteId: string;
  statutInterventionId: string;
}

export interface InterventionUpdateDto {
  id: string;
  dateDebut?: string;
  dateFin?: string;
  descriptionTravaux?: string;
  tempsPasse?: number;
  observations?: string;
  technicienId?: string;
  siteId?: string;
  statutInterventionId?: string;
}

// TYPES POUR LES PIÈCES DE RECHANGE

export interface CategoriePiece {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  pieces?: Piece[];
}

export interface Piece {
  id: string;
  reference: string;
  designation: string;
  prixUnitaire?: number;
  stockActuel: number;
  stockMinimum: number;
  fournisseur?: string;
  categoriePieceId: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  categoriePiece?: CategoriePiece;
  piecesDemandees?: PieceDemandee[];
  piecesUtilisees?: PieceUtilisee[];
}

export interface PieceCreateDto {
  reference: string;
  designation: string;
  prixUnitaire?: number;
  stockActuel?: number;
  stockMinimum?: number;
  fournisseur?: string;
  categoriePieceId: string;
}

export interface PieceUpdateDto {
  id: string;
  reference?: string;
  designation?: string;
  prixUnitaire?: number;
  stockActuel?: number;
  stockMinimum?: number;
  fournisseur?: string;
  categoriePieceId?: string;
}

export interface PieceDemandee {
  id: string;
  quantite: number;
  prix?: number;
  observations?: string;
  panneId: string;
  pieceId: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  panne?: Panne;
  piece?: Piece;
}

export interface PieceDemandeeCreateDto {
  quantite: number;
  prix?: number;
  observations?: string;
  panneId: string;
  pieceId: string;
}

export interface PieceUtilisee {
  id: string;
  quantite: number;
  prix?: number;
  interventionId: string;
  pieceId: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  intervention?: Intervention;
  piece?: Piece;
}

export interface PieceUtiliseeCreateDto {
  quantite: number;
  prix?: number;
  interventionId: string;
  pieceId: string;
}

// TYPES POUR LES SAISIES (EXISTANTS)

export interface Saisiehrm {
  id: string;
  du: string;
  enginId: string;
  siteId: string;
  hrm: number;
  createdAt: string;
  updatedAt: string;

  // Relations
  engin?: Engin;
  site?: Site;
  saisiehim?: Saisiehim[];
}

export interface Saisiehim {
  id: string;
  panneId: string;
  him: number;
  ni: number;
  saisiehrmId: string;
  enginId?: string;
  obs?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  panne?: Panne;
  saisiehrm?: Saisiehrm;
  engin?: Engin;
  saisielubrifiants?: Saisielubrifiant[];
}

export interface Typelubrifiant {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  lubrifiants?: Lubrifiant[];
}

export interface Lubrifiant {
  id: string;
  name: string;
  typelubrifiantId: string;
  typelubrifiant?: Typelubrifiant;
  createdAt: string;
  updatedAt: string;
  saisielubrifiants?: Saisielubrifiant[];
  lubrifiantParcs?: LubrifiantParc[];
}

export interface Typeconsommationlub {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  parcs?: TypeconsommationlubParc[];
  saisielubrifiants?: Saisielubrifiant[];
}

export interface Saisielubrifiant {
  id: string;
  lubrifiantId: string;
  qte: number;
  obs?: string;
  saisiehimId: string;
  typeconsommationlubId?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  lubrifiant?: Lubrifiant;
  saisiehim?: Saisiehim;
  typeconsommationlub?: Typeconsommationlub;
}

// TYPES POUR LES RELATIONS MANY-TO-MANY

export interface TypepanneParc {
  parcId: string;
  typepanneId: string;
  parc?: Parc;
  typepanne?: TypePanne;
  createdAt: string;
  updatedAt: string;
}

export interface TypeconsommationlubParc {
  parcId: string;
  typeconsommationlubId: string;
  parc?: Parc;
  typeconsommationlub?: Typeconsommationlub;
  createdAt: string;
  updatedAt: string;
}

export interface LubrifiantParc {
  parcId: string;
  lubrifiantId: string;
  parc?: Parc;
  lubrifiant?: Lubrifiant;
  createdAt: string;
  updatedAt: string;
}

// TYPES POUR LES OBJECTIFS

export interface Objectif {
  id: string;
  annee: number;
  parcId: string;
  siteId: string;
  dispo?: number;
  mtbf?: number;
  tdm?: number;
  spe_huile?: number;
  spe_go?: number;
  spe_graisse?: number;
  createdAt: string;
  updatedAt: string;

  // Relations
  parc?: Parc;
  site?: Site;
}

// TYPES POUR LES FILTRES ET PAGINATION

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PanneFilterParams extends PaginationParams {
  search?: string;
  enginId?: string;
  typepanneId?: string;
  niveauUrgenceId?: string;
  siteId?: string;
  dateDebut?: string;
  dateFin?: string;
  statut?: "en-attente" | "en-cours" | "resolue";
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

// TYPES POUR LES STATISTIQUES

export interface PanneStats {
  total: number;
  enAttente: number;
  enCours: number;
  resolues: number;
  parType: { type: string; count: number }[];
  parUrgence: { urgence: string; count: number }[];
  parSite: { site: string; count: number }[];
  tempsMoyenReparation: number;
  coutTotal: number;
}

export interface EnginStats {
  id: string;
  name: string;
  site: string;
  totalPannes: number;
  tempsArretTotal: number;
  dernierIncident?: string;
  statut: "actif" | "en-panne" | "maintenance";
}
