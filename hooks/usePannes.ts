// hooks/usePannes.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Panne,
  TypePanne,
  OriginePanne,
  NiveauUrgence,
  Engin,
  StatutIntervention,
  PanneCreateDto,
  PanneUpdateDto,
} from "@/lib/types";

export function usePannes() {
  const queryClient = useQueryClient();

  const pannesQuery = useQuery({
    queryKey: ["pannes"],
    queryFn: async (): Promise<Panne[]> => {
      const response = await fetch("/api/pannes");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des pannes");
      }
      return response.json();
    },
  });

  const createPanne = useMutation({
    mutationFn: async (data: PanneCreateDto): Promise<Panne> => {
      const response = await fetch("/api/pannes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Erreur lors de la création de la panne"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pannes"] });
    },
  });

  const updatePanne = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: PanneUpdateDto;
    }): Promise<Panne> => {
      const response = await fetch(`/api/pannes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Erreur lors de la modification de la panne"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pannes"] });
    },
  });

  const deletePanne = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/pannes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Erreur lors de la suppression de la panne"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pannes"] });
    },
  });

  return {
    pannesQuery,
    createPanne,
    updatePanne,
    deletePanne,
  };
}

export function useTypesPanne() {
  return useQuery({
    queryKey: ["types-panne"],
    queryFn: async (): Promise<TypePanne[]> => {
      const response = await fetch("/api/typepannes");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des types de panne");
      }
      return response.json();
    },
  });
}

export function useOriginesPanne() {
  return useQuery({
    queryKey: ["origines-panne"],
    queryFn: async (): Promise<OriginePanne[]> => {
      const response = await fetch("/api/origines-panne");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des origines de panne");
      }
      return response.json();
    },
  });
}

export function useNiveauxUrgence() {
  return useQuery({
    queryKey: ["niveaux-urgence"],
    queryFn: async (): Promise<NiveauUrgence[]> => {
      const response = await fetch("/api/niveaux-urgence");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des niveaux d'urgence");
      }
      return response.json();
    },
  });
}

export function useEngins() {
  return useQuery({
    queryKey: ["engins"],
    queryFn: async (): Promise<Engin[]> => {
      const response = await fetch("/api/engins");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des engins");
      }
      return response.json();
    },
  });
}

export function useStatutsIntervention() {
  return useQuery({
    queryKey: ["statuts-intervention"],
    queryFn: async (): Promise<StatutIntervention[]> => {
      const response = await fetch("/api/statuts-intervention");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des statuts d'intervention");
      }
      return response.json();
    },
  });
}

// Hook pour les statistiques des pannes
export function usePannesStats() {
  return useQuery({
    queryKey: ["pannes-stats"],
    queryFn: async () => {
      const response = await fetch("/api/pannes/stats");
      if (!response.ok) {
        throw new Error(
          "Erreur lors du chargement des statistiques des pannes"
        );
      }
      return response.json();
    },
  });
}

// Hook pour les pièces de rechange
export function usePieces() {
  return useQuery({
    queryKey: ["pieces"],
    queryFn: async () => {
      const response = await fetch("/api/pieces");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des pièces de rechange");
      }
      return response.json();
    },
  });
}

// Hook pour les catégories de pièces
export function useCategoriesPiece() {
  return useQuery({
    queryKey: ["categories-piece"],
    queryFn: async () => {
      const response = await fetch("/api/categories-piece");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des catégories de pièces");
      }
      return response.json();
    },
  });
}
