import { pgTable, text, varchar, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  nameAr: text("name_ar"),
  nameEn: text("name_en"),
  isActive: boolean("is_active").default(true),
  createdAt: text("created_at"),
  allowedScreens: text("allowed_screens").array(),
});

export const AVAILABLE_SCREENS = [
  { id: "dashboard", nameAr: "لوحة التحكم", nameEn: "Dashboard" },
  { id: "facilities", nameAr: "المنشآت", nameEn: "Facilities" },
  { id: "master-data", nameAr: "البيانات الرئيسية", nameEn: "Master Data" },
  { id: "inventory", nameAr: "المخزون", nameEn: "Inventory" },
  { id: "reports", nameAr: "التقارير", nameEn: "Reports" },
  { id: "settings", nameAr: "الإعدادات", nameEn: "Settings" },
] as const;

export type ScreenId = typeof AVAILABLE_SCREENS[number]["id"];

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  nameAr: true,
  nameEn: true,
  isActive: true,
  allowedScreens: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const facilityTypes = pgTable("facility_types", {
  id: varchar("id", { length: 36 }).primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  order: integer("order").default(0),
});

export const insertFacilityTypeSchema = createInsertSchema(facilityTypes).omit({ id: true });
export type InsertFacilityType = z.infer<typeof insertFacilityTypeSchema>;
export type FacilityType = typeof facilityTypes.$inferSelect;

export const executionPhases = pgTable("execution_phases", {
  id: varchar("id", { length: 36 }).primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  order: integer("order").default(0),
});

export const insertExecutionPhaseSchema = createInsertSchema(executionPhases).omit({ id: true });
export type InsertExecutionPhase = z.infer<typeof insertExecutionPhaseSchema>;
export type ExecutionPhase = typeof executionPhases.$inferSelect;

export const connectionProtocols = pgTable("connection_protocols", {
  id: varchar("id", { length: 36 }).primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  order: integer("order").default(0),
});

export const insertConnectionProtocolSchema = createInsertSchema(connectionProtocols).omit({ id: true });
export type InsertConnectionProtocol = z.infer<typeof insertConnectionProtocolSchema>;
export type ConnectionProtocol = typeof connectionProtocols.$inferSelect;

export const purchaseLocations = pgTable("purchase_locations", {
  id: varchar("id", { length: 36 }).primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  order: integer("order").default(0),
});

export const insertPurchaseLocationSchema = createInsertSchema(purchaseLocations).omit({ id: true });
export type InsertPurchaseLocation = z.infer<typeof insertPurchaseLocationSchema>;
export type PurchaseLocation = typeof purchaseLocations.$inferSelect;

export const deviceBrands = pgTable("device_brands", {
  id: varchar("id", { length: 36 }).primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  order: integer("order").default(0),
});

export const insertDeviceBrandSchema = createInsertSchema(deviceBrands).omit({ id: true });
export type InsertDeviceBrand = z.infer<typeof insertDeviceBrandSchema>;
export type DeviceBrand = typeof deviceBrands.$inferSelect;

export const deviceTypes = pgTable("device_types", {
  id: varchar("id", { length: 36 }).primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  order: integer("order").default(0),
  protocolId: varchar("protocol_id", { length: 36 }),
  purchaseLocationId: varchar("purchase_location_id", { length: 36 }),
  brandId: varchar("brand_id", { length: 36 }),
});

export const insertDeviceTypeSchema = createInsertSchema(deviceTypes).omit({ id: true });
export type InsertDeviceType = z.infer<typeof insertDeviceTypeSchema>;
export type DeviceType = typeof deviceTypes.$inferSelect;

export const visitQuestions = pgTable("visit_questions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  questionAr: text("question_ar").notNull(),
  questionEn: text("question_en").notNull(),
  order: integer("order").default(0),
});

export const insertVisitQuestionSchema = createInsertSchema(visitQuestions).omit({ id: true });
export type InsertVisitQuestion = z.infer<typeof insertVisitQuestionSchema>;
export type VisitQuestion = typeof visitQuestions.$inferSelect;

export const installationSteps = pgTable("installation_steps", {
  id: varchar("id", { length: 36 }).primaryKey(),
  stepAr: text("step_ar").notNull(),
  stepEn: text("step_en").notNull(),
  order: integer("order").default(0),
});

