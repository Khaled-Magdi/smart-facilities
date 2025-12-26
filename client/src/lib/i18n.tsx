import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "ar" | "en";

type Translations = {
  [key: string]: {
    ar: string;
    en: string;
  };
};

export const translations: Translations = {
  appName: { ar: "نظام إدارة المنشآت الذكية", en: "Smart Facilities Management" },
  dashboard: { ar: "لوحة التحكم", en: "Dashboard" },
  facilities: { ar: "المنشآت", en: "Facilities" },
  masterData: { ar: "البيانات الأساسية", en: "Master Data" },
  inventory: { ar: "المستودع", en: "Inventory" },
  reports: { ar: "التقارير", en: "Reports" },
  settings: { ar: "الإعدادات", en: "Settings" },
  addFacility: { ar: "إضافة منشأة", en: "Add Facility" },
  search: { ar: "بحث...", en: "Search..." },
  filter: { ar: "فلتر", en: "Filter" },
  status: { ar: "الحالة", en: "Status" },
  phase: { ar: "المرحلة", en: "Phase" },
  progress: { ar: "التقدم", en: "Progress" },
  active: { ar: "نشط", en: "Active" },
  onHold: { ar: "متوقف", en: "On Hold" },
  completed: { ar: "مكتمل", en: "Completed" },
  cancelled: { ar: "ملغى", en: "Cancelled" },
  creation: { ar: "الإنشاء", en: "Creation" },
  visit: { ar: "الزيارة", en: "Visit" },
  procurement: { ar: "الشراء", en: "Procurement" },
  installation: { ar: "التركيب", en: "Installation" },
  maintenance: { ar: "الصيانة", en: "Maintenance" },
  totalFacilities: { ar: "إجمالي المنشآت", en: "Total Facilities" },
  activeFacilities: { ar: "المنشآت النشطة", en: "Active Facilities" },
  completedFacilities: { ar: "المنشآت المكتملة", en: "Completed Facilities" },
  pendingMaintenance: { ar: "صيانة معلقة", en: "Pending Maintenance" },
  totalCost: { ar: "إجمالي التكاليف", en: "Total Cost" },
  recentActivities: { ar: "النشاطات الأخيرة", en: "Recent Activities" },
  phaseDistribution: { ar: "توزيع المراحل", en: "Phase Distribution" },
  statusDistribution: { ar: "توزيع الحالات", en: "Status Distribution" },
  facilityName: { ar: "اسم المنشأة", en: "Facility Name" },
  facilityType: { ar: "نوع المنشأة", en: "Facility Type" },
  location: { ar: "الموقع", en: "Location" },
  contactPerson: { ar: "المسؤول", en: "Contact Person" },
  phone: { ar: "الهاتف", en: "Phone" },
  email: { ar: "البريد", en: "Email" },
  targetDuration: { ar: "المدة المستهدفة", en: "Target Duration" },
  days: { ar: "يوم", en: "days" },
  save: { ar: "حفظ", en: "Save" },
  cancel: { ar: "إلغاء", en: "Cancel" },
  delete: { ar: "حذف", en: "Delete" },
  edit: { ar: "تعديل", en: "Edit" },
  view: { ar: "عرض", en: "View" },
  add: { ar: "إضافة", en: "Add" },
  close: { ar: "إغلاق", en: "Close" },
  notes: { ar: "ملاحظات", en: "Notes" },
  date: { ar: "التاريخ", en: "Date" },
  actions: { ar: "الإجراءات", en: "Actions" },
  noData: { ar: "لا توجد بيانات", en: "No data available" },
  loading: { ar: "جاري التحميل...", en: "Loading..." },
  error: { ar: "حدث خطأ", en: "An error occurred" },
  facilityTypes: { ar: "أنواع المنشآت", en: "Facility Types" },
  executionPhases: { ar: "مراحل التنفيذ", en: "Execution Phases" },
  deviceTypes: { ar: "أنواع الأجهزة", en: "Device Types" },
  visitQuestions: { ar: "أسئلة الزيارات", en: "Visit Questions" },
  installationSteps: { ar: "خطوات التركيب", en: "Installation Steps" },
  maintenanceTypes: { ar: "أنواع الصيانة", en: "Maintenance Types" },
  nameAr: { ar: "الاسم بالعربية", en: "Arabic Name" },
  nameEn: { ar: "الاسم بالإنجليزية", en: "English Name" },
  quantity: { ar: "الكمية", en: "Quantity" },
  price: { ar: "السعر", en: "Price" },
  avgPrice: { ar: "متوسط السعر", en: "Avg Price" },
  addedDate: { ar: "تاريخ الإضافة", en: "Added Date" },
  deviceType: { ar: "نوع الجهاز", en: "Device Type" },
  companyName: { ar: "اسم الشركة", en: "Company Name" },
  logo: { ar: "الشعار", en: "Logo" },
  language: { ar: "اللغة", en: "Language" },
  theme: { ar: "المظهر", en: "Theme" },
  light: { ar: "فاتح", en: "Light" },
  dark: { ar: "داكن", en: "Dark" },
  generalInfo: { ar: "معلومات عامة", en: "General Info" },
  visits: { ar: "الزيارات", en: "Visits" },
  devices: { ar: "الأجهزة", en: "Devices" },
  addVisit: { ar: "إضافة زيارة", en: "Add Visit" },
  visitDate: { ar: "تاريخ الزيارة", en: "Visit Date" },
  answers: { ar: "الإجابات", en: "Answers" },
  addDevice: { ar: "إضافة جهاز", en: "Add Device" },
  unitPrice: { ar: "سعر الوحدة", en: "Unit Price" },
  total: { ar: "الإجمالي", en: "Total" },
  pending: { ar: "قيد الانتظار", en: "Pending" },
  ordered: { ar: "تم الطلب", en: "Ordered" },
  received: { ar: "تم الاستلام", en: "Received" },
  step: { ar: "الخطوة", en: "Step" },
  completedOn: { ar: "مكتمل في", en: "Completed on" },
  markComplete: { ar: "تعيين كمكتمل", en: "Mark Complete" },
  scheduledMaintenance: { ar: "صيانة مجدولة", en: "Scheduled Maintenance" },
  emergencyMaintenance: { ar: "صيانة طارئة", en: "Emergency Maintenance" },
  scheduledDate: { ar: "التاريخ المجدول", en: "Scheduled Date" },
  completedDate: { ar: "تاريخ الإكمال", en: "Completed Date" },
  duration: { ar: "المدة", en: "Duration" },
  cost: { ar: "التكلفة", en: "Cost" },
  hours: { ar: "ساعة", en: "hours" },
  maintenanceType: { ar: "نوع الصيانة", en: "Maintenance Type" },
  addMaintenance: { ar: "إضافة صيانة", en: "Add Maintenance" },
  alerts: { ar: "التنبيهات", en: "Alerts" },
  delayAlert: { ar: "تأخير في الجدول", en: "Schedule Delay" },
  maintenanceDue: { ar: "صيانة مستحقة", en: "Maintenance Due" },
  lowStock: { ar: "نقص في المخزون", en: "Low Stock" },
  users: { ar: "المستخدمين", en: "Users" },
  role: { ar: "الدور", en: "Role" },
  admin: { ar: "مدير", en: "Admin" },
  user: { ar: "مستخدم", en: "User" },
  creationPhase: { ar: "مرحلة الإنشاء", en: "Creation Phase" },
  visitPhase: { ar: "مرحلة الزيارة", en: "Visit Phase" },
  procurementPhase: { ar: "مرحلة الشراء", en: "Procurement Phase" },
  installationPhase: { ar: "مرحلة التركيب", en: "Installation Phase" },
  maintenancePhase: { ar: "مرحلة الصيانة", en: "Maintenance Phase" },
  allFacilities: { ar: "جميع المنشآت", en: "All Facilities" },
  back: { ar: "رجوع", en: "Back" },
  overview: { ar: "نظرة عامة", en: "Overview" },
  currency: { ar: "ر.س", en: "SAR" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("language");
      return (stored as Language) || "ar";
    }
    return "ar";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language];
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
