import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, CheckCircle, Clock, FileText, Download, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Service {
  id: string;
  type: string;
  date: string;
  technician: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  description: string;
  items?: { name: string; price: number }[];
  mileage: number;
  duration: number;
  total: number;
  photos?: string[];
}

// Placeholder for API call to fetch customer services
const fetchCustomerServices = async (customerId: string): Promise<Service[]> => {
  console.log('Fetching services for customer:', customerId);
  // Mock data for now
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve([
        {
          id: 's1',
          type: 'Revisão Anual',
          date: '2023-03-10T09:00:00Z',
          technician: 'Miguel Santos',
          status: 'completed',
          description: 'Revisão completa de rotina, troca de óleo, filtros e verificação de freios.',
          items: [
            { name: 'Troca de Óleo', price: 60 },
            { name: 'Filtro de Ar', price: 25 },
            { name: 'Inspeção de Freios', price: 40 },
          ],
          mileage: 85000,
          duration: 2,
          total: 125,
          photos: ['/assets/img/service/service_1.jpg'],
        },
        {
          id: 's2',
          type: 'Reparo de Motor',
          date: '2023-07-22T14:00:00Z',
          technician: 'Ana Costa',
          status: 'in-progress',
          description: 'Diagnóstico e reparo de problema no motor, substituição de velas.',
          items: [
            { name: 'Diagnóstico de Motor', price: 80 },
            { name: 'Substituição de Velas', price: 50 },
            { name: 'Mão de Obra', price: 100 },
          ],
          mileage: 92000,
          duration: 4,
          total: 230,
        },
        {
          id: 's3',
          type: 'Troca de Pneus',
          date: '2023-11-05T11:00:00Z',
          technician: 'Pedro Almeida',
          status: 'scheduled',
          description: 'Substituição dos quatro pneus e alinhamento.',
          mileage: 98000,
          duration: 1,
          total: 280,
        },
      ]);
    }, 500)
  );
};

// Helper function for date formatting (re-used from Customers.tsx, should be in a central utility)
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

export function ServiceHistory({ customerId }: { customerId: string }) {
  const { data: services } = useQuery({
    queryKey: ['services', customerId],
    queryFn: () => fetchCustomerServices(customerId)
  });

  return (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
      
      {services?.map((service, index) => (
        <div key={service.id} className="relative flex gap-6 pb-8">
          {/* Timeline dot */}
          <div className="relative z-10">
            <div className={cn(
              "h-16 w-16 rounded-full flex items-center justify-center",
              service.status === 'completed' 
                ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                : service.status === 'in-progress'
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            )}>
              {service.status === 'completed' ? (
                <CheckCircle className="h-6 w-6" />
              ) : service.status === 'in-progress' ? (
                <Clock className="h-6 w-6" />
              ) : (
                <Calendar className="h-6 w-6" />
              )}
            </div>
          </div>

          {/* Content */}
          <Card className="flex-1 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{service.type}</CardTitle>
                  <CardDescription>
                    {formatDate(service.date)} • {service.technician}
                  </CardDescription>
                </div>
                <Badge variant={
                  service.status === 'completed' ? 'success' :
                  service.status === 'in-progress' ? 'default' :
                  'secondary'
                }>
                  {service.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {service.description}
              </p>
              
              {service.items && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Servicios realizados:</p>
                  <ul className="text-sm space-y-1">
                    {service.items.map((item, i) => (
                      <li key={i} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          • {item.name}
                        </span>
                        <span className="font-medium">€{item.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Separator className="my-3" />
              
              <div className="flex justify-between items-center">
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-500">Kilometraje: {service.mileage} km</span>
                  <span className="text-gray-500">Duración: {service.duration}h</span>
                </div>
                <p className="font-semibold text-lg">
                  Total: €{service.total}
                </p>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-800/50">
              <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Ver Factura
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
                {service.photos && (
                  <Button variant="outline" size="sm" className="flex-1">
                    <Camera className="h-4 w-4 mr-2" />
                    Ver Fotos
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
}