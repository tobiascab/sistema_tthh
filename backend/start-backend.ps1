Write-Host "Iniciando Backend..." -ForegroundColor Green
cd c:\SISTEMA_TTHH_V2\backend
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
mvn spring-boot:run
