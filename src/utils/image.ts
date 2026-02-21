export function formatLabel(ext: string) {
  return ext.toUpperCase();
}

export function getFileNameFromPath(path: string) {
  const parts = path.split(/[\\/]/);
  return parts[parts.length - 1] ?? path;
}

export function getFileExt(fileName: string) {
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex <= 0 || dotIndex === fileName.length - 1) return "N/A";
  return fileName.slice(dotIndex + 1).toLowerCase();
}

export function removeExtension(fileName: string) {
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex <= 0) return fileName;
  return fileName.slice(0, dotIndex);
}

export function joinPath(folder: string, fileName: string) {
  const separator = folder.includes("\\") ? "\\" : "/";
  return `${folder.replace(/[\\/]+$/, "")}${separator}${fileName}`;
}

export function formatFileSize(sizeBytes: unknown) {
  if (sizeBytes == null) return "--";

  if (typeof sizeBytes === "bigint") {
    if (sizeBytes < 0n) return "--";
    if (sizeBytes < 1024n) return `${sizeBytes.toString()} B`;
    if (sizeBytes < 1024n * 1024n) return `${Number(sizeBytes / 1024n)} KB`;
    return `${(Number(sizeBytes) / (1024 * 1024)).toFixed(1)} MB`;
  }

  const numeric = typeof sizeBytes === "string" ? Number(sizeBytes) : sizeBytes;
  if (typeof numeric !== "number" || !Number.isFinite(numeric) || numeric < 0) {
    return "--";
  }

  if (numeric < 1024) return `${Math.trunc(numeric)} B`;
  if (numeric < 1024 * 1024) return `${Math.round(numeric / 1024)} KB`;

  return `${(numeric / (1024 * 1024)).toFixed(1)} MB`;
}
