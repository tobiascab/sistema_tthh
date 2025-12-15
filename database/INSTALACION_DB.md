# 🗄️ GUÍA DE INSTALACIÓN - BASE DE DATOS

## Configuración de XAMPP y MySQL para Sistema TTHH

---

## 📋 Prerrequisitos

- ✅ XAMPP instalado (Apache + MySQL)
- ✅ phpMyAdmin accesible
- ✅ Java 21 instalado
- ✅ Maven instalado

---

## 🚀 Paso 1: Iniciar XAMPP

1. Abrir **XAMPP Control Panel**
2. Iniciar **Apache** (puerto 80)
3. Iniciar **MySQL** (puerto 3306)
4. Verificar que ambos servicios estén en verde

### Solución de Problemas Comunes:

**Puerto 8080 en uso (Tomcat):**
- El error que ves es porque Tomcat está intentando usar el puerto 8080
- Solución: Detener Tomcat en XAMPP o cambiar el puerto de Spring Boot

**Puerto 3306 en uso:**
- Verificar que no haya otra instancia de MySQL corriendo
- Usar `netstat -ano | findstr :3306` para verificar

---

## 🗄️ Paso 2: Crear Base de Datos

### Opción A: Usando phpMyAdmin (Recomendado)

1. Abrir navegador en: **http://localhost/phpmyadmin**
2. Click en **"Nueva"** en el panel izquierdo
3. Nombre de base de datos: `sistema_tthh`
4. Cotejamiento: `utf8mb4_unicode_ci`
5. Click en **"Crear"**

### Opción B: Usando SQL directo

1. En phpMyAdmin, ir a la pestaña **SQL**
2. Copiar y pegar el contenido de `database/schema_completo.sql`
3. Click en **"Continuar"**

---

## 📝 Paso 3: Ejecutar Script SQL

### Método 1: Importar archivo SQL

1. En phpMyAdmin, seleccionar la base de datos `sistema_tthh`
2. Click en la pestaña **"Importar"**
3. Click en **"Seleccionar archivo"**
4. Navegar a: `C:\SISTEMA_TTHH_V2\database\schema_completo.sql`
5. Click en **"Continuar"**

### Método 2: Ejecutar desde línea de comandos

```bash
# Navegar a la carpeta de XAMPP
cd C:\xampp\mysql\bin

# Ejecutar script
mysql -u root -p sistema_tthh < C:\SISTEMA_TTHH_V2\database\schema_completo.sql
```

---

## ✅ Paso 4: Verificar Tablas Creadas

En phpMyAdmin:

1. Seleccionar base de datos `sistema_tthh`
2. Deberías ver las siguientes tablas:

```
✅ empleados
✅ recibos_salario
✅ solicitudes
✅ formacion_academica
✅ cursos_capacitaciones
✅ certificaciones_profesionales
✅ idiomas
✅ habilidades
✅ plan_desarrollo
✅ capacitaciones_internas
✅ inscripciones_capacitacion
✅ movimientos_empleado
✅ asistencias
✅ comunicados
✅ auditoria
✅ ausencias
```

**Total: 16 tablas**

---

## ⚙️ Paso 5: Configurar Spring Boot

### Archivo: `backend-java/src/main/resources/application.yml`

Ya está configurado con:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/sistema_tthh
    username: root
    password: 
    driver-class-name: com.mysql.cj.jdbc.Driver
