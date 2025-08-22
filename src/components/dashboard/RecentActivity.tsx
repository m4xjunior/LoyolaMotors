import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BellRing, Car, FileText, User } from 'lucide-react';

interface Activity {
  id: string;
  type: 'invoice' | 'service' | 'customer' | 'notification';
  description: string;
  date: string;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'invoice',
    description: 'Fatura #2023001 gerada para João Silva',
    date: '2023-10-26T10:00:00Z',
  },
  {
    id: '2',
    type: 'service',
    description: 'Serviço de troca de óleo concluído para Maria Souza',
    date: '2023-10-25T14:30:00Z',
  },
  {
    id: '3',
    type: 'customer',
    description: 'Novo cliente Carlos Oliveira adicionado',
    date: '2023-10-25T09:15:00Z',
  },
  {
    id: '4',
    type: 'notification',
    description: 'Lembrete: Próxima revisão para o veículo XYZ-1234 em 3 dias',
    date: '2023-10-24T16:00:00Z',
  },
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'invoice':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'service':
      return <Car className="h-5 w-5 text-green-500" />;
    case 'customer':
      return <User className="h-5 w-5 text-purple-500" />;
    case 'notification':
      return <BellRing className="h-5 w-5 text-yellow-500" />;
    default:
      return null;
  }
};

const formatActivityDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs text-gray-500">{formatActivityDate(activity.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}