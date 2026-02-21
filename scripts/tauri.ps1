$ErrorActionPreference = "Stop"

function Add-ToPathIfExists {
  param([string]$CandidatePath)
  if ([string]::IsNullOrWhiteSpace($CandidatePath)) { return }
  if (Test-Path $CandidatePath) {
    if (-not ($env:Path -split ";" | Where-Object { $_ -eq $CandidatePath })) {
      $env:Path = "$CandidatePath;$env:Path"
    }
  }
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

# Meson/Ninja installed via winget (Meson package ships ninja.exe too).
Add-ToPathIfExists "C:\Program Files\Meson"

# pkg-config-lite path used by winget.
$pkgConfigBin = Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Packages\bloodrock.pkg-config-lite_Microsoft.Winget.Source_8wekyb3d8bbwe\pkg-config-lite-0.28-1\bin"
Add-ToPathIfExists $pkgConfigBin

# Local NASM fallback (downloaded once and committed to local tools cache).
$nasmDir = Join-Path $repoRoot "tools\nasm\nasm-3.01"
$nasmExe = Join-Path $nasmDir "nasm.exe"
if (-not (Test-Path $nasmExe)) {
  New-Item -ItemType Directory -Path (Join-Path $repoRoot "tools\nasm") -Force | Out-Null
  $zipPath = Join-Path $repoRoot "tools\nasm\nasm.zip"
  Invoke-WebRequest -Uri "https://www.nasm.us/pub/nasm/releasebuilds/3.01/win64/nasm-3.01-win64.zip" -OutFile $zipPath
  Expand-Archive -Path $zipPath -DestinationPath (Join-Path $repoRoot "tools\nasm") -Force
}
Add-ToPathIfExists $nasmDir

# Forward arguments to tauri CLI. Ex: npm run tauri build
npx tauri @args
