"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, AlertTriangle } from "lucide-react";
import { Panne } from "@/lib/types";

interface DeletePanneModalProps {
  open: boolean;
  onClose: () => void;
  panne: Panne | null;
  deletePanne: any;
}

export function DeletePanneModal({
  open,
  onClose,
  panne,
  deletePanne,
}: DeletePanneModalProps) {
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!panne) return;

    try {
      setError(null);
      await deletePanne.mutateAsync(panne.id);
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue lors de la suppression"
      );
    }
  };

  const isLoading = deletePanne.isLoading;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Supprimer la panne
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette panne ? Cette action est
            irréversible.
          </DialogDescription>
        </DialogHeader>

        {panne && (
          <div className="space-y-2">
            <div className="font-medium">{panne.code || "Panne sans code"}</div>
            <div className="text-sm text-muted-foreground">
              {panne.description}
            </div>
            <div className="text-sm text-muted-foreground">
              Engin: {panne.engin?.name}
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
