"use client";

import { API } from "@/lib/constantes";
import { User, userCreateDto } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// =======================================================
// ✅ HOOK PRINCIPAL
// =======================================================
export function useUsers() {
  const queryClient = useQueryClient(); // ok ici

  // 🔹 FETCH USERS
  const usersQuery = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch(`${API}/users`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors du fetch");
      console.log(data);

      // ✅ Retourner le tableau directement
      return data ?? [];
    },
    enabled: true, // pour fetch automatiquement
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
      if (!res.ok) toast.error(data.error || "Erreur lors de la création");
      else {
        toast.success("Utilisateur ajouté avec succès !");
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
      return data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // 🔹 UPDATE USER
  const updateUser = useMutation<
    User,
    Error,
    { id: string; email: string; name: string; password: string; role: string }
  >({
    mutationFn: async ({ id, email, name, password, role }) => {
      const res = await fetch(`${API}/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password, role }),
      });

      const data = await res.json();
      if (!res.ok) toast.error(data.error || "Erreur lors de la mise à jour");
      else {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success("Utilisateur modifié !");
      }
      return data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // 🔹 DELETE USER
  const deleteUser = useMutation<User, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      const res = await fetch(`${API}/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) toast.error(data.error || "Erreur lors de la suppression");
      else {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success("Utilisateur supprimé !");
      }
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
