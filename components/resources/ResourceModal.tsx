"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import {
  ResourceFormData,
  resourceSchema,
} from "@/lib/validations/resourceSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Resource } from "@/lib/types";

interface ResourceModalProps {
  open: boolean;
  onClose: () => void;
  resource?: Resource | null;
  onSubmit: (data: ResourceFormData) => Promise<void>;
  isSubmitting: boolean;
  error?: string | null;
}

export function ResourceModal({
  open,
  onClose,
  resource,
  onSubmit,
  isSubmitting,
  error,
}: ResourceModalProps) {
  const [localError, setLocalError] = useState<string | null>(null);

  const formik = useFormik<ResourceFormData>({
    initialValues: {
      name: resource?.name || "",
      label: resource?.label || "",
    },
    validationSchema: resourceSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLocalError(null);
        await onSubmit(values);
        if (!resource) {
          resetForm();
        }
        onClose();
      } catch (error) {
        // L'erreur est gérée par le parent
      }
    },
    enableReinitialize: true,
  });

  // Réinitialiser le formulaire quand le modal s'ouvre/ferme
  useEffect(() => {
    if (open) {
      formik.resetForm();
      setLocalError(null);
    }
  }, [open, resource]);

  const displayError = error || localError;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {resource
              ? "Modifier la ressource"
              : "Créer une nouvelle ressource"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {displayError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nom technique *</Label>
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
              placeholder="ex: users"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-sm text-destructive mt-1">
                {formik.errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Libellé *</Label>
            <Input
              id="label"
              name="label"
              type="text"
              value={formik.values.label}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isSubmitting}
              className={
                formik.touched.label && formik.errors.label
                  ? "border-destructive"
                  : ""
              }
              placeholder="ex: Utilisateurs"
            />
            {formik.touched.label && formik.errors.label && (
              <p className="text-sm text-destructive mt-1">
                {formik.errors.label}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || !formik.isValid}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {resource ? "Modifier" : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
