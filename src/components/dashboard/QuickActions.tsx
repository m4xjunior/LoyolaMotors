import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, UserPlus, Car } from 'lucide-react';

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button variant="outline" className="justify-start">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Cita
        </Button>
        <Button variant="outline" className="justify-start">
          <FileText className="h-4 w-4 mr-2" />
          Nueva Factura
        </Button>
        <Button variant="outline" className="justify-start">
          <UserPlus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
        <Button variant="outline" className="justify-start">
          <Car className="h-4 w-4 mr-2" />
          Nuevo Vehículo
        </Button>
      </CardContent>
    </Card>
  );
}