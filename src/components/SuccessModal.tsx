type SuccessModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
};

export function SuccessModal({
  isOpen,
  title,
  description,
  onClose,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-950 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-lime-300">
          {title}
        </h2>
        <p className="mt-3 text-sm text-zinc-300">{description}</p>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-lime-400 px-4 py-2 text-xs font-black uppercase tracking-wide text-zinc-900 transition hover:bg-lime-300"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}
