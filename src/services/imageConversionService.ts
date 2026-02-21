import { invoke } from "@tauri-apps/api/core";
import type { OutputFormat, QueueItem } from "../types/image";
import { joinPath, removeExtension } from "../utils/image";

type ConvertQueueInput = {
  queue: QueueItem[];
  destinationFolder: string;
  outputFormat: OutputFormat;
  quality: number;
};

export async function convertQueue({
  queue,
  destinationFolder,
  outputFormat,
  quality,
}: ConvertQueueInput) {
  let converted = 0;

  for (const item of queue) {
    const outputName = `${removeExtension(item.name)}.${outputFormat}`;
    const outputPath = joinPath(destinationFolder, outputName);

    await invoke("convert_image", {
      inputPath: item.path,
      outputPath,
      quality,
    });
    converted += 1;
  }

  return converted;
}


