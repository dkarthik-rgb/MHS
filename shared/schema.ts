import { pgTable, text, serial, boolean, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("admin"), 
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default('draft'), 
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const facultyProfiles = pgTable("faculty_profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  department: text("department").notNull(),
  imageUrl: text("image_url"),
  status: text("status").notNull().default('draft'),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  description: text("description"),
  status: text("status").notNull().default('draft'),
});

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  caption: text("caption"),
  category: text("category").notNull().default('general'),
  status: text("status").notNull().default('draft'),
});

export const rankers = pgTable("rankers", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  rank: integer("rank").notNull(),
  year: integer("year").notNull(),
  score: integer("score").notNull(),
  imageUrl: text("image_url"),
  status: text("status").notNull().default('draft'),
});

export const academics = pgTable("academics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // e.g., 'Curriculum', 'Syllabus', 'Rules'
  status: text("status").notNull().default('draft'),
});

export const studentLife = pgTable("student_life", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  status: text("status").notNull().default('draft'),
});

export const results = pgTable("results", {
  id: serial("id").primaryKey(),
  rollNo: text("roll_no").notNull().unique(),
  studentName: text("student_name").notNull(),
  examName: text("exam_name").notNull(),
  year: integer("year").notNull(),
  data: jsonb("data").notNull(), // Stores detailed marks/grades
  status: text("status").notNull().default('published'),
});

export const admissions = pgTable("admissions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  formUrl: text("form_url"),
  status: text("status").notNull().default('draft'),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, createdAt: true, updatedAt: true });
export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

export const insertFacultySchema = createInsertSchema(facultyProfiles).omit({ id: true });
export type Faculty = typeof facultyProfiles.$inferSelect;
export type InsertFaculty = z.infer<typeof insertFacultySchema>;

export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export const insertGallerySchema = createInsertSchema(galleryImages).omit({ id: true });
export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = z.infer<typeof insertGallerySchema>;

export const insertRankerSchema = createInsertSchema(rankers).omit({ id: true });
export type Ranker = typeof rankers.$inferSelect;
export type InsertRanker = z.infer<typeof insertRankerSchema>;

export const insertAcademicSchema = createInsertSchema(academics).omit({ id: true });
export type Academic = typeof academics.$inferSelect;
export type InsertAcademic = z.infer<typeof insertAcademicSchema>;

export const insertStudentLifeSchema = createInsertSchema(studentLife).omit({ id: true });
export type StudentLife = typeof studentLife.$inferSelect;
export type InsertStudentLife = z.infer<typeof insertStudentLifeSchema>;

export const insertResultSchema = createInsertSchema(results).omit({ id: true });
export type Result = typeof results.$inferSelect;
export type InsertResult = z.infer<typeof insertResultSchema>;

export const insertAdmissionSchema = createInsertSchema(admissions).omit({ id: true });
export type Admission = typeof admissions.$inferSelect;
export type InsertAdmission = z.infer<typeof insertAdmissionSchema>;

export type AuthResponse = { message: string, user?: { id: number, email: string, role: string | null } };
