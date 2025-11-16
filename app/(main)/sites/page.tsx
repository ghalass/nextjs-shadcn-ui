// app/sites/page.tsx
"use client";

import { useState } from "react";
import { useSites, type Site } from "@/hooks/useSites";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2, Globe, MapPin } from "lucide-react";
import { SiteModal } from "@/components/sites/SiteModal";
import { DeleteSiteModal } from "@/components/sites/DeleteSiteModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { type SiteFormData } from "@/lib/validations/siteSchema";

export default function SitesPage() {
  const { sitesQuery, createSite, updateSite, deleteSite } = useSites();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = (): void => {
    setSelectedSite(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (site: Site): void => {
    setSelectedSite(site);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = (site: Site): void => {
    setSelectedSite(site);
    setError(null);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedSite(null);
    setError(null);
  };

  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
    setSelectedSite(null);
    setError(null);
  };

  const handleSubmit = async (data: SiteFormData): Promise<void> => {
    try {
      if (selectedSite) {
        await updateSite.mutateAsync({ id: selectedSite.id, data });
      } else {
        await createSite.mutateAsync(data);
      }
      setError(null);
      handleCloseModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur est survenue";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!selectedSite) return;

    try {
      await deleteSite.mutateAsync(selectedSite.id);
      setError(null);
      handleCloseDeleteModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression";
      setError(errorMessage);
    }
  };

  const displayError = error || sitesQuery.error?.message || null;

  if (sitesQuery.isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MapPin className="h-8 w-8" />
            Gestion des sites
          </h1>
          <p className="text-muted-foreground mt-1">
            Créez et gérez les sites de votre application
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau site
        </Button>
      </div>

      {displayError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Dernière modification</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sitesQuery.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="text-center space-y-4">
                    <Globe className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Aucun site trouvé</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sitesQuery.data?.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={site.active ? "default" : "secondary"}
                      className={
                        site.active
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : ""
                      }
                    >
                      {site.active ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(site.createdAt).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(site.updatedAt).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(site)}
                        disabled={deleteSite.isPending}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(site)}
                        disabled={deleteSite.isPending}
                      >
                        {deleteSite.isPending &&
                        selectedSite?.id === site.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SiteModal
        open={isModalOpen}
        onClose={handleCloseModal}
        site={selectedSite ?? undefined}
        onSubmit={handleSubmit}
        isSubmitting={createSite.isPending || updateSite.isPending}
        error={error ?? undefined}
        title={selectedSite ? "Modifier le site" : "Créer un nouveau site"}
        description={
          selectedSite
            ? "Modifiez les informations du site"
            : "Remplissez les informations pour créer un nouveau site"
        }
      />

      <DeleteSiteModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        site={selectedSite}
        isDeleting={deleteSite.isPending && selectedSite?.id !== undefined}
      />
    </div>
  );
}
