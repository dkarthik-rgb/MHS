import fs from "fs";
import path from "path";
import type { File as StorageFile } from "@google-cloud/storage";
import { getStorageBucketOrThrow } from "./firebase";

const STORAGE_POINTER_PREFIX = "storage://";

export type UploadToStorageOptions = {
  localPath: string;
  destinationFolder: string;
  filename?: string;
  contentType?: string | null;
  metadata?: Record<string, string>;
};

export type UploadResult = {
  storagePath: string;
  pointer: string;
  publicUrl: string;
};

export function isStoragePointer(value?: string | null): value is string {
  return typeof value === "string" && value.startsWith(STORAGE_POINTER_PREFIX);
}

export function stripStoragePointer(pointer: string): string {
  return pointer.replace(STORAGE_POINTER_PREFIX, "");
}

export function buildStoragePointer(storagePath: string): string {
  return `${STORAGE_POINTER_PREFIX}${storagePath}`;
}

export function buildPublicStorageUrl(bucketName: string, storagePath: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
    storagePath,
  )}?alt=media`;
}

export async function uploadLocalFileToFirebaseStorage(
  options: UploadToStorageOptions,
): Promise<UploadResult> {
  const bucket = getStorageBucketOrThrow();
  const fileName = options.filename ?? path.basename(options.localPath);
  const storagePath = path.posix.join(options.destinationFolder, fileName);
  await bucket.upload(options.localPath, {
    destination: storagePath,
    metadata: {
      contentType: options.contentType ?? undefined,
      cacheControl: "public,max-age=86400",
      metadata: options.metadata,
    },
  });
  const pointer = buildStoragePointer(storagePath);
  return {
    storagePath,
    pointer,
    publicUrl: buildPublicStorageUrl(bucket.name, storagePath),
  };
}

export function deleteStoredAsset(filePath?: string | null) {
  if (!filePath) return;
  if (isStoragePointer(filePath)) {
    const bucket = getStorageBucketOrThrow();
    const storagePath = stripStoragePointer(filePath);
    bucket
      .file(storagePath)
      .delete({ ignoreNotFound: true })
      .catch(() => {});
    return;
  }
  fs.promises.unlink(filePath).catch(() => {});
}

export function getStorageFileHandle(filePath?: string | null): StorageFile | null {
  if (!filePath || !isStoragePointer(filePath)) return null;
  const bucket = getStorageBucketOrThrow();
  const storagePath = stripStoragePointer(filePath);
  return bucket.file(storagePath);
}
