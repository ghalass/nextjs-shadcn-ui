// hooks/useRoles.ts
"use client";

import { API } from "@/lib/constantes";
import { Role, roleCreateDto } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useRoles() {
  const queryClient = useQueryClient();

  // 🔹 FETCH ROLES
  const rolesQuery = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await fetch(`${API}/roles`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors du fetch");
      return data ?? [];
    },
    enabled: true,
  });

  // 🔹 CREATE ROLE
  const createRole = useMutation<Role, Error, roleCreateDto>({
    mutationFn: async ({ name, description, permissions }) => {
      const res = await fetch(`${API}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, permissions }),
      });

      const data = await res.json();

      if (!res.ok) {
        const error: any = new Error(
          data.error || "Erreur lors de la création"
        );
        error.response = { data };
        error.status = res.status;
        throw error;
      }

      toast.success("Rôle ajouté avec succès !");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      return data;
    },
  });

  // 🔹 UPDATE ROLE
  const updateRole = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateRoleData;
    }): Promise<Role> => {
      const response = await fetch(`${API}/roles/${id}`, {
        method: "PUT", // Changer de PATCH à PUT
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Erreur lors de la modification du rôle"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
  // 🔹 DELETE ROLE
  const deleteRole = useMutation<Role, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      const res = await fetch(`${API}/roles/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Rôle supprimé !");
      return data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    rolesQuery,
    createRole,
    updateRole,
    deleteRole,
  };
}

// Ajouter cette fonction pour récupérer un rôle par ID
export const useRole = (id: string) => {
  return useQuery({
    queryKey: ["roles", id],
    queryFn: async (): Promise<Role> => {
      const response = await fetch(`${API}/roles/${id}`);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement du rôle");
      }
      return response.json();
    },
    enabled: !!id,
  });
};
