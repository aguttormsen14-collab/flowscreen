# Ny kunde playbook (1–3 kunder)

Denne løsningen trenger **ikke** egen kodebase per kunde.
Du kjører én app, og skiller kunder via `installSlug`.

## Trenger kunden egen "nettside"?

Kort svar: **nei, ikke teknisk**.

Du har to valg:

1. **Samme nettside + URL med slug (anbefalt for 1–3 kunder)**
   - Player: `https://<domene>/?install=<slug>`
   - Admin: `https://<domene>/admin/login.html?install=<slug>`

2. **Egen kunde-URL (samme app bak kulissene)**
   - Opprett redirect-sider per kunde, f.eks.:
   - `https://<domene>/customers/<slug>/`
   - `https://<domene>/customers/<slug>/admin.html`

Begge alternativene viser kundens egne data fordi appen leser fra `installs/<slug>/...`.

---

## 1) Opprett struktur for 1–3 kunder

Kjør fra repo-root i PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\new-install.ps1 -InstallSlugs 'city-lade','city-syd','city-nord'
```

Med egne kunde-URL-er (redirect-sider):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\new-install.ps1 -InstallSlugs 'city-lade','city-syd' -CreateEntryPages
```

Trygg test uten å skrive filer:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\new-install.ps1 -InstallSlugs 'city-lade' -CreateEntryPages -DryRun
```

Scriptet:
- kopierer `installs/amfi-steinkjer` til nye slugs
- sikrer `assets/settings.json`
- (valgfritt) lager `customers/<slug>/index.html` + `customers/<slug>/admin.html`

---

## 2) Koble admin-bruker til riktig kunde (Supabase)

1. Opprett bruker i Supabase Auth (Dashboard → Authentication → Users).
2. Finn `user_id` for brukeren.
3. Legg inn rad i `user_roles` med samme `install_slug`.

Eksempel SQL (tilpass om tabellen har flere obligatoriske felt):

```sql
select id, email from auth.users where email = 'kunde-admin@eksempel.no';

insert into user_roles (user_id, install_slug)
values ('<USER_UUID>', 'city-lade');
```

Hvis brukeren allerede finnes i `user_roles`, oppdater raden med riktig `install_slug`.

---

## 3) Storage/RLS for ny slug

- Sørg for at policyene tillater path under `installs/<slug>/...`.
- Hvis policyene er hardkodet til `amfi-steinkjer`, lag en variant for ny slug.
- Filen `SUPABASE_RLS_SETUP.sql` kan brukes som utgangspunkt.

---

## 4) Rask funksjonstest

1. Åpne admin: `/admin/login.html?install=<slug>`
2. Logg inn med kundebruker
3. Last opp én fil i Reklamestyring
4. Åpne player: `/?install=<slug>`
5. Verifiser at riktig innhold vises

---

## Tips for "egen nettside" i praksis

For 1–3 kunder er dette ofte nok:
- Behold én deploy
- Del kundespesifikk URL (`?install=<slug>` eller `/customers/<slug>/`)

Hvis kunden krever eget domene senere:
- Pek subdomene til samme hosting
- La subdomenet route til riktig slug (redirect/rewrite)
- Du trenger fortsatt ikke egen app per kunde
