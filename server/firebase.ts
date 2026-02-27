import fs from "fs";
import admin from "firebase-admin";
import "firebase-admin/storage";
import type { Bucket } from "@google-cloud/storage";

let firebaseApp: admin.app.App | null = null;
let initAttempted = false;
let realtimeDb: admin.database.Database | null = null;
let storageBucket: Bucket | null = null;

function initializeFirebaseApp(): admin.app.App | null {
  if (firebaseApp || initAttempted) {
    return firebaseApp;
  }
  initAttempted = true;

  const credentialsPath = process.env.FIREBASE_CREDENTIALS_PATH;
  const databaseURL = process.env.FIREBASE_DATABASE_URL;
  if (!credentialsPath || !databaseURL) {
    console.error(
      "[firebase] Missing configuration. Set FIREBASE_CREDENTIALS_PATH and FIREBASE_DATABASE_URL in your .env file.",
    );
    return null;
  }

  try {
    const rawCredentials = fs.readFileSync(credentialsPath, "utf-8");
    const serviceAccount = JSON.parse(rawCredentials);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    console.log("[firebase] Connected to Firebase Realtime Database.");
  } catch (error) {
    firebaseApp = null;
    console.error("[firebase] Failed to initialize Firebase Admin SDK.", error);
  }

  return firebaseApp;
}

export function getFirebaseAppInstance(): admin.app.App | null {
  return initializeFirebaseApp();
}

function getRealtimeDb(): admin.database.Database | null {
  if (realtimeDb) return realtimeDb;
  const app = initializeFirebaseApp();
  if (!app) return null;
  realtimeDb = app.database();
  return realtimeDb;
}

function getStorageBucket(): Bucket | null {
  if (storageBucket) return storageBucket;
  const app = initializeFirebaseApp();
  if (!app) return null;
  storageBucket = admin.storage().bucket();
  return storageBucket;
}

export function getRealtimeDbOrThrow(): admin.database.Database {
  const db = getRealtimeDb();
  if (!db) {
    throw new Error(
      "Firebase is not configured. Please set FIREBASE_CREDENTIALS_PATH and FIREBASE_DATABASE_URL before starting the server.",
    );
  }
  return db;
}

export function getStorageBucketOrThrow(): Bucket {
  const bucket = getStorageBucket();
  if (!bucket) {
    throw new Error(
      "Firebase Storage is not configured. Please set FIREBASE_CREDENTIALS_PATH, FIREBASE_DATABASE_URL, and FIREBASE_STORAGE_BUCKET before starting the server.",
    );
  }
  return bucket;
}

export function generateNumericId(): number {
  return Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
}

export type FirebaseRecord<T> = T & { id: number };

export async function readCollection<T>(path: string): Promise<FirebaseRecord<T>[]> {
  const db = getRealtimeDbOrThrow();
  const snapshot = await db.ref(path).once("value");
  const data = snapshot.val() || {};
  return Object.entries(data).map(([key, value]) => ({
    id: Number(key),
    ...(value as T),
  }));
}

export async function readRecord<T>(path: string, id: number): Promise<FirebaseRecord<T> | undefined> {
  const db = getRealtimeDbOrThrow();
  const snapshot = await db.ref(`${path}/${id}`).once("value");
  if (!snapshot.exists()) return undefined;
  return { id, ...(snapshot.val() as T) };
}

export async function writeRecord<T>(path: string, record: FirebaseRecord<T>): Promise<void> {
  const db = getRealtimeDbOrThrow();
  await db.ref(`${path}/${record.id}`).set(record);
}

export async function patchRecord<T>(path: string, id: number, updates: Partial<T>): Promise<void> {
  const db = getRealtimeDbOrThrow();
  await db.ref(`${path}/${id}`).update(updates as Record<string, unknown>);
}

export async function deleteRecord(path: string, id: number): Promise<void> {
  const db = getRealtimeDbOrThrow();
  await db.ref(`${path}/${id}`).remove();
}
