import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Play, ArrowRight, Timer, ListChecks, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { useSettings } from "@/lib/data";

export const Route = createFileRoute("/test-ishlash")({
  head: () => ({
    meta: [
      { title: "Test ishlash — AvtoPrava" },
      { name: "description", content: "Savollar sonini tanlang va YHQ testini boshlang." },
      { property: "og:title", content: "Test ishlash — AvtoPrava" },
      { property: "og:description", content: "Savollar sonini tanlang va YHQ testini boshlang." },
    ],
  }),
  component: Page,
});

const COUNTS = [20, 30, 50, 75, 100];

function Page() {
  const { data: s } = useSettings();
  const [n, setN] = useState<number | null>(null);
  const count = n ?? s?.question_count ?? 30;
  return (
    <div>
      <PageHeader eyebrow="Tayyorgarlik / Yangi test" title="Test ishlash" subtitle="Bugungi sinov uchun savollar sonini tanlang." />
      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-7 place-items-center rounded-full bg-soft text-xs font-semibold text-primary">1</span>
            <h2 className="font-semibold">Savollar soni</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {COUNTS.map((c) => (
              <button key={c} onClick={() => setN(c)} className={`relative rounded-lg border p-6 text-left transition-colors ${count === c ? "border-2 border-primary bg-soft" : "bg-card hover:bg-muted"}`}>
                {count === c && <Check className="absolute right-4 top-4 size-4 text-primary" />}
                <div className={`text-3xl font-bold ${count === c ? "text-primary" : ""}`}>{c}</div>
                <div className="mt-1 text-xs text-muted-foreground">{c === 20 ? "Imtihon formati" : "ta savol"}</div>
              </button>
            ))}
          </div>
          <div className="mt-8 border-t pt-6">
            <h3 className="mb-4 text-sm font-semibold">Test shartlari</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3"><Timer className="size-4 text-primary" /> Barcha savollar uchun umumiy {s?.total_minutes ?? 30} daqiqa.</li>
              <li className="flex gap-3"><ListChecks className="size-4 text-primary" /> Savollar orasida erkin o‘tish mumkin.</li>
              <li className="flex gap-3"><ShieldCheck className="size-4 text-primary" /> O‘tish bali: {s?.pass_percent ?? 90}%.</li>
            </ul>
          </div>
        </div>
        <aside className="h-fit rounded-xl border-t-4 border-t-primary bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-semibold">Sizning testingiz</h3>
            <Play className="size-5 text-primary" />
          </div>
          <div className="mt-4 text-5xl font-extrabold text-primary">{count} <span className="text-sm font-normal text-muted-foreground">ta savol</span></div>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Vaqt</dt><dd className="font-semibold">{s?.total_minutes ?? 30} daqiqa</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">O‘tish bali</dt><dd className="font-semibold">{s?.pass_percent ?? 90}%</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Til</dt><dd className="font-semibold">O‘zbekcha</dd></div>
          </dl>
          <Link to="/test" search={{ n: count }} className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Testni boshlash <ArrowRight className="size-4" />
          </Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">Ro‘yxatdan o‘tish shart emas</p>
        </aside>
      </div>
    </div>
  );
}
