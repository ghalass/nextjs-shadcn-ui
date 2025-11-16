// // app/permissions/page.tsx
// "use client";

// import { useState } from "react";
// import { PermissionsList } from "@/components/permissions/PermissionsList";
// import { PermissionModal } from "@/components/permissions/PermissionModal";
// import { DeleteConfirmationModal } from "@/components/permissions/DeleteConfirmationModal";
// import { usePermissions, type Permission } from "@/hooks/usePermissions";
// import { type PermissionFormData } from "@/lib/validations/permissionSchema";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { AlertCircle } from "lucide-react";

// export default function PermissionsPage() {
//   const {
//     permissionsQuery,
//     createPermission,
//     updatePermission,
//     deletePermission,
//   } = usePermissions();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [editingPermission, setEditingPermission] = useState<Permission | null>(
//     null
//   );
//   const [deletingPermission, setDeletingPermission] =
//     useState<Permission | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Utilisez les données du hook usePermissions avec typage sécurisé
//   const { data: permissions, isLoading, error: queryError } = permissionsQuery;

//   const handleCreate = (): void => {
//     setEditingPermission(null);
//     setError(null);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (permission: Permission): void => {
//     setEditingPermission(permission);
//     setError(null);
//     setIsModalOpen(true);
//   };

//   const handleDeleteClick = (permission: Permission): void => {
//     setDeletingPermission(permission);
//     setError(null);
//     setIsDeleteModalOpen(true);
//   };

//   const handleDeleteConfirm = async (): Promise<void> => {
//     if (!deletingPermission?.id) return;

//     try {
//       await deletePermission.mutateAsync(deletingPermission.id);
//       setError(null);
//       setIsDeleteModalOpen(false);
//       setDeletingPermission(null);
//     } catch (error) {
//       setError(
//         error instanceof Error ? error.message : "Erreur lors de la suppression"
//       );
//     }
//   };

//   const handleDeleteCancel = (): void => {
//     setIsDeleteModalOpen(false);
//     setDeletingPermission(null);
//   };

//   const handleSubmit = async (data: PermissionFormData): Promise<void> => {
//     try {
//       if (editingPermission?.id) {
//         // CORRECTION : Utiliser resourceId au lieu de resource pour l'API
//         const apiData = {
//           name: data.name,
//           description: data.description,
//           action: data.action,
//           resourceId: data.resourceId, // Utiliser resourceId directement
//         };
//         await updatePermission.mutateAsync({
//           id: editingPermission.id,
//           data: apiData,
//         });
//       } else {
//         // CORRECTION : Utiliser resourceId au lieu de resource pour l'API
//         const apiData = {
//           name: data.name,
//           description: data.description,
//           action: data.action,
//           resourceId: data.resourceId, // Utiliser resourceId directement
//         };
//         await createPermission.mutateAsync(apiData);
//       }
//       setError(null);
//       setIsModalOpen(false);
//       setEditingPermission(null);
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : "Une erreur est survenue";
//       setError(errorMessage);
//       throw new Error(errorMessage);
//     }
//   };

//   const handleModalClose = (): void => {
//     setIsModalOpen(false);
//     setEditingPermission(null);
//     setError(null);
//   };

//   // Gestion sécurisée des erreurs
//   const displayError =
//     error ||
//     (queryError instanceof Error ? queryError.message : null) ||
//     (typeof queryError === "string" ? queryError : null);

//   // États de chargement avec vérifications de sécurité
//   const isCreating = createPermission?.isPending ?? false;
//   const isUpdating = updatePermission?.isPending ?? false;
//   const isDeleting = deletePermission?.isPending ?? false;

//   return (
//     <div className="container mx-auto py-6 space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Gestion des permissions</h1>
//         <p className="text-muted-foreground">
//           Créez et gérez les permissions du système
//         </p>
//       </div>

//       {displayError && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{displayError}</AlertDescription>
//         </Alert>
//       )}

//       <PermissionsList
//         permissions={permissions ?? []}
//         isLoading={isLoading}
//         onEdit={handleEdit}
//         onDelete={handleDeleteClick}
//         onCreate={handleCreate}
//         isDeleting={
//           isDeleting && deletingPermission?.id ? deletingPermission.id : null
//         }
//       />

//       {/* Modal pour créer/modifier une permission */}
//       <PermissionModal
//         open={isModalOpen}
//         onOpenChange={handleModalClose}
//         initialData={editingPermission ?? undefined}
//         onSubmit={handleSubmit}
//         isSubmitting={isCreating || isUpdating}
//         error={error ?? undefined}
//         title={
//           editingPermission
//             ? "Modifier la permission"
//             : "Créer une nouvelle permission"
//         }
//         description={
//           editingPermission
//             ? "Modifiez les informations de la permission"
//             : "Remplissez les informations pour créer une nouvelle permission"
//         }
//       />

