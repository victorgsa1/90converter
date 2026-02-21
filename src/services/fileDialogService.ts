import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import type { QueueItem } from "../types/image";
import { getFileExt, getFileNameFromPath } from "../utils/image";
import { debugError, debugLog } from "../utils/debug";

const SUPPORTED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "avif"]);

function normalizeSizeBytes(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return Math.trunc(value);
  }

  if (typeof value === "bigint") {
    if (value < 0n) return null;
    const asNumber = Number(value);
    return Number.isFinite(asNumber) ? Math.trunc(asNumber) : null;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? Math.trunc(parsed) : null;
  }

  return null;
}

async function createQueueItemFromPath(path: string): Promise<QueueItem> {
  const name = getFileNameFromPath(path);
  let sizeBytes: number | null = null;

  try {
    const rawSize = await invoke<unknown>("get_file_size_bytes", { path });
    sizeBytes = normalizeSizeBytes(rawSize);
  } catch (error) {
    debugError("fileDialog", "Failed to get file size", { path, error: String(error) });
    sizeBytes = null;
  }

  return {
    id: path,
    path,
    name,
    format: getFileExt(name),
    sizeBytes,
  };
}

function isSupportedPath(path: string): boolean {
  const name = getFileNameFromPath(path);
  const ext = getFileExt(name);
  return SUPPORTED_EXTENSIONS.has(ext);
}

export async function mapPathsToQueueItems(paths: string[]): Promise<QueueItem[]> {
  if (!Array.isArray(paths)) return [];
  const safePaths = paths.filter((path): path is string => typeof path === "string");
  const uniquePaths = Array.from(new Set(safePaths));
  const supportedPaths = uniquePaths.filter(isSupportedPath);
  return Promise.all(supportedPaths.map(createQueueItemFromPath));
}

export function mergeQueueItems(
  current: QueueItem[],
  incoming: QueueItem[],
): QueueItem[] {
  const map = new Map<string, QueueItem>();
  current.forEach((item) => map.set(item.id, item));
  incoming.forEach((item) => map.set(item.id, item));
  return Array.from(map.values());
}

export async function pickImageFiles(): Promise<QueueItem[]> {
  debugLog("fileDialog", "Opening file picker");
  const selected = await open({
    multiple: true,
    filters: [
      { name: "Imagens", extensions: ["jpg", "jpeg", "png", "webp", "avif"] },
    ],
  });

  if (!selected) return [];

  const paths = Array.isArray(selected) ? selected : [selected];
  return await mapPathsToQueueItems(paths);
}

export async function pickDestinationFolder(): Promise<string | null> {
  const selected = await open({ directory: true, multiple: false });
  return typeof selected === "string" ? selected : null;
}
