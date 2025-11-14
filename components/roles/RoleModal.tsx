"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { Role, Permission } from "@/lib/types";
import {
  roleCreateSchema,
  roleUpdateSchema,
} from "@/lib/validations/roleSchema";

interface RoleModalProps {
  open: boolean;
  onClose: () => void;
  role: Role | null;
  permissions: Permission[];
  createRole: any;
  updateRole: any;
}

export function RoleModal({
  open,
  onClose,
  role,
  permissions,
  createRole,
  updateRole,
}: RoleModalProps) {
  const isEdit = !!role;
  const [backendErrors, setBackendErrors] = useState<{
    name?: string;
    description?: string;
    permissions?: string;
    general?: string;
  }>({});

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      permissions: [] as string[],
    },
    validationSchema: isEdit ? roleUpdateSchema : roleCreateSchema,
    onSubmit: async (values) => {
      // Réinitialiser les erreurs backend
      setBackendErrors({});

      try {
        if (isEdit) {
          await updateRole.mutateAsync({
            id: role.id,
            ...values,
          });
          onClose();
          formik.resetForm();
        } else {
          await createRole.mutateAsync(values);
          onClose();
          formik.resetForm();
        }
      } catch (error: any) {
        console.error("Erreur capturée:", error);
        handleBackendError(error);
      }
    },
  });

  const handleBackendError = (error: any) => {
    console.log("Erreur reçue dans handleBackendError:", error);

    const errorData = error?.response?.data;

    if (!errorData) {
      setBackendErrors({
        general: error?.message || "Une erreur est survenue",
      });
      return;
    }

    if (errorData.details && Array.isArray(errorData.details)) {
      const errors: any = {};
      errorData.details.forEach((detail: string) => {
        const lowerDetail = detail.toLowerCase();
        if (lowerDetail.includes("nom")) {
          errors.name = detail;
        } else if (lowerDetail.includes("description")) {
          errors.description = detail;
        } else if (
          lowerDetail.includes("permission") ||
          lowerDetail.includes("permissions")
        ) {
          errors.permissions = detail;
        } else {
          errors.general = detail;
        }
      });
      setBackendErrors(errors);
    } else if (errorData.error) {
      const errorMessage = errorData.error.toLowerCase();
      if (errorMessage.includes("nom")) {
        setBackendErrors({ name: errorData.error });
      } else if (errorMessage.includes("utilisé")) {
        setBackendErrors({ general: errorData.error });
      } else {
        setBackendErrors({ general: errorData.error });
      }
    } else {
      setBackendErrors({
        general: error.message || "Une erreur est survenue",
      });
    }
  };

  useEffect(() => {
    if (open && role) {
      formik.setValues({
        name: role.name,
        description: role.description || "",
        permissions: role.permissions?.map((rp) => rp.permissionId) || [],
      });
      setBackendErrors({});
    } else if (open && !role) {
      formik.resetForm();
      setBackendErrors({});
    }
  }, [open, role]);

  const handleClose = () => {
    formik.resetForm();
    setBackendErrors({});
    onClose();
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      formik.setFieldValue("permissions", [
        ...formik.values.permissions,
        permissionId,
      ]);
    } else {
      formik.setFieldValue(
        "permissions",
        formik.values.permissions.filter((id) => id !== permissionId)
      );
    }
  };

  const isPending = createRole.isPending || updateRole.isPending;

  // Grouper les permissions par ressource
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Modifier le rôle" : "Nouveau rôle"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifiez les informations du rôle"
              : "Créez un nouveau rôle en remplissant le formulaire"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Alerte d'erreur générale */}
            {backendErrors.general && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{backendErrors.general}</AlertDescription>
              </Alert>
            )}

            {/* Nom */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nom <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Administrateur"
                disabled={isPending}
                {...formik.getFieldProps("name")}
                className={
                  (formik.touched.name && formik.errors.name) ||
                  backendErrors.name
                    ? "border-destructive"
                    : ""
                }
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-destructive">{formik.errors.name}</p>
              )}
              {backendErrors.name && (
                <p className="text-sm text-destructive">{backendErrors.name}</p>
              )}
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description du rôle..."
                disabled={isPending}
                {...formik.getFieldProps("description")}
                className={
                  (formik.touched.description && formik.errors.description) ||
                  backendErrors.description
                    ? "border-destructive"
                    : ""
                }
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-sm text-destructive">
                  {formik.errors.description}
                </p>
              )}
              {backendErrors.description && (
                <p className="text-sm text-destructive">
                  {backendErrors.description}
                </p>
              )}
            </div>

            {/* Permissions */}
            <div className="grid gap-2">
              <Label>
                Permissions <span className="text-destructive">*</span>
              </Label>
              <div className="border rounded-md p-3 space-y-4 max-h-[300px] overflow-y-auto">
                {Object.entries(groupedPermissions).map(([resource, perms]) => (
                  <div key={resource} className="space-y-2">
                    <h4 className="font-semibold text-sm capitalize">
                      {resource}
                    </h4>
                    <div className="space-y-2 pl-4">
                      {perms.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`permission-${permission.id}`}
                            checked={formik.values.permissions.includes(
                              permission.id
                            )}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(
                                permission.id,
                                checked as boolean
                              )
                            }
                            disabled={isPending}
                          />
                          <Label
                            htmlFor={`permission-${permission.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {permission.name}
                            {permission.description && (
                              <span className="text-muted-foreground ml-2">
                                - {permission.description}
                              </span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {formik.touched.permissions && formik.errors.permissions && (
                <p className="text-sm text-destructive">
                  {formik.errors.permissions}
                </p>
              )}
              {backendErrors.permissions && (
                <p className="text-sm text-destructive">
                  {backendErrors.permissions}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
