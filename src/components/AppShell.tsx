import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Home, Play, LayoutGrid, BookOpen, User, Book, CircleHelp, MessageCircle, ArrowUpRight, ArrowRight, Menu, X, ChevronRight,
} from "lucide-react";
import { useContent } from "@/lib/content";

const NAV1 = [
  { to: "/", label: "Bosh sahifa", icon: Home },
  { to: "/test-ishlash", label: "Test ishlash", icon: Play },
  { to: "/variant", label: "Variantlar", icon: LayoutGrid },
  { to: "/bolimlar", label: "Savollar banki", icon: BookOpen },
  { to: "/natijalar", label: "Natijalarim", icon: User },
] as const;
const NAV2 = [
  { slug: "darslik", label: "Darslik", icon: Book },
  { slug: "qollanma", label: "Qo‘llanma", icon: CircleHelp },
] as const;

const TITLES: Record<string, string> = {
  "/": "Bosh sahifa", "/test-ishlash": "Test ishlash", "/variant": "Variantlar", "/bolimlar": "Savollar banki",
  "/natijalar": "Natijalarim", "/darslik": "Darslik", "/qollanma": "Qo‘llanma", "/admin": "Admin panel",
  "/test": "Test", "/real-imtihon": "Real imtihon", "/qiyin-savollar": "Qiyin savollar", "/xatolar-testi": "Xatolar ustida ishlash",
  "/prava-olish": "Prava olish", "/avtoimtihon-2026": "Imtihon qoidalari", "/e-avtomaktab": "E-avtomaktab",
};

export function AppShell({ children }: { children: ReactNode }) {
  const c = useContent();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const NavItem = ({ to, slug, label, icon: Icon }: { to?: string; slug?: string; label: string; icon: typeof Home }) => {
    const href = to ?? `/${slug}`;
    const active = path === href;
    const linkProps = slug ? ({ to: "/$slug", params: { slug } } as const) : ({ to: to as "/" });
    return (
      <Link
        {...linkProps}
        onClick={() => setOpen(false)}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-muted"
        }`}
      >
        <Icon className="size-4" />
        <span className="flex-1">{label}</span>
        {active && <span className="size-1.5 rounded-full bg-primary" />}
      </Link>
    );
  };

  const sidebar = (
    <div className="flex h-full flex-col p-5">
      <Link to="/" className="mb-8 flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-lg bg-primary text-lg font-extrabold text-primary-foreground">
          {c("brand_name").charAt(0)}
        </div>
        <div>
          <div className="text-lg font-bold leading-tight">{c("brand_name")}</div>
          <div className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">{c("brand_tagline")}</div>
        </div>
      </Link>
      <div className="eyebrow mb-2 px-3 !text-muted-foreground">Tayyorgarlik</div>
      <nav className="space-y-1">{NAV1.map((n) => <NavItem key={n.to} {...n} />)}</nav>
      <div className="eyebrow mb-2 mt-8 px-3 !text-muted-foreground">Kutubxona</div>
      <nav className="space-y-1">{NAV2.map((n) => <NavItem key={n.slug} {...n} />)}</nav>
      <div className="mt-auto border-t pt-4">
        <a href={c("telegram_url")} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
          <MessageCircle className="size-4 text-info" />
          <span className="flex-1">{c("telegram_label")}</span>
          <ArrowUpRight className="size-4 text-muted-foreground" />
        </a>
        <p className="mt-3 px-3 text-xs text-muted-foreground">{c("footer")}</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r bg-sidebar lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-sidebar">{sidebar}</aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card px-4 lg:h-20 lg:px-8">
          <button className="rounded-md p-2 hover:bg-muted lg:hidden" onClick={() => setOpen(true)} aria-label="Menyu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{c("brand_name")}</span>
            <ChevronRight className="hidden size-4 text-muted-foreground sm:inline" />
            <span className="font-medium">{TITLES[path] ?? "Sahifa"}</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
              <span className="size-1.5 rounded-full bg-primary" />
              {c("top_badge")}
            </span>
            <Link to="/admin" className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted">
              Kirish <ArrowRight className="size-4" />
            </Link>
          </div>
        </header>
        <main className="flex-1 px-4 py-8 lg:px-8 lg:py-10">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, subtitle, right }: { eyebrow?: string; title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
