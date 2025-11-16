// hooks/useUsers.ts
"use client";

import { API } from "@/lib/constantes";
import { User, userCreateDto } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// =======================================================
// ✅ HOOK PRINCIPAL
// =======================================================
export function useUsers() {
  const queryClient = useQueryClient();

  // 🔹 FETCH USERS
  const usersQuery = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async (): Promise<User[]> => {
      const response = await fetch(`${API}/users`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors du chargement des users");
      }
      return data;
    },
  });

  // 🔹 CREATE USER
  const createUser = useMutation<User, Error, userCreateDto>({
    mutationFn: async ({ email, name, password, role }) => {
      const res = await fetch(`${API}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Créer un objet d'erreur structuré pour le frontend
        const error: any = new Error(
          data.error || "Erreur lors de la création"
        );
        error.response = { data };
        error.status = res.status;
        throw error;
      }

      toast.success("Utilisateur ajouté avec succès !");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return data;
    },
  });

  // 🔹 UPDATE USER
  const updateUser = useMutation<
    User,
    Error,
    {
      id: string;
      email: string;
      name: string;
      password: string;
      role: string[];
    }
  >({
    mutationFn: async ({ id, email, name, password, role }) => {
      const res = await fetch(`${API}/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Créer un objet d'erreur structuré pour le frontend
        const error: any = new Error(
          data.error || "Erreur lors de la mise à jour"
        );
        error.response = { data };
        error.status = res.status;
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Utilisateur modifié !");
      return data;
    },
    onError: (error: any) => {
      // Ne pas afficher de toast si c'est une erreur de validation
      if (error.status !== 400 && error.status !== 409) {
        toast.error(error.message);
      }
    },
  });

  // 🔹 DELETE USER
  const deleteUser = useMutation<User, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      const res = await fetch(`${API}/users/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Utilisateur supprimé !");
      return data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    usersQuery,
    createUser,
    updateUser,
    deleteUser,
  };
}
