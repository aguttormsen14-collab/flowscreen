# Wayfinding static app

To run the signage/player locally with Live Server, **open VS Code on the repository root** (the folder containing `index.html`).

Live Server must be started from that folder; otherwise routes such as `/admin/login.html` will return "Cannot GET". If you see that error, double-check your workspace root.

This repository is served as plain static files and is safe to deploy to GitHub Pages.

## Supabase setup

Ads are now loaded dynamically from a Supabase Storage bucket. You must provide the
public project URL and anon key at runtime. The easiest way is to edit or create
`supabase-config.js` (ignored by git) with the two lines:

```js
window.SUPABASE_URL = 'https://your-project.supabase.co';
window.SUPABASE_ANON_KEY = 'public-anon-key';
```

or inject them via a `<script>` tag in your HTML. The bucket name is `saxvik-hub` and
files are read from `installs/<installSlug>/assets/ads/`.

The admin dashboard provides drag‑and‑drop upload to that same path.

## New customer setup (1–3 customers)

Use the scaffolding script to create one or more new installs from the
existing reference install:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\new-install.ps1 -InstallSlugs 'city-lade','city-syd'
```

If you also want customer-specific entry URLs (redirect pages):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\new-install.ps1 -InstallSlugs 'city-lade' -CreateEntryPages
```

See `docs/NEW_CUSTOMER_PLAYBOOK.md` for full onboarding (URLs, Supabase Auth,
`user_roles.install_slug`, and RLS policy notes).
