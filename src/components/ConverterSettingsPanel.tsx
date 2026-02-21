import type { CSSProperties } from "react";
import FeatherIcon from "feather-icons-react";
import type { OutputFormat } from "../types/image";
import { formatLabel } from "../utils/image";

type ConverterSettingsPanelProps = {
  outputFormats: OutputFormat[];
  outputFormat: OutputFormat;
  quality: number;
  stripMetadata: boolean;
  preserveTransparency: boolean;
  destinationFolder: string;
  onChangeOutputFormat: (format: OutputFormat) => void;
  onChangeStripMetadata: (value: boolean) => void;
  onChangePreserveTransparency: (value: boolean) => void;
  onChangeQuality: (value: number) => void;
  onPickDestinationFolder: () => void;
};

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition ${
        checked ? "bg-lime-400" : "bg-zinc-700"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-zinc-950 transition ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

export function ConverterSettingsPanel({
  outputFormats,
  outputFormat,
  quality,
  stripMetadata,
  preserveTransparency,
  destinationFolder,
  onChangeOutputFormat,
  onChangeStripMetadata,
  onChangePreserveTransparency,
  onChangeQuality,
  onPickDestinationFolder,
}: ConverterSettingsPanelProps) {
  const sliderProgress = `${((quality - 1) / 99) * 100}%`;

  return (
    <section className="my-5 space-y-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          Configurações de saída
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-zinc-300">
              <FeatherIcon icon="image" className="h-3.5 w-3.5 text-lime-300" />
              Formato
            </p>
            <div className="inline-flex rounded-lg border border-zinc-800 bg-black/40 p-1">
              {outputFormats.map((format) => (
                <button
                  key={format}
                  type="button"
                  onClick={() => onChangeOutputFormat(format)}
                  className={`rounded px-4 py-2 text-xs font-bold uppercase ${
                    outputFormat === format
                      ? "bg-lime-400 text-zinc-900"
                      : "text-zinc-400"
                  }`}
                >
                  {formatLabel(format)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                  <FeatherIcon icon="info" className="h-4 w-4 text-lime-300" />
                  Remover metadados
                </p>
                <p className="text-xs text-zinc-500">
                  Remova EXIF, GPS e outras informações
                </p>
              </div>
              <Toggle
                checked={stripMetadata}
                onChange={onChangeStripMetadata}
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                  <FeatherIcon
                    icon="droplet"
                    className="h-4 w-4 text-lime-300"
                  />
                  Preservar a transparência
                </p>
                <p className="text-xs text-zinc-500">
                  Recomendado para saídas PNG
                </p>
              </div>
              <Toggle
                checked={preserveTransparency}
                onChange={onChangePreserveTransparency}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-zinc-800 pt-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <p className="flex items-center gap-2 text-zinc-200">
              <FeatherIcon icon="sliders" className="h-4 w-4 text-lime-300" />
              Qualidade
            </p>
            <span className="font-bold text-lime-400">{quality}%</span>
          </div>
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
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          Pasta de destino
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex w-full items-center gap-2 rounded-lg border border-zinc-800 bg-black/40 px-3 py-2">
            <FeatherIcon icon="folder" className="h-4 w-4 text-lime-300" />
            <input
              type="text"
              value={destinationFolder}
              readOnly
              placeholder="Selecione a pasta de destino"
              className="w-full bg-transparent text-xs text-zinc-300 outline-none"
            />
            <FeatherIcon icon="lock" className="h-3.5 w-3.5 text-zinc-500" />
          </div>

          <button
            type="button"
            onClick={onPickDestinationFolder}
            className="rounded-lg border border-lime-500/50 bg-lime-500/15 p-2 text-lime-200"
            aria-label="Selecionar pasta de destino"
          >
            <FeatherIcon icon="folder-plus" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
