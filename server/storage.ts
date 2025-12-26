import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";
import type {
  User,
  InsertUser,
  FacilityType,
  InsertFacilityType,
  ConnectionProtocol,
  InsertConnectionProtocol,
  PurchaseLocation,
  InsertPurchaseLocation,
  DeviceBrand,
  InsertDeviceBrand,
  DeviceType,
  InsertDeviceType,
  VisitQuestion,
  InsertVisitQuestion,
  InstallationStep,
  InsertInstallationStep,
  MaintenanceType,
  InsertMaintenanceType,
  VisitActivity,
  InsertVisitActivity,
  InventoryItem,
  InsertInventoryItem,
  Facility,
  InsertFacility,
  FacilityVisit,
  InsertFacilityVisit,
  FacilityVisitActivity,
  InsertFacilityVisitActivity,
  FacilityDevice,
  InsertFacilityDevice,
  FacilityInstallation,
  InsertFacilityInstallation,
  FacilityMaintenance,
  InsertFacilityMaintenance,
  FacilityServerData,
  InsertFacilityServerData,
  FacilityServerUser,
  InsertFacilityServerUser,
  FacilityImage,
  InsertFacilityImage,
  Settings,
  InsertSettings,
  DashboardStats,
} from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  sessionStore: session.Store;
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;

  getFacilityTypes(): Promise<FacilityType[]>;
  getFacilityType(id: string): Promise<FacilityType | undefined>;
  createFacilityType(data: InsertFacilityType): Promise<FacilityType>;
  updateFacilityType(id: string, data: Partial<InsertFacilityType>): Promise<FacilityType | undefined>;
  deleteFacilityType(id: string): Promise<boolean>;

  getConnectionProtocols(): Promise<ConnectionProtocol[]>;
  createConnectionProtocol(data: InsertConnectionProtocol): Promise<ConnectionProtocol>;
  updateConnectionProtocol(id: string, data: Partial<InsertConnectionProtocol>): Promise<ConnectionProtocol | undefined>;
  deleteConnectionProtocol(id: string): Promise<boolean>;

  getPurchaseLocations(): Promise<PurchaseLocation[]>;
  createPurchaseLocation(data: InsertPurchaseLocation): Promise<PurchaseLocation>;
  updatePurchaseLocation(id: string, data: Partial<InsertPurchaseLocation>): Promise<PurchaseLocation | undefined>;
  deletePurchaseLocation(id: string): Promise<boolean>;

  getDeviceBrands(): Promise<DeviceBrand[]>;
  createDeviceBrand(data: InsertDeviceBrand): Promise<DeviceBrand>;
  updateDeviceBrand(id: string, data: Partial<InsertDeviceBrand>): Promise<DeviceBrand | undefined>;
  deleteDeviceBrand(id: string): Promise<boolean>;

  getDeviceTypes(): Promise<DeviceType[]>;
  getDeviceType(id: string): Promise<DeviceType | undefined>;
  createDeviceType(data: InsertDeviceType): Promise<DeviceType>;
  updateDeviceType(id: string, data: Partial<InsertDeviceType>): Promise<DeviceType | undefined>;
  deleteDeviceType(id: string): Promise<boolean>;

  getVisitQuestions(): Promise<VisitQuestion[]>;
  createVisitQuestion(data: InsertVisitQuestion): Promise<VisitQuestion>;
  updateVisitQuestion(id: string, data: Partial<InsertVisitQuestion>): Promise<VisitQuestion | undefined>;
  deleteVisitQuestion(id: string): Promise<boolean>;

  getInstallationSteps(): Promise<InstallationStep[]>;
  createInstallationStep(data: InsertInstallationStep): Promise<InstallationStep>;
  updateInstallationStep(id: string, data: Partial<InsertInstallationStep>): Promise<InstallationStep | undefined>;
  deleteInstallationStep(id: string): Promise<boolean>;

  getMaintenanceTypes(): Promise<MaintenanceType[]>;
  createMaintenanceType(data: InsertMaintenanceType): Promise<MaintenanceType>;
  updateMaintenanceType(id: string, data: Partial<InsertMaintenanceType>): Promise<MaintenanceType | undefined>;
  deleteMaintenanceType(id: string): Promise<boolean>;

  getVisitActivities(): Promise<VisitActivity[]>;
  createVisitActivity(data: InsertVisitActivity): Promise<VisitActivity>;
  updateVisitActivity(id: string, data: Partial<InsertVisitActivity>): Promise<VisitActivity | undefined>;
  deleteVisitActivity(id: string): Promise<boolean>;

  getInventory(): Promise<InventoryItem[]>;
  getInventoryItem(id: string): Promise<InventoryItem | undefined>;
  createInventoryItem(data: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: string, data: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: string): Promise<boolean>;

  getFacilities(): Promise<Facility[]>;
  getFacility(id: string): Promise<Facility | undefined>;
  createFacility(data: InsertFacility): Promise<Facility>;
  updateFacility(id: string, data: Partial<InsertFacility>): Promise<Facility | undefined>;
  deleteFacility(id: string): Promise<boolean>;

  getFacilityVisits(facilityId: string): Promise<FacilityVisit[]>;
  createFacilityVisit(data: InsertFacilityVisit): Promise<FacilityVisit>;

  getFacilityVisitActivities(visitId: string): Promise<FacilityVisitActivity[]>;
  createFacilityVisitActivity(data: InsertFacilityVisitActivity): Promise<FacilityVisitActivity>;
  deleteFacilityVisitActivities(visitId: string): Promise<boolean>;

  getFacilityDevices(facilityId: string): Promise<FacilityDevice[]>;
  createFacilityDevice(data: InsertFacilityDevice): Promise<FacilityDevice>;
  updateFacilityDevice(id: string, data: Partial<InsertFacilityDevice>): Promise<FacilityDevice | undefined>;

  getFacilityInstallations(facilityId: string): Promise<FacilityInstallation[]>;
  createFacilityInstallation(data: InsertFacilityInstallation): Promise<FacilityInstallation>;
  updateFacilityInstallation(id: string, data: Partial<InsertFacilityInstallation>): Promise<FacilityInstallation | undefined>;

  getFacilityMaintenances(facilityId: string): Promise<FacilityMaintenance[]>;
  createFacilityMaintenance(data: InsertFacilityMaintenance): Promise<FacilityMaintenance>;
  updateFacilityMaintenance(id: string, data: Partial<InsertFacilityMaintenance>): Promise<FacilityMaintenance | undefined>;

  getFacilityServerData(facilityId: string): Promise<FacilityServerData | undefined>;
  upsertFacilityServerData(data: InsertFacilityServerData): Promise<FacilityServerData>;

  getFacilityServerUsers(facilityId: string): Promise<FacilityServerUser[]>;
  createFacilityServerUser(data: InsertFacilityServerUser): Promise<FacilityServerUser>;
  updateFacilityServerUser(id: string, data: Partial<InsertFacilityServerUser>): Promise<FacilityServerUser | undefined>;
  deleteFacilityServerUser(id: string): Promise<boolean>;

  getFacilityImages(facilityId: string, entityType?: string, entityId?: string): Promise<FacilityImage[]>;
  createFacilityImage(data: InsertFacilityImage): Promise<FacilityImage>;
  deleteFacilityImage(id: string): Promise<boolean>;

  getSettings(): Promise<Settings | undefined>;
  updateSettings(data: Partial<InsertSettings>): Promise<Settings>;

  getDashboardStats(): Promise<DashboardStats>;
}

