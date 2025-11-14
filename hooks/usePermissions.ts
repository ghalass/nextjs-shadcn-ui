// hooks/usePermissions.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/lib/constantes";

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePermissionData {
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface UpdatePermissionData {
  name?: string;
  resource?: string;
  action?: string;
  description?: string;
}

// GET all permissions
export const usePermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async (): Promise<Permission[]> => {
      const response = await fetch(`${API}/permissions`);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des permissions");
      }
      return response.json();
    },
  });
};

// Hook pour les permissions utilisateur (RBAC)
export const useUserPermissions = () => {
  return useQuery({
    queryKey: ["user-permissions"],
    queryFn: async (): Promise<string[]> => {
      const response = await fetch(`${API}/auth/permissions`);
      if (!response.ok) {
        throw new Error(
          "Erreur lors du chargement des permissions utilisateur"
        );
      }
      const data = await response.json();
      return data.permissions || [];
    },
  });
};

// Fonction utilitaire pour vérifier les permissions
export const usePermissionCheck = () => {
  const { data: permissions = [], isLoading } = useUserPermissions();

  const hasPermission = (action: string, resource: string) => {
    return permissions.includes(`${action}:${resource}`);
  };

  return { hasPermission, permissions, isLoading };
};

// GET permission by ID
export const usePermission = (id: string) => {
  return useQuery({
    queryKey: ["permissions", id],
    queryFn: async (): Promise<Permission> => {
      const response = await fetch(`${API}/permissions/${id}`);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement de la permission");
      }
      return response.json();
    },
    enabled: !!id,
  });
};

// CREATE permission
export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePermissionData): Promise<Permission> => {
      const response = await fetch(`${API}/permissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Erreur lors de la création de la permission"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
};

// UPDATE permission
export const useUpdatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdatePermissionData;
    }): Promise<Permission> => {
      console.log("Updating permission with ID:", id);

      const response = await fetch(`${API}/permissions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Erreur lors de la modification de la permission"
        );
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      queryClient.invalidateQueries({
        queryKey: ["permissions", variables.id],
      });
    },
  });
};

// DELETE permission
export const useDeletePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`${API}/permissions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Erreur lors de la suppression de la permission"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
};
