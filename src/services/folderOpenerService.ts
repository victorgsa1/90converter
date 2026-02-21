import { openPath } from "@tauri-apps/plugin-opener";

let lastOpenedFolderInSession: string | null = null;

export async function openFolderIfNeeded(folderPath: string) {
  if (!folderPath) return;
  if (lastOpenedFolderInSession === folderPath) return;
  await openPath(folderPath);
  lastOpenedFolderInSession = folderPath;
}