export class MemStorage implements IStorage {
  public sessionStore: session.Store;
  private users: Map<string, User>;
  private facilityTypes: Map<string, FacilityType>;
  private connectionProtocols: Map<string, ConnectionProtocol>;
  private purchaseLocations: Map<string, PurchaseLocation>;
  private deviceBrands: Map<string, DeviceBrand>;
  private deviceTypes: Map<string, DeviceType>;
  private visitQuestions: Map<string, VisitQuestion>;
  private installationSteps: Map<string, InstallationStep>;
  private maintenanceTypes: Map<string, MaintenanceType>;
  private visitActivities: Map<string, VisitActivity>;
  private inventory: Map<string, InventoryItem>;
  private facilities: Map<string, Facility>;
  private facilityVisits: Map<string, FacilityVisit>;
  private facilityVisitActivities: Map<string, FacilityVisitActivity>;
  private facilityDevices: Map<string, FacilityDevice>;
  private facilityInstallations: Map<string, FacilityInstallation>;
  private facilityMaintenances: Map<string, FacilityMaintenance>;
  private facilityServerData: Map<string, FacilityServerData>;
  private facilityServerUsers: Map<string, FacilityServerUser>;
  private facilityImages: Map<string, FacilityImage>;
  private settings: Settings | undefined;

