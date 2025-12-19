@echo off
echo ====================================================
echo 🧹 Limpiando cache del Frontend...
echo ====================================================
echo.
echo ⚠️  Por favor, asegúrate de haber CERRADO la ventana
echo     del frontend anterior (donde corre npm run dev)
echo.
pause

cd frontend
if exist .next (
    echo 🗑️  Eliminando cache antigua...
    rmdir /s /q .next
)

echo 📦 Instalando/Verificando dependencias...
call npm install

echo 🚀 Iniciando Frontend limpio...
echo.
npm run dev
