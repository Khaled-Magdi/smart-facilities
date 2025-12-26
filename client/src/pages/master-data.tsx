import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, GripVertical, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { EmptyState } from "@/components/empty-state";
import { LoadingState, LoadingSpinner } from "@/components/loading-state";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type {
  FacilityType,
  DeviceType,
  VisitQuestion,
  InstallationStep,
  MaintenanceType,
  VisitActivity,
  ConnectionProtocol,
  PurchaseLocation,
  DeviceBrand,
} from "@shared/schema";

type MasterDataType = "facilityTypes" | "deviceTypes" | "visitQuestions" | "installationSteps" | "maintenanceTypes" | "visitActivities";
type DeviceSubTab = "types" | "protocols" | "locations" | "brands";

interface MasterDataItem {
  id: string;
  nameAr?: string;
  nameEn?: string;
  questionAr?: string;
  questionEn?: string;
  stepAr?: string;
  stepEn?: string;
  order?: number;
  protocolId?: string | null;
  purchaseLocationId?: string | null;
  brandId?: string | null;
}

export default function MasterData() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<MasterDataType>("facilityTypes");
  const [deviceSubTab, setDeviceSubTab] = useState<DeviceSubTab>("types");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterDataItem | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [deviceTypesExpanded, setDeviceTypesExpanded] = useState(true);

  const apiEndpoints: Record<MasterDataType, string> = {
    facilityTypes: "/api/facility-types",
    deviceTypes: "/api/device-types",
    visitQuestions: "/api/visit-questions",
    installationSteps: "/api/installation-steps",
    maintenanceTypes: "/api/maintenance-types",
    visitActivities: "/api/visit-activities",
  };

  const deviceSubEndpoints: Record<DeviceSubTab, string> = {
    types: "/api/device-types",
    protocols: "/api/connection-protocols",
    locations: "/api/purchase-locations",
    brands: "/api/device-brands",
  };

  const { data: facilityTypes, isLoading: loadingFT } = useQuery<FacilityType[]>({
    queryKey: ["/api/facility-types"],
  });

  const { data: deviceTypes, isLoading: loadingDT } = useQuery<DeviceType[]>({
    queryKey: ["/api/device-types"],
  });

  const { data: visitQuestions, isLoading: loadingVQ } = useQuery<VisitQuestion[]>({
    queryKey: ["/api/visit-questions"],
  });

  const { data: installationSteps, isLoading: loadingIS } = useQuery<InstallationStep[]>({
    queryKey: ["/api/installation-steps"],
  });

  const { data: maintenanceTypes, isLoading: loadingMT } = useQuery<MaintenanceType[]>({
    queryKey: ["/api/maintenance-types"],
  });

  const { data: visitActivities, isLoading: loadingVA } = useQuery<VisitActivity[]>({
    queryKey: ["/api/visit-activities"],
  });

  const { data: connectionProtocols, isLoading: loadingCP } = useQuery<ConnectionProtocol[]>({
    queryKey: ["/api/connection-protocols"],
  });

  const { data: purchaseLocations, isLoading: loadingPL } = useQuery<PurchaseLocation[]>({
    queryKey: ["/api/purchase-locations"],
  });

  const { data: deviceBrands, isLoading: loadingDB } = useQuery<DeviceBrand[]>({
    queryKey: ["/api/device-brands"],
  });

  const getCurrentEndpoint = useCallback(() => {
    if (activeTab === "deviceTypes") {
      return deviceSubEndpoints[deviceSubTab];
    }
    return apiEndpoints[activeTab];
  }, [activeTab, deviceSubTab]);

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", getCurrentEndpoint(), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getCurrentEndpoint()] });
      setDialogOpen(false);
      setEditingItem(null);
      toast({ title: language === "ar" ? "تمت الإضافة بنجاح" : "Added successfully" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest("PATCH", `${getCurrentEndpoint()}/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getCurrentEndpoint()] });
      setDialogOpen(false);
      setEditingItem(null);
      toast({ title: language === "ar" ? "تم التحديث بنجاح" : "Updated successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `${getCurrentEndpoint()}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getCurrentEndpoint()] });
      toast({ title: language === "ar" ? "تم الحذف بنجاح" : "Deleted successfully" });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: ({ id, newOrder }: { id: string; newOrder: number }) =>
      apiRequest("PATCH", `${getCurrentEndpoint()}/${id}`, { order: newOrder }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getCurrentEndpoint()] });
    },
  });

  const getData = (): MasterDataItem[] => {
    if (activeTab === "deviceTypes") {
      switch (deviceSubTab) {
        case "types":
          return deviceTypes || [];
        case "protocols":
          return connectionProtocols || [];
        case "locations":
          return purchaseLocations || [];
        case "brands":
          return deviceBrands || [];
        default:
          return [];
      }
    }
    switch (activeTab) {
      case "facilityTypes":
        return facilityTypes || [];
      case "visitQuestions":
        return visitQuestions || [];
      case "installationSteps":
        return installationSteps || [];
      case "maintenanceTypes":
        return maintenanceTypes || [];
      case "visitActivities":
        return visitActivities || [];
      default:
        return [];
    }
  };

  const isLoading = loadingFT || loadingDT || loadingVQ || loadingIS || loadingMT || loadingVA || loadingCP || loadingPL || loadingDB;

  const getFieldLabels = () => {
    if (activeTab === "visitQuestions") {
      return { ar: "questionAr", en: "questionEn", labelAr: t("nameAr"), labelEn: t("nameEn") };
    }
    if (activeTab === "installationSteps") {
      return { ar: "stepAr", en: "stepEn", labelAr: t("nameAr"), labelEn: t("nameEn") };
    }
    return { ar: "nameAr", en: "nameEn", labelAr: t("nameAr"), labelEn: t("nameEn") };
  };

  const getDisplayName = (item: MasterDataItem): string => {
    const fields = getFieldLabels();
    const arValue = (item as any)[fields.ar];
    const enValue = (item as any)[fields.en];
    return language === "ar" ? arValue : enValue;
  };

  const getSecondaryName = (item: MasterDataItem): string => {
    const fields = getFieldLabels();
    const arValue = (item as any)[fields.ar];
    const enValue = (item as any)[fields.en];
    return language === "ar" ? enValue : arValue;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fields = getFieldLabels();
    const data: any = {
      [fields.ar]: formData.get("fieldAr"),
      [fields.en]: formData.get("fieldEn"),
    };

    if (activeTab === "deviceTypes" && deviceSubTab === "types") {
      const protocolId = formData.get("protocolId");
      const locationId = formData.get("locationId");
      const brandId = formData.get("brandId");
      if (protocolId && protocolId !== "none") data.protocolId = protocolId;
      if (locationId && locationId !== "none") data.purchaseLocationId = locationId;
      if (brandId && brandId !== "none") data.brandId = brandId;
    }

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEditDialog = (item: MasterDataItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const items = getData();
    const draggedIndex = items.findIndex(item => item.id === draggedItem);
    const targetIndex = items.findIndex(item => item.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newOrder = targetIndex;
    reorderMutation.mutate({ id: draggedItem, newOrder });
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const data = getData();

  const getSubTabLabel = (tab: DeviceSubTab) => {
    const labels: Record<DeviceSubTab, { ar: string; en: string }> = {
      types: { ar: "أنواع الأجهزة", en: "Device Types" },
      protocols: { ar: "بروتوكول الربط", en: "Connection Protocol" },
      locations: { ar: "مكان الشراء", en: "Purchase Location" },
      brands: { ar: "الماركة", en: "Brand" },
    };
    return language === "ar" ? labels[tab].ar : labels[tab].en;
  };

  const renderDeviceTypesTab = () => (
    <div className="space-y-4">
      <Collapsible open={deviceTypesExpanded} onOpenChange={setDeviceTypesExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 p-0 hover:bg-transparent">
            {deviceTypesExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span className="font-semibold">{t("deviceTypes")}</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Tabs value={deviceSubTab} onValueChange={(v) => setDeviceSubTab(v as DeviceSubTab)} className="space-y-4">
            <TabsList className="flex flex-wrap h-auto gap-1">
              <TabsTrigger value="types" data-testid="subtab-device-types">{getSubTabLabel("types")}</TabsTrigger>
              <TabsTrigger value="protocols" data-testid="subtab-protocols">{getSubTabLabel("protocols")}</TabsTrigger>
              <TabsTrigger value="locations" data-testid="subtab-locations">{getSubTabLabel("locations")}</TabsTrigger>
              <TabsTrigger value="brands" data-testid="subtab-brands">{getSubTabLabel("brands")}</TabsTrigger>
            </TabsList>

            <TabsContent value={deviceSubTab} className="space-y-4">
              {renderDataList()}
            </TabsContent>
          </Tabs>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );

  const renderDataList = () => (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {activeTab === "deviceTypes" ? getSubTabLabel(deviceSubTab) : t(activeTab)}
        </h3>
        <Button
          onClick={() => {
            setEditingItem(null);
            setDialogOpen(true);
          }}
          data-testid="button-add-item"
        >
          <Plus className="h-4 w-4 me-2" />
          {t("add")}
        </Button>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : data.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {data.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 hover-elevate ${
                    draggedItem === item.id ? "opacity-50" : ""
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item.id)}
                  onDragEnd={handleDragEnd}
                  data-testid={`item-${item.id}`}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <div className="flex-1">
                    <span className="font-medium">{getDisplayName(item)}</span>
                    <span className="text-sm text-muted-foreground ms-2">
                      ({getSecondaryName(item)})
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(item)}
                      data-testid={`button-edit-${item.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(item.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          title={language === "ar" ? "لا توجد بيانات" : "No data yet"}
          action={{
            label: t("add"),
            onClick: () => {
              setEditingItem(null);
              setDialogOpen(true);
            },
          }}
        />
      )}
    </>
  );

  const renderDeviceTypeFormFields = () => {
    if (activeTab !== "deviceTypes" || deviceSubTab !== "types") return null;

    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="protocolId">{language === "ar" ? "بروتوكول الربط" : "Connection Protocol"}</Label>
          <Select name="protocolId" defaultValue={editingItem?.protocolId || "none"}>
            <SelectTrigger data-testid="select-protocol">
              <SelectValue placeholder={language === "ar" ? "اختر..." : "Select..."} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{language === "ar" ? "بدون" : "None"}</SelectItem>
              {connectionProtocols?.map((protocol) => (
                <SelectItem key={protocol.id} value={protocol.id}>
                  {language === "ar" ? protocol.nameAr : protocol.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="locationId">{language === "ar" ? "مكان الشراء" : "Purchase Location"}</Label>
          <Select name="locationId" defaultValue={editingItem?.purchaseLocationId || "none"}>
            <SelectTrigger data-testid="select-location">
              <SelectValue placeholder={language === "ar" ? "اختر..." : "Select..."} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{language === "ar" ? "بدون" : "None"}</SelectItem>
              {purchaseLocations?.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {language === "ar" ? location.nameAr : location.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="brandId">{language === "ar" ? "الماركة" : "Brand"}</Label>
          <Select name="brandId" defaultValue={editingItem?.brandId || "none"}>
            <SelectTrigger data-testid="select-brand">
              <SelectValue placeholder={language === "ar" ? "اختر..." : "Select..."} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{language === "ar" ? "بدون" : "None"}</SelectItem>
              {deviceBrands?.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {language === "ar" ? brand.nameAr : brand.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">
          {t("masterData")}
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as MasterDataType)} className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="facilityTypes" data-testid="tab-facility-types">{t("facilityTypes")}</TabsTrigger>
          <TabsTrigger value="deviceTypes" data-testid="tab-device-types">{t("deviceTypes")}</TabsTrigger>
          <TabsTrigger value="visitQuestions" data-testid="tab-visit-questions">{t("visitQuestions")}</TabsTrigger>
          <TabsTrigger value="visitActivities" data-testid="tab-visit-activities">{language === "ar" ? "أنشطة الزيارة" : "Visit Activities"}</TabsTrigger>
          <TabsTrigger value="installationSteps" data-testid="tab-installation-steps">{t("installationSteps")}</TabsTrigger>
          <TabsTrigger value="maintenanceTypes" data-testid="tab-maintenance-types">{t("maintenanceTypes")}</TabsTrigger>
        </TabsList>

        <TabsContent value="deviceTypes" className="space-y-4">
          {renderDeviceTypesTab()}
        </TabsContent>

        {["facilityTypes", "visitQuestions", "visitActivities", "installationSteps", "maintenanceTypes"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {renderDataList()}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem
                ? (language === "ar" ? "تعديل" : "Edit")
                : t("add")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fieldAr">{t("nameAr")} *</Label>
              {activeTab === "visitQuestions" || activeTab === "installationSteps" ? (
                <Textarea
                  id="fieldAr"
                  name="fieldAr"
                  required
                  rows={2}
                  defaultValue={
                    editingItem
                      ? activeTab === "visitQuestions"
                        ? (editingItem as any).questionAr
                        : (editingItem as any).stepAr
                      : ""
                  }
                  data-testid="input-field-ar"
                />
              ) : (
                <Input
                  id="fieldAr"
                  name="fieldAr"
                  required
                  defaultValue={editingItem?.nameAr || ""}
                  data-testid="input-field-ar"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fieldEn">{t("nameEn")} *</Label>
              {activeTab === "visitQuestions" || activeTab === "installationSteps" ? (
                <Textarea
                  id="fieldEn"
                  name="fieldEn"
                  required
                  rows={2}
                  defaultValue={
                    editingItem
                      ? activeTab === "visitQuestions"
                        ? (editingItem as any).questionEn
                        : (editingItem as any).stepEn
                      : ""
                  }
                  data-testid="input-field-en"
                />
              ) : (
                <Input
                  id="fieldEn"
                  name="fieldEn"
                  required
                  defaultValue={editingItem?.nameEn || ""}
                  data-testid="input-field-en"
                />
              )}
            </div>
            {renderDeviceTypeFormFields()}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-item"
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <LoadingSpinner size="sm" className="me-2" />
                )}
                {t("save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
