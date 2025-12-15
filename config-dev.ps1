# ==========================
# CONFIGURACIÓN ENTORNO DEV
# JAVA + MAVEN
# Adaptado a la estructura REAL del usuario
# ==========================

# 🔧 RUTAS DETECTADAS EN TU SISTEMA
$JdkPath   = "C:\SISTEMA_TTHH_V2\jdk-21\jdk-21.0.9+10"
$MavenPath = "C:\SISTEMA_TTHH_V2\maven\apache-maven-3.9.6"

Write-Host "Usando JDK en: $JdkPath"
Write-Host "Usando Maven en: $MavenPath"

# Validar que existan las rutas
if (!(Test-Path $JdkPath)) {
    Write-Host "❌ ERROR: No se encontró el JDK en $JdkPath"
} else {
    Write-Host "✅ JDK encontrado."
}

if (!(Test-Path $MavenPath)) {
    Write-Host "❌ ERROR: No se encontró Maven en $MavenPath"
} else {
    Write-Host "✅ Maven encontrado."
}

# ==========================
# VARIABLES DE ENTORNO USER
# ==========================

Write-Host "`nConfigurando JAVA_HOME, MAVEN_HOME, M2_HOME..."

[System.Environment]::SetEnvironmentVariable("JAVA_HOME",  $JdkPath,   "User")
[System.Environment]::SetEnvironmentVariable("MAVEN_HOME", $MavenPath, "User")
[System.Environment]::SetEnvironmentVariable("M2_HOME",    $MavenPath, "User")

Write-Host "✅ JAVA_HOME, MAVEN_HOME y M2_HOME configurados."

# ==========================
# ACTUALIZAR PATH
# ==========================

Write-Host "`nActualizando PATH de usuario..."

$binPath = Join-Path $MavenPath "bin"
$currentUserPath = [System.Environment]::GetEnvironmentVariable("Path", "User")

if ($currentUserPath -notlike "*$binPath*") {
    $newPath = "$currentUserPath;$binPath"
    [System.Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "✅ Se agregó $binPath al PATH."
} else {
    Write-Host "ℹ El PATH ya incluye $binPath"
}

Write-Host "`n============================"
Write-Host " CONFIGURACIÓN COMPLETA ✔"
Write-Host "============================"
Write-Host "Cierra y abre PowerShell nuevamente."
Write-Host "Luego probá:   mvn -v"
