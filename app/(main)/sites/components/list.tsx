"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSites } from "@/hooks/useSites";

import CreateSite from "./create";
import DeleteSite from "./delete";
import UpdateSite from "./update";
import { Spinner } from "@/components/ui/spinner";

const SitesList = () => {
  const {
    data: sites,
    updateSite,
    deleteSite,
    createSite,
    isPending,
  } = useSites();

  return (
    <div>
      <div className="flex justify-between items-center">
        <CreateSite createSite={createSite} />
        {isPending && (
          <small className="flex gap-0.5 items-center">
            <Spinner /> Chargement...
          </small>
        )}
      </div>
      <Table>
        <TableCaption>La liste des sites ({sites?.length})</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sites?.map((site) => (
            <TableRow key={site.id}>
              <TableCell>{site.name}</TableCell>
              <TableCell>{site.active ? "Actif" : "Inactif"}</TableCell>
              <TableCell className="text-right ">
                <div className="flex gap-0.5 justify-end">
                  {/* <UpdateSite site={site} updateSite={updateSite} /> */}
                  <DeleteSite site={site} deleteSite={deleteSite} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SitesList;
