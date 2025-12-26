import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Upload, X, Image as ImageIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/loading-state";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { FacilityImage } from "@shared/schema";

interface ImageUploadProps {
  facilityId: string;
  entityType: "overview" | "visit" | "installation" | "maintenance" | "server";
  entityId?: string;
  maxFileSize?: number;
}

export function ImageUpload({ facilityId, entityType, entityId, maxFileSize = 2 * 1024 * 1024 }: ImageUploadProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<FacilityImage | null>(null);
  const [uploading, setUploading] = useState(false);

  const queryKey = entityId
    ? ["/api/facilities", facilityId, "images", entityType, entityId]
    : ["/api/facilities", facilityId, "images", entityType];

  const { data: images, isLoading } = useQuery<FacilityImage[]>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams({ entityType });
      if (entityId) params.append("entityId", entityId);
      const res = await fetch(`/api/facilities/${facilityId}/images?${params}`);
      if (!res.ok) throw new Error("Failed to fetch images");
      return res.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64 = reader.result as string;
            await apiRequest("POST", `/api/facilities/${facilityId}/images`, {
              facilityId,
              entityType,
              entityId: entityId || null,
              filename: file.name,
              mimeType: file.type,
              data: base64,
              uploadedAt: new Date().toISOString(),
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: language === "ar" ? "تم رفع الصورة بنجاح" : "Image uploaded successfully",
      });
    },
    onError: () => {
      toast({
        title: language === "ar" ? "فشل رفع الصورة" : "Failed to upload image",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (imageId: string) => 
      apiRequest("DELETE", `/api/facilities/${facilityId}/images/${imageId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setPreviewImage(null);
      toast({
        title: language === "ar" ? "تم حذف الصورة بنجاح" : "Image deleted successfully",
      });
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast({
        title: language === "ar" ? "نوع الملف غير مدعوم" : "Unsupported file type",
        description: language === "ar" ? "يرجى اختيار ملف JPEG أو PNG" : "Please select a JPEG or PNG file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxFileSize) {
      toast({
        title: language === "ar" ? "الملف كبير جداً" : "File too large",
        description: language === "ar" ? `الحد الأقصى ${maxFileSize / 1024 / 1024}MB` : `Maximum size is ${maxFileSize / 1024 / 1024}MB`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      await uploadMutation.mutateAsync(file);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <Label className="font-medium">
          {language === "ar" ? "الصور المرفقة" : "Attached Images"}
        </Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          data-testid={`button-upload-image-${entityType}`}
        >
          {uploading ? (
            <LoadingSpinner size="sm" className="me-2" />
          ) : (
            <Upload className="h-4 w-4 me-2" />
          )}
          {language === "ar" ? "رفع صورة" : "Upload Image"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
          className="hidden"
          data-testid={`input-file-${entityType}`}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : images && images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <Card
              key={image.id}
              className="overflow-hidden cursor-pointer hover-elevate"
              onClick={() => setPreviewImage(image)}
              data-testid={`image-card-${image.id}`}
            >
              <CardContent className="p-0 aspect-square relative">
                <img
                  src={image.data}
                  alt={image.filename || ""}
                  className="w-full h-full object-cover"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground border border-dashed rounded-md">
          <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
          <span className="text-sm">
            {language === "ar" ? "لا توجد صور مرفقة" : "No images attached"}
          </span>
        </div>
      )}

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-4">
              <span className="truncate">{previewImage?.filename}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => previewImage && deleteMutation.mutate(previewImage.id)}
                disabled={deleteMutation.isPending}
                data-testid="button-delete-preview-image"
              >
                {deleteMutation.isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Trash2 className="h-4 w-4 text-destructive" />
                )}
              </Button>
            </DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="flex justify-center">
              <img
                src={previewImage.data}
                alt={previewImage.filename || ""}
                className="max-w-full max-h-[70vh] object-contain rounded-md"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
