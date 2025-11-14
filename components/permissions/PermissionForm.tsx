// components/permissions/PermissionForm.tsx
"use client";

import { useFormik } from "formik";
import {
  PermissionFormData,
  permissionSchema,
} from "@/lib/validations/permissionSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PermissionFormProps {
  initialData?: PermissionFormData & { id?: string };
  onSubmit: (data: PermissionFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  error?: string;
}

const actionOptions = [
  { value: "read", label: "Lecture" },
  { value: "create", label: "Création" },
  { value: "update", label: "Modification" },
  { value: "delete", label: "Suppression" },
  { value: "manage", label: "Gestion complète" },
];

const resourceOptions = [
  { value: "users", label: "Utilisateurs" },
  { value: "roles", label: "Rôles" },
  { value: "permissions", label: "Permissions" },
  { value: "sites", label: "Sites" },
];

export function PermissionForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
}: PermissionFormProps) {
  const formik = useFormik<PermissionFormData>({
    initialValues: {
      name: initialData?.name || "",
      resource: initialData?.resource || "",
      action: initialData?.action || "",
      description: initialData?.description || "",
    },
    validationSchema: permissionSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await onSubmit(values);
        if (!initialData?.id) {
          resetForm();
        }
      } catch (error) {
        // Les erreurs sont gérées par le parent
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nom de la permission *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isSubmitting}
            className={
              formik.touched.name && formik.errors.name
                ? "border-destructive"
                : ""
            }
            placeholder="ex: users.read"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-sm text-destructive mt-1">
              {formik.errors.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="resource">Ressource *</Label>
            <Select
              value={formik.values.resource}
              onValueChange={(value) => formik.setFieldValue("resource", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger
                className={
                  formik.touched.resource && formik.errors.resource
                    ? "border-destructive"
                    : ""
                }
              >
                <SelectValue placeholder="Sélectionnez une ressource" />
              </SelectTrigger>
              <SelectContent>
                {resourceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.resource && formik.errors.resource && (
              <p className="text-sm text-destructive mt-1">
                {formik.errors.resource}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="action">Action *</Label>
            <Select
              value={formik.values.action}
              onValueChange={(value) => formik.setFieldValue("action", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger
                className={
                  formik.touched.action && formik.errors.action
                    ? "border-destructive"
                    : ""
                }
              >
                <SelectValue placeholder="Sélectionnez une action" />
              </SelectTrigger>
              <SelectContent>
                {actionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.action && formik.errors.action && (
              <p className="text-sm text-destructive mt-1">
                {formik.errors.action}
              </p>
            )}
          </div>
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
            rows={3}
            placeholder="Description optionnelle de la permission..."
            className={
              formik.touched.description && formik.errors.description
                ? "border-destructive"
                : ""
            }
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-sm text-destructive mt-1">
              {formik.errors.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting || !formik.isValid}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData?.id ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}
