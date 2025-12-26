import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  Plus,
  Check,
  Clock,
  Edit,
  Server,
  Globe,
  Network,
  Key,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge, PhaseBadge } from "@/components/status-badge";
import { ProgressBar } from "@/components/progress-bar";
import { EmptyState } from "@/components/empty-state";
import { LoadingState, LoadingSpinner } from "@/components/loading-state";
import { ImageUpload } from "@/components/image-upload";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type {
  Facility,
  FacilityVisit,
  FacilityDevice,
  FacilityInstallation,
  FacilityMaintenance,
  FacilityServerData,
  FacilityServerUser,
  FacilityImage,
  DeviceType,
  VisitQuestion,
  VisitActivity,
  InstallationStep,
  MaintenanceType,
  User as UserType,
} from "@shared/schema";

export default function FacilityDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, language, dir } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false);
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);
  const [serverUserDialogOpen, setServerUserDialogOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const { data: facility, isLoading } = useQuery<Facility>({
    queryKey: ["/api/facilities", id],
  });

  const { data: visits } = useQuery<FacilityVisit[]>({
    queryKey: ["/api/facilities", id, "visits"],
  });

  const { data: devices } = useQuery<FacilityDevice[]>({
    queryKey: ["/api/facilities", id, "devices"],
  });

  const { data: installations } = useQuery<FacilityInstallation[]>({
    queryKey: ["/api/facilities", id, "installations"],
  });

  const { data: maintenances } = useQuery<FacilityMaintenance[]>({
    queryKey: ["/api/facilities", id, "maintenances"],
  });

  const { data: deviceTypes } = useQuery<DeviceType[]>({
    queryKey: ["/api/device-types"],
  });

  const { data: visitQuestions } = useQuery<VisitQuestion[]>({
    queryKey: ["/api/visit-questions"],
  });

  const { data: visitActivities } = useQuery<VisitActivity[]>({
    queryKey: ["/api/visit-activities"],
  });

  const { data: installationSteps } = useQuery<InstallationStep[]>({
    queryKey: ["/api/installation-steps"],
  });

  const { data: maintenanceTypes } = useQuery<MaintenanceType[]>({
    queryKey: ["/api/maintenance-types"],
  });

  const { data: serverData } = useQuery<FacilityServerData>({
    queryKey: ["/api/facilities", id, "server-data"],
  });

  const { data: serverUsers } = useQuery<FacilityServerUser[]>({
    queryKey: ["/api/facilities", id, "server-users"],
  });

  const { data: allImages } = useQuery<FacilityImage[]>({
    queryKey: ["/api/facilities", id, "images"],
  });

  const addVisitMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", `/api/facilities/${id}/visits`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/facilities", id, "visits"] });
      setVisitDialogOpen(false);
      setSelectedActivities([]);
      toast({ title: language === "ar" ? "تم إضافة الزيارة بنجاح" : "Visit added successfully" });
    },
  });

  const addDeviceMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", `/api/facilities/${id}/devices`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/facilities", id, "devices"] });
      setDeviceDialogOpen(false);
      toast({ title: language === "ar" ? "تم إضافة الجهاز بنجاح" : "Device added successfully" });
    },
  });

  const toggleInstallationMutation = useMutation({
    mutationFn: ({ installationId, completed }: { installationId: string; completed: boolean }) =>
      apiRequest("PATCH", `/api/facilities/${id}/installations/${installationId}`, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/facilities", id, "installations"] });
    },
  });

  const addMaintenanceMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", `/api/facilities/${id}/maintenances`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/facilities", id, "maintenances"] });
      setMaintenanceDialogOpen(false);
      toast({ title: language === "ar" ? "تم إضافة الصيانة بنجاح" : "Maintenance added successfully" });
    },
  });

  const saveServerDataMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PUT", `/api/facilities/${id}/server-data`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/facilities", id, "server-data"] });
      toast({ title: language === "ar" ? "تم حفظ بيانات السيرفر بنجاح" : "Server data saved successfully" });
    },
  });

  const addServerUserMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", `/api/facilities/${id}/server-users`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/facilities", id, "server-users"] });
      setServerUserDialogOpen(false);
      toast({ title: language === "ar" ? "تم إضافة المستخدم بنجاح" : "User added successfully" });
    },
  });

  const deleteServerUserMutation = useMutation({
    mutationFn: (userId: string) => apiRequest("DELETE", `/api/facilities/${id}/server-users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/facilities", id, "server-users"] });
      toast({ title: language === "ar" ? "تم حذف المستخدم بنجاح" : "User deleted successfully" });
    },
  });

  const togglePasswordVisibility = (key: string) => {
    setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!facility) {
    return (
      <EmptyState
        title={language === "ar" ? "المنشأة غير موجودة" : "Facility not found"}
        action={{
          label: t("back"),
          onClick: () => window.history.back(),
        }}
      />
    );
  }

  const getDeviceTypeName = (deviceTypeId: string) => {
    const dt = deviceTypes?.find((d) => d.id === deviceTypeId);
    return dt ? (language === "ar" ? dt.nameAr : dt.nameEn) : "";
  };

  const getMaintenanceTypeName = (typeId: string) => {
    const mt = maintenanceTypes?.find((m) => m.id === typeId);
    return mt ? (language === "ar" ? mt.nameAr : mt.nameEn) : "";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/facilities">
            {dir === "rtl" ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-facility-name">
            {language === "ar" ? facility.nameAr : facility.nameEn}
          </h1>
          <p className="text-sm text-muted-foreground">
            {language === "ar" ? facility.nameEn : facility.nameAr}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={facility.status as any} />
          <PhaseBadge phase={facility.currentPhase as any} />
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{t("progress")}:</span>
            </div>
            <div className="flex-1 min-w-[200px]">
              <ProgressBar value={facility.progress || 0} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-7 w-full max-w-4xl">
          <TabsTrigger value="overview" data-testid="tab-overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="visits" data-testid="tab-visits">{t("visits")}</TabsTrigger>
          <TabsTrigger value="devices" data-testid="tab-devices">{t("devices")}</TabsTrigger>
          <TabsTrigger value="installation" data-testid="tab-installation">{t("installation")}</TabsTrigger>
          <TabsTrigger value="maintenance" data-testid="tab-maintenance">{t("maintenance")}</TabsTrigger>
          <TabsTrigger value="server" data-testid="tab-server">{language === "ar" ? "بيانات السيرفر" : "Server Data"}</TabsTrigger>
          <TabsTrigger value="gallery" data-testid="tab-gallery">{language === "ar" ? "المعرض" : "Gallery"}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{t("generalInfo")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {facility.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm">{facility.location}</span>
                  </div>
                )}
                {facility.contactPerson && (
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm">{facility.contactPerson}</span>
                  </div>
                )}
                {facility.contactPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm" dir="ltr">{facility.contactPhone}</span>
                  </div>
                )}
                {facility.contactEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm" dir="ltr">{facility.contactEmail}</span>
                  </div>
                )}
                {facility.targetDuration && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm">{facility.targetDuration} {t("days")}</span>
                  </div>
                )}
                {facility.lastModifiedAt && (
                  <div className="flex items-center gap-3 pt-2 border-t mt-2">
                    <Edit className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {language === "ar" ? "آخر تعديل:" : "Last modified:"}{" "}
                      {new Date(facility.lastModifiedAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {facility.notes && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">{t("notes")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{facility.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">
                {language === "ar" ? "الصور" : "Images"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload facilityId={id!} entityType="overview" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visits" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t("visits")}</h3>
            <Button onClick={() => setVisitDialogOpen(true)} data-testid="button-add-visit">
              <Plus className="h-4 w-4 me-2" />
              {t("addVisit")}
            </Button>
          </div>

          {visits && visits.length > 0 ? (
            <div className="space-y-3">
              {visits.map((visit) => (
                <Card key={visit.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{visit.visitDate}</span>
                        </div>
                        {visit.notes && (
                          <p className="text-sm text-muted-foreground">{visit.notes}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title={language === "ar" ? "لا توجد زيارات" : "No visits yet"}
              action={{
                label: t("addVisit"),
                onClick: () => setVisitDialogOpen(true),
              }}
            />
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">
                {language === "ar" ? "صور الزيارات" : "Visit Images"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload facilityId={id!} entityType="visit" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t("devices")}</h3>
            <Button onClick={() => setDeviceDialogOpen(true)} data-testid="button-add-device">
              <Plus className="h-4 w-4 me-2" />
              {t("addDevice")}
            </Button>
          </div>

          {devices && devices.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-start text-sm font-medium">{t("deviceType")}</th>
                      <th className="p-3 text-start text-sm font-medium">{t("quantity")}</th>
                      <th className="p-3 text-start text-sm font-medium">{t("unitPrice")}</th>
                      <th className="p-3 text-start text-sm font-medium">{t("status")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map((device) => (
                      <tr key={device.id} className="border-b last:border-0">
                        <td className="p-3 text-sm">{getDeviceTypeName(device.deviceTypeId)}</td>
                        <td className="p-3 text-sm">{device.quantity}</td>
                        <td className="p-3 text-sm">{device.unitPrice?.toLocaleString()} {t("currency")}</td>
                        <td className="p-3">
                          <StatusBadge status={(device.status || "pending") as any} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ) : (
            <EmptyState
              title={language === "ar" ? "لا توجد أجهزة" : "No devices yet"}
              action={{
                label: t("addDevice"),
                onClick: () => setDeviceDialogOpen(true),
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="installation" className="space-y-4">
          <h3 className="text-lg font-semibold">{t("installationPhase")}</h3>

          {installations && installations.length > 0 ? (
            <div className="space-y-2">
              {installations.map((inst, index) => {
                const step = installationSteps?.find((s) => s.id === inst.stepId);
                return (
                  <Card key={inst.id} className={inst.completed ? "bg-green-50 dark:bg-green-900/10" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={inst.completed || false}
                          onCheckedChange={(checked) =>
                            toggleInstallationMutation.mutate({
                              installationId: inst.id,
                              completed: !!checked,
                            })
                          }
                          data-testid={`checkbox-step-${inst.id}`}
                        />
                        <div className="flex-1">
                          <span className={inst.completed ? "line-through text-muted-foreground" : ""}>
                            {step ? (language === "ar" ? step.stepAr : step.stepEn) : `Step ${index + 1}`}
                          </span>
                          {inst.completedDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {t("completedOn")}: {inst.completedDate}
                            </p>
                          )}
                        </div>
                        {inst.completed && <Check className="h-5 w-5 text-green-600" />}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title={language === "ar" ? "لا توجد خطوات تركيب" : "No installation steps"}
              description={language === "ar" ? "أضف خطوات التركيب من البيانات الأساسية" : "Add installation steps from Master Data"}
            />
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">
                {language === "ar" ? "صور التركيب" : "Installation Images"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload facilityId={id!} entityType="installation" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t("maintenance")}</h3>
            <Button onClick={() => setMaintenanceDialogOpen(true)} data-testid="button-add-maintenance">
              <Plus className="h-4 w-4 me-2" />
              {t("addMaintenance")}
            </Button>
          </div>

          {maintenances && maintenances.length > 0 ? (
            <div className="space-y-3">
              {maintenances.map((maint) => (
                <Card key={maint.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {getMaintenanceTypeName(maint.maintenanceTypeId)}
                          </span>
                          {maint.isEmergency && (
                            <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded">
                              {t("emergencyMaintenance")}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {maint.scheduledDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {maint.scheduledDate}
                            </span>
                          )}
                          {maint.cost && (
                            <span>
                              {t("cost")}: {maint.cost.toLocaleString()} {t("currency")}
                            </span>
                          )}
                        </div>
                        {maint.notes && (
                          <p className="text-sm text-muted-foreground">{maint.notes}</p>
                        )}
                      </div>
                      {maint.completedDate ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
                          {t("completed")}
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded">
                          {t("pending")}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title={language === "ar" ? "لا توجد صيانات" : "No maintenance records"}
              action={{
                label: t("addMaintenance"),
                onClick: () => setMaintenanceDialogOpen(true),
              }}
            />
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">
                {language === "ar" ? "صور الصيانة" : "Maintenance Images"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload facilityId={id!} entityType="maintenance" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="server" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {language === "ar" ? "معلومات السيرفر" : "Server Information"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    saveServerDataMutation.mutate({
                      domainName: formData.get("domainName") || "",
                      internalServerIp: formData.get("internalIp") || "",
                      adminUsername: formData.get("adminUsername") || "",
                      adminPassword: formData.get("adminPassword") || "",
                    });
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="domainName">
                      <Globe className="h-3 w-3 inline me-1" />
                      {language === "ar" ? "اسم النطاق" : "Domain Name"}
                    </Label>
                    <Input
                      id="domainName"
                      name="domainName"
                      defaultValue={serverData?.domainName || ""}
                      placeholder="example.com"
                      dir="ltr"
                      data-testid="input-domain-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="internalIp">
                      <Network className="h-3 w-3 inline me-1" />
                      {language === "ar" ? "عنوان IP الداخلي" : "Internal IP Address"}
                    </Label>
                    <Input
                      id="internalIp"
                      name="internalIp"
                      defaultValue={serverData?.internalIp || ""}
                      placeholder="192.168.1.100"
                      dir="ltr"
                      data-testid="input-internal-ip"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminUsername">
                      <User className="h-3 w-3 inline me-1" />
                      {language === "ar" ? "اسم مستخدم المدير" : "Admin Username"}
                    </Label>
                    <Input
                      id="adminUsername"
                      name="adminUsername"
                      defaultValue={serverData?.adminUsername || ""}
                      dir="ltr"
                      data-testid="input-admin-username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">
                      <Key className="h-3 w-3 inline me-1" />
                      {language === "ar" ? "كلمة مرور المدير" : "Admin Password"}
                    </Label>
                    <div className="relative">
                      <Input
                        id="adminPassword"
                        name="adminPassword"
                        type={showPasswords["admin"] ? "text" : "password"}
                        defaultValue={serverData?.adminPassword || ""}
                        dir="ltr"
                        className="pe-10"
                        data-testid="input-admin-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute end-0 top-0 h-full"
                        onClick={() => togglePasswordVisibility("admin")}
                        data-testid="button-toggle-admin-password"
                      >
                        {showPasswords["admin"] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={saveServerDataMutation.isPending}
                    className="w-full"
                    data-testid="button-save-server-data"
                  >
                    {saveServerDataMutation.isPending && <LoadingSpinner size="sm" className="me-2" />}
                    {t("save")}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {language === "ar" ? "المستخدمين النهائيين" : "End Users"}
                  </div>
                  <Button size="sm" onClick={() => setServerUserDialogOpen(true)} data-testid="button-add-server-user">
                    <Plus className="h-4 w-4 me-1" />
                    {language === "ar" ? "إضافة" : "Add"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {serverUsers && serverUsers.length > 0 ? (
                  <div className="space-y-3">
                    {serverUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="space-y-1">
                          <div className="font-medium text-sm" dir="ltr">{user.username}</div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span dir="ltr">
                              {showPasswords[user.id] ? user.password : "••••••••"}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => togglePasswordVisibility(user.id)}
                              data-testid={`button-toggle-user-password-${user.id}`}
                            >
                              {showPasswords[user.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteServerUserMutation.mutate(user.id)}
                          disabled={deleteServerUserMutation.isPending}
                          data-testid={`button-delete-user-${user.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    {language === "ar" ? "لا يوجد مستخدمين" : "No users yet"}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">
                {language === "ar" ? "صور السيرفر" : "Server Images"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload facilityId={id!} entityType="server" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <h3 className="text-lg font-semibold" data-testid="text-gallery-title">
            {language === "ar" ? "معرض الصور" : "Image Gallery"}
          </h3>

          {allImages && allImages.length > 0 ? (
            <div className="space-y-6" data-testid="gallery-container">
              {(() => {
                const entityLabels: Record<string, { ar: string; en: string }> = {
                  overview: { ar: "صور عامة", en: "Overview Images" },
                  visit: { ar: "صور الزيارات", en: "Visit Images" },
                  installation: { ar: "صور التركيب", en: "Installation Images" },
                  maintenance: { ar: "صور الصيانة", en: "Maintenance Images" },
                  server: { ar: "صور السيرفر", en: "Server Images" },
                };
                
                return ["overview", "visit", "installation", "maintenance", "server"].map((entityType) => {
                  const entityImages = allImages.filter((img) => img.entityType === entityType);
                  if (entityImages.length === 0) return null;

                  return (
                    <div key={entityType} className="space-y-3" data-testid={`gallery-section-${entityType}`}>
                      <h4 className="text-base font-medium flex items-center gap-2" data-testid={`text-section-${entityType}`}>
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        {language === "ar" ? entityLabels[entityType].ar : entityLabels[entityType].en}
                        <span className="text-sm text-muted-foreground">({entityImages.length})</span>
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {entityImages.map((image) => (
                          <Card key={image.id} className="overflow-hidden" data-testid={`card-image-${image.id}`}>
                            <div className="aspect-square relative">
                              <img
                                src={image.data}
                                alt={image.filename || "Image"}
                                className="object-cover w-full h-full"
                                data-testid={`img-gallery-${image.id}`}
                              />
                            </div>
                            <CardContent className="p-2">
                              <div className="text-xs text-muted-foreground truncate" data-testid={`text-filename-${image.id}`}>
                                {image.filename || (language === "ar" ? "صورة" : "Image")}
                              </div>
                              {image.uploadedAt && (
                                <div className="text-xs text-muted-foreground" data-testid={`text-date-${image.id}`}>
                                  {new Date(image.uploadedAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          ) : (
            <EmptyState
              title={language === "ar" ? "لا توجد صور" : "No images yet"}
              description={language === "ar" ? "قم بإضافة صور من التبويبات الأخرى" : "Add images from other tabs"}
            />
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={visitDialogOpen} onOpenChange={(open) => {
        setVisitDialogOpen(open);
        if (!open) setSelectedActivities([]);
      }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("addVisit")}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addVisitMutation.mutate({
                visitDate: formData.get("visitDate"),
                notes: formData.get("notes"),
                activityIds: selectedActivities,
              });
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="visitDate">{t("visitDate")} *</Label>
              <Input
                id="visitDate"
                name="visitDate"
                type="date"
                required
                data-testid="input-visit-date"
              />
            </div>
            <div className="space-y-2">
              <Label>{language === "ar" ? "أنشطة الزيارة" : "Visit Activities"}</Label>
              <div className="grid gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {visitActivities?.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`activity-${activity.id}`}
                      checked={selectedActivities.includes(activity.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedActivities([...selectedActivities, activity.id]);
                        } else {
                          setSelectedActivities(selectedActivities.filter(id => id !== activity.id));
                        }
                      }}
                      data-testid={`checkbox-activity-${activity.id}`}
                    />
                    <Label htmlFor={`activity-${activity.id}`} className="font-normal cursor-pointer">
                      {language === "ar" ? activity.nameAr : activity.nameEn}
                    </Label>
                  </div>
                ))}
                {!visitActivities?.length && (
                  <div className="text-sm text-muted-foreground text-center py-2">
                    {language === "ar" ? "لا توجد أنشطة متاحة" : "No activities available"}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="visitNotes">{t("notes")}</Label>
              <Textarea id="visitNotes" name="notes" rows={3} data-testid="textarea-visit-notes" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setVisitDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={addVisitMutation.isPending} data-testid="button-save-visit">
                {addVisitMutation.isPending && <LoadingSpinner size="sm" className="me-2" />}
                {t("save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deviceDialogOpen} onOpenChange={setDeviceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addDevice")}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addDeviceMutation.mutate({
                deviceTypeId: formData.get("deviceTypeId"),
                quantity: parseInt(formData.get("quantity") as string),
                unitPrice: parseFloat(formData.get("unitPrice") as string) || 0,
              });
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="deviceTypeId">{t("deviceType")} *</Label>
              <Select name="deviceTypeId" required>
                <SelectTrigger data-testid="select-device-type">
                  <SelectValue placeholder={language === "ar" ? "اختر نوع الجهاز" : "Select device type"} />
                </SelectTrigger>
                <SelectContent>
                  {deviceTypes?.map((dt) => (
                    <SelectItem key={dt.id} value={dt.id}>
                      {language === "ar" ? dt.nameAr : dt.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">{t("quantity")} *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  required
                  data-testid="input-device-quantity"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitPrice">{t("unitPrice")}</Label>
                <Input
                  id="unitPrice"
                  name="unitPrice"
                  type="number"
                  step="0.01"
                  data-testid="input-device-price"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDeviceDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={addDeviceMutation.isPending} data-testid="button-save-device">
                {addDeviceMutation.isPending && <LoadingSpinner size="sm" className="me-2" />}
                {t("save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={maintenanceDialogOpen} onOpenChange={setMaintenanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addMaintenance")}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addMaintenanceMutation.mutate({
                maintenanceTypeId: formData.get("maintenanceTypeId"),
                scheduledDate: formData.get("scheduledDate"),
                cost: parseFloat(formData.get("cost") as string) || 0,
                isEmergency: formData.get("isEmergency") === "on",
                notes: formData.get("notes"),
              });
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="maintenanceTypeId">{t("maintenanceType")} *</Label>
              <Select name="maintenanceTypeId" required>
                <SelectTrigger data-testid="select-maintenance-type">
                  <SelectValue placeholder={language === "ar" ? "اختر نوع الصيانة" : "Select maintenance type"} />
                </SelectTrigger>
                <SelectContent>
                  {maintenanceTypes?.map((mt) => (
                    <SelectItem key={mt.id} value={mt.id}>
                      {language === "ar" ? mt.nameAr : mt.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">{t("scheduledDate")}</Label>
                <Input
                  id="scheduledDate"
                  name="scheduledDate"
                  type="date"
                  data-testid="input-maintenance-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">{t("cost")}</Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  step="0.01"
                  data-testid="input-maintenance-cost"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="isEmergency" name="isEmergency" />
              <Label htmlFor="isEmergency" className="text-sm font-normal cursor-pointer">
                {t("emergencyMaintenance")}
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintNotes">{t("notes")}</Label>
              <Textarea id="maintNotes" name="notes" rows={3} data-testid="textarea-maintenance-notes" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setMaintenanceDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={addMaintenanceMutation.isPending} data-testid="button-save-maintenance">
                {addMaintenanceMutation.isPending && <LoadingSpinner size="sm" className="me-2" />}
                {t("save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={serverUserDialogOpen} onOpenChange={setServerUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === "ar" ? "إضافة مستخدم" : "Add User"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addServerUserMutation.mutate({
                username: formData.get("username"),
                password: formData.get("password"),
              });
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="username">{language === "ar" ? "اسم المستخدم" : "Username"} *</Label>
              <Input
                id="username"
                name="username"
                required
                dir="ltr"
                data-testid="input-server-username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{language === "ar" ? "كلمة المرور" : "Password"} *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                dir="ltr"
                data-testid="input-server-password"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setServerUserDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={addServerUserMutation.isPending} data-testid="button-save-server-user">
                {addServerUserMutation.isPending && <LoadingSpinner size="sm" className="me-2" />}
                {t("save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
