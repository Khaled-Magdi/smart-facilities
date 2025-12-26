import { useQuery } from "@tanstack/react-query";
import { Building2, CheckCircle, AlertTriangle, DollarSign, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICard } from "@/components/kpi-card";
import { LoadingState } from "@/components/loading-state";
import { StatusBadge, PhaseBadge } from "@/components/status-badge";
import { useLanguage } from "@/lib/i18n";
import type { DashboardStats } from "@shared/schema";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Dashboard() {
  const { t, language } = useLanguage();

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return <LoadingState />;
  }

  const phaseData = stats?.phaseDistribution || [];
  const statusData = stats?.statusDistribution || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">
          {t("dashboard")}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t("totalFacilities")}
          value={stats?.totalFacilities || 0}
          icon={Building2}
          iconColor="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          data-testid="kpi-total-facilities"
        />
        <KPICard
          title={t("activeFacilities")}
          value={stats?.activeFacilities || 0}
          icon={CheckCircle}
          iconColor="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          data-testid="kpi-active-facilities"
        />
        <KPICard
          title={t("pendingMaintenance")}
          value={stats?.pendingMaintenance || 0}
          icon={Wrench}
          iconColor="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          data-testid="kpi-pending-maintenance"
        />
        <KPICard
          title={t("totalCost")}
          value={`${(stats?.totalCost || 0).toLocaleString()} ${t("currency")}`}
          icon={DollarSign}
          iconColor="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
          data-testid="kpi-total-cost"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">{t("phaseDistribution")}</CardTitle>
          </CardHeader>
          <CardContent>
            {phaseData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={phaseData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis 
                    type="category" 
                    dataKey="phase" 
                    className="text-xs"
                    width={100}
                    tickFormatter={(value) => t(value)}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                    labelFormatter={(value) => t(value as string)}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                {t("noData")}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">{t("statusDistribution")}</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="60%" height={280}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                    >
                      {statusData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                      formatter={(value, name) => [value, t(name as string)]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2">
                  {statusData.map((item, index) => (
                    <div key={item.status} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm">{t(item.status)}</span>
                      <span className="text-sm font-medium text-muted-foreground">
                        ({item.count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                {t("noData")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">{t("recentActivities")}</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentActivities && stats.recentActivities.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between gap-4 py-3 border-b last:border-0"
                  data-testid={`activity-${activity.id}`}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{activity.facility}</span>
                    <span className="text-sm text-muted-foreground">{activity.action}</span>
                  </div>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {activity.date}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              {t("noData")}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
