import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Timer, ChevronLeft, ChevronRight, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { useQuestions, useSettings, addResult, saveMistakes, type Question } from "@/lib/data";
import { QuestionImage } from "./QuestionImage";

export type QuizConfig = {
  title: string;
  pick: (all: Question[]) => Question[];
  minutes?: number;
  key: string;
};

export function Quiz({ config }: { config: QuizConfig }) {
  const { data: all, isLoading } = useQuestions();
  const { data: settings } = useSettings();
  const [attempt, setAttempt] = useState(0);
  const questions = useMemo(() => (all ? config.pick(all) : []), [all, config.key, attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading || !settings) return <p className="text-muted-foreground">Savollar yuklanmoqda…</p>;
  if (!questions.length)
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="font-semibold">Bu bo‘limda hozircha savollar yo‘q.</p>
        <Link to="/test-ishlash" className="mt-4 inline-block text-sm font-medium text-primary">Boshqa test tanlash →</Link>
      </div>
    );
  return (
    <Runner
      key={`${config.key}-${attempt}`}
      title={config.title}
      questions={questions}
      minutes={config.minutes ?? settings.total_minutes}
      pass={settings.pass_percent}
      onRestart={() => setAttempt((a) => a + 1)}
    />
  );
}

function Runner({ title, questions, minutes, pass, onRestart }: { title: string; questions: Question[]; minutes: number; pass: number; onRestart: () => void }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [left, setLeft] = useState(minutes * 60);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setLeft((l) => (l <= 1 ? 0 : l - 1)), 1000);
    return () => clearInterval(t);
  }, [done]);
  useEffect(() => {
    if (left === 0 && !done) finish();
  }, [left]); // eslint-disable-line react-hooks/exhaustive-deps

  const correctCount = questions.filter((q, i) => answers[i] === q.correct).length;
  const percent = Math.round((correctCount / questions.length) * 100);

  function finish() {
    setDone(true);
    const wrong = questions.filter((q, i) => answers[i] !== q.correct).map((q) => q.id);
    const right = questions.filter((q, i) => answers[i] === q.correct).map((q) => q.id);
    saveMistakes(wrong, right);
    addResult({ date: new Date().toISOString(), title, total: questions.length, correct: right.length, passed: percent >= pass });
  }

  const q = questions[idx]!;
  const chosen = answers[idx];
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="rounded-xl border bg-card p-5 lg:p-7">
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="eyebrow">{title}</span>
          <span className="text-muted-foreground">{idx + 1} / {questions.length}</span>
        </div>
        <h2 className="text-lg font-semibold leading-relaxed">{q.text}</h2>
        {q.image_url && <QuestionImage src={q.image_url} />}
        <div className="mt-5 space-y-2.5">
          {q.options.map((opt, i) => {
            const answered = chosen !== undefined;
            let cls = "border bg-card hover:bg-muted";
            if (answered && i === q.correct) cls = "border-success bg-soft";
            else if (answered && i === chosen) cls = "border-destructive bg-danger-soft";
            return (
              <button
                key={i}
                disabled={answered || done}
                onClick={() => setAnswers((a) => ({ ...a, [idx]: i }))}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition-colors ${cls}`}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-md border bg-background text-xs font-semibold">{String.fromCharCode(65 + i)}</span>
                <span className="flex-1">{opt}</span>
                {answered && i === q.correct && <CheckCircle2 className="size-5 text-success" />}
                {answered && i === chosen && i !== q.correct && <XCircle className="size-5 text-destructive" />}
              </button>
            );
          })}
        </div>
        {chosen !== undefined && q.explanation && <p className="mt-4 rounded-lg bg-muted p-3 text-sm">{q.explanation}</p>}
        <div className="mt-6 flex items-center justify-between">
          <button disabled={idx === 0} onClick={() => setIdx(idx - 1)} className="inline-flex items-center gap-1 rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-40">
            <ChevronLeft className="size-4" /> Oldingi
          </button>
          {idx < questions.length - 1 ? (
            <button onClick={() => setIdx(idx + 1)} className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Keyingi <ChevronRight className="size-4" />
            </button>
          ) : !done ? (
            <button onClick={finish} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Yakunlash</button>
          ) : null}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-xl border-t-4 border-t-primary bg-card p-5 shadow-sm">
          {done ? (
            <>
              <div className="eyebrow">Natija</div>
              <div className="mt-2 text-4xl font-extrabold text-primary">{percent}%</div>
              <p className="mt-1 text-sm text-muted-foreground">{correctCount} / {questions.length} to‘g‘ri</p>
              <p className={`mt-3 rounded-md px-3 py-2 text-sm font-semibold ${percent >= pass ? "bg-soft text-accent-foreground" : "bg-danger-soft text-destructive"}`}>
                {percent >= pass ? "Tabriklaymiz, o‘tdingiz!" : `O‘tmadingiz (o‘tish bali ${pass}%)`}
              </p>
              <button onClick={onRestart} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                <RotateCcw className="size-4" /> Qayta ishlash
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Timer className="size-4" /> Qolgan vaqt</div>
              <div className="mt-1 text-4xl font-extrabold tabular-nums">{mm}:{ss}</div>
              <button onClick={finish} className="mt-4 w-full rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">Testni yakunlash</button>
            </>
          )}
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-10 lg:grid-cols-6">
            {questions.map((qq, i) => {
              const a = answers[i];
              let cls = "bg-muted";
              if (a !== undefined) cls = a === qq.correct ? "bg-success text-primary-foreground" : "bg-destructive text-destructive-foreground";
              return (
                <button key={i} onClick={() => setIdx(i)} className={`h-8 rounded-md text-xs font-semibold ${cls} ${i === idx ? "ring-2 ring-ring ring-offset-1" : ""}`}>
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}
