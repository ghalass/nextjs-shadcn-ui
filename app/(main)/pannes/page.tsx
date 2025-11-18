"use client";

import { useState, useMemo, useRef } from "react";
import {
  usePannes,
  useTypesPanne,
  useOriginesPanne,
  useNiveauxUrgence,
  useEngins,
} from "@/hooks/usePannes";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Search,
  ChevronUp,
  ChevronDown,
  Filter,
  X,
  Download,
  Wrench,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { PanneModal } from "@/components/pannes/PanneModal";
import { DeletePanneModal } from "@/components/pannes/DeletePanneModal";
import { Panne } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

type SortField =
  | "code"
  | "description"
  | "dateApparition"
  | "dateExecution"
  | "niveauUrgence"
  | "engin"
  | "typepanne";
type SortDirection = "asc" | "desc";

interface ColumnFilters {
  code: string;
  description: string;
  engin: string;
  typepanne: string;
  niveauUrgence: string;
}

export default function PannesPage() {
  const { pannesQuery, createPanne, updatePanne, deletePanne } = usePannes();
  const { data: typesPanne } = useTypesPanne();
  const { data: originesPanne } = useOriginesPanne();
  const { data: niveauxUrgence } = useNiveauxUrgence();
  const { data: engins } = useEngins();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedPanne, setSelectedPanne] = useState<Panne | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFilters>({
    code: "",
    description: "",
    engin: "",
    typepanne: "",
    niveauUrgence: "",
  });
  const [sortField, setSortField] = useState<SortField>("dateApparition");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const columnFilterRefs = useRef<{
    code: HTMLInputElement | null;
    description: HTMLInputElement | null;
    engin: HTMLInputElement | null;
    typepanne: HTMLInputElement | null;
    niveauUrgence: HTMLInputElement | null;
  }>({
    code: null,
    description: null,
    engin: null,
    typepanne: null,
    niveauUrgence: null,
  });

  const handleCreate = (): void => {
    setSelectedPanne(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (panne: Panne): void => {
    setSelectedPanne(panne);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = (panne: Panne): void => {
    setSelectedPanne(panne);
    setError(null);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setError(null);
    setSelectedPanne(null);
  };

  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
    setError(null);
    setSelectedPanne(null);
  };

  const handleSort = (field: SortField): void => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handleColumnFilter = (
    column: keyof ColumnFilters,
    value: string
  ): void => {
    const activeElement = document.activeElement as HTMLInputElement;

    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
    setCurrentPage(1);

    setTimeout(() => {
      if (activeElement && columnFilterRefs.current[column]) {
        columnFilterRefs.current[column]?.focus();
        if (columnFilterRefs.current[column]) {
          const input = columnFilterRefs.current[column] as HTMLInputElement;
          input.setSelectionRange(input.value.length, input.value.length);
        }
      }
    }, 0);
  };

  const handleClearFilters = (): void => {
    setGlobalSearch("");
    setColumnFilters({
      code: "",
      description: "",
      engin: "",
      typepanne: "",
      niveauUrgence: "",
    });
    setCurrentPage(1);
  };

  const getUrgenceColor = (level: number): string => {
    switch (level) {
      case 1:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 2:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 3:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case 4:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusBadge = (panne: Panne) => {
    if (panne.dateCloture) {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Résolue
        </Badge>
      );
    } else if (panne.dateExecution) {
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          <Wrench className="h-3 w-3 mr-1" />
          En cours
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          <Clock className="h-3 w-3 mr-1" />
          En attente
        </Badge>
      );
    }
  };

  const filteredAndSortedPannes = useMemo((): Panne[] => {
    if (!pannesQuery.data) return [];

    const pannesData = pannesQuery.data as unknown as Panne[];
    let filtered = pannesData.filter((panne: Panne) => {
      const globalMatch =
        globalSearch === "" ||
        panne.code?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        panne.description.toLowerCase().includes(globalSearch.toLowerCase()) ||
        panne.engin?.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        panne.typepanne?.name
          .toLowerCase()
          .includes(globalSearch.toLowerCase()) ||
        panne.niveauUrgence?.name
          .toLowerCase()
          .includes(globalSearch.toLowerCase());

      const codeMatch =
        columnFilters.code === "" ||
        panne.code?.toLowerCase().includes(columnFilters.code.toLowerCase());
      const descriptionMatch =
        columnFilters.description === "" ||
        panne.description
          .toLowerCase()
          .includes(columnFilters.description.toLowerCase());
      const enginMatch =
        columnFilters.engin === "" ||
        panne.engin?.name
          .toLowerCase()
          .includes(columnFilters.engin.toLowerCase());
      const typepanneMatch =
        columnFilters.typepanne === "" ||
        panne.typepanne?.name
          .toLowerCase()
          .includes(columnFilters.typepanne.toLowerCase());
      const niveauUrgenceMatch =
        columnFilters.niveauUrgence === "" ||
        panne.niveauUrgence?.name
          .toLowerCase()
          .includes(columnFilters.niveauUrgence.toLowerCase());

      return Boolean(
        globalMatch &&
          codeMatch &&
          descriptionMatch &&
          enginMatch &&
          typepanneMatch &&
          niveauUrgenceMatch
      );
    });

    filtered.sort((a: Panne, b: Panne) => {
      let aValue: string | number | Date = "";
      let bValue: string | number | Date = "";

      switch (sortField) {
        case "code":
          aValue = a.code || "";
          bValue = b.code || "";
          break;
        case "description":
          aValue = a.description;
          bValue = b.description;
          break;
        case "dateApparition":
          aValue = new Date(a.dateApparition);
          bValue = new Date(b.dateApparition);
          break;
        case "dateExecution":
          aValue = a.dateExecution ? new Date(a.dateExecution) : new Date(0);
          bValue = b.dateExecution ? new Date(b.dateExecution) : new Date(0);
          break;
        case "niveauUrgence":
          aValue = a.niveauUrgence?.level || 0;
          bValue = b.niveauUrgence?.level || 0;
          break;
        case "engin":
          aValue = a.engin?.name || "";
          bValue = b.engin?.name || "";
          break;
        case "typepanne":
          aValue = a.typepanne?.name || "";
          bValue = b.typepanne?.name || "";
          break;
        default:
          aValue = new Date(a.dateApparition);
          bValue = new Date(b.dateApparition);
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

    return filtered;
  }, [pannesQuery.data, globalSearch, columnFilters, sortField, sortDirection]);

  const totalItems: number = filteredAndSortedPannes.length;
  const showAll: boolean = itemsPerPage === -1;
  const totalPages: number = showAll ? 1 : Math.ceil(totalItems / itemsPerPage);
  const startIndex: number = showAll ? 0 : (currentPage - 1) * itemsPerPage;
  const paginatedPannes: Panne[] = showAll
    ? filteredAndSortedPannes
    : filteredAndSortedPannes.slice(startIndex, startIndex + itemsPerPage);

  const displayError: string | null =
    error || pannesQuery.error?.message || null;

  const hasActiveFilters: boolean =
    globalSearch !== "" ||
    Object.values(columnFilters).some((filter) => filter !== "");

  const handleExportToExcel = (): void => {
    try {
      const exportData = filteredAndSortedPannes.map((panne: Panne) => ({
        Code: panne.code || "N/A",
        Description: panne.description,
        Engin: panne.engin?.name || "N/A",
        Site: panne.engin?.site?.name || "N/A",
        Type: panne.typepanne?.name || "N/A",
        Origine: panne.originePanne?.name || "N/A",
        "Niveau urgence": panne.niveauUrgence?.name || "N/A",
        "Date apparition": panne.dateApparition
          ? new Date(panne.dateApparition).toLocaleDateString("fr-FR")
          : "",
        "Date exécution": panne.dateExecution
          ? new Date(panne.dateExecution).toLocaleDateString("fr-FR")
          : "",
        "Date clôture": panne.dateCloture
          ? new Date(panne.dateCloture).toLocaleDateString("fr-FR")
          : "",
        "Temps arrêt (h)": panne.tempsArret || 0,
        "Coût estimé": panne.coutEstime || 0,
        Statut: panne.dateCloture
          ? "Résolue"
          : panne.dateExecution
          ? "En cours"
          : "En attente",
      }));

      const headers = Object.keys(exportData[0] || {}).join(";");
      const csvData = exportData
        .map((row) =>
          Object.values(row)
            .map((value) => `"${value}"`)
            .join(";")
        )
        .join("\n");

      const csvContent = `${headers}\n${csvData}`;

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `pannes_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de l'export Excel:", error);
      setError("Erreur lors de l'export des données");
    }
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1 group">
        {children}
        <div className="flex flex-col">
          <ChevronUp
            className={`h-3 w-3 -mb-1 ${
              sortField === field && sortDirection === "asc"
                ? "text-primary"
                : "text-muted-foreground opacity-40"
            }`}
          />
          <ChevronDown
            className={`h-3 w-3 -mt-1 ${
              sortField === field && sortDirection === "desc"
                ? "text-primary"
                : "text-muted-foreground opacity-40"
            }`}
          />
        </div>
      </div>
    </TableHead>
  );

  if (pannesQuery.isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-8 w-8" />
            Gestion des pannes
          </h1>
          <p className="text-muted-foreground mt-1">
            Suivez et traitez les pannes de vos engins miniers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExportToExcel}
            disabled={filteredAndSortedPannes.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter Excel
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle panne
          </Button>
        </div>
      </div>

      {displayError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans tous les champs..."
              value={globalSearch}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setGlobalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Effacer les filtres
            </Button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filtres actifs</span>
            {globalSearch && (
              <Badge variant="secondary" className="text-xs">
                Recherche: "{globalSearch}"
              </Badge>
            )}
            {Object.entries(columnFilters).map(
              ([key, value]) =>
                value && (
                  <Badge key={key} variant="secondary" className="text-xs">
                    {key}: "{value}"
                  </Badge>
                )
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Afficher</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value: string) => {
                const newItemsPerPage = value === "all" ? -1 : Number(value);
                setItemsPerPage(newItemsPerPage);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="all">Tout afficher</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {showAll ? "éléments" : "éléments par page"}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            {totalItems} panne(s) trouvée(s)
            {!showAll &&
              totalPages > 1 &&
              ` • Page ${currentPage}/${totalPages}`}
          </span>
        </div>

        {filteredAndSortedPannes.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {filteredAndSortedPannes.length} ligne(s) exportable(s)
          </div>
        )}
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader field="code">
                <div className="space-y-2">
                  <div className="font-medium">Code</div>
                  <Input
                    ref={(el: HTMLInputElement | null) => {
                      columnFilterRefs.current.code = el;
                    }}
                    placeholder="Filtrer..."
                    value={columnFilters.code}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleColumnFilter("code", e.target.value)
                    }
                    className="h-7 text-xs"
                    onClick={(e: React.MouseEvent<HTMLInputElement>) =>
                      e.stopPropagation()
                    }
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </SortableHeader>

              <SortableHeader field="description">
                <div className="space-y-2">
                  <div className="font-medium">Description</div>
                  <Input
                    ref={(el: HTMLInputElement | null) => {
                      columnFilterRefs.current.description = el;
                    }}
                    placeholder="Filtrer..."
                    value={columnFilters.description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleColumnFilter("description", e.target.value)
                    }
                    className="h-7 text-xs"
                    onClick={(e: React.MouseEvent<HTMLInputElement>) =>
                      e.stopPropagation()
                    }
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </SortableHeader>

              <SortableHeader field="engin">
                <div className="space-y-2">
                  <div className="font-medium">Engin</div>
                  <Input
                    ref={(el: HTMLInputElement | null) => {
                      columnFilterRefs.current.engin = el;
                    }}
                    placeholder="Filtrer..."
                    value={columnFilters.engin}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleColumnFilter("engin", e.target.value)
                    }
                    className="h-7 text-xs"
                    onClick={(e: React.MouseEvent<HTMLInputElement>) =>
                      e.stopPropagation()
                    }
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </SortableHeader>

              <SortableHeader field="typepanne">
                <div className="space-y-2">
                  <div className="font-medium">Type</div>
                  <Input
                    ref={(el: HTMLInputElement | null) => {
                      columnFilterRefs.current.typepanne = el;
                    }}
                    placeholder="Filtrer..."
                    value={columnFilters.typepanne}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleColumnFilter("typepanne", e.target.value)
                    }
                    className="h-7 text-xs"
                    onClick={(e: React.MouseEvent<HTMLInputElement>) =>
                      e.stopPropagation()
                    }
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </SortableHeader>

              <SortableHeader field="niveauUrgence">
                <div className="space-y-2">
                  <div className="font-medium">Urgence</div>
                  <Input
                    ref={(el: HTMLInputElement | null) => {
                      columnFilterRefs.current.niveauUrgence = el;
                    }}
                    placeholder="Filtrer..."
                    value={columnFilters.niveauUrgence}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleColumnFilter("niveauUrgence", e.target.value)
                    }
                    className="h-7 text-xs"
                    onClick={(e: React.MouseEvent<HTMLInputElement>) =>
                      e.stopPropagation()
                    }
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </SortableHeader>

              <SortableHeader field="dateApparition">
                <span className="font-medium">Date apparition</span>
              </SortableHeader>

              <TableHead className="text-right">
                <span className="font-medium">Statut</span>
              </TableHead>

              <TableHead className="text-right">
                <span className="font-medium">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPannes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-10 text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <AlertTriangle className="h-12 w-12 opacity-20" />
                    {pannesQuery.data?.length === 0
                      ? "Aucune panne trouvée"
                      : "Aucun résultat correspondant aux filtres"}
                    {filteredAndSortedPannes.length === 0 &&
                      pannesQuery.data &&
                      pannesQuery.data.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearFilters}
                          className="mt-2"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Effacer les filtres
                        </Button>
                      )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedPannes.map((panne: Panne) => (
                <TableRow key={panne.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {panne.code || "N/A"}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {panne.description}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{panne.engin?.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {panne.engin?.site?.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{panne.typepanne?.name}</Badge>
                  </TableCell>
                  <TableCell>
                    {panne.niveauUrgence && (
                      <Badge
                        className={getUrgenceColor(panne.niveauUrgence.level)}
                      >
                        {panne.niveauUrgence.name}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(panne.dateApparition).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-right">
                    {getStatusBadge(panne)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(panne)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(panne)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!showAll && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-sm text-muted-foreground">
            Affichage de <strong>{startIndex + 1}</strong> à{" "}
            <strong>{Math.min(startIndex + itemsPerPage, totalItems)}</strong>{" "}
            sur <strong>{totalItems}</strong> pannes
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev: number) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronDown className="h-4 w-4 rotate-90" />
              Précédent
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Suivant
              <ChevronUp className="h-4 w-4 rotate-90" />
            </Button>
          </div>
        </div>
      )}

      <PanneModal
        open={isModalOpen}
        onClose={handleCloseModal}
        panne={selectedPanne}
        typesPanne={typesPanne || []}
        originesPanne={originesPanne || []}
        niveauxUrgence={niveauxUrgence || []}
        engins={engins || []}
        createPanne={createPanne}
        updatePanne={updatePanne}
      />

      <DeletePanneModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        panne={selectedPanne}
        deletePanne={deletePanne}
      />
    </div>
  );
}
