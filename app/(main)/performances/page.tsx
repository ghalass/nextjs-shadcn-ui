// app/(main)/performances/page.tsx
"use client";

import { useState, useMemo, useRef } from "react";
import { usePerformances } from "@/hooks/usePerformances";
import { useEngins } from "@/hooks/useEngins";
import { useSites } from "@/hooks/useSites";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  BarChart3,
  Calendar,
  Truck,
  Wrench,
  Droplets,
} from "lucide-react";
import { PerformanceModal } from "@/components/performances/PerformanceModal";
import { DeletePerformanceModal } from "@/components/performances/DeletePerformanceModal";
import {
  Saisiehrm,
  Saisiehim,
  Saisielubrifiant,
  PerformanceFilters,
} from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type PerformanceType = "saisiehrm" | "saisiehim" | "saisielubrifiant";
type SortField = "date" | "engin" | "site" | "valeur" | "origine" | "createdAt";
type SortDirection = "asc" | "desc";

interface ColumnFilters {
  engin: string;
  site: string;
  origine: string;
  valeur: string;
}

export default function SaisiePerformancesPage() {
  const [activeTab, setActiveTab] = useState<PerformanceType>("saisiehrm");
  const [filters, setFilters] = useState<PerformanceFilters>({
    type: "saisiehrm",
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<
    Saisiehrm | Saisiehim | Saisielubrifiant | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFilters>({
    engin: "",
    site: "",
    origine: "",
    valeur: "",
  });
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const {
    saisiehrmsQuery,
    saisiehimsQuery,
    saisielubrifiantsQuery,
    origineSaisiesQuery,
    createSaisiehrm,
    updateSaisiehrm,
    deleteSaisiehrm,
    createSaisiehim,
    updateSaisiehim,
    deleteSaisiehim,
    createSaisielubrifiant,
    updateSaisielubrifiant,
    deleteSaisielubrifiant,
  } = usePerformances(filters);

  const { enginsQuery } = useEngins();
  const { sitesQuery } = useSites();

  const handleCreate = (): void => {
    setSelectedItem(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Saisiehrm | Saisiehim | Saisielubrifiant): void => {
    setSelectedItem(item);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = (
    item: Saisiehrm | Saisiehim | Saisielubrifiant
  ): void => {
    setSelectedItem(item);
    setError(null);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setError(null);
    setSelectedItem(null);
  };

  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
    setError(null);
    setSelectedItem(null);
  };

  const handleTabChange = (value: string): void => {
    setActiveTab(value as PerformanceType);
    setFilters((prev) => ({ ...prev, type: value as PerformanceType }));
    setCurrentPage(1);
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
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
    setCurrentPage(1);
  };

  const handleClearFilters = (): void => {
    setGlobalSearch("");
    setColumnFilters({
      engin: "",
      site: "",
      origine: "",
      valeur: "",
    });
    setCurrentPage(1);
  };

  // Données filtrées et triées
  const getFilteredAndSortedData = useMemo(() => {
    let data: any[] = [];

    switch (activeTab) {
      case "saisiehrm":
        data = saisiehrmsQuery.data || [];
        break;
      case "saisiehim":
        data = saisiehimsQuery.data || [];
        break;
      case "saisielubrifiant":
        data = saisielubrifiantsQuery.data || [];
        break;
    }

    let filtered = data.filter((item: any) => {
      const globalMatch =
        globalSearch === "" ||
        item.engin?.name?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        item.site?.name?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        item.origineSaisie?.name
          ?.toLowerCase()
          .includes(globalSearch.toLowerCase()) ||
        (activeTab === "saisiehrm" &&
          item.hrm?.toString().includes(globalSearch)) ||
        (activeTab === "saisiehim" &&
          item.him?.toString().includes(globalSearch)) ||
        (activeTab === "saisielubrifiant" &&
          item.qte?.toString().includes(globalSearch));

      const enginMatch =
        columnFilters.engin === "" ||
        item.engin?.name
          ?.toLowerCase()
          .includes(columnFilters.engin.toLowerCase());

      const siteMatch =
        columnFilters.site === "" ||
        item.site?.name
          ?.toLowerCase()
          .includes(columnFilters.site.toLowerCase());

      const origineMatch =
        columnFilters.origine === "" ||
        item.origineSaisie?.name
          ?.toLowerCase()
          .includes(columnFilters.origine.toLowerCase());

      const valeurMatch =
        columnFilters.valeur === "" ||
        (activeTab === "saisiehrm" &&
          item.hrm?.toString().includes(columnFilters.valeur)) ||
        (activeTab === "saisiehim" &&
          item.him?.toString().includes(columnFilters.valeur)) ||
        (activeTab === "saisielubrifiant" &&
          item.qte?.toString().includes(columnFilters.valeur));

      return Boolean(
        globalMatch && enginMatch && siteMatch && origineMatch && valeurMatch
      );
    });

    filtered.sort((a: any, b: any) => {
      let aValue: any = "";
      let bValue: any = "";

      switch (sortField) {
        case "date":
          aValue = a.du || a.createdAt;
          bValue = b.du || b.createdAt;
          break;
        case "engin":
          aValue = a.engin?.name || "";
          bValue = b.engin?.name || "";
          break;
        case "site":
          aValue = a.site?.name || "";
          bValue = b.site?.name || "";
          break;
        case "valeur":
          aValue = a.hrm || a.him || a.qte || 0;
          bValue = b.hrm || b.him || b.qte || 0;
          break;
        case "origine":
          aValue = a.origineSaisie?.name || "";
          bValue = b.origineSaisie?.name || "";
          break;
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      } else {
        return sortDirection === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      }
    });

    return filtered;
  }, [
    activeTab,
    saisiehrmsQuery.data,
    saisiehimsQuery.data,
    saisielubrifiantsQuery.data,
    globalSearch,
    columnFilters,
    sortField,
    sortDirection,
  ]);

  const totalItems: number = getFilteredAndSortedData.length;
  const showAll: boolean = itemsPerPage === -1;
  const totalPages: number = showAll ? 1 : Math.ceil(totalItems / itemsPerPage);
  const startIndex: number = showAll ? 0 : (currentPage - 1) * itemsPerPage;
  const paginatedData = showAll
    ? getFilteredAndSortedData
    : getFilteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

  const displayError: string | null =
    error ||
    saisiehrmsQuery.error?.message ||
    saisiehimsQuery.error?.message ||
    saisielubrifiantsQuery.error?.message ||
    null;

  const hasActiveFilters: boolean =
    globalSearch !== "" ||
    Object.values(columnFilters).some((filter) => filter !== "");

  const handleExportToExcel = (): void => {
    try {
      const exportData = getFilteredAndSortedData.map((item: any) => {
        const baseData = {
          Engin: item.engin?.name || "N/A",
          Site: item.site?.name || "N/A",
          "Origine saisie": item.origineSaisie?.name || "N/A",
          "Date création": new Date(item.createdAt).toLocaleDateString("fr-FR"),
        };

        switch (activeTab) {
          case "saisiehrm":
            return {
              ...baseData,
              Date: item.du
                ? new Date(item.du).toLocaleDateString("fr-FR")
                : "N/A",
              HRM: item.hrm,
            };
          case "saisiehim":
            return {
              ...baseData,
              HIM: item.him,
              NI: item.ni,
              Observations: item.obs || "N/A",
              Panne: item.panne?.code || "N/A",
            };
          case "saisielubrifiant":
            return {
              ...baseData,
              Lubrifiant: item.lubrifiant?.name || "N/A",
              Quantité: item.qte,
              "Type consommation": item.typeconsommationlub?.name || "N/A",
              Observations: item.obs || "N/A",
            };
          default:
            return baseData;
        }
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        `Performances_${activeTab}`
      );

      XLSX.writeFile(
        workbook,
        `performances_${activeTab}_${
          new Date().toISOString().split("T")[0]
        }.xlsx`
      );
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

  const getTableHeaders = () => {
    const commonHeaders = [
      <SortableHeader key="date" field="date">
        <div className="space-y-2">
          <div className="font-medium">Date</div>
        </div>
      </SortableHeader>,
      <SortableHeader key="engin" field="engin">
        <div className="space-y-2">
          <div className="font-medium">Engin</div>
          <Input
            placeholder="Filtrer..."
            value={columnFilters.engin}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleColumnFilter("engin", e.target.value)
            }
            className="h-7 text-xs"
            onClick={(e: React.MouseEvent<HTMLInputElement>) =>
              e.stopPropagation()
            }
          />
        </div>
      </SortableHeader>,
      <SortableHeader key="site" field="site">
        <div className="space-y-2">
          <div className="font-medium">Site</div>
          <Input
            placeholder="Filtrer..."
            value={columnFilters.site}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleColumnFilter("site", e.target.value)
            }
            className="h-7 text-xs"
            onClick={(e: React.MouseEvent<HTMLInputElement>) =>
              e.stopPropagation()
            }
          />
        </div>
      </SortableHeader>,
      <SortableHeader key="origine" field="origine">
        <div className="space-y-2">
          <div className="font-medium">Origine</div>
          <Input
            placeholder="Filtrer..."
            value={columnFilters.origine}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleColumnFilter("origine", e.target.value)
            }
            className="h-7 text-xs"
            onClick={(e: React.MouseEvent<HTMLInputElement>) =>
              e.stopPropagation()
            }
          />
        </div>
      </SortableHeader>,
    ];

    switch (activeTab) {
      case "saisiehrm":
        return [
          ...commonHeaders,
          <SortableHeader key="valeur" field="valeur">
            <div className="space-y-2">
              <div className="font-medium">HRM</div>
              <Input
                placeholder="Filtrer..."
                value={columnFilters.valeur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleColumnFilter("valeur", e.target.value)
                }
                className="h-7 text-xs"
                onClick={(e: React.MouseEvent<HTMLInputElement>) =>
                  e.stopPropagation()
                }
              />
            </div>
          </SortableHeader>,
        ];
      case "saisiehim":
        return [
          ...commonHeaders,
          <SortableHeader key="valeur" field="valeur">
            <div className="space-y-2">
              <div className="font-medium">HIM</div>
              <Input
                placeholder="Filtrer..."
                value={columnFilters.valeur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleColumnFilter("valeur", e.target.value)
                }
                className="h-7 text-xs"
                onClick={(e: React.MouseEvent<HTMLInputElement>) =>
                  e.stopPropagation()
                }
              />
            </div>
          </SortableHeader>,
          <TableHead key="ni" className="font-medium">
            NI
          </TableHead>,
          <TableHead key="panne" className="font-medium">
            Panne
          </TableHead>,
        ];
      case "saisielubrifiant":
        return [
          ...commonHeaders,
          <SortableHeader key="valeur" field="valeur">
            <div className="space-y-2">
              <div className="font-medium">Quantité</div>
              <Input
                placeholder="Filtrer..."
                value={columnFilters.valeur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleColumnFilter("valeur", e.target.value)
                }
                className="h-7 text-xs"
                onClick={(e: React.MouseEvent<HTMLInputElement>) =>
                  e.stopPropagation()
                }
              />
            </div>
          </SortableHeader>,
          <TableHead key="lubrifiant" className="font-medium">
            Lubrifiant
          </TableHead>,
          <TableHead key="type" className="font-medium">
            Type consommation
          </TableHead>,
        ];
    }
  };

  const getTableRows = () => {
    if (paginatedData.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={getTableHeaders().length + 1}
            className="text-center py-10 text-muted-foreground"
          >
            <div className="flex flex-col items-center gap-2">
              <BarChart3 className="h-12 w-12 opacity-20" />
              {saisiehrmsQuery.data?.length === 0 && activeTab === "saisiehrm"
                ? "Aucune saisie HRM trouvée"
                : saisiehimsQuery.data?.length === 0 &&
                  activeTab === "saisiehim"
                ? "Aucune saisie HIM trouvée"
                : saisielubrifiantsQuery.data?.length === 0 &&
                  activeTab === "saisielubrifiant"
                ? "Aucune saisie lubrifiant trouvée"
                : "Aucun résultat correspondant aux filtres"}
              {getFilteredAndSortedData.length === 0 &&
                ((saisiehrmsQuery.data && saisiehrmsQuery.data.length > 0) ||
                  (saisiehimsQuery.data && saisiehimsQuery.data.length > 0) ||
                  (saisielubrifiantsQuery.data &&
                    saisielubrifiantsQuery.data.length > 0)) && (
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
      );
    }

    return paginatedData.map((item: any) => (
      <TableRow key={item.id} className="hover:bg-muted/50">
        <TableCell className="font-medium">
          {item.du
            ? format(new Date(item.du), "dd/MM/yyyy", { locale: fr })
            : format(new Date(item.createdAt), "dd/MM/yyyy", { locale: fr })}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            {item.engin?.name || "N/A"}
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="secondary">{item.site?.name || "N/A"}</Badge>
        </TableCell>
        <TableCell>
          <Badge variant="outline">{item.origineSaisie?.name || "N/A"}</Badge>
        </TableCell>

        {activeTab === "saisiehrm" && (
          <>
            <TableCell className="font-mono">{item.hrm?.toFixed(2)}</TableCell>
          </>
        )}

        {activeTab === "saisiehim" && (
          <>
            <TableCell className="font-mono">{item.him?.toFixed(2)}</TableCell>
            <TableCell>{item.ni}</TableCell>
            <TableCell>
              {item.panne?.code ? (
                <Badge variant="outline" className="text-xs">
                  {item.panne.code}
                </Badge>
              ) : (
                "N/A"
              )}
            </TableCell>
          </>
        )}

        {activeTab === "saisielubrifiant" && (
          <>
            <TableCell className="font-mono">{item.qte?.toFixed(2)}</TableCell>
            <TableCell>{item.lubrifiant?.name || "N/A"}</TableCell>
            <TableCell>
              {item.typeconsommationlub?.name ? (
                <Badge variant="outline" className="text-xs">
                  {item.typeconsommationlub.name}
                </Badge>
              ) : (
                "N/A"
              )}
            </TableCell>
          </>
        )}

        <TableCell className="text-right">
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(item)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(item)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  const isLoading =
    saisiehrmsQuery.isLoading ||
    saisiehimsQuery.isLoading ||
    saisielubrifiantsQuery.isLoading ||
    origineSaisiesQuery.isLoading ||
    enginsQuery.isLoading ||
    sitesQuery.isLoading;

  if (isLoading) {
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
            <BarChart3 className="h-8 w-8" />
            Saisie des performances
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez les saisies HRM, HIM et consommation de lubrifiants
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExportToExcel}
            disabled={getFilteredAndSortedData.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter Excel
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle saisie
          </Button>
        </div>
      </div>

      {displayError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Filtres et navigation</CardTitle>
          <CardDescription>
            Sélectionnez le type de données à afficher et appliquez des filtres
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="saisiehrm"
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Saisies HRM
              </TabsTrigger>
              <TabsTrigger
                value="saisiehim"
                className="flex items-center gap-2"
              >
                <Wrench className="h-4 w-4" />
                Saisies HIM
              </TabsTrigger>
              <TabsTrigger
                value="saisielubrifiant"
                className="flex items-center gap-2"
              >
                <Droplets className="h-4 w-4" />
                Lubrifiants
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-6">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par engin, site, origine ou valeur..."
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
                        <Badge
                          key={key}
                          variant="secondary"
                          className="text-xs"
                        >
                          {key}: "{value}"
                        </Badge>
                      )
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4 mt-6">
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
            {totalItems}{" "}
            {activeTab === "saisiehrm"
              ? "saisie(s) HRM"
              : activeTab === "saisiehim"
              ? "saisie(s) HIM"
              : "saisie(s) lubrifiant"}{" "}
            trouvée(s)
            {!showAll &&
              totalPages > 1 &&
              ` • Page ${currentPage}/${totalPages}`}
          </span>
        </div>

        {getFilteredAndSortedData.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {getFilteredAndSortedData.length} ligne(s) exportable(s)
          </div>
        )}
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {getTableHeaders()}
              <TableHead className="text-right">
                <span className="font-medium">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{getTableRows()}</TableBody>
        </Table>
      </div>

      {!showAll && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-sm text-muted-foreground">
            Affichage de <strong>{startIndex + 1}</strong> à{" "}
            <strong>{Math.min(startIndex + itemsPerPage, totalItems)}</strong>{" "}
            sur <strong>{totalItems}</strong> éléments
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

      <PerformanceModal
        open={isModalOpen}
        onClose={handleCloseModal}
        type={activeTab}
        item={selectedItem}
        engins={enginsQuery.data || []}
        sites={sitesQuery.data || []}
        origineSaisies={origineSaisiesQuery.data || []}
        createSaisiehrm={createSaisiehrm}
        updateSaisiehrm={updateSaisiehrm}
        createSaisiehim={createSaisiehim}
        updateSaisiehim={updateSaisiehim}
        createSaisielubrifiant={createSaisielubrifiant}
        updateSaisielubrifiant={updateSaisielubrifiant}
      />

      <DeletePerformanceModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        type={activeTab}
        item={selectedItem}
        deleteSaisiehrm={deleteSaisiehrm}
        deleteSaisiehim={deleteSaisiehim}
        deleteSaisielubrifiant={deleteSaisielubrifiant}
      />
    </div>
  );
}
