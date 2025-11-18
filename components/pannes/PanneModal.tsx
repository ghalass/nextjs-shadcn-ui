"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useFormik } from "formik";
import yup from "@/lib/yupFr"; // Import corrigé - utilise yup directement depuis votre fichier configuré
import {
  Panne,
  TypePanne,
  OriginePanne,
  NiveauUrgence,
  Engin,
} from "@/lib/types";

// Configuration de Yup avec les locales françaises
yup.setLocale({
  mixed: {
    required: "Ce champ est obligatoire",
    notType: "Format invalide",
  },
  string: {
    min: "Doit contenir au moins ${min} caractères",
    max: "Doit contenir au plus ${max} caractères",
    email: "Adresse email invalide",
  },
  number: {
    min: "Doit être supérieur ou égal à ${min}",
    max: "Doit être inférieur ou égal à ${max}",
    positive: "Doit être un nombre positif",
  },
  date: {
    min: "Doit être après ${min}",
    max: "Doit être avant ${max}",
  },
});

const validationSchema = yup.object({
  description: yup.string().required(),
  dateApparition: yup.date().required(),
  dateExecution: yup.date().nullable(),
  dateCloture: yup.date().nullable(),
  observations: yup.string().nullable(),
  tempsArret: yup.number().min(0).nullable(),
  coutEstime: yup.number().min(0).nullable(),
  typepanneId: yup.string().required(),
  originePanneId: yup.string().required(),
  niveauUrgenceId: yup.string().required(),
  enginId: yup.string().required(),
});

interface PanneModalProps {
  open: boolean;
  onClose: () => void;
  panne: Panne | null;
  typesPanne: TypePanne[];
  originesPanne: OriginePanne[];
  niveauxUrgence: NiveauUrgence[];
  engins: Engin[];
  createPanne: any;
  updatePanne: any;
}

export function PanneModal({
  open,
  onClose,
  panne,
  typesPanne,
  originesPanne,
  niveauxUrgence,
  engins,
  createPanne,
  updatePanne,
}: PanneModalProps) {
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      description: panne?.description || "",
      dateApparition: panne?.dateApparition
        ? new Date(panne.dateApparition).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      dateExecution: panne?.dateExecution
        ? new Date(panne.dateExecution).toISOString().split("T")[0]
        : "",
      dateCloture: panne?.dateCloture
        ? new Date(panne.dateCloture).toISOString().split("T")[0]
        : "",
      observations: panne?.observations || "",
      tempsArret: panne?.tempsArret || 0,
      coutEstime: panne?.coutEstime || 0,
      typepanneId: panne?.typepanneId || "",
      originePanneId: panne?.originePanneId || "",
      niveauUrgenceId: panne?.niveauUrgenceId || "",
      enginId: panne?.enginId || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError(null);

        const formattedValues = {
          ...values,
          dateApparition: new Date(values.dateApparition).toISOString(),
          dateExecution: values.dateExecution
            ? new Date(values.dateExecution).toISOString()
            : null,
          dateCloture: values.dateCloture
            ? new Date(values.dateCloture).toISOString()
            : null,
          tempsArret: values.tempsArret || null,
          coutEstime: values.coutEstime || null,
        };

        if (panne) {
          await updatePanne.mutateAsync({
            id: panne.id,
            data: formattedValues,
          });
        } else {
          await createPanne.mutateAsync(formattedValues);
        }

        onClose();
      } catch (err: any) {
        setError(err.response?.data?.message || "Une erreur est survenue");
      }
    },
  });

  useEffect(() => {
    if (open && panne) {
      formik.setValues({
        description: panne.description,
        dateApparition: new Date(panne.dateApparition)
          .toISOString()
          .split("T")[0],
        dateExecution: panne.dateExecution
          ? new Date(panne.dateExecution).toISOString().split("T")[0]
          : "",
        dateCloture: panne.dateCloture
          ? new Date(panne.dateCloture).toISOString().split("T")[0]
          : "",
        observations: panne.observations || "",
        tempsArret: panne.tempsArret || 0,
        coutEstime: panne.coutEstime || 0,
        typepanneId: panne.typepanneId,
        originePanneId: panne.originePanneId,
        niveauUrgenceId: panne.niveauUrgenceId,
        enginId: panne.enginId,
      });
    } else if (open && !panne) {
      formik.resetForm();
    }
  }, [open, panne]);

  const isLoading = createPanne.isLoading || updatePanne.isLoading;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {panne ? "Modifier la panne" : "Nouvelle panne"}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
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
                  <SelectValue placeholder="Sélectionner un engin" />
                </SelectTrigger>
                <SelectContent>
                  {engins.map((engin) => (
                    <SelectItem key={engin.id} value={engin.id}>
                      {engin.name} - {engin.site?.name}
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
              <Label htmlFor="typepanneId">Type de panne *</Label>
              <Select
                value={formik.values.typepanneId}
                onValueChange={(value) =>
                  formik.setFieldValue("typepanneId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {typesPanne.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.typepanneId && formik.errors.typepanneId && (
                <div className="text-sm text-destructive">
                  {formik.errors.typepanneId}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="originePanneId">Origine *</Label>
              <Select
                value={formik.values.originePanneId}
                onValueChange={(value) =>
                  formik.setFieldValue("originePanneId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une origine" />
                </SelectTrigger>
                <SelectContent>
                  {originesPanne.map((origine) => (
                    <SelectItem key={origine.id} value={origine.id}>
                      {origine.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.originePanneId &&
                formik.errors.originePanneId && (
                  <div className="text-sm text-destructive">
                    {formik.errors.originePanneId}
                  </div>
                )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="niveauUrgenceId">Niveau d'urgence *</Label>
              <Select
                value={formik.values.niveauUrgenceId}
                onValueChange={(value) =>
                  formik.setFieldValue("niveauUrgenceId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  {niveauxUrgence.map((niveau) => (
                    <SelectItem key={niveau.id} value={niveau.id}>
                      {niveau.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.niveauUrgenceId &&
                formik.errors.niveauUrgenceId && (
                  <div className="text-sm text-destructive">
                    {formik.errors.niveauUrgenceId}
                  </div>
                )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Décrivez la panne en détail..."
              rows={3}
            />
            {formik.touched.description && formik.errors.description && (
              <div className="text-sm text-destructive">
                {formik.errors.description}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateApparition">Date d'apparition *</Label>
              <Input
                type="date"
                id="dateApparition"
                name="dateApparition"
                value={formik.values.dateApparition}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.dateApparition &&
                formik.errors.dateApparition && (
                  <div className="text-sm text-destructive">
                    {formik.errors.dateApparition}
                  </div>
                )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateExecution">Date d'exécution</Label>
              <Input
                type="date"
                id="dateExecution"
                name="dateExecution"
                value={formik.values.dateExecution}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateCloture">Date de clôture</Label>
              <Input
                type="date"
                id="dateCloture"
                name="dateCloture"
                value={formik.values.dateCloture}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tempsArret">Temps d'arrêt (heures)</Label>
              <Input
                type="number"
                id="tempsArret"
                name="tempsArret"
                value={formik.values.tempsArret}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min="0"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coutEstime">Coût estimé</Label>
              <Input
                type="number"
                id="coutEstime"
                name="coutEstime"
                value={formik.values.coutEstime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observations</Label>
            <Textarea
              id="observations"
              name="observations"
              value={formik.values.observations}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Observations supplémentaires..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {panne ? "Modifier" : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
