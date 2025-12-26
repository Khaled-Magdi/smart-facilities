import { useQuery } from "@tanstack/react-query";
import { FileText, Download, BarChart3, PieChart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { useLanguage } from "@/lib/i18n";
import type { DashboardStats } from "@shared/schema";

export default function Reports() {
  const { t, language } = useLanguage();

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const reportTypes = [
    {
      id: "facilities",
      icon: BarChart3,
      title: language === "ar" ? "تقرير المنشآت" : "Facilities Report",
      description: language === "ar" ? "ملخص شامل لجميع المنشآت وحالاتها" : "Comprehensive summary of all facilities and their status",
    },
    {
      id: "phases",
      icon: PieChart,
      title: language === "ar" ? "تقرير المراحل" : "Phases Report",
      description: language === "ar" ? "توزيع المنشآت على مراحل التنفيذ" : "Distribution of facilities across execution phases",
    },
    {
      id: "costs",
      icon: TrendingUp,
      title: language === "ar" ? "تقرير التكاليف" : "Costs Report",
      description: language === "ar" ? "تحليل التكاليف والمصروفات" : "Analysis of costs and expenses",
    },
    {
      id: "maintenance",
      icon: FileText,
      title: language === "ar" ? "تقرير الصيانة" : "Maintenance Report",
      description: language === "ar" ? "سجل الصيانات الدورية والطارئة" : "Record of scheduled and emergency maintenance",
    },
  ];

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">
          {t("reports")}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map((report) => (
          <Card key={report.id} className="hover-elevate">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <report.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">{report.title}</h3>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                  <Button variant="outline" size="sm" data-testid={`button-download-${report.id}`}>
                    <Download className="h-4 w-4 me-2" />
                    {language === "ar" ? "تحميل PDF" : "Download PDF"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{language === "ar" ? "ملخص سريع" : "Quick Summary"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-md bg-muted/50">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats?.totalFacilities || 0}
              </p>
              <p className="text-sm text-muted-foreground">{t("totalFacilities")}</p>
            </div>
            <div className="text-center p-4 rounded-md bg-muted/50">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats?.activeFacilities || 0}
              </p>
              <p className="text-sm text-muted-foreground">{t("activeFacilities")}</p>
            </div>
            <div className="text-center p-4 rounded-md bg-muted/50">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {stats?.pendingMaintenance || 0}
              </p>
              <p className="text-sm text-muted-foreground">{t("pendingMaintenance")}</p>
            </div>
            <div className="text-center p-4 rounded-md bg-muted/50">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {(stats?.totalCost || 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">{t("totalCost")} ({t("currency")})</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
