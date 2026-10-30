import { createFileRoute } from "@tanstack/react-router";
import { Quiz } from "@/components/Quiz";
import { getMistakes, shuffle } from "@/lib/data";

export const Route = createFileRoute("/xatolar-testi")({
  head: () => ({
    meta: [
      { title: "Xatolar ustida ishlash — AvtoPrava" },
      { name: "description", content: "Oldin xato qilgan savollaringizni qayta ishlang." },
      { property: "og:title", content: "Xatolar ustida ishlash — AvtoPrava" },
      { property: "og:description", content: "Oldin xato qilgan savollaringizni qayta ishlang." },
    ],
  }),
  component: () => (
    <Quiz
      config={{
        key: "mistakes",
        title: "Xatolar ustida ishlash",
        pick: (all) => {
          const ids = new Set(getMistakes());
          return shuffle(all.filter((q) => ids.has(q.id))).slice(0, 50);
        },
      }}
    />
  ),
});
