@echo off
REM Script de inicio rápido para el Sistema de Gestión de Talento Humano (Windows)

echo ========================================================================
echo 🚀 Iniciando Sistema de Gestión de Talento Humano - Cooperativa Reducto
echo ========================================================================
echo.

REM Verificar Docker
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker no está instalado. Por favor instale Docker primero.
    pause
    exit /b 1
)

REM Iniciar infraestructura
echo 📦 Paso 1: Iniciando infraestructura PostgreSQL + Keycloak...
cd infra
docker-compose up -d
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al iniciar la infraestructura
    pause
    exit /b 1
)
echo ✅ Infraestructura iniciada
echo.

REM Esperar a que los servicios estén listos
echo ⏳ Esperando a que los servicios estén listos...
timeout /t 15 /nobreak >nul
echo.

REM Verificar Java
echo 📦 Paso 2: Verificando Java 21...
where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Java no está instalado. Por favor instale Java 21.
    pause
    exit /b 1
)
echo ✅ Java detectado
echo.

REM Iniciar backend
echo 📦 Paso 3: Iniciando backend Java...
cd ..\backend
start "Backend Java" cmd /k "mvnw.cmd spring-boot:run"
echo ✅ Backend iniciado
echo.

REM Verificar Node.js
echo 📦 Paso 4: Verificando Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no está instalado. Por favor instale Node.js 18+.
    pause
    exit /b 1
)
echo ✅ Node.js detectado
echo.

REM Instalar dependencias del frontend
echo 📦 Paso 5: Instalando dependencias del frontend...
cd ..\frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al instalar dependencias
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas
echo.

REM Iniciar frontend
echo 📦 Paso 6: Iniciando frontend Next.js...
start "Frontend Next.js" cmd /k "npm run dev"
echo ✅ Frontend iniciado
echo.

echo ========================================================================
echo ✅ Sistema iniciado correctamente!
echo.
echo 📍 URLs de acceso:
echo    - Frontend:        http://localhost:3000
echo    - Backend API:     http://localhost:8080/api/v1
echo    - Keycloak:        http://localhost:8081
echo    - pgAdmin:         http://localhost:5050
echo.
echo 🔐 Credenciales por defecto:
echo    - Keycloak Admin:  admin / admin
echo    - PostgreSQL:      postgres / postgres
echo    - pgAdmin:         admin@coopreducto.com / admin
echo.
echo ⚠️  Recuerde configurar Keycloak antes de usar el sistema
echo     Ver: infra\README.md para instrucciones
echo.
echo ========================================================================
echo.
pause
