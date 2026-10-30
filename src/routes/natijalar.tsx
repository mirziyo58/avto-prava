import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { clearResults, getResults, getMistakes, type ResultEntry } from "@/lib/data";

export const Route = createFileRoute("/natijalar")({
  head: () => ({
    meta: [
      { title: "Natijalarim — AvtoPrava" },
      { name: "description", content: "Ishlagan testlaringiz natijalari va xatolar statistikasi." },
      { property: "og:title", content: "Natijalarim — AvtoPrava" },
      { property: "og:description", content: "Ishlagan testlaringiz natijalari va xatolar statistikasi." },
    ],
  }),
  component: Page,
});

function Page() {
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [mistakes, setMistakes] = useState(0);
  useEffect(() => {
    setResults(getResults());
    setMistakes(getMistakes().length);
  }, []);
  const passed = results.filter((r) => r.passed).length;
  return (
    <div>
      <PageHeader title="Natijalarim" subtitle="Natijalar shu qurilmada saqlanadi." />
      <div className="mb-6 grid grid-cols-3 divide-x rounded-xl border bg-card py-5">
        {[[results.length, "Testlar"], [passed, "O‘tilgan"], [mistakes, "Xato savollar"]].map(([n, l]) => (
          <div key={String(l)} className="px-5"><div className="text-2xl font-bold">{n}</div><div className="text-xs text-muted-foreground">{l}</div></div>
        ))}
      </div>
      {results.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center">
          <p className="font-semibold">Hali test ishlamadingiz.</p>
          <Link to="/test-ishlash" className="mt-3 inline-block text-sm font-medium text-primary">Birinchi testni boshlash →</Link>
        </div>
      ) : (
        <>
          <div className="divide-y rounded-xl border bg-card">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-4 p-4 text-sm">
                <span className="flex-1 font-medium">{r.title}</span>
                <span className="text-muted-foreground">{new Date(r.date).toLocaleString("uz-UZ")}</span>
                <span className="w-16 text-right font-semibold">{r.correct}/{r.total}</span>
                <span className={`rounded px-2 py-0.5 text-xs font-semibold ${r.passed ? "bg-soft text-primary" : "bg-danger-soft text-destructive"}`}>{r.passed ? "O‘tdi" : "O‘tmadi"}</span>
              </div>
            ))}
          </div>
          <button onClick={() => { clearResults(); setResults([]); setMistakes(0); }} className="mt-4 text-sm text-destructive">Natijalarni tozalash</button>
        </>
      )}
    </div>
  );
}
