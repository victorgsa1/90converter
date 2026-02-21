export type OutputFormat = "png" | "jpg" | "webp";

export type QueueItem = {
  id: string;
  path: string;
  name: string;
  format: string;
  sizeBytes: number | null;
};
