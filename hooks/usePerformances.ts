// hooks/usePerformances.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Saisiehrm,
  Saisiehim,
  Saisielubrifiant,
  OrigineSaisie,
  PerformanceFilters,
} from "@/lib/types";

// Constante API
const API = process.env.NEXT_PUBLIC_API_URL || "";

export const usePerformances = (filters?: PerformanceFilters) => {
  const queryClient = useQueryClient();

  // 🔹 FETCH SAISIE HRM
  const saisiehrmsQuery = useQuery({
    queryKey: ["saisiehrms", filters],
    queryFn: async (): Promise<Saisiehrm[]> => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });
      }

      const response = await fetch(
        `${API}/api/saisiehrms?${params.toString()}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors du chargement des saisies HRM"
        );
      }
      return data;
    },
  });

  // 🔹 FETCH SAISIE HIM
  const saisiehimsQuery = useQuery({
    queryKey: ["saisiehims", filters],
    queryFn: async (): Promise<Saisiehim[]> => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });
      }

      const response = await fetch(
        `${API}/api/saisiehims?${params.toString()}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors du chargement des saisies HIM"
        );
      }
      return data;
    },
  });

  // 🔹 FETCH SAISIE LUBRIFIANTS
  const saisielubrifiantsQuery = useQuery({
    queryKey: ["saisielubrifiants", filters],
    queryFn: async (): Promise<Saisielubrifiant[]> => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });
      }

      const response = await fetch(
        `${API}/api/saisielubrifiants?${params.toString()}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors du chargement des saisies de lubrifiants"
        );
      }
      return data;
    },
  });

  // 🔹 FETCH ORIGINES DE SAISIE
  const origineSaisiesQuery = useQuery({
    queryKey: ["origine-saisies"],
    queryFn: async (): Promise<OrigineSaisie[]> => {
      const response = await fetch(`${API}/api/origine-saisies`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors du chargement des origines de saisie"
        );
      }
      return data;
    },
  });

  // 🔹 CREATE SAISIE HRM
  const createSaisiehrm = useMutation({
    mutationFn: async (data: Partial<Saisiehrm>) => {
      const response = await fetch("/api/saisiehrms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(
          res?.message || "Erreur lors de la création de la saisie HRM"
        );
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saisiehrms"] });
    },
  });

  // 🔹 UPDATE SAISIE HRM
  const updateSaisiehrm = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<Saisiehrm> & { id: string }) => {
      const response = await fetch(`/api/saisiehrms/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(
          res?.message || "Erreur lors de la modification de la saisie HRM"
        );
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saisiehrms"] });
    },
  });

  // 🔹 DELETE SAISIE HRM
  const deleteSaisiehrm = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/saisiehrms/${id}`, {
        method: "DELETE",
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(
          res?.message || "Erreur lors de la suppression de la saisie HRM"
        );
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saisiehrms"] });
    },
  });

  // 🔹 CREATE SAISIE HIM
  const createSaisiehim = useMutation({
    mutationFn: async (data: Partial<Saisiehim>) => {
      const response = await fetch("/api/saisiehims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(
          res?.message || "Erreur lors de la création de la saisie HIM"
        );
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saisiehims"] });
    },
  });

  // 🔹 UPDATE SAISIE HIM
  const updateSaisiehim = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<Saisiehim> & { id: string }) => {
      const response = await fetch(`/api/saisiehims/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(
          res?.message || "Erreur lors de la modification de la saisie HIM"
        );
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saisiehims"] });
    },
  });

  // 🔹 DELETE SAISIE HIM
  const deleteSaisiehim = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/saisiehims/${id}`, {
        method: "DELETE",
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(
          res?.message || "Erreur lors de la suppression de la saisie HIM"
        );
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saisiehims"] });
    },
  });

  // 🔹 CREATE SAISIE LUBRIFIANT
  const createSaisielubrifiant = useMutation({
    mutationFn: async (data: Partial<Saisielubrifiant>) => {
      const response = await fetch("/api/saisielubrifiants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(
          res?.message ||
            "Erreur lors de la création de la saisie de lubrifiant"
        );
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saisielubrifiants"] });
    },
  });

  // 🔹 UPDATE SAISIE LUBRIFIANT
  const updateSaisielubrifiant = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<Saisielubrifiant> & { id: string }) => {
      const response = await fetch(`/api/saisielubrifiants/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(
          res?.message ||
            "Erreur lors de la modification de la saisie de lubrifiant"
        );
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saisielubrifiants"] });
    },
  });

  // 🔹 DELETE SAISIE LUBRIFIANT
  const deleteSaisielubrifiant = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/saisielubrifiants/${id}`, {
        method: "DELETE",
      });

      const res = await response.json();
      if (!response.ok) {
        throw new Error(
          res?.message ||
            "Erreur lors de la suppression de la saisie de lubrifiant"
        );
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saisielubrifiants"] });
    },
  });

  return {
    // Queries
    saisiehrmsQuery,
    saisiehimsQuery,
    saisielubrifiantsQuery,
    origineSaisiesQuery,

    // Mutations HRM
    createSaisiehrm,
    updateSaisiehrm,
    deleteSaisiehrm,

    // Mutations HIM
    createSaisiehim,
    updateSaisiehim,
    deleteSaisiehim,

    // Mutations Lubrifiants
    createSaisielubrifiant,
    updateSaisielubrifiant,
    deleteSaisielubrifiant,
  };
};

// 🔹 GET SAISIE HRM BY ID
export const useSaisiehrm = (id: string) => {
  return useQuery({
    queryKey: ["saisiehrms", id],
    queryFn: async (): Promise<Saisiehrm> => {
      const response = await fetch(`${API}/api/saisiehrms/${id}`);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement de la saisie HRM");
      }
      return response.json();
    },
    enabled: !!id,
  });
};

// 🔹 GET SAISIE HIM BY ID
export const useSaisiehim = (id: string) => {
  return useQuery({
    queryKey: ["saisiehims", id],
    queryFn: async (): Promise<Saisiehim> => {
      const response = await fetch(`${API}/api/saisiehims/${id}`);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement de la saisie HIM");
      }
      return response.json();
    },
    enabled: !!id,
  });
};

// 🔹 GET SAISIE LUBRIFIANT BY ID
export const useSaisielubrifiant = (id: string) => {
  return useQuery({
    queryKey: ["saisielubrifiants", id],
    queryFn: async (): Promise<Saisielubrifiant> => {
      const response = await fetch(`${API}/api/saisielubrifiants/${id}`);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement de la saisie de lubrifiant");
      }
      return response.json();
    },
    enabled: !!id,
  });
};

// 🔹 GET ORIGINE SAISIE BY ID
export const useOrigineSaisie = (id: string) => {
  return useQuery({
    queryKey: ["origine-saisies", id],
    queryFn: async (): Promise<OrigineSaisie> => {
      const response = await fetch(`${API}/api/origine-saisies/${id}`);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement de l'origine de saisie");
      }
      return response.json();
    },
    enabled: !!id,
  });
};
