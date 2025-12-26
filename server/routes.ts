import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, hashPassword } from "./auth";
import { z } from "zod";
import {
  insertFacilityTypeSchema,
  insertConnectionProtocolSchema,
  insertPurchaseLocationSchema,
  insertDeviceBrandSchema,
  insertDeviceTypeSchema,
  insertVisitQuestionSchema,
  insertInstallationStepSchema,
  insertMaintenanceTypeSchema,
  insertVisitActivitySchema,
  insertInventoryItemSchema,
  insertFacilitySchema,
  insertFacilityVisitSchema,
  insertFacilityVisitActivitySchema,
  insertFacilityDeviceSchema,
  insertFacilityInstallationSchema,
  insertFacilityMaintenanceSchema,
  insertFacilityServerDataSchema,
  insertFacilityServerUserSchema,
  insertFacilityImageSchema,
  insertUserSchema,
} from "@shared/schema";

function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(body);
  if (!result.success) {
    return { success: false, error: result.error.errors.map(e => e.message).join(", ") };
  }
  return { success: true, data: result.data };
}

function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

function requireAdmin(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ error: "Failed to get users" });
    }
  });

  app.post("/api/users", requireAdmin, async (req, res) => {
    try {
      const validation = validateBody(insertUserSchema, req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      
      const existingUser = await storage.getUserByUsername(validation.data.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const user = await storage.createUser({
        ...validation.data,
        password: await hashPassword(validation.data.password),
      });
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.patch("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      const updateData = { ...req.body };
      if (updateData.password) {
        updateData.password = await hashPassword(updateData.password);
      }
      const user = await storage.updateUser(req.params.id, updateData);
      if (!user) return res.status(404).json({ error: "User not found" });
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to get dashboard stats" });
    }
  });

  app.get("/api/facility-types", async (req, res) => {
    try {
      const types = await storage.getFacilityTypes();
      res.json(types);
    } catch (error) {
      res.status(500).json({ error: "Failed to get facility types" });
    }
  });

  app.post("/api/facility-types", async (req, res) => {
    try {
      const validation = validateBody(insertFacilityTypeSchema, req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const type = await storage.createFacilityType(validation.data);
      res.status(201).json(type);
    } catch (error) {
      res.status(500).json({ error: "Failed to create facility type" });
    }
  });

  app.patch("/api/facility-types/:id", async (req, res) => {
    try {
      const validation = validateBody(insertFacilityTypeSchema.partial(), req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const type = await storage.updateFacilityType(req.params.id, validation.data);
      if (!type) return res.status(404).json({ error: "Not found" });
      res.json(type);
    } catch (error) {
      res.status(500).json({ error: "Failed to update facility type" });
    }
  });

  app.delete("/api/facility-types/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteFacilityType(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete facility type" });
    }
  });

  // Connection Protocols
  app.get("/api/connection-protocols", async (req, res) => {
    try {
      const protocols = await storage.getConnectionProtocols();
      res.json(protocols);
    } catch (error) {
      res.status(500).json({ error: "Failed to get connection protocols" });
    }
  });

  app.post("/api/connection-protocols", async (req, res) => {
    try {
      const validation = validateBody(insertConnectionProtocolSchema, req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const protocol = await storage.createConnectionProtocol(validation.data);
      res.status(201).json(protocol);
    } catch (error) {
      res.status(500).json({ error: "Failed to create connection protocol" });
    }
  });

  app.patch("/api/connection-protocols/:id", async (req, res) => {
    try {
      const validation = validateBody(insertConnectionProtocolSchema.partial(), req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const protocol = await storage.updateConnectionProtocol(req.params.id, validation.data);
      if (!protocol) return res.status(404).json({ error: "Not found" });
      res.json(protocol);
    } catch (error) {
      res.status(500).json({ error: "Failed to update connection protocol" });
    }
  });

  app.delete("/api/connection-protocols/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteConnectionProtocol(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete connection protocol" });
    }
  });

  // Purchase Locations
  app.get("/api/purchase-locations", async (req, res) => {
    try {
      const locations = await storage.getPurchaseLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: "Failed to get purchase locations" });
    }
  });

  app.post("/api/purchase-locations", async (req, res) => {
    try {
      const validation = validateBody(insertPurchaseLocationSchema, req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const location = await storage.createPurchaseLocation(validation.data);
      res.status(201).json(location);
    } catch (error) {
      res.status(500).json({ error: "Failed to create purchase location" });
    }
  });

  app.patch("/api/purchase-locations/:id", async (req, res) => {
    try {
      const validation = validateBody(insertPurchaseLocationSchema.partial(), req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const location = await storage.updatePurchaseLocation(req.params.id, validation.data);
      if (!location) return res.status(404).json({ error: "Not found" });
      res.json(location);
    } catch (error) {
      res.status(500).json({ error: "Failed to update purchase location" });
    }
  });

  app.delete("/api/purchase-locations/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePurchaseLocation(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete purchase location" });
    }
  });

  // Device Brands
  app.get("/api/device-brands", async (req, res) => {
    try {
      const brands = await storage.getDeviceBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: "Failed to get device brands" });
    }
  });

  app.post("/api/device-brands", async (req, res) => {
    try {
      const validation = validateBody(insertDeviceBrandSchema, req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const brand = await storage.createDeviceBrand(validation.data);
      res.status(201).json(brand);
    } catch (error) {
      res.status(500).json({ error: "Failed to create device brand" });
    }
  });

  app.patch("/api/device-brands/:id", async (req, res) => {
    try {
      const validation = validateBody(insertDeviceBrandSchema.partial(), req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const brand = await storage.updateDeviceBrand(req.params.id, validation.data);
      if (!brand) return res.status(404).json({ error: "Not found" });
      res.json(brand);
    } catch (error) {
      res.status(500).json({ error: "Failed to update device brand" });
    }
  });

  app.delete("/api/device-brands/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDeviceBrand(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete device brand" });
    }
  });

  app.get("/api/device-types", async (req, res) => {
    try {
      const types = await storage.getDeviceTypes();
      res.json(types);
    } catch (error) {
      res.status(500).json({ error: "Failed to get device types" });
    }
  });

  app.post("/api/device-types", async (req, res) => {
    try {
      const validation = validateBody(insertDeviceTypeSchema, req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const type = await storage.createDeviceType(validation.data);
      res.status(201).json(type);
    } catch (error) {
      res.status(500).json({ error: "Failed to create device type" });
    }
  });

  app.patch("/api/device-types/:id", async (req, res) => {
    try {
      const validation = validateBody(insertDeviceTypeSchema.partial(), req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const type = await storage.updateDeviceType(req.params.id, validation.data);
      if (!type) return res.status(404).json({ error: "Not found" });
      res.json(type);
    } catch (error) {
      res.status(500).json({ error: "Failed to update device type" });
    }
  });

  app.delete("/api/device-types/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDeviceType(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete device type" });
    }
  });

  app.get("/api/visit-questions", async (req, res) => {
    try {
      const questions = await storage.getVisitQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to get visit questions" });
    }
  });

  app.post("/api/visit-questions", async (req, res) => {
    try {
      const validation = validateBody(insertVisitQuestionSchema, req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const question = await storage.createVisitQuestion(validation.data);
      res.status(201).json(question);
    } catch (error) {
      res.status(500).json({ error: "Failed to create visit question" });
    }
  });

  app.patch("/api/visit-questions/:id", async (req, res) => {
    try {
      const validation = validateBody(insertVisitQuestionSchema.partial(), req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const question = await storage.updateVisitQuestion(req.params.id, validation.data);
      if (!question) return res.status(404).json({ error: "Not found" });
      res.json(question);
    } catch (error) {
      res.status(500).json({ error: "Failed to update visit question" });
    }
  });

  app.delete("/api/visit-questions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteVisitQuestion(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete visit question" });
    }
  });

  app.get("/api/installation-steps", async (req, res) => {
    try {
      const steps = await storage.getInstallationSteps();
      res.json(steps);
    } catch (error) {
      res.status(500).json({ error: "Failed to get installation steps" });
    }
  });

  app.post("/api/installation-steps", async (req, res) => {
    try {
      const validation = validateBody(insertInstallationStepSchema, req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const step = await storage.createInstallationStep(validation.data);
      res.status(201).json(step);
    } catch (error) {
      res.status(500).json({ error: "Failed to create installation step" });
    }
  });

  app.patch("/api/installation-steps/:id", async (req, res) => {
    try {
      const validation = validateBody(insertInstallationStepSchema.partial(), req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const step = await storage.updateInstallationStep(req.params.id, validation.data);
      if (!step) return res.status(404).json({ error: "Not found" });
      res.json(step);
    } catch (error) {
      res.status(500).json({ error: "Failed to update installation step" });
    }
  });

  app.delete("/api/installation-steps/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteInstallationStep(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete installation step" });
    }
  });

  app.get("/api/maintenance-types", async (req, res) => {
    try {
      const types = await storage.getMaintenanceTypes();
      res.json(types);
    } catch (error) {
      res.status(500).json({ error: "Failed to get maintenance types" });
    }
  });

  app.post("/api/maintenance-types", async (req, res) => {
    try {
      const validation = validateBody(insertMaintenanceTypeSchema, req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const type = await storage.createMaintenanceType(validation.data);
      res.status(201).json(type);
    } catch (error) {
      res.status(500).json({ error: "Failed to create maintenance type" });
    }
  });

  app.patch("/api/maintenance-types/:id", async (req, res) => {
    try {
      const validation = validateBody(insertMaintenanceTypeSchema.partial(), req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const type = await storage.updateMaintenanceType(req.params.id, validation.data);
      if (!type) return res.status(404).json({ error: "Not found" });
      res.json(type);
    } catch (error) {
      res.status(500).json({ error: "Failed to update maintenance type" });
    }
  });

  app.delete("/api/maintenance-types/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMaintenanceType(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete maintenance type" });
    }
  });

  app.get("/api/visit-activities", async (req, res) => {
    try {
      const activities = await storage.getVisitActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to get visit activities" });
    }
  });

  app.post("/api/visit-activities", async (req, res) => {
    try {
      const validation = validateBody(insertVisitActivitySchema, req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const activity = await storage.createVisitActivity(validation.data);
      res.status(201).json(activity);
    } catch (error) {
      res.status(500).json({ error: "Failed to create visit activity" });
    }
  });

  app.patch("/api/visit-activities/:id", async (req, res) => {
    try {
      const validation = validateBody(insertVisitActivitySchema.partial(), req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const activity = await storage.updateVisitActivity(req.params.id, validation.data);
      if (!activity) return res.status(404).json({ error: "Not found" });
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Failed to update visit activity" });
    }
  });

  app.delete("/api/visit-activities/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteVisitActivity(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete visit activity" });
    }
  });

  app.get("/api/inventory", async (req, res) => {
    try {
      const inventory = await storage.getInventory();
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: "Failed to get inventory" });
    }
  });

  app.post("/api/inventory", async (req, res) => {
    try {
      const validation = validateBody(insertInventoryItemSchema, req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const item = await storage.createInventoryItem(validation.data);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to create inventory item" });
    }
  });

  app.patch("/api/inventory/:id", async (req, res) => {
    try {
      const validation = validateBody(insertInventoryItemSchema.partial(), req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const item = await storage.updateInventoryItem(req.params.id, validation.data);
      if (!item) return res.status(404).json({ error: "Not found" });
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to update inventory item" });
    }
  });

  app.delete("/api/inventory/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteInventoryItem(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete inventory item" });
    }
  });

  app.get("/api/facilities", async (req, res) => {
    try {
      const facilities = await storage.getFacilities();
      res.json(facilities);
    } catch (error) {
      res.status(500).json({ error: "Failed to get facilities" });
    }
  });

  app.get("/api/facilities/:id", async (req, res) => {
    try {
      const facility = await storage.getFacility(req.params.id);
      if (!facility) return res.status(404).json({ error: "Facility not found" });
      res.json(facility);
    } catch (error) {
      res.status(500).json({ error: "Failed to get facility" });
    }
  });

  app.post("/api/facilities", async (req, res) => {
    try {
      const validation = validateBody(insertFacilitySchema, req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const facility = await storage.createFacility(validation.data);
      res.status(201).json(facility);
    } catch (error) {
      res.status(500).json({ error: "Failed to create facility" });
    }
  });

  app.patch("/api/facilities/:id", async (req, res) => {
    try {
      const validation = validateBody(insertFacilitySchema.partial(), req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const updateData = {
        ...validation.data,
        lastModifiedAt: new Date().toISOString(),
        lastModifiedBy: req.user?.id || null,
      };
      const facility = await storage.updateFacility(req.params.id, updateData);
      if (!facility) return res.status(404).json({ error: "Facility not found" });
      res.json(facility);
    } catch (error) {
      res.status(500).json({ error: "Failed to update facility" });
    }
  });

  app.delete("/api/facilities/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteFacility(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Facility not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete facility" });
    }
  });

  app.get("/api/facilities/:id/visits", async (req, res) => {
    try {
      const visits = await storage.getFacilityVisits(req.params.id);
      res.json(visits);
    } catch (error) {
      res.status(500).json({ error: "Failed to get facility visits" });
    }
  });

  app.post("/api/facilities/:id/visits", async (req, res) => {
    try {
      const { activityIds, ...visitData } = req.body;
      const bodyWithFacilityId = { ...visitData, facilityId: req.params.id };
      const validation = validateBody(insertFacilityVisitSchema, bodyWithFacilityId);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const visit = await storage.createFacilityVisit(validation.data);
      
      if (activityIds && Array.isArray(activityIds)) {
        for (const activityId of activityIds) {
          await storage.createFacilityVisitActivity({
            visitId: visit.id,
            activityId,
          });
        }
      }
      
      res.status(201).json(visit);
    } catch (error) {
      res.status(500).json({ error: "Failed to create facility visit" });
    }
  });

  app.get("/api/visits/:visitId/activities", async (req, res) => {
    try {
      const activities = await storage.getFacilityVisitActivities(req.params.visitId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to get visit activities" });
    }
  });

  app.get("/api/facilities/:id/images", async (req, res) => {
    try {
      const { entityType, entityId } = req.query;
      const images = await storage.getFacilityImages(
        req.params.id,
        entityType as string | undefined,
        entityId as string | undefined
      );
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to get facility images" });
    }
  });

  app.post("/api/facilities/:id/images", async (req, res) => {
    try {
      const bodyWithFacilityId = {
        ...req.body,
        facilityId: req.params.id,
      };
      // Ensure uploadedAt is set if not provided by client
      if (!bodyWithFacilityId.uploadedAt) {
        bodyWithFacilityId.uploadedAt = new Date().toISOString();
      }
      
      const validation = validateBody(insertFacilityImageSchema, bodyWithFacilityId);
      if (!validation.success) {
        console.error("Image validation failed:", validation.error);
        return res.status(400).json({ error: validation.error });
      }
      const image = await storage.createFacilityImage(validation.data);
      res.status(201).json(image);
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  app.delete("/api/facilities/:id/images/:imageId", async (req, res) => {
    try {
      const deleted = await storage.deleteFacilityImage(req.params.imageId);
      if (!deleted) return res.status(404).json({ error: "Image not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete image" });
    }
  });

  app.get("/api/facilities/:id/devices", async (req, res) => {
    try {
      const devices = await storage.getFacilityDevices(req.params.id);
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: "Failed to get facility devices" });
    }
  });

  app.post("/api/facilities/:id/devices", async (req, res) => {
    try {
      const bodyWithFacilityId = { ...req.body, facilityId: req.params.id };
      const validation = validateBody(insertFacilityDeviceSchema, bodyWithFacilityId);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const device = await storage.createFacilityDevice(validation.data);
      res.status(201).json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to create facility device" });
    }
  });

  app.get("/api/facilities/:id/installations", async (req, res) => {
    try {
      const installations = await storage.getFacilityInstallations(req.params.id);
      res.json(installations);
    } catch (error) {
      res.status(500).json({ error: "Failed to get facility installations" });
    }
  });

  app.patch("/api/facilities/:facilityId/installations/:installationId", async (req, res) => {
    try {
      const validation = validateBody(insertFacilityInstallationSchema.partial(), req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const installation = await storage.updateFacilityInstallation(req.params.installationId, validation.data);
      if (!installation) return res.status(404).json({ error: "Installation not found" });
      res.json(installation);
    } catch (error) {
      res.status(500).json({ error: "Failed to update installation" });
    }
  });

  app.get("/api/facilities/:id/maintenances", async (req, res) => {
    try {
      const maintenances = await storage.getFacilityMaintenances(req.params.id);
      res.json(maintenances);
    } catch (error) {
      res.status(500).json({ error: "Failed to get facility maintenances" });
    }
  });

  app.post("/api/facilities/:id/maintenances", async (req, res) => {
    try {
      const bodyWithFacilityId = { ...req.body, facilityId: req.params.id };
      const validation = validateBody(insertFacilityMaintenanceSchema, bodyWithFacilityId);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const maintenance = await storage.createFacilityMaintenance(validation.data);
      res.status(201).json(maintenance);
    } catch (error) {
      res.status(500).json({ error: "Failed to create facility maintenance" });
    }
  });

  // Server Data Routes
  app.get("/api/facilities/:id/server-data", async (req, res) => {
    try {
      const serverData = await storage.getFacilityServerData(req.params.id);
      res.json(serverData || {});
    } catch (error) {
      res.status(500).json({ error: "Failed to get server data" });
    }
  });

  app.put("/api/facilities/:id/server-data", async (req, res) => {
    try {
      const bodyWithFacilityId = { ...req.body, facilityId: req.params.id };
      const validation = validateBody(insertFacilityServerDataSchema, bodyWithFacilityId);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const serverData = await storage.upsertFacilityServerData(validation.data);
      res.json(serverData);
    } catch (error) {
      res.status(500).json({ error: "Failed to save server data" });
    }
  });

  app.get("/api/facilities/:id/server-users", async (req, res) => {
    try {
      const users = await storage.getFacilityServerUsers(req.params.id);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to get server users" });
    }
  });

  app.post("/api/facilities/:id/server-users", async (req, res) => {
    try {
      const bodyWithFacilityId = { ...req.body, facilityId: req.params.id };
      const validation = validateBody(insertFacilityServerUserSchema, bodyWithFacilityId);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const user = await storage.createFacilityServerUser(validation.data);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to create server user" });
    }
  });

  app.patch("/api/facilities/:facilityId/server-users/:userId", async (req, res) => {
    try {
      const validation = validateBody(insertFacilityServerUserSchema.partial(), req.body);
      if (!validation.success) return res.status(400).json({ error: validation.error });
      const user = await storage.updateFacilityServerUser(req.params.userId, validation.data);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update server user" });
    }
  });

  app.delete("/api/facilities/:facilityId/server-users/:userId", async (req, res) => {
    try {
      const deleted = await storage.deleteFacilityServerUser(req.params.userId);
      if (!deleted) return res.status(404).json({ error: "User not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete server user" });
    }
  });

  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings || {});
    } catch (error) {
      res.status(500).json({ error: "Failed to get settings" });
    }
  });

  app.patch("/api/settings", async (req, res) => {
    try {
      const { companyName, language, theme } = req.body;
      const settings = await storage.updateSettings({
        companyNameAr: language === "ar" ? companyName : undefined,
        companyNameEn: language === "en" ? companyName : undefined,
        defaultLanguage: language,
      });
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  return httpServer;
}
