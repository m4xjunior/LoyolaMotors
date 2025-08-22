import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  gradient: string;
}

export function StatsCard({
  title,
  value,
  change,
  trend,
  icon,
  gradient,
}: StatsCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden relative",
      trend === 'up' ? "border-green-400" : "border-red-400"
    )}>
      <div className={cn(
        "absolute inset-0 opacity-20",
        `bg-gradient-to-br ${gradient}`
      )} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10 relative">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="z-10 relative">
        <div className="text-2xl font-bold">{value}</div>
        <p className={cn(
          "text-xs",
          trend === 'up' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
        )}>
          {change}
        </p>
      </CardContent>
    </Card>
  );
}