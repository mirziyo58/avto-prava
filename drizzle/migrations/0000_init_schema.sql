create type public.app_role as enum ('admin','user');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());
create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists(select 1 from public.user_roles where user_id=_user_id and role=_role) $$;

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'umumiy',
  text text not null,
  sign text,
  image_url text,
  options jsonb not null default '[]'::jsonb,
  correct int not null default 0,
  explanation text not null default '',
  difficulty int not null default 1,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.questions to anon, authenticated;
grant insert, update, delete on public.questions to authenticated;
grant all on public.questions to service_role;
alter table public.questions enable row level security;
create policy "public read" on public.questions for select using (published or public.has_role(auth.uid(),'admin'));
create policy "admin write" on public.questions for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.quiz_settings (id int primary key default 1, question_count int not null default 30, seconds_per_question int not null default 30, pass_percent int not null default 90, updated_at timestamptz not null default now());
grant select on public.quiz_settings to anon, authenticated;
grant insert, update on public.quiz_settings to authenticated;
grant all on public.quiz_settings to service_role;
alter table public.quiz_settings enable row level security;
create policy "public read" on public.quiz_settings for select using (true);
create policy "admin write" on public.quiz_settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
insert into public.quiz_settings (id) values (1);

create table public.site_content (key text primary key, value text not null default '', updated_at timestamptz not null default now());
grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;
grant all on public.site_content to service_role;
alter table public.site_content enable row level security;
create policy "public read" on public.site_content for select using (true);
create policy "admin write" on public.site_content for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));