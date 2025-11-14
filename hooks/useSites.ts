// hooks/useSites.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/lib/constantes";

export interface Site {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSiteData {
  name: string;
  active?: boolean;
}

export interface UpdateSiteData {
  name?: string;
  active?: boolean;
}

// GET all sites
export const useSites = () => {
  return useQuery({
    queryKey: ["sites"],
    queryFn: async (): Promise<Site[]> => {
      const response = await fetch(`${API}/sites`);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des sites");
      }
      return response.json();
    },
  });
};

// GET site by ID
export const useSite = (id: string) => {
  return useQuery({
    queryKey: ["sites", id],
    queryFn: async (): Promise<Site> => {
      const response = await fetch(`${API}/sites/${id}`);
      if (!response.ok) {
        throw new Error("Erreur lors du chargement du site");
      }
      return response.json();
    },
    enabled: !!id,
  });
};

// CREATE site
export const useCreateSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSiteData): Promise<Site> => {
      const response = await fetch(`${API}/sites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la création du site");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
  });
};

// UPDATE site
export const useUpdateSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSiteData;
    }): Promise<Site> => {
      const response = await fetch(`${API}/sites/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Erreur lors de la modification du site"
        );
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      queryClient.invalidateQueries({ queryKey: ["sites", variables.id] });
    },
  });
};

// DELETE site
export const useDeleteSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`${API}/sites/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Erreur lors de la suppression du site"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
  });
};
