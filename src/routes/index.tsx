import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Play, ArrowRight, LayoutGrid, Timer, Brain, ShieldCheck, ArrowUpRight, BookOpen, Lightbulb, MessageCircle, FileText, GraduationCap, Car } from "lucide-react";
import { useContent } from "@/lib/content";
import { useQuestions, useSettings, seededShuffle } from "@/lib/data";
import { QuestionImage } from "@/components/QuestionImage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AvtoPrava — haydovchilik imtihoniga onlayn tayyorgarlik" },
      { name: "description", content: "YHQ 2026: 300 ta savol, 64 ta bepul variant va real imtihon rejimi." },
      { property: "og:title", content: "AvtoPrava — haydovchilik imtihoniga tayyorgarlik" },
      { property: "og:description", content: "YHQ 2026: 300 ta savol, 64 ta bepul variant va real imtihon rejimi." },
    ],
  }),
  component: Index,
});

function Index() {
  const c = useContent();
  const { data: qs } = useQuestions();
  const { data: settings } = useSettings();

  const directions = [
    { to: "/real-imtihon", title: "Real imtihon", text: "Imtihon ritmida tayyorgarlik", icon: Timer, tone: "bg-soft text-primary" },
    { to: "/qiyin-savollar", title: "Qiyin savollar", text: "Bilimingizni chuqurroq sinang", icon: Brain, tone: "bg-danger-soft text-destructive" },
    { to: "/xatolar-testi", title: "Xatolar ustida ishlash", text: "Oldingi xatolarga qayting", icon: ShieldCheck, tone: "bg-info-soft text-info" },
  ] as const;
  const resources = [
    { key: "prava-olish", icon: Car },
    { key: "avtoimtihon-2026", icon: FileText },
    { key: "e-avtomaktab", icon: GraduationCap },
  ] as const;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow mb-2">{c("home_eyebrow")}</div>
          <h1 className="text-3xl font-bold tracking-tight">{c("home_title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{c("home_subtitle")}</p>
        </div>
        <span className="flex items-center gap-2 text-xs font-semibold"><span className="size-1.5 rounded-full bg-primary" />{c("home_badge")}</span>
      </div>

      <div className="mb-8 grid grid-cols-3 divide-x rounded-xl border bg-card py-5">
        {[
          [qs?.length ?? "—", "ta", "Savollar banki"],
          [c("stat_variants"), "ta", "Bepul variant"],
          [settings?.total_minutes ?? 30, "daq.", "Umumiy test vaqti"],
        ].map(([n, u, l]) => (
          <div key={String(l)} className="px-4 lg:px-6">
            <div className="text-2xl font-bold">{n} <span className="text-xs font-normal text-muted-foreground">{u}</span></div>
            <div className="mt-1 text-xs text-muted-foreground">{l}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-8">
          <section className="relative border-l-4 border-primary bg-soft p-7 lg:p-8">
            <Play className="absolute right-7 top-7 size-6 text-primary" />
            <div className="eyebrow">{c("hero_eyebrow")}</div>
            <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight">{c("hero_title")}</h2>
            <p className="mt-4 text-sm text-muted-foreground">{c("hero_text")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/test-ishlash" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90">
                <Play className="size-4 fill-current" /> Testni boshlash <ArrowRight className="size-4" />
              </Link>
              <Link to="/variant" className="inline-flex items-center gap-2 rounded-lg border bg-card px-5 py-3 text-sm font-medium hover:bg-muted">
                <LayoutGrid className="size-4" /> Variantlar
              </Link>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Mashq yo‘nalishlari</h2>
              <span className="text-xs text-muted-foreground">03 yo‘nalish</span>
            </div>
            <div className="space-y-3">
              {directions.map((d) => (
                <Link key={d.to} to={d.to} className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-primary">
                  <span className={`grid size-11 place-items-center rounded-lg ${d.tone}`}><d.icon className="size-5" /></span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{d.title}</span>
                    <span className="block text-xs text-muted-foreground">{d.text}</span>
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
            <Link to="/bolimlar" className="mt-5 flex items-center gap-3 border-b py-3 text-sm font-medium">
              <BookOpen className="size-4 text-primary" /> <span className="flex-1">Barcha savollarni ko‘rish</span> <ArrowRight className="size-4" />
            </Link>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold">Foydali manbalar</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {resources.map((r) => (
                <Link key={r.key} to="/$slug" params={{ slug: r.key }} className="rounded-xl border bg-card p-4 transition-colors hover:border-primary">
                  <r.icon className="size-5 text-primary" />
                  <div className="mt-3 text-sm font-semibold">{c(`page:${r.key}:title`)}</div>
                  <div className="text-xs text-muted-foreground">{c(`page:${r.key}:subtitle`)}</div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <DailyQuestion />
          <section className="rounded-xl border bg-card p-5">
            <MessageCircle className="size-5 text-info" />
            <h3 className="mt-3 font-semibold">{c("community_title")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c("community_text")}</p>
            <a href={c("telegram_url")} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Kanalga qo‘shilish <ArrowUpRight className="size-4" />
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}

function DailyQuestion() {
  const { data: qs } = useQuestions();
  const day = Math.floor(Date.now() / 86400000);
  const five = useMemo(() => (qs ? seededShuffle(qs, day).slice(0, 5) : []), [qs, day]);
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const q = five[i];
  return (
    <section className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="flex items-center gap-2 font-semibold"><Lightbulb className="size-5 text-primary" /> Kun savoli</h3>
        <span className="text-xs text-muted-foreground">{i + 1} / 5</span>
      </div>
      {!q ? (
        <p className="py-6 text-sm text-muted-foreground">Savol yuklanmoqda…</p>
      ) : (
        <>
          <p className="mt-4 font-semibold leading-relaxed">{q.text}</p>
          {q.image_url && <QuestionImage src={q.image_url} />}
          <div className="mt-4 space-y-2">
            {q.options.map((o, k) => {
              let cls = "hover:bg-muted";
              if (chosen !== null && k === q.correct) cls = "border-success bg-soft";
              else if (chosen === k) cls = "border-destructive bg-danger-soft";
              return (
                <button key={k} disabled={chosen !== null} onClick={() => setChosen(k)} className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm ${cls}`}>
                  <span className="grid size-6 place-items-center rounded border text-xs">{String.fromCharCode(65 + k)}</span>
                  {o}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <button className="font-medium text-primary disabled:opacity-40" disabled={chosen === null} onClick={() => { setI((i + 1) % 5); setChosen(null); }}>
              Keyingi savol →
            </button>
            <Link to="/test-ishlash" className="font-medium">To‘liq testga o‘tish →</Link>
          </div>
        </>
      )}
    </section>
  );
}
