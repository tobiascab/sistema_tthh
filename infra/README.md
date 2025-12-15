# Infraestructura - Docker Compose

Configuración de infraestructura para el Sistema de Gestión de Talento Humano.

## 🐳 Servicios Incluidos

### PostgreSQL
- **Puerto**: 5432
- **Base de datos**: tthh_db
- **Usuario**: postgres
- **Contraseña**: postgres

### Keycloak
- **Puerto**: 8081
- **Admin Console**: http://localhost:8081
- **Usuario Admin**: admin
- **Contraseña Admin**: admin
- **Realm**: cooperativa-reducto (debe configurarse manualmente)

### pgAdmin (Opcional)
- **Puerto**: 5050
- **URL**: http://localhost:5050
- **Email**: admin@coopreducto.com
- **Contraseña**: admin

## 🚀 Uso

### Iniciar todos los servicios

```bash
docker-compose up -d
```

### Ver logs

```bash
docker-compose logs -f
```

### Detener servicios

```bash
docker-compose down
```

### Detener y eliminar volúmenes

```bash
docker-compose down -v
```

## ⚙️ Configuración de Keycloak

1. Acceder a http://localhost:8081
2. Iniciar sesión con admin/admin
3. Crear un nuevo Realm llamado "cooperativa-reducto"
4. Crear un cliente "tthh-frontend":
   - Client Protocol: openid-connect
   - Access Type: public
   - Valid Redirect URIs: http://localhost:3000/*
   - Web Origins: http://localhost:3000

5. Crear roles:
   - TTHH
   - GERENCIA
   - AUDITORIA
   - COLABORADOR

6. Crear usuarios de prueba y asignar roles

## 🔧 Conexión desde Backend

El backend Java se conectará automáticamente usando la configuración en `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/tthh_db
    username: postgres
    password: postgres
```

## 🔧 Conexión desde pgAdmin

1. Acceder a http://localhost:5050
2. Agregar nuevo servidor:
   - Name: TTHH Database
   - Host: postgres (nombre del contenedor)
   - Port: 5432
   - Username: postgres
   - Password: postgres

## 📝 Notas

- Los datos se persisten en volúmenes de Docker
- Para resetear la base de datos, usar `docker-compose down -v`
- Keycloak usa la misma instancia de PostgreSQL