  constructor() {
    this.sessionStore = new MemoryStore({ checkPeriod: 86400000 });
    this.users = new Map();
    this.facilityTypes = new Map();
    this.connectionProtocols = new Map();
    this.purchaseLocations = new Map();
    this.deviceBrands = new Map();
    this.deviceTypes = new Map();
    this.visitQuestions = new Map();
    this.installationSteps = new Map();
    this.maintenanceTypes = new Map();
    this.visitActivities = new Map();
    this.inventory = new Map();
    this.facilities = new Map();
    this.facilityVisits = new Map();
    this.facilityVisitActivities = new Map();
    this.facilityDevices = new Map();
    this.facilityInstallations = new Map();
    this.facilityMaintenances = new Map();
    this.facilityServerData = new Map();
    this.facilityServerUsers = new Map();
    this.facilityImages = new Map();

    this.seedData();
  }

  private seedData() {
    const adminId = randomUUID();
    this.users.set(adminId, {
      id: adminId,
      username: "admin",
      password: "5e353aa643a3cbb8e4459d25bcef4960bfe47bacd6c9c0837f5be745ad8e6d1e117428257e69bb83102b99dce798dd9cde58c675b317729bcf06be6eefdf5e27.66e8dbf4de08478b523eacec6d2316f4",
      role: "admin",
      nameAr: "مدير النظام",
      nameEn: "System Admin",
      isActive: true,
      createdAt: new Date().toISOString(),
      allowedScreens: ["dashboard", "facilities", "master-data", "inventory", "reports", "settings"],
    });

    const ftypes = [
      { id: randomUUID(), nameAr: "مبنى إداري", nameEn: "Administrative Building", order: 1 },
      { id: randomUUID(), nameAr: "مستشفى", nameEn: "Hospital", order: 2 },
      { id: randomUUID(), nameAr: "مدرسة", nameEn: "School", order: 3 },
      { id: randomUUID(), nameAr: "مركز تجاري", nameEn: "Shopping Center", order: 4 },
    ];
    ftypes.forEach((ft) => this.facilityTypes.set(ft.id, ft));

    const dtypes = [
      { id: randomUUID(), nameAr: "مكيف مركزي", nameEn: "Central AC", order: 1 },
      { id: randomUUID(), nameAr: "كاميرا مراقبة", nameEn: "Security Camera", order: 2 },
      { id: randomUUID(), nameAr: "إنذار حريق", nameEn: "Fire Alarm", order: 3 },
      { id: randomUUID(), nameAr: "مصعد", nameEn: "Elevator", order: 4 },
    ];
    dtypes.forEach((dt) => this.deviceTypes.set(dt.id, dt));

    const questions = [
      { id: randomUUID(), questionAr: "هل الموقع مناسب للتركيب؟", questionEn: "Is the site suitable for installation?", order: 1 },
      { id: randomUUID(), questionAr: "هل تتوفر مصادر الطاقة؟", questionEn: "Are power sources available?", order: 2 },
      { id: randomUUID(), questionAr: "هل هناك عوائق في الموقع؟", questionEn: "Are there any obstacles at the site?", order: 3 },
    ];
    questions.forEach((q) => this.visitQuestions.set(q.id, q));

    const steps = [
      { id: randomUUID(), stepAr: "تجهيز الموقع", stepEn: "Site Preparation", order: 1 },
      { id: randomUUID(), stepAr: "تركيب الأجهزة", stepEn: "Device Installation", order: 2 },
      { id: randomUUID(), stepAr: "التوصيلات الكهربائية", stepEn: "Electrical Connections", order: 3 },
      { id: randomUUID(), stepAr: "الاختبار والتشغيل", stepEn: "Testing and Commissioning", order: 4 },
      { id: randomUUID(), stepAr: "التدريب والتسليم", stepEn: "Training and Handover", order: 5 },
    ];
    steps.forEach((s) => this.installationSteps.set(s.id, s));

    const mtypes = [
      { id: randomUUID(), nameAr: "صيانة دورية", nameEn: "Scheduled Maintenance", order: 1 },
      { id: randomUUID(), nameAr: "صيانة تصحيحية", nameEn: "Corrective Maintenance", order: 2 },
      { id: randomUUID(), nameAr: "صيانة وقائية", nameEn: "Preventive Maintenance", order: 3 },
    ];
    mtypes.forEach((mt) => this.maintenanceTypes.set(mt.id, mt));

    const vactivities = [
      { id: randomUUID(), nameAr: "فحص الموقع", nameEn: "Site Inspection", order: 1 },
      { id: randomUUID(), nameAr: "قياس المساحات", nameEn: "Area Measurement", order: 2 },
      { id: randomUUID(), nameAr: "توثيق الحالة الراهنة", nameEn: "Current State Documentation", order: 3 },
      { id: randomUUID(), nameAr: "مراجعة المخططات", nameEn: "Blueprint Review", order: 4 },
      { id: randomUUID(), nameAr: "التقاط الصور", nameEn: "Photo Capture", order: 5 },
    ];
    vactivities.forEach((va) => this.visitActivities.set(va.id, va));

    this.settings = {
      id: randomUUID(),
      companyNameAr: "شركة إدارة المنشآت",
      companyNameEn: "Facilities Management Co.",
      logoUrl: null,
      defaultLanguage: "ar",
    };

    const facilityTypeIds = Array.from(this.facilityTypes.keys());
    const sampleFacilities = [
      {
        id: randomUUID(),
        nameAr: "مبنى الإدارة الرئيسي",
        nameEn: "Main Admin Building",
        facilityTypeId: facilityTypeIds[0],
        status: "active",
        currentPhase: "installation",
        progress: 65,
        location: "الرياض، حي العليا",
        contactPerson: "أحمد محمد",
        contactPhone: "+966501234567",
        contactEmail: "ahmed@example.com",
        targetDuration: 90,
        createdAt: "2024-01-15",
        notes: "مشروع أولوية عالية",
        latitude: null,
        longitude: null,
      },
      {
        id: randomUUID(),
        nameAr: "مستشفى الأمل",
        nameEn: "Al-Amal Hospital",
        facilityTypeId: facilityTypeIds[1],
        status: "active",
        currentPhase: "visit",
        progress: 25,
        location: "جدة، حي الروضة",
        contactPerson: "سارة أحمد",
        contactPhone: "+966509876543",
        contactEmail: "sara@example.com",
        targetDuration: 180,
        createdAt: "2024-02-20",
        notes: null,
        latitude: null,
        longitude: null,
      },
      {
        id: randomUUID(),
        nameAr: "مدرسة النور",
        nameEn: "Al-Noor School",
        facilityTypeId: facilityTypeIds[2],
        status: "completed",
        currentPhase: "maintenance",
        progress: 100,
        location: "الدمام، حي الفيصلية",
        contactPerson: "خالد عبدالله",
        contactPhone: "+966507654321",
        contactEmail: "khaled@example.com",
        targetDuration: 60,
        createdAt: "2023-11-10",
        notes: "تم الانتهاء من جميع المراحل",
        latitude: null,
        longitude: null,
      },
    ];
    sampleFacilities.forEach((f) => this.facilities.set(f.id, f as Facility));

    const deviceTypeIds = Array.from(this.deviceTypes.keys());
    const facilityIds = Array.from(this.facilities.keys());
    
    const sampleInventory = [
      { id: randomUUID(), deviceTypeId: deviceTypeIds[0], quantity: 50, avgPrice: 2500, addedDate: "2024-01-10" },
      { id: randomUUID(), deviceTypeId: deviceTypeIds[1], quantity: 200, avgPrice: 350, addedDate: "2024-01-15" },
      { id: randomUUID(), deviceTypeId: deviceTypeIds[2], quantity: 100, avgPrice: 150, addedDate: "2024-02-01" },
    ];
    sampleInventory.forEach((inv) => this.inventory.set(inv.id, inv));

    const stepIds = Array.from(this.installationSteps.keys());
    facilityIds.forEach((facilityId) => {
      stepIds.forEach((stepId, index) => {
        const inst: FacilityInstallation = {
          id: randomUUID(),
          facilityId,
          stepId,
          completed: index < 2,
          completedDate: index < 2 ? "2024-03-01" : null,
          notes: null,
        };
        this.facilityInstallations.set(inst.id, inst);
      });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id, 
      ...insertUser,
      isActive: insertUser.isActive ?? true,
      createdAt: new Date().toISOString(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.users.set(id, updated);
    return updated;
  }

  async getFacilityTypes(): Promise<FacilityType[]> {
    return Array.from(this.facilityTypes.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getFacilityType(id: string): Promise<FacilityType | undefined> {
    return this.facilityTypes.get(id);
  }

  async createFacilityType(data: InsertFacilityType): Promise<FacilityType> {
    const id = randomUUID();
    const item: FacilityType = { id, ...data };
    this.facilityTypes.set(id, item);
    return item;
  }

  async updateFacilityType(id: string, data: Partial<InsertFacilityType>): Promise<FacilityType | undefined> {
    const existing = this.facilityTypes.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.facilityTypes.set(id, updated);
    return updated;
  }

  async deleteFacilityType(id: string): Promise<boolean> {
    return this.facilityTypes.delete(id);
  }

  async getConnectionProtocols(): Promise<ConnectionProtocol[]> {
    return Array.from(this.connectionProtocols.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async createConnectionProtocol(data: InsertConnectionProtocol): Promise<ConnectionProtocol> {
    const id = randomUUID();
    const item: ConnectionProtocol = { id, ...data };
    this.connectionProtocols.set(id, item);
    return item;
  }

  async updateConnectionProtocol(id: string, data: Partial<InsertConnectionProtocol>): Promise<ConnectionProtocol | undefined> {
    const existing = this.connectionProtocols.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.connectionProtocols.set(id, updated);
    return updated;
  }

  async deleteConnectionProtocol(id: string): Promise<boolean> {
    return this.connectionProtocols.delete(id);
  }

  async getPurchaseLocations(): Promise<PurchaseLocation[]> {
    return Array.from(this.purchaseLocations.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async createPurchaseLocation(data: InsertPurchaseLocation): Promise<PurchaseLocation> {
    const id = randomUUID();
    const item: PurchaseLocation = { id, ...data };
    this.purchaseLocations.set(id, item);
    return item;
  }

  async updatePurchaseLocation(id: string, data: Partial<InsertPurchaseLocation>): Promise<PurchaseLocation | undefined> {
    const existing = this.purchaseLocations.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.purchaseLocations.set(id, updated);
    return updated;
  }

  async deletePurchaseLocation(id: string): Promise<boolean> {
    return this.purchaseLocations.delete(id);
  }

  async getDeviceBrands(): Promise<DeviceBrand[]> {
    return Array.from(this.deviceBrands.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async createDeviceBrand(data: InsertDeviceBrand): Promise<DeviceBrand> {
    const id = randomUUID();
    const item: DeviceBrand = { id, ...data };
    this.deviceBrands.set(id, item);
    return item;
  }

  async updateDeviceBrand(id: string, data: Partial<InsertDeviceBrand>): Promise<DeviceBrand | undefined> {
    const existing = this.deviceBrands.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.deviceBrands.set(id, updated);
    return updated;
  }

  async deleteDeviceBrand(id: string): Promise<boolean> {
    return this.deviceBrands.delete(id);
  }

  async getDeviceTypes(): Promise<DeviceType[]> {
    return Array.from(this.deviceTypes.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getDeviceType(id: string): Promise<DeviceType | undefined> {
    return this.deviceTypes.get(id);
  }

  async createDeviceType(data: InsertDeviceType): Promise<DeviceType> {
    const id = randomUUID();
    const item: DeviceType = { id, ...data };
    this.deviceTypes.set(id, item);
    return item;
  }

  async updateDeviceType(id: string, data: Partial<InsertDeviceType>): Promise<DeviceType | undefined> {
    const existing = this.deviceTypes.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.deviceTypes.set(id, updated);
    return updated;
  }

  async deleteDeviceType(id: string): Promise<boolean> {
    return this.deviceTypes.delete(id);
  }

  async getVisitQuestions(): Promise<VisitQuestion[]> {
    return Array.from(this.visitQuestions.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async createVisitQuestion(data: InsertVisitQuestion): Promise<VisitQuestion> {
    const id = randomUUID();
    const item: VisitQuestion = { id, ...data };
    this.visitQuestions.set(id, item);
    return item;
  }

  async updateVisitQuestion(id: string, data: Partial<InsertVisitQuestion>): Promise<VisitQuestion | undefined> {
    const existing = this.visitQuestions.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.visitQuestions.set(id, updated);
    return updated;
  }

  async deleteVisitQuestion(id: string): Promise<boolean> {
    return this.visitQuestions.delete(id);
  }

  async getInstallationSteps(): Promise<InstallationStep[]> {
    return Array.from(this.installationSteps.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async createInstallationStep(data: InsertInstallationStep): Promise<InstallationStep> {
    const id = randomUUID();
    const item: InstallationStep = { id, ...data };
    this.installationSteps.set(id, item);
    return item;
  }

  async updateInstallationStep(id: string, data: Partial<InsertInstallationStep>): Promise<InstallationStep | undefined> {
    const existing = this.installationSteps.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.installationSteps.set(id, updated);
    return updated;
  }

  async deleteInstallationStep(id: string): Promise<boolean> {
    return this.installationSteps.delete(id);
  }

  async getMaintenanceTypes(): Promise<MaintenanceType[]> {
    return Array.from(this.maintenanceTypes.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async createMaintenanceType(data: InsertMaintenanceType): Promise<MaintenanceType> {
    const id = randomUUID();
    const item: MaintenanceType = { id, ...data };
    this.maintenanceTypes.set(id, item);
    return item;
  }

  async updateMaintenanceType(id: string, data: Partial<InsertMaintenanceType>): Promise<MaintenanceType | undefined> {
    const existing = this.maintenanceTypes.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.maintenanceTypes.set(id, updated);
    return updated;
  }

  async deleteMaintenanceType(id: string): Promise<boolean> {
    return this.maintenanceTypes.delete(id);
  }

  async getVisitActivities(): Promise<VisitActivity[]> {
    return Array.from(this.visitActivities.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async createVisitActivity(data: InsertVisitActivity): Promise<VisitActivity> {
    const id = randomUUID();
    const item: VisitActivity = { id, ...data };
    this.visitActivities.set(id, item);
    return item;
  }

  async updateVisitActivity(id: string, data: Partial<InsertVisitActivity>): Promise<VisitActivity | undefined> {
    const existing = this.visitActivities.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.visitActivities.set(id, updated);
    return updated;
  }

  async deleteVisitActivity(id: string): Promise<boolean> {
    return this.visitActivities.delete(id);
  }

  async getInventory(): Promise<InventoryItem[]> {
    return Array.from(this.inventory.values());
  }

  async getInventoryItem(id: string): Promise<InventoryItem | undefined> {
    return this.inventory.get(id);
  }

  async createInventoryItem(data: InsertInventoryItem): Promise<InventoryItem> {
    const id = randomUUID();
    const item: InventoryItem = { id, ...data };
    this.inventory.set(id, item);
    return item;
  }

  async updateInventoryItem(id: string, data: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const existing = this.inventory.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.inventory.set(id, updated);
    return updated;
  }

  async deleteInventoryItem(id: string): Promise<boolean> {
    return this.inventory.delete(id);
  }

  async getFacilities(): Promise<Facility[]> {
    return Array.from(this.facilities.values());
  }

  async getFacility(id: string): Promise<Facility | undefined> {
    return this.facilities.get(id);
  }

  async createFacility(data: InsertFacility): Promise<Facility> {
    const id = randomUUID();
    const facility: Facility = { id, ...data };
    this.facilities.set(id, facility);

    const steps = await this.getInstallationSteps();
    for (const step of steps) {
      const inst: FacilityInstallation = {
        id: randomUUID(),
        facilityId: id,
        stepId: step.id,
        completed: false,
        completedDate: null,
        notes: null,
      };
      this.facilityInstallations.set(inst.id, inst);
    }

    return facility;
  }

  async updateFacility(id: string, data: Partial<InsertFacility>): Promise<Facility | undefined> {
    const existing = this.facilities.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.facilities.set(id, updated);
    return updated;
  }

  async deleteFacility(id: string): Promise<boolean> {
    Array.from(this.facilityVisits.entries())
      .filter(([_, v]) => v.facilityId === id)
      .forEach(([key]) => this.facilityVisits.delete(key));
    Array.from(this.facilityDevices.entries())
      .filter(([_, v]) => v.facilityId === id)
      .forEach(([key]) => this.facilityDevices.delete(key));
    Array.from(this.facilityInstallations.entries())
      .filter(([_, v]) => v.facilityId === id)
      .forEach(([key]) => this.facilityInstallations.delete(key));
    Array.from(this.facilityMaintenances.entries())
      .filter(([_, v]) => v.facilityId === id)
      .forEach(([key]) => this.facilityMaintenances.delete(key));
    return this.facilities.delete(id);
  }

  async getFacilityVisits(facilityId: string): Promise<FacilityVisit[]> {
    return Array.from(this.facilityVisits.values())
      .filter((v) => v.facilityId === facilityId)
      .sort((a, b) => b.visitDate.localeCompare(a.visitDate));
  }

  async createFacilityVisit(data: InsertFacilityVisit): Promise<FacilityVisit> {
    const id = randomUUID();
    const visit: FacilityVisit = { id, ...data };
    this.facilityVisits.set(id, visit);
    return visit;
  }

  async getFacilityVisitActivities(visitId: string): Promise<FacilityVisitActivity[]> {
    return Array.from(this.facilityVisitActivities.values()).filter((a) => a.visitId === visitId);
  }

  async createFacilityVisitActivity(data: InsertFacilityVisitActivity): Promise<FacilityVisitActivity> {
    const id = randomUUID();
    const item: FacilityVisitActivity = { id, ...data };
    this.facilityVisitActivities.set(id, item);
    return item;
  }

  async deleteFacilityVisitActivities(visitId: string): Promise<boolean> {
    Array.from(this.facilityVisitActivities.entries())
      .filter(([_, v]) => v.visitId === visitId)
      .forEach(([key]) => this.facilityVisitActivities.delete(key));
    return true;
  }

  async getFacilityDevices(facilityId: string): Promise<FacilityDevice[]> {
    return Array.from(this.facilityDevices.values()).filter((d) => d.facilityId === facilityId);
  }

  async createFacilityDevice(data: InsertFacilityDevice): Promise<FacilityDevice> {
    const id = randomUUID();
    const device: FacilityDevice = { id, ...data };
    this.facilityDevices.set(id, device);
    return device;
  }

  async updateFacilityDevice(id: string, data: Partial<InsertFacilityDevice>): Promise<FacilityDevice | undefined> {
    const existing = this.facilityDevices.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.facilityDevices.set(id, updated);
    return updated;
  }

  async getFacilityInstallations(facilityId: string): Promise<FacilityInstallation[]> {
    const steps = await this.getInstallationSteps();
    const installations = Array.from(this.facilityInstallations.values()).filter(
      (i) => i.facilityId === facilityId
    );
    return installations.sort((a, b) => {
      const stepA = steps.find((s) => s.id === a.stepId);
      const stepB = steps.find((s) => s.id === b.stepId);
      return (stepA?.order || 0) - (stepB?.order || 0);
    });
  }

  async createFacilityInstallation(data: InsertFacilityInstallation): Promise<FacilityInstallation> {
    const id = randomUUID();
    const inst: FacilityInstallation = { id, ...data };
    this.facilityInstallations.set(id, inst);
    return inst;
  }

  async updateFacilityInstallation(
    id: string,
    data: Partial<InsertFacilityInstallation>
  ): Promise<FacilityInstallation | undefined> {
    const existing = this.facilityInstallations.get(id);
    if (!existing) return undefined;
    const updated = {
      ...existing,
      ...data,
      completedDate: data.completed ? new Date().toISOString().split("T")[0] : null,
    };
    this.facilityInstallations.set(id, updated);
    return updated;
  }

  async getFacilityMaintenances(facilityId: string): Promise<FacilityMaintenance[]> {
    return Array.from(this.facilityMaintenances.values())
      .filter((m) => m.facilityId === facilityId)
      .sort((a, b) => (b.scheduledDate || "").localeCompare(a.scheduledDate || ""));
  }

  async createFacilityMaintenance(data: InsertFacilityMaintenance): Promise<FacilityMaintenance> {
    const id = randomUUID();
    const maint: FacilityMaintenance = { id, ...data };
    this.facilityMaintenances.set(id, maint);
    return maint;
  }

  async updateFacilityMaintenance(
    id: string,
    data: Partial<InsertFacilityMaintenance>
  ): Promise<FacilityMaintenance | undefined> {
    const existing = this.facilityMaintenances.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.facilityMaintenances.set(id, updated);
    return updated;
  }

  async getFacilityServerData(facilityId: string): Promise<FacilityServerData | undefined> {
    return Array.from(this.facilityServerData.values()).find(s => s.facilityId === facilityId);
  }

  async upsertFacilityServerData(data: InsertFacilityServerData): Promise<FacilityServerData> {
    const existing = await this.getFacilityServerData(data.facilityId);
    if (existing) {
      const updated = { ...existing, ...data };
      this.facilityServerData.set(existing.id, updated);
      return updated;
    }
    const id = randomUUID();
    const serverData: FacilityServerData = { id, ...data };
    this.facilityServerData.set(id, serverData);
    return serverData;
  }

  async getFacilityServerUsers(facilityId: string): Promise<FacilityServerUser[]> {
    return Array.from(this.facilityServerUsers.values()).filter(u => u.facilityId === facilityId);
  }

  async createFacilityServerUser(data: InsertFacilityServerUser): Promise<FacilityServerUser> {
    const id = randomUUID();
    const user: FacilityServerUser = { id, ...data };
    this.facilityServerUsers.set(id, user);
    return user;
  }

  async updateFacilityServerUser(id: string, data: Partial<InsertFacilityServerUser>): Promise<FacilityServerUser | undefined> {
    const existing = this.facilityServerUsers.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.facilityServerUsers.set(id, updated);
    return updated;
  }

  async deleteFacilityServerUser(id: string): Promise<boolean> {
    return this.facilityServerUsers.delete(id);
  }

  async getFacilityImages(facilityId: string, entityType?: string, entityId?: string): Promise<FacilityImage[]> {
    let images = Array.from(this.facilityImages.values()).filter((img) => img.facilityId === facilityId);
    if (entityType) {
      images = images.filter((img) => img.entityType === entityType);
    }
    if (entityId) {
      images = images.filter((img) => img.entityId === entityId);
    }
    return images.sort((a, b) => (b.uploadedAt || "").localeCompare(a.uploadedAt || ""));
  }

  async createFacilityImage(data: InsertFacilityImage): Promise<FacilityImage> {
    const id = randomUUID();
    const image: FacilityImage = { 
      id, 
      ...data,
      uploadedAt: new Date().toISOString(),
    };
    this.facilityImages.set(id, image);
    return image;
  }

  async deleteFacilityImage(id: string): Promise<boolean> {
    return this.facilityImages.delete(id);
  }

  async getSettings(): Promise<Settings | undefined> {
    return this.settings;
  }

  async updateSettings(data: Partial<InsertSettings>): Promise<Settings> {
    if (!this.settings) {
      this.settings = {
        id: randomUUID(),
        companyNameAr: data.companyNameAr || null,
        companyNameEn: data.companyNameEn || null,
        logoUrl: data.logoUrl || null,
        defaultLanguage: data.defaultLanguage || "ar",
      };
    } else {
      this.settings = { ...this.settings, ...data };
    }
    return this.settings;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const facilities = await this.getFacilities();
    const maintenances = Array.from(this.facilityMaintenances.values());
    const devices = Array.from(this.facilityDevices.values());

    const totalCost = devices.reduce((sum, d) => sum + (d.quantity || 0) * (d.unitPrice || 0), 0);
    const pendingMaintenance = maintenances.filter((m) => !m.completedDate).length;

    const phaseCount: Record<string, number> = {};
    const statusCount: Record<string, number> = {};

    facilities.forEach((f) => {
      phaseCount[f.currentPhase] = (phaseCount[f.currentPhase] || 0) + 1;
      statusCount[f.status] = (statusCount[f.status] || 0) + 1;
    });

    const phaseDistribution = Object.entries(phaseCount).map(([phase, count]) => ({ phase, count }));
    const statusDistribution = Object.entries(statusCount).map(([status, count]) => ({ status, count }));

    const recentActivities = facilities.slice(0, 5).map((f) => ({
      id: f.id,
      facility: f.nameEn,
      action: `Phase: ${f.currentPhase}`,
      date: f.createdAt || "",
    }));

    return {
      totalFacilities: facilities.length,
      activeFacilities: facilities.filter((f) => f.status === "active").length,
      completedFacilities: facilities.filter((f) => f.status === "completed").length,
      totalCost,
      pendingMaintenance,
      phaseDistribution,
      statusDistribution,
      recentActivities,
    };
  }
}

export const storage = new MemStorage();
