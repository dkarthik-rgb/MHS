import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  users, announcements, facultyProfiles, events, galleryImages, rankers,
  academics, studentLife, results, admissions,
  type User, type InsertUser,
  type Announcement, type InsertAnnouncement,
  type Faculty, type InsertFaculty,
  type Event, type InsertEvent,
  type GalleryImage, type InsertGalleryImage,
  type Ranker, type InsertRanker,
  type Academic, type InsertAcademic,
  type StudentLife, type InsertStudentLife,
  type Result, type InsertResult,
  type Admission, type InsertAdmission
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Announcements
  getAnnouncements(status?: string): Promise<Announcement[]>;
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  createAnnouncement(data: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, data: Partial<InsertAnnouncement>): Promise<Announcement>;
  deleteAnnouncement(id: number): Promise<void>;

  // Faculty
  getFaculty(status?: string): Promise<Faculty[]>;
  getFacultyById(id: number): Promise<Faculty | undefined>;
  createFaculty(data: InsertFaculty): Promise<Faculty>;
  updateFaculty(id: number, data: Partial<InsertFaculty>): Promise<Faculty>;
  deleteFaculty(id: number): Promise<void>;

  // Events
  getEvents(status?: string): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(data: InsertEvent): Promise<Event>;
  updateEvent(id: number, data: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: number): Promise<void>;

  // Gallery
  getGalleryImages(status?: string): Promise<GalleryImage[]>;
  getGalleryImage(id: number): Promise<GalleryImage | undefined>;
  createGalleryImage(data: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: number, data: Partial<InsertGalleryImage>): Promise<GalleryImage>;
  deleteGalleryImage(id: number): Promise<void>;

  // Rankers
  getRankers(status?: string): Promise<Ranker[]>;
  getRanker(id: number): Promise<Ranker | undefined>;
  createRanker(data: InsertRanker): Promise<Ranker>;
  updateRanker(id: number, data: Partial<InsertRanker>): Promise<Ranker>;
  deleteRanker(id: number): Promise<void>;

  // Academics
  getAcademics(status?: string, category?: string): Promise<Academic[]>;
  getAcademic(id: number): Promise<Academic | undefined>;
  createAcademic(data: InsertAcademic): Promise<Academic>;
  updateAcademic(id: number, data: Partial<InsertAcademic>): Promise<Academic>;
  deleteAcademic(id: number): Promise<void>;

  // Student Life
  getStudentLife(status?: string): Promise<StudentLife[]>;
  getStudentLifeById(id: number): Promise<StudentLife | undefined>;
  createStudentLife(data: InsertStudentLife): Promise<StudentLife>;
  updateStudentLife(id: number, data: Partial<InsertStudentLife>): Promise<StudentLife>;
  deleteStudentLife(id: number): Promise<void>;

  // Results
  getResults(rollNo?: string): Promise<Result[]>;
  createResults(data: InsertResult[]): Promise<void>;
  deleteResult(id: number): Promise<void>;

  // Admissions
  getAdmissions(status?: string): Promise<Admission[]>;
  getAdmission(id: number): Promise<Admission | undefined>;
  createAdmission(data: InsertAdmission): Promise<Admission>;
  updateAdmission(id: number, data: Partial<InsertAdmission>): Promise<Admission>;
  deleteAdmission(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  // Announcements
  async getAnnouncements(status?: string): Promise<Announcement[]> {
    if (status) {
      return await db.select().from(announcements).where(eq(announcements.status, status));
    }
    return await db.select().from(announcements);
  }
  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    const [item] = await db.select().from(announcements).where(eq(announcements.id, id));
    return item;
  }
  async createAnnouncement(data: InsertAnnouncement): Promise<Announcement> {
    const [item] = await db.insert(announcements).values(data).returning();
    return item;
  }
  async updateAnnouncement(id: number, data: Partial<InsertAnnouncement>): Promise<Announcement> {
    const [item] = await db.update(announcements).set({ ...data, updatedAt: new Date() }).where(eq(announcements.id, id)).returning();
    return item;
  }
  async deleteAnnouncement(id: number): Promise<void> {
    await db.delete(announcements).where(eq(announcements.id, id));
  }

  // Faculty
  async getFaculty(status?: string): Promise<Faculty[]> {
    if (status) {
      return await db.select().from(facultyProfiles).where(eq(facultyProfiles.status, status));
    }
    return await db.select().from(facultyProfiles);
  }
  async getFacultyById(id: number): Promise<Faculty | undefined> {
    const [item] = await db.select().from(facultyProfiles).where(eq(facultyProfiles.id, id));
    return item;
  }
  async createFaculty(data: InsertFaculty): Promise<Faculty> {
    const [item] = await db.insert(facultyProfiles).values(data).returning();
    return item;
  }
  async updateFaculty(id: number, data: Partial<InsertFaculty>): Promise<Faculty> {
    const [item] = await db.update(facultyProfiles).set(data).where(eq(facultyProfiles.id, id)).returning();
    return item;
  }
  async deleteFaculty(id: number): Promise<void> {
    await db.delete(facultyProfiles).where(eq(facultyProfiles.id, id));
  }

  // Events
  async getEvents(status?: string): Promise<Event[]> {
    if (status) {
      return await db.select().from(events).where(eq(events.status, status));
    }
    return await db.select().from(events);
  }
  async getEvent(id: number): Promise<Event | undefined> {
    const [item] = await db.select().from(events).where(eq(events.id, id));
    return item;
  }
  async createEvent(data: InsertEvent): Promise<Event> {
    const [item] = await db.insert(events).values(data).returning();
    return item;
  }
  async updateEvent(id: number, data: Partial<InsertEvent>): Promise<Event> {
    const [item] = await db.update(events).set(data).where(eq(events.id, id)).returning();
    return item;
  }
  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  // Gallery
  async getGalleryImages(status?: string): Promise<GalleryImage[]> {
    if (status) {
      return await db.select().from(galleryImages).where(eq(galleryImages.status, status));
    }
    return await db.select().from(galleryImages);
  }
  async getGalleryImage(id: number): Promise<GalleryImage | undefined> {
    const [item] = await db.select().from(galleryImages).where(eq(galleryImages.id, id));
    return item;
  }
  async createGalleryImage(data: InsertGalleryImage): Promise<GalleryImage> {
    const [item] = await db.insert(galleryImages).values(data).returning();
    return item;
  }
  async updateGalleryImage(id: number, data: Partial<InsertGalleryImage>): Promise<GalleryImage> {
    const [item] = await db.update(galleryImages).set(data).where(eq(galleryImages.id, id)).returning();
    return item;
  }
  async deleteGalleryImage(id: number): Promise<void> {
    await db.delete(galleryImages).where(eq(galleryImages.id, id));
  }

  // Rankers
  async getRankers(status?: string): Promise<Ranker[]> {
    if (status) {
      return await db.select().from(rankers).where(eq(rankers.status, status));
    }
    return await db.select().from(rankers);
  }
  async getRanker(id: number): Promise<Ranker | undefined> {
    const [item] = await db.select().from(rankers).where(eq(rankers.id, id));
    return item;
  }
  async createRanker(data: InsertRanker): Promise<Ranker> {
    const [item] = await db.insert(rankers).values(data).returning();
    return item;
  }
  async updateRanker(id: number, data: Partial<InsertRanker>): Promise<Ranker> {
    const [item] = await db.update(rankers).set(data).where(eq(rankers.id, id)).returning();
    return item;
  }
  async deleteRanker(id: number): Promise<void> {
    await db.delete(rankers).where(eq(rankers.id, id));
  }

  // Academics
  async getAcademics(status?: string, category?: string): Promise<Academic[]> {
    let query = db.select().from(academics);
    if (status && category) {
      // @ts-ignore
      query = query.where(eq(academics.status, status)).where(eq(academics.category, category));
    } else if (status) {
      // @ts-ignore
      query = query.where(eq(academics.status, status));
    } else if (category) {
      // @ts-ignore
      query = query.where(eq(academics.category, category));
    }
    return await query;
  }
  async getAcademic(id: number): Promise<Academic | undefined> {
    const [item] = await db.select().from(academics).where(eq(academics.id, id));
    return item;
  }
  async createAcademic(data: InsertAcademic): Promise<Academic> {
    const [item] = await db.insert(academics).values(data).returning();
    return item;
  }
  async updateAcademic(id: number, data: Partial<InsertAcademic>): Promise<Academic> {
    const [item] = await db.update(academics).set(data).where(eq(academics.id, id)).returning();
    return item;
  }
  async deleteAcademic(id: number): Promise<void> {
    await db.delete(academics).where(eq(academics.id, id));
  }

  // Student Life
  async getStudentLife(status?: string): Promise<StudentLife[]> {
    if (status) {
      return await db.select().from(studentLife).where(eq(studentLife.status, status));
    }
    return await db.select().from(studentLife);
  }
  async getStudentLifeById(id: number): Promise<StudentLife | undefined> {
    const [item] = await db.select().from(studentLife).where(eq(studentLife.id, id));
    return item;
  }
  async createStudentLife(data: InsertStudentLife): Promise<StudentLife> {
    const [item] = await db.insert(studentLife).values(data).returning();
    return item;
  }
  async updateStudentLife(id: number, data: Partial<InsertStudentLife>): Promise<StudentLife> {
    const [item] = await db.update(studentLife).set(data).where(eq(studentLife.id, id)).returning();
    return item;
  }
  async deleteStudentLife(id: number): Promise<void> {
    await db.delete(studentLife).where(eq(studentLife.id, id));
  }

  // Results
  async getResults(rollNo?: string): Promise<Result[]> {
    if (rollNo) {
      return await db.select().from(results).where(eq(results.rollNo, rollNo));
    }
    return await db.select().from(results);
  }
  async createResults(data: InsertResult[]): Promise<void> {
    await db.insert(results).values(data);
  }
  async deleteResult(id: number): Promise<void> {
    await db.delete(results).where(eq(results.id, id));
  }

  // Admissions
  async getAdmissions(status?: string): Promise<Admission[]> {
    if (status) {
      return await db.select().from(admissions).where(eq(admissions.status, status));
    }
    return await db.select().from(admissions);
  }
  async getAdmission(id: number): Promise<Admission | undefined> {
    const [item] = await db.select().from(admissions).where(eq(admissions.id, id));
    return item;
  }
  async createAdmission(data: InsertAdmission): Promise<Admission> {
    const [item] = await db.insert(admissions).values(data).returning();
    return item;
  }
  async updateAdmission(id: number, data: Partial<InsertAdmission>): Promise<Admission> {
    const [item] = await db.update(admissions).set(data).where(eq(admissions.id, id)).returning();
    return item;
  }
  async deleteAdmission(id: number): Promise<void> {
    await db.delete(admissions).where(eq(admissions.id, id));
  }
}

export const storage = new DatabaseStorage();
