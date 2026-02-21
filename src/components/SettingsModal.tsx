import type { CSSProperties } from "react";
import { formatLabel } from "../utils/image";
import type { OutputFormat } from "../types/image";

type SettingsModalProps = {
  isOpen: boolean;
  outputFormats: OutputFormat[];
  outputFormat: OutputFormat;
  quality: number;
  stripMetadata: boolean;
  preserveTransparency: boolean;
  destinationFolder: string;
  onClose: () => void;
  onChangeOutputFormat: (format: OutputFormat) => void;
  onChangeStripMetadata: (value: boolean) => void;
  onChangePreserveTransparency: (value: boolean) => void;
  onChangeQuality: (value: number) => void;
  onPickDestinationFolder: () => void;
  onSave: () => void;
};

export function SettingsModal({
  isOpen,
  outputFormats,
  outputFormat,
  quality,
  stripMetadata,
  preserveTransparency,
  destinationFolder,
  onClose,
  onChangeOutputFormat,
  onChangeStripMetadata,
  onChangePreserveTransparency,
  onChangeQuality,
  onPickDestinationFolder,
  onSave,
}: SettingsModalProps) {
  if (!isOpen) return null;
  const sliderProgress = `${((quality - 1) / 99) * 100}%`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-zinc-700 bg-zinc-950 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-300">
            Configurações
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-100"
          >
            Fechar
          </button>
        </div>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h3 className="mb-4 text-[10px] font-bold tracking-[0.2em] text-zinc-500">
            CONFIGURAÇÃO DE SAÍDA
          </h3>
          <div className="mb-5 grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold text-zinc-300">
                Formato
              </p>
              <div className="inline-flex rounded-md border border-zinc-800 bg-zinc-950 p-1">
                {outputFormats.map((format) => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => onChangeOutputFormat(format)}
                    className={`rounded px-3 py-1 text-xs font-bold uppercase transition ${
                      outputFormat === format
                        ? "bg-lime-400 text-zinc-900"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {formatLabel(format)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between text-xs text-zinc-300">
                Remover metadados
                <input
                  type="checkbox"
                  checked={stripMetadata}
                  onChange={(event) =>
                    onChangeStripMetadata(event.target.checked)
                  }
                  className="h-4 w-4 accent-lime-400"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-zinc-300">
                Preservar transparência
                <input
                  type="checkbox"
                  checked={preserveTransparency}
                  onChange={(event) =>
                    onChangePreserveTransparency(event.target.checked)
                  }
                  className="h-4 w-4 accent-lime-400"
                />
              </label>
            </div>
          </div>

          <label className="block text-xs font-semibold text-zinc-300">
            Quality (JPG/WebP){" "}
            <span className="ml-2 text-lime-400">{quality}%</span>
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={quality}
              onChange={(event) => onChangeQuality(Number(event.target.value))}
              disabled={outputFormat === "png"}
              style={{ "--range-progress": sliderProgress } as CSSProperties}
              className="quality-slider h-2 w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            />
            <input
              type="number"
              min={1}
              max={100}
              value={quality}
              onChange={(event) => {
                const raw = Number(event.target.value);
                const next = Number.isNaN(raw)
                  ? 1
                  : Math.min(100, Math.max(1, raw));
                onChangeQuality(next);
              }}
              disabled={outputFormat === "png"}
              className="w-16 rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-right text-xs text-zinc-200 outline-none disabled:opacity-40"
            />
          </div>
          {outputFormat === "png" ? (
            <p className="mt-2 text-[11px] text-zinc-500">
              PNG e lossless. Qualidade visual nao muda nesse formato.
            </p>
          ) : null}
        </section>

        <section className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h3 className="mb-3 text-[10px] font-bold tracking-[0.2em] text-zinc-500">
            PASTA DE DESTINO
          </h3>
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              value={destinationFolder}
              readOnly
              placeholder="Selecione a pasta de destino"
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 outline-none"
            />
            <button
              type="button"
              onClick={onPickDestinationFolder}
              className="rounded-md border border-lime-500/50 bg-lime-500/20 px-4 py-2 text-xs font-bold text-lime-200 transition hover:bg-lime-500/30"
            >
              Selecionar
            </button>
          </div>
        </section>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onSave}
            className="rounded-md border border-lime-500/60 bg-lime-500/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-lime-200 transition hover:bg-lime-500/30"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