```

### Notas Importantes:

1. **Usuario**: `root` (por defecto en XAMPP)
2. **Contraseña**: vacía (por defecto en XAMPP)
3. **Puerto**: 3306 (MySQL)
4. **Base de datos**: `sistema_tthh`

---

## 🔧 Paso 6: Configurar pom.xml

Verificar que el `pom.xml` tenga la dependencia de MySQL:

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

---

## 🚀 Paso 7: Iniciar Backend

```bash
cd backend-java
./mvnw clean install
./mvnw spring-boot:run
```

### Verificar Conexión:

Si ves en los logs:

```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
Initialized JPA EntityManagerFactory for persistence unit 'default'
```

✅ **¡Conexión exitosa!**

---

## 🧪 Paso 8: Probar Conexión

### Test 1: Verificar empleado de prueba

En phpMyAdmin, ejecutar:

```sql
SELECT * FROM empleados;
```

Deberías ver el empleado `Admin TTHH` creado automáticamente.

### Test 2: Probar API

```bash
curl -X GET http://localhost:8080/api/v1/empleados
```

---

## 📊 Vistas Creadas

El script crea 3 vistas útiles:

1. **v_empleados_activos**: Empleados activos con información resumida
2. **v_solicitudes_pendientes**: Solicitudes pendientes con días de antigüedad
3. **v_certificaciones_por_vencer**: Certificaciones que vencen en 60 días

### Consultar vistas:

```sql
SELECT * FROM v_empleados_activos;
SELECT * FROM v_solicitudes_pendientes;
SELECT * FROM v_certificaciones_por_vencer;
```

---

## 🔒 Seguridad (Producción)

### Para producción, cambiar:

1. **Crear usuario específico:**

```sql
CREATE USER 'tthh_user'@'localhost' IDENTIFIED BY 'password_seguro';
GRANT ALL PRIVILEGES ON sistema_tthh.* TO 'tthh_user'@'localhost';
FLUSH PRIVILEGES;
```

2. **Actualizar application.yml:**

```yaml
spring:
  datasource:
    username: tthh_user
    password: password_seguro
```

---

## 🐛 Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"

**Solución:**
```sql
-- En phpMyAdmin, ejecutar:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
```

### Error: "Unknown database 'sistema_tthh'"

**Solución:**
- Verificar que la base de datos existe en phpMyAdmin
- Ejecutar el script SQL nuevamente

### Error: "Table doesn't exist"

**Solución:**
- Verificar que el script SQL se ejecutó completamente
- Revisar logs de phpMyAdmin por errores

### Error: "Communications link failure"

**Solución:**
- Verificar que MySQL esté corriendo en XAMPP
- Verificar puerto 3306 disponible
- Reiniciar MySQL en XAMPP

---

## 📈 Optimización

### Índices Creados:

El script crea índices automáticos en:
- Claves primarias (id)
- Claves foráneas (empleado_id, etc.)
- Campos de búsqueda frecuente (numero_documento, email, estado)
- Campos de filtrado (departamento, sucursal, tipo)

### Triggers Creados:

1. **trg_after_inscripcion_insert**: Actualiza cupo disponible
2. **trg_after_inscripcion_delete**: Restaura cupo disponible

---

## 📝 Datos de Prueba

El script incluye datos de ejemplo:

1. **Empleado**: Admin TTHH
   - Usuario: admin.tthh@coopreducto.com
   - Número socio: SOC001

2. **Comunicado**: Bienvenida al sistema

### Agregar más datos de prueba:

```sql
-- Insertar más empleados
INSERT INTO empleados (numero_documento, nombres, apellidos, email, fecha_ingreso, cargo, departamento, estado)
VALUES ('87654321', 'Juan', 'Pérez', 'juan.perez@coopreducto.com', '2024-02-01', 'Desarrollador', 'TI', 'ACTIVO');

-- Insertar solicitud
INSERT INTO solicitudes (empleado_id, tipo, titulo, descripcion, estado)
VALUES (1, 'VACACIONES', 'Vacaciones Diciembre', 'Solicito vacaciones del 20 al 31 de diciembre', 'PENDIENTE');
```

---

## ✅ Checklist de Instalación

- [ ] XAMPP instalado y corriendo
- [ ] MySQL iniciado (puerto 3306)
- [ ] Base de datos `sistema_tthh` creada
- [ ] Script SQL ejecutado sin errores
- [ ] 16 tablas creadas correctamente
- [ ] 3 vistas creadas
- [ ] 2 triggers creados
- [ ] Datos de prueba insertados
- [ ] application.yml configurado
- [ ] Backend Spring Boot conecta exitosamente
- [ ] Prueba de API exitosa

---

## 📚 Recursos Adicionales

- **phpMyAdmin**: http://localhost/phpmyadmin
- **MySQL Logs**: `C:\xampp\mysql\data\mysql_error.log`
- **Spring Boot Logs**: `backend-java/logs/sistema-tthh.log`

---

**¡Base de datos lista para usar!** 🎉
