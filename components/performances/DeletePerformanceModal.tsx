// components/performances/DeletePerformanceModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Saisiehrm, Saisiehim, Saisielubrifiant } from "@/lib/types";

interface DeletePerformanceModalProps {
  open: boolean;
  onClose: () => void;
  type: "saisiehrm" | "saisiehim" | "saisielubrifiant";
  item: Saisiehrm | Saisiehim | Saisielubrifiant | null;
  deleteSaisiehrm: any;
  deleteSaisiehim: any;
  deleteSaisielubrifiant: any;
}

export function DeletePerformanceModal({
  open,
  onClose,
  type,
  item,
  deleteSaisiehrm,
  deleteSaisiehim,
  deleteSaisielubrifiant,
}: DeletePerformanceModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getItemDescription = () => {
    if (!item) return "";

    switch (type) {
      case "saisiehrm":
        const hrm = item as Saisiehrm;
        return `HRM du ${new Date(hrm.du).toLocaleDateString("fr-FR")} - ${
          hrm.hrm
        } heures`;
      case "saisiehim":
        const him = item as Saisiehim;
        return `HIM - ${him.him} heures (NI: ${him.ni})`;
      case "saisielubrifiant":
        const lub = item as Saisielubrifiant;
        return `Consommation - ${lub.qte} unités`;
      default:
        return "";
    }
  };

  const handleDelete = async () => {
    if (!item) return;

    setIsDeleting(true);
    setError(null);

    try {
      switch (type) {
        case "saisiehrm":
          await deleteSaisiehrm.mutateAsync(item.id);
          break;
        case "saisiehim":
          await deleteSaisiehim.mutateAsync(item.id);
          break;
        case "saisielubrifiant":
          await deleteSaisielubrifiant.mutateAsync(item.id);
          break;
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case "saisiehrm":
        return "Supprimer la saisie HRM";
      case "saisiehim":
        return "Supprimer la saisie HIM";
      case "saisielubrifiant":
        return "Supprimer la saisie de lubrifiant";
      default:
        return "Supprimer la saisie";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette saisie ? Cette action est
            irréversible.
          </DialogDescription>
        </DialogHeader>

        {item && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium">{getItemDescription()}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Engin: {(item as any).engin?.name || "N/A"} | Site:{" "}
              {(item as any).site?.name || "N/A"}
            </p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Supprimer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
