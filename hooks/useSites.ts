// hooks/useSites.ts

import { API } from "@/lib/constantes";
import { Site } from "@/lib/types";
import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook personnalisé pour gérer les sites sans TanStack Mutation ni Query.
 * Il expose : data, loading, error, et les méthodes CRUD.
 */
export function useSites() {
  const queryClient = useQueryClient();

  // 🧩 States locaux
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 FETCH ALL sites
  const fetchSites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/sites`);
      const data = await res.json();
      console.log(data);

      if (!res.ok)
        throw new Error(data.error || "Erreur lors du chargement des sites");
      setSites(data ?? []);
      queryClient.setQueryData(["sites"], data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [queryClient]);

  // Appel initial automatique
  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  // 🔹 CREATE site
  const createSite = useCallback(
    async (newSite: { name: string; active?: boolean }) => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/sites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSite),
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Impossible de créer le site");

        // Met à jour localement sans refetch
        setSites((prev) => [...prev, data]);
        queryClient.setQueryData(["sites"], (prev: any) => [
          ...(prev ?? []),
          data,
        ]);

        return data as Site;
      } catch (err: any) {
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [queryClient]
  );

  // 🔹 UPDATE site
  const updateSite = useCallback(
    async (updatedSite: { id: string; name?: string; active?: boolean }) => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/sites/${updatedSite.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSite),
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Impossible de mettre à jour le site");

        // Met à jour localement
        setSites((prev) =>
          prev.map((site) => (site.id === data.id ? data : site))
        );
        queryClient.setQueryData(["sites"], (prev: any) =>
          (prev ?? []).map((s: Site) => (s.id === data.id ? data : s))
        );

        return data as Site;
      } catch (err: any) {
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [queryClient]
  );

  // 🔹 DELETE site
  const deleteSite = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/sites/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Impossible de supprimer le site");

        // Supprime localement sans refetch
        setSites((prev) => prev.filter((site) => site.id !== id));
        queryClient.setQueryData(["sites"], (prev: any) =>
          (prev ?? []).filter((s: Site) => s.id !== id)
        );

        return data;
      } catch (err: any) {
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [queryClient]
  );

  return {
    sites,
    loading,
    error,
    refetch: fetchSites,
    createSite,
    updateSite,
    deleteSite,
  };
}
