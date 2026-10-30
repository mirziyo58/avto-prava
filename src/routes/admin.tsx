import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogOut, Plus, Trash2, Pencil, Search, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, DIFFICULTY, useQuestions, useSettings, type Question } from "@/lib/data";
import { CONTENT_GROUPS, useContentMap } from "@/lib/content";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin panel — AvtoPrava" },
      { name: "description", content: "AvtoPrava sayt boshqaruvi." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin panel — AvtoPrava" },
      { property: "og:description", content: "AvtoPrava sayt boshqaruvi." },
    ],
  }),
  component: AdminPage,
});

const ADMIN_DOMAIN = "avtoprava.uz";
const input = "w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:border-primary";

function AdminPage() {
  const [state, setState] = useState<"loading" | "out" | "noadmin" | "in">("loading");

  async function check() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return setState("out");
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).eq("role", "admin");
    setState(roles && roles.length ? "in" : "noadmin");
  }
  useEffect(() => {
    check();
    const { data } = supabase.auth.onAuthStateChange(() => setTimeout(check, 0));
    return () => data.subscription.unsubscribe();
  }, []);

  if (state === "loading") return <p className="text-muted-foreground">Yuklanmoqda…</p>;
  if (state === "out") return <Login />;
  if (state === "noadmin")
    return (
      <div className="mx-auto max-w-sm rounded-xl border bg-card p-6 text-center">
        <p className="font-semibold">Sizda admin huquqi yo‘q.</p>
        <button onClick={() => supabase.auth.signOut()} className="mt-4 text-sm text-primary">Chiqish</button>
      </div>
    );
  return <Dashboard />;
}

function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const name = login.trim().toLowerCase();
    const email = name.includes("@") ? name : `${name}@${ADMIN_DOMAIN}`;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error("Login yoki parol noto‘g‘ri");
  }
  return (
    <form onSubmit={submit} className="mx-auto mt-10 max-w-sm space-y-4 rounded-xl border-t-4 border-t-primary bg-card p-7 shadow-sm">
      <div>
        <div className="eyebrow">Boshqaruv</div>
        <h1 className="mt-1 text-2xl font-bold">Admin panelga kirish</h1>
      </div>
      <label className="block text-sm font-medium">Login<input className={`${input} mt-1`} value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username" required /></label>
      <label className="block text-sm font-medium">Parol<input type="password" className={`${input} mt-1`} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></label>
      <button disabled={busy} className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Kirilmoqda…" : "Kirish"}</button>
    </form>
  );
}

