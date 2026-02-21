import { useEffect } from "react";
import { OUTPUT_FORMATS } from "./constants/image";
import { ConverterFooter } from "./components/ConverterFooter";
import { ConverterHeader } from "./components/ConverterHeader";
import { ConverterSettingsPanel } from "./components/ConverterSettingsPanel";
import { QueueSection } from "./components/QueueSection";
import { SuccessModal } from "./components/SuccessModal";
import { WindowTitlebar } from "./components/WindowTitlebar";
import { useDisableContextMenu } from "./hooks/useDisableContextMenu";
import { useImageConverter } from "./hooks/useImageConverter";
import { useOverlayScrollbars } from "./hooks/useOverlayScrollbars";
import { useWindowControls } from "./hooks/useWindowControls";
import { debugError } from "./utils/debug";

function App() {
  const {
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
  } = useImageConverter();

  const {
    handleWindowMinimize,
    handleWindowToggleMaximize,
    handleWindowClose,
  } = useWindowControls();

  useDisableContextMenu();
  useOverlayScrollbars();

  useEffect(() => {
    const originalOnError = window.onerror;
    const originalOnUnhandledRejection = window.onunhandledrejection;

    window.onerror = (message, source, lineno, colno, error) => {
      debugError("window", "Unhandled error", {
        message,
        source,
        lineno,
        colno,
        error: error instanceof Error ? error.stack ?? error.message : String(error),
      });
      return false;
    };

    window.onunhandledrejection = (event) => {
      debugError("window", "Unhandled rejection", {
        reason:
          event.reason instanceof Error
            ? event.reason.stack ?? event.reason.message
            : String(event.reason),
      });
    };

    return () => {
      window.onerror = originalOnError;
      window.onunhandledrejection = originalOnUnhandledRejection;
    };
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-transparent text-zinc-100">
      <WindowTitlebar
        title="90'Converter"
        onMinimize={() => {
          void handleWindowMinimize();
        }}
        onToggleMaximize={() => {
          void handleWindowToggleMaximize();
        }}
        onClose={() => {
          void handleWindowClose();
        }}
      />

      <div
        data-scrollable="page"
        className="h-full overflow-y-auto px-4 pb-6 pt-14"
      >
        <main className="mx-auto w-full max-w-5xl rounded-xl border border-zinc-800/70 bg-zinc-950/90 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.45)]">
          <ConverterHeader />

          <QueueSection
            queue={queue}
            queueCountLabel={queueCountLabel}
            isDropzoneActive={isDropzoneActive}
            onPickFiles={() => {
              void handlePickFiles();
            }}
            onRemoveFromQueue={removeFromQueue}
          />

          <ConverterSettingsPanel
            outputFormats={OUTPUT_FORMATS}
            outputFormat={outputFormat}
            quality={quality}
            stripMetadata={stripMetadata}
            preserveTransparency={preserveTransparency}
            destinationFolder={destinationFolder}
            onChangeOutputFormat={setOutputFormat}
            onChangeStripMetadata={setStripMetadata}
            onChangePreserveTransparency={setPreserveTransparency}
            onChangeQuality={setQuality}
            onPickDestinationFolder={() => {
              void handlePickDestinationFolder();
            }}
          />

          <ConverterFooter
            isConverting={isConverting}
            hasQueueItems={queue.length > 0}
            status={status}
            onClearQueue={clearQueue}
            onConvertAll={() => {
              void handleConvertAll();
            }}
          />
        </main>
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        title="Sucesso"
        description={successDescription}
        onClose={() => {
          setIsSuccessModalOpen(false);
        }}
      />
    </div>
  );
}

export default App;
