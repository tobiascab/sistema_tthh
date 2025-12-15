# Frontend - Next.js 15

Sistema de gestión de talento humano desarrollado con Next.js 15, TypeScript y Tailwind CSS.

## 🚀 Tecnologías

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **UI**: shadcn/ui + Radix UI
- **Formularios**: React Hook Form + Zod
- **Data Fetching**: TanStack Query
- **Tablas**: TanStack Table
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Ejecutar en desarrollo
npm run dev
```

## 🔧 Variables de Entorno

Configurar las siguientes variables en `.env`:

```env
BACKEND_URL=http://localhost:8080
KEYCLOAK_URL=http://localhost:8081
KEYCLOAK_REALM=cooperativa-reducto
KEYCLOAK_CLIENT_ID=tthh-frontend
```

## 📁 Estructura del Proyecto

```
frontend-next/
├── app/                    # App Router de Next.js
│   ├── (public)/          # Rutas públicas (login, callback)
│   ├── (private)/         # Rutas protegidas
│   └── api/               # BFF - Backend for Frontend
├── src/
│   ├── components/        # Componentes reutilizables
│   ├── features/          # Módulos por funcionalidad
│   ├── lib/               # Utilidades
│   └── types/             # Tipos TypeScript
```

## 🎨 Paleta de Colores

- **Verde Principal**: #7FD855
- **Verde Secundario**: #5CB85C
- **Amarillo**: #FFD700
- **Gris Claro**: #F8F9FA
- **Gris Medio**: #E9ECEF
- **Gris Oscuro**: #495057

## 🔐 Autenticación

El sistema utiliza Keycloak para autenticación OAuth2/OIDC con los siguientes roles:

- **TTHH**: Acceso completo
- **GERENCIA**: Visualización y aprobaciones
- **AUDITORIA**: Solo lectura
- **COLABORADOR**: Autogestión limitada

## 📝 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Compilar para producción
npm run start        # Ejecutar en producción
npm run lint         # Linter
npm run type-check   # Verificar tipos TypeScript
```
