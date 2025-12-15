#!/bin/bash

# Script de inicio rápido para el Sistema de Gestión de Talento Humano

echo "🚀 Iniciando Sistema de Gestión de Talento Humano - Cooperativa Reducto"
echo "========================================================================="

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instale Docker primero."
    exit 1
fi

# Iniciar infraestructura
echo ""
echo "📦 Paso 1: Iniciando infraestructura (PostgreSQL + Keycloak)..."
cd infra
docker-compose up -d
echo "✅ Infraestructura iniciada"

# Esperar a que los servicios estén listos
echo ""
echo "⏳ Esperando a que los servicios estén listos..."
sleep 15

# Verificar Java
echo ""
echo "📦 Paso 2: Verificando Java 21..."
if ! command -v java &> /dev/null; then
    echo "❌ Java no está instalado. Por favor instale Java 21."
    exit 1
fi

java_version=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
if [ "$java_version" -lt 21 ]; then
    echo "❌ Se requiere Java 21 o superior. Versión actual: $java_version"
    exit 1
fi
echo "✅ Java 21 detectado"

# Iniciar backend
echo ""
echo "📦 Paso 3: Iniciando backend Java..."
cd ../backend-java
./mvnw spring-boot:run &
BACKEND_PID=$!
echo "✅ Backend iniciado (PID: $BACKEND_PID)"

# Verificar Node.js
echo ""
echo "📦 Paso 4: Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instale Node.js 18+."
    exit 1
fi
echo "✅ Node.js detectado"

# Instalar dependencias del frontend
echo ""
echo "📦 Paso 5: Instalando dependencias del frontend..."
cd ../frontend-next
npm install
echo "✅ Dependencias instaladas"

# Iniciar frontend
echo ""
echo "📦 Paso 6: Iniciando frontend Next.js..."
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend iniciado (PID: $FRONTEND_PID)"

echo ""
echo "========================================================================="
echo "✅ Sistema iniciado correctamente!"
echo ""
echo "📍 URLs de acceso:"
echo "   - Frontend:        http://localhost:3000"
echo "   - Backend API:     http://localhost:8080/api/v1"
echo "   - Keycloak:        http://localhost:8081"
echo "   - pgAdmin:         http://localhost:5050"
echo ""
echo "🔐 Credenciales por defecto:"
echo "   - Keycloak Admin:  admin / admin"
echo "   - PostgreSQL:      postgres / postgres"
echo "   - pgAdmin:         admin@coopreducto.com / admin"
echo ""
echo "⚠️  Recuerde configurar Keycloak antes de usar el sistema"
echo "    Ver: infra/README.md para instrucciones"
echo ""
echo "Para detener el sistema, presione Ctrl+C"
echo "========================================================================="

# Mantener el script corriendo
wait
