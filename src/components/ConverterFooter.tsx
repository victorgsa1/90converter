import FeatherIcon from "feather-icons-react";

type ConverterFooterProps = {
  isConverting: boolean;
  hasQueueItems: boolean;
  status: string;
  onClearQueue: () => void;
  onConvertAll: () => void;
};

export function ConverterFooter({
  isConverting,
  hasQueueItems,
  status,
  onClearQueue,
  onConvertAll,
}: ConverterFooterProps) {
  return (
    <footer className="mt-6 rounded-xl border border-zinc-900 bg-black/50 p-4">
      <div className="flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={onClearQueue}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/50 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-red-500/60 hover:bg-red-500/15 hover:text-red-300"
        >
          <FeatherIcon icon="x" className="h-4 w-4" />
          Limpar fila
        </button>

        <button
          type="button"
          onClick={onConvertAll}
          disabled={isConverting || !hasQueueItems}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-lime-400 px-10 py-3 text-sm font-black uppercase tracking-wide text-zinc-950 shadow-[0_0_18px_rgba(163,230,53,0.45)] transition hover:bg-lime-300 hover:shadow-[0_0_24px_rgba(163,230,53,0.65)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <FeatherIcon icon="refresh-cw" className="h-4 w-4" />
          {isConverting ? "Convertendo..." : "Converter"}
        </button>
      </div>
      <p className="mt-3 text-xs text-zinc-500">{status}</p>
    </footer>
  );
}
