import { useEffect, useMemo, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import type { QueueItem } from "../types/image";
import { convertQueue } from "../services/imageConversionService";
import {
  mergeQueueItems,
  mapPathsToQueueItems,
  pickDestinationFolder,
  pickImageFiles,
} from "../services/fileDialogService";
import { openFolderIfNeeded } from "../services/folderOpenerService";
import { loadSettings, saveSettings } from "../services/settingsStorageService";
import { debugError, debugLog } from "../utils/debug";

export function useImageConverter() {
  const [initialSettings] = useState(loadSettings);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [destinationFolder, setDestinationFolder] = useState<string>(
    initialSettings.destinationFolder,
  );
  const [outputFormat, setOutputFormat] = useState(initialSettings.outputFormat);
  const [quality, setQuality] = useState(initialSettings.quality);
  const [stripMetadata, setStripMetadata] = useState(
    initialSettings.stripMetadata,
  );
  const [preserveTransparency, setPreserveTransparency] = useState(
    initialSettings.preserveTransparency,
  );
  const [status, setStatus] = useState("Selecione os arquivos para iniciar.");
  const [isConverting, setIsConverting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successDescription, setSuccessDescription] = useState("");
  const [isDropzoneActive, setIsDropzoneActive] = useState(false);

  useEffect(() => {
    saveSettings({
      destinationFolder,
      outputFormat,
      quality,
      stripMetadata,
      preserveTransparency,
    });
  }, [
    destinationFolder,
    outputFormat,
    quality,
    stripMetadata,
    preserveTransparency,
  ]);

  const queueCountLabel = useMemo(() => {
    if (queue.length === 1) return "FILA (1 ARQUIVO)";
    return `FILA (${queue.length} ARQUIVOS)`;
  }, [queue.length]);

  const addFilesToQueue = (items: QueueItem[]) => {
    if (!items.length) return;
    setQueue((current) => mergeQueueItems(current, items));
    setStatus(`${items.length} arquivo(s) adicionado(s) na fila.`);
  };

  const handlePickFiles = async () => {
    try {
      const items = await pickImageFiles();
      debugLog("useImageConverter", "Files selected", { count: items.length });
      addFilesToQueue(items);
    } catch (error) {
      debugError("useImageConverter", "File pick failed", { error: String(error) });
      setStatus(`Erro ao selecionar arquivos: ${String(error)}`);
    }
  };

  const handlePickDestinationFolder = async () => {
    const selected = await pickDestinationFolder();
    if (!selected) return;

    setDestinationFolder(selected);
    setStatus("Pasta de destino definida.");
  };

  const removeFromQueue = (id: string) => {
    setQueue((current) => current.filter((item) => item.id !== id));
  };

  const clearQueue = () => {
    setQueue([]);
    setStatus("Fila limpa.");
  };

  useEffect(() => {
    const isOverDropzone = (x: number, y: number) => {
      const element = document.elementFromPoint(x, y);
      return Boolean(element?.closest('[data-file-dropzone="true"]'));
    };

    let unlisten: (() => void) | null = null;

    const setupDragDrop = async () => {
      try {
        const currentWindow = getCurrentWindow();
        if (!currentWindow || typeof currentWindow.onDragDropEvent !== "function") {
          debugLog("useImageConverter", "DragDrop unavailable on current window");
          return;
        }

        unlisten = await currentWindow.onDragDropEvent((event) => {
          const payload = event?.payload;
          if (!payload || typeof payload !== "object" || !("type" in payload)) {
            debugError("useImageConverter", "Invalid drag payload", { payload });
            setIsDropzoneActive(false);
            return;
          }

          if (payload.type === "leave") {
            setIsDropzoneActive(false);
            return;
          }

          if (
            (payload.type === "over" || payload.type === "enter") &&
            "position" in payload &&
            payload.position
          ) {
            setIsDropzoneActive(
              isOverDropzone(payload.position.x, payload.position.y),
            );
            return;
          }

          if (
            payload.type === "drop" &&
            "position" in payload &&
            payload.position &&
            "paths" in payload &&
            Array.isArray(payload.paths)
          ) {
            const shouldDrop = isOverDropzone(
              payload.position.x,
              payload.position.y,
            );
            setIsDropzoneActive(false);
            if (!shouldDrop) return;

            void mapPathsToQueueItems(payload.paths)
              .then((mapped) => {
                debugLog("useImageConverter", "Dropped files mapped", {
                  count: mapped.length,
                });
                addFilesToQueue(mapped);
              })
              .catch((error) => {
                debugError("useImageConverter", "Drop mapping failed", {
                  error: String(error),
                });
                setStatus(`Erro ao adicionar arquivos: ${String(error)}`);
              });
            return;
          }

          setIsDropzoneActive(false);
        });
      } catch (error) {
        debugError("useImageConverter", "DragDrop setup failed", {
          error: String(error),
        });
        setIsDropzoneActive(false);
      }
    };

    void setupDragDrop();

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  const handleConvertAll = async () => {
    if (!queue.length) {
      setStatus("Adicione arquivos na fila primeiro.");
      return;
    }
    if (!destinationFolder) {
      setStatus("Selecione a pasta de destino.");
      return;
    }

    setIsConverting(true);
    setStatus("Convertendo arquivos...");

    try {
      const converted = await convertQueue({
        queue,
        destinationFolder,
        outputFormat,
        quality,
      });

      const metadataNote = stripMetadata
        ? " metadata removida"
        : " metadata preservada";
      const alphaNote = preserveTransparency
        ? " transparencia preservada"
        : " transparencia removida";

      setStatus(
        `Conversao concluida: ${converted}/${queue.length}.${metadataNote};${alphaNote}.`,
      );

      await openFolderIfNeeded(destinationFolder);
      setSuccessDescription(
        `Conversao concluida com sucesso (${converted}/${queue.length}). Pasta: ${destinationFolder}`,
      );
      setIsSuccessModalOpen(true);
      setQueue([]);
    } catch (e: unknown) {
      debugError("useImageConverter", "Conversion failed", {
        error: e instanceof Error ? e.stack ?? e.message : String(e),
      });
      const errorMessage = e instanceof Error ? e.message : String(e);
      setStatus(`Erro na conversao: ${errorMessage}`);
    } finally {
      setIsConverting(false);
    }
  };

  return {
    queue,
    destinationFolder,
    outputFormat,
    quality,
    stripMetadata,
    preserveTransparency,
    status,
    isConverting,
    isSuccessModalOpen,
    successDescription,
    queueCountLabel,
    isDropzoneActive,
    setOutputFormat,
    setQuality,
    setStripMetadata,
    setPreserveTransparency,
    setIsSuccessModalOpen,
    handlePickFiles,
    handlePickDestinationFolder,
    removeFromQueue,
    clearQueue,
    handleConvertAll,
  };
}
