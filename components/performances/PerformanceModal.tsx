// components/performances/PerformanceModal.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Engin,
  Site,
  OrigineSaisie,
  Saisiehrm,
  Saisiehim,
  Saisielubrifiant,
} from "@/lib/types";

interface PerformanceModalProps {
  open: boolean;
  onClose: () => void;
  type: "saisiehrm" | "saisiehim" | "saisielubrifiant";
  item: Saisiehrm | Saisiehim | Saisielubrifiant | null;
  engins: Engin[];
  sites: Site[];
  origineSaisies: OrigineSaisie[];
  createSaisiehrm: any;
  updateSaisiehrm: any;
  createSaisiehim: any;
  updateSaisiehim: any;
  createSaisielubrifiant: any;
  updateSaisielubrifiant: any;
}

const getValidationSchema = (type: string) => {
  const baseSchema = {
    enginId: Yup.string().required("L'engin est requis"),
    siteId: Yup.string().required("Le site est requis"),
    origineSaisieId: Yup.string().nullable(),
  };

  switch (type) {
    case "saisiehrm":
      return Yup.object({
        ...baseSchema,
        du: Yup.date().required("La date est requise"),
        hrm: Yup.number()
          .required("La valeur HRM est requise")
          .min(0, "La valeur HRM doit être positive"),
      });
    case "saisiehim":
      return Yup.object({
        ...baseSchema,
        him: Yup.number()
          .required("La valeur HIM est requise")
          .min(0, "La valeur HIM doit être positive"),
        ni: Yup.number()
          .required("Le NI est requis")
          .integer("Le NI doit être un entier")
          .min(0, "Le NI doit être positif"),
        panneId: Yup.string().required("La panne est requise"),
        obs: Yup.string().nullable(),
      });
    case "saisielubrifiant":
      return Yup.object({
        ...baseSchema,
        lubrifiantId: Yup.string().required("Le lubrifiant est requis"),
        qte: Yup.number()
          .required("La quantité est requise")
          .min(0, "La quantité doit être positive"),
        typeconsommationlubId: Yup.string().nullable(),
        obs: Yup.string().nullable(),
      });
    default:
      return Yup.object({});
  }
};