//       {/* Modal de confirmation pour la suppression */}
//       <DeleteConfirmationModal
//         open={isDeleteModalOpen}
//         onOpenChange={handleDeleteCancel}
//         onConfirm={handleDeleteConfirm}
//         isDeleting={isDeleting}
//         itemName={
//           deletingPermission ? `Permission: ${deletingPermission.name}` : ""
//         }
//         title="Supprimer la permission"
//         description="Êtes-vous sûr de vouloir supprimer cette permission ? Cette action est irréversible et pourrait affecter les rôles qui utilisent cette permission."
//       />
//     </div>
//   );
// }

// app/permissions/page.tsx
"use client";

import { useState } from "react";
import { usePermissions, type Permission } from "@/hooks/usePermissions";
import { type PermissionFormData } from "@/lib/validations/permissionSchema";
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
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Shield,
  ShieldUser,
} from "lucide-react";
import { PermissionModal } from "@/components/permissions/PermissionModal";
import { DeleteConfirmationModal } from "@/components/permissions/DeleteConfirmationModal";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PermissionsPage() {
  const {
    permissionsQuery,
    createPermission,
    updatePermission,
    deletePermission,
  } = usePermissions();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = (): void => {
    setSelectedPermission(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (permission: Permission): void => {
    setSelectedPermission(permission);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = (permission: Permission): void => {
    setSelectedPermission(permission);
    setError(null);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedPermission(null);
    setError(null);
  };

  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
    setSelectedPermission(null);
    setError(null);
  };

  const handleSubmit = async (data: PermissionFormData): Promise<void> => {
    try {
      if (selectedPermission) {
        // Pour la mise à jour
        const apiData = {
          name: data.name,
          description: data.description,
          action: data.action,
          resourceId: data.resourceId,
        };
        await updatePermission.mutateAsync({
          id: selectedPermission.id,
          data: apiData,
        });
      } else {
        // Pour la création
        const apiData = {
          name: data.name,
          description: data.description,
          action: data.action,
          resourceId: data.resourceId,
        };
        await createPermission.mutateAsync(apiData);
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
    if (!selectedPermission) return;

    try {
      await deletePermission.mutateAsync(selectedPermission.id);
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

  const displayError = error || permissionsQuery.error?.message || null;

  if (permissionsQuery.isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getActionColor = (action: string) => {
    const colors: { [key: string]: string } = {
      read: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      create: "bg-green-100 text-green-800 hover:bg-green-100",
      update: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      delete: "bg-red-100 text-red-800 hover:bg-red-100",
      manage: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    };
    return colors[action] || "bg-gray-100 text-gray-800 hover:bg-gray-100";
  };

  const getActionLabel = (action: string) => {
    const labels: { [key: string]: string } = {
      read: "Lecture",
      create: "Création",
      update: "Modification",
      delete: "Suppression",
      manage: "Gestion",
    };
    return labels[action] || action;
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldUser className="h-8 w-8" />
            Gestion des permissions
          </h1>
          <p className="text-muted-foreground mt-1">
            Créez et gérez les permissions du système
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle permission
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
              <TableHead>Nom</TableHead>
              <TableHead>Ressource</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissionsQuery.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="text-center space-y-4">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">
                      Aucune permission trouvée
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              permissionsQuery.data?.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">
                    {permission.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {permission.resource?.name || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`capitalize ${getActionColor(
                        permission.action
                      )}`}
                    >
                      {getActionLabel(permission.action)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {permission.description || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(permission.createdAt).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(permission)}
                        disabled={deletePermission.isPending}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(permission)}
                        disabled={deletePermission.isPending}
                      >
                        {deletePermission.isPending &&
                        selectedPermission?.id === permission.id ? (
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

      <PermissionModal
        open={isModalOpen}
        onClose={handleCloseModal}
        permission={selectedPermission ?? undefined}
        onSubmit={handleSubmit}
        isSubmitting={createPermission.isPending || updatePermission.isPending}
        error={error ?? undefined}
        title={
          selectedPermission
            ? "Modifier la permission"
            : "Créer une nouvelle permission"
        }
        description={
          selectedPermission
            ? "Modifiez les informations de la permission"
            : "Remplissez les informations pour créer une nouvelle permission"
        }
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        permission={selectedPermission}
        isDeleting={
          deletePermission.isPending && selectedPermission?.id !== undefined
        }
      />
    </div>
  );
}
