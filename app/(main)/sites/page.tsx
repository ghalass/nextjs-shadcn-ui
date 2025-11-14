// app/sites/page.tsx
"use client";

import { useState } from "react";
import { SitesList } from "@/components/sites/SitesList";
import { SiteModal } from "@/components/sites/SiteModal";
import {
  useSites,
  useCreateSite,
  useUpdateSite,
  useDeleteSite,
  Site,
} from "@/hooks/useSites";
import { SiteFormData } from "@/lib/validations/siteSchema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function SitesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: sites, isLoading, error: queryError } = useSites();
  const createSite = useCreateSite();
  const updateSite = useUpdateSite();
  const deleteSite = useDeleteSite();

  const handleCreate = () => {
    setEditingSite(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (site: Site) => {
    setEditingSite(site);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (site: Site) => {
    if (
      confirm(`Êtes-vous sûr de vouloir supprimer le site "${site.name}" ?`)
    ) {
      try {
        await deleteSite.mutateAsync(site.id);
        setError(null);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Erreur lors de la suppression"
        );
      }
    }
  };

  const handleSubmit = async (data: SiteFormData) => {
    try {
      if (editingSite) {
        await updateSite.mutateAsync({ id: editingSite.id, data });
      } else {
        await createSite.mutateAsync(data);
      }
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
      throw error; // Propager l'erreur pour que le formulaire puisse la gérer
    }
  };

  const displayError =
    error || (queryError instanceof Error ? queryError.message : null);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion des sites</h1>
        <p className="text-muted-foreground">
          Créez et gérez les sites de votre application
        </p>
      </div>

      {displayError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      <SitesList
        sites={sites || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        isDeleting={
          deleteSite.isPending ? (deleteSite.variables as string) : null
        }
      />

      <SiteModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialData={editingSite || undefined}
        onSubmit={handleSubmit}
        isSubmitting={createSite.isPending || updateSite.isPending}
        error={error || undefined}
        title={editingSite ? "Modifier le site" : "Créer un nouveau site"}
        description={
          editingSite
            ? "Modifiez les informations du site"
            : "Remplissez les informations pour créer un nouveau site"
        }
      />
    </div>
  );
}
