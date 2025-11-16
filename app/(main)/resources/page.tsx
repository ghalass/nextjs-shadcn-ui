"use client";

import { useState } from "react";
import { useResources } from "@/hooks/useResources";
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
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { ResourceModal } from "@/components/resources/ResourceModal";
import { DeleteConfirmationModal } from "@/components/resources/DeleteConfirmationModal";
import { Resource, ResourceCreateDto, ResourceUpdateDto } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ResourcesPage() {
  const { resourcesQuery, createResource, updateResource, deleteResource } =
    useResources();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleCreate = (): void => {
    setSelectedResource(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (resource: Resource): void => {
    setSelectedResource(resource);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = (resource: Resource): void => {
    setSelectedResource(resource);
    setError(null);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedResource(null);
    setError(null);
  };

  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
    setSelectedResource(null);
  };

  const handleSubmit = async (data: ResourceCreateDto): Promise<void> => {
    try {
      if (selectedResource) {
        // Pour la mise à jour, on sépare l'ID des données
        const { id, ...resourceData } = data as any;
        await updateResource.mutateAsync({
          id: selectedResource.id,
          data: resourceData,
        });
      } else {
        await createResource.mutateAsync(data);
      }
      setError(null);
      setIsModalOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur est survenue";
      setError(errorMessage);
      throw error;
    }
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!selectedResource) return;

    try {
      await deleteResource.mutateAsync(selectedResource.id);
      setError(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression";
      setError(errorMessage);
    }
  };

  if (resourcesQuery.isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayError =
    error || (resourcesQuery.error as Error)?.message || null;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des ressources</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les ressources et leurs permissions
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle ressource
        </Button>
      </div>

      {displayError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom technique</TableHead>
              <TableHead>Libellé</TableHead>
              <TableHead>Permissions associées</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resourcesQuery.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Aucune ressource trouvée
                </TableCell>
              </TableRow>
            ) : (
              resourcesQuery.data?.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">{resource.name}</TableCell>
                  <TableCell>{resource.label}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {resource.permissions &&
                      resource.permissions.length > 0 ? (
                        resource.permissions.map((permission) => (
                          <Badge key={permission.id} variant="secondary">
                            {permission.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Aucune permission
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(resource.createdAt).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(resource)}
                        disabled={deleteResource.isPending}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(resource)}
                        disabled={deleteResource.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ResourceModal
        open={isModalOpen}
        onClose={handleCloseModal}
        resource={selectedResource}
        onSubmit={handleSubmit}
        isSubmitting={createResource.isPending || updateResource.isPending}
        error={error || undefined}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        resource={selectedResource}
        isDeleting={deleteResource.isPending}
      />
    </div>
  );
}
