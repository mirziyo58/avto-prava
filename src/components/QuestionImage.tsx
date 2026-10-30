import { useState } from "react";
import { Maximize2, X } from "lucide-react";

export function QuestionImage({ src }: { src: string }) {
  const [big, setBig] = useState(false);
  const [err, setErr] = useState(false);
  return (
    <>
      <div className="relative mt-4 flex min-h-48 items-center justify-center rounded-lg border border-dashed bg-card p-2">
        {err ? (
          <p className="p-6 text-sm text-muted-foreground">Rasm yuklanmadi.</p>
        ) : (
          <img src={src} alt="Savol rasmi" onError={() => setErr(true)} className="block max-h-[420px] w-auto max-w-full object-contain" />
        )}
        <button
          type="button"
          onClick={() => setBig(true)}
          className="absolute right-2 top-2 rounded-md border bg-card p-2 shadow-sm hover:bg-muted"
          aria-label="Rasmni kattalashtirish"
        >
          <Maximize2 className="size-4" />
        </button>
      </div>
      {big && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/80 p-4" onClick={() => setBig(false)}>
          <button className="absolute right-4 top-4 rounded-md bg-card p-2" aria-label="Yopish">
            <X className="size-5" />
          </button>
          <img src={src} alt="Savol rasmi" className="max-h-[90vh] max-w-full rounded-lg bg-card object-contain" />
        </div>
      )}
    </>
  );
}
