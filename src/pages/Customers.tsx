import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { CustomerFilters } from '@/components/customers/CustomerFilters';
import { CustomerDetails } from '@/components/customers/CustomerDetails';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, MoreHorizontal, UserPlus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

// Mock data for customers - replace with actual data fetching
interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  vehicle: {
    make: string;
    model: string;
  };
  lastService: string;
  serviceType: string;
  status: 'active' | 'inactive';
}

const customers: Customer[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@example.com',
    avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=JS',
    vehicle: { make: 'Toyota', model: 'Corolla' },
    lastService: '2023-10-26',
    serviceType: 'Revisão Geral',
    status: 'active',
  },
  {
    id: '2',
    name: 'Maria Souza',
    email: 'maria.souza@example.com',
    avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=MS',
    vehicle: { make: 'Honda', model: 'Civic' },
    lastService: '2024-01-15',
    serviceType: 'Troca de Óleo',
    status: 'inactive',
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@example.com',
    avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=CO',
    vehicle: { make: 'Ford', model: 'Focus' },
    lastService: '2023-11-01',
    serviceType: 'Alinhamento',
    status: 'active',
  },
];

// Helper function for date formatting - replace with a proper utility function
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

export function Customers() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={row.original.avatar} />
            <AvatarFallback>{row.original.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-sm text-gray-500">{row.original.email}</p>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'vehicle',
      header: 'Veículo',
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.vehicle.make} {row.original.vehicle.model}
        </Badge>
      )
    },
    {
      accessorKey: 'lastService',
      header: 'Último Serviço',
      cell: ({ row }) => (
        <div className="text-sm">
          <p>{formatDate(row.original.lastService)}</p>
          <p className="text-gray-500">{row.original.serviceType}</p>
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === 'active' ? 'success' : 'secondary'}
        >
          {row.original.status}
        </Badge>
      )
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedCustomer(row.original)}>
              Ver detalhes
            </DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Nueva factura</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* <CustomerFilters /> */}
      
      <DataTable
        columns={columns}
        data={customers}
        searchKey="name"
      />

      {selectedCustomer && (
        <CustomerDetails
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}