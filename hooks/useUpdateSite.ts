import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Site } from "@/lib/types";

async function updateSiteRequest(updatedSite: {
  id: string;
  name?: string;
  active?: boolean;
}): Promise<Site> {
  const res = await fetch(`/api/sites/${updatedSite.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedSite),
  });

  // ❌ si le backend renvoie une erreur, on la capture et on la jette proprement
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || "Erreur lors de la mise à jour du site");
  }

  return res.json();
}

export function useUpdateSite() {
  const queryClient = useQueryClient();

  return useMutation<
    Site,
    Error,
    { id: string; name?: string; active?: boolean }
  >({
    mutationFn: updateSiteRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
  });
}
