import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Filter, Search } from "lucide-react";

export function CustomerFilters() {
  return (
    <div className="flex items-center gap-4 py-4">
      <Input
        placeholder="Filtrar clientes..."
        className="max-w-sm"
      />
      
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="active">Ativo</SelectItem>
          <SelectItem value="inactive">Inativo</SelectItem>
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            <Filter className="mr-2 h-4 w-4" />
            Ver Colunas
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Alternar Colunas</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* Example columns - replace with actual data table columns */}
          <DropdownMenuCheckboxItem checked>Nome</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Email</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Telefone</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Veículo</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Último Serviço</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Status</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}