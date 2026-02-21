import FeatherIcon from "feather-icons-react";

type WindowTitlebarProps = {
  title: string;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
};

export function WindowTitlebar({
  title,
  onMinimize,
  /*  onToggleMaximize, */
  onClose,
}: WindowTitlebarProps) {
  return (
    <div
      data-tauri-drag-region
      className="fixed left-0 right-0 top-0 z-40 w-full border-b border-zinc-800 bg-zinc-900/95 px-4 py-2 backdrop-blur"
    >
      <div className="flex w-full">
        <div className="mx-auto flex w-full items-center justify-between">
          <div
            data-tauri-drag-region
            className="text-sm font-black text-zinc-100"
          >
            {title}
          </div>
        </div>
        <div className="window-controls flex items-center gap-1">
          <button
            type="button"
            className="rounded border border-zinc-700 bg-zinc-900 p-1.5 text-zinc-300 transition hover:border-lime-400 hover:text-lime-300"
            aria-label="Minimizar"
            onClick={onMinimize}
          >
            <FeatherIcon className="h-3.5 w-3.5" icon="minus" />
          </button>
          {/*  <button
            type="button"
            className="rounded border border-zinc-700 bg-zinc-900 p-1.5 text-zinc-300 transition hover:border-lime-400 hover:text-lime-300"
            aria-label="Maximizar"
            onClick={onToggleMaximize}
          >
            <FeatherIcon className="h-3.5 w-3.5" icon="square" />
          </button> */}
          <button
            type="button"
            className="rounded border border-zinc-700 bg-zinc-900 p-1.5 text-zinc-300 transition hover:border-red-500 hover:text-red-400"
            aria-label="Fechar"
            onClick={onClose}
          >
            <FeatherIcon className="h-3.5 w-3.5" icon="x" />
          </button>
        </div>
      </div>
    </div>
  );
}