export function PerformanceModal({
  open,
  onClose,
  type,
  item,
  engins,
  sites,
  origineSaisies,
  createSaisiehrm,
  updateSaisiehrm,
  createSaisiehim,
  updateSaisiehim,
  createSaisielubrifiant,
  updateSaisielubrifiant,
}: PerformanceModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(item);

  const formik = useFormik({
    initialValues: {
      // Common fields
      enginId:
        item && "enginId" in item && typeof item.enginId === "string"
          ? item.enginId
          : "",
      siteId: (item as any)?.siteId || "",
      origineSaisieId: (item as any)?.origineSaisieId || "",

      // HRM specific
      du: (item as Saisiehrm)?.du
        ? new Date((item as Saisiehrm).du).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      hrm: (item as Saisiehrm)?.hrm || 0,

      // HIM specific
      him: (item as Saisiehim)?.him || 0,
      ni: (item as Saisiehim)?.ni || 0,
      panneId: (item as Saisiehim)?.panneId || "",
      obs: (item as Saisiehim)?.obs || "",

      // Lubrifiant specific
      lubrifiantId: (item as Saisielubrifiant)?.lubrifiantId || "",
      qte: (item as Saisielubrifiant)?.qte || 0,
      typeconsommationlubId:
        (item as Saisielubrifiant)?.typeconsommationlubId || "",
    },
    validationSchema: getValidationSchema(type),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const payload = {
          ...values,
          // Convert string values to numbers
          hrm: values.hrm ? Number(values.hrm) : undefined,
          him: values.him ? Number(values.him) : undefined,
          qte: values.qte ? Number(values.qte) : undefined,
          ni: values.ni ? Number(values.ni) : undefined,
          // Convert empty strings to undefined
          origineSaisieId: values.origineSaisieId || undefined,
          typeconsommationlubId: values.typeconsommationlubId || undefined,
          obs: values.obs || undefined,
        };

        if (isEditing) {
          // Update existing item
          switch (type) {
            case "saisiehrm":
              await updateSaisiehrm.mutateAsync({ id: item!.id, ...payload });
              break;
            case "saisiehim":
              await updateSaisiehim.mutateAsync({ id: item!.id, ...payload });
              break;
            case "saisielubrifiant":
              await updateSaisielubrifiant.mutateAsync({
                id: item!.id,
                ...payload,
              });
              break;
          }
        } else {
          // Create new item
          switch (type) {
            case "saisiehrm":
              await createSaisiehrm.mutateAsync(payload);
              break;
            case "saisiehim":
              await createSaisiehim.mutateAsync(payload);
              break;
            case "saisielubrifiant":
              await createSaisielubrifiant.mutateAsync(payload);
              break;
          }
        }

        onClose();
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (open) {
      formik.resetForm();
      setError(null);

      if (item) {
        // Set form values based on item type
        formik.setValues({
          enginId:
            "enginId" in item && typeof (item as any).enginId === "string"
              ? (item as any).enginId
              : "",
          siteId: (item as any).siteId || "",
          origineSaisieId: (item as any).origineSaisieId || "",
          du: (item as Saisiehrm)?.du
            ? new Date((item as Saisiehrm).du).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          hrm: (item as Saisiehrm)?.hrm || 0,
          him: (item as Saisiehim)?.him || 0,
          ni: (item as Saisiehim)?.ni || 0,
          panneId: (item as Saisiehim)?.panneId || "",
          obs: (item as Saisiehim)?.obs || "",
          lubrifiantId: (item as Saisielubrifiant)?.lubrifiantId || "",
          qte: (item as Saisielubrifiant)?.qte || 0,
          typeconsommationlubId:
            (item as Saisielubrifiant)?.typeconsommationlubId || "",
        });
      }
    }
  }, [open, item, type]);

  const getTitle = () => {
    const action = isEditing ? "Modifier" : "Créer";
    switch (type) {
      case "saisiehrm":
        return `${action} une saisie HRM`;
      case "saisiehim":
        return `${action} une saisie HIM`;
      case "saisielubrifiant":
        return `${action} une saisie de lubrifiant`;
      default:
        return `${action} une saisie`;
    }
  };

  const getDescription = () => {
    switch (type) {
      case "saisiehrm":
        return "Saisissez les heures de fonctionnement machine (HRM)";
      case "saisiehim":
        return "Saisissez les heures d'immobilisation machine (HIM)";
      case "saisielubrifiant":
        return "Saisissez la consommation de lubrifiant";
      default:
        return "Saisie des performances";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Common Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="enginId">Engin *</Label>
              <Select
                value={formik.values.enginId}
                onValueChange={(value) =>
                  formik.setFieldValue("enginId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un engin" />
                </SelectTrigger>
                <SelectContent>
                  {engins.map((engin) => (
                    <SelectItem key={engin.id} value={engin.id}>
                      {engin.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.enginId && formik.errors.enginId && (
                <div className="text-sm text-destructive">
                  {formik.errors.enginId}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteId">Site *</Label>
              <Select
                value={formik.values.siteId}
                onValueChange={(value) => formik.setFieldValue("siteId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.siteId && formik.errors.siteId && (
                <div className="text-sm text-destructive">
                  {typeof formik.errors.siteId === "string"
                    ? formik.errors.siteId
                    : Array.isArray(formik.errors.siteId)
                    ? formik.errors.siteId.join(", ")
                    : ""}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="origineSaisieId">Origine de la saisie</Label>
            <Select
              value={formik.values.origineSaisieId}
              onValueChange={(value) =>
                formik.setFieldValue("origineSaisieId", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une origine" />
              </SelectTrigger>
              <SelectContent>
                {origineSaisies.map((origine) => (
                  <SelectItem key={origine.id} value={origine.id}>
                    {origine.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* HRM Specific Fields */}
          {type === "saisiehrm" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="du">Date *</Label>
                <Input
                  id="du"
                  type="date"
                  value={formik.values.du}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.du && formik.errors.du && (
                  <div className="text-sm text-destructive">
                    {formik.errors.du}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hrm">HRM (Heures) *</Label>
                <Input
                  id="hrm"
                  type="number"
                  step="0.01"
                  value={formik.values.hrm}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="0.00"
                />
                {formik.touched.hrm && formik.errors.hrm && (
                  <div className="text-sm text-destructive">
                    {formik.errors.hrm}
                  </div>
                )}
              </div>
            </>
          )}

          {/* HIM Specific Fields */}
          {type === "saisiehim" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="him">HIM (Heures) *</Label>
                  <Input
                    id="him"
                    type="number"
                    step="0.01"
                    value={formik.values.him}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="0.00"
                  />
                  {formik.touched.him && formik.errors.him && (
                    <div className="text-sm text-destructive">
                      {formik.errors.him}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ni">NI *</Label>
                  <Input
                    id="ni"
                    type="number"
                    value={formik.values.ni}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="0"
                  />
                  {formik.touched.ni && formik.errors.ni && (
                    <div className="text-sm text-destructive">
                      {formik.errors.ni}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="panneId">Panne *</Label>
                <Input
                  id="panneId"
                  value={formik.values.panneId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="ID de la panne"
                />
                {formik.touched.panneId && formik.errors.panneId && (
                  <div className="text-sm text-destructive">
                    {formik.errors.panneId}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="obs">Observations</Label>
                <Textarea
                  id="obs"
                  value={formik.values.obs}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Observations supplémentaires..."
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Lubrifiant Specific Fields */}
          {type === "saisielubrifiant" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lubrifiantId">Lubrifiant *</Label>
                  <Input
                    id="lubrifiantId"
                    value={formik.values.lubrifiantId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="ID du lubrifiant"
                  />
                  {formik.touched.lubrifiantId &&
                    formik.errors.lubrifiantId && (
                      <div className="text-sm text-destructive">
                        {formik.errors.lubrifiantId}
                      </div>
                    )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qte">Quantité *</Label>
                  <Input
                    id="qte"
                    type="number"
                    step="0.01"
                    value={formik.values.qte}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="0.00"
                  />
                  {formik.touched.qte && formik.errors.qte && (
                    <div className="text-sm text-destructive">
                      {formik.errors.qte}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="typeconsommationlubId">
                  Type de consommation
                </Label>
                <Input
                  id="typeconsommationlubId"
                  value={formik.values.typeconsommationlubId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="ID du type de consommation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="obs">Observations</Label>
                <Textarea
                  id="obs"
                  value={formik.values.obs}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Observations supplémentaires..."
                  rows={3}
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              {isEditing ? "Modifier" : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
