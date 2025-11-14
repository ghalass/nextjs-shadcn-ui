// app/permissions/page.tsx
"use client";

import { useState } from "react";
import { PermissionsList } from "@/components/permissions/PermissionsList";
import { PermissionModal } from "@/components/permissions/PermissionModal";
import { DeleteConfirmationModal } from "@/components/permissions/DeleteConfirmationModal";
import {
  usePermissions,
  useCreatePermission,
  useUpdatePermission,
  useDeletePermission,
  Permission,
} from "@/hooks/usePermissions";
import { PermissionFormData } from "@/lib/validations/permissionSchema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function PermissionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null
  );
  const [deletingPermission, setDeletingPermission] =
    useState<Permission | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: permissions, isLoading, error: queryError } = usePermissions();
  const createPermission = useCreatePermission();
  const updatePermission = useUpdatePermission();
  const deletePermission = useDeletePermission();

  const handleCreate = () => {
    setEditingPermission(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (permission: Permission) => {
    setDeletingPermission(permission);
    setError(null);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPermission) return;

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

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setDeletingPermission(null);
  };

  const handleSubmit = async (data: PermissionFormData) => {
    try {
      if (editingPermission) {
        await updatePermission.mutateAsync({
          id: editingPermission.id,
          data,
        });
      } else {
        await createPermission.mutateAsync(data);
      }
      setError(null);
      setIsModalOpen(false);
      setEditingPermission(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
      throw error;
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingPermission(null);
    setError(null);
  };

  const displayError =
    error || (queryError instanceof Error ? queryError.message : null);

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
        permissions={permissions || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onCreate={handleCreate}
        isDeleting={
          deletePermission.isPending ? deletingPermission?.id || null : null
        }
      />

      {/* Modal pour créer/modifier une permission */}
      <PermissionModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        initialData={editingPermission || undefined}
        onSubmit={handleSubmit}
        isSubmitting={createPermission.isPending || updatePermission.isPending}
        error={error || undefined}
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
        isDeleting={deletePermission.isPending}
        itemName={
          deletingPermission ? `Permission: ${deletingPermission.name}` : ""
        }
        title="Supprimer la permission"
        description="Êtes-vous sûr de vouloir supprimer cette permission ? Cette action est irréversible et pourrait affecter les rôles qui utilisent cette permission."
      />
    </div>
  );
}
