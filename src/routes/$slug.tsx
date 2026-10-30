import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { PAGES, useContent } from "@/lib/content";

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => {
    const page = PAGES.find((p) => p.slug === params.slug);
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.page.title} — AvtoPrava` },
          { name: "description", content: loaderData.page.subtitle },
          { property: "og:title", content: `${loaderData.page.title} — AvtoPrava` },
          { property: "og:description", content: loaderData.page.subtitle },
        ]
      : [],
  }),
  component: Page,
});

function Page() {
  const { page } = Route.useLoaderData();
  const c = useContent();
  const body = c(`page:${page.slug}:body`);
  return (
    <div className="max-w-3xl">
      <PageHeader eyebrow="Kutubxona" title={c(`page:${page.slug}:title`)} subtitle={c(`page:${page.slug}:subtitle`)} />
      <article className="space-y-4 rounded-xl border bg-card p-6 text-sm leading-7 lg:p-8">
        {body.split(/\n{2,}/).map((para, i) => (
          <p key={i} className="whitespace-pre-line">{para}</p>
        ))}
      </article>
    </div>
  );
}
