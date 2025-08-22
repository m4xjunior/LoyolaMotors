import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef
} from '@tanstack/react-table';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { DataTablePagination } from "./DataTablePagination";
import { Filter, Download } from "lucide-react";

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchKey?: string;
  showPagination?: boolean;
  showFilters?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  searchKey,
  showPagination = true,
  showFilters = true
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex items-center justify-between">
          <Input
            placeholder={`Buscar ${searchKey || ''}...`}
            className="max-w-sm"
            onChange={(e) => table.setGlobalFilter(e.target.value)}
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      )}
      
      <div className="rounded-lg border bg-white dark:bg-gray-800 overflow-hidden">
        <Table>
          {/* Table implementation */}
        </Table>
      </div>
      
      {showPagination && <DataTablePagination table={table} />}
    </div>
  );
}