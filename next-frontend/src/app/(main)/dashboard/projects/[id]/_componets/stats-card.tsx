import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Bug,
  Info,
  Signal,
  Siren,
} from "lucide-react";

export const StatsCard = ({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: string;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
      </CardContent>
    </Card>
  );
};

export const SeverityBadge = ({ severity }: { severity: string }) => {
  const severityMap: Record<string, { icon: React.ReactNode; color: string }> =
    {
      emerg: {
        icon: <Siren className="h-4 w-4" />,
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      },
      alert: {
        icon: <Bell className="h-4 w-4" />,
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      },
      crit: {
        icon: <AlertTriangle className="h-4 w-4" />,
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      },
      err: {
        icon: <AlertCircle className="h-4 w-4" />,
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      },
      warning: {
        icon: <AlertTriangle className="h-4 w-4" />,
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      },
      notice: {
        icon: <Bell className="h-4 w-4" />,
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      },
      info: {
        icon: <Info className="h-4 w-4" />,
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      },
      debug: {
        icon: <Bug className="h-4 w-4" />,
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      },
    };

  const { icon, color } = severityMap[severity.toLowerCase()] || {
    icon: <Signal className="h-4 w-4" />,
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };

  return (
    <Badge className={`${color} flex items-center gap-1`}>
      {icon}
      {severity.toLowerCase()}
    </Badge>
  );
};
