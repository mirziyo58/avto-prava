import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Question = {
  id: string;
  category: string;
  text: string;
  sign: string | null;
  image_url: string | null;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: number;
  published: boolean;
  sort_order: number;
};

export type QuizSettings = {
  question_count: number;
  seconds_per_question: number;
  pass_percent: number;
  total_minutes: number;
};

export const CATEGORIES: Record<string, string> = {
  belgilar: "Yo‘l belgilari",
  chorraha: "Chorrahalar",
  ustuvorlik: "Ustuvorlik",
  toxtash: "To‘xtash va to‘xtab turish",
  xavfsiz: "Harakat xavfsizligi",
};

export const DIFFICULTY = ["", "O‘rtacha", "Qiyin", "Juda qiyin"];

export const useQuestions = () =>
  useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("sort_order")
        .limit(5000);
      if (error) throw error;
      return (data ?? []) as unknown as Question[];
    },
    staleTime: 60_000,
  });

export const DEFAULT_SETTINGS: QuizSettings = {
  question_count: 30,
  seconds_per_question: 30,
  pass_percent: 90,
  total_minutes: 30,
};

export const useSettings = () =>
  useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await supabase.from("quiz_settings").select("*").eq("id", 1).maybeSingle();
      return { ...DEFAULT_SETTINGS, ...(data ?? {}) } as QuizSettings;
    },
    staleTime: 60_000,
  });

// Deterministic shuffle so a variant always contains the same questions.
export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed * 9301 + 49297;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const t = a[i] as T;
    a[i] = a[j] as T;
    a[j] = t;
  }
  return a;
}

export function shuffle<T>(arr: T[]): T[] {
  return seededShuffle(arr, Math.floor(Math.random() * 100000));
}

// Local progress (per device)
const MISTAKES = "avtoprava:mistakes";
const RESULTS = "avtoprava:results";

export type ResultEntry = {
  date: string;
  title: string;
  total: number;
  correct: number;
  passed: boolean;
};

export function getMistakes(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(MISTAKES) || "[]");
  } catch {
    return [];
  }
}
export function saveMistakes(wrong: string[], right: string[]) {
  const set = new Set(getMistakes());
  wrong.forEach((id) => set.add(id));
  right.forEach((id) => set.delete(id));
  localStorage.setItem(MISTAKES, JSON.stringify([...set]));
}
export function getResults(): ResultEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RESULTS) || "[]");
  } catch {
    return [];
  }
}
export function addResult(r: ResultEntry) {
  const all = [r, ...getResults()].slice(0, 100);
  localStorage.setItem(RESULTS, JSON.stringify(all));
}
export function clearResults() {
  localStorage.removeItem(RESULTS);
  localStorage.removeItem(MISTAKES);
}
