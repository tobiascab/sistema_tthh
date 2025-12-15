Set-Location $PSScriptRoot\..\..
git config pull.rebase false
git config core.autocrlf true
Write-Host "--- STATUS INICIAL ---" -ForegroundColor Cyan
git status
Write-Host "--- PULLING MAIN ---" -ForegroundColor Cyan
git pull origin main
Write-Host "--- STATUS FINAL ---" -ForegroundColor Cyan
git status
