import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Search, Filter, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge, PhaseBadge } from "@/components/status-badge";
import { ProgressBar } from "@/components/progress-bar";
import { EmptyState } from "@/components/empty-state";
import { LoadingState, LoadingSpinner } from "@/components/loading-state";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Facility, FacilityType, InsertFacility } from "@shared/schema";

export default function Facilities() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);

  const { data: facilities, isLoading } = useQuery<Facility[]>({
    queryKey: ["/api/facilities"],
  });

  const { data: facilityTypes } = useQuery<FacilityType[]>({
    queryKey: ["/api/facility-types"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertFacility) => apiRequest("POST", "/api/facilities", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/facilities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setIsDialogOpen(false);
      setEditingFacility(null);
      toast({ title: language === "ar" ? "تم إضافة المنشأة بنجاح" : "Facility added successfully" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertFacility> }) =>
      apiRequest("PATCH", `/api/facilities/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/facilities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setIsDialogOpen(false);
      setEditingFacility(null);
      toast({ title: language === "ar" ? "تم تحديث المنشأة بنجاح" : "Facility updated successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/facilities/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/facilities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: language === "ar" ? "تم حذف المنشأة بنجاح" : "Facility deleted successfully" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertFacility = {
      nameAr: formData.get("nameAr") as string,
      nameEn: formData.get("nameEn") as string,
      facilityTypeId: formData.get("facilityTypeId") as string || undefined,
      status: (formData.get("status") as string) || "active",
      currentPhase: (formData.get("currentPhase") as string) || "creation",
      location: formData.get("location") as string || undefined,
      contactPerson: formData.get("contactPerson") as string || undefined,
      contactPhone: formData.get("contactPhone") as string || undefined,
      contactEmail: formData.get("contactEmail") as string || undefined,
      targetDuration: parseInt(formData.get("targetDuration") as string) || undefined,
      notes: formData.get("notes") as string || undefined,
      progress: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    if (editingFacility) {
      updateMutation.mutate({ id: editingFacility.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEditDialog = (facility: Facility) => {
    setEditingFacility(facility);
    setIsDialogOpen(true);
  };

  const filteredFacilities = facilities?.filter((f) => {
    const matchesSearch =
      f.nameAr.toLowerCase().includes(search.toLowerCase()) ||
      f.nameEn.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || f.status === statusFilter;
    const matchesPhase = phaseFilter === "all" || f.currentPhase === phaseFilter;
    return matchesSearch && matchesStatus && matchesPhase;
  });

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">
          {t("facilities")}
        </h1>
        <Button onClick={() => { setEditingFacility(null); setIsDialogOpen(true); }} data-testid="button-add-facility">
          <Plus className="h-4 w-4 me-2" />
          {t("addFacility")}
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-9"
                data-testid="input-search"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]" data-testid="select-status-filter">
                <SelectValue placeholder={t("status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "ar" ? "الكل" : "All"}</SelectItem>
                <SelectItem value="active">{t("active")}</SelectItem>
                <SelectItem value="on_hold">{t("onHold")}</SelectItem>
                <SelectItem value="completed">{t("completed")}</SelectItem>
                <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={phaseFilter} onValueChange={setPhaseFilter}>
              <SelectTrigger className="w-[160px]" data-testid="select-phase-filter">
                <SelectValue placeholder={t("phase")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "ar" ? "الكل" : "All"}</SelectItem>
                <SelectItem value="creation">{t("creation")}</SelectItem>
                <SelectItem value="visit">{t("visit")}</SelectItem>
                <SelectItem value="procurement">{t("procurement")}</SelectItem>
                <SelectItem value="installation">{t("installation")}</SelectItem>
                <SelectItem value="maintenance">{t("maintenance")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredFacilities && filteredFacilities.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("facilityName")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("phase")}</TableHead>
                  <TableHead>{t("progress")}</TableHead>
                  <TableHead className="text-end">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFacilities.map((facility) => (
                  <TableRow key={facility.id} data-testid={`row-facility-${facility.id}`}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {language === "ar" ? facility.nameAr : facility.nameEn}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {language === "ar" ? facility.nameEn : facility.nameAr}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={facility.status as any} />
                    </TableCell>
                    <TableCell>
                      <PhaseBadge phase={facility.currentPhase as any} />
                    </TableCell>
                    <TableCell className="w-[200px]">
                      <ProgressBar value={facility.progress || 0} size="sm" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild data-testid={`button-view-${facility.id}`}>
                          <Link href={`/facilities/${facility.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(facility)}
                          data-testid={`button-edit-${facility.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(facility.id)}
                          disabled={deleteMutation.isPending}
                          data-testid={`button-delete-${facility.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          title={language === "ar" ? "لا توجد منشآت" : "No facilities yet"}
          description={language === "ar" ? "قم بإضافة منشأة جديدة للبدء" : "Add a new facility to get started"}
          action={{
            label: t("addFacility"),
            onClick: () => { setEditingFacility(null); setIsDialogOpen(true); },
          }}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFacility
                ? (language === "ar" ? "تعديل المنشأة" : "Edit Facility")
                : t("addFacility")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nameAr">{t("nameAr")} *</Label>
                <Input
                  id="nameAr"
                  name="nameAr"
                  required
                  defaultValue={editingFacility?.nameAr}
                  data-testid="input-name-ar"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameEn">{t("nameEn")} *</Label>
                <Input
                  id="nameEn"
                  name="nameEn"
                  required
                  defaultValue={editingFacility?.nameEn}
                  data-testid="input-name-en"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facilityTypeId">{t("facilityType")}</Label>
                <Select name="facilityTypeId" defaultValue={editingFacility?.facilityTypeId || ""}>
                  <SelectTrigger data-testid="select-facility-type">
                    <SelectValue placeholder={language === "ar" ? "اختر النوع" : "Select type"} />
                  </SelectTrigger>
                  <SelectContent>
                    {facilityTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {language === "ar" ? type.nameAr : type.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">{t("status")}</Label>
                <Select name="status" defaultValue={editingFacility?.status || "active"}>
                  <SelectTrigger data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t("active")}</SelectItem>
                    <SelectItem value="on_hold">{t("onHold")}</SelectItem>
                    <SelectItem value="completed">{t("completed")}</SelectItem>
                    <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentPhase">{t("phase")}</Label>
                <Select name="currentPhase" defaultValue={editingFacility?.currentPhase || "creation"}>
                  <SelectTrigger data-testid="select-phase">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="creation">{t("creation")}</SelectItem>
                    <SelectItem value="visit">{t("visit")}</SelectItem>
                    <SelectItem value="procurement">{t("procurement")}</SelectItem>
                    <SelectItem value="installation">{t("installation")}</SelectItem>
                    <SelectItem value="maintenance">{t("maintenance")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetDuration">{t("targetDuration")} ({t("days")})</Label>
                <Input
                  id="targetDuration"
                  name="targetDuration"
                  type="number"
                  min="1"
                  defaultValue={editingFacility?.targetDuration || ""}
                  data-testid="input-target-duration"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">{t("location")}</Label>
              <Input
                id="location"
                name="location"
                defaultValue={editingFacility?.location || ""}
                data-testid="input-location"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">{t("contactPerson")}</Label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  defaultValue={editingFacility?.contactPerson || ""}
                  data-testid="input-contact-person"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">{t("phone")}</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  defaultValue={editingFacility?.contactPhone || ""}
                  data-testid="input-contact-phone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">{t("email")}</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  defaultValue={editingFacility?.contactEmail || ""}
                  data-testid="input-contact-email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t("notes")}</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                defaultValue={editingFacility?.notes || ""}
                data-testid="textarea-notes"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-facility"
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
