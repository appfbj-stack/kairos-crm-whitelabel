#!/usr/bin/env pwsh
# =============================================================================
# upgrade-chatwoot.ps1
# Atualiza o fork NEXUS IA Atendimento para a ultima tag upstream do Chatwoot
# Preserva: OPERACAO-SAAS.md, .env (local), pnpm-lock.yaml local
# Substitui: todo o working tree pela tag upstream
#
# Uso:
#   pwsh ./bin/upgrade-chatwoot.ps1                 # detecta ultima tag e pergunta
#   pwsh ./bin/upgrade-chatwoot.ps1 -Target v4.18.0 # atualizar para tag especifica
#   pwsh ./bin/upgrade-chatwoot.ps1 -AutoPush       # fazer push automatico pro origin
#   pwsh ./bin/upgrade-chatwoot.ps1 -DryRun         # so mostra o que faria
# =============================================================================

[CmdletBinding()]
param(
  [string]$Target = "",
  [switch]$AutoPush,
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true

# --- paths -------------------------------------------------------------------
$RepoRoot       = (Resolve-Path "$PSScriptRoot/..").Path
$BackupDir      = "$RepoRoot/.upgrade-backups"
$PreserveFiles  = @(
  'OPERACAO-SAAS.md',
  '.env',
  '.env.local'
)
$UpstreamRemote = 'upstream'
$UpstreamUrl    = 'https://github.com/chatwoot/chatwoot.git'
$OriginRemote   = 'origin'
$ScriptStamp    = Get-Date -Format 'yyyyMMdd-HHmmss'

# --- helpers -----------------------------------------------------------------
function Write-Section($msg) { Write-Host "`n=== $msg ===" -ForegroundColor Cyan }
function Write-Ok($msg)     { Write-Host "[ok] $msg" -ForegroundColor Green }
function Write-Warn($msg)   { Write-Host "[warn] $msg" -ForegroundColor Yellow }
function Write-Err($msg)    { Write-Host "[err] $msg" -ForegroundColor Red; exit 1 }

# --- pre-flight --------------------------------------------------------------
Set-Location $RepoRoot

if (-not (Test-Path '.git')) { Write-Err "Nao esta em um repositorio git: $RepoRoot" }

# garantir upstream
$hasUpstream = git remote get-url $UpstreamRemote 2>$null
if (-not $hasUpstream) {
  Write-Warn "Adicionando remote $UpstreamRemote -> $UpstreamUrl"
  if (-not $DryRun) { git remote add $UpstreamRemote $UpstreamUrl | Out-Null }
}

# working tree limpo?
$dirty = git status --porcelain
if ($dirty) {
  Write-Err "Working tree sujo. Commit ou stash antes de atualizar:`n$dirty"
}

# detectar tag alvo
Write-Section "Detectando ultima versao upstream"
if (-not $DryRun) { git fetch --tags --depth 1 $UpstreamRemote 2>&1 | Out-Null }

if ($Target) {
  $tagExists = git tag -l $Target
  if (-not $tagExists) {
    Write-Warn "Tag $Target nao existe localmente. Buscando..."
    if (-not $DryRun) { git fetch $UpstreamRemote tag $Target 2>&1 | Out-Null }
  }
  $TargetTag = $Target
} else {
  $latest = git ls-remote --tags --sort='-version:refname' $UpstreamRemote `
             | Select-String 'refs/tags/v\d+\.\d+\.\d+$' `
             | Select-Object -First 1
  if (-not $latest) { Write-Err "Nenhuma tag vX.Y.Z encontrada no upstream" }
  $TargetTag = ($latest -replace '.*refs/tags/', '').Trim()
}

$currentTag = Get-Content "$RepoRoot/VERSION_CW" -ErrorAction SilentlyContinue
Write-Ok "Versao local : $currentTag"
Write-Ok "Versao alvo  : $TargetTag"

if ($currentTag -eq $TargetTag) {
  Write-Ok "Ja esta na versao mais recente. Nada a fazer."
  exit 0
}

# --- confirmacao -------------------------------------------------------------
Write-Host ""
Write-Host "Vai pular de $currentTag -> $TargetTag" -ForegroundColor Yellow
Write-Host "Arquivos preservados: $($PreserveFiles -join ', ')"
Write-Host ""

if ($DryRun) {
  Write-Ok "DryRun: encerrando sem alteracoes"
  exit 0
}

$confirm = Read-Host "Confirma upgrade? (s/N)"
if ($confirm -ne 's' -and $confirm -ne 'S') {
  Write-Warn "Cancelado pelo usuario"
  exit 0
}

# --- backup ------------------------------------------------------------------
Write-Section "Backup dos arquivos preservados"
if (-not (Test-Path $BackupDir)) { New-Item -ItemType Directory -Path $BackupDir | Out-Null }
$backupTag = "$BackupDir/$ScriptStamp"
New-Item -ItemType Directory -Path $backupTag | Out-Null

foreach ($f in $PreserveFiles) {
  $src = Join-Path $RepoRoot $f
  if (Test-Path $src) {
    Copy-Item $src $backupTag
    Write-Ok "Backup: $f"
  } else {
    Write-Warn "Nao existe (skip): $f"
  }
}

# --- substituicao ------------------------------------------------------------
Write-Section "Substituindo working tree por $TargetTag"
git rm -r --cached . 2>&1 | Out-Null
git clean -fdx 2>&1 | Out-Null
git checkout "$TargetTag" -- .
Write-Ok "Working tree agora em $TargetTag"

# restaurar preservados
Write-Section "Restaurando arquivos preservados"
foreach ($f in $PreserveFiles) {
  $dst = Join-Path $RepoRoot $f
  $src = Join-Path $backupTag $f
  if (Test-Path $src) {
    if (Test-Path $dst) { Remove-Item $dst -Force }
    Copy-Item $src $dst
    Write-Ok "Restaurado: $f"
  }
}

# ajustar versao local (se VERSION_CWCTL tambem mudou, manter o do fork por seguranca)
$newCw    = Get-Content "$RepoRoot/VERSION_CW"
$newCtl   = Get-Content "$RepoRoot/VERSION_CWCTL"
Write-Ok "VERSION_CW    = $newCw"
Write-Ok "VERSION_CWCTL = $newCtl"

# --- commit ------------------------------------------------------------------
Write-Section "Commit"
git add -A
$commitMsg = "chore: upgrade Chatwoot $currentTag -> $newCw (NEXUS IA Atendimento)

- Working tree substituido pela tag upstream $TargetTag
- Arquivos preservados: $($PreserveFiles -join ', ')
- Backup em: $backupTag"
git commit -m $commitMsg 2>&1 | Select-Object -Last 3

# --- push opcional -----------------------------------------------------------
if ($AutoPush) {
  $branch = git branch --show-current
  Write-Section "Push para $OriginRemote/$branch"
  $pushConfirm = Read-Host "Push agora? (s/N)"
  if ($pushConfirm -eq 's' -or $pushConfirm -eq 'S') {
    git push $OriginRemote $branch 2>&1 | Select-Object -Last 5
  } else {
    Write-Warn "Push cancelado. Faca manualmente: git push $OriginRemote $branch"
  }
} else {
  Write-Warn "Push nao feito. Para subir: git push $OriginRemote $(git branch --show-current)"
}

Write-Section "Concluido"
Write-Ok "Repo agora em $newCw (cwctl $newCtl)"
Write-Ok "Proximos passos:"
Write-Host "  cd $RepoRoot"
Write-Host "  bundle install"
Write-Host "  pnpm install"
Write-Host "  cp .env.example .env  # se criou .env novo"
Write-Host "  bundle exec rails db:chatwoot_prepare  # se houver migration nova"
