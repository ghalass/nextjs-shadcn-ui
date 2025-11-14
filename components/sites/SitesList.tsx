// components/sites/SitesList.tsx
"use client";

import { Site } from "@/hooks/useSites";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Edit, Trash2, Plus } from "lucide-react";
import { CanAccess } from "../CanAccess";

interface SitesListProps {
  sites: Site[];
  isLoading: boolean;
  onEdit: (site: Site) => void;
  onDelete: (site: Site) => void;
  onCreate: () => void;
  isDeleting?: string | null;
}

export function SitesList({
  sites,
  isLoading,
  onEdit,
  onDelete,
  onCreate,
  isDeleting,
}: SitesListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Liste des sites</h2>

        <CanAccess action="create" resource="sites">
          <Button onClick={onCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau site
          </Button>
        </CanAccess>
      </div>

      {sites.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-muted-foreground">Aucun site trouvé</p>
          <Button onClick={onCreate} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Créer le premier site
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>
                    <Badge variant={site.active ? "default" : "secondary"}>
                      {site.active ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(site.createdAt).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <CanAccess action="update" resource="sites">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(site)}
                          disabled={isDeleting === site.id}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </CanAccess>

                      <CanAccess action="delete" resource="sites">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(site)}
                          disabled={isDeleting === site.id}
                        >
                          {isDeleting === site.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </CanAccess>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
