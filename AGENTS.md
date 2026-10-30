<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- All editable site texts live in `site_content` (key/value) with defaults in `src/lib/content.ts`; add new editable text by adding a field there so the admin panel picks it up automatically.
- Admin login maps a bare username to `<username>@avtoprava.uz` for auth; admin rights come only from `user_roles` (role `admin`), checked by RLS via `has_role`.
- Quiz progress (results, mistakes) is stored per device in localStorage — no visitor accounts.
- Library pages (darslik, qollanma, etc.) are served by the `/$slug` route from the `PAGES` list; static routes take precedence.
- Question images are URLs (public storage buckets are blocked in this workspace).
