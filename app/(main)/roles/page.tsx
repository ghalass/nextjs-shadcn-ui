// app/roles/page.tsx
"use client";

import { useState } from "react";
import { useRoles } from "@/hooks/useRoles";
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
import { Loader2, Plus, Pencil, Trash2, Shield } from "lucide-react";
import { DeleteRoleModal } from "@/components/roles/DeleteRoleModal";
import { Role } from "@/lib/types";
import Link from "next/link";

export default function RolesPage() {
  const { rolesQuery, deleteRole } = useRoles();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedRole(null);
  };

  if (rolesQuery.isLoading) {
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
            <Shield className="h-8 w-8" />
            Gestion des rôles
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez les rôles et leurs permissions
          </p>
        </div>
        <Button asChild>
          <Link href="/roles/create">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau rôle
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rolesQuery.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="text-center space-y-4">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Aucun rôle trouvé</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rolesQuery.data?.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/roles/${role.id}/edit`}
                      className="hover:text-primary hover:underline"
                    >
                      {role.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {role.description || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {role.permissions?.slice(0, 3).map((rolePermission) => (
                        <Badge key={rolePermission.id} variant="outline">
                          {rolePermission.permission?.name}
                        </Badge>
                      ))}
                      {role.permissions && role.permissions.length > 3 && (
                        <Badge variant="secondary">
                          +{role.permissions.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(role.createdAt).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/roles/${role.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(role)}
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

      <DeleteRoleModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        role={selectedRole}
        deleteRole={deleteRole}
      />
    </div>
  );
}
