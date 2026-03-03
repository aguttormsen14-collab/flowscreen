# Strukturplan – Wayfinding (Mars 2026)

## 1) Formål
Denne planen skal gi et tydelig gjennomføringsløp for å:
- stabilisere dagens løsning
- rydde arkitektur og dokumentasjon
- sikre trygg drift og forutsigbar videreutvikling

Planen er laget for eksisterende kodebase uten full omskriving.

---

## 2) Nå-situasjon (kort)

### Produktstatus
- Statisk player fungerer og er kjernen i leveransen.
- Statisk admin-dashboard fungerer med:
  - reklamehåndtering
  - skjermeditor (hotspots + pulses)
  - autosave/fallback
- Dashboard-visning er strukturert i moduler (Dashboard / Skjermstyring / Reklamestyring).

### Teknisk status
- Supabase er integrert for auth/storage.
- Storage-policy arbeid er gjennomført for screens.json-flyt.
- Det finnes to admin-spor i repo:
  1. Statisk admin i root-prosjektet
  2. Next.js-app i saxvik-hub/

### Hovedutfordring nå
- Struktur og dokumentasjon må samles rundt ett primærspor.
- Noen dokumenter er ikke helt synket med faktisk kode og praksis.

---

## 3) Målbilde (MVP)
MVP for neste periode:
1. Ett tydelig primærspor for admin (anbefalt: statisk admin, siden dette er i aktiv bruk nå).
2. Oppdatert og konsistent dokumentasjon.
3. Stabil og testet lagringsflyt for skjermeditor + ads.
4. Klart releasegrunnlag med sjekkliste (go/no-go).

Ikke-mål i denne fasen:
- full migrering til ny plattform
- større redesign av player state-machine
- ny funksjonalitet utover stabilisering/struktur

---

## 4) Beslutningspunkter (må avklares tidlig)

## BP-1: Primær admin-plattform
Valg:
- A: Statisk admin som primær (anbefalt nå)
- B: Next.js admin som primær

Konsekvens:
- Valgt primærspor får all videre funksjonsutvikling.
- Sekundærspor markeres som pilot/legacy og fryses.

## BP-2: Konfig-strategi
Valg:
- A: Streng runtime-injeksjon av nøkler
- B: Lokal dev-fallback + deploy secrets

Konsekvens:
- Må være entydig dokumentert for drift og onboarding.

## BP-3: Produksjonssti PWA/base-path
- Verifisere manifest/scope/start_url mot faktisk deploy-path.

---

## 5) Faseplan (4 uker)

## Fase 1 – Stabilisering og opprydding (Uke 1)
Mål: Fjerne uklarhet og få ett kontrollert grunnlag.

Leveranser:
- Primærspor besluttet og dokumentert.
- Sekundærspor merket tydelig i docs.
- Dokumenter synket med faktisk løsning:
  - docs/ADMIN_SETUP.md
  - docs/CHANGES_SUMMARY.md
  - docs/README.md
  - STATUS_PC_BYTTE.md
- Oppdatert driftsnotat for policy/oppsett/testflyt.

Akseptkriterier:
- Ingen motstrid mellom oppsettguide og faktisk innlogging/lagring.
- Ny utvikler kan sette opp lokalt uten ad hoc-avklaringer.

## Fase 2 – Modul- og data-struktur (Uke 2)
Mål: Tydelig ansvar per modul og dataflyt.

Leveranser:
- Modulkontrakter definert:
  - Dashboard (oversikt/demo)
  - Skjermstyring
  - Reklamestyring
  - Systemstatus
- Datakontrakter beskrevet:
  - screens.json
  - playlist.json
  - ads asset paths
- Ryddig ansvarskart for sentrale filer (hvem gjør hva).

Akseptkriterier:
- Hver modul har tydelig input/output og lagringspunkt.
- Endringer i én modul gir minimal sideeffekt i andre.

## Fase 3 – Test og release-klarhet (Uke 3)
Mål: Verifisere stabilitet før videre funksjoner.

Leveranser:
- Kjørbar testpakke for:
  - auth-flyt
  - storage save/load
  - hotspot/pulse autosave
  - fallback ved storage-feil
  - ads/playlist publisering
- Feilloggsjekk + regressjonssjekk.
- Oppdatert release-checklist med go/no-go.

Akseptkriterier:
- Kritiske flyter består uten manuelle workarounds.
- Kjente feil er dokumentert med alvorlighetsgrad.

## Fase 4 – Plan for neste iterasjon (Uke 4)
Mål: Forberede kontrollert videreutvikling.

Leveranser:
- Prioritert backlog for neste sprint.
- Beslutning om eventuell migrering av admin-spor.
- Estimat og ressursplan per hovedområde.

Akseptkriterier:
- Team har godkjent prioriteringsliste og tidslinje.
- Neste sprint kan starte uten ny kartleggingsrunde.

---

## 6) Prioritert backlog (P1–P3)

## P1 – Kritisk
- Velg primær admin-plattform.
- Synk dokumentasjon med faktisk auth/storage-flyt.
- Verifiser policy + lagringsflyt i produksjonsnær test.
- Rydd konfig-strategi (unngå tvetydig fallback-atferd).

## P2 – Viktig
- Modulkontrakter + data-kontrakter i docs.
- Standardisere testsekvens for demo og release.
- Avklare manifest/base-path og PWA-sti.

## P3 – Nyttig
- Rydde legacy-notater og duplikatguider.
- Forbedre intern driftspakke (hurtig-feilsøking).

---

## 7) Roller og ansvar (forslag)
- Produkt/Prosjekt: prioritering, beslutningspunkter, demo-scope.
- Tech Lead: arkitekturvalg, kodeansvar, releasekriterier.
- QA/Drift: testgjennomføring, miljøvalidering, deploy-sjekk.

Hvis teamet er lite, kan én person dekke flere roller, men ansvar må fortsatt navngis.

---

## 8) Risiko og tiltak

1. To parallelle admin-spor skaper tvil
- Tiltak: fastslå primærspor i uke 1.

2. Dokumentasjon avviker fra kode
- Tiltak: “docs sync” som egen obligatorisk leveranse.

3. Miljø/konfig-feil stopper demo
- Tiltak: standard preflight-sjekk før demo/release.

4. Uferdig test før endringer videreføres
- Tiltak: ingen ny feature før P1-test er grønn.

---

## 9) Milepæler og statusformat

## Milepæler
- M1 (slutt uke 1): Struktur besluttet, docs synket
- M2 (slutt uke 2): Modul- og data-kontrakter ferdig
- M3 (slutt uke 3): Testpakke grønn, release-checklist klar
- M4 (slutt uke 4): Neste sprintplan godkjent

## Ukentlig statusformat
- Hva ble levert
- Hva gjenstår
- Risiko/blokkere
- Beslutninger som trengs
- Neste ukes fokus

---

## 10) Konkret neste steg (denne uka)
1. Bekreft BP-1: velg primær admin-plattform.
2. Kjør dokument-sync på oppsett/auth/storage.
3. Kjør komplett test av lagring + autosave + ads.
4. Merk eventuelle blokkere med eier og frist.

Når disse fire er gjort, er prosjektet klart for kontrollert fase 2.