export const insertInstallationStepSchema = createInsertSchema(installationSteps).omit({ id: true });
export type InsertInstallationStep = z.infer<typeof insertInstallationStepSchema>;
export type InstallationStep = typeof installationSteps.$inferSelect;

export const maintenanceTypes = pgTable("maintenance_types", {
  id: varchar("id", { length: 36 }).primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  order: integer("order").default(0),
});

export const insertMaintenanceTypeSchema = createInsertSchema(maintenanceTypes).omit({ id: true });
export type InsertMaintenanceType = z.infer<typeof insertMaintenanceTypeSchema>;
export type MaintenanceType = typeof maintenanceTypes.$inferSelect;

export const visitActivities = pgTable("visit_activities", {
  id: varchar("id", { length: 36 }).primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  order: integer("order").default(0),
});

export const insertVisitActivitySchema = createInsertSchema(visitActivities).omit({ id: true });
export type InsertVisitActivity = z.infer<typeof insertVisitActivitySchema>;
export type VisitActivity = typeof visitActivities.$inferSelect;

export const inventoryItems = pgTable("inventory_items", {
  id: varchar("id", { length: 36 }).primaryKey(),
  deviceTypeId: varchar("device_type_id", { length: 36 }).notNull(),
  quantity: integer("quantity").notNull().default(0),
  avgPrice: real("avg_price").default(0),
  addedDate: text("added_date"),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({ id: true });
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;

export type FacilityStatus = "active" | "on_hold" | "completed" | "cancelled";
export type FacilityPhase = "creation" | "visit" | "procurement" | "installation" | "maintenance";

export const facilities = pgTable("facilities", {
  id: varchar("id", { length: 36 }).primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  facilityTypeId: varchar("facility_type_id", { length: 36 }),
  status: text("status").notNull().default("active"),
  currentPhase: text("current_phase").notNull().default("creation"),
  progress: integer("progress").default(0),
  location: text("location"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  contactPerson: text("contact_person"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  targetDuration: integer("target_duration"),
  createdAt: text("created_at"),
  notes: text("notes"),
  lastModifiedBy: varchar("last_modified_by", { length: 36 }),
  lastModifiedAt: text("last_modified_at"),
});

export const insertFacilitySchema = createInsertSchema(facilities).omit({ id: true });
export type InsertFacility = z.infer<typeof insertFacilitySchema>;
export type Facility = typeof facilities.$inferSelect;

export const facilityVisits = pgTable("facility_visits", {
  id: varchar("id", { length: 36 }).primaryKey(),
  facilityId: varchar("facility_id", { length: 36 }).notNull(),
  visitDate: text("visit_date").notNull(),
  notes: text("notes"),
  answers: text("answers"),
  images: text("images"),
});

export const insertFacilityVisitSchema = createInsertSchema(facilityVisits).omit({ id: true });
export type InsertFacilityVisit = z.infer<typeof insertFacilityVisitSchema>;
export type FacilityVisit = typeof facilityVisits.$inferSelect;

export const facilityVisitActivities = pgTable("facility_visit_activities", {
  id: varchar("id", { length: 36 }).primaryKey(),
  visitId: varchar("visit_id", { length: 36 }).notNull(),
  activityId: varchar("activity_id", { length: 36 }).notNull(),
  completed: boolean("completed").default(false),
});

export const insertFacilityVisitActivitySchema = createInsertSchema(facilityVisitActivities).omit({ id: true });
export type InsertFacilityVisitActivity = z.infer<typeof insertFacilityVisitActivitySchema>;
export type FacilityVisitActivity = typeof facilityVisitActivities.$inferSelect;

export const facilityDevices = pgTable("facility_devices", {
  id: varchar("id", { length: 36 }).primaryKey(),
  facilityId: varchar("facility_id", { length: 36 }).notNull(),
  deviceTypeId: varchar("device_type_id", { length: 36 }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: real("unit_price"),
  status: text("status").default("pending"),
  purchaseOrderId: varchar("purchase_order_id", { length: 36 }),
});

export const insertFacilityDeviceSchema = createInsertSchema(facilityDevices).omit({ id: true });
export type InsertFacilityDevice = z.infer<typeof insertFacilityDeviceSchema>;
export type FacilityDevice = typeof facilityDevices.$inferSelect;

export const facilityInstallations = pgTable("facility_installations", {
  id: varchar("id", { length: 36 }).primaryKey(),
  facilityId: varchar("facility_id", { length: 36 }).notNull(),
  stepId: varchar("step_id", { length: 36 }).notNull(),
  completed: boolean("completed").default(false),
  completedDate: text("completed_date"),
  notes: text("notes"),
});

export const insertFacilityInstallationSchema = createInsertSchema(facilityInstallations).omit({ id: true });
export type InsertFacilityInstallation = z.infer<typeof insertFacilityInstallationSchema>;
export type FacilityInstallation = typeof facilityInstallations.$inferSelect;

export const facilityMaintenances = pgTable("facility_maintenances", {
  id: varchar("id", { length: 36 }).primaryKey(),
  facilityId: varchar("facility_id", { length: 36 }).notNull(),
  maintenanceTypeId: varchar("maintenance_type_id", { length: 36 }).notNull(),
  scheduledDate: text("scheduled_date"),
  completedDate: text("completed_date"),
  duration: integer("duration"),
  cost: real("cost"),
  notes: text("notes"),
  isEmergency: boolean("is_emergency").default(false),
});

export const insertFacilityMaintenanceSchema = createInsertSchema(facilityMaintenances).omit({ id: true });
export type InsertFacilityMaintenance = z.infer<typeof insertFacilityMaintenanceSchema>;
export type FacilityMaintenance = typeof facilityMaintenances.$inferSelect;

export const facilityServerData = pgTable("facility_server_data", {
  id: varchar("id", { length: 36 }).primaryKey(),
  facilityId: varchar("facility_id", { length: 36 }).notNull(),
  domainName: text("domain_name"),
  internalServerIp: text("internal_server_ip"),
  adminUsername: text("admin_username"),
  adminPassword: text("admin_password"),
});

export const insertFacilityServerDataSchema = createInsertSchema(facilityServerData).omit({ id: true });
export type InsertFacilityServerData = z.infer<typeof insertFacilityServerDataSchema>;
export type FacilityServerData = typeof facilityServerData.$inferSelect;

export const facilityServerUsers = pgTable("facility_server_users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  facilityId: varchar("facility_id", { length: 36 }).notNull(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  userType: text("user_type").default("enduser"),
});

export const insertFacilityServerUserSchema = createInsertSchema(facilityServerUsers).omit({ id: true });
export type InsertFacilityServerUser = z.infer<typeof insertFacilityServerUserSchema>;
export type FacilityServerUser = typeof facilityServerUsers.$inferSelect;

export const settings = pgTable("settings", {
  id: varchar("id", { length: 36 }).primaryKey(),
  companyNameAr: text("company_name_ar"),
  companyNameEn: text("company_name_en"),
  logoUrl: text("logo_url"),
  defaultLanguage: text("default_language").default("ar"),
});

export const insertSettingsSchema = createInsertSchema(settings).omit({ id: true });
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

export type FacilityImageEntityType = "overview" | "visit" | "installation" | "maintenance" | "server";

export const facilityImages = pgTable("facility_images", {
  id: varchar("id", { length: 36 }).primaryKey(),
  facilityId: varchar("facility_id", { length: 36 }).notNull(),
  entityType: text("entity_type").notNull(),
  entityId: varchar("entity_id", { length: 36 }),
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  data: text("data").notNull(),
  caption: text("caption"),
  uploadedAt: text("uploaded_at").notNull(),
});

export const insertFacilityImageSchema = createInsertSchema(facilityImages).omit({ id: true });
export type InsertFacilityImage = z.infer<typeof insertFacilityImageSchema>;
export type FacilityImage = typeof facilityImages.$inferSelect;

export interface DashboardStats {
  totalFacilities: number;
  activeFacilities: number;
  completedFacilities: number;
  totalCost: number;
  pendingMaintenance: number;
  phaseDistribution: { phase: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
  recentActivities: { id: string; facility: string; action: string; date: string }[];
}
