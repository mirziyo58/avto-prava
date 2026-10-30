import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { QuestionImage } from "@/components/QuestionImage";
import { CATEGORIES, DIFFICULTY, useQuestions } from "@/lib/data";

export const Route = createFileRoute("/bolimlar")({
  head: () => ({
    meta: [
      { title: "Savollar banki — AvtoPrava" },
      { name: "description", content: "YHQ imtihonining barcha savollari va to‘g‘ri javoblari." },
      { property: "og:title", content: "Savollar banki — AvtoPrava" },
      { property: "og:description", content: "YHQ imtihonining barcha savollari va to‘g‘ri javoblari." },
    ],
  }),
  component: Page,
});

function Page() {
  const { data: qs = [], isLoading } = useQuestions();
  const [cat, setCat] = useState("");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const list = qs.filter((x) => (!cat || x.category === cat) && x.text.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <PageHeader
        title="Savollar banki"
        subtitle={`${qs.length} ta savol · Yagona YHQ banki`}
        right={<Link to="/test-ishlash" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Test ishlash</Link>}
      />
      <div className="mb-5 flex flex-wrap gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Qidirish…" className="w-full rounded-lg border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-primary" />
        </div>
        {[["", "Barchasi"], ...Object.entries(CATEGORIES)].map(([k, v]) => (
          <button key={k} onClick={() => setCat(k ?? "")} className={`rounded-full border px-3 py-1.5 text-xs font-medium ${cat === k ? "border-primary bg-soft text-primary" : "bg-card"}`}>{v}</button>
        ))}
      </div>
      {isLoading && <p className="text-muted-foreground">Yuklanmoqda…</p>}
      <div className="divide-y rounded-xl border bg-card">
        {list.map((x) => (
          <div key={x.id}>
            <button onClick={() => setOpen(open === x.id ? null : x.id)} className="flex w-full items-start gap-4 p-4 text-left hover:bg-muted">
              <span className="w-8 shrink-0 text-xs font-semibold text-muted-foreground">{String(qs.indexOf(x) + 1).padStart(3, "0")}</span>
              <span className="flex-1 text-sm">{x.text}</span>
              <span className={`shrink-0 rounded px-2 py-0.5 text-xs ${x.difficulty >= 2 ? "bg-danger-soft text-destructive" : "bg-muted text-muted-foreground"}`}>{DIFFICULTY[x.difficulty] ?? ""}</span>
            </button>
            {open === x.id && (
              <div className="px-4 pb-5 pl-16">
                {x.image_url && <QuestionImage src={x.image_url} />}
                <ul className="mt-3 space-y-1.5">
                  {x.options.map((o, i) => (
                    <li key={i} className={`rounded-md border px-3 py-2 text-sm ${i === x.correct ? "border-success bg-soft font-medium" : ""}`}>
                      {String.fromCharCode(65 + i)}. {o}
                    </li>
                  ))}
                </ul>
                {x.explanation && <p className="mt-3 text-sm text-muted-foreground">{x.explanation}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
