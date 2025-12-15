# 🚀 GUÍA RÁPIDA - INICIAR SISTEMA TTHH

## ✅ Estado Actual

**Frontend**: ✅ CORRIENDO en http://localhost:3000  
**Backend**: ⏳ PENDIENTE DE INICIAR

---

## 📋 Prerrequisitos

### Backend
- ✅ Java 21 instalado
- ⚠️ Maven instalado (o usar IDE)
- ✅ MySQL corriendo en XAMPP (puerto 3306)
- ✅ Base de datos `sistema_tthh` creada

### Frontend
- ✅ Node.js 18+ instalado
- ✅ Dependencias instaladas (`npm install`)
- ✅ Variables de entorno configuradas

---

## 🚀 Opción 1: Iniciar Backend con Script (Recomendado)

```powershell
# Ejecutar script PowerShell
.\start-backend.ps1
```

El script:
1. Verifica Java y Maven
2. Compila el proyecto
3. Inicia Spring Boot
4. Backend disponible en: http://localhost:8080/api/v1

---

## 🚀 Opción 2: Iniciar Backend con Maven Manual

```powershell
# Navegar al backend
cd backend-java

# Compilar (si Maven está en PATH)
mvn clean install -DskipTests

# Iniciar
mvn spring-boot:run
```

---

## 🚀 Opción 3: Iniciar Backend desde IDE (Más Fácil)

### IntelliJ IDEA:
1. Abrir `backend-java` como proyecto Maven
2. Esperar a que descargue dependencias
3. Buscar clase: `TthhApplication.java`
4. Click derecho → Run 'TthhApplication'
5. ✅ Backend iniciará en puerto 8080

### Eclipse:
1. Import → Existing Maven Project
2. Seleccionar `backend-java`
3. Buscar `TthhApplication.java`
4. Run As → Java Application

### VS Code:
1. Abrir carpeta `backend-java`
2. Instalar extensión "Extension Pack for Java"
3. Abrir `TthhApplication.java`
4. Click en "Run" arriba del método main()

---

## 🔍 Verificar que Todo Funciona

### 1. Frontend (Ya está corriendo)
```
✓ URL: http://localhost:3000
✓ Debe mostrar página de login
```

### 2. Backend (Cuando lo inicies)
```
✓ URL: http://localhost:8080/api/v1
✓ Debe responder con JSON
```

### 3. Base de Datos
```
✓ XAMPP MySQL corriendo
✓ phpMyAdmin: http://localhost/phpmyadmin
✓ Base de datos: sistema_tthh
✓ 16 tablas creadas
✓ 8 empleados seed
```

---

## 🧪 Probar el Sistema

### Login con Usuarios Seed:

**Admin TTHH**:
- Email: `admin.tthh@coopreducto.com`
- Password: (configurar en Keycloak)

**Colaborador**:
- Email: `juan.perez@coopreducto.com`
- Password: (configurar en Keycloak)

---

## ⚠️ Troubleshooting

### Error: "Maven no encontrado"
**Solución**: Usar IDE (IntelliJ/Eclipse) o instalar Maven:
- Descargar: https://maven.apache.org/download.cgi
- Agregar a PATH de Windows

### Error: "Puerto 8080 en uso"
**Solución**: 
```powershell
# Ver qué usa el puerto
netstat -ano | findstr :8080

# Matar proceso (reemplazar PID)
taskkill /PID <numero> /F
```

### Error: "Cannot connect to database"
**Solución**:
1. Verificar XAMPP MySQL corriendo
2. Verificar `application.yml`:
   ```yaml
   url: jdbc:mysql://localhost:3306/sistema_tthh
   username: root
   password: 
   ```

### Error: "Keycloak not available"
**Solución**:
```powershell
# Iniciar Keycloak con Docker
cd infra
docker-compose up -d
```

---

## 📊 Puertos Utilizados

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 8080 | http://localhost:8080/api/v1 |
| MySQL | 3306 | localhost:3306 |
| Keycloak | 8081 | http://localhost:8081 |
| phpMyAdmin | 80 | http://localhost/phpmyadmin |

---

## ✅ Checklist de Inicio

- [x] Frontend corriendo (✓ Ya está)
- [ ] Backend corriendo
- [ ] MySQL corriendo (XAMPP)
- [ ] Base de datos creada
- [ ] Seed data importado
- [ ] Keycloak corriendo (opcional para testing)

---

## 🎯 Próximos Pasos

1. **Iniciar Backend** (elegir una opción arriba)
2. **Abrir navegador**: http://localhost:3000
3. **Probar login** con usuarios seed
4. **Explorar dashboards**

---

**¡El sistema está casi listo!** Solo falta iniciar el backend. 🚀
