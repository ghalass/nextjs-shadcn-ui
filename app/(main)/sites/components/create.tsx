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
import {
  IconCloudUp,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

import { useSites } from "@/hooks/useSites";

interface CreateSiteDialogProps {
  createSite: ReturnType<typeof useSites>["createSite"];
}

const CreateSite = ({ createSite }: CreateSiteDialogProps) => {
  const [siteToCreate, setSiteToCreate] = useState({
    name: "",
    active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSite.mutate({
      name: siteToCreate.name,
      active: siteToCreate.active,
    });
    toast.success("Ajouté avec succès");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"} variant="outline">
          <IconPlus color="blue" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()} // empêche fermeture en dehors
        onEscapeKeyDown={(e) => e.preventDefault()} // empêche fermeture avec Esc
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nouveau</DialogTitle>
            <DialogDescription>
              Make changes to your site here. Click save when done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor={`name`}>Nom du site</Label>
              <Input
                autoFocus
                id={`name`}
                name="name"
                value={siteToCreate.name} // ✅ corrigé
                onChange={(e) =>
                  setSiteToCreate({ ...siteToCreate, name: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between mt-2">
            <div>
              <DialogClose asChild>
                <Button variant="outline" disabled={createSite.isPending}>
                  Annuler
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="ml-2"
                disabled={createSite.isPending}
              >
                {createSite.isPending ? <Spinner /> : <IconCloudUp />} Ajouter
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSite;
