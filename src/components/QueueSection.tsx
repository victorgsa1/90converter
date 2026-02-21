import FeatherIcon from "feather-icons-react";
import type { QueueItem } from "../types/image";
import { formatFileSize, formatLabel } from "../utils/image";

type QueueSectionProps = {
  queue: QueueItem[];
  queueCountLabel: string;
  isDropzoneActive: boolean;
  onPickFiles: () => void;
  onRemoveFromQueue: (id: string) => void;
};

export function QueueSection({
  queue,
  queueCountLabel,
  isDropzoneActive,
  onPickFiles,
  onRemoveFromQueue,
}: QueueSectionProps) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div
        data-file-dropzone="true"
        className={`rounded-lg transition ${
          isDropzoneActive
            ? "ring-2 ring-lime-400 ring-offset-2 ring-offset-zinc-900"
            : ""
        }`}
      >
        <button
          type="button"
          onClick={onPickFiles}
          className={`group mb-4 flex w-full flex-col items-center justify-center rounded-lg border border-dashed px-4 py-10 transition ${
            isDropzoneActive
              ? "border-lime-300 bg-lime-700/30"
              : "border-lime-500/60 bg-lime-950/25 hover:border-lime-400 hover:bg-lime-900/30"
          }`}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-lime-500/20 text-xl text-lime-300">
            +
          </div>
          <p className="text-sm font-semibold text-zinc-100">
            Arraste imagens aqui ou clique para selecionar
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            Suporte: WEBP, AVIF, PNG, JPG
          </p>
        </button>
      </div>

      <h2 className="mb-2 text-[12px] font-bold uppercase tracking-[0.15em] text-slate-400">
        {queueCountLabel}
      </h2>

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-black/35">
        <div className="grid grid-cols-[1fr_110px_110px_64px] border-b border-zinc-800 bg-zinc-900/70 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
          <span>Nome do arquivo</span>
          <span>Tamanho</span>
          <span>Formato</span>
          <span className="text-right">Ação</span>
        </div>

        <div data-scrollable="queue" className="max-h-80 overflow-y-auto pr-1">
          {queue.length === 0 ? (
            <div className="px-3 py-6 text-sm text-zinc-500">
              Nenhum arquivo na fila.
            </div>
          ) : (
            queue.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_110px_110px_64px] items-center border-t border-zinc-800/80 px-3 py-3 text-sm"
              >
                <span className="flex items-center gap-2 truncate text-zinc-200">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-lime-500/20 text-lime-300">
                    <FeatherIcon icon="image" className="h-3.5 w-3.5" />
                  </span>
                  <span className="truncate">{item.name}</span>
                </span>

                <span className="text-slate-400">{formatFileSize(item.sizeBytes)}</span>

                <span>
                  <span className="rounded-md border border-lime-700 bg-lime-700/30 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-lime-200">
                    {formatLabel(item.format)}
                  </span>
                </span>

                <button
                  type="button"
                  onClick={() => onRemoveFromQueue(item.id)}
                  className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
                  aria-label={`Remover ${item.name}`}
                >
                  <FeatherIcon icon="trash-2" className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
