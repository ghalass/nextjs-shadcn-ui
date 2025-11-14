// app/roles/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { usePermissions } from "@/hooks/usePermissions";
import { useRoles } from "@/hooks/useRoles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Search, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

// Types pour les valeurs du formulaire
interface RoleFormValues {
  name: string;
  description: string;
  permissions: string[];
}

interface RoleData {
  id: string;
  name: string;
  description?: string;
  permissions?: Array<{
    permissionId: string;
    permission?: {
      id: string;
      name: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

const roleSchema = Yup.object({
  name: Yup.string()
    .required("Le nom du rôle est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  description: Yup.string()
    .max(255, "La description ne peut pas dépasser 255 caractères")
    .optional(),
  permissions: Yup.array().of(Yup.string()).default([]),
});

export default function EditRolePage() {
  const router = useRouter();
  const params = useParams();
  const roleId = params?.id as string;

  const permissionsQuery = usePermissions();
  const { updateRole } = useRoles();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<RoleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const formik = useFormik<RoleFormValues>({
    initialValues: {
      name: "",
      description: "",
      permissions: [],
    },
    validationSchema: roleSchema,
    onSubmit: async (values) => {
      setError(null);
      try {
        if (!roleId) {
          setError("ID du rôle manquant");
          return;
        }

        await updateRole.mutateAsync({
          id: roleId,
          data: {
            name: values.name.trim(),
            description: values.description.trim() || undefined,
            permissions: values.permissions,
          },
        });
        router.push("/roles");
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Une erreur est survenue"
        );
      }
    },
  });

  // Récupérer les données du rôle
  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        if (!roleId) {
          setError("ID du rôle manquant");
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        const response = await fetch(`/api/roles/${roleId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Rôle non trouvé");
          }
          throw new Error("Erreur lors du chargement du rôle");
        }

        const roleData: RoleData = await response.json();
        setInitialData(roleData);

        // Pré-remplir le formulaire
        formik.setValues({
          name: roleData.name || "",
          description: roleData.description || "",
          permissions: roleData.permissions?.map((p) => p.permissionId) || [],
        });
      } catch (error) {
        console.error("Error fetching role:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Erreur lors du chargement du rôle"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoleData();
  }, [roleId]);

  // Filtrage des permissions avec typage sécurisé
  const filteredPermissions =
    permissionsQuery.data?.filter((permission) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        permission.name.toLowerCase().includes(searchLower) ||
        permission.resource.toLowerCase().includes(searchLower) ||
        permission.action.toLowerCase().includes(searchLower) ||
        (permission.description &&
          permission.description.toLowerCase().includes(searchLower))
      );
    }) || [];

  // Groupement des permissions par ressource avec typage
  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, typeof filteredPermissions>);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    const currentPermissions = formik.values.permissions;
    let newPermissions: string[];

    if (checked) {
      newPermissions = [...currentPermissions, permissionId];
    } else {
      newPermissions = currentPermissions.filter((id) => id !== permissionId);
    }

    formik.setFieldValue("permissions", newPermissions);
  };

  const isSubmitting = updateRole.isPending;

  if (isLoading || permissionsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (permissionsQuery.isError) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erreur lors du chargement des permissions
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error && !initialData) {
    return (
      <div className="container mx-auto py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" asChild>
              <Link href="/roles">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Erreur</h1>
            </div>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <Button asChild className="mt-4">
            <Link href="/roles">Retour à la liste des rôles</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Calcul des statistiques avec typage sécurisé
  const selectedPermissionsCount = formik.values.permissions.length;
  const coveredResourcesCount = new Set(
    permissionsQuery.data
      ?.filter((p) => formik.values.permissions.includes(p.id))
      .map((p) => p.resource) || []
  ).size;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Sélectionner toutes les permissions filtrées
      const allPermissionIds = filteredPermissions.map((p) => p.id);
      formik.setFieldValue("permissions", allPermissionIds);
    } else {
      // Désélectionner toutes les permissions
      formik.setFieldValue("permissions", []);
    }
    formik.setFieldTouched("permissions", true);
  };

  const handleSelectAllInResource = (resource: string, checked: boolean) => {
    const resourcePermissions = groupedPermissions[resource] || [];
    const resourcePermissionIds = resourcePermissions.map((p) => p.id);

    const currentPermissions = formik.values.permissions;
    let newPermissions: string[];

    if (checked) {
      // Ajouter les permissions de la ressource (sans doublons)
      newPermissions = [
        ...new Set([...currentPermissions, ...resourcePermissionIds]),
      ];
    } else {
      // Retirer les permissions de la ressource
      newPermissions = currentPermissions.filter(
        (id) => !resourcePermissionIds.includes(id)
      );
    }

    formik.setFieldValue("permissions", newPermissions);
    formik.setFieldTouched("permissions", true);
  };

  // Calculer si toutes les permissions sont sélectionnées
  const allPermissions = permissionsQuery.data || [];
  const allPermissionIds = allPermissions.map((p) => p.id);
  const isAllSelected =
    allPermissionIds.length > 0 &&
    formik.values.permissions.length === allPermissionIds.length;

  // Calculer si toutes les permissions filtrées sont sélectionnées
  const filteredPermissionIds = filteredPermissions.map((p) => p.id);
  const isAllFilteredSelected =
    filteredPermissionIds.length > 0 &&
    filteredPermissionIds.every((id) => formik.values.permissions.includes(id));

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/roles">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8" />
              Modifier le rôle
            </h1>
            <p className="text-muted-foreground mt-1">
              Modifiez les informations du rôle et ses permissions
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informations de base */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du rôle</CardTitle>
                  <CardDescription>
                    Modifiez les informations de base du rôle
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom du rôle *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={isSubmitting}
                      className={
                        formik.touched.name && formik.errors.name
                          ? "border-destructive"
                          : ""
                      }
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="text-sm text-destructive mt-1">
                        {formik.errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={isSubmitting}
                      rows={4}
                      placeholder="Description du rôle et de ses responsabilités..."
                    />
                    {formik.touched.description &&
                      formik.errors.description && (
                        <p className="text-sm text-destructive mt-1">
                          {formik.errors.description}
                        </p>
                      )}
                  </div>
                </CardContent>
              </Card>

              {/* Résumé */}
              <Card>
                <CardHeader>
                  <CardTitle>Résumé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Permissions sélectionnées:
                    </span>
                    <span className="font-medium">
                      {selectedPermissionsCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Ressources couvertes:
                    </span>
                    <span className="font-medium">{coveredResourcesCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Date de création:
                    </span>
                    <span className="font-medium text-sm">
                      {initialData
                        ? new Date(initialData.createdAt).toLocaleDateString(
                            "fr-FR"
                          )
                        : "N/A"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  <Link href="/roles">Annuler</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formik.values.name.trim()}
                  className="flex-1"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Modifier le rôle
                </Button>
              </div>
            </div>

            {/* Permissions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Permissions</CardTitle>
                  <CardDescription>
                    Sélectionnez les permissions associées à ce rôle
                  </CardDescription>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher une permission..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Sélectionner tout - Global */}
                  {filteredPermissions.length > 0 && (
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id="select-all"
                        checked={isAllFilteredSelected}
                        onCheckedChange={(checked) =>
                          handleSelectAll(checked === true)
                        }
                        disabled={isSubmitting}
                      />
                      <Label
                        htmlFor="select-all"
                        className="text-sm font-medium cursor-pointer"
                      >
                        {isAllFilteredSelected
                          ? "Tout désélectionner"
                          : "Tout sélectionner"}
                        {searchTerm &&
                          ` (${filteredPermissions.length} résultat(s))`}
                      </Label>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="max-h-[600px] overflow-y-auto space-y-6">
                    {Object.entries(groupedPermissions).map(
                      ([resource, resourcePermissions]) => {
                        const resourcePermissionIds = resourcePermissions.map(
                          (p) => p.id
                        );
                        const isResourceAllSelected =
                          resourcePermissionIds.length > 0 &&
                          resourcePermissionIds.every((id) =>
                            formik.values.permissions.includes(id)
                          );

                        return (
                          <div key={resource} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold text-lg capitalize">
                                {resource}
                              </h3>

                              {/* Sélectionner tout - Par ressource */}
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`select-all-${resource}`}
                                  checked={isResourceAllSelected}
                                  onCheckedChange={(checked) =>
                                    handleSelectAllInResource(
                                      resource,
                                      checked === true
                                    )
                                  }
                                  disabled={isSubmitting}
                                />
                                <Label
                                  htmlFor={`select-all-${resource}`}
                                  className="text-sm font-medium cursor-pointer"
                                >
                                  {isResourceAllSelected
                                    ? "Tout désélectionner"
                                    : "Tout sélectionner"}
                                </Label>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                              {resourcePermissions.map((permission) => (
                                <div
                                  key={permission.id}
                                  className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50"
                                >
                                  <Checkbox
                                    id={`permission-${permission.id}`}
                                    checked={formik.values.permissions.includes(
                                      permission.id
                                    )}
                                    onCheckedChange={(checked) =>
                                      handlePermissionChange(
                                        permission.id,
                                        checked === true
                                      )
                                    }
                                    disabled={isSubmitting}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <Label
                                      htmlFor={`permission-${permission.id}`}
                                      className="flex items-start justify-between cursor-pointer"
                                    >
                                      <div>
                                        <div className="font-medium">
                                          {permission.name}
                                        </div>
                                        {permission.description && (
                                          <p className="text-sm text-muted-foreground mt-1">
                                            {permission.description}
                                          </p>
                                        )}
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className="ml-2 capitalize shrink-0"
                                      >
                                        {permission.action}
                                      </Badge>
                                    </Label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                    )}

                    {filteredPermissions.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>
                          {searchTerm
                            ? "Aucune permission trouvée pour votre recherche"
                            : "Aucune permission disponible"}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
