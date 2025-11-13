// hooks/useSites.ts
import { Site } from "@/lib/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useSites() {
  const queryClient = useQueryClient();

  // GET sites
  const sitesQuery = useQuery<Site[], Error>({
    queryKey: ["sites"],
    queryFn: async () => {
      const res = await fetch("/api/sites");
      if (!res.ok) throw new Error("Impossible de fetch les sites");
      return res.json();
    },
    staleTime: 1000 * 60,
  });

  // CREATE site
  const createSite = useMutation<
    Site,
    Error,
    { name: string; active?: boolean }
  >({
    mutationFn: async (newSite) => {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSite),
      });

      if (!res.ok) throw new Error("Impossible de créer le site");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
  });

  // UPDATE site
  // const updateSite = useMutation<
  //   Site,
  //   Error,
  //   { id: string; name?: string; active?: boolean }
  // >({
  //   mutationFn: async (updatedSite) => {
  //     const res = await fetch(`/api/sites/${updatedSite.id}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(updatedSite),
  //     });

  //     if (!res.ok) throw new Error("Impossible de mettre à jour le site");
  //     return res.json();
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["sites"] });
  //   },
  // });
  const updateSite = async (updatedSite: {
    id: string;
    name?: string;
    active?: boolean;
  }) => {
    const res = await fetch(`/api/sites/${updatedSite.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedSite),
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.error || "Impossible de mettre à jour le site");
    }

    return res.json() as Promise<Site>;
  };

  // DELETE site
  const deleteSite = useMutation<Site, Error, string>({
    mutationFn: async (id) => {
      const res = await fetch(`/api/sites/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Impossible de supprimer le site");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
  });

  return {
    ...sitesQuery,
    createSite,
    updateSite,
    deleteSite,
  };
}
