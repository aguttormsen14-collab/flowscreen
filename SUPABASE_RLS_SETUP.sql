-- ============================================
-- Supabase Storage policies for screens.json
-- Project: wayfinding / install: amfi-steinkjer
-- Date: 2026-03-03
-- ============================================

-- Run this in Supabase SQL Editor.
-- This creates strict policies for ONE file only:
-- installs/amfi-steinkjer/config/screens.json

-- NOTE:
-- Do NOT run "alter table storage.objects enable row level security" here.
-- In many Supabase projects you are not owner of storage.objects, which gives:
-- ERROR 42501: must be owner of table objects
--
-- If needed, enable RLS from Supabase UI:
-- Authentication/Database settings or Storage policies UI (project-level controls).

-- --------------------------------------------
-- 1) Clean old policies (safe re-run)
-- --------------------------------------------
drop policy if exists "screens_select_amfi" on storage.objects;
drop policy if exists "screens_insert_amfi" on storage.objects;
drop policy if exists "screens_update_amfi" on storage.objects;

-- --------------------------------------------
-- 2) SELECT policy (read)
-- --------------------------------------------
create policy "screens_select_amfi"
on storage.objects
for select
to authenticated
using (
	bucket_id = 'saxvik-hub'
	and name = 'installs/amfi-steinkjer/config/screens.json'
);

-- --------------------------------------------
-- 3) INSERT policy (create)
-- --------------------------------------------
create policy "screens_insert_amfi"
on storage.objects
for insert
to authenticated
with check (
	bucket_id = 'saxvik-hub'
	and name = 'installs/amfi-steinkjer/config/screens.json'
);

-- --------------------------------------------
-- 4) UPDATE policy (modify)
-- --------------------------------------------
create policy "screens_update_amfi"
on storage.objects
for update
to authenticated
using (
	bucket_id = 'saxvik-hub'
	and name = 'installs/amfi-steinkjer/config/screens.json'
)
with check (
	bucket_id = 'saxvik-hub'
	and name = 'installs/amfi-steinkjer/config/screens.json'
);

-- ============================================
-- Optional: broader policy for all files under install
-- Uncomment if you need more than screens.json:
-- and name like 'installs/amfi-steinkjer/%'
-- ============================================
