# ============================================================
#  ПРО•ХИТ — обновление и оптимизация Windows-ноутбука
#  для работы с Claude (запуск: PowerShell ОТ АДМИНИСТРАТОРА)
# ============================================================

$ErrorActionPreference = 'Continue'

function Step($msg) { Write-Host "`n=== $msg ===" -ForegroundColor Cyan }

# --- Проверка прав администратора ---
$id = [Security.Principal.WindowsIdentity]::GetCurrent()
$admin = ([Security.Principal.WindowsPrincipal]$id).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $admin) {
  Write-Host "ЗАПУСТИ ОТ АДМИНИСТРАТОРА: Win+X -> Терминал (Администратор)" -ForegroundColor Red
  exit 1
}

Step "1/6 Обновление всех программ (winget)"
winget upgrade --all --include-unknown --accept-source-agreements --accept-package-agreements

Step "2/6 Питание: максимальная производительность, не засыпать от БП"
powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c 2>$null
if ($LASTEXITCODE -ne 0) {
  # Схемы «Высокая производительность» нет (Modern Standby) — создаём копию
  powercfg /duplicatescheme 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c 2>$null | Out-Null
  powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c 2>$null
}
powercfg /change standby-timeout-ac 0
powercfg /change hibernate-timeout-ac 0
Write-Host "Активная схема:"; powercfg /getactivescheme

Step "3/6 Визуальные эффекты -> быстродействие"
New-Item -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects' -Force | Out-Null
Set-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects' -Name VisualFXSetting -Value 2

Step "4/6 Очистка временных файлов"
$before = (Get-PSDrive C).Free
Remove-Item "$env:TEMP\*"        -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "C:\Windows\Temp\*"  -Recurse -Force -ErrorAction SilentlyContinue
$freed = [math]::Round(((Get-PSDrive C).Free - $before) / 1MB)
Write-Host "Освобождено: $freed МБ"

Step "5/6 Установка / обновление Claude Code"
try { Invoke-RestMethod https://claude.ai/install.ps1 | Invoke-Expression }
catch { Write-Host "Claude Code не установился: $_" -ForegroundColor Yellow }

Step "6/6 Обновления Windows"
Start-Process 'ms-settings:windowsupdate'

Write-Host ""
Write-Host "ГОТОВО! Осталось руками:" -ForegroundColor Green
Write-Host " 1. В открывшемся окне нажми «Проверить наличие обновлений»"
Write-Host " 2. Ctrl+Shift+Esc -> вкладка «Автозагрузка» -> отключи всё лишнее"
Write-Host " 3. Перезагрузи ноутбук"
Write-Host ""
Write-Host "Дальше: открой PowerShell в папке проекта и набери  claude" -ForegroundColor Cyan