function Dashboard() {
  const [tab, setTab] = useState<"q" | "s" | "c">("q");
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="eyebrow">Boshqaruv</div>
          <h1 className="text-3xl font-bold">Admin panel</h1>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm"><LogOut className="size-4" /> Chiqish</button>
      </div>
      <div className="mb-6 inline-flex rounded-lg border bg-card p-1">
        {([["q", "Savollar"], ["s", "Test sozlamalari"], ["c", "Sayt matnlari"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-md px-4 py-2 text-sm font-medium ${tab === k ? "bg-primary text-primary-foreground" : ""}`}>{l}</button>
        ))}
      </div>
      {tab === "q" && <QuestionsAdmin />}
      {tab === "s" && <SettingsAdmin />}
      {tab === "c" && <ContentAdmin />}
    </div>
  );
}

const EMPTY: Omit<Question, "id"> = { category: "belgilar", text: "", sign: null, image_url: "", options: ["", ""], correct: 0, explanation: "", difficulty: 1, published: true, sort_order: 0 };

function QuestionsAdmin() {
  const { data: qs = [] } = useQuestions();
  const qc = useQueryClient();
  const [edit, setEdit] = useState<(Partial<Question> & typeof EMPTY) | null>(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const list = qs.filter((x) => (!cat || x.category === cat) && x.text.toLowerCase().includes(q.toLowerCase()));

  async function remove(id: string) {
    if (!confirm("Savolni o‘chirasizmi?")) return;
    const { error } = await supabase.from("questions").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("O‘chirildi");
    qc.invalidateQueries({ queryKey: ["questions"] });
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Savol qidirish…" className={`${input} pl-9`} />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className={`${input} w-auto`}>
          <option value="">Barcha bo‘limlar</option>
          {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span className="text-sm text-muted-foreground">{list.length} ta</span>
        <button onClick={() => setEdit({ ...EMPTY, sort_order: (qs.at(-1)?.sort_order ?? 0) + 1 })} className="ml-auto inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          <Plus className="size-4" /> Yangi savol
        </button>
      </div>
      <div className="divide-y rounded-xl border bg-card">
        {list.map((x) => (
          <div key={x.id} className="flex items-center gap-3 p-3">
            {x.image_url ? <img src={x.image_url} alt="" className="h-12 w-16 shrink-0 rounded border object-contain" /> : <div className="h-12 w-16 shrink-0 rounded border bg-muted" />}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{x.text}</p>
              <p className="text-xs text-muted-foreground">{CATEGORIES[x.category] ?? x.category} · {DIFFICULTY[x.difficulty]} {x.published ? "" : "· Yashirin"}</p>
            </div>
            <button onClick={() => setEdit({ ...x, image_url: x.image_url ?? "" })} className="rounded-md p-2 hover:bg-muted" aria-label="Tahrirlash"><Pencil className="size-4" /></button>
            <button onClick={() => remove(x.id)} className="rounded-md p-2 text-destructive hover:bg-danger-soft" aria-label="O‘chirish"><Trash2 className="size-4" /></button>
          </div>
        ))}
      </div>
      {edit && <QuestionEditor value={edit} onClose={() => setEdit(null)} />}
    </div>
  );
}

function QuestionEditor({ value, onClose }: { value: Partial<Question> & typeof EMPTY; onClose: () => void }) {
  const [v, setV] = useState(value);
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => setV((p) => ({ ...p, [k]: val }));

  async function save() {
    const options = v.options.map((o) => o.trim()).filter(Boolean);
    if (!v.text.trim() || options.length < 2) { toast.error("Savol matni va kamida 2 ta javob kerak"); return; }
    setBusy(true);
    const row = {
      category: v.category, text: v.text.trim(), image_url: v.image_url?.trim() || null, options,
      correct: Math.min(v.correct, options.length - 1), explanation: v.explanation, difficulty: v.difficulty,
      published: v.published, sort_order: v.sort_order,
    };
    const { error } = v.id
      ? await supabase.from("questions").update(row).eq("id", v.id)
      : await supabase.from("questions").insert(row);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Saqlandi");
    qc.invalidateQueries({ queryKey: ["questions"] });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/40" onClick={onClose}>
      <div className="h-full w-full max-w-xl overflow-y-auto bg-background p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{v.id ? "Savolni tahrirlash" : "Yangi savol"}</h2>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-muted"><X className="size-5" /></button>
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-medium">Savol matni<textarea rows={3} className={`${input} mt-1`} value={v.text} onChange={(e) => set("text", e.target.value)} /></label>
          <label className="block text-sm font-medium">Rasm havolasi (URL)<input className={`${input} mt-1`} value={v.image_url ?? ""} onChange={(e) => set("image_url", e.target.value)} placeholder="https://..." /></label>
          {v.image_url && <img src={v.image_url} alt="" className="max-h-48 rounded border bg-card object-contain" />}
          <div>
            <div className="mb-1 text-sm font-medium">Javoblar (to‘g‘risini belgilang)</div>
            <div className="space-y-2">
              {v.options.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="radio" checked={v.correct === i} onChange={() => set("correct", i)} className="size-4 accent-primary" />
                  <input className={input} value={o} onChange={(e) => set("options", v.options.map((x, k) => (k === i ? e.target.value : x)))} placeholder={`Javob ${String.fromCharCode(65 + i)}`} />
                  <button disabled={v.options.length <= 2} onClick={() => { set("options", v.options.filter((_, k) => k !== i)); if (v.correct >= i && v.correct > 0) set("correct", v.correct - 1); }} className="rounded-md p-2 text-destructive disabled:opacity-30"><Trash2 className="size-4" /></button>
                </div>
              ))}
            </div>
            <button onClick={() => set("options", [...v.options, ""])} className="mt-2 text-sm font-medium text-primary">+ Javob qo‘shish</button>
          </div>
          <label className="block text-sm font-medium">Izoh (javobdan keyin ko‘rinadi)<textarea rows={2} className={`${input} mt-1`} value={v.explanation} onChange={(e) => set("explanation", e.target.value)} /></label>
          <div className="grid grid-cols-3 gap-3">
            <label className="block text-sm font-medium">Bo‘lim
              <select className={`${input} mt-1`} value={v.category} onChange={(e) => set("category", e.target.value)}>
                {Object.entries(CATEGORIES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium">Qiyinlik
              <select className={`${input} mt-1`} value={v.difficulty} onChange={(e) => set("difficulty", Number(e.target.value))}>
                {[1, 2, 3].map((d) => <option key={d} value={d}>{DIFFICULTY[d]}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium">Tartib raqami<input type="number" className={`${input} mt-1`} value={v.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} /></label>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={v.published} onChange={(e) => set("published", e.target.checked)} className="size-4 accent-primary" /> Saytda ko‘rinsin</label>
          <button disabled={busy} onClick={save} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"><Save className="size-4" /> Saqlash</button>
        </div>
      </div>
    </div>
  );
}

function SettingsAdmin() {
  const { data } = useSettings();
  const qc = useQueryClient();
  const [v, setV] = useState(data);
  useEffect(() => setV(data), [data]);
  if (!v) return null;
  async function save() {
    const { error } = await supabase.from("quiz_settings").upsert({ id: 1, ...v!, updated_at: new Date().toISOString() });
    if (error) { toast.error(error.message); return; }
    toast.success("Saqlandi");
    qc.invalidateQueries({ queryKey: ["settings"] });
  }
  const fields = [
    ["question_count", "Standart savollar soni"],
    ["total_minutes", "Test vaqti (daqiqa)"],
    ["pass_percent", "O‘tish bali (%)"],
  ] as const;
  return (
    <div className="max-w-md space-y-4 rounded-xl border bg-card p-6">
      {fields.map(([k, l]) => (
        <label key={k} className="block text-sm font-medium">{l}
          <input type="number" className={`${input} mt-1`} value={v[k]} onChange={(e) => setV({ ...v, [k]: Number(e.target.value) })} />
        </label>
      ))}
      <button onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"><Save className="size-4" /> Saqlash</button>
    </div>
  );
}

function ContentAdmin() {
  const { data } = useContentMap();
  const qc = useQueryClient();
  const [vals, setVals] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const init: Record<string, string> = {};
    CONTENT_GROUPS.forEach((g) => g.fields.forEach((f) => (init[f.key] = data?.[f.key] || f.default)));
    setVals(init);
  }, [data]);
  async function save() {
    setBusy(true);
    const rows = Object.entries(vals).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
    const { error } = await supabase.from("site_content").upsert(rows);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Saqlandi");
    qc.invalidateQueries({ queryKey: ["site_content"] });
  }
  return (
    <div className="space-y-6">
      {CONTENT_GROUPS.map((g) => (
        <section key={g.title} className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 font-semibold">{g.title}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {g.fields.map((f) => (
              <label key={f.key} className={`block text-sm font-medium ${f.long ? "sm:col-span-2" : ""}`}>{f.label}
                {f.long ? (
                  <textarea rows={f.key.endsWith(":body") ? 10 : 3} className={`${input} mt-1`} value={vals[f.key] ?? ""} onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })} />
                ) : (
                  <input className={`${input} mt-1`} value={vals[f.key] ?? ""} onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })} />
                )}
              </label>
            ))}
          </div>
        </section>
      ))}
      <div className="sticky bottom-4">
        <button disabled={busy} onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg disabled:opacity-60"><Save className="size-4" /> Barcha matnlarni saqlash</button>
      </div>
    </div>
  );
}
