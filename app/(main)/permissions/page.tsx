// app/permissions/page.tsx
"use client";

import { useState } from "react";
import { PermissionsList } from "@/components/permissions/PermissionsList";
import { PermissionModal } from "@/components/permissions/PermissionModal";
import { DeleteConfirmationModal } from "@/components/permissions/DeleteConfirmationModal";
import { usePermissions, type Permission } from "@/hooks/usePermissions";
import { type PermissionFormData } from "@/lib/validations/permissionSchema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function PermissionsPage() {
  const {
    permissionsQuery,
    createPermission,
    updatePermission,
    deletePermission,
  } = usePermissions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null
  );
  const [deletingPermission, setDeletingPermission] =
    useState<Permission | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Utilisez les données du hook usePermissions avec typage sécurisé
  const { data: permissions, isLoading, error: queryError } = permissionsQuery;

  const handleCreate = (): void => {
    setEditingPermission(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (permission: Permission): void => {
    setEditingPermission(permission);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (permission: Permission): void => {
    setDeletingPermission(permission);
    setError(null);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!deletingPermission?.id) return;

    try {
      await deletePermission.mutateAsync(deletingPermission.id);
      setError(null);
      setIsDeleteModalOpen(false);
      setDeletingPermission(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erreur lors de la suppression"
      );
    }
  };

  const handleDeleteCancel = (): void => {
    setIsDeleteModalOpen(false);
    setDeletingPermission(null);
  };

  const handleSubmit = async (data: PermissionFormData): Promise<void> => {
    try {
      if (editingPermission?.id) {
        // CORRECTION : Utiliser resourceId au lieu de resource pour l'API
        const apiData = {
          name: data.name,
          description: data.description,
          action: data.action,
          resourceId: data.resourceId, // Utiliser resourceId directement
        };
        await updatePermission.mutateAsync({
          id: editingPermission.id,
          data: apiData,
        });
      } else {
        // CORRECTION : Utiliser resourceId au lieu de resource pour l'API
        const apiData = {
          name: data.name,
          description: data.description,
          action: data.action,
          resourceId: data.resourceId, // Utiliser resourceId directement
        };
        await createPermission.mutateAsync(apiData);
      }
      setError(null);
      setIsModalOpen(false);
      setEditingPermission(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur est survenue";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
    setEditingPermission(null);
    setError(null);
  };

  // Gestion sécurisée des erreurs
  const displayError =
    error ||
    (queryError instanceof Error ? queryError.message : null) ||
    (typeof queryError === "string" ? queryError : null);

  // États de chargement avec vérifications de sécurité
  const isCreating = createPermission?.isPending ?? false;
  const isUpdating = updatePermission?.isPending ?? false;
  const isDeleting = deletePermission?.isPending ?? false;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion des permissions</h1>
        <p className="text-muted-foreground">
          Créez et gérez les permissions du système
        </p>
      </div>

      {displayError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      <PermissionsList
        permissions={permissions ?? []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onCreate={handleCreate}
        isDeleting={
          isDeleting && deletingPermission?.id ? deletingPermission.id : null
        }
      />

      {/* Modal pour créer/modifier une permission */}
      <PermissionModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        initialData={editingPermission ?? undefined}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
        error={error ?? undefined}
        title={
          editingPermission
            ? "Modifier la permission"
            : "Créer une nouvelle permission"
        }
        description={
          editingPermission
            ? "Modifiez les informations de la permission"
            : "Remplissez les informations pour créer une nouvelle permission"
        }
      />

      {/* Modal de confirmation pour la suppression */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        itemName={
          deletingPermission ? `Permission: ${deletingPermission.name}` : ""
        }
        title="Supprimer la permission"
        description="Êtes-vous sûr de vouloir supprimer cette permission ? Cette action est irréversible et pourrait affecter les rôles qui utilisent cette permission."
      />
    </div>
  );
}
