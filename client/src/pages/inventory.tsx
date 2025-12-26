import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Package, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { EmptyState } from "@/components/empty-state";
import { LoadingState, LoadingSpinner } from "@/components/loading-state";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { InventoryItem, DeviceType } from "@shared/schema";

export default function Inventory() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const { data: inventory, isLoading } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
  });

  const { data: deviceTypes } = useQuery<DeviceType[]>({
    queryKey: ["/api/device-types"],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/inventory", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      setDialogOpen(false);
      setEditingItem(null);
      toast({ title: language === "ar" ? "تمت الإضافة بنجاح" : "Added successfully" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest("PATCH", `/api/inventory/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      setDialogOpen(false);
      setEditingItem(null);
      toast({ title: language === "ar" ? "تم التحديث بنجاح" : "Updated successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/inventory/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      toast({ title: language === "ar" ? "تم الحذف بنجاح" : "Deleted successfully" });
    },
  });

  const getDeviceTypeName = (deviceTypeId: string) => {
    const dt = deviceTypes?.find((d) => d.id === deviceTypeId);
    return dt ? (language === "ar" ? dt.nameAr : dt.nameEn) : deviceTypeId;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      deviceTypeId: formData.get("deviceTypeId"),
      quantity: parseInt(formData.get("quantity") as string),
      avgPrice: parseFloat(formData.get("avgPrice") as string) || 0,
      addedDate: formData.get("addedDate") || new Date().toISOString().split("T")[0],
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEditDialog = (item: InventoryItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const totalItems = inventory?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
  const totalValue = inventory?.reduce((sum, item) => sum + (item.quantity || 0) * (item.avgPrice || 0), 0) || 0;

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">
          {t("inventory")}
        </h1>
        <Button
          onClick={() => {
            setEditingItem(null);
            setDialogOpen(true);
          }}
          data-testid="button-add-inventory"
        >
          <Plus className="h-4 w-4 me-2" />
          {t("add")}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "إجمالي الأصناف" : "Total Items"}
                </p>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "إجمالي القيمة" : "Total Value"}
                </p>
                <p className="text-2xl font-bold">
                  {totalValue.toLocaleString()} {t("currency")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {inventory && inventory.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("deviceType")}</TableHead>
                  <TableHead>{t("quantity")}</TableHead>
                  <TableHead>{t("avgPrice")}</TableHead>
                  <TableHead>{t("total")}</TableHead>
                  <TableHead>{t("addedDate")}</TableHead>
                  <TableHead className="text-end">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id} data-testid={`row-inventory-${item.id}`}>
                    <TableCell className="font-medium">
                      {getDeviceTypeName(item.deviceTypeId)}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {(item.avgPrice || 0).toLocaleString()} {t("currency")}
                    </TableCell>
                    <TableCell>
                      {((item.quantity || 0) * (item.avgPrice || 0)).toLocaleString()} {t("currency")}
                    </TableCell>
                    <TableCell>{item.addedDate || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={Package}
          title={language === "ar" ? "لا توجد أصناف في المستودع" : "No inventory items"}
          description={language === "ar" ? "أضف أجهزة للمستودع للبدء" : "Add devices to inventory to get started"}
          action={{
            label: t("add"),
            onClick: () => {
              setEditingItem(null);
              setDialogOpen(true);
            },
          }}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem
                ? (language === "ar" ? "تعديل صنف" : "Edit Item")
                : (language === "ar" ? "إضافة صنف" : "Add Item")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deviceTypeId">{t("deviceType")} *</Label>
              <Select name="deviceTypeId" defaultValue={editingItem?.deviceTypeId || ""} required>
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
                  min="0"
                  required
                  defaultValue={editingItem?.quantity || ""}
                  data-testid="input-quantity"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avgPrice">{t("avgPrice")}</Label>
                <Input
                  id="avgPrice"
                  name="avgPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={editingItem?.avgPrice || ""}
                  data-testid="input-avg-price"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="addedDate">{t("addedDate")}</Label>
              <Input
                id="addedDate"
                name="addedDate"
                type="date"
                defaultValue={editingItem?.addedDate || new Date().toISOString().split("T")[0]}
                data-testid="input-added-date"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-inventory"
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
