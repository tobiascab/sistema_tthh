# Script para iniciar el Backend Java Spring Boot
# Sistema TTHH - Cooperativa Reducto

Write-Host "========================================" -ForegroundColor Green
Write-Host "  INICIANDO BACKEND - Sistema TTHH" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Verificar Java
Write-Host "Verificando Java..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✓ Java encontrado: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Java no encontrado. Por favor instala Java 21" -ForegroundColor Red
    exit 1
}

# Verificar Maven
Write-Host "Verificando Maven..." -ForegroundColor Yellow
$mavenPath = $null

# Intentar encontrar Maven en ubicaciones comunes
$commonPaths = @(
    "C:\Program Files\Apache\maven\bin\mvn.cmd",
    "C:\Program Files\Maven\bin\mvn.cmd",
    "C:\apache-maven\bin\mvn.cmd",
    "$env:MAVEN_HOME\bin\mvn.cmd"
)

foreach ($path in $commonPaths) {
    if (Test-Path $path) {
        $mavenPath = $path
        break
    }
}

if ($mavenPath) {
    Write-Host "✓ Maven encontrado en: $mavenPath" -ForegroundColor Green
} else {
    Write-Host "✗ Maven no encontrado en ubicaciones comunes" -ForegroundColor Red
    Write-Host "Por favor, ejecuta manualmente desde tu IDE o instala Maven" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternativa: Abre el proyecto en IntelliJ IDEA o Eclipse y ejecuta:" -ForegroundColor Cyan
    Write-Host "  - Main Class: com.coopreducto.tthh.TthhApplication" -ForegroundColor Cyan
    Write-Host "  - Profile: dev" -ForegroundColor Cyan
    exit 1
}

# Compilar proyecto
Write-Host ""
Write-Host "Compilando proyecto..." -ForegroundColor Yellow
Set-Location -Path "c:\SISTEMA_TTHH_V2\backend-java"

& $mavenPath clean install -DskipTests

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Error al compilar el proyecto" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Proyecto compilado exitosamente" -ForegroundColor Green

# Iniciar aplicación
Write-Host ""
Write-Host "Iniciando Spring Boot..." -ForegroundColor Yellow
Write-Host "El backend estará disponible en: http://localhost:8080/api/v1" -ForegroundColor Cyan
Write-Host ""

& $mavenPath spring-boot:run
