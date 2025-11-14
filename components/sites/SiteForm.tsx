// components/sites/SiteForm.tsx
"use client";

import { useFormik } from "formik";
import { SiteFormData, siteSchema } from "@/lib/validations/siteSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

interface SiteFormProps {
  initialData?: SiteFormData & { id?: string };
  onSubmit: (data: SiteFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  error?: string;
}

export function SiteForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
}: SiteFormProps) {
  const formik = useFormik<SiteFormData>({
    initialValues: {
      name: initialData?.name || "",
      active: initialData?.active ?? true,
    },
    validationSchema: siteSchema,
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
          <Label htmlFor="name">Nom du site *</Label>
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
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-sm text-destructive mt-1">
              {formik.errors.name}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={formik.values.active}
            onCheckedChange={(checked) =>
              formik.setFieldValue("active", checked)
            }
            disabled={isSubmitting}
          />
          <Label htmlFor="active">Site actif</Label>
        </div>
        {formik.touched.active && formik.errors.active && (
          <p className="text-sm text-destructive">{formik.errors.active}</p>
        )}
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
