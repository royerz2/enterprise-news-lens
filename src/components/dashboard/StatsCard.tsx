
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'orange' | 'red';
}

export function StatsCard({ title, value, change, icon: Icon, color = 'blue' }: StatsCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className={`rounded-lg bg-gradient-to-r ${colorClasses[color]} p-2`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {change && (
          <p className="text-xs text-slate-600 mt-1">
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
