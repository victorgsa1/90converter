import type { OutputFormat } from "./image";

export type ConverterSettings = {
  destinationFolder: string;
  outputFormat: OutputFormat;
  quality: number;
  stripMetadata: boolean;
  preserveTransparency: boolean;
};
