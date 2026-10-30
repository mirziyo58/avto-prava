import { createFileRoute } from "@tanstack/react-router";
import { Quiz } from "@/components/Quiz";
import { shuffle } from "@/lib/data";

export const Route = createFileRoute("/qiyin-savollar")({
  head: () => ({
    meta: [
      { title: "Qiyin savollar — AvtoPrava" },
      { name: "description", content: "Eng qiyin YHQ savollari bilan bilimingizni chuqurroq sinang." },
      { property: "og:title", content: "Qiyin savollar — AvtoPrava" },
      { property: "og:description", content: "Eng qiyin YHQ savollari bilan bilimingizni chuqurroq sinang." },
    ],
  }),
  component: () => (
    <Quiz config={{ key: "hard", title: "Qiyin savollar", pick: (all) => shuffle(all.filter((q) => q.difficulty >= 2)).slice(0, 30) }} />
  ),
});
