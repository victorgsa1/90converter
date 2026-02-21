import type { ConverterSettings } from "../types/settings";

const SETTINGS_KEY = "images90.converter.settings";

export const DEFAULT_SETTINGS: ConverterSettings = {
  destinationFolder: "",
  outputFormat: "png",
  quality: 90,
  stripMetadata: true,
  preserveTransparency: true,
};

function coerceSettings(value: unknown): ConverterSettings {
  if (!value || typeof value !== "object") return DEFAULT_SETTINGS;
  const parsed = value as Partial<ConverterSettings>;

  const outputFormat =
    parsed.outputFormat === "jpg" ||
    parsed.outputFormat === "webp" ||
    parsed.outputFormat === "png"
      ? parsed.outputFormat
      : DEFAULT_SETTINGS.outputFormat;

  const quality =
    typeof parsed.quality === "number" && parsed.quality >= 1 && parsed.quality <= 100
      ? parsed.quality
      : DEFAULT_SETTINGS.quality;

  return {
    destinationFolder:
      typeof parsed.destinationFolder === "string"
        ? parsed.destinationFolder
        : DEFAULT_SETTINGS.destinationFolder,
    outputFormat,
    quality,
    stripMetadata:
      typeof parsed.stripMetadata === "boolean"
        ? parsed.stripMetadata
        : DEFAULT_SETTINGS.stripMetadata,
    preserveTransparency:
      typeof parsed.preserveTransparency === "boolean"
        ? parsed.preserveTransparency
        : DEFAULT_SETTINGS.preserveTransparency,
  };
}

export function loadSettings(): ConverterSettings {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return coerceSettings(JSON.parse(raw));
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: ConverterSettings) {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
