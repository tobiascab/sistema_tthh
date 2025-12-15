@echo off
echo ========================================
echo   SINCRONIZANDO PROYECTO MAVEN
echo ========================================
echo.
echo Este script limpiara y reconstruira el proyecto
echo.
pause

echo.
echo [1/4] Limpiando proyecto...
call mvn clean
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Fallo al limpiar el proyecto
    pause
    exit /b 1
)

echo.
echo [2/4] Resolviendo dependencias...
call mvn dependency:resolve
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Fallo al resolver dependencias
    pause
    exit /b 1
)

echo.
echo [3/4] Compilando proyecto...
call mvn compile
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Fallo al compilar
    pause
    exit /b 1
)

echo.
echo [4/4] Instalando en repositorio local...
call mvn install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Fallo al instalar
    pause
    exit /b 1
)

echo.
echo ========================================
echo   COMPILACION EXITOSA
echo ========================================
echo.
echo El proyecto compilo correctamente.
echo.
echo PROXIMOS PASOS:
echo 1. Si usas IntelliJ: File -^> Reload All Maven Projects
echo 2. Si usas Eclipse: Proyecto -^> Maven -^> Update Project
echo 3. Si usas VS Code: Ctrl+Shift+P -^> Java: Clean Java Language Server Workspace
echo.
pause
