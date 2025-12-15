Set-Location $PSScriptRoot\..\..
Write-Host "--- STATUS ---" -ForegroundColor Cyan
git status
git add -A
$status = git status --porcelain
if (-not $status) {
    Write-Host "Sin cambios" -ForegroundColor Yellow
    exit
}
$date = Get-Date -Format "yyyy-MM-dd HH:mm"
$msg = "chore: sync $date"
git commit -m "$msg"
git push origin main
