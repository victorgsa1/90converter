import { invoke } from "@tauri-apps/api/core";

type LogLevel = "info" | "error";

function safeSerialize(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

async function sendToBackend(
  level: LogLevel,
  scope: string,
  message: string,
  data?: unknown,
) {
  try {
    await invoke("frontend_log", {
      level,
      scope,
      message,
      data: data == null ? null : safeSerialize(data),
    });
  } catch {
    // Do not throw from logger.
  }
}

export function debugLog(scope: string, message: string, data?: unknown) {
  console.log(`[${scope}] ${message}`, data ?? "");
  void sendToBackend("info", scope, message, data);
}

export function debugError(scope: string, message: string, data?: unknown) {
  console.error(`[${scope}] ${message}`, data ?? "");
  void sendToBackend("error", scope, message, data);
}
