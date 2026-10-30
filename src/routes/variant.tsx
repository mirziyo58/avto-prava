import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { useContent } from "@/lib/content";

export const Route = createFileRoute("/variant")({
  head: () => ({
    meta: [
      { title: "Variantlar — AvtoPrava" },
      { name: "description", content: "Har birida 20 ta savoldan iborat bepul YHQ variantlari." },
      { property: "og:title", content: "Variantlar — AvtoPrava" },
      { property: "og:description", content: "Har birida 20 ta savoldan iborat bepul YHQ variantlari." },
    ],
  }),
  component: Page,
});

function Page() {
  const c = useContent();
  const total = Math.max(1, parseInt(c("stat_variants")) || 64);
  return (
    <div>
      <PageHeader eyebrow="Tayyorgarlik" title="Variantni tanlang" subtitle={`${total} ta variant, har birida 20 ta savol`} />
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
        {Array.from({ length: total }, (_, i) => i + 1).map((v) => (
          <Link key={v} to="/test" search={{ variant: v }} className="grid aspect-square place-items-center rounded-lg border bg-card text-lg font-bold transition-colors hover:border-primary hover:bg-soft hover:text-primary">
            {v}
          </Link>
        ))}
      </div>
    </div>
  );
}
