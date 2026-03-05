[CmdletBinding(PositionalBinding = $false)]
param(
  [Parameter(Mandatory = $true)]
  [string[]]$InstallSlugs,

  [string]$BaseInstallSlug = "amfi-steinkjer",

  [switch]$CreateEntryPages,

  [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Normalize-InstallSlug {
  param([string]$Slug)

  if ($null -eq $Slug) {
    return ''
  }

  return $Slug.Trim().ToLowerInvariant()
}

function Test-InstallSlug {
  param([string]$Slug)
  return ($Slug -match '^[a-z0-9-]{2,40}$')
}

function Write-RedirectPage {
  param(
    [string]$FilePath,
    [string]$RelativeTarget,
    [string]$InstallSlug,
    [string]$PageTitle,
    [switch]$DryRunFlag
  )

  $href = "${RelativeTarget}?install=$InstallSlug"

  $template = @'
<!doctype html>
<html lang="no">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>__TITLE__</title>
  <meta http-equiv="refresh" content="0;url=__HREF__" />
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; padding: 24px; }
    .card { max-width: 560px; margin: 48px auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }
    a { color: #0b4f8a; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Videresender...</h1>
    <p>Hvis du ikke blir sendt videre automatisk, bruk lenken under.</p>
    <p><a href="__HREF__">Fortsett</a></p>
  </div>

  <script>
    (function () {
      var target = "__TARGET__";
      var slug = "__SLUG__";
      window.location.replace(target + '?install=' + encodeURIComponent(slug));
    })();
  </script>
</body>
</html>
'@

  $content = $template.Replace('__TITLE__', $PageTitle)
  $content = $content.Replace('__HREF__', $href)
  $content = $content.Replace('__TARGET__', $RelativeTarget)
  $content = $content.Replace('__SLUG__', $InstallSlug)

  if ($DryRunFlag) {
    Write-Host "[DRY-RUN] Oppretter redirect-side: $FilePath -> $href" -ForegroundColor Yellow
    return
  }

  $parent = Split-Path -Parent $FilePath
  if (-not (Test-Path $parent -PathType Container)) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
  }

  Set-Content -Path $FilePath -Value $content -Encoding UTF8
  Write-Host "[OK] Opprettet redirect-side: $FilePath" -ForegroundColor Green
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$installsRoot = Join-Path $repoRoot 'installs'
$normalizedBaseInstallSlug = Normalize-InstallSlug -Slug $BaseInstallSlug
$baseInstallPath = Join-Path $installsRoot $normalizedBaseInstallSlug

if (-not (Test-Path $installsRoot -PathType Container)) {
  throw "Fant ikke installs-mappen: $installsRoot"
}

if (-not (Test-Path $baseInstallPath -PathType Container)) {
  throw "Fant ikke base-installasjon '$normalizedBaseInstallSlug' i: $installsRoot"
}

$normalizedSlugs = New-Object System.Collections.Generic.List[string]

$slugCandidates = New-Object System.Collections.Generic.List[string]

foreach ($entry in $InstallSlugs) {
  if ($null -eq $entry) {
    continue
  }

  $parts = $entry -split '[,;\s]+'
  foreach ($part in $parts) {
    $candidate = Normalize-InstallSlug -Slug $part
    if ($candidate.Length -gt 0) {
      $slugCandidates.Add($candidate)
    }
  }
}

if ($slugCandidates.Count -eq 0) {
  throw 'Ingen installSlugs oppgitt.'
}

foreach ($slug in $slugCandidates) {

  if (-not (Test-InstallSlug -Slug $slug)) {
    throw "Ugyldig installSlug '$slug'. Bruk sma bokstaver/tall/bindestrek (2-40 tegn)."
  }

  if ($slug -eq $normalizedBaseInstallSlug) {
    throw "InstallSlug '$slug' er samme som base slug '$normalizedBaseInstallSlug'. Velg et nytt kundenavn."
  }

  if (-not $normalizedSlugs.Contains($slug)) {
    $normalizedSlugs.Add($slug)
  }
}

if ($normalizedSlugs.Count -eq 0) {
  throw 'Ingen gyldige installSlugs oppgitt.'
}

Write-Host "Base installasjon: $normalizedBaseInstallSlug" -ForegroundColor Cyan
Write-Host "Kunder som klargjores: $($normalizedSlugs -join ', ')" -ForegroundColor Cyan

foreach ($slug in $normalizedSlugs) {
  $targetInstallPath = Join-Path $installsRoot $slug

  if (Test-Path $targetInstallPath -PathType Container) {
    Write-Host "[INFO] Hopper over kopi: installasjon finnes allerede -> installs/$slug" -ForegroundColor DarkYellow
  }
  else {
    if ($DryRun) {
      Write-Host "[DRY-RUN] Kopierer installs/$normalizedBaseInstallSlug -> installs/$slug" -ForegroundColor Yellow
    }
    else {
      Copy-Item -Path $baseInstallPath -Destination $targetInstallPath -Recurse -Force
      Write-Host "[OK] Opprettet installasjon: installs/$slug" -ForegroundColor Green
    }
  }

  $settingsPath = Join-Path $targetInstallPath 'assets\settings.json'
  if (-not (Test-Path $settingsPath -PathType Leaf)) {
    $settingsPayload = @{
      weather = @{
        enabled = $false
        location = 'Trondheim, NO'
      }
      screenLayout = @{
        mode = 'default'
      }
    }

    $settingsJson = $settingsPayload | ConvertTo-Json -Depth 4

    if ($DryRun) {
      Write-Host "[DRY-RUN] Oppretter manglende settings-fil: installs/$slug/assets/settings.json" -ForegroundColor Yellow
    }
    else {
      $settingsDir = Split-Path -Parent $settingsPath
      if (-not (Test-Path $settingsDir -PathType Container)) {
        New-Item -ItemType Directory -Path $settingsDir -Force | Out-Null
      }

      Set-Content -Path $settingsPath -Value $settingsJson -Encoding UTF8
      Write-Host "[OK] Opprettet settings: installs/$slug/assets/settings.json" -ForegroundColor Green
    }
  }

  if ($CreateEntryPages) {
    $customerRoot = Join-Path $repoRoot (Join-Path 'customers' $slug)
    $playerRedirectPath = Join-Path $customerRoot 'index.html'
    $adminRedirectPath = Join-Path $customerRoot 'admin.html'

    Write-RedirectPage -FilePath $playerRedirectPath -RelativeTarget '../../index.html' -InstallSlug $slug -PageTitle "Wayfinding - $slug" -DryRunFlag:$DryRun
    Write-RedirectPage -FilePath $adminRedirectPath -RelativeTarget '../../admin/login.html' -InstallSlug $slug -PageTitle "Wayfinding Admin - $slug" -DryRunFlag:$DryRun
  }

  Write-Host ''
  Write-Host "URL-er for ${slug}:" -ForegroundColor Cyan
  Write-Host "  Player: /?install=$slug"
  Write-Host "  Admin : /admin/login.html?install=$slug"
  if ($CreateEntryPages) {
    Write-Host "  Egen URL (player): /customers/$slug/"
    Write-Host "  Egen URL (admin) : /customers/$slug/admin.html"
  }
  Write-Host ''
}

Write-Host 'Ferdig. Neste steg: opprett bruker i Supabase Auth og koble user_roles.install_slug til riktig slug.' -ForegroundColor Green
