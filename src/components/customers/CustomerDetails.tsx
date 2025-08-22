import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail, MapPin, Calendar, Car, Tag } from 'lucide-react';
import { ServiceHistory } from './ServiceHistory'; // Implementar ServiceHistory depois

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  nif: string;
  avatar: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    province: string;
  };
  vehicle: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    vin?: string;
  };
  lastService: string;
  serviceType: string;
  status: 'active' | 'inactive';
}

interface CustomerDetailsProps {
  customer: Customer | null;
  onClose: () => void;
}

// Helper function for date formatting (re-used from Customers.tsx, should be in a central utility)
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

export function CustomerDetails({ customer, onClose }: CustomerDetailsProps) {
  if (!customer) return null;

  return (
    <Dialog open={!!customer} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={customer.avatar} />
              <AvatarFallback>{customer.name[0]}</AvatarFallback>
            </Avatar>
            {customer.name}
            <Badge variant={customer.status === 'active' ? 'success' : 'secondary'}>
              {customer.status === 'active' ? 'Ativo' : 'Inativo'}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Detalhes completos do cliente e histórico de serviços.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="history">Histórico de Serviço</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações Pessoais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Tag className="h-4 w-4 text-gray-500" />
                      <span>NIF: {customer.nif}</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                      <span>
                        {customer.address.street}, {customer.address.postalCode} {customer.address.city}, {customer.address.province}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Vehicle Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações do Veículo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Car className="h-4 w-4 text-gray-500" />
                      <span>{customer.vehicle.make} {customer.vehicle.model} ({customer.vehicle.year})</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Tag className="h-4 w-4 text-gray-500" />
                      <span>Matrícula: {customer.vehicle.licensePlate}</span>
                    </div>
                    {customer.vehicle.vin && (
                      <div className="flex items-center gap-3 text-sm">
                        <Tag className="h-4 w-4 text-gray-500" />
                        <span>VIN: {customer.vehicle.vin}</span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Último Serviço: {formatDate(customer.lastService)} ({customer.serviceType})</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="history">
            <ScrollArea className="h-[400px] pr-4">
              <ServiceHistory customerId={customer.id} />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}