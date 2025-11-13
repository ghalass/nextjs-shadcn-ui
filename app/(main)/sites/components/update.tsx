"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconCloudUp, IconPencil } from "@tabler/icons-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useUpdateSite } from "@/hooks/useUpdateSite";

interface EditSiteDialogProps {
  site: {
    id: string;
    name: string;
    active?: boolean;
  };
}

const UpdateSite = ({ site }: EditSiteDialogProps) => {
  const updateSite = useUpdateSite();
  const [error, setError] = useState("");

  const [siteToUpdate, setSiteToUpdate] = useState({
    name: site.name,
    active: site.active,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSite.mutateAsync({
        id: site.id,
        name: siteToUpdate.name,
        active: siteToUpdate.active,
      });

      toast.success("Modifié avec succès 🎉");
    } catch (error: any) {
      setError(error.message || "Une erreur est survenue 😢");
      toast.error(error.message || "Une erreur est survenue 😢");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <IconPencil color="green" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modifier</DialogTitle>
            <DialogDescription>
              Modifie les informations du site, puis clique sur “Modifier”.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor={`name-${site.id}`}>Nom du site</Label>
              <Input
                className={
                  error ? "border-red-500 focus-visible:ring-red-500" : ""
                }
                id={`name-${site.id}`}
                name="name"
                value={siteToUpdate.name}
                onChange={(e) =>
                  setSiteToUpdate({ ...siteToUpdate, name: e.target.value })
                }
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>

          <DialogFooter className="flex justify-between mt-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={updateSite.isPending}>
                Annuler
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="ml-2"
              disabled={updateSite.isPending}
            >
              {updateSite.isPending ? <Spinner /> : <IconCloudUp />} Modifier
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSite;
