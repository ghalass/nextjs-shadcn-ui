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

const roleSchema = Yup.object({
  name: Yup.string()
    .required("Le nom du rôle est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  description: Yup.string()
    .max(255, "La description ne peut pas dépasser 255 caractères")
    .optional(),
  permissionIds: Yup.array().of(Yup.string()).default([]),
});

export default function EditRolePage() {
  const router = useRouter();
  const params = useParams();
  const roleId = params.id as string;

  const permissionsQuery = usePermissions();
  const { updateRole } = useRoles();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer les données du rôle
  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/roles/${roleId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Rôle non trouvé");
          }
          throw new Error("Erreur lors du chargement du rôle");
        }

        const roleData = await response.json();
        setInitialData(roleData);

        // Pré-remplir le formulaire
        formik.setValues({
          name: roleData.name,
          description: roleData.description || "",
          permissionIds:
            roleData.permissions?.map((p: any) => p.permissionId) || [],
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

    if (roleId) {
      fetchRoleData();
    }
  }, [roleId]);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      permissionIds: [],
    },
    validationSchema: roleSchema,
    onSubmit: async (values) => {
      setError(null);
      try {
        await updateRole.mutateAsync({ id: roleId, data: values });
        router.push("/roles");
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Une erreur est survenue"
        );
      }
    },
  });

  const filteredPermissions =
    permissionsQuery.data?.filter(
      (permission) =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, typeof filteredPermissions>);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    const currentIds = formik.values.permissionIds;
    const newIds = checked
      ? [...currentIds, permissionId]
      : currentIds.filter((id) => id !== permissionId);

    formik.setFieldValue("permissionIds", newIds);
  };

  const isSubmitting = updateRole.isPending;

  if (isLoading || permissionsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                      {formik.values.permissionIds.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Ressources couvertes:
                    </span>
                    <span className="font-medium">
                      {
                        new Set(
                          permissionsQuery.data
                            ?.filter((p) =>
                              formik.values.permissionIds.includes(p.id)
                            )
                            .map((p) => p.resource) || []
                        ).size
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Date de création:
                    </span>
                    <span className="font-medium text-sm">
                      {initialData &&
                        new Date(initialData.createdAt).toLocaleDateString(
                          "fr-FR"
                        )}
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
                >
                  <Link href="/roles">Annuler</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
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
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[600px] overflow-y-auto space-y-6">
                    {Object.entries(groupedPermissions).map(
                      ([resource, resourcePermissions]) => (
                        <div key={resource} className="border rounded-lg p-4">
                          <h3 className="font-semibold text-lg capitalize mb-3">
                            {resource}
                          </h3>
                          <div className="grid grid-cols-1 gap-3">
                            {resourcePermissions.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50"
                              >
                                <Checkbox
                                  id={`permission-${permission.id}`}
                                  checked={formik.values.permissionIds.includes(
                                    permission.id
                                  )}
                                  onCheckedChange={(checked) =>
                                    handlePermissionChange(
                                      permission.id,
                                      checked as boolean
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
                      )
                    )}

                    {filteredPermissions.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Aucune permission trouvée</p>
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
