import { createFileRoute } from "@tanstack/react-router";
import { Quiz } from "@/components/Quiz";
import { seededShuffle, shuffle } from "@/lib/data";

type Search = { n?: number | undefined; variant?: number | undefined };

export const Route = createFileRoute("/test")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    n: s["n"] ? Number(s["n"]) : undefined,
    variant: s["variant"] ? Number(s["variant"]) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Test — AvtoPrava" },
      { name: "description", content: "YHQ savollari bo‘yicha onlayn test." },
      { property: "og:title", content: "Test — AvtoPrava" },
      { property: "og:description", content: "YHQ savollari bo‘yicha onlayn test." },
    ],
  }),
  component: Page,
});

function Page() {
  const { n, variant } = Route.useSearch();
  if (variant) {
    return (
      <Quiz
        config={{
          key: `v${variant}`,
          title: `Variant ${variant}`,
          minutes: 25,
          pick: (all) => seededShuffle(all, variant * 7919).slice(0, 20),
        }}
      />
    );
  }
  const count = n ?? 30;
  return <Quiz config={{ key: `n${count}`, title: `${count} ta savol`, pick: (all) => shuffle(all).slice(0, count) }} />;
}
