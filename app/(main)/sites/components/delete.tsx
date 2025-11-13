"use client";

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
import { useSites } from "@/hooks/useSites";
import { IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";

interface DeleteSiteDialogProps {
  site: {
    id: string;
    name: string;
    active?: boolean;
  };
  deleteSite: ReturnType<typeof useSites>["deleteSite"];
}

const DeleteSite = ({ site, deleteSite }: DeleteSiteDialogProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    deleteSite.mutate(site.id);
    toast.error("Supprimé avec succès");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"} variant="outline">
          <IconTrash color="red" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()} // empêche fermeture en dehors
        onEscapeKeyDown={(e) => e.preventDefault()} // empêche fermeture avec Esc
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Supprimer</DialogTitle>
            <DialogDescription>
              Make changes to your site here. Click save when done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor={`name-${site.id}`}>Nom du site</Label>
              <Input
                id={`name-${site.id}`}
                name="name"
                value={site.name} // ✅ corrigé
                disabled
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between mt-2">
            <div>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button variant="destructive" type="submit" className="ml-2">
                <IconTrash /> Supprimer
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSite;
