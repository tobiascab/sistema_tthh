# Script para iniciar el backend
Write-Host "Iniciando Backend..."
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.9.10-hotspot"
& "C:\Users\ASUS ROG G17\.gemini\antigravity\scratch\sistema_tthh\maven\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run
